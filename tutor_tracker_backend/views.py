from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializers import (
    CustomerSerializer, AppointmentSerializer, PaymentSerializer,
    AppointmentNoteSerializer, TutorTrackerUserSerializer, InvoiceSerializer,
    StatementSerializer, PrepaymentSerializer
)
from .models import (
    Customer, Appointment, Payment, AppointmentNote, TutorTrackerUser, Invoice,
    Statement, Prepayment
)
from django.db.models import F, Sum, Q
from decimal import Decimal
from django.core.mail import send_mail
import datetime
from django.conf import settings


from django.contrib.auth import get_user_model
User = get_user_model()

class TutorTrackerUserViewSet(viewsets.ModelViewSet):
    serializer_class = TutorTrackerUserSerializer
    queryset = TutorTrackerUser.objects.all()
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

    # Create a new User using AUTH_USER_MODEL
    def create_user(self):
        return User.objects.create_user(**self.request.data)

    # Create a new TutorTrackerUser
    def create(self, request, *args, **kwargs):
        user = self.create_user()
        data = self.request.data
        data['user'] = user.id
        serializer = self.get_serializer(data=data)
        print("serializer.is_valid(): ", serializer.is_valid())
        print("serializer.errors: ", serializer.errors)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # Save relationship to new AUTH_USER_MODEL instance
    def perform_create(self, serializer, user):
        serializer.save(user=user)

    def get_object(self):
        return TutorTrackerUser.objects.get(user=self.request.user)

class CustomerViewSet(viewsets.ModelViewSet):
    """
    CRUD actions for Customer objects/querysets
    """
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Customer.objects.filter(user__user=self.request.user, **self.request.query_params.dict()).order_by('last_name')
        # return self.request.user.tutor_tracker_user.customers.filter(**self.request.query_params.dict()).order_by('last_name')

    def create(self, serializer):
        return super().create(serializer)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user.tutor_tracker_user.first())

    def update(self, request, pk=None):
        obj = self.get_object()
        if obj.user.user.id == self.request.user.id:
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
        print("QUERY ARGS: ", query_args)
        return Appointment.objects.filter(customer__user__user=self.request.user, **query_args).order_by('date_time')

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

    @action(detail=False, methods=['post'])
    def filter_appointments(self, request, *args, **kwargs):
        print(request.data)
        filter_args = { key: value for key, value in request.data.items() if value != None}
        if "start_date" in filter_args:
            start_date = filter_args.pop("start_date")
            filter_args['date_time__gte'] = start_date
        if "end_date" in filter_args:
            end_date = filter_args.pop("end_date")
            filter_args['date_time__lte'] = end_date
        if "appointment_notes__status" in filter_args:
            if filter_args['appointment_notes__status'] == 'X':
                value = filter_args.pop("appointment_notes__status")
                filter_args[self.format_key('appointment_notes__status', value)] = self.format_value(None)
        return Response(AppointmentSerializer(Appointment.objects.filter(**filter_args), many=True).data)

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(customer__user__user=self.request.user).order_by('date') 

    def get_customer(self, customer_id):
        customer = Customer.objects.get(id=customer_id)
        return customer

    def perform_create(self, serializer):
        amount = Decimal(self.request.data.get('amount'))
        payment_delta = -amount
        customer_id = self.request.data.get('customer')
        self.update_customer_balance(payment_delta, customer_id, self.request.data.get('source'))
        serializer.save()

    def perform_update(self, serializer):
        payment_delta = Decimal(serializer.instance.amount) - Decimal(self.request.data.get('amount'))
        customer_id = self.request.data.get('customer')
        self.update_customer_balance(payment_delta, customer_id, serializer.instance.source)
        serializer.save() 

    def perform_destroy(self, instance):
        payment_delta = instance.amount
        self.update_customer_balance(payment_delta, instance.customer.id, instance.source)
        super().perform_destroy(instance)

    def update_customer_balance(self, payment_delta, customer_id, payment_source):
        customer = self.get_customer(customer_id)
        new_prepayment_balance = F('prepayment_balance') + payment_delta
        new_current_balance = F('current_balance') + payment_delta
        if payment_source == 'PB':
            if new_prepayment_balance < 0:
                new_current_balance += new_prepayment_balance
                new_prepayment_balance = 0
            else:
                customer.prepayment_balance = new_prepayment_balance
        customer.current_balance = new_current_balance
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
        return AppointmentNote.objects.filter(appointment__customer__user__user=self.request.user)

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
        appointment_note.status='S'
        appointment_note.date_sent=datetime.datetime.now()
        appointment_note.save()
        return

