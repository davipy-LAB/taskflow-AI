// src/stores/authStore.ts

import { create } from 'zustand';
import api from '@/api/api'; 
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'; // <-- ADICIONADO

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

const formatError = (errorDetail: any): string => {
    if (Array.isArray(errorDetail)) {
        return errorDetail.map((err) => err.msg).join(', ');
    }
    return errorDetail;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initializeAuth: () => {
    // Tenta recuperar do localStorage ou do Cookie (Dupla camada de segurança)
    const savedToken = localStorage.getItem('token') || Cookies.get('auth_token') || undefined; 
    
    if (savedToken) {
      try {
        const user = decodeToken(savedToken);
        set({ token: savedToken, user, isAuthenticated: true });
        // Sincroniza o cookie caso ele tenha sumido mas o localStorage ainda exista
        Cookies.set('auth_token', savedToken, { expires: 7, sameSite: 'strict' });
      } catch (e) {
        console.error('Erro ao decodificar token salvo:', e);
        get().logout();
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(
        '/auth/login',
        new URLSearchParams({ username: email, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } } 
      ); 
      
      const { access_token } = response.data;
      
      // PERSISTÊNCIA EM COOKIE (Adicionado)
      Cookies.set('auth_token', access_token, { 
        expires: 7, // Expira em 7 dias
        secure: process.env.NODE_ENV === 'production', // Só via HTTPS em produção
        sameSite: 'strict' 
      });

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

  logout: () => {
    localStorage.removeItem('token');
    Cookies.remove('auth_token'); // <-- ADICIONADO
    set({ token: null, user: null, isAuthenticated: false });
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
        await api.post('/auth/register', data);
        set({ isLoading: false });
        return true;
    } catch (err: any) {
        const detail = err.response?.data?.detail;
        const errorMessage = detail ? formatError(detail) : 'Falha ao registrar.';
        set({ error: errorMessage, isLoading: false });
        return false;
    }
  },

  clearError: () => set({ error: null }),
}));