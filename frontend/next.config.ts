import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  experimental: {
    useLightningcss: false,
  },

  // Proxy para o backend na mesma máquina/container
  async rewrites() {
    return [
      {
        // Tudo que o front chamar para "/api/..." é reescrito para o backend na porta 8000
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;