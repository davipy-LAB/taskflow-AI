# 🚀 TaskFlow AI

> **Status:** v3.8 Beta  
> **Autor:** Davi Dias de Souza  
> **Projeto Fullstack autoral**

O **TaskFlow AI** é um gerenciador de tarefas e projetos baseado em **Kanban**, focado em **fluxo**, **organização** e **produtividade real**.  
O projeto foi desenvolvido com arquitetura moderna fullstack e pensado para escalar, incluindo no roadmap a integração de um assistente inteligente (ChatBoy).

Este projeto não nasceu como exercício acadêmico, mas como uma **solução prática** para organização pessoal e de projetos.

<img width="1360" height="680" alt="image" src="https://github.com/user-attachments/assets/22dadda6-7316-4962-b855-2071d479149d" />

---

## 🧠 Motivação

Muitos gerenciadores de tarefas são complexos demais, pouco intuitivos ou visualmente poluídos. O TaskFlow AI foi criado com foco em:
- **UX simples** e intuitiva.
- **Fluxo visual claro** para tomada de decisão.
- **Interação rápida** com feedback instantâneo.
- **Responsividade total** para uso em qualquer lugar.

---

## ✨ Funcionalidades Atuais (Beta)

### 🔐 Autenticação
- Login e registro de usuários.
- Autenticação via **JWT (JSON Web Token)** com sistema de proteção de rotas.
- Persistência de sessão segura.

### 📋 Kanban (Flow)
- Sistema de **Swipe** funcional.
- Estados de tarefas: *A Fazer*, *Em Progresso* e *Concluído*.
- UX otimizada para dispositivos **Touch** (Mobile/Tablet).

https://github.com/user-attachments/assets/d8f5f056-c144-4f50-bb14-5db33a24c831

### 🗓️ Calendário
- Calendário integrado ao backend para visualização temporal.
- Gerenciamento de prazos e datas de vencimento.
- CRUD completo de eventos e compromissos.

https://github.com/user-attachments/assets/585b12b0-935a-43ef-b1c9-51235cef2112

### 📱 Responsividade
- Interface adaptativa (Mobile First).
- Sidebar dinâmica no Desktop e navegação simplificada no Mobile.

---

## 🛠️ Stack Tecnológica

| Frontend | Backend | Banco de Dados |
| :--- | :--- | :--- |
| **Next.js** (App Router) | **Python / FastAPI** | **PostgreSQL** |
| **TypeScript** | **SQLModel / SQLAlchemy** | **Alembic** (Migrações) |
| **Tailwind CSS** | **Pydantic** (Validação) | |
| **Zustand** (State Mgmt) | **JWT Authentication** | |

---

## 🚀 Como Rodar Localmente

O projeto é dividido em duas partes principais: `frontend` e `backend`. Você precisará de dois terminais abertos simultaneamente.

### 1️⃣ Pré-requisitos
- Python 3.10+
- Node.js 18+
- PostgreSQL instalado e rodando.

### 2️⃣ Configuração do Backend
# Entre na pasta do backend
cd backend

# Crie e ative um ambiente virtual
python -m venv venv
# Windows: venv\Scripts\activate | Linux/Mac: source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Crie um arquivo .env na pasta /backend com:
# DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/taskflowdb"
# SECRET_KEY="sua_chave_secreta_aleatoria"

# Inicie o servidor
uvicorn app.main:app --reload --port 8000

# Em outro terminal, entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Acesse localhost:3000/login

---

### Dev
- API modular e escalável
- Separação clara de responsabilidades

---

## 🤖 Integração com IA (Roadmap)

O TaskFlow AI será integrado ao **ChatBoy**, um assistente virtual autoral criado do zero, que irá:

- Sugerir tarefas automaticamente
- Ajudar na organização de projetos
- Gerar checklists
- Auxiliar no aprendizado (ex: línguas antigas)
- Atuar como copiloto de produtividade

> A integração será feita utilizando a engine própria do ChatBoy, adaptada ao contexto do TaskFlow AI.

---

## 🧭 Roadmap

### 🔹 Próximos passos
- Integração completa do ChatBoy
- Melhorias de performance
- Refinamento do calendário

### 🔹 Pós-Beta
- Segurança avançada (2FA)
- Melhorias de escalabilidade
- Novas ferramentas de produtividade

---

## 👨‍💻 Sobre o Autor

**Davi Dias de Souza**  
Desenvolvedor Fullstack com foco em **Machine Learning** e **Arquiteturas Web Modernas**.

Experiência com:
- Python, FastAPI, Flask, Django
- JavaScript, TypeScript
- React, Next.js
- PostgreSQL, SQLAlchemy 
- UX / UI
- NLP e ML
- Cloud e APIs

🔗 LinkedIn:  
[https://www.linkedin.com/in/davi-dias-de-souza-5337872a6/]

---

## 📌 Observação

Este projeto está em **desenvolvimento ativo**.  
Feedbacks são bem-vindos.
