from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlmodel import Session

from app.db.session import get_session
from app.api.auth import CurrentUser # Ajuste se seu auth estiver em outro lugar
from app.models.user import User
from app.schemas.calendar_schema import AppointmentCreate, AppointmentRead
from app.services.calendar_service import CalendarService

router = APIRouter()

@router.post("/", response_model=AppointmentRead, status_code=status.HTTP_201_CREATED)
def create_appointment(
    appointment_in: AppointmentCreate,
    current_user: User = Depends(CurrentUser),
    session: Session = Depends(get_session),
):
    service = CalendarService(session)
    return service.create(user_id=current_user.id, data=appointment_in)

@router.get("/", response_model=List[AppointmentRead])
def get_appointments(
    current_user: User = Depends(CurrentUser),
    session: Session = Depends(get_session),
):
    service = CalendarService(session)
    return service.get_all_by_user(user_id=current_user.id)

@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(
    appointment_id: int,
    current_user: User = Depends(CurrentUser),
    session: Session = Depends(get_session),
):
    service = CalendarService(session)
    success = service.delete(user_id=current_user.id, appointment_id=appointment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Compromisso não encontrado")