from fastapi import APIRouter
from app.database import students_collection

router = APIRouter()

@router.get("/students")
async def get_students():
    students = list(students_collection.find({}, {"_id": 0}))
    return students

@router.post("/students")
async def create_student(student: dict):
    students_collection.insert_one(student)
    return {"message": "Student added"}
