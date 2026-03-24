import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forever4ward.org";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/leads",
          "/clients",
          "/program-management",
          "/documents",
          "/emails",
          "/travis",
          "/billing",
          "/workforce",
          "/events-admin",
          "/resources",
          "/donations",
          "/reports",
          "/blog-manager",
          "/settings",
          "/login",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
