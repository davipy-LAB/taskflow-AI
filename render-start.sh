#!/bin/bash

# Script para o Render - inicia ambos os serviços em paralelo
# Backend: porta 8000 (interna)
# Frontend: porta ${PORT} (exposta, padrão 10000)

BACKEND_PORT=8000
FRONTEND_PORT=${PORT:-10000}

echo "🚀 Iniciando TaskFlow AI no Render..."

# 1. Iniciar backend em background (porta 8000)
echo "📦 Inicializando Backend na porta $BACKEND_PORT..."
cd backend
uvicorn app.main:app --host 127.0.0.1 --port $BACKEND_PORT --workers 1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# 2. Aguardar backend iniciar (10 segundos + retry)
sleep 10
echo "⏳ Verificando se Backend está pronto..."
BACKEND_READY=false
for i in {1..60}; do
  if curl -s http://127.0.0.1:$BACKEND_PORT/api/v1/health > /dev/null 2>&1; then
    echo "✅ Backend pronto na tentativa $i!"
    BACKEND_READY=true
    break
  fi
  echo "Tentativa $i/60..."
  sleep 1
done

if [ "$BACKEND_READY" = false ]; then
  echo "❌ Backend não iniciou em tempo!"
  exit 1
fi

# 3. Iniciar frontend (porta ${PORT} exposta, com rewrite para backend)
echo "🎨 Iniciando Frontend na porta $FRONTEND_PORT..."
cd ../frontend
PORT=$FRONTEND_PORT ./node_modules/.bin/next start

# 4. Aguardar (manter o script rodando)
wait
FRONTEND_PID=$!

# Manter ambos os processos rodando
wait
