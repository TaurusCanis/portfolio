from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Q, Sum
import datetime, calendar

class User(AbstractUser):
    pass

    def get_date_today(self):
        return datetime.datetime.now()

    def get_last_day_of_month(self, today):
        month_range = calendar.monthrange(today.year, today.month)
        return datetime.date(today.year, today.month, month_range[1])

    def get_accounts_receivable_total(self):
        return Customer.objects.filter(user=self).aggregate(Sum('current_balance'))['current_balance__sum'] or 0
        # return (Appointment.objects.filter(Q(status='C') | Q(status='X-C'), customer__user=self).aggregate(Sum('fee'))['fee__sum'] or 0) # - (Payment.objects.filter(customer__user=self).aggregate(Sum('amount'))['amount__sum'] or 0)

    def get_earned_revenue_current_month(self):
        today = self.get_date_today()
        return Appointment.objects.filter(Q(status='C') | Q(status='X-C'), customer__user=self, date_time__gte=today.date().replace(day=1), date_time__lte=self.get_last_day_of_month(today)).aggregate(Sum('fee'))['fee__sum'] or 0

    def get_expected_revenue_next_thirty_days(self):
        today = self.get_date_today()
        return Appointment.objects.filter(status='S', date_time__gte=today, date_time__lte=today + datetime.timedelta(days=30), customer__user=self).aggregate(Sum('fee'))['fee__sum'] or 0

    def get_next_appointment(self):
        return Appointment.objects.filter(customer__user=self, date_time__gte=self.get_date_today()).order_by("date_time").first()

class Customer(models.Model):
    user = models.ForeignKey(User, related_name='customers', on_delete=models.CASCADE)
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
        print("***get_appointment_note***")
        try:
            return self.appointment_notes.get(appointment=self)
        except:
            return None

class Payment(models.Model):
    customer = models.ForeignKey(Customer, related_name='payments', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)

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