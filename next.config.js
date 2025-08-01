/** @type {import('next').NextConfig} */
const isGithubPages = process.env.NODE_ENV === 'production';
const nextConfig = {
  
   basePath: isGithubPages ? "/portfolio" : "",
  assetPrefix: isGithubPages ? "/portfolio/" : "",
};

module.exports = nextConfig;
