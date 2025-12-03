import os
from dotenv import load_dotenv

load_dotenv()

# Configuração da URL do banco de dados (Assíncrona para o FastAPI)
# IMPORTANTE: Substitui 'postgresql://' por 'postgresql+asyncpg://' para usar o driver assíncrono.
DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL")

# Configuração de credenciais JWT (será expandido mais tarde)
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30