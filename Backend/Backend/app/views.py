from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Council, Club, User, ClubMembership
from .serializers import CouncilSerializer, ClubSerializer, UserSerializer

# Get all councils
@api_view(['GET'])
def get_councils(request):
    councils = Council.objects.all()
    serializer = CouncilSerializer(councils, many=True)
    return Response(serializer.data)

# Get a single council by ID
@api_view(['GET'])
def get_council_detail(request, council_id):
    council = get_object_or_404(Council, id=council_id)
    serializer = CouncilSerializer(council)
    return Response(serializer.data)

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
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete a council
@api_view(['DELETE'])
def delete_council(request, council_id):
    council = get_object_or_404(Council, id=council_id)
    council.delete()
    return Response({"message": "Council deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# Fetch clubs belonging to a specific council
def clubs_by_council(request, council_name):
    print(council_name)
    council = get_object_or_404(Council, name=council_name)
    clubs = Club.objects.filter(council=council)
    serializer = ClubSerializer(clubs, many=True)
    data = {
        "council": council.name,
        "clubs": serializer.data
        # "clubs": list(clubs.values("id", "name", "head", "description", "members", "projects"))
    }
    return JsonResponse(data)

# CRUD operations for clubs under a specific council
@api_view(['GET', 'POST'])
def clubs_by_council_crud(request, council_name):
    print(council_name)
    try:
        council = Council.objects.get(name=council_name)
    except Council.DoesNotExist:
        return Response({'error': 'Council not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        clubs = Club.objects.filter(council=council)
        serializer = ClubSerializer(clubs, many=True)
        return Response({
            'council': council.name,
            'clubs': serializer.data
        })

    elif request.method == 'POST':
        head_id = request.data.get("head")
        member_ids = request.data.get("members", [])
        head = None
        if head_id:
            head = get_object_or_404(User, id=head_id)
        club_data = {**request.data, "council": council.id, "head": head.id if head else None}
        serializer = ClubSerializer(data=club_data)
        if serializer.is_valid():
            club = serializer.save()

            # Add members
            for member_id in member_ids:
                member = get_object_or_404(User, id=member_id)
                ClubMembership.objects.create(user=member, club=club, status="member")

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET', 'PUT', 'DELETE'])
# def club_crud(request, council_name, club_id):
#     council = get_object_or_404(Council, name=council_name)
#     club = get_object_or_404(Club, council=council, pk=club_id)

#     if request.method == 'GET':
#         serializer = ClubSerializer(club)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         print(request.data)
#         data = {**request.data, 'council': council.id}  
#         serializer = ClubSerializer(club, data=data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         club.delete()
#         return Response({"message": "Club deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
@api_view(["GET", "PUT", "DELETE"])
def club_crud(request, council_name, club_id):
    council = get_object_or_404(Council, name=council_name)
    club = get_object_or_404(Club, council=council, pk=club_id)

    if request.method == "GET":
        serializer = ClubSerializer(club)
        return Response(serializer.data)

    elif request.method == "PUT":
        print(request.data)
        head_id = request.data.get("head")
        member_ids = request.data.get("members", [])

        # Validate the head user
        head = None
        if head_id:
            head = get_object_or_404(User, id=head_id)

        # Update club details
        club_data = {**request.data, "council": council.id, "head": head.id if head else None}
        serializer = ClubSerializer(club, data=club_data, partial=True)

        if serializer.is_valid():
            club = serializer.save()

            # Update members
            ClubMembership.objects.filter(club=club).delete()  # Clear existing members
            for member_id in member_ids:
                member = get_object_or_404(User, id=member_id)
                ClubMembership.objects.create(user=member, club=club, status="member")

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        club.delete()
        return Response({"message": "Club deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
@api_view(["GET"])
def get_club_by_name(request, club_name):
    club = get_object_or_404(Club, name=club_name)
    serializer = ClubSerializer(club)
    return Response(serializer.data)    