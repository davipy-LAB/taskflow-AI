# backend/app/db/session.py
from sqlmodel import create_engine, SQLModel, Session
from app.config import DATABASE_URL
from app.models import user # Garante que os modelos sejam importados

# Removemos o "async_" e usamos apenas uma engine síncrona
engine = create_engine(
    DATABASE_URL, 
    echo=True, 
    pool_recycle=3600, 
)

def create_db_and_tables():
    """Cria todas as tabelas"""
    SQLModel.metadata.create_all(engine)

# A dependency get_session se torna síncrona e usa a engine síncrona
def get_session():
    """Dependency para obter a sessão do banco de dados (síncrona)"""
    with Session(engine) as session:
        yield session