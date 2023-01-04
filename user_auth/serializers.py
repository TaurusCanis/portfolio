import datetime

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, User
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        # fields = '__all__'
        fields = ['username', 'password', 'email', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    # def create(self, validated_data):
    #     return TutorTrackerUser.objects.create_user(**validated_data)