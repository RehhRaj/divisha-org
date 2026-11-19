from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path

from websites.api import api
from websites.platform_admin import platform_admin
from websites.views import panel, panel_index

urlpatterns = [
    path("platform-admin/", platform_admin.urls),
    path("panel/login/", LoginView.as_view(template_name="websites/login.html"), name="panel-login"),
    path("panel/logout/", LogoutView.as_view(next_page="panel-login"), name="panel-logout"),
    path("panel/", panel_index, name="panel-index"),
    path("panel/t/<slug:slug>/", panel, name="tenant-panel"),
    path("api/", api.urls),
]
