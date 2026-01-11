from sqlmodel import SQLModel
from datetime import date, time
from typing import Optional

class AppointmentBase(SQLModel):
    title: str
    description: Optional[str] = None
    date: date
    time: time

# O que o frontend envia ao criar
class AppointmentCreate(AppointmentBase):
    pass

# O que o backend devolve (inclui ID)
class AppointmentRead(AppointmentBase):
    id: int
    user_id: int