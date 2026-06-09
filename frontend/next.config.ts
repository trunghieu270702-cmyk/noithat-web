import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/api/units/:path*', destination: 'http://localhost:3003/units/:path*' },
      { source: '/api/projects/:path*', destination: 'http://localhost:3003/projects/:path*' },
      { source: '/api/articles/:path*', destination: 'http://localhost:3003/articles/:path*' },
      { source: '/api/leads/:path*', destination: 'http://localhost:3003/leads/:path*' },
      { source: '/api/supervisions/:path*', destination: 'http://localhost:3003/supervisions/:path*' },
      { source: '/api/v1/auth/:path*', destination: 'http://localhost:3003/api/v1/auth/:path*' },
    ];
  },
};

export default nextConfig;
