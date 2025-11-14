/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 优化构建
  swcMinify: true,
  // 确保静态文件正确服务
  compress: true,
  // 生产环境优化
  productionBrowserSourceMaps: false,
}

export default nextConfig
