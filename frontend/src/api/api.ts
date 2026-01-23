// src/api/api.ts

import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; 
import Cookies from 'js-cookie';

// Em desenvolvimento: aponta direto para o backend
// Em produção: aponta para /api/v1 (será proxiado pelo Next.js)
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:8000/api/v1'
  : (process.env.NEXT_PUBLIC_API_URL || '/api/v1');

console.log('📡 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Permite cookies
});

api.interceptors.request.use(
  (config) => {
    // Tenta pegar do cookie primeiro (mais confiável)
    let token = Cookies.get('auth_token');
    
    // Se não estiver no cookie, tenta do store
    if (!token) {
      token = useAuthStore.getState().token || undefined;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token enviado:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ Sem token no header');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    console.log('❌ Erro na response:', status, error.response?.data);
    
    if (status === 401) {
      console.log('🔄 Logout por 401');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;