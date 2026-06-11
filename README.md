CookBook - Recipe Sharing & Meal Planning Platform

## Description
A full-stack recipe platform where users can browse recipes, save favorites, create meal plans, and leave comments.

## Tech Stack
- **Frontend:** React, React Router
- **Backend:** Express, JWT Authentication
- **Database:** PostgreSQL

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL

### Backend Setup
1. Navigate to server folder:
cd server
2. Install dependencies:
npm install
3. Create `.env` file:
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cookbook
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
4. Create database and run schema:
psql -U postgres -c "CREATE DATABASE cookbook"
psql -U postgres -d cookbook -f db/schema.sql
5. Start server:
npm run dev

### Frontend Setup
1. Navigate to client folder:
cd client
2. Install dependencies:
npm install
3. Start app:
npm start

## Features
- Register/Login/Logout
- Browse and search recipes
- Filter by difficulty and cooking time
- Create your own recipes
- Save favorite recipes
- Leave comments
- Build weekly meal plans