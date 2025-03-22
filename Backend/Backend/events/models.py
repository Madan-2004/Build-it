from django.db import models

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

    def __str__(self):
        return self.title


class Agenda(models.Model):
    event = models.ForeignKey(Event, related_name="agendas", on_delete=models.CASCADE)
    time = models.CharField(max_length=50)
    topic = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.event.title} - {self.topic}"


class Speaker(models.Model):
    event = models.ForeignKey(Event, related_name="speakers", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    bio = models.TextField()

    def __str__(self):
        return f"{self.name} ({self.event.title})"
