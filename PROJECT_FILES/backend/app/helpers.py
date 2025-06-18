# import os
# import bcrypt
# import jwt
# from datetime import datetime, timedelta
# from dotenv import load_dotenv

# # Load environment variables from .env
# load_dotenv()

# SECRET_KEY = os.getenv("SECRET_KEY")
# ALGORITHM = "HS256"

# # Password Hashing
# def hash_password(password: str) -> str:
#     hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
#     return hashed.decode('utf-8')

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# # JWT Token creation
# def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=1)):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + expires_delta
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

# # JWT Token decoding (optional if you want to verify tokens)
# def decode_access_token(token: str):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         return payload
#     except jwt.ExpiredSignatureError:
#         return None
#     except jwt.PyJWTError:
#         return None

# helpers.py — no hashing

def verify_password(plain_password, stored_password):
    return plain_password == stored_password
