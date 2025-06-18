from pydantic import BaseModel

class EventModel(BaseModel):
    name: str
    description: str
    date: str
