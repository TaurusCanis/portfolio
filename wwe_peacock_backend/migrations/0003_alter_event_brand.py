# Generated by Django 4.1.3 on 2023-04-05 20:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wwe_peacock_backend', '0002_alter_event_brand'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='brand',
            field=models.ManyToManyField(blank=True, null=True, to='wwe_peacock_backend.brand'),
        ),
    ]
