from django.urls import path
from . import views


urlpatterns = [
	path('', views.home, name='home'),
	path('list/', views.EventList.as_view(), name='event-list'),
    path('search-options/', views.SearchOptionsList.as_view(), name='search-options'),
]
