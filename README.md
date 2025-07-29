# Project 2 - CSE 341 API (Items + Auth)

This is a RESTful API built with Node.js, Express, MongoDB, and Passport for Google OAuth and JWT authentication. It supports full CRUD operations on an `items` collection and includes API documentation via Swagger.

---

## 🚀 Live Demo

- 🌐 Render URL: [https://cse341-project2-elpb.onrender.com]
- 📘 Swagger Docs: [https://cse341-project2-elpb.onrender.com/api-docs]

---

## 📦 Tech Stack

- Node.js
- Express.js
- MongoDB
- Passport.js (Google OAuth)
- JSON Web Token (JWT)
- Swagger (OpenAPI 3)
- express-validator

---

## 📁 API Endpoints Overview

### 🔐 Auth Endpoints

| Method | Endpoint          | Description                     |
|--------|-------------------|---------------------------------|
| POST   | `/auth/register`  | Register with email/password    |
| POST   | `/auth/login`     | Login with email/password       |
| POST   | `/auth/google`    | Login with Google OAuth token   |
| GET    | `/auth/protected` | Protected route (JWT required)  |

### 📦 Items Endpoints (JWT required)

| Method | Endpoint     | Description             |
|--------|--------------|-------------------------|
| GET    | `/items`     | Get all items           |
| POST   | `/items`     | Create new item         |
| PUT    | `/items/:id` | Update item by ID       |
| DELETE | `/items/:id` | Delete item by ID       |

---

## ✅ Item Schema

```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse with USB receiver",
  "category": "Electronics",
  "price": 29.99,
  "quantity": 100,
  "inStock": true,
  "tags": ["wireless", "USB", "mouse"]
}
🔐 Auth Usage Example (JWT)
Register

bash
Copier
Modifier
POST /auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "securePassword123"
}
Login

bash
Copier
Modifier
POST /auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "securePassword123"
}
Use JWT in Auth Header

makefile
Copier
Modifier
Authorization: Bearer <your_token>
🔧 Installation Instructions
Clone the repo:

bash
Copier
Modifier
git clone https://github.com/dev-juve/project-2-api.git
cd project-2-api
Install dependencies:

bash
Copier
Modifier
npm install
Create a .env file:

env
Copier
Modifier
MONGO_URI=your-mongo-uri
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
SESSION_SECRET=your-session-secret
GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback
JWT_SECRET=your-jwt-secret
Start the server:

bash
Copier
Modifier
npm start
🌐 Deployment
This app is deployed using Render. Be sure to:

Add your .env variables to the Render dashboard

Include .env in .gitignore

Test deployment before submission

📽️ Demo Video
➡️ Watch the YouTube walkthrough

👨‍💻 Author
Juvenson Elizaire
CSE 341 – Brigham Young University–Idaho