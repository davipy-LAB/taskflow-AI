// src/app/dashboard/page.tsx

"use client";

import { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import Sidebar from '@/components/Layout/Sidebar';
import FlowSection from '@/components/home/FlowSection';
import CalendarSection from '@/components/home/CalendarSection';
import LanguageSection from '@/components/home/LanguageSection';
// 🚨 NOVO: Importa o useAuthStore para acessar a função de logout
import { useAuthStore } from '@/stores/authStore'; 

export default function DashboardPage() {
  
  const [activeSection, setActiveSection] = useState('flow');
  // 🚨 NOVO: Obtém a função de logout do store
  const { logout } = useAuthStore(); 
  
  const renderContent = () => {
    // ... (função de renderização) ...
    // Note: O corpo desta função não muda
    switch (activeSection) {
      case 'flow':
        return <FlowSection />;
      case 'calendar':
        return <CalendarSection />;
      case 'language':
        return <LanguageSection />;
      default:
        return <FlowSection />;
    }
  };

  return (
    <MainLayout
      sidebar={(
        <Sidebar
          activeSection={activeSection}
          onNavigate={setActiveSection}
          onLogout={logout}
        />
      )}
    >
      {renderContent()}
    </MainLayout>
  );
}