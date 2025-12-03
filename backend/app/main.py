# Conteúdo de backend/app/main.py
from fastapi import FastAPI
import app.api.auth as auth
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

# IMPORTANTE: No mundo real, você usaria subpastas para routers, models, etc.