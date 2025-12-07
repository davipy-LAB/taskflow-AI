// src/api/api.ts

import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // Importa seu Auth Store

// 1. URL base do seu backend
const API_URL = 'http://localhost:8000/api/v1'; // Ajuste esta URL se necessário

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor: Adiciona o token JWT a cada requisição
api.interceptors.request.use(
  (config) => {
    // Acessa o estado atual do useAuthStore
    const token = useAuthStore.getState().token; 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor: Trata erros de autenticação (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      // Se for 401 (Não Autorizado), força logout
      useAuthStore.getState().logout();
      // Redirecionamento deve ser feito pelo componente que chamou a API,
      // mas o logout garante que o estado de auth está limpo.
    }
    return Promise.reject(error);
  }
);


export default api;