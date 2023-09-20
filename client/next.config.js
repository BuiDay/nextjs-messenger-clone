/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    NEXT_PUBLIC_ZEGO_APPID : 741636087,
    NEXT_PUBLIC_ZEGO_SERVERSECRET : "f3d133d3ffbbb71ae7300d52f49d64a9",
  },
  images: { 
    domains: ['localhost'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
    ],
  },
};

module.exports = nextConfig;
