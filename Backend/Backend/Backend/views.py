from django.shortcuts import redirect
from allauth.socialaccount.models import SocialAccount
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

def google_login(request):
    return redirect('/accounts/google/login/')

def google_callback(request):
    if request.user.is_authenticated:
        social_account = SocialAccount.objects.get(user=request.user)
        user_data = social_account.extra_data
        # Process user data as needed
        return JsonResponse({"message": "Login successful", "user_data": user_data})
    else:
        return JsonResponse({"error": "Authentication failed"}, status=401)

@login_required
def get_user_info(request):
    user = request.user
    social_account = SocialAccount.objects.get(user=user)
    return JsonResponse({
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "google_data": social_account.extra_data
    })
