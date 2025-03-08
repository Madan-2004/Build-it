from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Council, Club, Users, ClubMembership
from .serializers import CouncilSerializer, ClubSerializer, UsersSerializer
from django.db import transaction
from rest_framework.permissions import IsAuthenticated

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
                        head = get_object_or_404(Users, id=head_id)
                    
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

# Delete a club
@api_view(["DELETE"])
def delete_club(request, club_name):
    try:
        club = get_object_or_404(Club, name=club_name)
        club.delete()
        return Response({"message": "Club deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
#renaming the club    
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
    """Add a new member to a club, ensuring no duplicate emails and only one head per club."""

    def post(self, request, club_id):
        try:
            club = get_object_or_404(Club, id=club_id)
            name = request.data.get("name")
            email = request.data.get("email")
            role = request.data.get("role", "member").lower()

            if not name or not email:
                return Response({"error": "Name and email are required."}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                # Check if a user with the same email already exists
                existing_user = Users.objects.filter(email=email).first()

                if existing_user:
                    # Prevent duplicate email registrations with different names
                    if existing_user.name != name:
                        return Response({"error": "A user with this email already exists with a different name."}, status=status.HTTP_400_BAD_REQUEST)
                    user = existing_user
                else:
                    # Create new user
                    user = Users.objects.create(name=name, email=email)

                # Check if user is already a club member
                membership, created = ClubMembership.objects.get_or_create(
                    club=club,
                    user=user,
                    defaults={"status": role}
                )

                if not created:
                    # Prevent assigning the same role again
                    if membership.status == role:
                        return Response({"error": "User is already a member with the same role."}, status=status.HTTP_400_BAD_REQUEST)
                    # Update role if it changed
                    membership.status = role
                    membership.save()

                # If assigning as head, ensure only one head exists
                if role == "head":
                    # Remove the previous head (if any)
                    ClubMembership.objects.filter(club=club, status="head").exclude(user=user).delete()

                    # Update the club's head field
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