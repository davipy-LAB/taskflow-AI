// src/app/layout.tsx (Exemplo)

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Adiciona 'dark' para forçar o Dark Mode se darkMode: 'class' estiver no tailwind.config.js
    // E aplica a cor de fundo geral.
    <html lang="pt-BR" className="dark bg-base-dark"> 
      <body>
        {children}
      </body>
    </html>
  );
}