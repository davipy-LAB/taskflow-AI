# Conteúdo de backend/app/main.py
from fastapi import FastAPI

app = FastAPI(title="TaskFlow AI Backend")

@app.get("/")
def read_root():
    return {"Hello": "TaskFlow AI API is running!"}

# IMPORTANTE: No mundo real, você usaria subpastas para routers, models, etc.