import type { Metadata } from "next";
import { MotmContent } from "./motm-content";

export const metadata: Metadata = {
  title: "Movies on the Menu",
  description:
    "Our signature family night: dinner made by chefs who love what they do, a movie under the stars, and your family front and center. Free, always. Dinner's handled, the movie's picked, and your only job is to be there.",
  keywords: [
    "Movies on the Menu",
    "family movie night Los Angeles",
    "free family events LA",
    "outdoor movie night",
    "father child events",
    "Forever Forward events",
    "Making Moments",
    "free dinner and movie",
  ],
  openGraph: {
    title: "Movies on the Menu | Forever Forward",
    description:
      "Dinner by real chefs. A movie under the stars. Your family, front and center. Free, always.",
    type: "website",
    url: "/events/movies-on-the-menu",
    images: [
      {
        url: "/images/motm/motm-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Families at candlelit dinner tables under string lights watching an outdoor movie at dusk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Movies on the Menu | Forever Forward",
    description:
      "Dinner by real chefs. A movie under the stars. Your family, front and center. Free, always.",
    images: ["/images/motm/motm-hero.jpg"],
  },
  alternates: {
    canonical: "/events/movies-on-the-menu",
  },
};

export default function MoviesOnTheMenuPage() {
  return <MotmContent />;
}
