from datetime import date, time
from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.models.user import User

class Appointment(SQLModel, table=True):
    __tablename__ = "appointments"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(nullable=False)
    description: Optional[str] = Field(default=None)
    # Chave estrangeira ligando à tabela 'users'
    user_id: int = Field(foreign_key="users.id")
    user_id: int = Field(foreign_key="users.id")
    user: Optional["User"] = Relationship(back_populates="appointments")