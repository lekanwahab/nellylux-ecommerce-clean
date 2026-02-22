from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        qs = Product.objects.all().order_by("-created_at")  # SHOW ALL (including out-of-stock)

        category = self.request.query_params.get("category")
        featured = self.request.query_params.get("featured")
        search = self.request.query_params.get("search")

        if category:
            qs = qs.filter(category=category)

        if featured == "true":
            qs = qs.filter(is_featured=True)

        if search:
            qs = qs.filter(name__icontains=search)

        return qs

class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    lookup_field = "slug"
    queryset = Product.objects.all()

