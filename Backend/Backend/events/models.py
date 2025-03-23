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

    class Meta:
        ordering = ['name']