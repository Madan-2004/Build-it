import os
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")  # Replace with actual project name
django.setup()

from app.models import User  # Replace with actual app name

club_data = [
    {"head": "Keshav Aggarval"}, {"head": "Mrunal Nandpure"}, {"head": "Sameer Lakkad"},
    {"head": "Prasoon Pandey"}, {"head": "Harsh Sharma"}, {"head": "Arnav Jain"},
    {"head": "Pulkit Gupta"}, {"head": "Vedant Dinkar"}, {"head": "Devesh Lokare"},
    {"head": "Arjun S Nair"}, {"head": "Dhruv Jain"}, {"head": "Siddhesh Waje"},
    {"head": "Bhawna Chaudhary"}, {"head": "Mansi Singh"}, {"head": "Mukul Ghunawat"},
    {"head": "Aaditya Deshpande"}, {"head": "Anshul Rathodia"}, {"head": "Neelesh Chourasia"},
    {"head": "Saket Thamke"}, {"head": "Yogesh Patidar"}, {"head": "Biradhar Saketh"},
    {"head": "Yash Khare"}, {"head": "Aviral Sharma"}, {"head": "Samrudhhee"},
    {"head": "Akshat Mishra"}, {"head": "Gouriveni Gokul"}, {"head": "Kanak Nagar"},
    {"head": "Vijit Balsori"}, {"head": "Anshul Vijaywargiya"}, {"head": "Anand Prakash"},
    {"head": "Dushyant Chaudhari"}, {"head": "Tejaswini Pappala"}, {"head": "Harshit Gupta"},
    {"head": "Chirag Sonwane"}, {"head": "Abhay Kumar Singh"}, {"head": "Nehansh Mankad"},
    {"head": "Umang Dosi"}, {"head": "Raina Tathed"}, {"head": "Hrishikesh Jawale"}
]

default_branch = "Computer Science and Engineering"
default_degree = "B.Tech"

for i, club in enumerate(club_data, start=1):  # Start from 1 for roll numbers
    name = club["head"].strip()
    if not name:
        continue  # Skip empty names

    email = f"{name.lower().replace(' ', '.')}{i}@iiti.ac.in"
    roll_no = f"CS22{100 + i}"  # Avoid leading 0 issues, starts from CS22101

    user, created = User.objects.update_or_create(
        email=email.lower(),  # Ensure lowercase email
        defaults={"name": name, "roll_no": roll_no, "Department": default_branch, "degree": default_degree}
    )

    if created:
        print(f"✅ Created User: {name} ({email})")
    else:
        print(f"🔄 Updated User: {name} ({email})")
