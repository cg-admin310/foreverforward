import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // IT services were removed from the public site — send old URLs to the mission.
      {
        source: "/services",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/services/free-assessment",
        destination: "/get-involved/partner",
        permanent: true,
      },
      {
        source: "/services/:slug",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
