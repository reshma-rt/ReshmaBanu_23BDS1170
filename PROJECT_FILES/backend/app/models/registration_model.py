from pydantic import BaseModel

class RegistrationModel(BaseModel):
    student_id: str
    event_id: str
