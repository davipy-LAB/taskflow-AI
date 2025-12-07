// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração do React Compiler
  reactCompiler: true,
  
  // CONFIGURAÇÃO PARA DESATIVAR O COMPILADOR DE CSS PROBLEMÁTICO
  experimental: {
    useLightningcss: false, // <-- Adicione esta linha
  },
};

export default nextConfig;