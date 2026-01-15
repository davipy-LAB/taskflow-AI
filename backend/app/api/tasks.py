# backend/app/api/tasks.py

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession # Importação correta para async
from sqlmodel import select
from datetime import date, timedelta

from app.db.session import get_session
from app.models.task import (
    Task, 
    TaskRead, 
    TaskCreate,
    TaskUpdate, 
    TaskSuggestionRequest, 
    TaskSuggestionResponse
)
# Dependência de autenticação (deve ser async também no deps.py)
from app.api.deps import CurrentUser

router = APIRouter(tags=["tasks"], prefix="/tasks")

# ----------------------------------------------------------------------
# Rota 1: Criar Tarefa (POST)
# ----------------------------------------------------------------------
from datetime import date, datetime

@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    current_user: CurrentUser, 
    session: AsyncSession = Depends(get_session)
):
    # Converta o schema para dicionário
    task_data = task_in.model_dump()
    
    # Se due_date vier como string, o asyncpg quebra. 
    # O Pydantic costuma converter, mas se falhar, forçamos aqui:
    if isinstance(task_data.get("due_date"), str):
        task_data["due_date"] = date.fromisoformat(task_data["due_date"])

    new_task = Task(
        **task_data, 
        user_id=current_user.id,
        created_at=datetime.utcnow() # Garanta que é um objeto datetime
    )
    
    session.add(new_task)
    await session.commit()
    await session.refresh(new_task)
    return new_task

# ----------------------------------------------------------------------
# Rota 2: Listar Tarefas (GET) - ONDE OCORREU O ERRO 'exec'
# ----------------------------------------------------------------------
@router.get("/", response_model=List[TaskRead])
async def read_tasks(
    current_user: CurrentUser,
    session: AsyncSession = Depends(get_session),
    offset: int = 0,
    limit: int = 100,
):
    """Lista todas as tarefas do utilizador autenticado."""
    statement = select(Task).where(Task.user_id == current_user.id).offset(offset).limit(limit)
    
    # CORREÇÃO: AsyncSession usa execute() com await
    results = await session.execute(statement)
    tasks = results.scalars().all()
    return tasks

# ----------------------------------------------------------------------
# Rota 3: Buscar Tarefa por ID (GET)
# ----------------------------------------------------------------------
@router.get("/{task_id}", response_model=TaskRead)
async def read_task(
    task_id: int, 
    current_user: CurrentUser, 
    session: AsyncSession = Depends(get_session)
):
    statement = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return task

# ----------------------------------------------------------------------
# Rota 4: Atualizar Tarefa (PATCH)
# ----------------------------------------------------------------------
@router.patch("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: CurrentUser,
    session: AsyncSession = Depends(get_session),
):
    statement = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    result = await session.execute(statement)
    db_task = result.scalar_one_or_none()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    
    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task

# ----------------------------------------------------------------------
# Rota 5: Eliminar Tarefa (DELETE)
# ----------------------------------------------------------------------
@router.delete("/{task_id}")
async def delete_task(
    task_id: int, 
    current_user: CurrentUser, 
    session: AsyncSession = Depends(get_session)
):
    statement = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    
    await session.delete(task)
    await session.commit()
    return {"ok": True}

# ----------------------------------------------------------------------
# Rota 6: Sugestão de IA
# ----------------------------------------------------------------------
@router.post("/suggest", response_model=TaskSuggestionResponse)
async def suggest_task_details(
    request: TaskSuggestionRequest,
    current_user: CurrentUser
):
    # Lógica mantida, apenas transformada em async para consistência
    subtasks_data = [
        {"subtask_title": "Analisar requisitos iniciais"},
        {"subtask_title": f"Completar {request.title}"}
    ]
    return TaskSuggestionResponse(
        suggested_title=f"[AI] {request.title}",
        suggested_description=f"Sugestão baseada em: {request.description}",
        suggested_due_date=date.today() + timedelta(days=3),
        subtasks=subtasks_data,
        ai_feedback="Sugestão gerada com sucesso."
    )