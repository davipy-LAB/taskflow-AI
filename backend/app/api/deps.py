# backend/app/api/deps.py (Versão Consolidada)

from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.user import User
from app.core.security import decode_access_token # Assumindo que decode_access_token existe
from app.models.token import TokenPayload # Assumindo que TokenPayload existe

# Define o esquema de segurança OAuth2. O token é esperado no header 'Authorization: Bearer <token>'
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login" # Ajuste o tokenUrl conforme sua rota de login (ex: "/auth/login")
)

# ----------------------------------------------------------
# DEPENDÊNCIA 1: Encontra o Usuário com base no Token JWT
# ----------------------------------------------------------
def get_current_user(
    session: Session = Depends(get_session),
    token: str = Depends(reusable_oauth2)
) -> User:
    """
    Decodifica o token e busca o usuário. (Sem verificar se está ativo).
    """
    try:
        # 1. Decodifica o token
        payload: TokenPayload = decode_access_token(token)
        
        if not payload or not payload.sub:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido ou expirado.",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
    except Exception: # Captura JWTError e outras exceções de decodificação
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Não foi possível validar as credenciais.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Busca o usuário pelo email (sub) no payload
    user = session.exec(
        select(User).where(User.email == payload.sub)
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    
    return user

# ----------------------------------------------------------
# DEPENDÊNCIA 2: Garante que o Usuário Está Ativo
# ----------------------------------------------------------
def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Usa get_current_user e verifica se ele está ativo.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Usuário inativo.")
    return current_user

# ----------------------------------------------------------
# ALIAS GLOBAL: O que você importa em outros roteadores
# ----------------------------------------------------------
# Este alias retorna o objeto User **ativo** e garante que o token é válido.
CurrentUser = Annotated[User, Depends(get_current_active_user)]