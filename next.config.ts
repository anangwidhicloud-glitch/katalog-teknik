import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi gambar untuk mengizinkan Cloudinary
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      pathname: '/dwe145gm2/image/upload/**',
    },
  ],
},
  // Konfigurasi SASS Anda tetap di sini
  sassOptions: {
    includePaths: [
      path.join(process.cwd(), "node_modules"),
      path.join(process.cwd(), "app", "styles"),
    ],
  },
};

export default nextConfig;