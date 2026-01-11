from typing import Optional, TYPE_CHECKING
from datetime import date as dia, time as hora
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.models.user import User

class Appointment(SQLModel, table=True):
    __tablename__ = "appointments"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(nullable=False)
    description: Optional[str] = None
    date: dia = Field(nullable=False)
    time: hora = Field(nullable=False)

    # Liga à tabela 'users' definida no user.py
    user_id: int = Field(foreign_key="users.id", nullable=False)
    user: Optional["User"] = Relationship(back_populates="appointments")