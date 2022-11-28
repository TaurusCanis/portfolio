from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializers import (
    UserSerializer, CustomerSerializer, AppointmentSerializer, PaymentSerializer,
    AppointmentNoteSerializer
)
from .models import (
    Customer, Appointment, Payment, AppointmentNote
)
from django.db.models import F
from decimal import Decimal
from django.core.mail import send_mail
import datetime

from django.contrib.auth import get_user_model
User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` and `retrieve` actions.
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes_by_action = {
        "default": [IsAuthenticated],
        "create": [AllowAny],
    }

    def get_permissions(self):
        try:
            # return permission_classes depending on `action`
            return [
                permission()
                for permission in self.permission_classes_by_action[self.action]
            ]
        except KeyError:
            # action is not set return default permission_classes
            return [
                permission()
                for permission in self.permission_classes_by_action["default"]
            ]

    def get_object(self):
        return self.request.user

class CustomerViewSet(viewsets.ModelViewSet):
    """
    CRUD actions for Customer objects/querysets
    """
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.customers.filter(**self.request.query_params.dict()).order_by('last_name')

    def create(self, serializer):
        return super().create(serializer)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, pk=None):
        obj = self.get_object()
        if obj.user.id == self.request.user.id:
            return super().update(request)
        return Response(status=status.HTTP_400_BAD_REQUEST) # How to return Error in DRF?

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Formatting keys/values to exclude (when necessary) Appointments that have an associated 
    # AppointmentNote alreay created 
    def format_key(self, key, value):
        if value in ["null", "None"]:
            return f'{key}__isnull'
        return key

    def format_value(self, value):
        if value in ["null", "None"]:
            return True 
        return value

    def get_queryset(self):
        query_args = { self.format_key(key, value): self.format_value(value) for key, value in self.request.query_params.items() } 
        return Appointment.objects.filter(customer__user=self.request.user, **query_args).order_by('date_time')

    def get_customer(self, customer_id):
        customer = Customer.objects.get(id=customer_id)
        return customer

    def perform_create(self, serializer):
        customer = self.get_customer(self.request.data.get('customer'))
        appointment_status = self.request.data.get('status')
        if appointment_status == 'C' or appointment_status == 'X-C':
            fee_delta = self.request.data.get('customer')
            self.update_customer_current_balance(fee_delta, customer=customer)
        serializer.save(customer=customer)

    def perform_update(self, serializer):
        fee_delta = self.get_fee_delta(serializer.instance)
        self.update_customer_current_balance(fee_delta, serializer.instance)
        serializer.save()

    def get_fee_delta(self, instance):
        old_fee = instance.fee
        if self.request.data.get('fee') is not None:
            new_fee = Decimal(self.request.data.get('fee'))
        else: 
            new_fee = 0
        old_status = instance.status
        new_status = self.request.data.get('status')
        fee_delta = 0
        if (old_status == 'S' or old_status == 'X-N') and (new_status == 'C' or new_status == 'X-C'):
            fee_delta = old_fee 
        elif old_status == 'C' or old_status == 'X-C':
            if new_status == 'S' or new_status == 'X-N':
                fee_delta = -old_fee 
            elif old_fee != new_fee:
                fee_delta = new_fee - old_fee
        return fee_delta

    def perform_destroy(self, instance):
        fee_delta = -instance.fee
        self.update_customer_current_balance(fee_delta, instance)
        super().perform_destroy(instance)

    def update_customer_current_balance(self, fee_delta, instance=None, customer=None):
        customer = self.get_customer(instance.customer_id)
        customer.current_balance = F('current_balance') + fee_delta
        customer.save()

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(customer__user=self.request.user).order_by('date') 

    def get_customer(self, customer_id):
        customer = Customer.objects.get(id=customer_id)
        return customer

    def perform_create(self, serializer):
        payment_delta = -Decimal(self.request.data.get('amount'))
        customer_id = self.request.data.get('customer')
        self.update_customer_balance(payment_delta, customer_id)
        serializer.save()

    def perform_update(self, serializer):
        payment_delta = Decimal(serializer.instance.amount) - Decimal(self.request.data.get('amount'))
        customer_id = self.request.data.get('customer')
        self.update_customer_balance(payment_delta, customer_id)
        serializer.save() 

    def perform_destroy(self, instance):
        payment_delta = instance.amount
        self.update_customer_balance(payment_delta, instance.customer.id)
        super().perform_destroy(instance)

    def update_customer_balance(self, payment_delta, customer_id):
        customer = self.get_customer(customer_id)
        customer.current_balance = F('current_balance') + payment_delta
        customer.save()

class AppointmentNoteViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentNoteSerializer 
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return AppointmentNote.objects.get(id=self.kwargs.get('pk'))
    
    def retrieve(self, request, *args, **kwargs):
        appointment = self.get_appointment({ "appointment_notes": self.kwargs.get('pk') })
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)

    def get_queryset(self):
        return AppointmentNote.objects.filter(appointment__customer__user=self.request.user)

    def get_appointment(self, kwargs):
        return Appointment.objects.get(**kwargs)

    def perform_create(self, serializer):
        appointment = self.get_appointment({ "id": self.request.data.get('appointment') })
        serializer.save(appointment=appointment)
        return

    @action(detail=True, methods=['post'])
    def send_appointment_note_email(self, request, *args, **kwargs):
        appointment = self.get_appointment({ "appointment_notes": self.kwargs.get('pk') })
        try:
            send_mail(
                f'Session Summary - {appointment.__str__()}',
                f'{appointment.appointment_notes.first().text}',
                'tauruscanisrex@gmail.com',
                [f'{appointment.customer.email_primary}'],
                fail_silently=False,
            )
            self.update_appointment_note_details()
            return Response()
        except Exception as e:
            print("Email failed to send: ", e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def update_appointment_note_details(self):
        appointment_note = self.get_object()
        appointment_note.status='C'
        appointment_note.date_sent=datetime.datetime.now()
        appointment_note.save()
        return
