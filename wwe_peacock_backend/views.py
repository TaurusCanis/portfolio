from django.shortcuts import render
from django.http import HttpResponse
from .models import (
	Event, City, EventName
)
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import EventSerializer, CitySerializer, EventNameSerializer
import json
from django.apps import apps
import importlib

APP_NAME = "wwe_peacock_backend"

def home(request):
	return HttpResponse("HOME")

class SearchOptionsList(APIView):
	def get_model_name(self, field_name):
		if "-" in field_name:
			field_name = field_name.split("-")
			field_name = field_name[0] + field_name[1].capitalize()
		return apps.get_model(f"{APP_NAME}.{field_name}")
	
	def get_serializer_class(self, model_name): 
		serializer_class_name = f"{model_name}Serializer"
		serializers = importlib.import_module(".serializers", "wwe_peacock_backend")
		return getattr(serializers, serializer_class_name)

	def serialize_data(self, field_name):
		model = self.get_model_name(field_name)
		serializer_class = self.get_serializer_class(model.__name__)
		query_set = model.objects.all()
		return serializer_class(query_set, many=True).data

	def get(self, request, format=None):
		fields = json.loads(self.request.GET.get('fields'))
		search_options_list = { field_name: self.serialize_data(field_name) for field_name in fields }

		return Response(search_options_list)

class EventList(generics.ListAPIView):
	serializer_class = EventSerializer

	def get_queryset(self, *args, **kwargs):
		query_params = self.request.GET.dict()

		# Need to adjust querydict keys to match model field names
		if "event-name" in query_params:
			query_params["name__name"] = query_params.pop('event-name')

		# city name is referenced through the venue name on the event model
		if "city" in query_params:
			query_params["venue__city__name"] = query_params.pop('city')

		if "venue" in query_params:
			query_params["venue__name"] = query_params.pop('venue')

		return Event.objects.filter(**query_params)