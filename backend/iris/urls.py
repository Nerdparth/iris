from django.contrib import admin
from django.urls import path
from organisation_api.views import organisation_api
from bots.views import bots_api, iframe
from authentication.views import auth_api
from django.shortcuts import render

def documentation(request):
    return render(request, "documentation/index.html")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', auth_api.urls),
    path('bot/', bots_api.urls),
    path('organisation/', organisation_api.urls),
    path('', documentation),
    path('chat/iframe/<uuid:organisation_id>/<uuid:bot_id>', iframe, name="iframe")
]