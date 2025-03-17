from rest_framework import viewsets
from .models import Asset
from .serializers import AssetSerializer

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all().order_by('-uploaded_at')
    serializer_class = AssetSerializer