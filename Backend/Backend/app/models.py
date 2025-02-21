from django.db import models

class Council(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="councils/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Club(models.Model):
    name = models.CharField(max_length=255)
    head = models.CharField(max_length=255)
    description = models.TextField()
    upcoming_events = models.TextField(blank=True, null=True)
    members = models.TextField()
    projects = models.TextField(blank=True, null=True)
    council = models.ForeignKey(Council, on_delete=models.CASCADE, related_name="clubs")

    def __str__(self):
        return self.name
