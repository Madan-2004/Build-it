from django.db import models
from app.models import Club

class Event(models.Model):
    CATEGORY_CHOICES = [
        ("Technical", "Technical"),
        ("Cultural", "Cultural"),
        ("Sports", "Sports"),
        ("Workshops", "Workshops"),
    ]

    title = models.CharField(max_length=255)
    date = models.DateField()
    poster = models.ImageField(upload_to="event_posters/", default="event_posters/default.jpg")
    description = models.TextField()
    venue = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    register_link = models.URLField(blank=True, null=True, default="#")
    fees = models.CharField(max_length=255, default="Free Entry")
    schedule = models.CharField(max_length=255, default="TBD")
    contact = models.EmailField(default="info@iitindore.ac.in")
    club = models.ForeignKey(
        Club, on_delete=models.SET_NULL, null=True, blank=True, related_name="events"
    )  # ✅ Some events may not have a club

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-date']


class Agenda(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='agendas')
    time = models.CharField(max_length=50)  # Changed from TimeField to CharField
    topic = models.CharField(max_length=200)
    
    def __str__(self):
        return f"{self.event.title} - {self.topic}"
    
    class Meta:
        ordering = ['time']


class Speaker(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='speakers')
    name = models.CharField(max_length=100)
    bio = models.TextField()

    def __str__(self):
        return f"{self.name} ({self.event.title})"

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