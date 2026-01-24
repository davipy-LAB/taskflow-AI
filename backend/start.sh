#!/bin/bash
# start.sh - inicia o backend na porta correta do Render
exec python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}

