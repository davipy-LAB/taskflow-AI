// src/components/Layout/MainLayout.tsx

import React from 'react';
import Header from './Header'; // Certifique-se de que o caminho está correto

interface MainLayoutProps {
  children: React.ReactNode;
}

// O componente deve ser exportado por padrão
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    // Aplica o fundo escuro global do seu tema
    <div className="min-h-screen bg-base-dark text-text-light">
      {/* O Header está incluído no layout principal */}
      <Header />
      
      <main className="container mx-auto p-0">
        {children}
      </main>
    </div>
  );
}