import datetime

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, User
from rest_framework import serializers
from django.db.models import Sum, Q

from .models import (
    Appointment, Customer, Payment, AppointmentNote, TutorTrackerUser, Invoice, Statement, Prepayment
)

from user_auth.serializers import UserSerializer

User = get_user_model()

class TutorTrackerUserSerializer(serializers.ModelSerializer):
    accounts_receivable = serializers.ReadOnlyField(source='get_accounts_receivable_total')
    earned_revenue_current_month = serializers.ReadOnlyField(source='get_earned_revenue_current_month')
    expected_revenue_next_thirty_days = serializers.ReadOnlyField(source='get_expected_revenue_next_thirty_days')
    next_appointment = serializers.SerializerMethodField()
    upcoming_appointments_this_week = serializers.SerializerMethodField()
    completed_appointments_this_week = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    todays_appointments = serializers.SerializerMethodField()
    undocumented_appointments = serializers.SerializerMethodField()
    scheduled_appointments = serializers.SerializerMethodField()
    revenue_this_week = serializers.SerializerMethodField()
    revenue_this_month = serializers.SerializerMethodField()
    revenue_this_year = serializers.SerializerMethodField()
    payments_received_this_week = serializers.SerializerMethodField()
    payments_received_this_month = serializers.SerializerMethodField()
    payments_received_this_year = serializers.SerializerMethodField()

    class Meta:
        model = TutorTrackerUser
        fields = '__all__'
        # depth = 1
        # fields = ['username', 'password', 'email', 'first_name', 'last_name', 'accounts_receivable', 'earned_revenue_current_month', 
        # 'expected_revenue_next_thirty_days', 'next_appointment', 'upcoming_appointments_this_week',
        # 'completed_appointments_this_week']
        # extra_kwargs = {'password': {'write_only': True}}

    # def create(self, validated_data):
    #     return TutorTrackerUser.objects.create_user(**validated_data)

    def get_revenue_this_year(self, user):
        year = self.get_today().year
        return Appointment.objects.filter(
            customer__user=user,
            date_time__gte=datetime.datetime(year, 1, 1, 0, 0, 0),
            status__in=['C', 'X-C']).aggregate(
                revenue_this_year=Sum('fee')
            )['revenue_this_year'] or 0

    def get_revenue_this_month(self, user):
        today = self.get_today()
        year = today.year 
        month = today.month
        return Appointment.objects.filter(
            customer__user=user,
            date_time__gte=datetime.datetime(year, month, 1, 0, 0, 0),
            status__in=['C', 'X-C']).aggregate(
                revenue_this_year=Sum('fee')
            )['revenue_this_year'] or 0

    def get_revenue_this_week(self, user):
        today = self.get_today()
        year = today.year 
        month = today.month
        start = today.day - today.weekday()
        return Appointment.objects.filter(
            customer__user=user,
            date_time__gte=datetime.datetime(year, month, start, 0, 0, 0),
            status__in=['C', 'X-C']).aggregate(
                revenue_this_year=Sum('fee')
            )['revenue_this_year'] or 0

    def get_payments_received_this_year(self, user):
        year = self.get_today().year
        return Payment.objects.filter(
            customer__user=user,
            date__gte=datetime.date(year, 1, 1)).aggregate(
                payments_received_this_year=Sum('amount')
            )['payments_received_this_year'] or 0

    def get_payments_received_this_month(self, user):
        today = self.get_today()
        year = today.year 
        month = today.month
        return Payment.objects.filter(
            customer__user=user,
            date__gte=datetime.date(year, month, 1)).aggregate(
                payments_received_this_month=Sum('amount')
            )['payments_received_this_month'] or 0

    def get_payments_received_this_week(self, user):
        today = self.get_today()
        year = today.year 
        month = today.month
        start = today.day - today.weekday()
        return Payment.objects.filter(
            customer__user=user,
            date__gte=datetime.date(year, month, start)).aggregate(
                payments_received_this_week=Sum('amount')
            )['payments_received_this_week'] or 0

    def get_user(self, tutor_tracker_user):
        return UserSerializer(tutor_tracker_user.user).data

    def get_next_appointment(self, user):
        return AppointmentSerializer(user.get_next_appointment()).data

    def get_today(self):
        return datetime.date.today()

    def get_current_week(self):
        today = self.get_today()
        start = today - datetime.timedelta(days=today.weekday())
        end = start + datetime.timedelta(days=6)
        return [start, end]

    def get_upcoming_appointments_this_week(self, user):
        week_range = self.get_current_week()
        return AppointmentSerializer(
            Appointment.objects.filter(
                customer__user=user, 
                status='S', 
                date_time__gte=week_range[0], 
                date_time__lte=week_range[1]
            ).order_by('date_time'), many=True).data
    
    def get_completed_appointments_this_week(self, user):
        week_range = self.get_current_week()
        return AppointmentSerializer(
            Appointment.objects.exclude(status='S').filter(
                customer__user=user, 
                date_time__gte=week_range[0], 
                date_time__lte=week_range[1]
            ), many=True).data

    def get_todays_appointments(self, user):
        today = self.get_today()
        start = datetime.datetime(today.year, today.month, today.day, 0, 0, 0)
        end = datetime.datetime(today.year, today.month, today.day, 23, 59, 59)
        return AppointmentSerializer(Appointment.objects.filter(customer__user=user,date_time__gte=start, date_time__lte=end), many=True).data

    def get_undocumented_appointments(self, user):
        return AppointmentSerializer(Appointment.objects.filter(Q(appointment_notes__status='I') | Q(appointment_notes=None), customer__user=user).exclude(status='S'), many=True).data

    def get_scheduled_appointments(self, user):
        return AppointmentSerializer(Appointment.objects.filter(customer__user=user,status='S'),many=True).data

class AppointmentNoteSerializer(serializers.ModelSerializer):
    # appointment = serializers.SerializerMethodField()

    class Meta:
        model = AppointmentNote
        fields = '__all__'

    # def get_appointment(self, appointment_note):
        # return AppointmentSerializer(appointment_note.appointment).data


class InvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='appointment.customer.__str__')

    class Meta:
        model = Invoice 
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.__str__')
    customer_id = serializers.ReadOnlyField(source='customer.id')
    customer = serializers.SerializerMethodField()
    appointment_note = AppointmentNoteSerializer(source='get_appointment_note', required=False)
    invoice = InvoiceSerializer(source='get_invoice', required=False)
    
    class Meta:
        model = Appointment
        fields = '__all__'

    def get_customer(self, appointment):
        print(appointment.customer)
        return CustomerSerializer(appointment.customer).data

class CustomerSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')
    # last_appointment = AppointmentSerializer(source='get_last_appointment', required=False) #serializers.JSONField(source='get_last_appointment') 
    # next_appointment = AppointmentSerializer(source='get_next_appointment', required=False) #serializers.JSONField(source='get_next_appointment') 

    class Meta:
        model = Customer
        fields = '__all__'

    def get_last_appointment(self, customer):
        return AppointmentSerializer(customer.get_last_appointment()).data

class PaymentSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.__str__')

    class Meta:
        model = Payment 
        fields = '__all__'

class StatementSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.__str__')
    payment_totals = serializers.ReadOnlyField(source='get_payment_totals')
    appointments = AppointmentSerializer(many=True, required=False)
    payments = PaymentSerializer(many=True, required=False)

    class Meta:
        model = Statement 
        fields = '__all__'

class PrepaymentSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.__str__')

    class Meta:
        model = Prepayment 
        fields = '__all__'





