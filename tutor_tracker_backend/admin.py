from django.contrib import admin
from .models import User, Customer, Appointment, Payment, AppointmentNote

admin.site.register(User)
admin.site.register(Customer)
admin.site.register(Appointment)
admin.site.register(Payment)
admin.site.register(AppointmentNote)
