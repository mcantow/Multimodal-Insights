from operator import index
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import webSpeechExample_render, tool_render, home_render, instructions_render, webgazer_example, train_gazefilter


urlpatterns = [
    path("", home_render),
    path("webSpeechExample/", webSpeechExample_render),
    path("tool/", tool_render),
    path("instructions/", instructions_render),
    path("webgazer/", webgazer_example),
    path("train/gazefilter", train_gazefilter),
    path("admin/", admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT, show_indexes=True)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT, show_indexes=True)