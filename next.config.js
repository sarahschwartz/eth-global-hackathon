/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lens.infura-ipfs.io", "firebasestorage.googleapis.com", "ipfs.io"],
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
