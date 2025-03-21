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
        # Ensure media/event_posters directory exists
        event_posters_dir = os.path.join(settings.MEDIA_ROOT, "event_posters")
        os.makedirs(event_posters_dir, exist_ok=True)

        # Define a default poster image path
        default_poster_path = os.path.join(event_posters_dir, "default.png")

        # If the default image is missing, download a placeholder
        if not os.path.exists(default_poster_path):
            urllib.request.urlretrieve("https://via.placeholder.com/600x300", default_poster_path)

        # Clear existing event-related data
        Event.objects.all().delete()

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
                "agenda": {"time": "9:00 AM", "topic": "Opening Ceremony"},
                "speaker": {"name": "Dr. Rahul Sharma", "bio": "AI & ML Expert, IIT Indore"},
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
                "agenda": {"time": "10:00 AM", "topic": "Introduction to ML"},
                "speaker": {"name": "Dr. Ankit Verma", "bio": "Professor, Data Science, IIT Indore"},
            }
        ]

        for event_data in events_data:
            # Handle ImageField properly
            poster_filename = event_data.get("poster", None)
            poster_file = None

            if poster_filename:
                poster_path = os.path.join(settings.MEDIA_ROOT, poster_filename)

                if not os.path.exists(poster_path):
                    poster_path = default_poster_path  # Use default if missing

                poster_file = File(open(poster_path, "rb"))

            # Create event instance
            event = Event.objects.create(
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

            # Save poster
            if poster_file:
                event.poster.save(os.path.basename(poster_path), poster_file, save=True)

            # Create single agenda entry
            if "agenda" in event_data:
                Agenda.objects.create(event=event, **event_data["agenda"])

            # Create single speaker entry
            if "speaker" in event_data:
                Speaker.objects.create(event=event, **event_data["speaker"])

        self.stdout.write(self.style.SUCCESS("Successfully seeded the database with event data! 🚀"))
