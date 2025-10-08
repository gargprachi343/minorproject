/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@workspace/ui', '@workspace/database'],
    distDir: './build',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images-na.ssl-images-amazon.com',
            },
            {
                protocol: 'https',
                hostname: 'm.media-amazon.com',
            },
        ],
    },
}

export default nextConfig
