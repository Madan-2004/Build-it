import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")  # Replace with your project name
django.setup()

from app.models import CouncilHead  # Replace `your_app` with your actual Django app name

# Sample Council Heads Data
COUNCIL_HEADS = [
    {
        "name": "SANKET PANIGRAHI",
        "position": "President Student's Gymkhana",
        "email": "sanket@iiti.ac.in",
        "linkedin": "https://www.linkedin.com/in/sanket-panigrahi",
        "image": ""  # You can set an image URL here if needed
    },
    {
        "name": "SHIVANSH MALPANI",
        "position": "GS Cultural Affairs",
        "email": "shivansh@iiti.ac.in",
        "linkedin": "https://www.linkedin.com/in/shivansh-malpani",
        "image": ""
    },
    {
        "name": "B RITHVIK",
        "position": "GS Academics UG",
        "email": "rithvik@iiti.ac.in",
        "linkedin": "https://www.linkedin.com/in/rithvik",
        "image": ""
    },
    {
        "name": "SAURAV SHARMA",
        "position": "GS Hostel Affairs",
        "email": "saurav@iiti.ac.in",
        "linkedin": "https://www.linkedin.com/in/saurav-sharma",
        "image": ""
    },
    {
        "name": "GAURAV RAJPUT",
        "position": "GS MAC",
        "email": "gaurav@iiti.ac.in",
        "linkedin": "https://www.linkedin.com/in/gaurav-rajput",
        "image": ""
    },
    {
        "name": "SHIVAM SUNDRAM",
        "position": "GS Science and Technology",
        "email": "shivam@iiti.ac.in",
        "linkedin": "https://www.linkedin.com/in/shivam-sundram",
        "image": ""
    },
    {
        "name": "ADI RAJ",
        "position": "GS Academics PG",
        "email": "adi@iiti.ac.in",
        "linkedin": "https://www.linkedin.com/in/adi-raj",
        "image": ""
    },
    {
        "name": "K NIKETH REDDY",
        "position": "GS COA",
        "email": "niketh@iiti.ac.in",
        "linkedin": "https://www.linkedin.com/in/niketh-reddy",
        "image": ""
    },
    {
        "name": "NIKHIL ESWARAN",
        "position": "GS Sports Affairs",
        "email": "nikhil@iiti.ac.in",
        "linkedin": "https://www.linkedin.com/in/nikhil-eswaran",
        "image": ""
    }
]

# Insert Data
for head in COUNCIL_HEADS:
    obj, created = CouncilHead.objects.get_or_create(email=head["email"], defaults=head)
    if created:
        print(f"✅ Added: {head['name']}")
    else:
        print(f"⚠️ Already Exists: {head['name']}")

print("✅ Council heads population complete!")
