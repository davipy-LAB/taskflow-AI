#!/bin/bash

set -e

echo "🚀 Iniciando TaskFlow AI..."
echo ""

# 1. Backend (FastAPI em background)
echo "📦 Iniciando Backend (FastAPI)..."
cd backend
pip install -r requirements.txt > /dev/null 2>&1
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "✅ Backend iniciado (PID: $BACKEND_PID)"
sleep 3

# 2. Frontend (Next.js)
echo ""
echo "🎨 Iniciando Frontend (Next.js)..."
cd ../frontend
npm install > /dev/null 2>&1
npm run build > /dev/null 2>&1
echo "✅ Frontend compilado"
echo ""
echo "🌐 Acessando em: http://0.0.0.0:3000"
echo ""
npm start

# Cleanup ao parar
trap "kill $BACKEND_PID" EXIT