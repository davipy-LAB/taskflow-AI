import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// Esta linha avisa a Vercel para não tentar "estatizar" essa página no build
export const dynamic = 'force-dynamic'; 

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  // Se já estiver logado, vai direto para o dashboard
  if (token) {
    redirect('/home');
  }

  // Se não, vai para o login
  redirect('/login');
}