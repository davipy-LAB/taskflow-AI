// src/components/Layout/MainLayout.tsx

import React from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  // Optional slot so pages can provide a single Sidebar instance
  sidebar?: React.ReactNode;
}

export default function MainLayout({ children, sidebar }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-base-dark text-text-light">
      <Header />

      {/* Layout com Sidebar à esquerda (se fornecido) e conteúdo à direita */}
      <div className="container mx-auto p-0 font-display">
        <div className="flex min-h-[calc(100vh-80px)]">
          {sidebar}

          <main className="flex-grow p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}