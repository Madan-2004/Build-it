import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")  # Change 'Backend' to your actual Django project name
django.setup()

from app.models import Club, User, Council

# Sports club data
sports_club_data = [
    {"name": "Athletics Club", "head": "Mukul Ghunawat", "description": "Track and field sports."},
    {"name": "Aquatics Club", "head": "Aaditya Deshpande", "description": "Swimming and water sports."},
    {"name": "Badminton Club", "head": "Anshul Rathodia", "description": "For badminton enthusiasts."},
    {"name": "Basketball Club", "head": "Neelesh Chourasia", "description": "For basketball lovers."},
    {"name": "Chess Club", "head": "Saket Thamke", "description": "Chess strategies and tournaments."},
    {"name": "Cricket Club", "head": "Yogesh Patidar", "description": "For cricket enthusiasts."},
    {"name": "Football Club", "head": "Biradhar Saketh", "description": "Passion for football."},
    {"name": "Tennis Club", "head": "Yash Khare", "description": "Tennis and racket skills."},
    {"name": "Table Tennis Club", "head": "Aviral Sharma", "description": "Table tennis tournaments and practice."},
    {"name": "Volleyball Club", "head": "Samrudhhee", "description": "Spiking and blocking in volleyball."},
    {"name": "Squash Club", "head": "Akshat Mishra", "description": "For squash lovers."},
    {"name": "Yoga and Fitness Club", "head": "Gouriveni Gokul", "description": "Promoting yoga and fitness."},
]

# Fetch the Sports Council
sports_council = Council.objects.filter(name="Sports Council").first()
if not sports_council:
    print("Sports Council not found! Please create it first.")
else:
    for club_data in sports_club_data:
        head_name = club_data["head"]
        head_user = None

        if head_name:  # Check if head is assigned
            head_user = User.objects.filter(name=head_name).first()
            if not head_user:
                print(f"User '{head_name}' not found. Skipping head assignment for {club_data['name']}.")

        # Create the club
        club, created = Club.objects.get_or_create(
            name=club_data["name"],
            council=sports_council,
            defaults={
                "description": club_data["description"],
                "head": head_user,
            }
        )

        if created:
            print(f"Created Club: {club.name}")
        else:
            print(f"Club '{club.name}' already exists. Skipping...")

print("Sports Club population complete!")
