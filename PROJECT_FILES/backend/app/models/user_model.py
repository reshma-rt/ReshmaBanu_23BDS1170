from pydantic import BaseModel

class SignupModel(BaseModel):
    email: str
    password: str
    role: str

class LoginModel(BaseModel):
    email: str
    password: str
