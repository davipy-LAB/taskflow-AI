import os
from dotenv import load_dotenv

load_dotenv()

# 1. Pega qualquer uma das URLs que estiver disponível
raw_url = os.getenv("DATABASE_CLOUD_URL") or os.getenv("SQLALCHEMY_DATABASE_URL")

# 2. Garante que a URL use o driver assíncrono (Obrigatório para seu FastAPI)
if raw_url:
    # Corrige 'postgres://' para 'postgresql://' e adiciona '+asyncpg'
    DATABASE_URL = raw_url.replace("postgres://", "postgresql://", 1).replace("postgresql://", "postgresql+asyncpg://", 1)
else:
    DATABASE_URL = None

# Configuração de credenciais
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30