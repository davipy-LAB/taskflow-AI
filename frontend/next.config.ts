import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  experimental: {
    useLightningcss: false,
  },

  // Proxy para o backend APENAS em desenvolvimento
  async rewrites() {
    // Em produção (Render), não precisa de rewrite, o frontend acessa direto a URL
    if (process.env.NODE_ENV === "production") {
      return [];
    }

    return [
      {
        // Em desenvolvimento: usa localhost
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;