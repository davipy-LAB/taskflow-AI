// src/app/dashboard/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import Sidebar from '@/components/Layout/Sidebar';
import FlowSection from '@/components/home/FlowSection';
import CalendarSection from '@/components/home/CalendarSection';
import LanguageSection from '@/components/home/LanguageSection';
import { useAuthStore } from '@/stores/authStore'; 

export default function DashboardPage() {
  
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('flow');
  const { logout, isAuthenticated } = useAuthStore(); 
  
  // Proteção: Se não estiver autenticado, redireciona para login
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-dark text-white">
        Carregando...
      </div>
    );
  }
  
  const renderContent = () => {
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