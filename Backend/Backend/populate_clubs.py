import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")  # Change 'your_project' to your actual Django project name
django.setup()

from app.models import Club,User
# from django.contrib.auth.models import User
from app.models import Council

# Cultural club data
cultural_club_data = [
    {"name": "Aaina Club", "head": "Kanak Nagar", "description": "Exploring theatre and dramatics."},
    {"name": "Avana Club", "head": "Vijit Balsori", "description": "Celebrating dance and expression."},
    {"name": "Cinephiles", "head": "Anshul Vijaywargiya", "description": "Movie lovers' paradise."},
    {"name": "D' Alpha Crewz", "head": "Anand Prakash", "description": "Hip-hop and freestyle dance."},
    {"name": "The Debating Society", "head": "Dushyant Chaudhari", "description": "Sharpening argumentation skills."},
    {"name": "EBSB Club", "head": "Tejaswini Pappala", "description": "Ek Bharat Shreshtha Bharat initiatives."},
    {"name": "Gaming Club", "head": "Harshit Gupta", "description": "For gamers and e-sports lovers."},
    {"name": "Kalakriti Club", "head": "Chirag Sonwane", "description": "Fine arts and creative expressions."},
    {"name": "Literary Club", "head": "Abhay Kumar Singh", "description": "Writing, poetry, and storytelling."},
    {"name": "Mystic Hues", "head": "Nehansh Mankad", "description": "Aesthetic and artistic creations."},
    {"name": "Music Club", "head": "Umang Dosi", "description": "For music lovers and instrumentalists."},
    {"name": "Prakriti", "head": "Raina Tathed", "description": "Environmental awareness and sustainability."},
    {"name": "The Quiz Club", "head": "", "description": "Competitive quizzing and knowledge sharing."},
    {"name": "Srijan", "head": "Hrishikesh Jawale", "description": "Cultural performances and arts."},
    {"name": "VLR Club", "head": "Hrishikesh Jawale", "description": "Promoting Indian cultural heritage."},
]
# Club.objects.all().delete()
# print("Cleared existing clubs.")

# Fetch the Cultural Council
cultural_council = Council.objects.filter(name="Cultural Council").first()
if not cultural_council:
    print("Cultural Council not found! Please create it first.")
else:
    for club_data in cultural_club_data:
        head_name = club_data["head"]
        head_user = None
        
        if head_name:  # Check if head is assigned
            head_user = User.objects.filter(name=head_name).first()
            print(head_user)
            if not head_user:
                print(f"User '{head_name}' not found. Skipping head assignment for {club_data['name']}.")

        # Create the club
        club, created = Club.objects.get_or_create(
            name=club_data["name"],
            council=cultural_council,
            defaults={
                "description": club_data["description"],
                "head": head_user,
            }
        )

        if created:
            print(f"Created Club: {club.name}")
        else:
            print(f"Club '{club.name}' already exists. Skipping...")

print("Club population complete!")
