from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from ecommerce_backend.models import (
    Item, ItemVariant, Order, OrderItem, Address, Customer, Payment
)
from ecommerce_backend.serializers import (
    ItemSerializer, ItemVariantSerializer, OrderSerializer,
    OrderItemSerializer, AddressSerializer, CustomerSerializer,
    PaymentSerializer
)
import uuid, os, stripe
from rest_framework.exceptions import PermissionDenied

stripe.api_key = os.environ.get("STRIPE_SK_TEST") 
endpoint_secret = os.environ.get("STRIPE_ENDPOINT_SECRET_TEST")
# DOMAIN_BASE = "http://localhost:3000/"

class ItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Items to be viewed.
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def get_queryset(self):
        qs = Item.objects.all()
        return qs

    def get_object(self):
        obj = Item.objects.get(id=self.kwargs.get('pk'))
        return obj

class ItemVariantViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users ItemVariants to be viewed.
    """
    queryset = ItemVariant.objects.all()
    serializer_class = ItemVariantSerializer
    lookup_field = "item_id"

class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows orders to be viewed or edited.
    """
    authentication_classes = []
    permission_classes = []
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = "session_id"

    def list(self, *args, **kwargs):
        if not self.request.user.is_staff:
            raise PermissionDenied(detail="List of Orders is only accessible to Staff.")
        super().list(*args, **kwargs)

    def get_object(self):
        order = super().get_object()
        self.update_total(order)
        return order

    def update_total(self, order):
        order.grand_total=order.get_total()
        order.save()

    """
    These functions handle order CREATION.
    """
    def perform_create(self, serializer):
        try:
            session_id = self.create_session_id()
            order_item = self.create_order_item(session_id)
            serializer.save(session_id=session_id,items=[order_item])
        except Exception as e:
            print("Exception: ", e)
            return 

    def create_session_id(self):
        return uuid.uuid4()

    def create_order_item(self, session_id):
        return OrderItem.objects.create(
            session_id=session_id,
            quantity=self.request.data.get('quantity'),
            item=self.get_item_variant(self.request.data.get('variant_id'))
        )

    def get_item_variant(self, item_variant_id):
        return ItemVariant.objects.get(id=item_variant_id)

    """
    These functions handle order UPDATE.
    """
    def perform_update(self, serializer):
        session_id = self.request.data.get('sessionId')
        order = self.get_object()

        if "variant_id" in self.request.data:
            variant_id = int(self.request.data.get('variant_id'))
            self.update_order_items(session_id, variant_id, order)

        if "customer_info" in self.request.data:
            self.create_customer_details(serializer)

    def update_order_items(self, session_id, variant_id, order):
        if variant_id in [order_item.item.id for order_item in order.items.all()]:
            quantity = int(self.request.data.get('quantity'))
            order_item_qs = OrderItem.objects.filter(session_id=session_id, item_id=variant_id)
            if quantity == 0:
                self.delete_order_item(order_item_qs[0])
            else:
                order_item_qs.update(quantity=quantity) 
        else:
            order_item = self.create_order_item(session_id)
            order.items.add(order_item) 
            order.save()

    def delete_order_item(self, order_item):
        order_item.delete()

    """
    These functions handle order's customer details CREATE.
    """
    def create_customer_details(self, serializer):
        customer = self.create_customer(self.request.data.get('customer_info'))
        shipping_address = self.create_address("S", customer, self.request.data.get('shippingAddress'))
        billing_address = self.create_address('B', customer, self.request.data.get('billingAddress'))
        serializer.save(
            customer=customer,
            shipping_address=shipping_address,
            billing_address=billing_address
        )

    def create_customer(self, customer_info):
        return Customer.objects.create(
            first_name=customer_info['first_name'],
            last_name=customer_info['last_name'],
            email_address=customer_info['email_address'],
            phone_number=customer_info['phone_number'],
        )

    def create_address(self, address_type, customer, address_info):
        return Address.objects.create(
            customer = customer,
            street_address = address_info['street_address'],
            apartment_address = address_info['apartment_address'],
            city = address_info['city'],
            state = address_info['state'],
            zip = address_info['zip'],
            address_type = address_type,
        )

class OrderItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    authentication_classes = []
    permission_classes = []

    def list(self, *args, **kwargs):
        if not self.request.user.is_staff:
            raise PermissionDenied(detail="List of OrderItems is only accessible to Staff.")
        super().list(*args, **kwargs)

class CustomerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows customers to be viewed or edited.
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    authentication_classes = []
    permission_classes = []

    def list(self, *args, **kwargs):
        if not self.request.user.is_staff:
            raise PermissionDenied(detail="List of Customers is only accessible to Staff.")
        super().list(*args, **kwargs)

    def retrieve(self, *args, **kwargs):
        if not self.request.user.is_staff:
            raise PermissionDenied(detail="OrderItems are only accessible to Staff.")
        super().list(*args, **kwargs)

class AddressViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows addresses to be viewed or edited.
    """
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    authentication_classes = []
    permission_classes = []

    def list(self, *args, **kwargs):
        if not self.request.user.is_staff:
            raise PermissionDenied(detail="List of Addresses is only accessible to Staff.")
        super().list(*args, **kwargs)

    def retrieve(self, *args, **kwargs):
        if not self.request.user.is_staff:
            raise PermissionDenied(detail="Addresses are only accessible to Staff.")
        super().list(*args, **kwargs)
        
class PaymentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows payments to be viewed or edited.
    """
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class StripePaymentIntent(APIView):
    permission_classes = []
    http_method_names = ['post']

    def post(self, *args, **kwargs):
        try:
            data = self.request.data
            session_id = self.kwargs.get('session_id')
            # Create a PaymentIntent with the order amount and currency
            intent = stripe.PaymentIntent.create(
                amount=self.calculate_order_amount(session_id),
                currency='usd',
                automatic_payment_methods={
                    'enabled': True,
                },
                # idempotency_key=session_id,
            )
            order = self.get_order(session_id)
            order.braintree_transaction_id=intent['id'] 
            order.save()
            return Response({
                'success': True,
                'clientSecret': intent['client_secret']
            })
        except Exception as e:
            print("FAILURE - EXCEPTION: ", e)
            return Response({
                "success": False,
                "message": e,
            })


    def get_order(self, session_id):
        return Order.objects.get(session_id=session_id) 

    def to_stripe_currency_format(self, value):
        return int(float(value) * 100)

    def calculate_order_amount(self, session_id):
        return self.to_stripe_currency_format(self.get_order(session_id).grand_total)

class StripeWebhook(APIView):
    permission_classes = []
    http_method_names = ['post']

    def post(self, *args, **kwargs):
        payload = self.request.body.decode('utf-8')

        if endpoint_secret:
            event = self.verify_event(payload) 
            return self.handle(event)
        else:
            try:
                return self.handle(payload)
            except Exception as e:
                print('⚠️  Webhook error while parsing basic request.' + str(e))
                return Response({"success": False})

    def verify_event(self, payload):
        # Only verify the event if there is an endpoint secret defined
        # Otherwise use the basic event deserialized with json
        sig_header = self.request.headers.get('Stripe-Signature')
        try:
            return stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except stripe.error.SignatureVerificationError as e:
            print('⚠️  Webhook signature verification failed.' + str(e))
            # return Response({"success":False})
            raise e

    def handle(self, event):
        if event and event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']  # contains a stripe.PaymentIntent
            print('Payment for {} succeeded'.format(payment_intent['amount']))
            # Then define and call a method to handle the successful payment intent.
            self.handle_payment_intent_succeeded(event)
        elif event['type'] == 'payment_intent.payment_failed':
            payment_method = event['data']['object']  # contains a stripe.PaymentMethod
            # Then define and call a method to handle the successful attachment of a PaymentMethod.
            self.handle_payment_intent_failed(payment_method)
            return Response({"success": False})
        else:
            # Unexpected event type
            print('Unhandled event type {}'.format(event['type']))
        return Response({"success": True})

    def handle_payment_intent_succeeded(self, event):
        updated_order = self.update_order_details(event)
        self.email_receipt(updated_order.ref_code, updated_order.customer.email_address)

    def handle_payment_intent_failed(self, payment_intent):
        return

    def update_order_details(self, event):
        order = self.get_order(event['data']['object']['id'])
        order.update(
            ref_code = self.create_confirmation_number(),
            ordered = True,
            ordered_date = datetime.date.today(),
            payment = self.create_payment(
                event['id'], 
                event['data']['object']['amount'], 
                order[0].customer, 
                order[0].session_id
            )
        )
        return order[0]

    def get_order(self, stripe_intent_id):
        return Order.objects.filter(braintree_transaction_id=stripe_intent_id)

    def create_confirmation_number(self):
        return uuid.uuid4()

    def create_payment(self, event_id, amount, customer, session_id):
        return Payment.objects.create(
            stripe_payment_id=event_id,
            customer=customer,
            session_id=session_id, 
            amount=amount,
        )

    def email_receipt(self, confirmation_number, email_address):
        try:
            send_mail(
                'Order Confirmation - TaurusCanis Rex',
                f'Thank you for your order! Your confirmation number is: ${confirmation_number}.',
                'tauruscanisrex@gmail.com',
                [f'{email_address}'],
                fail_silently=False,
            )
        except Exception as e:
            print("Email failed to send: ", e)
            return 

    
