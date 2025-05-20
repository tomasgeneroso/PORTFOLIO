/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/PORTFOLIO', // importante si el repo no es tu usuario, sino un proyecto
};

module.exports = nextConfig;