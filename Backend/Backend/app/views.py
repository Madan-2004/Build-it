from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Council, Club, Users, ClubMembership,CouncilHead,Inventory
from .serializers import CouncilSerializer, ClubSerializer, UsersSerializer,CouncilHeadSerializer,InventorySerializer
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count

import json
import os
from django.conf import settings
from rest_framework import status, generics, parsers
from PIL import Image
import io
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
            # Add annotations for counting members and projects
            clubs = Club.objects.filter(council=council).annotate(
    db_members_count=Count('clubmembership', distinct=True),
    db_projects_count=Count('projects', distinct=True)
)
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
                    print(request.data)
                    head_id = request.data.get("head")
                    print(head_id)
                    head = None
                    if head_id:
                        head = get_object_or_404(Users, id=head_id)
                    
                    # Create club data with council reference
                    club_data = {
                        **request.data,
                        "council": council.id,
                        "head": head.id if head else None
                    }
                    print(club_data)
                    
                    serializer = ClubSerializer(data=club_data)
                    if not serializer.is_valid():
                        print("Serializer errors:", serializer.errors)  # Debugging line
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                    if serializer.is_valid():
                        club = serializer.save()
                        
                        # Add members if provided
                        member_ids = request.data.get("members", [])
                        for member_id in member_ids:
                            member = get_object_or_404(Users, id=member_id)
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
                        head = get_object_or_404(Users, id=head_id)

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
                                member = get_object_or_404(Users, id=member_id)
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
@api_view(["PUT"])
def update_club(request, club_name):
    try:
        club = get_object_or_404(Club, name=club_name)
        print(request.data)
        serializer = ClubSerializer(club, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE'])
def delete_club(request, council_name, club_id):
    try:
        council = Council.objects.get(name=council_name)
        club = Club.objects.get(id=club_id, council=council)
        
        if request.method == 'DELETE':
            club.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
            
    except Council.DoesNotExist:
        return Response(
            {"error": "Council not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Club.DoesNotExist:
        return Response(
            {"error": "Club not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
# #renaming the club    
@api_view(["PATCH"])
def rename_club(request, club_name):
    try:
        club = get_object_or_404(Club, name=club_name)
        new_name = request.data.get("new_name")

        if not new_name:
            return Response({"error": "New club name is required."}, status=status.HTTP_400_BAD_REQUEST)

        if Club.objects.filter(name=new_name).exists():
            return Response({"error": "Club with this name already exists."}, status=status.HTTP_400_BAD_REQUEST)

        club.name = new_name
        club.save()
        
        return Response({"message": "Club renamed successfully", "new_name": new_name})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


class AddMemberView(APIView):
    """Add a new member to a club, ensuring no duplicate emails within the same club and only one head per club."""

    def post(self, request, club_id):
        try:
            club = get_object_or_404(Club, id=club_id)
            name = request.data.get("name")
            email = request.data.get("email")
            role = request.data.get("role", "member").lower()

            if not name or not email:
                return Response({"error": "Name and email are required."}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                # Check if a user with the same email exists
                user, created = Users.objects.get_or_create(email=email, defaults={"name": name})

                # Ensure name consistency
                if not created and user.name != name:
                    return Response(
                        {"error": "A user with this email exists with a different name."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # ✅ Check if the user is already a member of THIS club
                existing_membership = ClubMembership.objects.filter(club=club, user=user).first()
                if existing_membership:
                    if existing_membership.status == role:
                        return Response({"error": "User is already a member with the same role."}, status=status.HTTP_400_BAD_REQUEST)

                    # Update role if different
                    existing_membership.status = role
                    existing_membership.save()
                else:
                    # Add new membership
                    ClubMembership.objects.create(club=club, user=user, status=role)

                # ✅ Handle head role (only one per club)
                if role == "head":
                    ClubMembership.objects.filter(club=club, status="head").exclude(user=user).delete()
                    club.head = user
                    club.save()

                return Response(ClubSerializer(club).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class EditMemberView(APIView):
    """Edit a club member's details (name, email, role), ensuring no duplicate emails."""

    def put(self, request, club_id, user_id):
        try:
            club = get_object_or_404(Club, id=club_id)
            membership = get_object_or_404(ClubMembership, club=club, user_id=user_id)

            name = request.data.get("name")
            email = request.data.get("email")
            role = request.data.get("role", "member").lower()

            if not name or not email or not role:
                return Response({"error": "Name, email, and role are required."}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                user = membership.user

                # Check if the email is being changed and if it conflicts with another user
                if email != user.email:
                    if Users.objects.filter(email=email).exclude(id=user_id).exists():
                        return Response({"error": "This email is already in use by another user."}, status=status.HTTP_400_BAD_REQUEST)

                    # Update the email only if it's unique
                    user.email = email

                # Update name
                user.name = name
                user.save()

                # Handle role updates
                old_role = membership.status
                membership.status = role
                membership.save()

                # If user is assigned as head, update the club head
                if role == "head" and old_role != "head":
                    ClubMembership.objects.filter(club=club, status="head").exclude(user=user).delete()
                    club.head = user
                    club.save()
                elif old_role == "head" and role != "head" and club.head and club.head.id == user_id:
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
                return Response({"error": "Users is not a member of this club."}, status=status.HTTP_404_NOT_FOUND)

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
        

# import requests
# from django.contrib.auth import get_user_model
# from rest_framework.response import Response
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.conf import settings
# import uuid

# Users = get_user_model()

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def google_login(request):
#     token = request.data.get("token")
#     if not token:
#         return Response({"error": "Token is required"}, status=400)
    
#     google_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
#     response = requests.get(google_url)
    
#     if response.status_code != 200:
#         return Response({"error": "Invalid Google token"}, status=400)
    
#     user_info = response.json()
#     email = user_info.get("email")
    
#     if not email:
#         return Response({"error": "Email not provided by Google"}, status=400)
    
#     # Extract name or use email prefix as username
#     name = user_info.get("name", email.split('@')[0])
    
#     # Check if user exists
#     try:
#         user = Users.objects.get(email=email)
#         # Update user info if needed
#         if user.username != name:
#             user.username = name
#             user.save()
#     except Users.DoesNotExist:
#         # Create new user
#         # Generate unique username if necessary
#         username = name
#         if Users.objects.filter(username=username).exists():
#             username = f"{name}_{uuid.uuid4().hex[:8]}"
        
#         user = Users.objects.create_user(
#             username=username,
#             email=email,
#             first_name=user_info.get('given_name', ''),
#             last_name=user_info.get('family_name', '')
#         )
    
#     # Generate JWT tokens
#     refresh = RefreshToken.for_user(user)
    
#     return Response({
#         "refresh": str(refresh),
#         "access": str(refresh.access_token),
#         "user": {
#             "id": user.id,
#             "email": user.email,
#             "name": user.username,
#             "first_name": user.first_name,
#             "last_name": user.last_name,
#         },
#     })

# @api_view(['GET'])
# def get_user_profile(request):
#     user = request.user
#     return Response({
#         "id": user.id,
#         "email": user.email,
#         "name": user.username,
#         "first_name": user.first_name,
#         "last_name": user.last_name,
#     })

import requests
import json
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from django.conf import settings
from django.urls import reverse
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import uuid

User = get_user_model()

@api_view(['GET'])
@permission_classes([AllowAny])
def google_auth_url(request):
    """Generate the Google OAuth2 authorization URL"""
    google_auth_url = 'https://accounts.google.com/o/oauth2/v2/auth'
    params = {
        'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
        'redirect_uri': settings.GOOGLE_OAUTH2_REDIRECT_URI,
        'response_type': 'code',
        'scope': 'email profile',
        'access_type': 'offline',
        'prompt': 'consent',
        'state': str(uuid.uuid4())  # To prevent CSRF
    }
    
    # Build query string
    import urllib.parse
    query_string = urllib.parse.urlencode(params)
    auth_url = f"{google_auth_url}?{query_string}"
    
    return Response({'auth_url': auth_url})

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def google_callback(request):
    """Handle the Google OAuth2 callback"""
    # Extract code from GET parameters if it's a GET request, or from POST data if it's a POST request
    if request.method == 'GET':
        code = request.GET.get('code')
    else:  # POST
        code = request.data.get('code')
    
    if not code:
        return Response({'error': 'Authorization code is required'}, status=400)
    
    # Exchange code for tokens
    token_url = 'https://oauth2.googleapis.com/token'
    token_payload = {
        'code': code,
        'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
        'client_secret': settings.GOOGLE_OAUTH2_CLIENT_SECRET,
        'redirect_uri': settings.GOOGLE_OAUTH2_REDIRECT_URI,
        'grant_type': 'authorization_code'
    }
    
    token_response = requests.post(token_url, data=token_payload)
    if token_response.status_code != 200:
        return Response({
            'error': 'Failed to exchange authorization code for tokens',
            'details': token_response.text
        }, status=400)
    
    token_data = token_response.json()
    id_token = token_data.get('id_token')
    
    # Verify the ID token
    google_verify_url = f'https://oauth2.googleapis.com/tokeninfo?id_token={id_token}'
    verify_response = requests.get(google_verify_url)
    if verify_response.status_code != 200:
        return Response({'error': 'Invalid ID token'}, status=400)
    
    user_info = verify_response.json()
    email = user_info.get('email')
    if not email:
        return Response({'error': 'Email not provided by Google'}, status=400)
    
    # Get or create user
    name = user_info.get('name', email.split('@')[0])
    try:
        user = User.objects.get(email=email)
        # Update user info if needed
        if user.username != name:
            user.username = name
            user.save()
    except User.DoesNotExist:
        # Create new user
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
    
    # For GET requests, set cookies and redirect to frontend
    if request.method == 'GET':
        frontend_url = 'http://localhost:5173/auth/success'
        response = redirect(frontend_url)
        
        # Set secure httpOnly cookie for access token
        response.set_cookie(
            'access_token',
            str(refresh.access_token),
            max_age=60 * 60,  # 1 hour (adjust as needed)
            httponly=True,
            secure=settings.DEBUG is False,  # True in production
            samesite='Lax'
        )
        
        # Set secure httpOnly cookie for refresh token
        response.set_cookie(
            'refresh_token',
            str(refresh),
            max_age=60 * 60 * 24 * 7,  # 7 days
            httponly=True,
            secure=settings.DEBUG is False,  # True in production
            samesite='Lax'
        )
        
        # Set a non-httpOnly cookie just to signal auth state to frontend
        response.set_cookie(
            'is_authenticated',
            'true',
            max_age=60 * 60 * 24 * 7,  # 7 days
            httponly=False,
            secure=settings.DEBUG is False,
            samesite='Lax'
        )
        
        # Set a user info cookie (non-httpOnly so JavaScript can read it)
        import json
        from urllib.parse import quote
        user_data = {
            
            'email': user.email,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
        # Convert the dictionary to a JSON string
        user_data_json = json.dumps(user_data)

        # URL-encode the JSON string before setting the cookie
        encoded_user_data = quote(user_data_json)

        # Set the user_info cookie with the encoded JSON
        response.set_cookie(
            'user_info',
            encoded_user_data,
            max_age=60 * 60 * 24 * 7,  # 7 days
            httponly=False,
            secure=settings.DEBUG is False,
            samesite='Lax'
        )
        
        return response
    
    # For POST requests or API usage
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            
            'email': user.email,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
    })

@api_view(['GET'])
def check_auth(request):
    """Check if the user is authenticated"""
    if request.user.is_authenticated:
        return Response({
            'isAuthenticated': True,
            'user': {
                'id': request.user.id,
                'email': request.user.email,
                'username': request.user.username,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name
            }
        })
    return Response({'isAuthenticated': False})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Return the authenticated user's profile"""
    user = request.user
    return Response({
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout and clear cookies"""
    # Create a response
    response = Response({'detail': 'Successfully logged out.'})
    
    # Clear the cookies
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    response.delete_cookie('is_authenticated')
    response.delete_cookie('user_info')
    
    return response

@api_view(['GET'])
def user_head_clubs(request, email):
    """
    Get all clubs where the user is the head, either directly or through membership, using email as a filter.
    """
    try:
        # Get the user by email
        user = get_object_or_404(Users, email=email)
        memberships = ClubMembership.objects.filter(user=user).select_related("club")

        # Serialize data
        clubs_data = []
        for membership in memberships:
            clubs_data.append({
                "id": membership.club.id,
                "name": membership.club.name,
                "status": membership.status  # This will be either "head" or "member"
            })

        return Response({"clubs": clubs_data})

        # Get clubs where the user is set as head directly
        direct_head_clubs = Club.objects.filter(head=user)

        # Get clubs where the user is set as head through membership
        membership_head_clubs = Club.objects.filter(
            clubmembership__user=user,
            clubmembership__status='head'
        )

        # Combine both querysets and remove duplicates
        all_head_clubs = direct_head_clubs.union(membership_head_clubs)

        # serializer = ClubSerializer(all_head_clubs, many=True)
        # return Response(serializer.data)
        club_data = [{"id": club.id, "name": club.name} for club in all_head_clubs]
        return Response(club_data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    

# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
class FeedbackView(APIView):
    def post(self, request):
        # Extract data from request
        name = request.data.get('name', '')
        email = request.data.get('email', '')
        subject = request.data.get('subject', '')
        message = request.data.get('message', '')
        
        # Validate required fields
        if not all([name, email, subject, message]):
            return Response(
                {"error": "All fields are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Send email to admin
        email_subject = f"New Feedback: {subject}"
        email_message = f"""
        New feedback received from {name} ({email})
        
        Subject: {subject}
        
        Message:
        {message}
        
        Timestamp: {timezone.now()}
        """
        
        try:
            send_mail(
                email_subject,
                email_message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.ADMIN_EMAIL],
                fail_silently=False,
            )
            
            return Response(
                {"message": "Feedback sent successfully"}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": "Failed to send feedback", "details": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )    
        

# from rest_framework import generics, parsers
# from rest_framework.permissions import IsAuthenticatedOrReadOnly
# from .models import Project
# from .serializers import ProjectSerializer
# from rest_framework.response import Response
# from rest_framework import status

# class ProjectListCreateView(generics.ListCreateAPIView):
#     queryset = Project.objects.all()
#     serializer_class = ProjectSerializer
#     parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    
#     def get_queryset(self):
#         club_id = self.kwargs.get("club_id")
#         return Project.objects.filter(club_id=club_id)
    
#     def perform_create(self, serializer):
#         club_id = self.kwargs.get("club_id")
#         serializer.save(club_id=club_id)
    
#     def create(self, request, *args, **kwargs):
#         print("Request data:", request.data)
        
#         serializer = self.get_serializer(data=request.data)
#         if not serializer.is_valid():
#             print("Validation errors:", serializer.errors)  # This will show exactly what's failing
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
#         self.perform_create(serializer)
#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
# # class ProjectListCreateView(generics.ListCreateAPIView):
# #     queryset = Project.objects.all()
# #     serializer_class = ProjectSerializer
# #     # permission_classes = [IsAuthenticatedOrReadOnly]
# #     parser_classes = [parsers.MultiPartParser, parsers.FormParser]  # Enable image upload

# #     def get_queryset(self):
# #         club_id = self.kwargs.get("club_id")
# #         return Project.objects.filter(club_id=club_id)

# #     def perform_create(self, serializer):
# #         club_id = self.kwargs.get("club_id")
# #         print("Received request data:", self.request.data)

# #         if "title" not in self.request.data or "description" not in self.request.data:
# #             return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
# #         serializer.save(club_id=club_id)

# class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Project.objects.all()
#     serializer_class = ProjectSerializer
#     # permission_classes = [IsAuthenticatedOrReadOnly]
#     parser_classes = [parsers.MultiPartParser, parsers.FormParser]  # Enable image upload
# views.py
from rest_framework import generics, parsers, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Project
from .serializers import ProjectSerializer
from rest_framework.response import Response

class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    
    def get_queryset(self):
        club_id = self.kwargs.get("club_id")
        return Project.objects.filter(club_id=club_id)
         # Filter by status if provided in query params
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset
    
    def perform_create(self, serializer):
        club_id = self.kwargs.get("club_id")
        serializer.save(club_id=club_id)
    
    def create(self, request, *args, **kwargs):
        # Debug logging
        print("Request data:", request.data)
        
        required_fields = ['title', 'description', 'start_date']
        for field in required_fields:
            if field not in request.data:
                return Response(
                    {"error": f"Missing required field: {field}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            print("Error creating project:", str(e))
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_queryset(self):
        club_id = self.kwargs.get("club_id")
        return Project.objects.filter(club_id=club_id)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        partial = kwargs.pop("partial", False)

        # Handle project completion
        if 'status' in request.data and request.data['status'] == 'completed':
            instance.mark_as_completed()

        # Handle existing images
        existing_images = request.data.getlist("existing_images[]", [])
        if existing_images:
            # Delete images not in existing_images list
            instance.images.exclude(image__in=existing_images).delete()

        # Handle new image uploads
        new_images = request.FILES.getlist("image_uploads")
        if new_images:
            for image in new_images:
                try:
                    # Validate image
                    Image.open(image).verify()
                    instance.images.create(image=image)
                except Exception as e:
                    return Response(
                        {"error": f"Invalid image: {str(e)}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
        # Update project fields
        update_data = {
            'title': request.data.get('title', instance.title),
            'description': request.data.get('description', instance.description),
            'start_date': request.data.get('start_date', instance.start_date),
            'end_date': request.data.get('end_date', instance.end_date),
            'status': request.data.get('status', instance.status)
        }        

        serializer = self.get_serializer(instance, data=update_data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # Delete all images associated with this project
        for img in instance.images.all():
            img_path = os.path.join(settings.MEDIA_ROOT, img.image.name)
            if os.path.exists(img_path):
                os.remove(img_path)
            img.delete()

        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # ✅ Requires a valid token
def check_auth_status(request):
    """
    Check if the user is authenticated and return user details.
    """
    user = request.user
    return Response({
        "message": "✅ Token is valid. User is authenticated.",
        "user_id": user.id,
        "email": user.email,
        "username": user.username
    }, status=status.HTTP_200_OK)

# app/views.py
from django.http import JsonResponse
from django.utils import timezone
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from datetime import datetime, timezone as dt_timezone  # Rename timezone to avoid conflicts

def get_token_from_request(request):
    # First check for token in Authorization header
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if auth_header and auth_header.startswith('Bearer '):
        return auth_header.split(' ')[1]  # Extract token from header

    # Fallback to checking cookies
    return request.COOKIES.get('access_token')


def verify_token(token_string):
    try:
        return AccessToken(token_string).payload, None
    except TokenError as e:
        return None, str(e)


def get_token_expiration(payload):
    if exp := payload.get('exp'):
        return datetime.fromtimestamp(exp, tz=dt_timezone.utc)  # Use dt_timezone.utc instead of timezone.utc
    return None


def token_info(request):
    token = get_token_from_request(request)
    if not token:
        return JsonResponse({'error': 'No token found in cookies'}, status=400)

    payload, error = verify_token(token)
    if error:
        return JsonResponse({'error': error}, status=400)

    expiration = get_token_expiration(payload)
    is_expired = expiration < timezone.now() if expiration else True 

    return JsonResponse({
        'is_valid': not is_expired,
        'expiration': expiration.isoformat() if expiration else None,
        'user_id': payload.get('user_id'),
        'email': payload.get('email')
    })

from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')  # Get refresh token from cookies
        if not refresh_token:
            print("Refresh token is missing")
            return Response({"error": "Refresh token is missing"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            print("got token")
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            print("access token", access_token)
            
            # Create response with token in body
            response = Response({
                "access": access_token,
            })
            
            # Set access token as cookie
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,  # Prevents JavaScript access
                secure=True,    # Only sent over HTTPS
                samesite='Lax', # Provides CSRF protection
                max_age=86400,   # 1 hour expiration
                path='/'        # Available across your domain
            )
            
            return response
        except Exception as e:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)
# List and Create View
class CouncilHeadListCreateView(generics.ListCreateAPIView):
    queryset = CouncilHead.objects.all()
    serializer_class = CouncilHeadSerializer

# Retrieve, Update, and Delete View
class CouncilHeadDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CouncilHead.objects.all()
    serializer_class = CouncilHeadSerializer        

class CouncilInventoryView(generics.RetrieveAPIView):
    """
    API view to fetch the inventory details of a specific council.
    """
    serializer_class = InventorySerializer
    lookup_field = 'name'  # Use council name as the lookup field

    def get_object(self):
        # Retrieve the council by name
        council_name = self.kwargs.get('council_name')
        council = get_object_or_404(Council, name=council_name)

        # Retrieve the inventory for the council
        inventory = Inventory.objects.filter(council=council).first()

        if inventory:
            return inventory
        else:
            # Raise a 404 if no inventory is found
            self.response = Response(
                {"error": "No inventory found for this council"},
                status=status.HTTP_404_NOT_FOUND
            )
            return None

    def get(self, request, *args, **kwargs):
        inventory = self.get_object()

        if inventory:
            serializer = InventorySerializer(inventory)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Return 404 if no inventory exists
        return Response(
            {"error": "No inventory found for this council"},
            status=status.HTTP_404_NOT_FOUND
        )

from rest_framework import generics, status
from rest_framework.response import Response
from django.http import Http404
from .models import Inventory
from .serializers import InventorySerializer

class InventoryListCreateView(generics.ListCreateAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

    def get_queryset(self):
        """
        Filter inventory by club name from the URL path.
        """
        club_name = self.kwargs.get("club_name")
        if club_name:
         return Inventory.objects.filter(club__name__iexact=club_name)

        return super().get_queryset()

    def create(self, request, *args, **kwargs):
        """
        Create a new inventory entry for the club specified by name in the URL.
        """
        club_name = self.kwargs.get("club_name")

        if not club_name:
            return Response({"error": "Club name is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the club by name
        club = get_object_or_404(Club, name=club_name)

        # ✅ Use the correct model field name
        inventory = Inventory.objects.create(
            club=club,
            budget_allocated=request.data.get("budget_allocated", 0),
            budget_used=request.data.get("budget_used", 0)  # Map to the correct field
        )

        serializer = InventorySerializer(inventory)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# Retrieve, update, or delete a specific inventory item

@api_view(['PATCH'])
def update_club_inventory(request, club_name):
    try:
        # Find the club
        club = Club.objects.get(name=club_name)
        
        # Find or create the club's inventory
        inventory, created = Inventory.objects.get_or_create(club=club)
        
        # Update the inventory with the provided data
        serializer = InventorySerializer(inventory, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Club.DoesNotExist:
        return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
from allauth.socialaccount.models import SocialAccount
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        social_account = SocialAccount.objects.get(user=request.user, provider='google')
        # Google stores the picture URL directly in the 'picture' field
        picture_url = social_account.extra_data.get('picture', '')
        
        return Response({
            'name': social_account.extra_data.get('name', ''),
            'email': request.user.email,
            'picture': picture_url,
        })
    except SocialAccount.DoesNotExist:
        return Response({
            'name': request.user.get_full_name(),
            'email': request.user.email,
            'picture': None
        })            
    

from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from .models import Project, ProjectInventory, InventoryItem
import json

from django.shortcuts import get_object_or_404
from django.db.models import Sum
from .models import Club, Council, Inventory, ProjectInventory, Project


def recalculate_club_budget(club_id):
    """
    Recalculate the budget utilized for a club based on all its projects.
    
    This function:
    1. Gets all projects under the club
    2. Sums the budget_allocated fields from all project inventories
    3. Updates the club's inventory budget_utilized field
    """
    club = get_object_or_404(Club, id=club_id)
    
    # Get all projects for this club
    projects = Project.objects.filter(club=club)
    
    # Sum budget_allocated from all project inventories
    total_budget_allocated = ProjectInventory.objects.filter(
        project__in=projects
    ).aggregate(total=Sum('budget_allocated'))['total'] or 0
    
    # Get or create club inventory
    club_inventory, created = Inventory.objects.get_or_create(club=club)
    
    # Update the budget_used field with the total from projects
    club_inventory.budget_used = total_budget_allocated
    club_inventory.save()


def recalculate_council_budget(council_id):
    """
    Recalculate both budget_allocated and budget_utilized for a council.
    
    This function:
    1. Sums budget_allocated from all clubs under the council
    2. Sums budget_used from all clubs under the council
    3. Updates the council's inventory accordingly
    """
    council = get_object_or_404(Council, id=council_id)
    
    # Get all clubs in this council
    clubs = Club.objects.filter(council=council)
    
    # Get club inventories
    club_inventories = Inventory.objects.filter(club__in=clubs)
    
    # Sum budget_allocated from all clubs
    total_budget_allocated = club_inventories.aggregate(
        total=Sum('budget_allocated')
    )['total'] or 0
    
    # Sum budget_used from all clubs
    total_budget_used = club_inventories.aggregate(
        total=Sum('budget_used')
    )['total'] or 0
    
    # Get or create council inventory
    council_inventory, created = Inventory.objects.get_or_create(council=council)
    
    # Update both budget fields
    council_inventory.budget_allocated = total_budget_allocated
    council_inventory.budget_used = total_budget_used
    council_inventory.save()

# Get inventory details
def get_inventory(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    
    try:
        inventory = ProjectInventory.objects.get(project=project)
        items = InventoryItem.objects.filter(project_inventory=inventory)
        
        total_cost = sum(item.cost * item.quantity for item in items)
        inventory_data = {
            "id": inventory.id,
            "budget_allocated": inventory.budget_allocated,
            "budget_used": total_cost,
            "items": [
                {
                    "id": item.id,
                    "name": item.name,
                    "quantity": item.quantity,
                    "cost": item.cost,
                    "consumable": item.consumable
                }
                for item in items
            ]
        }
    except ObjectDoesNotExist:
        inventory_data = None
    
    return JsonResponse({"inventory": inventory_data, "project_name": project.title})

# Create new inventory 
@csrf_exempt
def create_inventory(request, project_id):
    if request.method == "POST":
        project = get_object_or_404(Project, id=project_id)
        data = json.loads(request.body)
        
        inventory, created = ProjectInventory.objects.get_or_create(
            project=project,
            defaults={"budget_allocated": float(data["budget_allocated"])}
        )
        
        if not created:
            # Update budget if inventory already exists
            inventory.budget_allocated = float(data["budget_allocated"])
            inventory.save()

        club = project.club
        recalculate_club_budget(club.id)
        recalculate_council_budget(club.council.id)
        
        return JsonResponse({
            "message": "Inventory created successfully",
            "id": inventory.id
        })
    
    return JsonResponse({"error": "Invalid request method"}, status=405)

# Add item to inventory 
@csrf_exempt
def add_inventory_item(request, project_id):
    if request.method == "POST":
        data = json.loads(request.body)
        project = get_object_or_404(Project, id=project_id)
        inventory, created = ProjectInventory.objects.get_or_create(project=project)
        
        new_item = InventoryItem.objects.create(
            project_inventory=inventory,
            name=data["name"],
            quantity=int(data["quantity"]),
            cost=float(data["cost"]),
            consumable=data["consumable"]
        )
        
        return JsonResponse({
            "message": "Item added successfully",
            "id": new_item.id
        })

        # # Get the club from the project
        # club = project.club

        # # Recalculate budgets
        # recalculate_club_budget(club.id)
        # recalculate_council_budget(club.council.id)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)

# Update inventory item
@csrf_exempt
def update_inventory_item(request, project_id, item_id):
    if request.method == "PUT":
        data = json.loads(request.body)
        item = get_object_or_404(InventoryItem, id=item_id)
        
        item.name = data["name"]
        item.quantity = int(data["quantity"])
        item.cost = float(data["cost"])
        item.consumable = data["consumable"]
        item.save()

        # # Get the club from the project
        # club = project.club

        # # Recalculate budgets
        # recalculate_club_budget(club.id)
        # recalculate_council_budget(club.council.id)
        
        return JsonResponse({"message": "Item updated successfully"})
    
    return JsonResponse({"error": "Invalid request method"}, status=405)

# Delete inventory and all items
@csrf_exempt
def delete_inventory(request, project_id):
    if request.method == "DELETE":
        project = get_object_or_404(Project, id=project_id)
        
        try:
            inventory = ProjectInventory.objects.get(project=project)
            InventoryItem.objects.filter(project_inventory=inventory).delete()
            inventory.delete()

            # Get the club from the project
            club = project.club

            # Recalculate budgets
            recalculate_club_budget(club.id)
            recalculate_council_budget(club.council.id)
            
            return JsonResponse({"message": "Inventory and items deleted successfully"})
        except ProjectInventory.DoesNotExist:
            return JsonResponse({"error": "Inventory not found"}, status=404)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)

# Add new endpoint to mark project as completed
@api_view(['POST'])
def mark_project_completed(request, club_id, project_id):
    """Mark a project as completed and set the end date"""
    try:
        project = get_object_or_404(Project, id=project_id, club_id=club_id)
        project.mark_as_completed()
        serializer = ProjectSerializer(project)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )