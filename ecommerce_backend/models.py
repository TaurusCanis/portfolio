from django.db import models
from django.shortcuts import reverse
from decimal import *

ADDRESS_CHOICES = {
    ('B', 'billing'),
    ('S', 'shipping'),
}

class Item(models.Model):
    title = models.CharField(max_length=100, blank=True, null=True)
    price = models.DecimalField(blank=True, null=True, max_digits=10, decimal_places=2)
    slug = models.SlugField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(blank=True, null=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("core:product", kwargs={
            'slug': self.slug
        })

    def get_add_to_cart_url(self):
        return reverse("core:add_to_cart", kwargs={
            'slug': self.slug
        })

    def remove_from_cart(self):
        return reverse("core:remove_from_cart", kwargs={
            'slug': self.slug
        })

class ItemVariant(models.Model):
    title = models.CharField(max_length=200)
    item = models.ForeignKey('Item', on_delete=models.CASCADE)
    retail_price = models.DecimalField(blank=True, null=True, max_digits=10, decimal_places=2)
    stripe_product_id = models.CharField(max_length=200,default=0)

    def __str__(self):
        return self.title

class OrderItem(models.Model):
    session_id = models.CharField(max_length=40, blank=True, null=True)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(ItemVariant, on_delete=models.CASCADE) #change from Item
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.item.title}"

    def get_item(self):
        return self.item

    def get_total_item_price(self):
        return self.quantity * self.item.retail_price

class Order(models.Model):
    id = models.AutoField(primary_key=True)
    customer = models.ForeignKey("Customer", on_delete=models.CASCADE, null=True, blank=True)
    ref_code = models.CharField(max_length=40, blank=True, null=True)
    session_id = models.CharField(max_length=40, blank=True, null=True)
    grand_total = models.CharField(max_length=100, blank=True, null=True)
    shipping_cost = models.CharField(max_length=100, blank=True, null=True)
    items = models.ManyToManyField(OrderItem, blank=True)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField(blank=True, null=True)
    ordered = models.BooleanField(default=False)
    billing_address = models.ForeignKey(
        "Address", related_name="billing_address", on_delete=models.SET_NULL, blank=True, null=True
    )
    shipping_address = models.ForeignKey(
        "Address", related_name="shipping_address", on_delete=models.SET_NULL, blank=True, null=True
    )
    payment = models.ForeignKey(
        "Payment", on_delete=models.SET_NULL, blank=True, null=True
    )
    being_delivered = models.BooleanField(default=False)
    received = models.BooleanField(default=False)
    refund_requested = models.BooleanField(default=False)
    refund_granted = models.BooleanField(default=False)

    # 1. Item added to cart
    # 2. Adding billing address
    # (Failed checkout)
    # 3. payment
    # (preprocessing, processing, packaging, etc.)
    # 4. Being delivered
    # 5. Received
    # 6. Refunds

    def __str__(self):
        return self.session_id

    def get_order_items(self):
        return self.items

    def get_subtotal(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_total_item_price()
        return round(total, 2)

    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_total_item_price()
        # if self.coupon:
        #     total -= Decimal(self.coupon.amount)
        if self.shipping_cost:
            total += Decimal(self.shipping_cost)
        return round(total, 2)

class Customer(models.Model):
    first_name = models.CharField(max_length=40, blank=True, null=True)
    last_name = models.CharField(max_length=40, blank=True, null=True)
    email_address = models.CharField(max_length=200, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.first_name + " " + self.last_name

class Address(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=40, blank=True, null=True)
    street_address = models.CharField(max_length=200)
    apartment_address = models.CharField(max_length=200,null=True,blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2, default="CT") #USStateField(default="CT")
    # country = CountryField(multiple=False)
    zip = models.CharField(max_length=100)
    address_type = models.CharField(max_length=1, choices=ADDRESS_CHOICES)
    default = models.BooleanField(default=False)

    # def __str__(self):
    #     return self.session_id

    class Meta:
        verbose_name_plural = 'Addresses'

class Payment(models.Model):
    stripe_payment_id = models.CharField(max_length=100, blank=True, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=40, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    # def __str__(self):
    #     return self.session_id
