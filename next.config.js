/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure any other Next.js settings here
  output: 'standalone',
  experimental: {
    // Enable server components properly
    serverComponentsExternalPackages: ['@supabase/auth-helpers-nextjs']
  }
}

module.exports = nextConfig 