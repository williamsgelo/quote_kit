import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const noIndexHeaders = [
      {
        key: "X-Robots-Tag",
        value: "noindex, nofollow",
      },
    ];

    return [
      {
        source: "/api/:path*",
        headers: noIndexHeaders,
      },
      {
        source: "/q/:path*",
        headers: noIndexHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.quotevia.co.za" }],
        destination: "https://quotevia.co.za/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
