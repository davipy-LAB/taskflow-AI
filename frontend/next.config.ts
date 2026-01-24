import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  experimental: {
    useLightningcss: false,
  },

  // Proxy para o backend (funciona em dev E em produção)
  async rewrites() {
    return [
      {
        // Em desenvolvimento: usa localhost:8000
        // Em produção (Render): usa localhost:8000 (backend roda internamente)
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;