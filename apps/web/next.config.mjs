/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@workspace/ui', '@workspace/database'],
    distDir: './build',
}

export default nextConfig
