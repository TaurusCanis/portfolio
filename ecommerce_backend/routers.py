from rest_framework import routers
from ecommerce_backend import views

router = routers.DefaultRouter()
router.register(r'items', views.ItemViewSet)
router.register(r'itemvariants', views.ItemVariantViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'orderitems', views.OrderItemViewSet)
# router.register(r'refunds', views.RefundViewSet)
router.register(r'addresses', views.AddressViewSet)
# router.register(r'mailinglistsubscribers', views.MailingListSubscriberViewSet)
# router.register(r'coupons', views.CouponViewSet)
router.register(r'customers', views.CustomerViewSet)
# router.register(r'payments', views.PaymentViewSet)