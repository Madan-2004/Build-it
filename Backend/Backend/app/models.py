from django.db import models

class Council(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="councils/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name



class Users(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    image = models.ImageField(upload_to="user_images/", blank=True, null=True)  # Optional profile picture

    def __str__(self):
        return self.name


    def __str__(self):
        return self.name
class Club(models.Model):
    name = models.CharField(max_length=255)  # Mandatory
    head = models.ForeignKey(
        Users, on_delete=models.SET_NULL, null=True, blank=True, related_name="headed_clubs"
    )  # Optional
    description = models.TextField(blank=True, null=True)  # Optional

    council = models.ForeignKey(Council, on_delete=models.CASCADE, related_name="clubs")  # Mandatory
    image = models.ImageField(upload_to="club_images/", blank=True, null=True)

    # Many-to-Many relationship with users via an intermediate model
    members = models.ManyToManyField(Users, through="ClubMembership", related_name="member_clubs", blank=True)
    website = models.URLField(default="https://gymkhana.iiti.ac.in/", blank=True)  # Default club website URL
    email = models.EmailField(default="contact@example.com", blank=True)  # Default email
    def __str__(self):
        return self.name
    @property
    def members_count(self):
        return self.members.count() if hasattr(self, 'members') else 0

    @property
    def projects_count(self):
        return self.projects.count() if hasattr(self, 'projects') else 0


class ClubMembership(models.Model):
    STATUS_CHOICES = [
        ("head", "Head"),
        ("member", "Member"),
    ]

    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    club = models.ForeignKey(Club, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="member")

    class Meta:
        unique_together = ("user", "club")  # Prevent duplicate memberships

    def __str__(self):
        return f"{self.user.name} - {self.club.name} ({self.status})"    


class Project(models.Model):
    club = models.ForeignKey("Club", on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="project_images/")

    def __str__(self):
        return f"Image for {self.project.title}"  

class CouncilHead(models.Model):
    name = models.CharField(max_length=255)  # Full name of the council head
    position = models.CharField(max_length=100)  # Free text position field
    email = models.EmailField(unique=True, blank=True, null=True)  # Optional email field
    linkedin = models.URLField(blank=True, null=True)  # LinkedIn profile
    image = models.ImageField(upload_to="council_heads/", blank=True, null=True)  # Profile image

    def __str__(self):
        return f"{self.name} - {self.position}"    

from django.db import models

class Inventory(models.Model): 
    club = models.OneToOneField(
        'Club', 
        on_delete=models.CASCADE, 
        related_name="inventory", 
        null=True, 
        blank=True
    )

    council = models.ForeignKey(  # 🔹 Allow multiple clubs under one council
        'Council', 
        on_delete=models.CASCADE, 
        related_name="inventories",  # Changed to plural as it holds multiple
        null=True, 
        blank=True
    )

    budget_allocated = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    budget_used = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):  
        entity = self.club.name if self.club else self.council.name if self.council else "Unknown"
        return f"Inventory for {entity} (Allocated: {self.budget_allocated}, Used: {self.budget_used})"

    @property
    def remaining_budget(self):
        budget_allocated = float(self.budget_allocated)
        budget_used = float(self.budget_used)
        return self.budget_allocated - self.budget_used  


class ProjectInventory(models.Model):
    """🔹 Inventory for Projects"""
    project = models.OneToOneField(
        Project, on_delete=models.CASCADE, related_name="inventory"
    )
    budget_allocated = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    budget_used = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Inventory for Project: {self.project.title}"

    @property
    def remaining_budget(self):
        budget_allocated = float(self.budget_allocated)
        budget_used = float(self.budget_used)
        return self.budget_allocated - self.budget_used


# class EventInventory(models.Model):
#     """🔹 Inventory for Events"""
#     event = models.OneToOneField(
#         Event, on_delete=models.CASCADE, related_name="inventory"
#     )
#     budget_allocated = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
#     budget_used = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

#     def __str__(self):
#         return f"Inventory for Event: {self.event.title}"

#     @property
#     def remaining_budget(self):
#         return self.budget_allocated - self.budget_used


class InventoryItem(models.Model):
    """🔹 Inventory Items for Project and Event Inventories"""
    CONSUMABLE_CHOICES = [
        ('consumable', 'Consumable'),
        ('non_consumable', 'Non-Consumable'),
    ]

    project_inventory = models.ForeignKey(
        ProjectInventory, on_delete=models.CASCADE, related_name="items", null=True, blank=True
    )
    # event_inventory = models.ForeignKey(
    #     EventInventory, on_delete=models.CASCADE, related_name="items", null=True, blank=True
    # )

    name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    consumable = models.CharField(max_length=15, choices=CONSUMABLE_CHOICES)

    def __str__(self):
        # entity = self.project_inventory.project.title if self.project_inventory else self.event_inventory.event.title
        return f"{self.name} ({self.consumable}) - {self.project_inventory.project.title}"

    @property
    def total_cost(self):
        """🔹 Calculate total cost of items"""
        return self.quantity * self.cost