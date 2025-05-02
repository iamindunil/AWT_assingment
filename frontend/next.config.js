/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/:path*', // Proxy to Backend
      },
    ];
  },
  images: {
    domains: ['books.google.com'], // For book cover images from Google Books API
  },
};

module.exports = nextConfig; 