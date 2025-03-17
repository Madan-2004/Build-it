from django.db import models

class Council(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="councils/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# class Users(models.Model):
#     STATUS_CHOICES = [
#         ("head", "Head"),
#         ("member", "Member"),
#     ]

#     name = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)
#     roll_no = models.CharField(max_length=20, unique=True)
#     branch = models.CharField(max_length=100)
#     degree = models.CharField(max_length=100)
#     status = models.CharField(max_length=10, choices=STATUS_CHOICES)

#     def __str__(self):
#         return f"{self.name} ({self.status})"
    
# class Club(models.Model):
#     name = models.CharField(max_length=255)  # Mandatory
#     head = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, blank=True, related_name="headed_clubs")  # Optional
#     description = models.TextField(blank=True, null=True)  # Optional
#     upcoming_events = models.TextField(blank=True, null=True)  # Optional
#     members = models.ManyToManyField(Users, related_name="member_clubs", blank=True)  # Optional
#     projects = models.TextField(blank=True, null=True)  # Optional
#     council = models.ForeignKey(Council, on_delete=models.CASCADE, related_name="clubs")  # Mandatory

#     def __str__(self):
#         return self.name

#     def __str__(self):
#         return self.name
    
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