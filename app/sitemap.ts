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

// Blog categories
const blogCategories = [
  "fatherhood",
  "tech-careers",
  "family",
  "future-tech",
  "community",
  "ai-innovation",
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
    "when-kids-meet-robots-everything-changes",
    "three-career-pathways-for-fathers",
    "movies-on-the-menu-bringing-families-together",
    "tracking-satellites-from-south-la",
    "a-fathers-journey-from-enrollment-to-certification",
    "nonprofits-joining-forces-on-technology",
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
    ...categoryPages,
    ...blogPostPages,
  ];
}
