import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")  # Replace 'your_project' with your actual project name
django.setup()

from app.models import Council, Club  # Replace 'app' with your actual app name

# Define cultural club data mapped to "Cultural Council"
cultural_club_data = [
    {"name": "Aaina Club", "head": "Kanak Nagar", "description": "Exploring theatre and dramatics.", "council_name": "Cultural Council"},
    {"name": "Avana Club", "head": "Vijit Balsori", "description": "Celebrating dance and expression.", "council_name": "Cultural Council"},
    {"name": "Cinephiles", "head": "Anshul Vijaywargiya", "description": "Movie lovers' paradise.", "council_name": "Cultural Council"},
    {"name": "D' Alpha Crewz", "head": "Anand Prakash", "description": "Hip-hop and freestyle dance.", "council_name": "Cultural Council"},
    {"name": "The Debating Society", "head": "Dushyant Chaudhari", "description": "Sharpening argumentation skills.", "council_name": "Cultural Council"},
    {"name": "EBSB Club", "head": "Tejaswini Pappala", "description": "Ek Bharat Shreshtha Bharat initiatives.", "council_name": "Cultural Council"},
    {"name": "Gaming Club", "head": "Harshit Gupta", "description": "For gamers and e-sports lovers.", "council_name": "Cultural Council"},
    {"name": "Kalakriti Club", "head": "Chirag Sonwane", "description": "Fine arts and creative expressions.", "council_name": "Cultural Council"},
    {"name": "Literary Club", "head": "Abhay Kumar Singh", "description": "Writing, poetry, and storytelling.", "council_name": "Cultural Council"},
    {"name": "Mystic Hues", "head": "Nehansh Mankad", "description": "Aesthetic and artistic creations.", "council_name": "Cultural Council"},
    {"name": "Music Club", "head": "Umang Dosi", "description": "For music lovers and instrumentalists.", "council_name": "Cultural Council"},
    {"name": "Prakriti", "head": "Raina Tathed", "description": "Environmental awareness and sustainability.", "council_name": "Cultural Council"},
    {"name": "The Quiz Club", "head": "", "description": "Competitive quizzing and knowledge sharing.", "council_name": "Cultural Council"},
    {"name": "Srijan", "head": "Hrishikesh Jawale", "description": "Cultural performances and arts.", "council_name": "Cultural Council"},
    {"name": "VLR Club", "head": "Hrishikesh Jawale", "description": "Promoting Indian cultural heritage.", "council_name": "Cultural Council"},
]

# Insert cultural club data into the database
for club in cultural_club_data:
    try:
        council = Council.objects.get(name=club["council_name"])
        obj, created = Club.objects.get_or_create(
            name=club["name"],
            council=council,
            defaults={
                "head": club["head"],
                "description": club["description"],
                "upcoming_events": "",
                "members": "",
                "projects": "",
            }
        )
        if created:
            print(f"Added: {club['name']}")
        else:
            print(f"Skipped (Already exists): {club['name']}")
    except Council.DoesNotExist:
        print(f"Council not found: {club['council_name']}")

print("Cultural Club database population completed!")
