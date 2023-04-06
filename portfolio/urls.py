"""portfolio URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.shortcuts import render
from homepage import views as homepage_view
from ecommerce_backend import routers as ecommerce_router
from tutor_tracker_backend import routers as tracker_router
from test_prep_backend import routers as test_prep
from rest_framework.authtoken import views

def render_react_ecommerce(request, *args, **kwargs):
    return render(request, "ecommerce-index.html")

def render_react_tracker(request, *args, **kwargs):
    return render(request, "tracker-index.html")

def render_react_testprep(request, *args, **kwargs):
    return render(request, "testprep-index.html")

def render_react_restaurant(request, *args, **kwargs):
    return render(request, "restaurant-index.html")

def render_react_wwe(request, *args, **kwargs):
    return render(request, "wwe-index.html")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', homepage_view.IndexView.as_view()),
    path('ecommerce-api/', include(ecommerce_router.router.urls)),
    path('ecommerce-api/', include('ecommerce_backend.urls')),
    path('tracker-api/', include(tracker_router.router.urls)),
    path('tracker-api/', include('tutor_tracker_backend.urls')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path(r'^ecommerce/(.*/)?$', render_react_ecommerce),
    re_path(r'^tracker/(.*/)?$', render_react_tracker),
    re_path(r'^testprep/(.*/)?$', render_react_testprep),
    re_path(r'^restaurant/(.*/)?$', render_react_restaurant),
    re_path(r'^wwe/(.*/)?$', render_react_wwe),
    path('test-prep-api/', include(test_prep.router.urls)),
    path('test-prep-api/', include('test_prep_backend.urls')),
    path('wwe-peacock-api/', include('wwe_peacock_backend.urls')),
]
