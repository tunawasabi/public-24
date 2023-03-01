/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['stcnk.s3.ap-northeast-1.amazonaws.com']
  },
  experimental: {
    appDir: true
  },
  reactStrictMode: true,
}

module.exports = nextConfig
