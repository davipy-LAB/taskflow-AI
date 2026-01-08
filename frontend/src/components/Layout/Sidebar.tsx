// src/components/Layout/Sidebar.tsx

"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Importa o ícone de logout
import { LayoutDashboard, Calendar, BookOpen, LogOut } from 'lucide-react'; 

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  // 🚨 ADICIONA: Propriedade para a função de logout
  onLogout: () => void; 
}

export default function Sidebar({ activeSection, onNavigate, onLogout }: SidebarProps) {

  const router = useRouter();

  const handleLogout = async () => {
    // Chama a função de logout do store (limpa localStorage e estado)
    onLogout();
    // Aguarda um momento para o estado ser atualizado
    await new Promise(resolve => setTimeout(resolve, 100));
    // Redireciona para a página de login
    router.push('/login');
  };
  
  const navItems = [
    { name: 'Flow', id: 'flow', icon: LayoutDashboard, description: 'Dashboard Kanban' },
    { name: 'Calendário', id: 'calendar', icon: Calendar, description: 'Gerenciamento de Agenda' },
    { name: 'Aprendizado', id: 'language', icon: BookOpen, description: 'Old English' },
  ];

  return (
    // Fundo mais escuro, colado na esquerda e com flex para empurrar o Logout para baixo
    <div className="w-64 flex-shrink-0 bg-base-darker border-r border-base-lighter p-4 shadow-2xl flex flex-col justify-between h-full overflow-hidden rounded-r-lg rounded-br-xl"> 
      <div>
        
        {/* Logo/Título */}
        <div className="mb-10 p-3 flex items-center gap-2"> {/* Espaçamento um pouco maior aqui */}
          <span className="text-xl font-semibold text-primary">Taskflow</span>
          <span className="text-xl font-semibold text-white">AI</span>
        </div>

        {/* Navegação Principal */}
        <nav className="space-y-6"> {/* 🚨 MUDANÇA: Aumenta o espaçamento vertical entre os itens */}
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                // Estilo moderno: Borda lateral e fundo semi-transparente para o item ativo
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
  );
}