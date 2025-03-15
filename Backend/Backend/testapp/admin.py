from django.contrib import admin
from .models import TestModel, Election, Position, Candidate, Vote  # Import your models

# Alternative way to register models
admin.site.register(TestModel)
admin.site.register(Election)
admin.site.register(Position)
admin.site.register(Candidate)
admin.site.register(Vote)