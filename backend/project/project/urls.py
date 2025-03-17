from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/planner/', include('content_planner.urls')),
    path('api/assets/', include('smart_asset_organizer.urls')),  # placeholder
]