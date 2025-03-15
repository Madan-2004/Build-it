from django.db import models
from app.models import Users


class Election(models.Model):
    title = models.CharField(max_length=255)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    def __str__(self):
        return self.title


class Candidate(models.Model):
    email = models.EmailField()
    name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    election = models.ForeignKey(Election, on_delete=models.CASCADE)
    eligible_batches = models.JSONField(default=list)
    eligible_branches = models.JSONField(default=list)

    def __str__(self):
        return f"{self.name} - {self.position}"


class Vote(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    election = models.ForeignKey(Election, on_delete=models.CASCADE)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "election"], name="unique_user_election"
            )
        ]

    def __str__(self):
        return f"{self.user.email} voted for {self.candidate} in election {self.election.title}"
