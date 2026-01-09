// src/components/Layout/Sidebar.tsx

"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, BookOpen, LogOut } from 'lucide-react'; 

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onLogout: () => void; 
}

export default function Sidebar({ activeSection, onNavigate, onLogout }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    onLogout();
    await new Promise(resolve => setTimeout(resolve, 100));
    router.push('/login');
  };
  
  const navItems = [
    { name: 'Flow', id: 'flow', icon: LayoutDashboard, description: 'Dashboard Kanban' },
    { name: 'Calendário', id: 'calendar', icon: Calendar, description: 'Gerenciamento de Agenda' },
    { name: 'Aprendizado', id: 'language', icon: BookOpen, description: 'Old English' },
  ];

  return (
    <>
      {/* LAYOUT DESKTOP - Sidebar Vertical */}
      <div className="hidden lg:flex w-64 flex-shrink-0 bg-base-darker border-r border-base-lighter p-4 shadow-2xl flex-col justify-between h-full overflow-hidden rounded-r-lg rounded-br-xl"> 
        <div>
          {/* Logo/Título */}
          <div className="mb-10 p-3 flex items-center gap-2">
            <span className="text-xl font-semibold text-primary">Taskflow</span>
            <span className="text-xl font-semibold text-white">AI</span>
          </div>

          {/* Navegação Principal */}
          <nav className="space-y-6">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-3 p-2.5 rounded-r-lg border-l-4 w-full transition-all duration-200 
                    ${isActive 
                      ? 'border-primary bg-primary/20 text-text-light' 
                      : 'border-transparent text-text-muted hover:bg-base-lighter hover:text-text-light' 
                    }`}
                >
                  <item.icon className="w-4 h-4" /> 
                  <div className="flex flex-col items-start">
                    <span className="font-normal text-sm">{item.name}</span>
                    <span className="text-xs opacity-75">{item.description}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Botão de Logout no Rodapé */}
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 rounded-lg w-full transition-colors duration-200 text-red-400 hover:bg-base-lighter mt-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sair</span>
        </button>
      </div>

      {/* LAYOUT MOBILE/TABLET - Tabs Horizontais */}
      <div className="lg:hidden w-full bg-base-darker border-b border-base-lighter/30">
        <div className="flex items-center justify-between px-4 py-3 gap-2 overflow-x-auto">
          {/* Abas de Navegação */}
          <nav className="flex gap-1 flex-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 text-sm font-medium
                    ${isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-base-lighter text-text-muted hover:bg-base-lighter/80 hover:text-text-light'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className="flex-shrink-0 p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all hover:scale-105"
            title="Sair da conta"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}