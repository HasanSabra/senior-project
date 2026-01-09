/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Environment variables
  env: {
    NEXT_PUBLIC_BACKEND_URL:
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001",
  },

  // Configure Turbopack (Next.js 16 default)
  turbopack: {
    // Empty config to silence the warning - most apps work fine with defaults
  },

  // Basic configuration for compatibility
  experimental: {
    // Remove esmExternals as it's not recommended to modify
  },

  // Image optimization
  images: {
    domains: ["localhost"],
  },

  // Transpile packages if needed
  transpilePackages: [],
};

export default nextConfig;
