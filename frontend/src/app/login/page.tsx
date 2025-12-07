// src/app/login/page.tsx

"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore'; 
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Efeito de Proteção e Limpeza: Redireciona se já estiver autenticado.
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
    clearError();
  }, [isAuthenticated, router, clearError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Chama a função de login da store
    const success = await login(email, password);

    // Se o login for bem-sucedido, redireciona
    if (success) {
      router.push('/dashboard');
    }
  };

  // Se já estiver autenticado, mostra um indicador enquanto o router redireciona.
  if (isAuthenticated) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-dark text-white text-xl p-10">
            Redirecionando para o Dashboard...
        </div>
    );
  }

  return (
    // Usa o mesmo layout de fundo e grid da página de Registro
    <div className="min-h-screen flex items-center justify-center bg-base-dark px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Lado Esquerdo: ILUSTRAÇÃO/INFO (Cores primárias) */}
        <aside className="hidden md:flex flex-col justify-center px-8 py-12 rounded-xl bg-primary shadow-lg-primary text-white">
          <h2 className="text-3xl font-semibold mb-3">Bem-vindo(a) de volta!</h2>
          <p className="text-sm opacity-90 mb-6">
            Acesse sua conta para continuar gerenciando suas tarefas e o progresso nos seus cursos de idiomas. Seu Kanban espera por você.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-contrast rounded-full opacity-90" />
              Acesso rápido ao Flow Kanban
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-contrast rounded-full opacity-90" />
              Sincronização de progresso
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-contrast rounded-full opacity-90" />
              Notificações de agenda
            </li>
          </ul>
        </aside>

        {/* Lado Direito: FORMULÁRIO DE LOGIN */}
        <main className="bg-base-lighter rounded-xl shadow-xl-primary p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Entrar no Taskflow AI</h1>

          {/* Exibir Erros */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-400 bg-red-900/40 border border-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Campo Email */}
            <label className="block">
              <span className="text-sm font-medium text-text-muted">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // Estilos de campo Dark Mode consistentes
                className="mt-1 block w-full px-4 py-3 border border-base-darker rounded-md shadow-inner bg-base-darker text-text-light placeholder-text-muted/50 focus:ring-primary focus:border-primary transition duration-150"
                placeholder="seu.email@exemplo.com"
                disabled={isLoading}
              />
            </label>
            
            {/* Campo Senha */}
            <label className="block">
              <span className="text-sm font-medium text-text-muted">Senha</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // Estilos de campo Dark Mode consistentes
                className="mt-1 block w-full px-4 py-3 border border-base-darker rounded-md shadow-inner bg-base-darker text-text-light placeholder-text-muted/50 focus:ring-primary focus:border-primary transition duration-150"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </label>

            {/* Botão de Login */}
            <button
              type="submit"
              // Usa 'contrast' para dar destaque ao botão principal (Amarelo)
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-base-dark bg-contrast hover:bg-contrast/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-contrast disabled:opacity-50 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Link para Cadastro */}
          <div className="mt-6 text-center text-sm text-text-muted">
            Não tem uma conta?{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary-light transition-colors duration-150">
              Crie uma aqui
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}