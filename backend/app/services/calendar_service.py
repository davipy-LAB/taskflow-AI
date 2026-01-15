# backend/app/services/calendar_service.py
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession # Use AsyncSession
from typing import List
from app.models.calendar import Appointment
from app.schemas.calendar_schema import AppointmentCreate

class CalendarService:
    def __init__(self, session: AsyncSession):
        self.session = session

    # 1. Tornar o método async
    async def create(self, user_id: int, data: AppointmentCreate) -> Appointment:
        appointment = Appointment(
            **data.model_dump(),
            user_id=user_id
        )
        self.session.add(appointment)
        # 2. Usar await no commit e refresh
        await self.session.commit()
        await self.session.refresh(appointment)
        return appointment

    # 3. Tornar o método async e trocar .exec() por .execute()
    async def get_all_by_user(self, user_id: int) -> List[Appointment]:
        statement = select(Appointment).where(Appointment.user_id == user_id)
        # Em sessões assíncronas usamos execute()
        results = await self.session.execute(statement)
        return results.scalars().all()

    # 4. Tornar o método async
    async def delete(self, user_id: int, appointment_id: int) -> bool:
        statement = select(Appointment).where(
            Appointment.id == appointment_id, 
            Appointment.user_id == user_id
        )
        result = await self.session.execute(statement)
        appointment = result.scalar_one_or_none()
        
        if not appointment:
            return False
            
        await self.session.delete(appointment)
        await self.session.commit()
        return True