// src/services/api.ts

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// URL base do seu backend FastAPI
const API_BASE_URL = 'http://localhost:8001/api/v1';

// 1. Cria a instância do Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 2. Interceptor de Requisição
 * Automaticamente anexa o token JWT ao cabeçalho 'Authorization' se ele existir.
 */
api.interceptors.request.use(
  (config) => {
    // Usamos localStorage ou Cookies para obter o token no lado do cliente
    const token = localStorage.getItem('accessToken'); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 3. Interceptor de Resposta
 * Lida com erros 401 (Não Autorizado) globalmente (ex: token expirado).
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Se o erro for 401, podemos forçar o logout do usuário
    if (error.response?.status === 401) {
      // Ex: Chamar a função de logout do Zustand aqui, ou redirecionar
      console.error("Token expirado ou inválido. Forçando logout...");
      localStorage.removeItem('accessToken');
      // window.location.href = '/login'; // Opcional: redirecionar
    }
    return Promise.reject(error);
  }
);

export default api;