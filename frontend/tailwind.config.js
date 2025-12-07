// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  // ----------------------------------------
  // 1. ATIVAR DARK MODE
  darkMode: 'class', 
  // ----------------------------------------
  
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,html}",
    "./src/pages/**/*.{js,ts,jsx,tsx,html}",
    "./src/components/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      // 🚨 ADIÇÃO: Cores e Sombras Customizadas
      colors: {
        'base-dark': '#0A0A0A',      // Fundo Principal (Corpo do Dashboard)
        'base-lighter': '#171717',   // Fundo de Cards e Containers
        'base-darker': '#000000',    // Fundo da Sidebar (Mais escuro que o fundo principal)
        'text-light': '#FFFFFF',
        'text-muted': '#A0A0A0',
        'primary': '#6366f1',        // Roxo/Indigo (Destaque principal)
        'contrast': '#facc15',       // Amarelo (Ação principal: + Nova Task)
      },
      boxShadow: {
        // Sombra suave para o item ativo da Sidebar e cards
        'xl-primary': '0 20px 25px -5px rgba(99, 102, 241, 0.3), 0 10px 10px -5px rgba(99, 102, 241, 0.04)',
      }
    },
  },
  plugins: [],
};