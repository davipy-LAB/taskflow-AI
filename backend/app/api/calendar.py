# backend/app/api/calendar.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession # Importação para Async
from app.db.session import get_session

from app.api.deps import CurrentUser 
from app.schemas.calendar_schema import AppointmentCreate, AppointmentRead
from app.services.calendar_service import CalendarService

router = APIRouter()

@router.post("/", response_model=AppointmentRead, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment_in: AppointmentCreate,
    current_user: CurrentUser, 
    session: AsyncSession = Depends(get_session),
):
    # Passamos a sessão assíncrona para o service
    service = CalendarService(session)
    # Note: O seu CalendarService também precisará ser adaptado para async (veja abaixo)
    return await service.create(user_id=current_user.id, data=appointment_in)

@router.get("/", response_model=List[AppointmentRead])
async def get_appointments(
    current_user: CurrentUser, 
    session: AsyncSession = Depends(get_session),
):
    service = CalendarService(session)
    return await service.get_all_by_user(user_id=current_user.id)

@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(
    appointment_id: int,
    current_user: CurrentUser, 
    session: AsyncSession = Depends(get_session),
):
    service = CalendarService(session)
    success = await service.delete(user_id=current_user.id, appointment_id=appointment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    return None