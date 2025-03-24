from django.urls import path
from .views import (
    EventListView,
    EventDetailView,
    EventCreateView,
    EventUpdateView,
    EventDeleteView,
    ClubEventsView,
)
from .views import EventInventoryView, EventInventoryCreateView, EventInventoryDeleteView, InventoryItemCreateView, InventoryItemUpdateView, InventoryItemDeleteView

app_name = 'myevents'

urlpatterns = [
    # Event CRUD operations
    path('events/', EventListView.as_view(), name='event-list'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('events/create/', EventCreateView.as_view(), name='event-create'),
    path('events/<int:pk>/update/', EventUpdateView.as_view(), name='event-update'),
    path('events/<int:pk>/delete/', EventDeleteView.as_view(), name='event-delete'),
    
    # Club specific routes
    path('clubs/<int:club_id>/events/', ClubEventsView.as_view(), name='club-events'),

    # Event Inventory
    path('events/<int:event_id>/inventory/', EventInventoryView.as_view(), name='event-inventory'),
    path('events/<int:event_id>/inventory/create/', EventInventoryCreateView.as_view(), name='event-inventory-create'),
    path('events/<int:event_id>/inventory/items/create/', InventoryItemCreateView.as_view(), name='inventory-item-create'),
    path('events/inventory/items/update/<int:pk>/', InventoryItemUpdateView.as_view(), name='inventory-item-update'),
    path('events/inventory/delete/<int:pk>/', EventInventoryDeleteView.as_view(), name='inventory-delete'),
]