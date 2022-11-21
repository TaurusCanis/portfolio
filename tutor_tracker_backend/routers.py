from rest_framework.routers import DefaultRouter
from tutor_tracker_backend import views

router = DefaultRouter()
router.register(r'customers', views.CustomerViewSet,basename="customer")
router.register(r'users', views.UserViewSet,basename="user")
router.register(r'appointments', views.AppointmentViewSet,basename="appointment")
# router.register(r'appointment_notes', views.AppointmentNoteViewSet,basename="appointment_note")
router.register(r'payments', views.PaymentViewSet,basename="payment")
# router.register(r'invoices', views.InvoiceViewSet,basename="invoice")
# router.register(r'statements', views.StatementViewSet,basename="statement")