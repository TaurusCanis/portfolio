# Generated by Django 4.1.3 on 2022-12-01 17:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutor_tracker_backend', '0002_tutortrackeruser_alter_customer_user'),
    ]

    operations = [
        migrations.DeleteModel(
            name='User',
        ),
    ]