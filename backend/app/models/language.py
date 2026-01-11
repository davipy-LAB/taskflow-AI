from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from sqlalchemy.types import JSON
from sqlalchemy import Column

from app.models.user import User

# ----------------------------------------------------------------------
# Modelo de Idioma (o "Curso")
# ----------------------------------------------------------------------

class LanguageBase(SQLModel):
    name: str
    code: str

class Language(LanguageBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    learners_link: List["UserLanguage"] = Relationship(back_populates="language")
    lessons: List["Lesson"] = Relationship(back_populates="language")

# ----------------------------------------------------------------------
# Tabela Intermediária: Rastreamento do Progresso do Usuário
# ----------------------------------------------------------------------

class UserLanguage(SQLModel, table=True):
    """
    Tabela de ligação que rastreia qual idioma um usuário está aprendendo 
    e seu progresso. (Many-to-Many com dados extras).
    """
    user_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="user.id")
    language_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="language.id")
    progress_percentage: float = Field(default=0.0)
    last_access: datetime = Field(default_factory=datetime.utcnow)

    user: "User" = Relationship(back_populates="languages_link")
    language: "Language" = Relationship(back_populates="learners_link")

# ----------------------------------------------------------------------
# Modelo de Lição
# ----------------------------------------------------------------------

class LessonBase(SQLModel):
    title: str = Field(index=True, nullable=False)
    content: str
    order: int = Field(index=True)
    language_id: int = Field(foreign_key="language.id", nullable=False)

class Lesson(LessonBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    language: "Language" = Relationship(back_populates="lessons")
    
    # NOVO: Relacionamento com Quizzes
    quizzes: List["Quiz"] = Relationship(back_populates="lesson") 

class LessonRead(LessonBase):
    id: int

    class Config:
        from_attributes = True

class LessonUpdate(SQLModel):
    """Modelo usado para atualizar parcialmente uma lição."""
    title: Optional[str] = None
    content: Optional[str] = None
    order: Optional[int] = None
    
# ----------------------------------------------------------------------
# NOVO: Modelo de Quiz/Pergunta
# ----------------------------------------------------------------------

class QuizBase(SQLModel):
    question: str
    correct_answer: str
    
    # LINHA CORRIGIDA: Removemos o nullable=False do Field e o adicionamos no Column(JSON, nullable=False)
    options: List[str] = Field(sa_column=Column(JSON, nullable=False)) 
    
    # Chave estrangeira ligando o quiz à lição
    lesson_id: int = Field(foreign_key="lesson.id", nullable=False)

class Quiz(QuizBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relacionamento de volta para a lição
    lesson: "Lesson" = Relationship(back_populates="quizzes")

class QuizRead(QuizBase):
    id: int

# ----------------------------------------------------------------------
# NOVO: Modelo de Requisição para Submissão de Quiz
# ----------------------------------------------------------------------
class QuizSubmission(SQLModel):
    quiz_id: int
    submitted_answer: str

# ----------------------------------------------------------------------
# Modelos de Leitura (Retorno da API)
# ----------------------------------------------------------------------

class LanguageRead(LanguageBase):
    id: int

    class Config:
        from_attributes = True

class UserLanguageRead(SQLModel):
    user_id: int
    language_id: int
    progress_percentage: float
    last_access: datetime

    class Config:
        from_attributes = True