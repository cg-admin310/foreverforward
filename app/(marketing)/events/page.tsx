import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  Film,
  Utensils,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { getPublishedEvents } from "@/lib/actions/events";
import { EventsContent } from "./events-content";

export const metadata = {
  title: "Events | Forever Forward",
  description:
    "Join Forever Forward for community events including our signature Movies on the Menu dinner and movie series, info sessions, workshops, and job fairs in Los Angeles.",
  keywords: [
    "family events Los Angeles",
    "Movies on the Menu",
    "community events",
    "father-child events",
    "nonprofit events LA",
  ],
};

const eventTypeLabels: Record<string, string> = {
  movies_on_the_menu: "Movies on the Menu",
  orientation: "Info Session",
  workshop: "Workshop",
  job_fair: "Job Fair",
  community: "Community Event",
  graduation: "Graduation",
  fundraiser: "Fundraiser",
};

// Loading skeleton
function EventsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-64 bg-gray-200 rounded-2xl" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default async function EventsPage() {
  const result = await getPublishedEvents();

  const featured = result.data?.featured;
  const upcoming = result.data?.upcoming || [];
  const past = result.data?.past || [];

  const hasEvents = Boolean(featured) || upcoming.length > 0;

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#2D2D2D]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-sm text-white/80 mb-6">
              <Calendar className="h-4 w-4 text-[#C9A84C]" />
              Community Events
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Where Families{" "}
              <span className="text-[#C9A84C]">Come Together</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
              From our signature Movies on the Menu series to workshops and job
              fairs—our events create opportunities for connection, learning, and fun.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Events Content */}
      <Suspense fallback={<EventsSkeleton />}>
        <EventsContent
          featured={featured ?? null}
          upcoming={upcoming}
          past={past}
          hasEvents={hasEvents}
          eventTypeLabels={eventTypeLabels}
        />
      </Suspense>

      {/* Movies on the Menu Spotlight */}
      <section className="py-16 lg:py-24 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
                Our Signature Series
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-6">
                Movies on the Menu
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                It started as a simple idea: what if movie night could be more
                than just a movie? What if it could be a full experience—a
                themed dinner, a community gathering, and quality time with the
                people who matter most?
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                Every Movies on the Menu event pairs a family-friendly
                blockbuster with a custom dinner menu. We handle the cooking, the
                screening, and the details—you just show up ready to make
                memories.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Themed dinner included in ticket price",
                  "Family-style seating to encourage connection",
                  "Big-screen movie experience",
                  "Activities and games for kids",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70">
                    <Star className="h-4 w-4 text-[#C9A84C] fill-[#C9A84C]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild>
                <Link href="/get-involved/enroll">
                  Sign Up for Event Updates
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                <Image
                  src="/images/generated/movies-on-menu.png"
                  alt="Black families enjoying Movies on the Menu - fathers and children bonding over dinner and a movie"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FBF6E9] flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1A1A1A]">500+</p>
                    <p className="text-sm text-[#888888]">Attendee Goal 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-[#FBF6E9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4">
              Want to Host an Event With Us?
            </h2>
            <p className="text-[#555555] mb-8">
              We partner with organizations, sponsors, and community leaders to
              create impactful events. Let&apos;s talk about how we can collaborate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/get-involved/partner">Become a Partner</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
