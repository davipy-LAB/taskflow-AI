// src/components/Layout/Sidebar.tsx

import Link from 'next/link';
import { LayoutDashboard, Calendar, BookOpen } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  
  // Array de itens de navegação
  const navItems = [
    { 
      name: 'Flow', 
      id: 'flow', 
      icon: LayoutDashboard, 
      description: 'Dashboard Kanban' 
    },
    { 
      name: 'Calendário', 
      id: 'calendar', 
      icon: Calendar, 
      description: 'Gerenciamento de Agenda' 
    },
    { 
      name: 'Aprendizado de Línguas', 
      id: 'language', 
      icon: BookOpen, 
      description: 'Old English' 
    },
  ];

  return (
    // Fundo mais escuro para a sidebar, borda sutil
    <div className="w-64 flex-shrink-0 bg-base-darker border-r border-base-lighter p-4 shadow-xl">
      <nav className="space-y-4">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              // Estilo: Roxo (primary) para ativo, texto suave para inativo
              className={`flex items-center space-x-3 p-3 rounded-lg w-full transition-colors duration-200 
                ${isActive 
                  ? 'bg-primary text-white shadow-lg-primary' 
                  : 'text-text-muted hover:bg-base-lighter hover:text-text-light'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{item.name}</span>
                <span className="text-xs opacity-75">{item.description}</span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}