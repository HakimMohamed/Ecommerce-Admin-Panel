/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'd1lyd5qwhzw3jy.cloudfront.net',
            },
        ],
    },
};

module.exports = nextConfig;

