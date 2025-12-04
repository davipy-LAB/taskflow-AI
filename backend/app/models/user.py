# backend/app/models/user.py

from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

# ----------------------------------------------------------------------
# 1. Base (Campos Comuns)
# ----------------------------------------------------------------------

# SQLModel base para todos os campos
class UserBase(SQLModel):
    """
    Campos comuns a todas as formas de usuário.
    Não inclui ID ou senha com hash.
    """
    email: str = Field(index=True, unique=True, nullable=False)
    full_name: Optional[str] = None
    is_active: bool = Field(default=True)

# ----------------------------------------------------------------------
# 2. Criação (Recebido no POST /register)
# ----------------------------------------------------------------------

# Herda do Base e adiciona o campo 'password' (apenas para recebimento)
class UserCreate(UserBase):
    """Modelo usado para criar um novo usuário (POST /register)."""
    password: str # Campo de senha em texto simples para hashing

# ----------------------------------------------------------------------
# 3. Tabela de Banco de Dados
# ----------------------------------------------------------------------

# Modelo da tabela (inclui ID e a senha HASHED)
class User(UserBase, table=True):
    """Modelo da tabela no banco de dados."""
    id: Optional[int] = Field(default=None, primary_key=True)
    # A senha é salva com hash (nunca use o nome 'password' para a coluna com hash)
    hashed_password: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


# ----------------------------------------------------------------------
# 4. Leitura (Retorno da API)
# ----------------------------------------------------------------------

# Herda do Base e adiciona o ID (NÃO inclui a senha com hash!)
class UserRead(UserBase):
    """Modelo usado para retornar dados do usuário (GET /me, GET /register)."""
    id: int
    created_at: datetime
    # Note que NÃO incluímos 'hashed_password' aqui!