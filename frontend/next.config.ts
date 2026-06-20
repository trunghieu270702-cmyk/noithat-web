import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';
    return [
      { source: '/api/units/:path*', destination: `${API_URL}/units/:path*` },
      { source: '/api/projects/:path*', destination: `${API_URL}/projects/:path*` },
      { source: '/api/articles/:path*', destination: `${API_URL}/articles/:path*` },
      { source: '/api/leads/:path*', destination: `${API_URL}/leads/:path*` },
      { source: '/api/supervisions/:path*', destination: `${API_URL}/supervisions/:path*` },
      { source: '/api/v1/auth/:path*', destination: `${API_URL}/auth/:path*` },
    ];
  },
  reactStrictMode: false,
  output: 'standalone',
};

export default nextConfig;
