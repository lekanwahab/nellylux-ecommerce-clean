from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "category", "is_featured", "in_stock", "created_at")
    list_filter = ("category", "is_featured", "in_stock")
    search_fields = ("name", "slug", "texture", "lace", "color")
    prepopulated_fields = {"slug": ("name",)}

