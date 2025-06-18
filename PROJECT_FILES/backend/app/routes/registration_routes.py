from fastapi import APIRouter
from app.database import registrations_collection

router = APIRouter()

@router.get("/registrations")
async def get_registrations():
    regs = list(registrations_collection.find({}, {"_id": 0}))
    return regs

@router.post("/registrations")
async def create_registration(registration: dict):
    registrations_collection.insert_one(registration)
    return {"message": "Registration added"}
