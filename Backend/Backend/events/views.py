from rest_framework import generics, filters,status
from .models import Event, Agenda, Speaker
from .serializers import EventSerializer
from rest_framework.response import Response
from rest_framework.views import APIView


class EventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'venue']
    ordering_fields = ['date', 'title', 'venue']

class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class EventCreateView(generics.CreateAPIView):
    """ New View to Create an Event """
    queryset = Event.objects.all()
    serializer_class = EventSerializer

import json

class EventUpdateView(generics.UpdateAPIView):
    """ Update an Event with Partial Data (Works like Add Event) """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = "pk"

class EventDeleteView(APIView):
    """ New View to Delete an Event """
    def delete(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        
        event.delete()
        return Response({"message": "Event deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
class ClubEventsView(generics.ListAPIView):
    """ View to list events based on club ID """
    serializer_class = EventSerializer

    def get_queryset(self):
        club_id = self.kwargs['club_id']
        return Event.objects.filter(club_id=club_id)m