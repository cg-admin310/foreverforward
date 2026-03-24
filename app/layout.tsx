import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Forever Forward | Empowering Fathers, Strengthening Families",
    template: "%s | Forever Forward",
  },
  description:
    "Forever Forward is a 501(c)(3) nonprofit empowering fathers, strengthening families, and inspiring youth through transformative education, leadership training, and community-centered programs. We provide IT services to nonprofits and schools across Los Angeles and the Inland Empire.",
  keywords: [
    "Forever Forward",
    "nonprofit",
    "father empowerment",
    "workforce development",
    "IT training",
    "Black fathers",
    "youth programs",
    "Los Angeles",
    "Inland Empire",
    "Riverside",
    "San Bernardino",
    "tech careers",
    "managed IT services",
    "nonprofit IT",
    "Google IT certification",
  ],
  authors: [{ name: "Thomas TJ Wilform" }],
  creator: "Forever Forward Foundation",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  icons: {
    icon: [
      { url: "/images/brand/ff-favicon-gold.svg", type: "image/svg+xml" },
    ],
    apple: "/images/brand/ff-social-profile-square.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Forever Forward",
    title: "Forever Forward | Empowering Fathers, Strengthening Families",
    description:
      "Transformative education, leadership training, and IT services serving Los Angeles and the Inland Empire.",
    images: [
      {
        url: "/images/brand/ff-social-og-image.svg",
        width: 1200,
        height: 630,
        alt: "Forever Forward - Empowering Fathers, Strengthening Families",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forever Forward",
    description:
      "Empowering fathers, strengthening families, and inspiring youth across LA and the Inland Empire.",
    images: ["/images/brand/ff-social-og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
