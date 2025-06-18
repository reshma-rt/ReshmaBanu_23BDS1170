from fastapi import APIRouter
from pydantic import BaseModel
from pymongo import MongoClient
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URL"))
db = client["EventMasterDB"]
users_collection = db["users"]

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

class SignupModel(BaseModel):
    email: str
    password: str
    role: str

class LoginModel(BaseModel):
    email: str
    password: str

router = APIRouter()

@router.post("/signup")
def signup(user: SignupModel):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        return {"message": "User already exists"}

    user_data = {
        "email": user.email,
        "password": user.password,
        "role": user.role
    }
    users_collection.insert_one(user_data)

    return {"message": "Signup successful"}

@router.post("/login")
def login(user: LoginModel):
    user_data = users_collection.find_one({"email": user.email})
    if not user_data or user_data['password'] != user.password:
        return {"message": "Invalid email or password"}

    payload = {
        "sub": user.email,
        "role": user_data["role"]
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {
        "message": "Login successful",
        "access_token": token,
        "role": user_data["role"]
    }
