// src/api/api.ts

import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; 
import Cookies from 'js-cookie';

// IMPORTANTE: Esta URL é executada no CLIENTE (browser)
// Em produção (Render): /api/v1 será proxiado pelo Next.js para http://localhost:8000/api/v1
// Em desenvolvimento LOCAL: http://127.0.0.1:8000/api/v1 acessa o backend localmente

// Detecta ambiente corretamente
const isDev = typeof window !== 'undefined' && 
              (window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' || 
               window.location.hostname.startsWith('192.168.') ||
               window.location.hostname.startsWith('10.'));

const API_URL = isDev ? 'http://127.0.0.1:8000/api/v1' : '/api/v1';

// DEBUG: Log para confirmar qual URL está sendo usada
if (typeof window !== 'undefined') {
  console.log('🔍 API Detection:', {
    hostname: window.location.hostname,
    isDev,
    API_URL,
  });
}

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
    
    if (status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;