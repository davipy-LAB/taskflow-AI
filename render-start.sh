#!/bin/bash

# Script para o Render - inicia ambos os serviços em paralelo

BACKEND_PORT=8000
FRONTEND_PORT=${PORT:-3000}

echo "🚀 Iniciando TaskFlow AI no Render..."

# 1. Iniciar backend em background
echo "📦 Iniciando Backend..."
cd backend
uvicorn app.main:app --host 0.0.0.0 --port $BACKEND_PORT --workers 1 &
BACKEND_PID=$!

# 2. Aguardar backend iniciar
sleep 5
echo "⏳ Aguardando Backend..."
for i in {1..30}; do
  if curl -s http://localhost:$BACKEND_PORT/api/v1/health > /dev/null 2>&1; then
    echo "✅ Backend pronto!"
    break
  fi
  sleep 1
done

# 3. Iniciar frontend
echo "🎨 Iniciando Frontend na porta $FRONTEND_PORT..."
cd ../frontend
PORT=$FRONTEND_PORT npm start &
FRONTEND_PID=$!

# Manter ambos os processos rodando
wait
