from django.urls import path
from .views import EventListView
from .views import EventDetailView

urlpatterns = [
    path('events/', EventListView.as_view(), name='event-list'),
    path("events/<int:pk>/", EventDetailView.as_view(), name="event-detail"),  # Add this line
]
