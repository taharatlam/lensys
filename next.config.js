/** @type {import('next').NextConfig} */
const nextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: 'localhost',
  //       destination: 'https://techmatrick.com/lensys',
  //     },
  //   ]
  // },
images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        // port: '',
        // pathname: '/account123/**',
      },
      {
        protocol: 'https',
        // hostname: 'trignoimportexport.com',
        // hostname: 'techmatrick.com',
        hostname: 'lensys.in',
        // port: '',
        // pathname: '/account123/**',
      },
    ],
  },
}

module.exports = nextConfig
