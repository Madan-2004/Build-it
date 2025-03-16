from django.core.management.base import BaseCommand
from events.models import Event, Agenda, Speaker
from datetime import date

class Command(BaseCommand):
    help = "Seed the database with extensive dummy event data"

    def handle(self, *args, **kwargs):
        Event.objects.all().delete()
        Agenda.objects.all().delete()
        Speaker.objects.all().delete()

        events_data = [
            {
                "title": "Hackathon 2024 - IIT Indore",
                "date": date(2024, 3, 10),
                "poster": "/data/media/images/general/dummy.jpg",
                "description": (
                    "IIT Indore presents its flagship hackathon, bringing together top coders, "
                    "innovators, and problem-solvers to build real-world solutions in 24 hours. "
                    "Participants will compete in teams, tackle challenges from industry sponsors, "
                    "and have the opportunity to win amazing prizes!"
                ),
                "venue": "Innovation Lab, IIT Indore",
                "category": "Technical",
                "register_link": "#",
                "fees": "₹500 per team",
                "schedule": "24-Hour Event",
                "contact": "hackathon@iitindore.ac.in",
                "agenda": [
                    {"time": "9:00 AM", "topic": "Opening Ceremony"},
                    {"time": "10:00 AM", "topic": "Problem Statement Reveal"},
                    {"time": "12:00 PM", "topic": "Coding Begins"},
                    {"time": "8:00 PM", "topic": "First Round of Evaluations"},
                    {"time": "10:00 AM (Next Day)", "topic": "Final Presentations & Winner Announcement"}
                ],
                "speakers": [
                    {"name": "Dr. Rahul Sharma", "bio": "AI & ML Expert, IIT Indore"},
                    {"name": "Ms. Priya Mehta", "bio": "Software Engineer at Google"},
                    {"name": "John Doe", "bio": "CTO, StartupX"},
                ]
            },
            {
                "title": "Cultural Night - Tarang 2024",
                "date": date(2024, 3, 25),
                "poster": "/data/media/images/general/dummy.jpg",
                "description": (
                    "Join us for a mesmerizing evening of music, dance, and drama at Tarang 2024. "
                    "Experience electrifying performances from IIT Indore's finest artists, along "
                    "with guest appearances from renowned performers. End the night with an epic DJ party!"
                ),
                "venue": "Open Air Theatre, IIT Indore",
                "category": "Cultural",
                "register_link": "#",
                "fees": "Free Entry",
                "schedule": "6:00 PM - 11:00 PM",
                "contact": "tarang@iitindore.ac.in",
                "agenda": [
                    {"time": "6:00 PM", "topic": "Inaugural Dance Performance"},
                    {"time": "7:00 PM", "topic": "Music Band Performances"},
                    {"time": "8:00 PM", "topic": "Drama & Stand-up Comedy Acts"},
                    {"time": "9:30 PM", "topic": "DJ Night & Closing Ceremony"}
                ],
                "speakers": [
                    {"name": "DJ Shadow", "bio": "Renowned International DJ"},
                    {"name": "Neha Sharma", "bio": "Bollywood Playback Singer"},
                ]
            },
            {
                "title": "IIT Sports Fest - Aaveg 2024",
                "date": date(2024, 4, 5),
                "poster": "/data/media/images/general/dummy.jpg",
                "description": (
                    "Aaveg 2024 is the premier inter-college sports fest featuring thrilling competitions "
                    "across cricket, football, basketball, athletics, and more. Join us to experience "
                    "the spirit of sportsmanship and witness the best athletes compete for glory."
                ),
                "venue": "Sports Complex, IIT Indore",
                "category": "Sports",
                "register_link": "#",
                "fees": "₹100 per participant",
                "schedule": "9:00 AM - 7:00 PM",
                "contact": "aaveg@iitindore.ac.in",
                "agenda": [
                    {"time": "9:00 AM", "topic": "Opening Ceremony & Torch Run"},
                    {"time": "10:00 AM", "topic": "Cricket & Basketball Matches Begin"},
                    {"time": "2:00 PM", "topic": "Athletics & Marathon"},
                    {"time": "6:00 PM", "topic": "Day 1 Closing Ceremony"},
                    {"time": "Final Day", "topic": "Prize Distribution & Closing Ceremony"}
                ],
                "speakers": [
                    {"name": "Kapil Dev", "bio": "Former Indian Cricket Captain"},
                    {"name": "Mary Kom", "bio": "World Champion Boxer"},
                ]
            },
            {
                "title": "Machine Learning Workshop",
                "date": date(2024, 4, 12),
                "poster": "https://via.placeholder.com/600x300",
                "description": (
                    "A hands-on workshop designed for aspiring AI enthusiasts. Learn the fundamentals of "
                    "Machine Learning using Python and TensorFlow. Build real-world models and enhance "
                    "your skills with expert guidance."
                ),
                "venue": "Data Science Lab, IIT Indore",
                "category": "Workshops",
                "register_link": "#",
                "fees": "₹300 for students, ₹700 for professionals",
                "schedule": "10:00 AM - 5:00 PM",
                "contact": "mlworkshop@iitindore.ac.in",
                "agenda": [
                    {"time": "10:00 AM", "topic": "Introduction to Machine Learning"},
                    {"time": "11:00 AM", "topic": "Supervised vs. Unsupervised Learning"},
                    {"time": "12:30 PM", "topic": "Hands-on with TensorFlow & PyTorch"},
                    {"time": "2:00 PM", "topic": "Building an ML Model from Scratch"},
                    {"time": "4:00 PM", "topic": "Q&A and Certificate Distribution"}
                ],
                "speakers": [
                    {"name": "Dr. Ankit Verma", "bio": "Professor, Data Science, IIT Indore"},
                    {"name": "Ms. Neha Kapoor", "bio": "Machine Learning Engineer at Microsoft"},
                ]
            }
        ]

        for event_data in events_data:
            event = Event.objects.create(
                title=event_data["title"],
                date=event_data["date"],
                poster=event_data["poster"],
                description=event_data["description"],
                venue=event_data["venue"],
                category=event_data["category"],
                register_link=event_data["register_link"],
                fees=event_data["fees"],
                schedule=event_data["schedule"],
                contact=event_data["contact"]
            )

            for agenda_item in event_data["agenda"]:
                Agenda.objects.create(event=event, time=agenda_item["time"], topic=agenda_item["topic"])

            for speaker in event_data["speakers"]:
                Speaker.objects.create(event=event, name=speaker["name"], bio=speaker["bio"])

        self.stdout.write(self.style.SUCCESS("Successfully seeded the database with 4+ events!"))
