# Task Management Application

A full-stack task management system with user authentication, task CRUD operations, and dashboard analytics.

---

## Demo Links

Frontend (Render):  
https://task-management-4-ohvm.onrender.com

Backend API (Render):  
https://****render.com.com

---

## Overview

This project allows users to:

- Register and log in securely using JWT authentication  
- Create, update, and delete tasks  
- Mark tasks as completed or pending  
- View task statistics in dashboard charts  
- Maintain separate tasks per user  
- Access a responsive UI built with React  

It uses React (Vite) for the frontend and Node.js (Express) for the backend along with Supabase as the database.

---

## Features

- User authentication (JWT)
- Protected routes
- Create, read, update, delete tasks
- Completed vs pending tasks tracking
- Visual charts and analytics
- Persistent sessions stored in localStorage
- RESTful backend APIs
- Deployment ready configuration

---

## Tech Stack

### Frontend
- React
- Vite
- Axios
- React Router
- Chart library (Recharts / Chart.js)

### Backend
- Node.js
- Express.js
- Supabase
- JSON Web Tokens
- bcryptjs
- CORS
- Express Validator

### Deployment
- Render (Backend Web Service)
- Render (Frontend Static Site)

---

## Project Structure
```text
Task-Management/
│
├── backend/
│ ├── server.js
│ ├── routes/
│ ├── models/
│ ├── config/
│ └── middleware/
│
└── frontend/
├── src/
├── public/
├── vite.config.js
├── index.html
└── package.json
```

---

## Environment Variables

### Backend (.env)
```text
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_ANON_KEY=SUPABADE_API_KEY
SUPABASE_SERVICE_ROLE_KEY=SUPABASE_API_KEY
JWT_SECRET=YOUR_JWT_KEY
PORT=5000
```

### Frontend (.env)
```text
VITE_API_URL=https://****.onrender.com
```

---

## Installation and Setup (Local Development)

### 1. Clone the repository
```text
git clone https://github.com/your-username/Task-Management.git
cd Task-Management
```

### 2. Backend setup
```text
cd backend
npm install
npm run dev
Backend runs on:http://localhost:5000
```

### 3. Frontend setup
```text
cd frontend
npm install
npm run dev
Frontend runs on:http://localhost:5173
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|---------|--------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get logged in user |

### Tasks

| Method | Endpoint | Description |
|--------|---------|--------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create new task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

---

## Deployment Guide

### Backend Deployment (Render Web Service)

- Select repository
- Root Directory → `backend`
- Build Command → `npm install`
- Start Command → `npm start`
- Add all environment variables

### Frontend Deployment (Render Static Site)

- Service Type → Static Site
- Root Directory → `frontend`
- Build Command: `npm run build`
---

## License

This project is licensed under the MIT License.

---

## Author

Shiva SB
