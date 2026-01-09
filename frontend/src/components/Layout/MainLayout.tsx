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

      {/* Sidebar Mobile/Tablet - ACIMA do conteúdo */}
      <div className="lg:hidden">
        {sidebar}
      </div>

      {/* Layout Principal */}
      <div className="w-full font-display">
        <div className="flex min-h-[calc(100vh-80px)]">
          {/* Sidebar Desktop - AO LADO do conteúdo */}
          <div className="hidden lg:block">
            {sidebar}
          </div>

          <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}