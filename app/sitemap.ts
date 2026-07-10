import { MetadataRoute } from "next";

type ChangeFrequency = "weekly" | "monthly" | "always" | "hourly" | "daily" | "yearly" | "never";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forever4ward.org";

// Static routes
const staticRoutes = [
  "",
  "/about",
  "/about/travis",
  "/programs",
  "/events",
  "/events/movies-on-the-menu",
  "/events/off-the-clock",
  "/events/family-takeovers",
  "/contact",
  "/privacy",
  "/get-involved/donate",
  "/get-involved/volunteer",
  "/get-involved/partner",
  "/get-involved/enroll",
];

// Program slugs
const programSlugs = [
  "father-forward",
  "tech-ready-youth",
  "stories-from-my-future",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: (route === "" ? "weekly" : "monthly") as ChangeFrequency,
    priority: route === "" ? 1.0 : route === "/about" || route === "/programs" ? 0.9 : 0.7,
  }));

  // Program pages
  const programPages: MetadataRoute.Sitemap = programSlugs.map((slug) => ({
    url: `${baseUrl}/programs/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as ChangeFrequency,
    priority: 0.8,
  }));

  return [...staticPages, ...programPages];
}
