from sqlmodel import Session, select
from typing import List
from app.models.calendar import Appointment
from app.schemas.calendar_schema import AppointmentCreate

class CalendarService:
    def __init__(self, session: Session):
        self.session = session

    def create(self, user_id: int, data: AppointmentCreate) -> Appointment:
        appointment = Appointment(
            **data.model_dump(),
            user_id=user_id
        )
        self.session.add(appointment)
        self.session.commit()
        self.session.refresh(appointment)
        return appointment

    def get_all_by_user(self, user_id: int) -> List[Appointment]:
        statement = select(Appointment).where(Appointment.user_id == user_id)
        results = self.session.exec(statement).all()
        return results

    def delete(self, user_id: int, appointment_id: int) -> bool:
        statement = select(Appointment).where(
            Appointment.id == appointment_id, 
            Appointment.user_id == user_id
        )
        appointment = self.session.exec(statement).first()
        
        if not appointment:
            return False
            
        self.session.delete(appointment)
        self.session.commit()
        return True