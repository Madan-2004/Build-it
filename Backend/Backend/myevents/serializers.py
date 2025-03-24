from rest_framework import serializers
from .models import Event, EventCategory
from app.serializers import ClubSerializer
from app.models import Club

class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = ['id', 'name']

class EventListSerializer(serializers.ModelSerializer):
    club = ClubSerializer(read_only=True)
    club_id = serializers.PrimaryKeyRelatedField(
        queryset=Club.objects.all(),
        write_only=True,
        source='club',
        required=False,
        allow_null=True
    )
    categories = EventCategorySerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'location', 'start_date', 'end_date',
            'image', 'status', 'status_display', 'club', 'club_id',
            'categories', 'created_at', 'updated_at', 'register_link',
            'fees', 'contact', 'pdf'
        ]

class EventDetailSerializer(serializers.ModelSerializer):
    club = ClubSerializer(read_only=True)
    club_id = serializers.PrimaryKeyRelatedField(
        queryset=Club.objects.all(),
        write_only=True,
        source='club',
        required=False,
        allow_null=True
    )
    categories = EventCategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=EventCategory.objects.all(),
        write_only=True,
        source='categories',
        many=True,
        required=False
    )
    is_past_event = serializers.BooleanField(read_only=True)
    is_upcoming_event = serializers.BooleanField(read_only=True)
    is_ongoing_event = serializers.BooleanField(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'location', 'start_date', 'end_date',
            'image', 'status', 'status_display', 'club', 'club_id',
            'categories', 'category_ids', 'is_past_event', 'is_upcoming_event',
            'is_ongoing_event', 'created_at', 'updated_at', 'register_link',
            'fees', 'contact', 'pdf'
        ]
    
    def create(self, validated_data):
        # Extract categories if present
        categories = validated_data.pop('categories', [])
        
        # Create the event
        event = Event.objects.create(**validated_data)
        
        # Add categories
        if categories:
            event.categories.set(categories)
            
        return event
    
    def update(self, instance, validated_data):
        # Extract categories if present
        categories = validated_data.pop('categories', None)
        
        # Update the event fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        
        # Update categories if provided
        if categories is not None:
            instance.categories.set(categories)
            
        return instance

from rest_framework import serializers
from .models import EventInventory, InventoryItemEvents

class InventoryItemEventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItemEvents
        fields = ["id", "name", "quantity", "cost", "consumable"]

class EventInventorySerializer(serializers.ModelSerializer):
    items = InventoryItemEventsSerializer(many=True, read_only=True)
    event_name = serializers.CharField(source='event.title', read_only=True)  # Include event name

    class Meta:
        model = EventInventory
        fields = ["id", "event_name", "budget_allocated", "budget_used", "items", "remaining_budget"]