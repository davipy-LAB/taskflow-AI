# backend/app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from datetime import datetime
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.user_schema import UserCreate, UserRead
from app.models.user import User
from app.core.security import get_password_hash, create_access_token, verify_password
from app.db.session import get_session
from app.models.token import Token
from app.api.deps import CurrentUser

router = APIRouter()

@router.post("/register", response_model=UserRead, status_code=201)
async def register_user(user_in: UserCreate, session: AsyncSession = Depends(get_session)):
    # Busca assíncrona do usuário
    statement = select(User).where(User.email == user_in.email)
    result = await session.execute(statement)
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email já registrado."
        )

    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        created_at=datetime.utcnow()
    )
    
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_session),
):
    # Busca assíncrona do usuário para login
    statement = select(User).where(User.email == form_data.username)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(subject=user.email)
    return Token(access_token=access_token, token_type="bearer")