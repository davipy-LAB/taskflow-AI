# backend/app/db/session.py
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
import os
from dotenv import load_dotenv

load_dotenv()

# URL do banco
raw_url = os.getenv("DATABASE_CLOUD_URL") or os.getenv("SQLALCHEMY_DATABASE_URL")

if not raw_url:
    raise ValueError("DATABASE_CLOUD_URL não configurada")

# Converter para asyncpg
if raw_url.startswith("postgres://"):
    DATABASE_URL = raw_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif "asyncpg" not in raw_url:
    DATABASE_URL = raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)
else:
    DATABASE_URL = raw_url

# Engine com melhor performance (echo=False!)
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Sem logs SQL para ser rápido!
    future=True,
    pool_size=10,
    max_overflow=20,
)

# Init DB
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

# Dependency para obter a sessão assíncrona
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async_session = sessionmaker(
        engine, 
        class_=AsyncSession, 
        expire_on_commit=False
    )
    async with async_session() as session:
        yield session # Retorna a sessão para a rota