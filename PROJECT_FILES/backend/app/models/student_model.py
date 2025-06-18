from pydantic import BaseModel

class StudentModel(BaseModel):
    name: str
    department: str
    email: str
