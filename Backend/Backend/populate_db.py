import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")  # Replace 'your_project' with your actual project name
django.setup()

from app.models import Council  # Replace 'app' with your actual app name

# List of councils to populate
council_data = [
    {
        "name": "Science and Technology Council",
        "description": "The SnT Council of IIT Indore is a community of science and technology enthusiasts who love to explore the unthinkable.",
        "image": "councils/science_tech.jpg",  # Ensure this image is in the media folder
    },
    {
        "name": "Cultural Council",
        "description": "The Cultural Council of IIT Indore orchestrates a diverse array of cultural events throughout the year, fostering artistic expression and community engagement among students and faculty alike.",
        "image": "councils/cultural.jpg",
    },
    {
        "name": "Sports Council",
        "description": "The Sports Council is the voice and face of IIT Indore sports community, responsible for management and conduction of all sporting events in the campus.",
        "image": "councils/sports.jpg",
    },
    {
        "name": "Academic Council",
        "description": "The Academics Council has been trusted with the responsibility of managing executive activities in two of the most crucial aspects of student life - Academics and Career.",
        "image": "councils/academic.jpg",
    },
]

# Insert data into the database
for council in council_data:
    obj, created = Council.objects.get_or_create(
        name=council["name"],
        defaults={
            "description": council["description"],
            "image": council["image"],
        }
    )
    if created:
        print(f"Added: {council['name']}")
    else:
        print(f"Skipped (Already exists): {council['name']}")

print("Database population completed!")
