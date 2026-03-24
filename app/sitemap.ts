import { MetadataRoute } from "next";

type ChangeFrequency = "weekly" | "monthly" | "always" | "hourly" | "daily" | "yearly" | "never";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forever4ward.org";

// Static routes
const staticRoutes = [
  "",
  "/about",
  "/about/travis",
  "/programs",
  "/services",
  "/events",
  "/blog",
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
  "making-moments",
  "from-script-to-screen",
  "stories-from-my-future",
  "lula",
];

// Service slugs
const serviceSlugs = ["managed-it", "software-ai", "low-voltage"];

// Blog categories
const blogCategories = [
  "fatherhood",
  "tech-careers",
  "family",
  "it-for-nonprofits",
  "community",
  "ai",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: (route === "" ? "weekly" : "monthly") as ChangeFrequency,
    priority: route === "" ? 1.0 : route === "/about" || route === "/programs" || route === "/services" ? 0.9 : 0.7,
  }));

  // Program pages
  const programPages: MetadataRoute.Sitemap = programSlugs.map((slug) => ({
    url: `${baseUrl}/programs/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as ChangeFrequency,
    priority: 0.8,
  }));

  // Service pages
  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as ChangeFrequency,
    priority: 0.8,
  }));

  // Blog category pages
  const categoryPages: MetadataRoute.Sitemap = blogCategories.map((cat) => ({
    url: `${baseUrl}/blog/categories/${cat}`,
    lastModified: now,
    changeFrequency: "weekly" as ChangeFrequency,
    priority: 0.6,
  }));

  // TODO: In production, fetch blog posts from Supabase
  // For now, including sample blog post URLs
  const blogPostSlugs = [
    "why-google-it-certification-matters",
    "movies-on-the-menu-bringing-families-together",
    "managed-it-for-nonprofits-guide",
    "from-incarceration-to-it-career",
    "tech-ready-youth-success-stories",
    "ai-tools-for-small-nonprofits",
  ];

  const blogPostPages: MetadataRoute.Sitemap = blogPostSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as ChangeFrequency,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...programPages,
    ...servicePages,
    ...categoryPages,
    ...blogPostPages,
  ];
}
