from django.db import models

class Product(models.Model):
    WIG = "wig"
    BUNDLE = "bundle"
    ACCESSORY = "accessory"

    CATEGORY_CHOICES = [
        (WIG, "Wig"),
        (BUNDLE, "Bundle"),
        (ACCESSORY, "Accessory"),
    ]

    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default=WIG)

    texture = models.CharField(max_length=80, blank=True)   # Body Wave
    length = models.CharField(max_length=40, blank=True)    # 20"
    lace = models.CharField(max_length=80, blank=True)      # HD Lace
    color = models.CharField(max_length=80, blank=True)     # 1B

    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="products/", blank=True, null=True)

    is_featured = models.BooleanField(default=False)
    in_stock = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

