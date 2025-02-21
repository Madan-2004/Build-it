from django.urls import path
from .views import get_councils, get_council_detail, get_clubs, create_council, delete_council,clubs_by_council

urlpatterns = [
    path('api/councils/', get_councils, name="get_councils"), 
    path('api/councils/<int:council_id>/', get_council_detail, name="get_council_detail"),
    path('api/councils/create/', create_council, name="create_council"),
    path('api/councils/delete/<int:council_id>/', delete_council, name="delete_council"),
    path('api/council/<int:council_id>/clubs/', clubs_by_council, name='clubs-by-council'),
    
    path('api/clubs/', get_clubs, name="get_clubs"),
]
