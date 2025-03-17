from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import EventListView
from .views import EventDetailView
from .views import EventCreateView
from .views import EventUpdateView
from .views import EventDeleteView

urlpatterns = [
    path('events/', EventListView.as_view(), name='event-list'),
    path("events/<int:pk>/", EventDetailView.as_view(), name="event-detail"),  # Add this line
    
    # New Routes
    path("events/create/", EventCreateView.as_view(), name="event-create"),
    path("events/update/<int:pk>/", EventUpdateView.as_view(), name="event-update"),
    path("events/delete/<int:pk>/", EventDeleteView.as_view(), name="event-delete"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)