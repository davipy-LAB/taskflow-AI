from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta, timezone
from typing import Any
from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

#Essa função cria um contexto de criptografia usando o algoritmo bcrypt.
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
#Essa função cryptografa uma senha simples e retorna a hashed version dela.
def get_password_hash(password: str) -> str:
    password_to_hash = password[:72] 
    return pwd_context.hash(password_to_hash)
def is_password_strong(password: str) -> bool:
    """Verifica se a senha atende aos critérios de segurança."""
    if len(password) < 8:
        return False
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(not c.isalnum() for c in password)
    return has_upper and has_lower and has_digit and has_special
def validate_password_change(old_pass: str, new_pass: str, hashed_pass: str) -> bool:
    """Isso aqui valida se a troca de senha é permitida."""
    if not verify_password(old_pass, hashed_pass):
        return False
    if old_pass == new_pass:
        return False
    if not is_password_strong(new_pass):
        return False
    return True

# Função para criar um token JWT

def create_access_token(
    subject: str | Any, expires_delta: timedelta = None
) -> str:
    """Cria um token de acesso JWT com tempo de expiração."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Usa o valor padrão do config.py (30 minutos)
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # O "sub" (subject) é o identificador do usuário (ex: id ou email)
    to_encode = {"exp": expire, "sub": str(subject)}
    
    # Codifica o token usando o SECRET_KEY e ALGORITHM do config.py
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt