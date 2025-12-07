# backend/app/api/language.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.language import Language, LanguageRead, LessonRead, LessonBase, Lesson, LanguageBase, LessonUpdate, QuizBase, Quiz, QuizRead, QuizSubmission

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

@router.get("/{language_id}/lessons/{lesson_id}", response_model=LessonRead)
def read_lesson(
    language_id: int,
    lesson_id: int,
    session: Session = Depends(get_session)
):
    """
    Busca o conteúdo completo de uma lição específica.
    """
    # 1. Buscar a lição pelo ID e language_id
    lesson = session.exec(
        select(Lesson).where(
            Lesson.id == lesson_id, 
            Lesson.language_id == language_id
        )
    ).first() # Usa .first() para obter o objeto ou None

    if not lesson:
        # Lança a exceção se não encontrar a lição OU se a lição pertencer a outro idioma
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Lição com ID {lesson_id} não encontrada para o idioma {language_id}."
        )
    
    # Se a lição for encontrada, ela será retornada, satisfazendo o ResponseModel
    return lesson

@router.patch("/{language_id}/lessons/{lesson_id}", response_model=LessonRead)
def update_lesson(
    language_id: int,
    lesson_id: int,
    lesson_update: LessonUpdate, # Recebe os dados opcionais
    session: Session = Depends(get_session)
):
    """
    Edita uma lição existente, permitindo a atualização parcial (PATCH).
    """
    lesson = session.get(Lesson, lesson_id)
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
    session.commit()
    session.refresh(lesson)
    
    return lesson

# ----------------------------------------------------------------------
# Rota para Criar Quiz
# ----------------------------------------------------------------------

@router.post("/lessons/{lesson_id}/quizzes", response_model=QuizRead, status_code=status.HTTP_201_CREATED)
def create_quiz_for_lesson(
    lesson_id: int,
    quiz_in: QuizBase, # Os dados da pergunta do quiz
    session: Session = Depends(get_session)
):
    """
    Cria uma nova pergunta de quiz para uma lição específica.
    """
    lesson = session.get(Lesson, lesson_id)
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lição com ID {lesson_id} não encontrado."
        )

    db_quiz = Quiz.model_validate(quiz_in, update={"lesson_id": lesson_id})
    
    session.add(db_quiz)
    session.commit()
    session.refresh(db_quiz)
    
    return db_quiz

# ----------------------------------------------------------------------
# Rota para Submeter Quiz e Avaliar
# ----------------------------------------------------------------------

@router.post("/quizzes/submit")
def submit_quiz_answer(
    submission: QuizSubmission,
    # Assumindo que você tem CurrentUser do seu módulo de autenticação
    # current_user: CurrentUser, 
    session: Session = Depends(get_session)
):
    """
    Recebe a resposta do usuário para um quiz e avalia.
    """
    quiz = session.get(Quiz, submission.quiz_id)
    
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
def read_quizzes_for_lesson(
    lesson_id: int,
    session: Session = Depends(get_session)
):
    """
    Lista todos os quizzes (perguntas) para uma lição específica.
    """
    # 1. Verifica se a lição existe
    lesson = session.get(Lesson, lesson_id)
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lição com ID {lesson_id} não encontrada."
        )

    # 2. Busca todos os quizzes associados a esta lição
    quizzes = session.exec(
        select(Quiz).where(Quiz.lesson_id == lesson_id)
    ).all()
    
    # Retorna a lista de quizzes (pode ser vazia, o que é OK)
    return quizzes