// src/types/auth.ts

/**
 * Modelo de dados para o POST /auth/login
 */
export interface Token {
  access_token: string;
  token_type: "bearer";
}

/**
 * Modelo de dados para o POST /auth/register
 */
export interface UserRegister {
  email: string;
  password: string;
  full_name?: string; // Optional
}

/**
 * Modelo de dados retornado ao ler um usuário (UserRead)
 */
export interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string; // Vindo como string ISO do Python/FastAPI
}

// O resultado do login pode ser uma combinação do Token e dos dados do usuário
export interface AuthResponse {
    token: Token;
    user: User;
}