// tailwind.config.js - Versão FINALMENTE CORRIGIDA E COMPLETA

/** @type {import('tailwindcss').Config} */
module.exports = {
  // ATIVAR DARK MODE VIA CLASSE
  darkMode: 'class', 
  
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,html}",
    "./src/pages/**/*.{js,ts,jsx,tsx,html}",
    "./src/components/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      // DEFINIÇÃO DAS CORES CUSTOMIZADAS
      colors: {
        // Cores base para o tema escuro
        'base-dark': '#0A0A0A',      // Fundo principal da tela
        'base-lighter': '#171717',   // Fundo dos containers e cards
        'base-darker': '#000000',    // Borda dos inputs

        // Cores de texto
        'text-light': '#FFFFFF',     // Texto principal
        'text-muted': '#A0A0A0',     // Texto secundário/labels
        
        // Cores de destaque
        'primary': '#2a2db8ff',        // Índice (Indigo) - Usado no lado esquerdo
        'contrast': '#ebbe0eff',       // Amarelo - Usado no botão de ação principal
      },
      
      // SOMBRAS CUSTOMIZADAS
      boxShadow: {
        'lg-primary': '0 10px 15px -3px rgba(99, 102, 241, 0.5), 0 4px 6px -2px rgba(99, 102, 241, 0.05)',
        'xl-primary': '0 20px 25px -5px rgba(99, 102, 241, 0.3), 0 10px 10px -5px rgba(99, 102, 241, 0.04)',
      }
    },
  },
  plugins: [],
};