from django.contrib import admin
from .models import (
    TutorTrackerUser, Customer, Appointment, Payment, AppointmentNote,
    Invoice, Statement, Prepayment
)

admin.site.register(TutorTrackerUser)
admin.site.register(Customer)
admin.site.register(Appointment)
admin.site.register(Payment)
admin.site.register(AppointmentNote)
admin.site.register(Invoice)
admin.site.register(Statement)
admin.site.register(Prepayment)
