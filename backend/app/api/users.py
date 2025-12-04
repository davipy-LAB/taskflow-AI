# backend/app/api/user.py

from fastapi import APIRouter
from app.api.deps import CurrentUser
from app.models.user import UserRead # Assumindo que você tem um modelo UserRead para retorno

router = APIRouter()

# Rota protegida que usa a dependência CurrentUser
@router.get("/me", response_model=UserRead, tags=["users"])
def read_current_user(current_user: CurrentUser):
    """
    Obtém os dados do usuário atualmente logado.
    Requer um Token JWT válido.
    """
    return current_user