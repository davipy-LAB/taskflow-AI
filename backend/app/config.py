# app/db/session.py
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel
from dotenv import load_dotenv

load_dotenv()

# 1. Busca a URL nas variáveis de ambiente
raw_url = os.getenv("DATABASE_CLOUD_URL") or os.getenv("SQLALCHEMY_DATABASE_URL")

# 2. VALIDAÇÃO DE SEGURANÇA:
# Se não encontrar a URL, o programa DEVE falhar imediatamente.
# Isso obriga você a configurar o .env (local) ou o Environment (Render).
if not raw_url:
    raise ValueError("ERRO CRÍTICO: Nenhuma URL de banco de dados encontrada. Verifique seu arquivo .env ou as configurações do Render.")

# 3. Tratamento da URL para o driver Async (postgresql+asyncpg)
# O Render/Heroku usam 'postgres://', mas o SQLAlchemy exige 'postgresql://'
# Além disso, precisamos injetar o driver '+asyncpg'
if raw_url.startswith("postgres://"):
    DATABASE_URL = raw_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif "asyncpg" not in raw_url:
    # Caso a URL local venha como 'postgresql://user:pass...', adicionamos o driver
    DATABASE_URL = raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)
else:
    DATABASE_URL = raw_url

# 4. Criação do Engine
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# 5. Função de inicialização do DB (Adaptada para rodar síncrono dentro de assíncrono)
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30