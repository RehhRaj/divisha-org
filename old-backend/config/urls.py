from django.urls import path

from core import views

urlpatterns = [
    path("api/message/", views.message),
    path("api/health/", views.health),
]
