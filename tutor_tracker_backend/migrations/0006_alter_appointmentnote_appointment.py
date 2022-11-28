# Generated by Django 4.1.3 on 2022-11-28 00:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tutor_tracker_backend', '0005_appointmentnote'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointmentnote',
            name='appointment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appointment_notes', to='tutor_tracker_backend.appointment'),
        ),
    ]