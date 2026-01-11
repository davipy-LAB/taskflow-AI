from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

# TYPE_CHECKING evita o erro de importação circular
if TYPE_CHECKING:
    from app.models.task import Task
    from app.models.language import UserLanguage
    from app.models.calendar import Appointment # <--- NOVO

class UserBase(SQLModel):
    email: str = Field(index=True, unique=True, nullable=False)
    full_name: Optional[str] = None
    is_active: bool = Field(default=True)

class User(UserBase, table=True):
    __tablename__ = "users" # <--- IMPORTANTE: Define o nome para as Foreign Keys
    
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    
    # Relacionamentos
    tasks: List["Task"] = Relationship(back_populates="user")
    languages_link: List["UserLanguage"] = Relationship(back_populates="user")
    appointments: List["Appointment"] = Relationship(back_populates="user") # <--- NOVO

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    created_at: datetime

class UserPasswordChange(SQLModel):
    old_password: str
    new_password: str