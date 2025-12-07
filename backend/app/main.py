# Conteúdo de backend/app/main.py
from fastapi import FastAPI
import app.api.auth as auth
import app.api.users as users
import app.api.language as language
import app.api.tasks as tasks
from app.db.session import create_db_and_tables
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TaskFlow AI Backend")

# Define as origens permitidas
origins = [
    "http://localhost:3000",  # <--- ESSA É A PORTA DO SEU FRONTEND!
    "http://127.0.0.1:3000",  # Para garantir compatibilidade com 127.0.0.1
    # Adicione aqui o domínio de produção quando fizer o deploy
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables() 

# Inclui o router de autenticação
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
@app.get("/")
def read_root():
    return {"Hello": "TaskFlow AI API is running!"}

app.include_router(auth.router, prefix="/api/v1/auth")
app.include_router(users.router, prefix="/api/v1/users")
app.include_router(language.router, prefix="/api/v1/languages")
app.include_router(tasks.router, prefix="/api/v1/tasks" )