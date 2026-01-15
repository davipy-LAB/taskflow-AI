import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function RootPage() { // 1. Adicione o 'async' aqui
  const cookieStore = await cookies();     // 2. Adicione o 'await' aqui
  const token = cookieStore.get('auth_token');

  // Se já estiver logado, vai para a home
  if (token) {
    redirect('/home');
  }

  // Se não, vai para o login
  redirect('/login');
}