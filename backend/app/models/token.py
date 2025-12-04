# backend/app/models/token.py

from sqlmodel import SQLModel

class Token(SQLModel):
    """Modelo para o token de acesso retornado após o login."""
    access_token: str
    token_type: str = "bearer"

class TokenPayload(SQLModel):
    """Modelo para o payload do token (dados dentro do token)."""
    sub: str | None = None