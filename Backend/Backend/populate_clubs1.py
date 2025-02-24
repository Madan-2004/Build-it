import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")  # Change 'your_project' to your actual Django project name
django.setup()

from app.models import Club,User
# from django.contrib.auth.models import User
from app.models import Council

science_tech_club_data = [
    {"name": "Astronomy Club", "head": "Keshav Aggarval", "description": "Exploring the wonders of the universe."},
    {"name": "The Aeromodelling Club", "head": "Mrunal Nandpure", "description": "Designing and flying aeromodels."},
    {"name": "CAE", "head": "Sameer Lakkad", "description": "Computer-Aided Engineering simulations."},
    {"name": "CFA", "head": "Prasoon Pandey", "description": "Finance and analytics exploration."},
    {"name": "Concreate", "head": "Harsh Sharma", "description": "Advancing in civil engineering concepts."},
    {"name": "Cynaptics", "head": "Arnav Jain", "description": "Exploring neural and cognitive science."},
    {"name": "Electronics Club", "head": "Pulkit Gupta", "description": "Projects and circuits for electronics enthusiasts."},
    {"name": "GDSC", "head": "Vedant Dinkar", "description": "Google Developer Student Club."},
    {"name": "Gymkhana Web Team", "head": "Devesh Lokare", "description": "Managing the web development of Gymkhana."},
    {"name": "IVDC-Intelligent Vehicle Design Club", "head": "Arjun S Nair", "description": "Designing intelligent vehicles."},
    {"name": "Metacryst", "head": "Dhruv Jain", "description": "Material science and crystallography."},
    {"name": "The Programming Club", "head": "Siddhesh Waje", "description": "Competitive programming and software development."},
    {"name": "Quantum Computing", "head": "Bhawna Chaudhary", "description": "Researching quantum algorithms."},
    {"name": "Robotics Club", "head": "Mansi Singh", "description": "Building autonomous robotic systems."},
]
# Club.objects.all().delete()
# print("Cleared existing clubs.")

# Fetch the Cultural Council
science_tech_council = Council.objects.filter(name="Science and Technology Council").first()
if not science_tech_council:
    print("Error: Science and Technology Council not found! Please create it first.")
    exit(1)  # Stop execution if council is missing
else:
    for club_data in science_tech_club_data:
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
            council=science_tech_council,
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
