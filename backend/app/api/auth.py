from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime
from fastapi.security import OAuth2PasswordRequestForm
from starlette import status

# IMPORTAÇÕES LOCAIS
from app.schemas.user_schema import UserCreate, UserRead
from app.models.user import User # Modelo de DB
from app.core.security import get_password_hash, create_access_token, verify_password
from app.db.session import get_session # Sessão de DB
from app.models.token import Token


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

@router.post("/login", response_model=Token, tags=["auth"])
def login_for_access_token(
    session: Session = Depends(get_session),
    form_data: OAuth2PasswordRequestForm = Depends(), # Usa o formulário de login padrão
):
    """
    Obtém um token de acesso JWT com base nas credenciais.
    O formulário exige 'username' (usaremos email) e 'password'.
    """
    # 1. Busca o usuário pelo email (form_data.username)
    user = session.exec(
        select(User).where(User.email == form_data.username)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas. Verifique seu email.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Verifica a senha
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas. Verifique sua senha.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Cria o token JWT
    access_token = create_access_token(
        subject=user.email # Usamos o email como 'subject' (sub) no token
    )
    
    # 4. Retorna o Token
    return Token(access_token=access_token, token_type="bearer")