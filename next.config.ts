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
      // Programs consolidated July 2026 — Making Moments became the events hub;
      // From Script to Screen and LULA retired from the public lineup.
      {
        source: "/programs/making-moments",
        destination: "/events",
        permanent: true,
      },
      {
        source: "/programs/from-script-to-screen",
        destination: "/programs",
        permanent: true,
      },
      {
        source: "/programs/lula",
        destination: "/programs",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
