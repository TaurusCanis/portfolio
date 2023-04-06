from rest_framework import serializers
from .models import Event, City, EventName

class CitySerializer(serializers.Serializer):
	name = serializers.CharField(max_length=200)

class EventNameSerializer(serializers.Serializer):
	name = serializers.CharField(max_length=200)

class VenueSerializer(serializers.Serializer):
	name = serializers.CharField(max_length=200)

class EventSerializer(serializers.ModelSerializer):
	name = serializers.StringRelatedField()
	venue = serializers.StringRelatedField()
	city = serializers.SerializerMethodField()
	
	class Meta:
		model = Event
		fields = '__all__'

	def get_city(self, obj):
		return obj.venue.city.name
