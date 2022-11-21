from django.urls import include, path, re_path

from . import views
from ecommerce_backend.views import StripePaymentIntent, StripeWebhook

app_name = 'ecommerce_backend'
urlpatterns = [
    path('create-payment-intent/<str:session_id>/', StripePaymentIntent.as_view(), name='create-stripe-checkout-session'),
    path('stripe-webhook/', StripeWebhook.as_view(), name='stripe-webhook'),
] 