/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'nexorealestate.com.ar',
          pathname: '/wp-content/uploads/**',
        },
        {
          protocol: 'https',
          hostname: 'adndevelopers.com.ar',
          pathname: '/wp-content/uploads/**',
        }
      ],
    },
  };
  
  export default nextConfig;
