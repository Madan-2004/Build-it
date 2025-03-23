from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework import serializers
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Event, Club, EventCategory
from .serializers import EventListSerializer, EventDetailSerializer
from django.utils import timezone

class EventListView(generics.ListAPIView):
    """List all events with filtering and search capabilities"""
    serializer_class = EventListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'categories']
    search_fields = ['title', 'description', 'location', 'fees']
    ordering_fields = ['start_date', 'end_date', 'created_at', 'title']

    def get_queryset(self):
        queryset = Event.objects.all()
        
        # Filter by date range if provided
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if start_date:
            queryset = queryset.filter(start_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(end_date__lte=end_date)
            
        # Filter by event timing
        timing = self.request.query_params.get('timing', None)
        now = timezone.now()
        
        if timing == 'upcoming':
            queryset = queryset.filter(start_date__gt=now)
        elif timing == 'ongoing':
            queryset = queryset.filter(start_date__lte=now, end_date__gte=now)
        elif timing == 'past':
            queryset = queryset.filter(end_date__lt=now)
            
        return queryset.order_by('-start_date')

class EventDetailView(generics.RetrieveAPIView):
    """Retrieve a specific event"""
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        
        # Add additional context
        data['is_past'] = instance.is_past_event
        data['is_upcoming'] = instance.is_upcoming_event
        data['is_ongoing'] = instance.is_ongoing_event
        
        return Response(data)

class EventCreateView(generics.CreateAPIView):
    """Create a new event"""
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Validate date range
        if serializer.validated_data['start_date'] > serializer.validated_data['end_date']:
            raise serializers.ValidationError({"end_date": "End date must be after start date"})
        serializer.save()

class EventUpdateView(generics.UpdateAPIView):
    """Update an existing event"""
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        # Validate date range
        if serializer.validated_data.get('start_date') and serializer.validated_data.get('end_date'):
            if serializer.validated_data['start_date'] > serializer.validated_data['end_date']:
                raise serializers.ValidationError({"end_date": "End date must be after start date"})
        serializer.save()

class EventDeleteView(generics.DestroyAPIView):
    """Delete an event"""
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

class ClubEventsView(generics.ListAPIView):
    """List all events for a specific club"""
    serializer_class = EventListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'categories']
    search_fields = ['title', 'description', 'location', 'fees']
    ordering_fields = ['start_date', 'end_date', 'created_at', 'title']
    
    def get_queryset(self):
        club_id = self.kwargs.get('club_id')
        club = get_object_or_404(Club, pk=club_id)
        
        # Apply same filtering as EventListView
        queryset = Event.objects.filter(club=club)
        
        timing = self.request.query_params.get('timing', None)
        now = timezone.now()
        
        if timing == 'upcoming':
            queryset = queryset.filter(start_date__gt=now)
        elif timing == 'ongoing':
            queryset = queryset.filter(start_date__lte=now, end_date__gte=now)
        elif timing == 'past':
            queryset = queryset.filter(end_date__lt=now)
            
        return queryset.order_by('-start_date')