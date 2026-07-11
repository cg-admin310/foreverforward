"use client";

/**
 * Family Takeovers — the whole crew, and we rent out the fun spot.
 * Same observatory design language as MOTM, half the words.
 * Families glance, they don't read.
 */

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, CalendarDays, PartyPopper, Users } from "lucide-react";
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

function FtHero() {
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
          src="/images/events/ft-hero.jpg"
          alt="A family mid-air at a trampoline park, everyone laughing at the top of the bounce"
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
            <Eyebrow light>A Making Moments Series · The Whole Crew</Eyebrow>
          </motion.div>

          <h1 className="mt-5 font-bold tracking-tight leading-[0.95]">
            <span className="block overflow-hidden">
              <motion.span
                className="block text-white text-[13vw] sm:text-7xl lg:text-8xl"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              >
                FAMILY
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient text-[13vw] sm:text-7xl lg:text-8xl"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
              >
                TAKEOVERS
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-5 max-w-2xl text-lg sm:text-xl text-white/75 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          >
            We rent out the fun spot. You bring everybody.
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
              See the Next Takeover
            </Link>
            <Link
              href="/get-involved/donate?fund=making-moments"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/25 text-white font-semibold hover:border-[#C9A84C]/60 hover:bg-white/5 transition-colors"
            >
              <PartyPopper className="h-5 w-5 text-[#C9A84C]" />
              Sponsor a Takeover
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
  "Trampoline Parks",
  "Paintball",
  "Bowling",
  "VR Arcades",
  "Theme Parks",
  "Beach Days",
  "Block Parties",
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
 * 3. What it looks like
 * ------------------------------------------------------------------------- */

const TAKEOVERS = [
  {
    kicker: "The Squad",
    title: "Paintball, family edition.",
    text: "Cousins on your team, dad calling the play. Nobody forgets this one.",
    image: "/images/events/ft-paintball.jpg",
    alt: "A family paintball squad in masks and gear, huddled up planning their next move",
  },
  {
    kicker: "The Strike",
    title: "Bowling, whole crew loud.",
    text: "Lanes on us. Shoes on us. Bragging rights: you handle that part.",
    image: "/images/events/ft-bowling.jpg",
    alt: "A kid celebrating a strike while the whole family jumps up cheering behind them",
  },
  {
    kicker: "The Arcade",
    title: "Strap in, level up.",
    text: "VR headsets on. The whole family gets stuck inside the game.",
    image: "/images/events/ft-vr-arcade.jpg",
    alt: "A family wearing VR headsets together in a colorful arcade, arms raised mid-game",
  },
  {
    kicker: "The Park",
    title: "Ride till your legs shake.",
    text: "A full day at the theme park, gates open just for our families.",
    image: "/images/events/ft-theme-park.jpg",
    alt: "A family riding a theme park ride together, arms up and laughing",
  },
  {
    kicker: "The Shore",
    title: "Sand, sun, and a full crew.",
    text: "Beach days built for building sandcastles and bigger memories.",
    image: "/images/events/ft-beach-day.jpg",
    alt: "A family playing frisbee together on a beach boardwalk at sunset",
  },
] as const;

function WhatItLooksLike() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section className="relative bg-[#141413] py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-starfield opacity-60" aria-hidden />
      <div
        className="aurora-blob absolute top-1/3 -left-40 w-[32rem] h-[32rem] rounded-full bg-[#5A7247]/12"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" ref={ref}>
        <Eyebrow light>What a Takeover Looks Like</Eyebrow>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-5 font-semibold text-white text-3xl sm:text-5xl leading-[1.1] tracking-tight max-w-2xl"
        >
          The whole spot,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
            just for our families.
          </span>
        </motion.h2>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TAKEOVERS.map((item, i) => (
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

          {/* Text card: the point */}
          <motion.article
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.34, ease: EASE }}
            className="relative flex flex-col justify-between rounded-3xl border border-[#C9A84C]/30 bg-[#C9A84C]/[0.06] p-8"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30">
              <Users className="h-5 w-5 text-[#E8D48B]" />
            </span>
            <div className="mt-8">
              <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C9A84C]">
                The Point
              </p>
              <h3 className="mt-2 font-semibold text-white text-xl sm:text-2xl tracking-tight leading-snug">
                Everybody in. Nobody watching from the car.
              </h3>
              <p className="mt-2 text-white/60 leading-relaxed">
                Grandma included.
              </p>
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
          Kids remember the day{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
            the whole family showed up.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="mt-6 text-[#555555] text-base sm:text-lg leading-relaxed max-w-2xl"
        >
          Joy is a strategy. We plan it like one.
        </motion.p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 5. Closing CTA
 * ------------------------------------------------------------------------- */

function FtCTA() {
  return (
    <section className="relative bg-[#141413] py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-starfield" aria-hidden />
      <div
        className="aurora-blob absolute -top-32 left-1/4 w-[30rem] h-[30rem] rounded-full bg-[#C9A84C]/12"
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
                For Families
              </p>
              <h3 className="mt-3 font-bold text-[#1A1A1A] text-2xl sm:text-3xl leading-tight max-w-md">
                Bring everybody to the next one.
              </h3>
              <p className="mt-2 text-[#1A1A1A]/75 max-w-md">
                Spots go fast when the whole park is ours. Check the calendar and
                claim yours.
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
                Rent the fun spot for a family.
              </h3>
              <p className="mt-2 text-white/60 max-w-md">
                Your gift books the lanes, the park, the whole day. Families just
                show up and play.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#E8D48B]">
                Sponsor a takeover
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
          Forever Forward is a 501(c)(3). Takeovers are free or low-cost for
          families, always.
        </motion.p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export function FtContent() {
  return (
    <>
      <FtHero />
      <MarqueeStrip />
      <WhatItLooksLike />
      <WhyBlock />
      <FtCTA />
    </>
  );
}
