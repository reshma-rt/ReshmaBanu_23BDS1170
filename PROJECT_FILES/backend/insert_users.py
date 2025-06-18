import bcrypt
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["EventMasterDB"]
users = db["users"]

users.delete_many({})  # optional: clears existing

admin_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
student_password = bcrypt.hashpw("student123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

users.insert_one({
    "email": "admin@example.com",
    "password": admin_password,
    "role": "admin"
})

users.insert_one({
    "email": "student@example.com",
    "password": student_password,
    "role": "student"
})

print("Users inserted successfully")
