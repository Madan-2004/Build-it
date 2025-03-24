from django.db import models
from django.urls import reverse
from django.utils import timezone
from app.models import Club

class EventCategory(models.Model):
    name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Event Categories"

class Event(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='event_images/', blank=True, null=True)
    pdf = models.FileField(upload_to='event_pdfs/', blank=True, null=True) 
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    club = models.ForeignKey(Club, on_delete=models.SET_NULL, related_name='myevents', null=True, blank=True)
    categories = models.ManyToManyField(EventCategory, related_name='events', blank=True)
    register_link = models.URLField(blank=True, null=True, default="#")
    fees = models.CharField(max_length=255, default="Free Entry")
    contact = models.EmailField(default="info@iitindore.ac.in")
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('events:event-detail', kwargs={'pk': self.pk})
    
    @property
    def is_past_event(self):
        return self.end_date < timezone.now()
    
    @property
    def is_upcoming_event(self):
        return self.start_date > timezone.now()
    
    @property
    def is_ongoing_event(self):
        now = timezone.now()
        return self.start_date <= now <= self.end_date
class EventInventory(models.Model):
    """🔹 Inventory for Events"""
    event = models.OneToOneField(
        Event, on_delete=models.CASCADE, related_name="inventory"
    )
    budget_allocated = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    budget_used = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Inventory for Event: {self.event.title}"

    @property
    def remaining_budget(self):
        budget_allocated = float(self.budget_allocated)
        budget_used = float(self.budget_used)
        return self.budget_allocated - self.budget_used


class InventoryItemEvents(models.Model):
    """🔹 Inventory Items for Project and Event Inventories"""
    CONSUMABLE_CHOICES = [
        ('consumable', 'Consumable'),
        ('non_consumable', 'Non-Consumable'),
    ]

    event_inventory = models.ForeignKey(
        EventInventory, on_delete=models.CASCADE, related_name="items", null=True, blank=True
    )

    name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    consumable = models.CharField(max_length=15, choices=CONSUMABLE_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.consumable}) - {self.event_inventory.event.title}"

    @property
    def total_cost(self):
        """🔹 Calculate total cost of items"""
        return self.quantity * self.cost
