// src/stores/authStore.ts

import { create } from 'zustand';
import api from '@/api/api'; // Seu cliente API configurado
import { jwtDecode } from 'jwt-decode';

interface UserData {
  id: number;
  email: string;
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Ações
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  initializeAuth: () => void;
  register: (data: any) => Promise<boolean>;
}

const decodeToken = (token: string): UserData => {
  try {
    const decoded: any = jwtDecode(token);
    return { id: decoded.sub, email: decoded.email }; 
  } catch (e) {
    throw new Error("Token inválido.");
  }
};

// 🚨 NOVA FUNÇÃO: Converte o objeto de erro (Pydantic) em uma string legível.
const formatError = (errorDetail: any): string => {
    if (Array.isArray(errorDetail)) {
        // Formato Pydantic: [{loc: [..., 'field_name'], msg: 'message'}, ...]
        return errorDetail.map((err) => {
            // Tenta obter o nome do campo (o último elemento do array 'loc')
            const field = err.loc && err.loc.length > 1 ? err.loc[err.loc.length - 1] : 'Erro Geral';
            return `${field}: ${err.msg}`;
        }).join(' | ');
    }
    // Retorna a mensagem de erro simples, se for uma string, ou um erro genérico
    return typeof errorDetail === 'string' ? errorDetail : 'Erro desconhecido. Tente novamente.';
};


export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
            const user = decodeToken(storedToken);
            set({ token: storedToken, user, isAuthenticated: true });
        } catch (e) {
            localStorage.removeItem('token');
        }
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      
      // 🚨 CORREÇÃO: CRIA URLSearchParams (Form Data)
      const data = new URLSearchParams();
      data.append('username', email); // Envia o email na chave 'username'
      data.append('password', password);
      
      // Envia o Form Data e o Content-Type: application/x-www-form-urlencoded
      const response = await api.post(
        '/auth/login', 
        data, 
        // Headers são opcionais aqui, mas garantem que o Content-Type correto é enviado
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } } 
      ); 
      
      const { access_token } = response.data;
      
      // ... (Restante da lógica de armazenamento e estado do token, que está correta)
      localStorage.setItem('token', access_token);
      const user = decodeToken(access_token);
      
      set({ 
        token: access_token, 
        user,
        isAuthenticated: true,
        isLoading: false 
      });
      return true;

    } catch (err: any) {
      const detail = err.response?.data?.detail;
      const errorMessage = detail ? formatError(detail) : 'Erro de conexão ou credenciais.';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },
  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
        await api.post('/auth/register', data);
        set({ isLoading: false });
        return true;
    } catch (err: any) {
        const detail = err.response?.data?.detail;
        // 🚨 Usa a nova função de formatação
        const errorMessage = detail ? formatError(detail) : 'Falha ao registrar.';
        set({ error: errorMessage, isLoading: false });
        return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false });
  },

  clearError: () => {
    set({ error: null });
  },
}));