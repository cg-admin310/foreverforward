import React from "react";
import { siteConfig } from "./metadata";

// Organization Schema
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NonProfit",
    name: "Forever Forward Foundation",
    alternateName: "Forever Forward",
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    foundingDate: "2023",
    founder: {
      "@type": "Person",
      name: siteConfig.founder,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "6111 S Gramercy Pl, Suite 4",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      postalCode: "90047",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: "customer service",
    },
    sameAs: [
      "https://www.facebook.com/foreverforward",
      "https://www.instagram.com/foreverforward",
      "https://www.linkedin.com/company/foreverforward",
    ],
    nonprofitStatus: "501(c)(3)",
  };
}

// Local Business Schema for IT Services
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/services`,
    name: "Forever Forward IT Services",
    description:
      "Enterprise-grade managed IT services for nonprofits and schools in Los Angeles. Staffed by our workforce development program graduates.",
    url: `${siteConfig.url}/services`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "6111 S Gramercy Pl, Suite 4",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      postalCode: "90047",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "33.9850",
      longitude: "-118.3012",
    },
    areaServed: [
      { "@type": "City", name: "Los Angeles" },
      { "@type": "City", name: "Compton" },
      { "@type": "City", name: "Inglewood" },
      { "@type": "City", name: "Carson" },
      { "@type": "City", name: "Long Beach" },
    ],
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  };
}

// Course Schema for Programs
export function generateCourseSchema({
  name,
  description,
  slug,
  duration,
  audience,
}: {
  name: string;
  description: string;
  slug: string;
  duration: string;
  audience: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url: `${siteConfig.url}/programs/${slug}`,
    provider: {
      "@type": "Organization",
      name: "Forever Forward Foundation",
      url: siteConfig.url,
    },
    educationalLevel: audience,
    timeRequired: duration,
    isAccessibleForFree: true,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      courseWorkload: duration,
    },
  };
}

// Event Schema
export function generateEventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  image,
  price,
  url,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  image?: string;
  price?: number;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    ...(endDate && { endDate }),
    location: {
      "@type": "Place",
      name: location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Los Angeles",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
    ...(image && { image }),
    organizer: {
      "@type": "Organization",
      name: "Forever Forward Foundation",
      url: siteConfig.url,
    },
    ...(price !== undefined && {
      offers: {
        "@type": "Offer",
        price: price.toString(),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: url || `${siteConfig.url}/events`,
      },
    }),
  };
}

// Article Schema for Blog Posts
export function generateArticleSchema({
  title,
  description,
  slug,
  image,
  datePublished,
  dateModified,
  author = siteConfig.founder,
  category,
}: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${siteConfig.url}/blog/${slug}`,
    ...(image && { image }),
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Forever Forward Foundation",
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    ...(category && { articleSection: category }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${slug}`,
    },
  };
}

// Service Schema
export function generateServiceSchema({
  name,
  description,
  slug,
  priceRange,
}: {
  name: string;
  description: string;
  slug: string;
  priceRange: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${siteConfig.url}/services/${slug}`,
    provider: {
      "@type": "LocalBusiness",
      name: "Forever Forward IT Services",
      url: siteConfig.url,
    },
    areaServed: {
      "@type": "State",
      name: "California",
    },
    priceRange,
  };
}

// Donate Action Schema
export function generateDonateActionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    name: "Donate to Forever Forward",
    description:
      "Support workforce development programs for Black fathers and youth in Los Angeles",
    recipient: {
      "@type": "NonProfit",
      name: "Forever Forward Foundation",
      url: siteConfig.url,
    },
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/get-involved/donate`,
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
  };
}

// FAQ Schema
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Breadcrumb Schema
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

// Helper to render JSON-LD script tag
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
