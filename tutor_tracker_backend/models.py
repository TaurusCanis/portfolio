from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Q, Sum
import datetime, calendar
from django.conf import settings
from decimal import Decimal

class TutorTrackerUser(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="tutor_tracker_user", on_delete=models.CASCADE)

    def get_date_today(self):
        return datetime.datetime.now()

    def get_last_day_of_month(self, today):
        month_range = calendar.monthrange(today.year, today.month)
        return datetime.date(today.year, today.month, month_range[1])

    def get_accounts_receivable_total(self):
        return Customer.objects.filter(user=self).aggregate(Sum('current_balance'))['current_balance__sum'] or 0
        # return (Appointment.objects.filter(Q(status='C') | Q(status='X-C'), customer__user__user=self).aggregate(Sum('fee'))['fee__sum'] or 0) # - (Payment.objects.filter(customer__user=self).aggregate(Sum('amount'))['amount__sum'] or 0)

    def get_earned_revenue_current_month(self):
        today = self.get_date_today()
        return Appointment.objects.filter(Q(status='C') | Q(status='X-C'), customer__user=self, date_time__gte=today.date().replace(day=1), date_time__lte=self.get_last_day_of_month(today)).aggregate(Sum('fee'))['fee__sum'] or 0

    def get_expected_revenue_next_thirty_days(self):
        today = self.get_date_today()
        return Appointment.objects.filter(status='S', date_time__gte=today, date_time__lte=today + datetime.timedelta(days=30), customer__user=self).aggregate(Sum('fee'))['fee__sum'] or 0

    def get_next_appointment(self):
        return Appointment.objects.filter(customer__user=self, date_time__gte=self.get_date_today()).order_by("date_time").first()


class Customer(models.Model):
    user = models.ForeignKey(TutorTrackerUser, related_name='customers', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    current_balance = models.DecimalField(default=0.00, decimal_places=2, max_digits=9)
    is_active = models.BooleanField(default=True)
    email_primary = models.EmailField(default="acdole09@gmail.com")
    prepayment_balance = models.DecimalField(default=0.00, decimal_places=2, max_digits=9)

    def __str__(self):
        return self.last_name + ", " + self.first_name

    # def get_current_balance(self):
    #     return 0.0

    def get_last_appointment(self):
        print("&&&&&&&&")
        return self.appointments.filter(date_time__lte=datetime.datetime.now()).order_by('date_time').first() or None
    
    def get_next_appointment(self):
        return self.appointments.filter(date_time__gte=datetime.datetime.now()).order_by('-date_time').first() or None

    def get_todays_appointments(self):
        return Appointment.objects.get(customer__user__user=self.request.user,date_time__gte=today,date_time__lte=today)


class Appointment(models.Model):
    customer = models.ForeignKey(Customer, related_name='appointments', on_delete=models.CASCADE)
    status = models.CharField(max_length=3, default='S', choices=[('S', 'scheduled'), ('C', 'completed'), ('X-N', 'cancelled, no charge'), ('X-C', 'cancelled, charge')])
    date_time = models.DateTimeField()
    length = models.DecimalField(default=1.00, decimal_places=2, max_digits=9)
    fee = models.DecimalField(default=180.00, decimal_places=2, max_digits=9)
    #location = ...

    class Meta:
        ordering = ['-date_time']

    def __str__(self):
        return self.customer.__str__() + ": " + str(self.date_time) # .isoformat().split("T")[0]

    def get_appointment_note(self):
        try:
            return self.appointment_notes.get(appointment=self)
        except:
            return None

    def get_invoice(self):
        try:
            return self.invoice.get(appointment=self)
        except:
            return None

class Payment(models.Model):
    customer = models.ForeignKey(Customer, related_name='payments', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    source = models.CharField(max_length=100, choices=[('PB', 'Prepaid Balance'), ('C','Cash'), ('V','Venmo'), ('CC', 'Credit Card')], default='C')

    def __str__(self):
        return f'Payment - {self.customer} - {self.date}'

class AppointmentNote(models.Model):
    appointment = models.ForeignKey(Appointment, related_name="appointment_notes", on_delete=models.CASCADE)
    text = models.CharField(max_length=10000, blank=True, null=True)
    status = models.CharField(max_length=1, choices=[('I', 'In Progress'), ('S', 'Sent')], default='I')
    date_created = models.DateTimeField(auto_now_add=True)
    date_last_action = models.DateField(auto_now=True)
    date_sent = models.DateField(blank=True, null=True)

    def __str__(self):
        return f'Appointment Note - {self.appointment.customer.__str__()} - {self.appointment.date_time}'

class Invoice(models.Model):
    appointment = models.ForeignKey(Appointment, related_name="invoice", on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    sent = models.BooleanField(default=False)

    def __str__(self):
        return f'Invoice - {self.appointment}'

class Statement(models.Model):
    customer = models.ForeignKey(Customer, related_name='statements', on_delete=models.CASCADE)
    previous_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    incurred_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    balance_due = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    appointments = models.ManyToManyField(Appointment, blank=True, null=True)
    payments = models.ManyToManyField(Payment, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    date_sent = models.DateField(blank=True, null=True)

    def __str__(self):
        return f'Statement for {self.customer} - {self.start_date} - {self.end_date}'

    def get_payment_totals(self):
        return self.payments.aggregate(total_payments=Sum('amount'))['total_payments'] or 0.00

        
class Prepayment(models.Model):
    customer = models.ForeignKey(Customer, related_name='prepayments', on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)