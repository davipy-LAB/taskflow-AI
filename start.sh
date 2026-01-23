#!/bin/bash

set -e

echo "🚀 Iniciando TaskFlow AI..."
echo ""

# Cloud Run fornece $PORT via variável de ambiente (padrão 3000)
FRONTEND_PORT=${PORT:-3000}
BACKEND_PORT=8000

# 1. Backend (FastAPI em background)
echo "📦 Iniciando Backend (FastAPI) na porta $BACKEND_PORT..."
cd backend
uvicorn app.main:app --host 0.0.0.0 --port $BACKEND_PORT &
BACKEND_PID=$!
echo "✅ Backend iniciado (PID: $BACKEND_PID)"
sleep 3

# 2. Frontend (Next.js)
echo ""
echo "🎨 Iniciando Frontend (Next.js) na porta $FRONTEND_PORT..."
cd ../frontend
echo "✅ Frontend compilado"
echo ""
echo "🌐 Serviço disponível em: http://0.0.0.0:$FRONTEND_PORT"
echo ""
PORT=$FRONTEND_PORT npm start

# Cleanup ao parar
trap "kill $BACKEND_PID" EXIT