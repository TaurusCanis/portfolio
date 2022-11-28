import datetime

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, User
from rest_framework import serializers

from .models import (
    Appointment, Customer, Payment, AppointmentNote
)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    accounts_receivable = serializers.ReadOnlyField(source='get_accounts_receivable_total')
    earned_revenue_current_month = serializers.ReadOnlyField(source='get_earned_revenue_current_month')
    expected_revenue_next_thirty_days = serializers.ReadOnlyField(source='get_expected_revenue_next_thirty_days')
    next_appointment = serializers.SerializerMethodField()
    upcoming_appointments_this_week = serializers.SerializerMethodField()
    completed_appointments_this_week = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name', 'accounts_receivable', 'earned_revenue_current_month', 
        'expected_revenue_next_thirty_days', 'next_appointment', 'upcoming_appointments_this_week',
        'completed_appointments_this_week']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def get_next_appointment(self, user):
        return AppointmentSerializer(user.get_next_appointment()).data

    def get_current_week(self):
        today = datetime.date.today()
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

class AppointmentNoteSerializer(serializers.ModelSerializer):
    # appointment = serializers.SerializerMethodField()

    class Meta:
        model = AppointmentNote
        fields = '__all__'

    # def get_appointment(self, appointment_note):
        # return AppointmentSerializer(appointment_note.appointment).data


class AppointmentSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.__str__')
    customer_id = serializers.ReadOnlyField(source='customer.id')
    appointment_note = AppointmentNoteSerializer(source='get_appointment_note', required=False)
    
    class Meta:
        model = Appointment
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')
    last_appointment = AppointmentSerializer(source='get_last_appointment', required=False) #serializers.JSONField(source='get_last_appointment') 
    next_appointment = AppointmentSerializer(source='get_next_appointment', required=False) #serializers.JSONField(source='get_next_appointment') 

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




