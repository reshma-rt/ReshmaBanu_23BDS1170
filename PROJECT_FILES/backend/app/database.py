import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)
db = client["EventMasterDB"]
users_collection = db["users"]
students_collection = db["students"]
events_collection = db["events"]
registrations_collection = db["registrations"]
