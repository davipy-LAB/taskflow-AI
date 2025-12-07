from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.orm import Relationship as SARelationship

# Importar o modelo Task para o relacionamento
from app.models.task import Task 

# Importar APÓS definir User (importação do UserLanguage)
from .language import UserLanguage

# ----------------------------------------------------------------------
# 1. Base (Campos Comuns)
# ----------------------------------------------------------------------

class UserBase(SQLModel):
    """Campos comuns a todas as formas de usuário."""
    email: str = Field(index=True, unique=True, nullable=False)
    full_name: Optional[str] = None
    is_active: bool = Field(default=True)

# ----------------------------------------------------------------------
# 2. Criação (Recebido no POST /register)
# ----------------------------------------------------------------------

class UserCreate(UserBase):
    """Modelo usado para criar um novo usuário."""
    password: str

# ----------------------------------------------------------------------
# 3. Tabela de Banco de Dados (UNIFICADA)
# ----------------------------------------------------------------------

class User(UserBase, table=True):
    """Modelo da tabela no banco de dados, incluindo todos os relacionamentos."""
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    
    # Relacionamento NOVO: Lista de tarefas deste usuário
    tasks: List["Task"] = Relationship(back_populates="user")
    
    # Relacionamento para os idiomas que o usuário está aprendendo
    languages_link: List["UserLanguage"] = Relationship(back_populates="user")

# ----------------------------------------------------------------------
# 4. Leitura (Retorno da API)
# ----------------------------------------------------------------------

class UserRead(UserBase):
    """Modelo usado para retornar dados do usuário."""
    id: int
    created_at: datetime

class UserPasswordChange(SQLModel):
    """Modelo usado para receber a requisição de troca de senha."""
    old_password: str
    new_password: str
# backend/app/models/user.py
