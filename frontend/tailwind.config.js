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
        'base-dark': '#0b1220',      // Fundo Principal (Corpo do Dashboard) - suave
        'base-lighter': '#0f1724',   // Fundo de Cards e Containers - contraste leve
        'base-darker': '#071021',    // Fundo da Sidebar (Mais escuro que o fundo principal)
        'text-light': '#FFFFFF',
        'text-muted': '#A0A0A0',
        'primary': '#6366f1',        // Roxo/Indigo (Destaque principal)
        'contrast': '#facc15',       // Amarelo (Ação principal: + Nova Task)
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        display: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
      },
      boxShadow: {
        // Sombra suave para o item ativo da Sidebar e cards
        'xl-primary': '0 20px 25px -5px rgba(99, 102, 241, 0.3), 0 10px 10px -5px rgba(99, 102, 241, 0.04)',
      }
    },
  },
  plugins: [],
};