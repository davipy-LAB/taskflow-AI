# backend/app/api/deps.py
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession # Alterado para AsyncSession
from sqlmodel import select

from app.db.session import get_session
from app.models.user import User
from app.core.security import decode_access_token 
from app.models.token import TokenPayload 

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)

# 1. Transformado em 'async def' para suportar o motor assíncrono
async def get_current_user(
    session: AsyncSession = Depends(get_session),
    token: str = Depends(reusable_oauth2)
) -> User:
    print(f"🔍 Token recebido: {token[:30]}..." if token else "❌ Nenhum token!")
    try:
        payload: TokenPayload = decode_access_token(token)
        print(f"✅ Token decodificado: {payload}")
        if not payload or not payload.sub:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido ou expirado.",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except (ValueError, Exception) as e:
        print(f"❌ Erro na autenticação: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Não foi possível validar as credenciais: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Correção: Uso de 'await session.execute()' em vez de 'session.exec()'
    statement = select(User).where(User.email == payload.sub)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    
    return user

# 3. Dependência secundária também deve ser 'async'
async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Usuário inativo.")
    return current_user

CurrentUser = Annotated[User, Depends(get_current_active_user)]