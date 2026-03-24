import type { Metadata } from "next";

const siteConfig = {
  name: "Forever Forward",
  description:
    "Empowering Black fathers and youth through workforce development programs and providing managed IT services for nonprofits in Los Angeles.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://forever4ward.org",
  ogImage: "/og-image.jpg",
  author: "Forever Forward Foundation",
  phone: "(951) 877-5196",
  email: "4ever4wardfoundation@gmail.com",
  address: "6111 S Gramercy Pl, Suite 4, Los Angeles, CA 90047",
  founder: "Thomas 'TJ' Wilform",
};

interface GenerateMetadataOptions {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

export function generateSiteMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  path = "",
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags,
}: GenerateMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle = title === "Home" ? siteConfig.name : `${title} | ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: type === "article" ? "article" : "website",
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.startsWith("http") ? image : `${siteConfig.url}${image}`],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export function generateArticleMetadata({
  title,
  description,
  image,
  path,
  publishedTime,
  modifiedTime,
  author = siteConfig.founder,
  tags = [],
}: {
  title: string;
  description: string;
  image?: string;
  path: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}): Metadata {
  return generateSiteMetadata({
    title,
    description,
    image,
    path,
    type: "article",
    publishedTime,
    modifiedTime,
    author,
    tags,
  });
}

export { siteConfig };
