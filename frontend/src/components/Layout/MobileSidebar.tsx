// src/components/Layout/MobileSidebar.tsx

"use client";

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
  return (
    <Sidebar
      activeSection={activeSection}
      onNavigate={onNavigate}
      onLogout={onLogout}
    />
  );
}