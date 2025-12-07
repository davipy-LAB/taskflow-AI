# backend/app/api/task.py

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import SQLModel, Session, select

from app.db.session import get_session
from app.models.task import Task, TaskCreate, TaskRead, TaskUpdate, TaskStatus, TaskSuggestionRequest, TaskSuggestionResponse, SuggestedSubtask # Adapte TaskCreate se necessário
# Importe a dependência de autenticação
from app.api.deps import CurrentUser
from datetime import date
from datetime import timedelta

router = APIRouter(tags=["tasks"], prefix="/tasks")

# ----------------------------------------------------------------------
# Rota 1: Criar Tarefa (POST)
# ----------------------------------------------------------------------

# Usaremos TaskBase como input, mas você pode criar um TaskCreate se quiser excluir user_id
class TaskCreate(SQLModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None

@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    current_user: CurrentUser, 
    session: Session = Depends(get_session)
):
    """Cria uma nova tarefa associada ao usuário autenticado."""
    # Valida a entrada e anexa o ID do usuário autenticado
    task_data = task_in.model_dump()
    task_data['user_id'] = current_user.id
    
    db_task = Task.model_validate(task_data)
    
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    
    return db_task

# ----------------------------------------------------------------------
# Rota 2: Listar Todas as Tarefas do Usuário (GET)
# ----------------------------------------------------------------------

@router.get("/", response_model=List[TaskRead])
def read_tasks(
    current_user: CurrentUser,
    session: Session = Depends(get_session)
):
    """Lista todas as tarefas criadas pelo usuário autenticado."""
    tasks = session.exec(
        select(Task).where(Task.user_id == current_user.id)
    ).all()
    
    return tasks

# ----------------------------------------------------------------------
# Rota 3: Atualizar Tarefa (PATCH)
# ----------------------------------------------------------------------

@router.patch("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: CurrentUser,
    session: Session = Depends(get_session)
):
    """Atualiza parcialmente uma tarefa (ex: muda o status para DONE)."""
    task = session.get(Task, task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada.")
    
    # Verifica se a tarefa pertence ao usuário autenticado (Segurança)
    if task.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para editar esta tarefa.")

    update_data = task_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(task, key, value)
        
    session.add(task)
    session.commit()
    session.refresh(task)
    
    return task

# ----------------------------------------------------------------------
# Rota 4: Deletar Tarefa (DELETE)
# ----------------------------------------------------------------------

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    current_user: CurrentUser,
    session: Session = Depends(get_session)
):
    """Deleta uma tarefa específica."""
    task = session.get(Task, task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada.")

    # Verifica se a tarefa pertence ao usuário autenticado (Segurança)
    if task.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para deletar esta tarefa.")

    session.delete(task)
    session.commit()
    
    return

@router.post("/ai-suggest", response_model=TaskSuggestionResponse)
def get_ai_suggestions(
    request: TaskSuggestionRequest,
    current_user: CurrentUser # Protegido pelo usuário autenticado
):
    """
    Simula uma chamada de IA para obter sugestões de quebra de tarefas, título e prazo.
    """
    # *** LÓGICA MOCK (Simulação de IA) ***
    
    # 1. Analisa a complexidade baseada na descrição (MOCK)
    if len(request.description) > 50 and ("projeto" in request.title.lower() or "relatório" in request.title.lower()):
        # Tarefa complexa
        subtasks_data = [
            {"subtask_title": f"Revisar e definir escopo inicial"},
            {"subtask_title": f"Quebrar o {request.title} em três módulos"},
            {"subtask_title": f"Executar e revisar"},
        ]
        suggested_title = f"[AI] Plano de Ação: {request.title}"
        suggested_date = date.today() + timedelta(days=10) # 10 dias de prazo
        feedback = "Identificamos complexidade. A tarefa foi decomposta e um prazo estendido foi sugerido."
        
    else:
        # Tarefa simples
        subtasks_data = [
            {"subtask_title": f"Coletar informações"},
            {"subtask_title": f"Finalizar {request.title}"},
        ]
        suggested_title = request.title
        suggested_date = date.today() + timedelta(days=2) # 2 dias de prazo
        feedback = "Tarefa simples. Sugestão de quebra básica."
        
    return {
        "suggested_title": suggested_title,
        "suggested_due_date": suggested_date,
        "subtasks": subtasks_data,
        "ai_feedback": feedback
    }