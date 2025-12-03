from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime

# IMPORTAÇÕES LOCAIS
from app.schemas.user_schema import UserCreate, UserRead
from app.models.user import User # Modelo de DB
from app.core.security import get_password_hash # Hashing
from app.db.session import get_session # Sessão de DB

# Cria o Router
router = APIRouter()

# ----------------------------------------------------------
# ROTA: REGISTRO DE USUÁRIO (SIGN UP)
# ----------------------------------------------------------
@router.post("/register", response_model=UserRead, status_code=201)
def register_user(user_in: UserCreate, session: Session = Depends(get_session)):
    
    # 1. Checa se o email já existe
    existing_user = session.exec(select(User).where(User.email == user_in.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email já registrado. Por favor, use outro endereço. Muito obrigado por testar nossa Alpha version!"
        )

    # 2. Gera o hash da senha
    hashed_password = get_password_hash(user_in.password)

    # 3. Cria o objeto User
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        created_at=datetime.utcnow()
    )
    
    # 4. Salva no banco de dados
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    return new_user