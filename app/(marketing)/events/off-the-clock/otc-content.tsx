"use client";

/**
 * Off the Clock — dads-only outings under the Making Moments banner.
 * Same observatory design language as MOTM, half the words.
 * Fathers glance, they don't read.
 */

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, CalendarDays, Handshake, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase",
        light ? "text-[#C9A84C]" : "text-[#A68A2E]"
      )}
    >
      <span className="inline-block h-px w-8 bg-current opacity-60" />
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * 1. Hero
 * ------------------------------------------------------------------------- */

function OtcHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] bg-[#141413] overflow-hidden">
      <motion.div style={{ y: imgY }} className="absolute -inset-y-[8%] inset-x-0">
        <Image
          src="/images/events/otc-hero.jpg"
          alt="A group of fathers fishing off a pier at golden hour, lines in the water, laughing together"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-[#141413]/45 to-[#141413]/60" />
      <div className="absolute inset-0 bg-starfield opacity-40" aria-hidden />

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 min-h-[100svh] flex flex-col justify-end"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full pb-16 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            <Eyebrow light>A Making Moments Series · Dads Only</Eyebrow>
          </motion.div>

          <h1 className="mt-5 font-bold tracking-tight leading-[0.95]">
            <span className="block overflow-hidden">
              <motion.span
                className="block text-white text-[13vw] sm:text-7xl lg:text-8xl"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              >
                OFF THE
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient text-[13vw] sm:text-7xl lg:text-8xl"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
              >
                CLOCK
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-5 max-w-2xl text-lg sm:text-xl text-white/75 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          >
            No kids. No pressure. No agenda. Just dads and good company, doing
            something worth leaving the house for.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
          >
            <Link
              href="/events"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A] font-semibold shadow-[0_0_40px_rgba(201,168,76,0.3)] hover:shadow-[0_0_60px_rgba(201,168,76,0.5)] transition-shadow"
            >
              <CalendarDays className="h-5 w-5" />
              See the Next Outing
            </Link>
            <Link
              href="/get-involved/enroll"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/25 text-white font-semibold hover:border-[#C9A84C]/60 hover:bg-white/5 transition-colors"
            >
              <Handshake className="h-5 w-5 text-[#C9A84C]" />
              Join the Crew
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 2. Marquee strip
 * ------------------------------------------------------------------------- */

const STRIP = [
  "Fishing Trips",
  "Cigar Lounges",
  "Paintball",
  "Golf",
  "Good Company",
];

function MarqueeStrip() {
  const row = [...STRIP, ...STRIP, ...STRIP];
  return (
    <div className="relative bg-[#C9A84C] py-3.5 overflow-hidden border-y border-[#A68A2E]">
      <div className="animate-marquee flex w-max items-center gap-8 pr-8">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 shrink-0">
            <span className="text-[#1A1A1A] font-semibold text-sm sm:text-base tracking-[0.18em] uppercase whitespace-nowrap">
              {item}
            </span>
            <span className="text-[#1A1A1A]/50 text-lg leading-none" aria-hidden>
              ★
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * 3. What a night looks like
 * ------------------------------------------------------------------------- */

const NIGHTS = [
  {
    kicker: "The Pier",
    title: "Cast a line, let it go quiet.",
    text: "Fishing trips where the only rush is the bite.",
    image: "/images/events/otc-fishing.jpg",
    alt: "A father and a friend fishing off a pier at golden hour, close on their hands and the rods",
  },
  {
    kicker: "The Lounge",
    title: "Slow down. Talk it out.",
    text: "Dominoes, a good cigar, and conversation that goes somewhere.",
    image: "/images/events/otc-lounge.jpg",
    alt: "Fathers laughing over a game of dominoes in a warm lounge, cigars and good conversation",
  },
  {
    kicker: "The Field",
    title: "Suit up, split up, go to work.",
    text: "Paintball with the crew. Bragging rights stay on the line.",
    image: "/images/events/otc-paintball.jpg",
    alt: "A group of fathers playing paintball together in a wooded field at golden hour",
  },
  {
    kicker: "The Green",
    title: "Eighteen holes, zero pressure.",
    text: "Golf mornings that have a way of turning into golf all-days.",
    image: "/images/events/otc-golf.jpg",
    alt: "Two fathers golfing together on a green fairway at golden hour",
  },
] as const;

function WhatANightLooksLike() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section className="relative bg-[#141413] py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-starfield opacity-60" aria-hidden />
      <div
        className="aurora-blob absolute top-1/3 -right-40 w-[32rem] h-[32rem] rounded-full bg-[#C9A84C]/10"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" ref={ref}>
        <Eyebrow light>What a Night Looks Like</Eyebrow>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-5 font-semibold text-white text-3xl sm:text-5xl leading-[1.1] tracking-tight max-w-2xl"
        >
          Grown-man time,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
            on the calendar.
          </span>
        </motion.h2>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {NIGHTS.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: EASE }}
              className="group"
            >
              <div className="grain-overlay image-zoom relative aspect-[3/2] rounded-3xl overflow-hidden border border-white/10">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/50 via-transparent to-transparent" />
              </div>
              <p className="mt-5 text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C9A84C]">
                {item.kicker}
              </p>
              <h3 className="mt-2 font-semibold text-white text-xl sm:text-2xl tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-white/60 leading-relaxed">{item.text}</p>
            </motion.article>
          ))}

          {/* Text card: the fellowship */}
          <motion.article
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.34, ease: EASE }}
            className="relative flex flex-col justify-between rounded-3xl border border-[#C9A84C]/30 bg-[#C9A84C]/[0.06] p-8 sm:col-span-2 lg:col-span-2"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30">
              <Heart className="h-5 w-5 text-[#E8D48B]" />
            </span>
            <div className="mt-8">
              <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C9A84C]">
                The Fellowship
              </p>
              <h3 className="mt-2 font-semibold text-white text-xl sm:text-2xl tracking-tight leading-snug">
                Some nights you learn something. Some nights you just talk.
              </h3>
              <p className="mt-2 text-white/60 leading-relaxed">Both count.</p>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 4. Why it exists
 * ------------------------------------------------------------------------- */

function WhyBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section className="relative bg-[#FAFAF8] py-20 sm:py-28 overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8" ref={ref}>
        <Eyebrow>Why This Exists</Eyebrow>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-5xl leading-[1.12] tracking-tight"
        >
          Fathers pour out all week.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
            This is where we refill.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="mt-6 text-[#555555] text-base sm:text-lg leading-relaxed max-w-2xl"
        >
          Strong dads make strong families. And a dad with a crew doesn&apos;t
          carry it alone.
        </motion.p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 5. Closing CTA
 * ------------------------------------------------------------------------- */

function OtcCTA() {
  return (
    <section className="relative bg-[#141413] py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-starfield" aria-hidden />
      <div
        className="aurora-blob absolute -top-32 right-1/4 w-[30rem] h-[30rem] rounded-full bg-[#C9A84C]/12"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Link
              href="/events"
              className="group relative block h-full rounded-3xl overflow-hidden border border-[#C9A84C]/30 bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] p-8 sm:p-10 min-h-[15rem] hover:shadow-[0_0_80px_rgba(201,168,76,0.35)] transition-shadow"
            >
              <p className="text-[#1A1A1A]/70 text-xs font-semibold tracking-[0.3em] uppercase">
                For Dads
              </p>
              <h3 className="mt-3 font-bold text-[#1A1A1A] text-2xl sm:text-3xl leading-tight max-w-md">
                Pull up to the next one.
              </h3>
              <p className="mt-2 text-[#1A1A1A]/75 max-w-md">
                Check the calendar and claim a spot. Free for enrolled fathers.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#1A1A1A]">
                See upcoming events
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <Link
              href="/get-involved/donate?fund=making-moments"
              className="group relative block h-full rounded-3xl overflow-hidden border border-white/15 bg-white/[0.04] backdrop-blur p-8 sm:p-10 min-h-[15rem] hover:border-[#C9A84C]/50 transition-colors"
            >
              <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase">
                For Believers
              </p>
              <h3 className="mt-3 font-bold text-white text-2xl sm:text-3xl leading-tight max-w-md">
                Send a dad on the trip.
              </h3>
              <p className="mt-2 text-white/60 max-w-md">
                Your gift covers the boat, the field, the round. A father gets a
                day that fills him back up, and goes home lighter for his kids.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#E8D48B]">
                Sponsor an outing
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-white/40 text-sm"
        >
          Forever Forward is a 501(c)(3). Events are free for the fathers in our
          programs.
        </motion.p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export function OtcContent() {
  return (
    <>
      <OtcHero />
      <MarqueeStrip />
      <WhatANightLooksLike />
      <WhyBlock />
      <OtcCTA />
    </>
  );
}
