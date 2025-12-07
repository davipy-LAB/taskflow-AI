// src/components/Layout/Header.tsx - VERSÃO ATUALIZADA

import Link from 'next/link';
import { Briefcase, Github, Linkedin, FileText } from 'lucide-react'; 

export default function Header() {
  
  // Substitua pelos seus links reais
  const externalLinks = [
    { name: 'GitHub', href: 'https://github.com/davipy-lab', icon: Github },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/davi-dias-de-souza-5337872a6/', icon: Linkedin },
    { name: 'Currículo', href: 'https://interactivecv.vercel.app/', icon: FileText },
  ];
  
  return (
    <header className="bg-base-lighter shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        
        {/* 1. Nome do App Estilizado */}
        <Link href="/dashboard" className="flex items-center space-x-2 text-primary hover:text-primary-light transition-colors duration-150">
          <Briefcase className="w-7 h-7 animate-pulse-primary" /> {/* Ícone com animação */}
          <span className="text-2xl font-extrabold tracking-widest">Taskflow AI</span>
        </Link>

        {/* 2. Links Externos Clicáveis (GitHub, LinkedIn, CV) */}
        <nav className="flex items-center space-x-4">
          {externalLinks.map(link => (
            <a 
              key={link.name}
              href={link.href}
              target="_blank" // Abre em nova aba
              rel="noopener noreferrer"
              className="text-text-muted hover:text-contrast transition-colors duration-150 flex items-center space-x-1"
              title={link.name}
            >
              <link.icon className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">{link.name}</span>
            </a>
          ))}
          
          {/* ... (Seu menu de usuário/logout existente ficaria aqui) */}
        </nav>
      </div>
    </header>
  );
}