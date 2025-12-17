# backend/app/models/task.py

from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, date

from enum import Enum

from app.models.language import User
# Enum (usamos str para facilitar a visualização no banco e no Pydantic)
class TaskStatus(str, Enum):
    TODO = "to-do"
    IN_PROGRESS = "in-progress"
    DONE = "done"
    
# ----------------------------------------------------------------------
# Modelo de Tarefa
# ----------------------------------------------------------------------
class TaskCreate(SQLModel):
    title: str
    description: Optional[str] = None
    # Usamos Optional aqui, mas com default, para permitir que o usuário omita o campo
    status: Optional[TaskStatus] = TaskStatus.TODO 
    due_date: Optional[date] = None

class TaskBase(SQLModel):
    title: str = Field(index=True, nullable=False)
    description: Optional[str] = None
    
    # Status da Tarefa, com valor padrão 'to-do'
    status: TaskStatus = Field(default=TaskStatus.TODO) 
    
    # Campo opcional para data de vencimento
    due_date: Optional[date] = None
    
    # Chave estrangeira para ligar a tarefa ao Usuário
    user_id: int = Field(foreign_key="user.id", nullable=False)

class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    # Timestamp de criação
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relacionamento para o Usuário
    user: "User" = Relationship(back_populates="tasks")

class TaskRead(TaskBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
    
class TaskUpdate(SQLModel):
    """Modelo para atualização parcial (PATCH) de tarefas."""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    due_date: Optional[date] = None

# --- Nota: A classe User precisa ser atualizada no arquivo user.py ---

# ----------------------------------------------------------------------
# NOVO: Modelos para Sugestão de Tarefas por AI
# ----------------------------------------------------------------------

class TaskSuggestionRequest(SQLModel):
    """Modelo de entrada para o endpoint de sugestão de IA."""
    title: str
    description: str

class SuggestedSubtask(SQLModel):
    """Modelo para um item de sub-tarefa sugerido."""
    subtask_title: str
    
class TaskSuggestionResponse(SQLModel):
    """Modelo de saída com as sugestões da IA."""
    suggested_title: str
    suggested_due_date: Optional[date] = None 
    subtasks: List[SuggestedSubtask]
    ai_feedback: Optional[str] = None # Feedback ou explicação da IA