# EventMaster - Event Management System

EventMaster is a full-stack event management and tracking system that allows administrators to manage events and enables users (students) to register, view, and track their event participation.

This project uses:

* **FastAPI (Python)** for backend API development
* **MongoDB** as the NoSQL database
* **React** for the frontend user interface
* **JWT** for secure authentication and authorization
* **Postman/Swagger** for API testing

---

## 🚀 Features

### 🔐 Authentication

* User registration and login (Admin/Student roles)
* JWT-based secure session management

### 🛠 Admin Features

* Create, update, delete events
* View all registered students
* Export event data

### 🎓 Student Features

* Register and view available events
* View own registrations
* Receive event reminders (future scope)

### 🌐 System Features

* Full REST API with Swagger docs
* Modular backend with FastAPI routers
* Frontend dashboard for both roles

---

## 📁 Project Structure

```
EventMaster/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
├── .env
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # or source venv/bin/activate on Linux/macOS
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Make sure your `.env` file contains:

```
MONGO_URI=mongodb://localhost:27017
SECRET_KEY=your_secret_key_here
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Runs at: `http://localhost:3000`

---

## 🌐 API Documentation

Access Swagger UI at:
**`http://localhost:8000/docs`**

Example routes:

* `POST /auth/register`
* `POST /auth/login`
* `GET /events/`
* `POST /register/`

---

## 🧪 Testing Tools

* **Postman**: To test API endpoints manually
* **Swagger UI**: Built-in documentation with FastAPI

---

## 📌 Notes

* Use different roles for admin and student during signup
* Events, registrations, and user details are stored in MongoDB (collection names: `users`, `events`, `students`, `registrations`)

---

## 🤝 Contributors

* 👩‍💻 Reshma Banu A
* ✨ Open to collaborators

---

## 📜 License

This project is for academic and learning purposes. You may modify and reuse with attribution.
