# Generated by Django 4.1.3 on 2022-12-11 00:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tutor_tracker_backend', '0005_statement'),
    ]

    operations = [
        migrations.AlterField(
            model_name='statement',
            name='date_sent',
            field=models.DateField(blank=True, null=True),
        ),
    ]