import os
import django
from django.db.models import Sum

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")  # Replace with your project name
django.setup()

from app.models import Club, Council, Inventory  # Replace with your app name

def populate_inventory():
    # Clear existing inventory data to avoid duplicates
    Inventory.objects.all().delete()
    
    print("Cleared existing inventory data.")

    # ✅ Create inventory for each club
    clubs = Club.objects.select_related('council')
    for club in clubs:
        # budget_allocated = round((10000 + club.id * 500), 2)  # Example allocation logic
        # budget_used = round((budget_allocated * 0.6), 2)  # Example usage logic (60% used)
        budget_allocated  = 0
        budget_used = 0

        Inventory.objects.create(
            club=club,
            council=club.council,
            budget_allocated=budget_allocated,
            budget_used=budget_used
        )
        print(f"✅ Created inventory for club: {club.name} (Council: {club.council.name})")

    # ✅ Create inventory for each council (aggregated from clubs)
    councils = Council.objects.prefetch_related('clubs')
    for council in councils:
        # total_allocated = council.clubs.aggregate(
        #     # total_allocated=Sum('inventory__budget_allocated'),
        #     # total_used=Sum('inventory__budget_used')
        # )

        # budget_allocated = total_allocated['total_allocated'] or 0
        # budget_used = total_allocated['total_used'] or 0
        budget_allocated = 0
        budget_used = 0

        Inventory.objects.create(
            club=None,
            council=council,
            budget_allocated=budget_allocated,
            budget_used=budget_used
        )
        print(f"✅ Created inventory for council: {council.name} (Total Allocated: {budget_allocated}, Total Used: {budget_used})")

populate_inventory()