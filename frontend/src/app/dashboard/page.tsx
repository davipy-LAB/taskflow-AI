// src/app/dashboard/page.tsx

"use client";

import { useState } from 'react';
// Agora estes imports devem funcionar!
import MainLayout from '@/components/Layout/MainLayout';
import Sidebar from '@/components/Layout/Sidebar';
import FlowSection from '@/components/home/FlowSection';
import CalendarSection from '@/components/home/CalendarSection';
import LanguageSection from '@/components/home/LanguageSection';

export default function DashboardPage() {
  
  // 1. Estado para a navegação na Sidebar
  const [activeSection, setActiveSection] = useState('flow');

  // 2. Função para renderizar o conteúdo
  const renderContent = () => {
    switch (activeSection) {
      case 'flow':
        // ➡️ DASHBOARD KANBAN
        return <FlowSection />;
      case 'calendar':
        // ➡️ AGENDA E CALENDÁRIO
        return <CalendarSection />;
      case 'language':
        // ➡️ APRENDIZADO DE OLD ENGLISH
        return <LanguageSection />;
      default:
        return <FlowSection />;
    }
  };

  return (
    // MainLayout (inclui o Header)
    <MainLayout>
        {/* Container principal que divide a tela entre Sidebar (esquerda) e Conteúdo (direita) */}
        <div className="flex min-h-[calc(100vh-80px)]"> 
            
            {/* Sidebar: componente que contém os 3 links clicáveis */}
            <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
            
            {/* Conteúdo Principal: Exibe a seção ativa */}
            <div className="flex-grow p-8 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    </MainLayout>
  );
}