import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  experimental: {
    useLightningcss: false,
  },

  // Proxy para o backend - NÃO redireciona, apenas faz rewrite interno
  async rewrites() {
    // Em produção no Render, o backend roda internamente em localhost:8000
    // Não precisa de rewrite externo - apenas passa direto
    if (process.env.NODE_ENV === 'production') {
      // Em produção, o backend está no mesmo container em localhost:8000
      // Use rewrite INTERNO (não redireciona a URL)
      return {
        beforeFiles: [
          {
            source: '/api/:path*',
            destination: 'http://127.0.0.1:8000/api/:path*',
          },
        ],
      };
    }

    // Em desenvolvimento local
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;