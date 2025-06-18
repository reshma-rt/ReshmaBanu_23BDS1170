from fastapi import FastAPI, HTTPException, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from fastapi import Request

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["EventMasterDB"]
students_collection = db["students"]
admins_collection = db["admins"]
users_collection = db["users"]
events_collection = db["events"]
registration_collection = db["registration"]

# Models
class User(BaseModel):
    email: str
    password: str
    role: str  # 'student' or 'admin'

class LoginModel(BaseModel):
    email: str
    password: str

class EventModel(BaseModel):
    name: str
    description: str
    location: str
    date: str  # Ensure this is in a consistent format, like YYYY-MM-DD

class RegisterRequest(BaseModel):
    email: str
    event_name: str
    registration_date: str
@app.get("/students")
async def get_all_students():
    students = list(students_collection.find())
    return [
        {
            "_id": str(st["_id"]),
            "email": st["email"]
        }
        for st in students
    ]

@app.get("/test-cors")
def test_cors():
    return {"message": "CORS is working"}

# Signup Route
@app.post("/signup")
def signup(user: dict):
    role = user.get("role", "student")

    if role == "admin":
        if db.admins.find_one({"email": user["email"]}):
            raise HTTPException(status_code=400, detail="Admin already exists")
        db.admins.insert_one({
            "email": user["email"],
            "password": user["password"]
        })

        # Add to users collection
        db.users.insert_one({
            "email": user["email"],
            "password": user["password"],
            "role": "admin"
        })

    else:
        if db.students.find_one({"_id": user["id"]}):
            raise HTTPException(status_code=400, detail="Student already exists")
        db.students.insert_one({
            "_id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "password": user["password"],
            "department": user["department"],
            "year": int(user["year"]),
        })

        # Add to users collection
        db.users.insert_one({
            "email": user["email"],
            "password": user["password"],
            "role": "student"
        })

    return {"message": "Signup successful"}

@app.post("/login")
def login(user: dict):
    email = user.get("email")
    password = user.get("password")
    existing_user = db.users.find_one({"email": email, "password": password})
    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "email": existing_user["email"],
        "role": existing_user["role"]
    }

@app.post("/events")
def create_event(event: dict):
    try:
        # Auto-generate event_id
        count = events_collection.count_documents({})
        new_event_id = f"E{str(count + 1).zfill(3)}"

        event["event_id"] = new_event_id  # ✅ add custom event_id
        result = events_collection.insert_one(event)
        return {"message": "Event created", "event_id": new_event_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get All Events with optional filtering
@app.get("/events")
def get_events(name: str = Query(None), date: str = Query(None)):
    query = {}
    if name:
        query["name"] = {"$regex": name, "$options": "i"}
    if date:
        query["date"] = date

    events = list(events_collection.find(query))  # ✅ Must be defined here

    for event in events:
        event["_id"] = str(event["_id"])  # ✅ This is now safe
    return events

@app.get("/registrations/{email}")
async def get_registrations(email: str):
    registrations = list(registration_collection.find({"student_email": email}))
    return [
        {
            "_id": str(reg["_id"]),
            "student_email": reg["student_email"],
            "event_name": reg["event_name"],
            "registration_date": reg["registration_date"]
        }
        for reg in registrations
    ]

@app.get("/registrations")
async def get_all_registrations():
    registrations = list(registration_collection.find())
    return [
        {
            "_id": str(reg["_id"]),
            "student_email": reg.get("student_email", reg.get("email", "N/A")),
            "event_name": reg.get("event_name", "Unknown"),
            "registration_date": reg.get("registration_date", "Unknown")
        }
        for reg in registrations
    ]

# Update Event
@app.put("/events/{event_id}")
def update_event(event_id: str, event: EventModel):
    result = events_collection.update_one({"_id": ObjectId(event_id)}, {"$set": event.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event updated successfully"}

# Delete Event
@app.delete("/events/{event_id}")
def delete_event(event_id: str):
    result = events_collection.delete_one({"_id": ObjectId(event_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}


@app.post("/register")
async def register_event(data: dict):
    email = data.get("email")
    event_name = data.get("event_name")
    registration_date = data.get("registration_date")

    print("📥 Registration attempt:", data)

    if not email or not event_name:
        print("❌ Missing fields")
        raise HTTPException(status_code=400, detail="Email and event_name are required")

    student = students_collection.find_one({"email": email})
    if not student:
        print("❌ Student not found:", email)
        raise HTTPException(status_code=404, detail="Student with this email not found")

    event = events_collection.find_one({"name": event_name})
    if not event:
        print("❌ Event not found:", event_name)
        raise HTTPException(status_code=404, detail="Event not found")

    existing = registration_collection.find_one({
        "student_email": email,
        "event_name": event_name
    })
    if existing:
        print("⚠️ Already registered")
        raise HTTPException(status_code=400, detail="Already registered for this event")

    registration = {
        "student_email": email,
        "event_name": event_name,
        "registration_date": registration_date
    }

    print("✅ Inserting registration:", registration)
    registration_collection.insert_one(registration)
    print("✅ Registration saved")

    return {"message": "Registration successful"}
