from pydantic import BaseModel
from datetime import date, time
from typing import Optional

class AppointmentCreate(BaseModel):
    title: str
    date: date
    time: time
    description: Optional[str] = None

class AppointmentRead(AppointmentCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True