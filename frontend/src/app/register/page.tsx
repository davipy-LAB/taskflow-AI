// ...existing code...
'use client';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage('');

    const success = await register({
      email,
      password,
      full_name: fullName,
    });

    if (success) {
      setMessage('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-50 to-white dark:from-slate-900 dark:to-black px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: illustration / info */}
        <aside className="hidden md:flex flex-col justify-center px-8 py-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg">
          <h2 className="text-3xl font-semibold mb-3">Bem-vindo ao TaskFlow AI</h2>
          <p className="text-sm opacity-90 mb-6">
            Aprenda, organize e acompanhe seu progresso. Crie uma conta para começar a gerenciar tarefas e estudar idiomas com lições interativas.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full/2 opacity-90" />
              Painel de tarefas inteligente
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full/2 opacity-90" />
              Cursos por idioma com progresso
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full/2 opacity-90" />
              Quizzes e revisões
            </li>
          </ul>
        </aside>

        {/* Right: form */}
        <main className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Crie sua conta</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Nome completo</span>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Seu nome"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="seu@email.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Senha</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-2 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium text-white ${
                isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? 'Registrando...' : 'Registrar'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Já tem conta?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Faça login
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
// ...existing code...