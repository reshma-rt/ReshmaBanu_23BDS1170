from fastapi import APIRouter
from app.database import events_collection

router = APIRouter()

@router.get("/events")
async def get_events():
    events = list(events_collection.find({}, {"_id": 0}))
    return events

@router.post("/events")
async def create_event(event: dict):
    events_collection.insert_one(event)
    return {"message": "Event added"}
