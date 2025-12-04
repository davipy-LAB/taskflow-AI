# Conteúdo de backend/app/main.py
from fastapi import FastAPI
import app.api.auth as auth
import app.api.users as users
import app.api.language as language
from app.db.session import create_db_and_tables

app = FastAPI(title="TaskFlow AI Backend")

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