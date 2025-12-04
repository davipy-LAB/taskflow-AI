from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

# Forward Reference (apenas tipos, sem instâncias)
class User(SQLModel):
    pass

class Language(SQLModel):
    pass

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
    
    # Adicione campos de progresso aqui
    progress_percentage: float = Field(default=0.0)
    last_access: datetime = Field(default_factory=datetime.utcnow)

    # Relacionamentos
    user: "User" = Relationship(back_populates="languages_link")
    language: "Language" = Relationship(back_populates="learners_link")


# ----------------------------------------------------------------------
# Modelo de Idioma (o "Curso")
# ----------------------------------------------------------------------

class LanguageBase(SQLModel):
    name: str
    code: str

class Language(LanguageBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    learners_link: List["UserLanguage"] = Relationship(back_populates="language")


# ----------------------------------------------------------------------
# Modelos de Leitura (Retorno da API) - SEM Relacionamentos
# ----------------------------------------------------------------------

class LanguageRead(LanguageBase):
    id: int

    class Config:
        from_attributes = True

class UserLanguageRead(SQLModel):
    """Schema para leitura - SEM herança de table=True"""
    user_id: int
    language_id: int
    progress_percentage: float
    last_access: datetime

    class Config:
        from_attributes = True