import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  experimental: {
    useLightningcss: false,
  },

  // ESTA É A PARTE MÁGICA:
  async rewrites() {
    return [
      {
        // Tudo que o front chamar para "/api/..."
        source: '/api/:path*',
        // O Next.js desvia para o seu FastAPI na porta 8000
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;