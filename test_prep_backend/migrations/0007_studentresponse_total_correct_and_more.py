# Generated by Django 4.1.3 on 2023-01-03 20:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_prep_backend', '0006_test_number_of_sections'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentresponse',
            name='total_correct',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='studentresponse',
            name='total_incorrect',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='studentresponse',
            name='total_omitted',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]