import os
import urllib.request
from django.core.files import File
from django.core.management.base import BaseCommand
from django.conf import settings
from events.models import Event, Agenda, Speaker
from datetime import date

class Command(BaseCommand):
    help = "Seed the database with extensive dummy event data"

    def handle(self, *args, **kwargs):
        # Delete existing records to avoid duplicates
        Event.objects.all().delete()
        Agenda.objects.all().delete()
        Speaker.objects.all().delete()

        # Define a default poster image path
        default_poster_path = os.path.join(settings.MEDIA_ROOT, "event_posters/default.png")

        events_data = [
            {
                "title": "Hackathon 2024 - IIT Indore",
                "date": date(2024, 3, 10),
                "poster": "event_posters/default.png",  # Local image
                "description": "A 24-hour coding competition...",
                "venue": "Innovation Lab, IIT Indore",
                "category": "Technical",
                "register_link": "#",
                "fees": "₹500 per team",
                "schedule": "24-Hour Event",
                "contact": "hackathon@iitindore.ac.in",
                "agenda": [
                    {"time": "9:00 AM", "topic": "Opening Ceremony"},
                    {"time": "10:00 AM", "topic": "Problem Statement Reveal"},
                ],
                "speakers": [
                    {"name": "Dr. Rahul Sharma", "bio": "AI & ML Expert, IIT Indore"},
                ]
            },
            {
                "title": "Machine Learning Workshop",
                "date": date(2024, 4, 12),
                "poster": "event_posters/default.png",  
                "description": "A hands-on workshop on AI and ML...",
                "venue": "Data Science Lab, IIT Indore",
                "category": "Workshops",
                "register_link": "#",
                "fees": "₹300 for students, ₹700 for professionals",
                "schedule": "10:00 AM - 5:00 PM",
                "contact": "mlworkshop@iitindore.ac.in",
                "agenda": [
                    {"time": "10:00 AM", "topic": "Introduction to ML"},
                    {"time": "10:29 AM", "topic": "Introduction to ML"},
                    {"time": "10:30 AM", "topic": "Introduction to ML"},
                ],
                "speakers": [
                    {"name": "Dr. Ankit Verma", "bio": "Professor, Data Science, IIT Indore"},
                ]
            }
            
        ]

        for event_data in events_data:
            # Handle ImageField properly
            poster_filename = event_data.get("poster", None)
            poster_file = None

            if poster_filename:
                if poster_filename.startswith("http"):  # Remote image
                    poster_path = os.path.join(settings.MEDIA_ROOT, "event_posters", os.path.basename(poster_filename))
                    urllib.request.urlretrieve(poster_filename, poster_path)  # Download the image
                    poster_file = File(open(poster_path, "rb"))
                else:  # Local image
                    poster_path = os.path.join(settings.MEDIA_ROOT, poster_filename)
                    if os.path.exists(poster_path):
                        poster_file = File(open(poster_path, "rb"))
                    else:
                        poster_file = File(open(default_poster_path, "rb"))  # Use default if missing

            # Create event instance
            event = Event(
                title=event_data["title"],
                date=event_data["date"],
                description=event_data["description"],
                venue=event_data["venue"],
                category=event_data["category"],
                register_link=event_data["register_link"],
                fees=event_data["fees"],
                schedule=event_data["schedule"],
                contact=event_data["contact"],
            )

            if poster_file:
                event.poster.save(os.path.basename(poster_path), poster_file, save=False)  # Assign image

            event.save()  # Save event to database

            # Create agenda entries
            for agenda_item in event_data.get("agenda", []):
                Agenda.objects.create(event=event, time=agenda_item["time"], topic=agenda_item["topic"])

            # Create speaker entries
            for speaker in event_data.get("speakers", []):
                Speaker.objects.create(event=event, name=speaker["name"], bio=speaker["bio"])

        self.stdout.write(self.style.SUCCESS("Successfully seeded the database with event data! 🚀"))