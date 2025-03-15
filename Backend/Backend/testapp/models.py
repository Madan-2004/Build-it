from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class TestModel(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Election(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_elections')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return self.title


class Position(models.Model):
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='positions')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    max_candidates = models.PositiveIntegerField(default=1)
    max_votes_per_voter = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return f"{self.title} - {self.election.title}"


class Candidate(models.Model):
    position = models.ForeignKey(Position, on_delete=models.CASCADE, related_name='candidates')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='candidacies', null=True, blank=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    roll_no = models.CharField(max_length=50, default="Unknown Roll No")  # ✅ Default roll number
    degree = models.CharField(
        max_length=10,
        choices=[("BTech", "BTech"), ("MTech", "MTech"), ("PhD", "PhD")],
        default="BTech"
    )  # ✅ Added degree field with choices
    branch = models.CharField(max_length=100, default="CSE")  # ✅ Branch-based elections
    photo = models.ImageField(upload_to='candidates/', blank=True, null=True)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['position', 'name']

    def __str__(self):
        return f"{self.name or self.user.get_full_name()} - {self.position.title}"




class Vote(models.Model):
    voter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='votes')
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='votes')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['voter', 'candidate']

    def __str__(self):
        return f"{self.voter.username} voted for {self.candidate}"
