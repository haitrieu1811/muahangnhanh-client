import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/static/images/**'
      },
      {
        protocol: 'https',
        hostname: 'muahangnhanh-api.tranhaitrieu.com',
        pathname: '/static/images/**'
      },
      {
        protocol: 'http',
        hostname: 'muahangnhanh-api.tranhaitrieu.com',
        pathname: '/static/images/**'
      }
    ]
  }
}

export default withBundleAnalyzer(nextConfig)
