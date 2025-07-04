# Generated by Django 5.1.4 on 2025-03-10 15:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_club_email_club_website'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='club',
            name='projects',
        ),
        migrations.RemoveField(
            model_name='club',
            name='upcoming_events',
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='project_images/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('club', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projects', to='app.club')),
            ],
        ),
    ]
