import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  experimental: {
    useLightningcss: false,
  },

  // Proxy para o backend
  async rewrites() {
    return [
      {
        // Em produção: use a URL do backend deployado
        // Em desenvolvimento: use localhost
        source: '/api/:path*',
        destination: process.env.BACKEND_URL 
          ? `${process.env.BACKEND_URL}/api/:path*`
          : 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;