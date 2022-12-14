# Generated by Django 4.1.3 on 2022-12-11 00:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tutor_tracker_backend', '0004_invoice'),
    ]

    operations = [
        migrations.CreateModel(
            name='Statement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('previous_balance', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('incurred_charges', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('balance_due', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('date_sent', models.DateField()),
                ('appointments', models.ManyToManyField(blank=True, null=True, to='tutor_tracker_backend.appointment')),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='statements', to='tutor_tracker_backend.customer')),
                ('payments', models.ManyToManyField(blank=True, null=True, to='tutor_tracker_backend.payment')),
            ],
        ),
    ]
