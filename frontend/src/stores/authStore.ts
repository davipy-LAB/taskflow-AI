// src/stores/authStore.ts

import { create } from 'zustand';
import api from '../services/api'; 
import { User, UserRegister, Token } from '../types/auth'; // Tipos de auth.ts

// 1. Define o estado do Store (O que ele armazena)
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 2. Define as ações do Store (O que ele pode fazer)
interface AuthActions {
  // Ações de Autenticação
  login: (email: string, password: string) => Promise<boolean>;
  register: (userIn: UserRegister) => Promise<boolean>;
  logout: () => void;
  // Ação de inicialização para verificar o token ao carregar a página
  initializeAuth: () => void;
  
  // Ações para o Front-end
  clearError: () => void;
}

// Tipo combinado
type AuthStore = AuthState & AuthActions;

// URL do Backend (Para usar no login)
const LOGIN_URL = '/auth/login';
const REGISTER_URL = '/auth/register';

/**
 * Função utilitária para buscar o usuário usando o token atual.
 * NOTE: Você precisará de uma rota GET /users/me no seu backend para isso.
 * Por enquanto, vamos retornar os dados do usuário após o login/registro.
 */
const fetchUserData = async (): Promise<User> => {
    // Rota GET /users/me não foi criada, mas é a prática ideal.
    // Vamos MOCKAR a obtenção do usuário se o token estiver em api.ts
    const response = await api.get('/users/me'); // Rota a ser criada no backend!
    return response.data;
}


// Cria o store Zustand
export const useAuthStore = create<AuthStore>((set, get) => ({
  // ESTADO INICIAL
  user: null,
  isAuthenticated: false,
  isLoading: true, // Começa como true para verificar o token
  error: null,

  // AÇÕES
  clearError: () => set({ error: null }),
  
  // ----------------------------------------------------
  // AÇÃO: INICIALIZAÇÃO (Checa LocalStorage)
  // ----------------------------------------------------
  initializeAuth: () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Se há token, define o header de Auth no Axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // **PRÁTICA IDEAL**: Chamar /users/me para validar o token e obter dados
        // Por enquanto, vamos apenas marcar como autenticado se o token existir
        
        // set(async (state) => {
        //     try {
        //         const user = await fetchUserData(); // Chama a rota /users/me
        //         return { user, isAuthenticated: true, isLoading: false };
        //     } catch (e) {
        //         get().logout(); // Se falhar, desloga
        //         return { isLoading: false };
        //     }
        // });
        
        // MOCK SIMPLIFICADO: Apenas marca como autenticado se o token existir
        set({ isAuthenticated: true, isLoading: false });

      } else {
        set({ isLoading: false });
      }
    } catch (e) {
        // Erro ao acessar localStorage
        set({ isLoading: false });
    }
  },

  // ----------------------------------------------------
  // AÇÃO: REGISTRO
  // ----------------------------------------------------
  register: async (userIn) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<User>(REGISTER_URL, userIn); // Retorna UserRead
      set({ isLoading: false, error: null });
      alert(`Conta criada para ${response.data.email}! Por favor, faça o login.`);
      return true;
    } catch (e: any) {
      const errorMessage = e.response?.data?.detail || 'Falha ao registrar.';
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  // ----------------------------------------------------
  // AÇÃO: LOGIN
  // ----------------------------------------------------
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // 1. O FastAPI espera form-data para /login, não JSON. 
      // O Axios tem que simular o envio de formulário:
      const formData = new URLSearchParams();
      formData.append('username', email); // FASTAPI usa 'username' para o email
      formData.append('password', password);
      
      const response = await api.post<Token>(
        LOGIN_URL, 
        formData, 
        {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );
      
      const { access_token } = response.data;

      // 2. Salva o token no localStorage e no Axios
      localStorage.setItem('accessToken', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // 3. Obtém o usuário (Poderia vir direto do /login, mas você optou pelo Token)
      // Vamos obter os dados do usuário logo após o login para preencher o store
      const user = await fetchUserData(); // Chama a rota /users/me (Assumindo que está criada)
      
      set({ 
          user: user, 
          isAuthenticated: true, 
          isLoading: false, 
          error: null 
      });

      return true;

    } catch (e: any) {
      // Erros 401 do backend vêm com a mensagem em 'detail'
      const errorMessage = e.response?.data?.detail || 'Erro desconhecido no login.';
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  // ----------------------------------------------------
  // AÇÃO: LOGOUT
  // ----------------------------------------------------
  logout: () => {
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization']; // Remove o token do Axios
    set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null
    });
  },
}));