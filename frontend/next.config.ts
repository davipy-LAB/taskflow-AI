import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  experimental: {
    useLightningcss: false,
  },

  // Proxy para o backend (funciona em dev E em produção)
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    return [
      {
        // Em desenvolvimento: usa localhost:8000
        // Em produção (Render): usa BACKEND_URL env var ou localhost:8000
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;