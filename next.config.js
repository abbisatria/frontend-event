/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend-kmc.siakadpoltekeskmc.ac.id',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
}

module.exports = nextConfig
