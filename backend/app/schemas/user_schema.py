from datetime import datetime
from typing import Optional, List

from sqlmodel import SQLModel
# from app.models.user import Membership # Para relações futuras, mas não necessário para os schemas básicos

# Schema para leitura de dados (O que a API retorna)
class UserRead(SQLModel):
    id: int
    email: str
    full_name: Optional[str] = None
    is_active: bool
    created_at: datetime

# Schema para criação de usuário (O que a API recebe no registro)
class UserCreate(SQLModel):
    email: str
    password: str # Texto plano
    full_name: Optional[str] = None
    
# Schema para login (simplesmente email e senha)
class UserLogin(SQLModel):
    email: str
    password: str

# Schemas de Token JWT
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"