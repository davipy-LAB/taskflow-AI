# Conteúdo de backend/app/main.py
from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
import app.api.auth as auth
import app.api.users as users
import app.api.language as language
import app.api.tasks as tasks
from app.api import calendar
from fastapi.middleware.cors import CORSMiddleware
from app.config import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Executa na inicialização
    await init_db() 
    yield

app = FastAPI(title="TaskFlow AI Backend", lifespan=lifespan)

# Define as origens permitidas
origins = [
    "http://localhost:3000",  # <--- ESSA É A PORTA DO SEU FRONTEND!,  # Para garantir compatibilidade com localhost
    'https://taskflow-ai-lime.vercel.app', # Para garantir compatibilidade com 127.0.0.1
    # Adicione aqui o domínio de produção quando fizer o deploy
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

# --- ENDPOINT DE SAÚDE (Wake up check) ---
@app.get("/api/v1/health")
async def health_check():
    """Endpoint leve para o frontend verificar se o backend acordou."""
    return {"status": "online", "message": "Backend is awake and ready!"}

# Inclui o router de autenticação
app.include_router(auth.router, prefix="/api/v1/auth")


@app.get("/")
def read_root():
    return {"Hello": "TaskFlow AI API is running!"}

# users.router defines paths like '/me' so we add '/api/v1/users' as prefix
app.include_router(users.router, prefix="/api/v1/users")

# language.router already uses prefix '/languages', include under '/api/v1'
app.include_router(language.router, prefix="/api/v1")

# tasks.router already uses prefix '/tasks', include under '/api/v1'
app.include_router(tasks.router, prefix="/api/v1")

app.include_router(calendar.router, prefix="/api/v1/calendar", tags=["Calendar"])