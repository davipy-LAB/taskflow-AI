// src/app/login/page.tsx

'use client';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'next/navigation'; // Use next/navigation para App Router
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Pega a função de login, estado de carregamento e erro do Zustand
  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // Limpa erros anteriores

    const success = await login(email, password);

    if (success) {
      // Redireciona para o dashboard após login bem-sucedido
      router.push('/dashboard'); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Bem-vindo ao Taskflow AI
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Campo de Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="seu@email.com"
            />
          </div>

          {/* Campo de Senha */}
          <div>
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {/* Exibir Erro */}
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="text-center text-sm">
          Ainda não tem conta?{' '}
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Crie uma aqui!
          </Link>
        </div>
      </div>
    </div>
  );
}