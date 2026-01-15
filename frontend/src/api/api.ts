// src/api/api.ts

import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; 
import Cookies from 'js-cookie'; // <-- ADICIONADO

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Tenta pegar do store, se não houver, tenta pegar direto do cookie
    const token = useAuthStore.getState().token || Cookies.get('auth_token'); 

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