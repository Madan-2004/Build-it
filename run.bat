#!/bin/bash


start cmd /k "cd backend && cd backend && python manage.py runserver"


start cmd /k "cd frontend && npm run dev"
