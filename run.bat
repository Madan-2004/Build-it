@echo off
start cmd /k "cd backend\backend && python manage.py runserver"
start cmd /k "cd frontend && npm run dev"
