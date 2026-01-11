from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_session as get_db
# Importe seu sistema de segurança/user aqui

router = APIRouter()

@router.post("/", response_model=AppointmentRead)
def create_event(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    try:
        db_appointment = Appointment(
            title=appointment.title,
            date=appointment.date,
            time=appointment.time,
            description=appointment.description,
            user_id=1 # Temporário: substitua pelo ID do usuário logado
        )
        db.add(db_appointment)
        db.commit()
        db.refresh(db_appointment)
        return db_appointment
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))