class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer 
    permission_classes = [permissions.IsAuthenticated]
  
    def get_queryset(self):
        return Invoice.objects.filter(appointment__customer__user__user=self.request.user)

    def update_invoice_details(self):
        invoice = self.get_object()
        invoice.sent=True
        invoice.save()
        return

    @action(detail=True, methods=['post'])
    def send_invoice_email(self, request, *args, **kwargs):
        invoice = self.get_object()
        try:
            send_mail(
                f'Invoice - {invoice.__str__()}',
                f'{invoice.appointment.customer}\n'
                f'{invoice.date}\n'
                f'{invoice.amount}',
                'tauruscanisrex@gmail.com',
                [f'{invoice.appointment.customer.email_primary}'],
                fail_silently=False,
            )
            self.update_invoice_details()
            return Response()
        except Exception as e:
            print("Email failed to send: ", e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

class StatementViewSet(viewsets.ModelViewSet):
    serializer_class = StatementSerializer 
    permission_classes = [permissions.IsAuthenticated]

    def get_customer(self):
        return Customer.objects.get(id=self.request.data.get('customer'))

    def get_appointments(self, customer):
        return Appointment.objects.filter(
            Q(status='C') | Q(status='X-C'),
            customer=customer, 
            date_time__gte=self.request.data.get('start_date'),
            date_time__lte=self.request.data.get('end_date'),
        )

    def get_payments(self, customer):
        return Payment.objects.filter(
            customer=customer,  
            date__gte=self.request.data.get('start_date'),
            date__lte=self.request.data.get('end_date')
        )

    def perform_create(self, serializer):
        statement_data = self.get_statement_data()
        serializer.save(
            appointments=statement_data['appointments'],
            payments=statement_data['payments'],
            incurred_charges=statement_data['incurred_charges'],
            balance_due=statement_data['balance_due'],
            previous_balance=statement_data['previous_balance']
        )
  
    def get_queryset(self):
        return Statement.objects.filter(customer__user__user=self.request.user)

    def get_statement_data(self):
        customer = self.get_customer()
        appointments = self.get_appointments(customer)
        payments = self.get_payments(customer)
        incurred_charges = self.get_incurred_charges(appointments)
        previous_balance = self.get_previous_balance(customer)
        total_payments = self.get_total_payments(payments)
        balance_due = self.get_balance_due(previous_balance, incurred_charges, total_payments)
        return {
            "appointments": appointments,
            "payments": payments,
            "incurred_charges": incurred_charges,
            "balance_due": balance_due,
            "previous_balance": previous_balance
        }

    def update_statement_details(self):
        statement = self.get_object()
        statement.sent=True
        statement.save()
        return

    def get_incurred_charges(self, appointments):
        return appointments.aggregate(total_fees=Sum('fee'))['total_fees'] or 0

    def get_total_payments(self, payments):
        return payments.aggregate(total_payments=Sum('amount'))['total_payments'] or 0.00

    def get_balance_due(self, previous_balance, incurred_charges, total_payments):
        return Decimal(previous_balance) + Decimal(incurred_charges) - Decimal(total_payments) or 0

    def get_previous_balance(self, customer):
        try:
            return customer.statements.order_by("-end_date").first().balance_due
        except:
            return 0

    @action(detail=True, methods=['post'])
    def send_statement_email(self, request, *args, **kwargs):
        statement = self.get_object()
        try:
            send_mail(
                f'Statement - {statement.__str__()}',
                f'{statement.customer}\n'
                f'{statement.start_date} - {statement.end_date}\n'
                f'{statement.balance_due}',
                'tauruscanisrex@gmail.com',
                [f'{statement.customer.email_primary}'],
                fail_silently=False,
            )
            self.update_statement_details()
            return Response()
        except Exception as e:
            print("Email failed to send: ", e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

class PrepaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PrepaymentSerializer 
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Prepayment.objects.filter(customer__user__user=self.request.user)

    def get_customer(self, customer_id):
        return Customer.objects.get(id=customer_id)

    def perform_create(self, serializer):
        print("SERIALIZER: ", serializer.validated_data)
        self.update_customer(serializer.validated_data)
        serializer.save()

    def update_customer(self, serializer):
        customer = self.get_customer(serializer['customer'].id)
        customer.prepayment_balance += Decimal(serializer['amount'])
        customer.save()
