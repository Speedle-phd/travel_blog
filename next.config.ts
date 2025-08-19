import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // implement a way to serve images to Image component from docker container
   images: {
      remotePatterns: [
         // {
         //    protocol: 'https',
         //    hostname: 'nadine.speedle.dev',
         //    port: '',
         //    pathname: '/app/public/**', // Adjust the path to match your Docker setup
         //    search: '',
         // },
         {
            protocol: 'https',
            hostname: 'static.speedle.dev',
            port: '',
            pathname: '/**', // Adjust the path to match your Docker setup
            search: '',
         },
      ],
      // path: "/app/public/", // Adjust the path to match your Docker setup
   }

};

export default nextConfig;
