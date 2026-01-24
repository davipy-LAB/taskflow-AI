#!/bin/bash

set -e

echo "🚀 Iniciando TaskFlow AI..."
echo ""

# Usar PORT do Render, ou 3000 em desenvolvimento
FRONTEND_PORT=${PORT:-3000}
BACKEND_PORT=8000

# 1. Backend (FastAPI em background)
echo "📦 Iniciando Backend (FastAPI) na porta $BACKEND_PORT..."
cd backend
uvicorn app.main:app --host 0.0.0.0 --port $BACKEND_PORT --workers 1 &
BACKEND_PID=$!
echo "✅ Backend iniciado (PID: $BACKEND_PID)"

# Aguardar backend ficar pronto
echo "⏳ Aguardando backend inicializar..."
sleep 5
for i in {1..30}; do
  if curl -s http://localhost:$BACKEND_PORT/api/v1/health > /dev/null 2>&1; then
    echo "✅ Backend respondendo!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Backend não respondeu no tempo esperado"
    kill $BACKEND_PID
    exit 1
  fi
  sleep 1
done

# 2. Frontend (Next.js)
echo ""
echo "🎨 Iniciando Frontend (Next.js) na porta $FRONTEND_PORT..."
cd ../frontend
echo "✅ Frontend compilado"
echo ""
echo "🌐 Serviço disponível em http://0.0.0.0:$FRONTEND_PORT"
echo ""
PORT=$FRONTEND_PORT npm start

# Cleanup ao parar
trap "kill $BACKEND_PID" EXIT