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