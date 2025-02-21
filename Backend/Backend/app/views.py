from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Council, Club
from .serializers import CouncilSerializer, ClubSerializer
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

# Get all councils
@api_view(['GET'])
def get_councils(request):
    councils = Council.objects.all()
    serializer = CouncilSerializer(councils, many=True)
    return Response(serializer.data)

# Get a single council by ID
@api_view(['GET'])
def get_council_detail(request, council_id):
    try:
        council = Council.objects.get(id=council_id)
        serializer = CouncilSerializer(council)
        return Response(serializer.data)
    except Council.DoesNotExist:
        return Response({"error": "Council not found"}, status=404)

# Get all clubs
@api_view(['GET'])
def get_clubs(request):
    clubs = Club.objects.all()
    serializer = ClubSerializer(clubs, many=True)
    return Response(serializer.data)

# Create a new council (POST request)
@api_view(['POST'])
def create_council(request):
    serializer = CouncilSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# Delete a council
@api_view(['DELETE'])
def delete_council(request, council_id):
    try:
        council = Council.objects.get(id=council_id)
        council.delete()
        return Response({"message": "Council deleted successfully"}, status=204)
    except Council.DoesNotExist:
        return Response({"error": "Council not found"}, status=404)

def clubs_by_council(request, council_id):
    """Fetch all clubs belonging to a specific council."""
    council = get_object_or_404(Council, id=council_id)
    clubs = Club.objects.filter(council=council)

    data = {
        "council": council.name,
        "clubs": list(clubs.values("id", "name", "head", "description", "members", "projects"))
    }
    return JsonResponse(data)