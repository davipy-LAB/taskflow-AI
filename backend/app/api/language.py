# backend/app/api/language.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.db.session import get_session
from app.models.language import Language, LanguageRead, LessonRead, LessonBase, Lesson, LanguageBase, LessonUpdate, QuizBase, Quiz, QuizRead, QuizSubmission

router = APIRouter(tags=["languages"], prefix="/languages")

# Endpoint para adicionar um novo idioma (curso)
@router.post("/", response_model=LanguageRead, status_code=status.HTTP_201_CREATED)
async def create_language(
    language: LanguageBase,
    session: AsyncSession = Depends(get_session)
):
    """
    Adiciona um novo idioma (curso) ao sistema.
    (Esta rota deve ser protegida para administradores em um ambiente real).
    """
    # 1. Checa se o idioma já existe
    statement = select(Language).where(
        (Language.code == language.code) | (Language.name == language.name)
    )
    result = await session.execute(statement)
    existing_lang = result.scalar_one_or_none()
    
    if existing_lang:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"O idioma '{language.name}' ou o código '{language.code}' já existe."
        )

    # 2. Cria e salva o idioma
    db_language = Language.model_validate(language)
    session.add(db_language)
    await session.commit()
    await session.refresh(db_language)
    
    return db_language

# Endpoint para listar todos os idiomas disponíveis
@router.get("/", response_model=List[LanguageRead])
async def read_languages(
    session: AsyncSession = Depends(get_session)
):
    """
    Lista todos os idiomas (cursos) disponíveis para aprendizado.
    """
    statement = select(Language)
    result = await session.execute(statement)
    languages = result.scalars().all()
    return languages

@router.post("/{language_id}/lessons", response_model=LessonRead, status_code=status.HTTP_201_CREATED)
async def create_lesson_for_language(
    language_id: int,
    lesson_in: LessonBase, # Os dados da lição no corpo da requisição
    session: AsyncSession = Depends(get_session)
):
    """
    Cria uma nova lição para um idioma específico.
    (Em um ambiente real, esta rota seria protegida para administradores/editores.)
    """
    # 1. Verificar se o idioma existe
    statement = select(Language).where(Language.id == language_id)
    result = await session.execute(statement)
    language = result.scalar_one_or_none()
    
    if not language:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Idioma com ID {language_id} não encontrado."
        )

    # 2. Criar o objeto Lesson com o ID do idioma
    # Garantimos que a lição pertença ao idioma correto, sobrescrevendo o ID do corpo da requisição
    db_lesson = Lesson.model_validate(lesson_in, update={"language_id": language_id})
    
    session.add(db_lesson)
    await session.commit()
    await session.refresh(db_lesson)
    
    return db_lesson

@router.get("/{language_id}/lessons/{lesson_id}", response_model=LessonRead)
async def read_lesson(
    language_id: int,
    lesson_id: int,
    session: AsyncSession = Depends(get_session)
):
    """
    Busca o conteúdo completo de uma lição específica.
    """
    # 1. Buscar a lição pelo ID e language_id
    statement = select(Lesson).where(
        Lesson.id == lesson_id, 
        Lesson.language_id == language_id
    )
    result = await session.execute(statement)
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Lição com ID {lesson_id} não encontrada para o idioma {language_id}."
        )
    
    # Se a lição for encontrada, ela será retornada, satisfazendo o ResponseModel
    return lesson

@router.patch("/{language_id}/lessons/{lesson_id}", response_model=LessonRead)
async def update_lesson(
    language_id: int,
    lesson_id: int,
    lesson_update: LessonUpdate, # Recebe os dados opcionais
    session: AsyncSession = Depends(get_session)
):
    """
    Edita uma lição existente, permitindo a atualização parcial (PATCH).
    """
    statement = select(Lesson).where(Lesson.id == lesson_id)
    result = await session.execute(statement)
    lesson = result.scalar_one_or_none()
    
    if not lesson or lesson.language_id != language_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Lição não encontrada ou não pertence ao idioma especificado."
        )

    # 1. Converte o modelo de atualização para dicionário, IGNORANDO CAMPOS VAZIOS
    update_data = lesson_update.model_dump(exclude_unset=True) 

    # 2. Aplica os dados de atualização na instância do banco de dados
    for key, value in update_data.items():
        setattr(lesson, key, value)
    # -------------------------
    
    session.add(lesson)
    await session.commit()
    await session.refresh(lesson)
    
    return lesson

# ----------------------------------------------------------------------
# Rota para Criar Quiz
# ----------------------------------------------------------------------

@router.post("/lessons/{lesson_id}/quizzes", response_model=QuizRead, status_code=status.HTTP_201_CREATED)
async def create_quiz_for_lesson(
    lesson_id: int,
    quiz_in: QuizBase, # Os dados da pergunta do quiz
    session: AsyncSession = Depends(get_session)
):
    """
    Cria uma nova pergunta de quiz para uma lição específica.
    """
    statement = select(Lesson).where(Lesson.id == lesson_id)
    result = await session.execute(statement)
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lição com ID {lesson_id} não encontrado."
        )

    db_quiz = Quiz.model_validate(quiz_in, update={"lesson_id": lesson_id})
    
    session.add(db_quiz)
    await session.commit()
    await session.refresh(db_quiz)
    
    return db_quiz

# ----------------------------------------------------------------------
# Rota para Submeter Quiz e Avaliar
# ----------------------------------------------------------------------

@router.post("/quizzes/submit")
async def submit_quiz_answer(
    submission: QuizSubmission,
    # Assumindo que você tem CurrentUser do seu módulo de autenticação
    # current_user: CurrentUser, 
    session: AsyncSession = Depends(get_session)
):
    """
    Recebe a resposta do usuário para um quiz e avalia.
    """
    statement = select(Quiz).where(Quiz.id == submission.quiz_id)
    result = await session.execute(statement)
    quiz = result.scalar_one_or_none()
    
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Quiz não encontrado."
        )

    # 1. Avalia a resposta
    is_correct = (submission.submitted_answer == quiz.correct_answer)
    
    # 2. Retorna o resultado para o Front-end
    return {
        "is_correct": is_correct,
        "correct_answer": quiz.correct_answer if not is_correct else None,
        "feedback": "Resposta Correta! Avance." if is_correct else "Tente novamente. Revise o conteúdo."
    }

@router.get("/lessons/{lesson_id}/quizzes", response_model=List[QuizRead])
async def read_quizzes_for_lesson(
    lesson_id: int,
    session: AsyncSession = Depends(get_session)
):
    """
    Lista todos os quizzes (perguntas) para uma lição específica.
    """
    # 1. Verifica se a lição existe
    statement = select(Lesson).where(Lesson.id == lesson_id)
    result = await session.execute(statement)
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lição com ID {lesson_id} não encontrada."
        )

    # 2. Busca todos os quizzes associados a esta lição
    statement = select(Quiz).where(Quiz.lesson_id == lesson_id)
    result = await session.execute(statement)
    quizzes = result.scalars().all()
    
    # Retorna a lista de quizzes (pode ser vazia, o que é OK)
    return quizzes