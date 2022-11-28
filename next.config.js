/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  typescript:{
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig
