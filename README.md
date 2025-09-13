# 🏛️ Student Gymkhana Management Platform

**Deployed Website:** [https://build-it-xi.vercel.app/](https://build-it-xi.vercel.app/)

> A full-stack platform built to streamline how IIT Indore's Student Gymkhana and its clubs manage events, inventory, and finances — all from a unified dashboard.

---

## 🚀 Project Overview

This platform combines a snappy React-powered frontend with a reliable Django REST backend. Students can browse upcoming activities, clubs can propose events and track their budgets, and admins can approve requests and manage inventory — all in real-time.

---

## 🏗️ High-Level Architecture

```
┌────────────┐      REST / JWT       ┌──────────────┐
│  React UI  │  ⇆  (HTTPS JSON) ⇆   │  Django API  │
└────────────┘                      └──────────────┘
     ▲  ▲                                  │
     │  └── Vite Dev Server                ▼
     │                                   SQLite
     └──── Service Worker (PWA)
```

* **Frontend**: Built with Vite + React 19, handles routing, state management, and theming.
* **Backend**: Django 3.2 with Django REST Framework (DRF), secured via JWT tokens.

---

## ✨ Core Features

* 📅 Event proposal, approval workflows, and calendar views
* 🧰 Inventory booking with stock-level alerts
* 💰 Budget planning, expense tracking, and export to **PDF/Excel**
* 🔒 Role-based access control (Student, Club Head, Admin)
* 📊 Analytics dashboards with Chart.js
* 📱 PWA-ready, responsive UI with dark mode
* 🔔 Real-time toast notifications + email triggers

---

## 🔧 Tech Stack

### 🖥️ Frontend

| Tool                               | Role                          |
| ---------------------------------- | ----------------------------- |
| **React 19** + **Vite 6**          | Fast SPA framework & bundler  |
| **Tailwind CSS 3**                 | Utility-first styling         |
| **MUI 6**                          | Pre-built UI components       |
| **React Router v7**                | Client-side routing           |
| **Framer Motion / AOS**            | Page and component animations |
| **Chart.js** + **React-Chartjs-2** | Data visualization            |

### 🧠 Backend

| Tool                                  | Role                               |
| ------------------------------------- | ---------------------------------- |
| **Django 3.2**                        | Python web framework               |
| **Django REST Framework**             | RESTful API creation               |
| **Simple-JWT**                        | Token-based authentication         |
| **Django AllAuth** / **dj-rest-auth** | Auth, registration, password reset |
| **django-cors-headers**               | Cross-origin request handling      |
| **Gunicorn**                          | Production WSGI server             |

### 🛠️ Tooling / DevOps

* **ESLint + Prettier** – Code formatting & linting
* **dotenv** – Environment variable management
* **GitHub Actions** – CI for linting and tests

---

## 📁 Repository Structure

```
Backend/Backend/         # Django project and apps
Frontend/                # React + Vite source code
createFiles.js           # Script to generate demo content
docs/                    # Auto-generated API documentation
```

---

## ⚡ Quick Start

### Backend

```bash
python -m venv venv && source venv/bin/activate
pip install -r Backend/Backend/requirements.txt
python Backend/Backend/manage.py migrate
python Backend/Backend/manage.py runserver
```

### Frontend (in a new terminal)

```bash
cd Frontend
npm install
npm run dev
```

Then open your browser at [http://localhost:5173](http://localhost:5173) — the Vite dev server will proxy API calls to Django at `http://localhost:8000`.

---

## 🙌 Acknowledgement

Built as part of **Build It Hackathon**, an intra-college hackathon hosted at **IIT Indore**.

---
