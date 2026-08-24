import type { NextConfig } from "next"

import {
  apiBoundaryHeaders,
  createSecurityHeaders,
  portalBoundaryHeaders,
} from "./lib/security"

const securityHeaders = createSecurityHeaders({
  production: process.env.NODE_ENV === "production",
})

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: { position: "bottom-right" },
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/api/:path*",
        headers: apiBoundaryHeaders,
      },
      {
        source: "/portal",
        headers: portalBoundaryHeaders,
      },
      {
        source: "/es/portal",
        headers: portalBoundaryHeaders,
      },
    ]
  },
}

export default nextConfig
