# 🚀 Deploy Simples (Sem Docker) - Nixpacks

## ✅ Como Funciona

```
┌─────────────────────────────────────────┐
│  Render Web Service (1 só)              │
├─────────────────────────────────────────┤
│                                         │
│  start.sh (executa)                     │
│  ├─► Backend (FastAPI :8000)            │
│  └─► Frontend (Next.js :3000)           │
│      └─ Faz proxy /api → :8000          │
│                                         │
└─────────────────────────────────────────┘
```

---

## 💻 Trabalhar Localmente (2 Terminais)

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Acesse: **http://localhost:3000**

---

## 📤 Deploy no Render

### 1. Atualizar GitHub
```bash
git add .
git commit -m "feat: Simplified deployment with Nixpacks"
git push origin main
```

### 2. Render Dashboard
- New Web Service
- Conectar GitHub
- **Language:** Node (automático, lê package.json)
- **Build Command:** `chmod +x start.sh && cd backend && pip install -r requirements.txt && cd ../frontend && npm install && npm run build`
- **Start Command:** `./start.sh`

### 3. Environment Variables
```
DATABASE_CLOUD_URL = postgresql://...
SECRET_KEY = [gere com Python]
```

### 4. Deploy!
- Clique "Create"
- Render faz tudo automaticamente em ~10 minutos

---

## 🎯 URL Final
```
https://seu-servico.onrender.com  → Next.js (porta 3000)
https://seu-servico.onrender.com/api/v1/... → FastAPI (porta 8000)
```

**Sem CORS errors** porque /api é proxiado pelo Next.js!

---

## ⚡ Vantagens

✅ Sem Docker (leve)  
✅ Sem CORS (proxy do Next.js)  
✅ 1 Web Service  
✅ 1 deploy único  
✅ Nixpacks cuida de tudo  

---

## 🐛 Se der erro

Verifique:
1. `render.yaml` existe na raiz
2. `start.sh` tem permissão de execução
3. `DATABASE_CLOUD_URL` está preenchida
4. `SECRET_KEY` foi gerada

Logs do Render mostram tudo automaticamente.
