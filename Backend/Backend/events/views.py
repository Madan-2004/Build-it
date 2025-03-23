from rest_framework import generics, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Event, Agenda, Speaker
from .serializers import EventSerializer
import json
from django.core.exceptions import ValidationError

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
    """ Create a new Event with full validation """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = []

    def create(self, request, *args, **kwargs):
        try:
            print("Received Data:", json.dumps(request.data, indent=4))
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": "Failed to create event", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class EventUpdateView(generics.UpdateAPIView):
    """ Update an Event with Partial Data Support """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = "pk"

    def update(self, request, *args, **kwargs):
        try:
            print("Received Data for Update:", json.dumps(request.data, indent=4))
            partial = kwargs.pop('partial', True)  # Enable partial updates by default
            instance = self.get_object()
            
            # Handle empty or null agenda/speakers
            if 'agenda' in request.data and not request.data['agenda']:
                request.data['agenda'] = []
            if 'speakers' in request.data and not request.data['speakers']:
                request.data['speakers'] = []

            serializer = self.get_serializer(
                instance, 
                data=request.data, 
                partial=partial
            )
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            return Response(serializer.data)
        except Event.DoesNotExist:
            return Response(
                {"error": "Event not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except ValidationError as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": "Failed to update event", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class EventDeleteView(APIView):
    """ Delete an Event with proper error handling """
    def delete(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
            event.delete()
            return Response(
                {"message": "Event deleted successfully"}, 
                status=status.HTTP_204_NO_CONTENT
            )
        except Event.DoesNotExist:
            return Response(
                {"error": "Event not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Failed to delete event", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ClubEventsView(generics.ListAPIView):
    """ List events based on club ID with error handling """
    serializer_class = EventSerializer

    def get_queryset(self):
        club_id = self.kwargs['club_id']
        return Event.objects.filter(club_id=club_id)

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": "Failed to fetch club events", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )