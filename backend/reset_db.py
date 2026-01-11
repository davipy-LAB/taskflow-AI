from sqlalchemy import text
from app.db.session import engine
from sqlmodel import SQLModel
# Importe seus modelos para garantir que o create_all os veja
from app.models.user import User
from app.models.task import Task
from app.models.calendar import Appointment

def reset_database():
    with engine.connect() as connection:
        with connection.begin():
            print("Limpando esquema do banco de dados (CASCADE)...")
            # Este comando limpa TUDO no Postgres e recria o esquema público vazio
            connection.execute(text("DROP SCHEMA public CASCADE;"))
            connection.execute(text("CREATE SCHEMA public;"))
            connection.execute(text("GRANT ALL ON SCHEMA public TO public;")) # Garante as permissões
    
    print("Criando novas tabelas com a estrutura unificada...")
    SQLModel.metadata.create_all(engine)
    print("Sucesso! Banco de dados limpo e recriado.")

if __name__ == "__main__":
    reset_database()