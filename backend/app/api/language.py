# backend/app/api/language.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.language import Language, LanguageRead, LessonRead, LessonBase, Lesson, LanguageBase

router = APIRouter(tags=["languages"], prefix="/languages")

# Endpoint para adicionar um novo idioma (curso)
@router.post("/", response_model=LanguageRead, status_code=status.HTTP_201_CREATED)
def create_language(
    language: LanguageBase,
    session: Session = Depends(get_session)
):
    """
    Adiciona um novo idioma (curso) ao sistema.
    (Esta rota deve ser protegida para administradores em um ambiente real).
    """
    # 1. Checa se o idioma já existe
    existing_lang = session.exec(
        select(Language).where(
            (Language.code == language.code) | (Language.name == language.name)
        )
    ).first()
    
    if existing_lang:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"O idioma '{language.name}' ou o código '{language.code}' já existe."
        )

    # 2. Cria e salva o idioma
    db_language = Language.model_validate(language)
    session.add(db_language)
    session.commit()
    session.refresh(db_language)
    
    return db_language

# Endpoint para listar todos os idiomas disponíveis
@router.get("/", response_model=List[LanguageRead])
def read_languages(
    session: Session = Depends(get_session)
):
    """
    Lista todos os idiomas (cursos) disponíveis para aprendizado.
    """
    languages = session.exec(select(Language)).all()
    return languages

@router.post("/{language_id}/lessons", response_model=LessonRead, status_code=status.HTTP_201_CREATED)
def create_lesson_for_language(
    language_id: int,
    lesson_in: LessonBase, # Os dados da lição no corpo da requisição
    session: Session = Depends(get_session)
):
    """
    Cria uma nova lição para um idioma específico.
    (Em um ambiente real, esta rota seria protegida para administradores/editores.)
    """
    # 1. Verificar se o idioma existe
    language = session.get(Language, language_id)
    if not language:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Idioma com ID {language_id} não encontrado."
        )

    # 2. Criar o objeto Lesson com o ID do idioma
    # Garantimos que a lição pertença ao idioma correto, sobrescrevendo o ID do corpo da requisição
    db_lesson = Lesson.model_validate(lesson_in, update={"language_id": language_id})
    
    session.add(db_lesson)
    session.commit()
    session.refresh(db_lesson)
    
    return db_lesson