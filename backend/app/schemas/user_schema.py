from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserRead(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UserPasswordChange(BaseModel):
    old_password: str
    new_password: str

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None