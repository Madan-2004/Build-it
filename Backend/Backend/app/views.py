from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Council, Club, User, ClubMembership
from .serializers import CouncilSerializer, ClubSerializer, UserSerializer
from django.db import transaction

# Get all councils
@api_view(['GET'])
def get_councils(request):
    councils = Council.objects.all()
    serializer = CouncilSerializer(councils, many=True)
    return Response(serializer.data)

# Get a single council by ID or name
@api_view(['GET'])
def get_council_detail(request, council_name):
    try:
        # Try getting by ID if council_name is a number
        if council_name.isdigit():
            council = get_object_or_404(Council, id=int(council_name))
        else:
            council = get_object_or_404(Council, name=council_name)
        
        serializer = CouncilSerializer(council)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

# Get all clubs
@api_view(['GET'])
def get_clubs(request):
    clubs = Club.objects.all()
    serializer = ClubSerializer(clubs, many=True)
    return Response(serializer.data)

# Create a new council
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
    try:
        council = get_object_or_404(Council, id=council_id)
        council.delete()
        return Response({"message": "Council deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# CRUD operations for clubs under a specific council
@api_view(['GET', 'POST'])
def clubs_by_council_crud(request, council_name):
    try:
        # Try getting by ID if council_name is a number
        if council_name.isdigit():
            council = get_object_or_404(Council, id=int(council_name))
        else:
            council = get_object_or_404(Council, name=council_name)

        if request.method == 'GET':
            clubs = Club.objects.filter(council=council)
            serializer = ClubSerializer(clubs, many=True)
            return Response({
                'council': council.name,
                'council_id': council.id,
                'clubs': serializer.data
            })

        elif request.method == 'POST':
            try:
                with transaction.atomic():
                    # Handle head assignment
                    head_id = request.data.get("head")
                    head = None
                    if head_id:
                        head = get_object_or_404(User, id=head_id)
                    
                    # Create club data with council reference
                    club_data = {
                        **request.data,
                        "council": council.id,
                        "head": head.id if head else None
                    }
                    
                    serializer = ClubSerializer(data=club_data)
                    if serializer.is_valid():
                        club = serializer.save()
                        
                        # Add members if provided
                        member_ids = request.data.get("members", [])
                        for member_id in member_ids:
                            member = get_object_or_404(User, id=member_id)
                            ClubMembership.objects.create(user=member, club=club, status="member")
                        
                        # Return updated club data
                        return Response(ClubSerializer(club).data, status=status.HTTP_201_CREATED)
                    
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    except Council.DoesNotExist:
        return Response({'error': 'Council not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# CRUD operations for a specific club
@api_view(["GET", "PUT", "DELETE"])
def club_crud(request, council_name, club_id):
    try:
        # Get council first
        if council_name.isdigit():
            council = get_object_or_404(Council, id=int(council_name))
        else:
            council = get_object_or_404(Council, name=council_name)
        
        # Get club
        club = get_object_or_404(Club, council=council, pk=club_id)

        if request.method == "GET":
            serializer = ClubSerializer(club)
            return Response(serializer.data)

        elif request.method == "PUT":
            try:
                with transaction.atomic():
                    # Handle head user if provided
                    head_id = request.data.get("head")
                    head = None
                    if head_id:
                        head = get_object_or_404(User, id=head_id)

                    # Update club details
                    club_data = {
                        **request.data,
                        "council": council.id,
                        "head": head.id if head else None
                    }
                    
                    serializer = ClubSerializer(club, data=club_data, partial=True)
                    if serializer.is_valid():
                        club = serializer.save()

                        # Update members if provided
                        if "members" in request.data:
                            member_ids = request.data.get("members", [])
                            # Clear existing members and add new ones
                            ClubMembership.objects.filter(club=club).delete()
                            for member_id in member_ids:
                                member = get_object_or_404(User, id=member_id)
                                ClubMembership.objects.create(user=member, club=club, status="member")

                        return Response(ClubSerializer(club).data)
                    
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "DELETE":
            club.delete()
            return Response({"message": "Club deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
# Get club by name
@api_view(["GET"])
def get_club_by_name(request, club_name):
    try:
        club = get_object_or_404(Club, name=club_name)
        serializer = ClubSerializer(club)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class AddMemberView(APIView):
    """Add a new member to a club."""

    def post(self, request, club_id):
        try:
            club = get_object_or_404(Club, id=club_id)
            name = request.data.get("name")
            email = request.data.get("email")
            role = request.data.get("role", "member")

            if not name or not email:
                return Response({"error": "Name and email are required."}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                # Check if user already exists or create a new one
                user, created = User.objects.get_or_create(email=email, defaults={"name": name})
                name_updated = False
                
                # If user exists but with different name, update the name
                if not created and user.name != name:
                    user.name = name
                    user.save()
                    name_updated = True

                # Add user as a club member
                membership, created = ClubMembership.objects.get_or_create(
                    club=club, 
                    user=user, 
                    defaults={"status": role.lower()}
                )

                if not created:
                    # Update role if member already exists
                    if membership.status != role.lower():
                        membership.status = role.lower()
                        membership.save()
                    else:
                        return Response({"error": "User is already a member with the same role."}, status=status.HTTP_400_BAD_REQUEST)

                # If role is head, update the club head
                if role.lower() == "head":
                    club.head = user
                    club.save()

                return Response(ClubSerializer(club).data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class EditMemberView(APIView):
    """Edit a club member's details (name, email, role)."""

    def put(self, request, club_id, user_id):
        try:
            club = get_object_or_404(Club, id=club_id)
            membership = get_object_or_404(ClubMembership, club=club, user_id=user_id)

            name = request.data.get("name")
            email = request.data.get("email")
            role = request.data.get("role")

            if not name or not email or not role:
                return Response({"error": "Name, email, and role are required."}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                # Check if email is being changed and if it conflicts with another user
                if email != membership.user.email:
                    if User.objects.filter(email=email).exclude(id=user_id).exists():
                        return Response({"error": "Email is already in use by another user."}, status=status.HTTP_400_BAD_REQUEST)

                # Update user details
                user = membership.user
                user.name = name
                user.email = email
                user.save()

                # Update membership role
                old_role = membership.status
                membership.status = role.lower()
                membership.save()

                # Handle head role changes
                if role.lower() == "head" and old_role != "head":
                    club.head = user
                    club.save()
                elif old_role == "head" and role.lower() != "head" and club.head and club.head.id == user_id:
                    club.head = None
                    club.save()

                return Response(ClubSerializer(club).data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RemoveMemberView(APIView):
    """Remove a member from a club."""

    def delete(self, request, club_id, user_id):
        try:
            club = get_object_or_404(Club, id=club_id)
            membership = ClubMembership.objects.filter(club=club, user_id=user_id).first()

            if not membership:
                return Response({"error": "User is not a member of this club."}, status=status.HTTP_404_NOT_FOUND)

            with transaction.atomic():
                # If removing the head, update club head to null
                if club.head and club.head.id == user_id:
                    club.head = None
                    club.save()
                
                # Remove the membership
                membership.delete()
                
                return Response(ClubSerializer(club).data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

import requests
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
import uuid

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    token = request.data.get("token")
    if not token:
        return Response({"error": "Token is required"}, status=400)
    
    google_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
    response = requests.get(google_url)
    
    if response.status_code != 200:
        return Response({"error": "Invalid Google token"}, status=400)
    
    user_info = response.json()
    email = user_info.get("email")
    
    if not email:
        return Response({"error": "Email not provided by Google"}, status=400)
    
    # Extract name or use email prefix as username
    name = user_info.get("name", email.split('@')[0])
    
    # Check if user exists
    try:
        user = User.objects.get(email=email)
        # Update user info if needed
        if user.username != name:
            user.username = name
            user.save()
    except User.DoesNotExist:
        # Create new user
        # Generate unique username if necessary
        username = name
        if User.objects.filter(username=username).exists():
            username = f"{name}_{uuid.uuid4().hex[:8]}"
        
        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=user_info.get('given_name', ''),
            last_name=user_info.get('family_name', '')
        )
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
        },
    })

@api_view(['GET'])
def get_user_profile(request):
    user = request.user
    return Response({
        "id": user.id,
        "email": user.email,
        "name": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
    })