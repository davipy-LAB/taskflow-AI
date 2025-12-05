from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

# Forward Reference (apenas tipos, sem instâncias)
class User(SQLModel):
    pass

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

class LessonRead(LessonBase):
    id: int

    class Config:
        from_attributes = True

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