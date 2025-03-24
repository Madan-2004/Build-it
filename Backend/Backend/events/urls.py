from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import EventListView
from .views import EventDetailView
from .views import EventCreateView
from .views import EventUpdateView
from .views import EventDeleteView
from .views import ClubEventsView
from .views import EventInventoryView, EventInventoryCreateView, EventInventoryDeleteView, InventoryItemCreateView, InventoryItemUpdateView, InventoryItemDeleteView

urlpatterns = [
    # Event CRUD operations
    path('events/', EventListView.as_view(), name='event-list'),
    path("events/<int:pk>/", EventDetailView.as_view(), name="event-detail"),  # Add this line
    path('clubs/<int:club_id>/events/', ClubEventsView.as_view(), name='club-events'),  # Add this line

    # New Routes
    path("events/create/", EventCreateView.as_view(), name="event-create"),
    path("events/update/<int:pk>/", EventUpdateView.as_view(), name="event-update"),
    path("events/delete/<int:pk>/", EventDeleteView.as_view(), name="event-delete"),

    # Event Inventory
    path('events/<int:event_id>/inventory/', EventInventoryView.as_view(), name='event-inventory'),
    path('events/<int:event_id>/inventory/create/', EventInventoryCreateView.as_view(), name='event-inventory-create'),
    path('events/<int:event_id>/inventory/items/create/', InventoryItemCreateView.as_view(), name='inventory-item-create'),
    path('events/inventory/items/update/<int:pk>/', InventoryItemUpdateView.as_view(), name='inventory-item-update'),
    path('events/inventory/delete/<int:pk>/', EventInventoryDeleteView.as_view(), name='inventory-delete'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)