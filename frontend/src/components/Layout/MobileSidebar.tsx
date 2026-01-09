// src/components/Layout/MobileSidebar.tsx

"use client";

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

interface MobileSidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
}

export default function MobileSidebar({ 
  activeSection, 
  onNavigate, 
  onLogout 
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão Hambúrguer */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed left-4 top-5 z-40 p-2 rounded-lg bg-base-lighter hover:bg-base-lighter/80 transition-colors"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-text-light" />
        ) : (
          <Menu className="w-5 h-5 text-text-light" />
        )}
      </button>

      {/* Overlay quando menu aberto */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-20 top-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Mobile (desliza) */}
      <div
        className={`fixed left-0 top-20 h-[calc(100vh-80px)] w-48 sm:w-56 bg-base-darker z-30 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        <Sidebar
          activeSection={activeSection}
          onNavigate={(section) => {
            onNavigate(section);
            setIsOpen(false);
          }}
          onLogout={onLogout}
        />
      </div>

      {/* Sidebar Desktop (sempre visível) */}
      <div className="hidden md:block">
        <Sidebar
          activeSection={activeSection}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      </div>
    </>
  );
}
