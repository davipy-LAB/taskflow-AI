# backend/app/api/users.py
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_session
from app.core.security import get_password_hash, verify_password
from app.schemas.user_schema import UserPasswordChange
from fastapi import APIRouter
from app.api.deps import CurrentUser
from app.models.user import UserRead 
from app.models.language import Language
from app.models.language import UserLanguage, UserLanguageRead
from sqlmodel import select

# Assumindo que você tem um modelo UserRead para retorno

router = APIRouter()

# Rota protegida que usa a dependência CurrentUser
@router.get("/me", response_model=UserRead, tags=["users"])
async def read_current_user(current_user: CurrentUser):
    """
    Obtém os dados do usuário atualmente logado.
    Requer um Token JWT válido.
    """
    return current_user

@router.patch("/password", tags=["users"])
async def change_password(
    password_data: UserPasswordChange,
    current_user: CurrentUser, # Garante que o usuário esteja logado
    session: AsyncSession = Depends(get_session),
):
    """
    Permite ao usuário logado mudar sua senha.
    Requer o token JWT.
    """
    
    # 1. Verificar a senha antiga
    if not verify_password(password_data.old_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A senha antiga fornecida está incorreta.",
        )

    # 2. Impedir que a senha nova seja igual à antiga (boa prática)
    if password_data.old_password == password_data.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A nova senha não pode ser igual à senha antiga.",
        )
        
    # 3. Gerar o hash da nova senha
    new_hashed_password = get_password_hash(password_data.new_password)
    
    # 4. Atualizar o usuário no banco de dados
    current_user.hashed_password = new_hashed_password
    
    session.add(current_user)
    await session.commit()
    await session.refresh(current_user)
    
    return {"message": "Senha atualizada com sucesso."}

@router.post("/me/enroll/{language_id}", response_model=UserLanguageRead, tags=["users"])

async def enroll_in_language(
    language_id: int,
    current_user: CurrentUser, # Usuário logado
    session: AsyncSession = Depends(get_session),
):
    """
    Permite ao usuário logado se matricular em um idioma específico.
    Requer o Token JWT.
    """
    
    # 1. Verificar se o idioma existe
    statement = select(Language).where(Language.id == language_id)
    result = await session.execute(statement)
    language = result.scalar_one_or_none()
    
    if not language:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Idioma com ID {language_id} não encontrado."
        )

    # 2. Verificar se o usuário já está matriculado
    statement = select(UserLanguage).where(
        UserLanguage.user_id == current_user.id,
        UserLanguage.language_id == language_id
    )
    result = await session.execute(statement)
    enrollment = result.scalar_one_or_none()
    
    if enrollment:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Você já está matriculado em {language.name}."
        )
        
    # 3. Criar a nova matrícula (registro na tabela de ligação)
    new_enrollment = UserLanguage(
        user_id=current_user.id,
        language_id=language_id,
        progress_percentage=0.0 # Começa com 0%
    )
    
    session.add(new_enrollment)
    await session.commit()
    await session.refresh(new_enrollment)
    
    return new_enrollment

