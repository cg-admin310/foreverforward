import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Handshake } from "lucide-react";
import { getPublishedEvents } from "@/lib/actions/events";
import { EventsContent } from "./events-content";

export const metadata = {
  title: "Making Moments",
  description:
    "Making Moments is how Forever Forward turns joy into a strategy: Movies on the Menu dinner-and-a-movie nights, dads-only Off the Clock outings, and Family Takeovers of the fun spots. Free for families across Greater Los Angeles, all year long.",
  keywords: [
    "Making Moments",
    "family events Los Angeles",
    "Movies on the Menu",
    "father child events",
    "free family events LA",
    "community events",
  ],
  openGraph: {
    title: "Making Moments | Forever Forward",
    description:
      "Movie nights, dad outings, and family takeovers. Free for families, and joy is the whole point.",
    type: "website",
    url: "/events",
    images: [{ url: "/images/motm/motm-hero.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/events" },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="animate-pulse space-y-8">
        <div className="h-64 bg-[#2D2D2D] rounded-3xl" />
        <div className="grid sm:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 bg-[#2D2D2D] rounded-3xl" />
          ))}
        </div>
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
      {/* Hero — Making Moments, observatory style */}
      <section className="relative bg-[#141413] overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Full-bleed festival night */}
        <div className="absolute inset-0">
          <Image
            src="/images/future/events-scene.jpg"
            alt="Families at a golden-hour community festival, kids racing robots while fathers cheer"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141413] via-[#141413]/75 to-[#141413]/35" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#141413] to-transparent" />
        </div>
        <div className="absolute inset-0 bg-starfield opacity-40" aria-hidden />
        <div
          className="aurora-blob absolute -top-40 right-[-10%] w-[36rem] h-[36rem] rounded-full bg-[#C9A84C]/10"
          aria-hidden
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#C9A84C]">
            <span className="inline-block h-px w-8 bg-current opacity-60" />
            Our Events · Free for Families · Greater LA
          </div>

          <h1 className="mt-6 font-bold leading-[0.95] tracking-tight max-w-4xl">
            <span className="block text-outline-gold text-[13vw] sm:text-7xl lg:text-[6rem]">
              MAKING
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient text-[13vw] sm:text-7xl lg:text-[6rem] pb-2">
              MOMENTS
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg sm:text-xl text-white/70 leading-relaxed">
            Joy is a strategy, and we plan it like one. Movie nights, dad
            outings, and family takeovers, on the calendar all year long.
          </p>

          <p className="mt-4 text-sm text-white/40">
            Free for families. Founded by a father. 501(c)(3) nonprofit.
          </p>
        </div>
      </section>

      {/* Series grid + upcoming events + registration */}
      <Suspense fallback={<EventsSkeleton />}>
        <EventsContent
          featured={featured ?? null}
          upcoming={upcoming}
          past={past}
          hasEvents={hasEvents}
          eventTypeLabels={eventTypeLabels}
        />
      </Suspense>

      {/* Partner / sponsor CTA */}
      <section className="relative bg-[#141413] py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-starfield opacity-60" aria-hidden />
        <div
          className="aurora-blob absolute -top-32 left-1/4 w-[30rem] h-[30rem] rounded-full bg-[#C9A84C]/10"
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <Link
              href="/get-involved/donate?fund=making-moments"
              className="group relative block rounded-3xl overflow-hidden border border-[#C9A84C]/30 bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] p-8 sm:p-10 min-h-[14rem]"
            >
              <div className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#1A1A1A]/15 flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-[#C9A84C] transition-colors">
                <Heart className="h-5 w-5" />
              </div>
              <p className="text-[#1A1A1A]/70 text-xs font-semibold tracking-[0.3em] uppercase">
                Sponsor a Night
              </p>
              <h3 className="mt-3 font-bold text-[#1A1A1A] text-2xl sm:text-3xl leading-tight max-w-md">
                Put a family in the front row.
              </h3>
              <p className="mt-2 text-[#1A1A1A]/75 max-w-md">
                $500 covers a full Movies on the Menu night: dinner, seats, and a
                memory a kid carries for years. You can be the reason it happens.
              </p>
            </Link>

            <Link
              href="/get-involved/partner"
              className="group relative block rounded-3xl overflow-hidden border border-white/15 bg-white/[0.04] backdrop-blur p-8 sm:p-10 min-h-[14rem] hover:border-[#C9A84C]/50 transition-colors"
            >
              <div className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-[#C9A84C] group-hover:text-[#1A1A1A] transition-colors">
                <Handshake className="h-5 w-5" />
              </div>
              <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase">
                Host With Us
              </p>
              <h3 className="mt-3 font-bold text-white text-2xl sm:text-3xl leading-tight max-w-md">
                Bring a moment to your block.
              </h3>
              <p className="mt-2 text-white/60 max-w-md">
                Organizations, venues, and community leaders: partner with us and
                let&apos;s put joy on your neighborhood&apos;s calendar together.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#E8D48B]">
                Start the conversation
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
