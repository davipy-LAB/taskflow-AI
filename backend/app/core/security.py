from passlib.context import CryptContext

#Essa função cria um contexto de criptografia usando o algoritmo bcrypt.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
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