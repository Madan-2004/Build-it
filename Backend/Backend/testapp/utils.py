import re
from datetime import datetime
from rest_framework.exceptions import ValidationError

def decode_voter_email(email):
    regex = r"^(phd|mt|msc|b?([a-z]+|\d{2}))(\d{2})(\d+)@iiti\.ac\.in$"
    match = re.match(regex, email, re.IGNORECASE)

    if not match:
        raise ValidationError("Invalid IIT Indore email format")

    prefix, branch_or_batch, year, roll_number = match.groups()
    current_year = datetime.now().year % 100  # Last two digits of the year
    entry_year = int(year)
    academic_year = current_year - entry_year

    degree_map = {
        "phd": "PhD",
        "mt": "MTech",
        "msc": "MSc",
        "b": "BTech"
    }

    branch_map = {
        "01": "CSE", "02": "EE", "03": "ME", "04": "CIVIL", "05": "MEMS",
        "cse": "CSE", "ee": "EE", "me": "ME", "civil": "CIVIL", "mems": "MEMS",
        "che": "CHE", "ep": "EP", "sse": "SSE", "mc": "MC"
    }

    if prefix.lower() in ["phd", "mt", "msc"]:
        degree = degree_map[prefix.lower()]
        branch = None  # No specific branch for PhD, MTech, MSc
    else:
        degree = "BTech"
        branch = branch_map.get(branch_or_batch.lower(), "Unknown Branch")

    # Determine academic status
    def year_suffix(yr):
        return f"{yr}{'st' if yr == 1 else 'nd' if yr == 2 else 'rd' if yr == 3 else 'th'} Year"

    max_years = 4 if degree == "BTech" else (2 if degree == "MTech" else 5)
    if degree == "PhD":
        status = "5+ Year" if academic_year > 5 else year_suffix(academic_year)
    else:
        status = "Alumni" if academic_year > max_years else year_suffix(academic_year)

    return {
        "email": email,
        "degree": degree,
        "branch": branch,
        "status": status,
        "roll_no": f"{branch_or_batch}{roll_number}"  # Combine text + number part of roll number
    }



# import csv,os
# from django.core.files.storage import default_storage
# from .models import VoterFile

# # Global variable to store voter data in memory
# VOTER_DATA = {}

# def load_voter_data():
#     global VOTER_DATA
#     VOTER_DATA = {}  # Reset dictionary

#     # Get latest uploaded voter file change thsi to be based on election
#     latest_file = VoterFile.objects.last()
#     if not latest_file:
#         return False  # No file uploaded yet

#     file_path = latest_file.file.path
#     print(f"Reading voter data from: {file_path}")

#     if not os.path.exists(file_path):
#         print("⚠️ No voter list file found. Skipping data load.")
#         return False

#     try:
#         with open(file_path, "r", encoding="utf-8") as file:
#             reader = csv.DictReader(file)
#             for row in reader:
#                 email = row["Email"].strip().lower()
#                 VOTER_DATA[email] = {
#                     "roll_no": row["Roll Number"].strip(),
#                     "name": row["Name"].strip(),
#                     "degree": row["Program"].strip(),
#                     "branch": row["Department"].strip(),
#                 }

#         # ✅ Print the top 5 voter entries after reading the CSV file
#         sample_voters = list(VOTER_DATA.items())[:5]  # Get first 5 entries
#         print("🔍 Top 5 VOTER_DATA entries:", sample_voters)

#         print(f"✅ Successfully loaded {len(VOTER_DATA)} voter records.")
#         return True

#     except Exception as e:
#         print(f"❌ Error loading voter data: {e}")
#         return False
import csv
import os
from django.core.cache import cache

def load_voter_data():
    """Loads voter data from the latest uploaded CSV file and stores it in Django's cache."""
    voter_data = {}

    file_path = "Backend/media/voter_files/Voters_List_-_Student_Gymkhana_Elections_2025_-_Sheet1.csv"  # Adjust as needed

    if not os.path.exists(file_path):
        print("⚠️ No voter list file found. Skipping data load.")
        return False

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            for row in reader:
                email = row["Email"].strip().lower()
                voter_data[email] = {
                    "roll_no": row["Roll Number"].strip(),
                    "name": row["Name"].strip(),
                    "degree": row["Program"].strip(),
                    "branch": row["Department"].strip(),
                }

        # ✅ Store data in Django's cache
        cache.set("VOTER_DATA", voter_data, timeout=None)  # Data persists until manually cleared
        print(f"✅ Successfully loaded {len(voter_data)} voter records into cache.")

        return True

    except Exception as e:
        print(f"❌ Error loading voter data: {e}")
        return False
