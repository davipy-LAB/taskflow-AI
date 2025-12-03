from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel

# ----------------------------------------------------------------------
# Modelo de Associação (Pivot Table)
# ----------------------------------------------------------------------
class Membership(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    organization_id: int = Field(foreign_key="organization.id", index=True)
    
    role: str = Field(default="Member") 
    
    user: "User" = Relationship(back_populates="memberships")
    organization: "Organization" = Relationship(back_populates="memberships")


# Aqui é criado o modelo de Usuário (User)
# ----------------------------------------------------------------------
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    
    hashed_password: str
    is_active: bool = Field(default=True)
    
    memberships: List[Membership] = Relationship(back_populates="user")
    
    full_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ----------------------------------------------------------------------
# Modelo de Organização (Organization)
# ----------------------------------------------------------------------
class Organization(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    
    memberships: List[Membership] = Relationship(back_populates="organization")