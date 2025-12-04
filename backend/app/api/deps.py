# backend/app/api/deps.py

from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.user import User
from app.core.security import decode_access_token
from app.models.token import TokenPayload

# Define o esquema de segurança OAuth2. O token é esperado no header 'Authorization: Bearer <token>'
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login" # O URL onde o cliente pode obter o token
)

# Dependência que verifica o token e retorna o objeto User
def get_current_user(
    session: Session = Depends(get_session),
    token: str = Depends(reusable_oauth2)
) -> User:
    # 1. Decodifica o token
    payload: TokenPayload = decode_access_token(token)
    
    # Se a decodificação falhar (token inválido/expirado)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Busca o usuário pelo email (sub) no payload
    user = session.exec(
        select(User).where(User.email == payload.sub)
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    
    # Se o usuário estiver inativo (caso você tenha o campo is_active)
    if not user.is_active:
         raise HTTPException(status_code=400, detail="Usuário inativo.")
        
    return user

# Define um alias simples para usar nos endpoints
CurrentUser = Annotated[User, Depends(get_current_user)]