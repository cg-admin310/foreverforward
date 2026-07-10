"use client";

/**
 * Movies on the Menu — the signature Making Moments night.
 * Cinema flavor on the observatory design language: marquee gold, deep dusk,
 * poster rail, and one job for dad: be there.
 */

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  Clapperboard,
  ChefHat,
  Sparkles,
  Ticket,
  Heart,
  CalendarClock,
} from "lucide-react";
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
 * 1. Hero — the night, wide open
 * ------------------------------------------------------------------------- */

function MotmHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] bg-[#141413] overflow-hidden">
      {/* Full-bleed night */}
      <motion.div style={{ y: imgY }} className="absolute -inset-y-[8%] inset-x-0">
        <Image
          src="/images/motm/motm-hero.jpg"
          alt="Families at long candlelit dinner tables under string lights, watching a glowing outdoor movie screen at dusk"
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
            <Eyebrow light>A Making Moments Signature Night</Eyebrow>
          </motion.div>

          <h1 className="mt-5 font-bold tracking-tight leading-[0.95]">
            <span className="block overflow-hidden">
              <motion.span
                className="block text-white text-[11vw] sm:text-6xl lg:text-8xl"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              >
                MOVIES ON
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient text-[11vw] sm:text-6xl lg:text-8xl"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
              >
                THE MENU
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-5 max-w-2xl text-lg sm:text-xl text-white/75 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          >
            Dinner by chefs who love what they do. A movie under the stars. Your
            family, front and center. Free, always. Your only job is to be there.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
          >
            <a
              href="#now-showing"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A] font-semibold shadow-[0_0_40px_rgba(201,168,76,0.3)] hover:shadow-[0_0_60px_rgba(201,168,76,0.5)] transition-shadow"
            >
              <Clapperboard className="h-5 w-5" />
              See What&apos;s Showing
            </a>
            <Link
              href="/events"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/25 text-white font-semibold hover:border-[#C9A84C]/60 hover:bg-white/5 transition-colors"
            >
              <Ticket className="h-5 w-5 text-[#C9A84C]" />
              Grab Seats for the Next One
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
  "Now Seating",
  "Dinner Included",
  "Free for Families",
  "Chef-Made Menu",
  "You're In the Movie",
  "Bring the Whole Crew",
];

function MarqueeStrip() {
  const row = [...STRIP, ...STRIP];
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
 * 3. Why it matters
 * ------------------------------------------------------------------------- */

function WhyItMatters() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section className="relative bg-[#FAFAF8] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8" ref={ref}>
        <Eyebrow>Why This Night Exists</Eyebrow>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-5xl leading-[1.12] tracking-tight"
        >
          Kids don&apos;t remember every dinner. They remember the night dad was{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
            all the way there.
          </span>
        </motion.h2>

        <div className="mt-10 grid sm:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl">
          {[
            "Life piles up on fathers, and presence is the first thing that gets squeezed out. So we clear the runway: dinner's handled, the movie's picked, the seats are saved.",
            "When the answer to \"how much?\" is \"nothing, you're our guest,\" that says your family matters. No lecture about fatherhood, just a night your kids will bring up at breakfast for a month.",
          ].map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: EASE }}
              className="text-[#555555] text-base sm:text-lg leading-relaxed"
            >
              {text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 4. The experience
 * ------------------------------------------------------------------------- */

const EXPERIENCE = [
  {
    icon: Sparkles,
    kicker: "The Showstopper",
    title: "You're in the movie.",
    text: "Before showtime, our photo booth AI drops your family straight into scenes from the night's film. Then the lights dim and there's your crew, twenty feet tall, getting cheered by the whole park.",
    image: "/images/motm/motm-inthemovie.jpg",
    alt: "A father and his kids laughing as their own faces appear inside a movie scene on the giant outdoor screen",
  },
  {
    icon: ChefHat,
    kicker: "The Menu",
    title: "Real chefs. Real dinner. Real love.",
    text: "Chefs who genuinely love feeding people build a menu around the movie and plate it like your family's the premiere party. Because tonight, you are.",
    image: "/images/motm/motm-chef.jpg",
    alt: "A joyful chef flame-searing a dish at an outdoor event kitchen while kids watch in delight",
  },
  {
    icon: Heart,
    kicker: "The Point",
    title: "Made for memories, on purpose.",
    text: "Blankets out, string lights on, phones optional. We set the stage, your family makes the movie.",
    image: "/images/motm/motm-memories.jpg",
    alt: "A father and daughter wrapped in one blanket, laughing over popcorn in the glow of the movie screen",
  },
];

function ExperienceSection() {
  return (
    <section className="relative bg-[#141413] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-starfield opacity-60" aria-hidden />
      <div
        className="aurora-blob absolute top-1/4 -right-40 w-[32rem] h-[32rem] rounded-full bg-[#C9A84C]/10"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Eyebrow light>The Experience</Eyebrow>
          <h2 className="mt-6 font-semibold text-white text-3xl sm:text-5xl leading-[1.1] tracking-tight">
            We go{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
              all out.
            </span>{" "}
            Here&apos;s what that looks like.
          </h2>
        </div>

        <div className="mt-16 space-y-20 sm:space-y-24">
          {EXPERIENCE.map((item, i) => {
            const flip = i % 2 === 1;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.9, ease: EASE }}
                className={cn(
                  "grid lg:grid-cols-2 gap-8 lg:gap-16 items-center",
                  flip && "lg:[direction:rtl]"
                )}
              >
                <div className="[direction:ltr]">
                  <div className="grain-overlay image-zoom relative aspect-[3/2] rounded-3xl overflow-hidden border border-white/10">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/50 via-transparent to-transparent" />
                  </div>
                </div>
                <div className="[direction:ltr]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30">
                      <item.icon className="h-5 w-5 text-[#E8D48B]" />
                    </span>
                    <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C9A84C]">
                      {item.kicker}
                    </p>
                  </div>
                  <h3 className="mt-5 font-semibold text-white text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-white/60 text-base sm:text-lg leading-relaxed max-w-xl">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 5. Now showing — the poster rail
 * ------------------------------------------------------------------------- */

const POSTERS = [
  {
    title: "A Goofy Movie",
    line: "A dad, a kid, a road trip. Basically our whole mission with a soundtrack.",
    image: "/images/motm/poster-goofy.jpg",
  },
  {
    title: "I'm Gonna Git You Sucka",
    line: "For the grown folks' laugh. Bring your funniest uncle.",
    image: "/images/motm/poster-sucka.jpg",
  },
  {
    title: "The Princess and the Frog",
    line: "Big dreams, hard work, and New Orleans jazz under the stars.",
    image: "/images/motm/poster-princessfrog.jpg",
  },
];

function NowShowing() {
  return (
    <section id="now-showing" className="relative bg-[#1A1A1A] py-24 sm:py-32 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-blueprint opacity-30" aria-hidden />
      <div
        className="aurora-blob absolute -bottom-40 left-1/4 w-[30rem] h-[30rem] rounded-full bg-[#5A7247]/12"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <Eyebrow light>On the Marquee</Eyebrow>
            <h2 className="mt-5 font-bold text-white text-4xl sm:text-6xl tracking-tight leading-[0.98]">
              NOW{" "}
              <span className="text-outline-gold">SHOWING</span>
            </h2>
          </div>
          <p className="text-white/50 text-sm sm:text-base max-w-xs">
            Dates drop soon. Join the newsletter below and you&apos;ll hear it first.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {POSTERS.map((poster, i) => (
            <motion.article
              key={poster.title}
              initial={{ opacity: 0, y: 40, rotate: i === 1 ? 0 : i === 0 ? -1.5 : 1.5 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.85, delay: i * 0.12, ease: EASE }}
              whileHover={{ y: -10, rotate: 0 }}
              className="group relative"
            >
              <div className="grain-overlay relative aspect-[2/3] rounded-2xl overflow-hidden border border-[#C9A84C]/25 shadow-[0_20px_60px_rgba(0,0,0,0.5)] group-hover:shadow-[0_24px_80px_rgba(201,168,76,0.25)] transition-shadow duration-300">
                <Image
                  src={poster.image}
                  alt={`Movies on the Menu event flyer for ${poster.title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                {/* Holo sweep on hover */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-40 transition-opacity">
                  <div className="holo-sweep absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#E8D48B]/30 to-transparent" />
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white font-semibold text-lg leading-snug">{poster.title}</h3>
                  <p className="mt-1 text-white/50 text-sm leading-relaxed">{poster.line}</p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase text-[#E8D48B]">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Date Soon
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 text-white/40 text-sm"
        >
          More titles on the way. Got a movie your family loves?{" "}
          <Link href="/contact" className="text-[#E8D48B] hover:underline">
            Pitch us.
          </Link>
        </motion.p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 6. Closing CTA
 * ------------------------------------------------------------------------- */

function MotmCTA() {
  return (
    <section className="relative bg-[#141413] py-24 sm:py-28 overflow-hidden">
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
              className="group relative block rounded-3xl overflow-hidden border border-[#C9A84C]/30 bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] p-8 sm:p-10 min-h-[15rem] hover:shadow-[0_0_80px_rgba(201,168,76,0.35)] transition-shadow"
            >
              <p className="text-[#1A1A1A]/70 text-xs font-semibold tracking-[0.3em] uppercase">
                For Families
              </p>
              <h3 className="mt-3 font-bold text-[#1A1A1A] text-2xl sm:text-3xl leading-tight max-w-md">
                Bring your crew to the next one.
              </h3>
              <p className="mt-2 text-[#1A1A1A]/75 max-w-md">
                Seats are free and they go fast. Check upcoming events and claim yours.
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
              href="/get-involved/donate"
              className="group relative block rounded-3xl overflow-hidden border border-white/15 bg-white/[0.04] backdrop-blur p-8 sm:p-10 min-h-[15rem] hover:border-[#C9A84C]/50 transition-colors"
            >
              <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase">
                For Believers
              </p>
              <h3 className="mt-3 font-bold text-white text-2xl sm:text-3xl leading-tight max-w-md">
                Put a family in the front row.
              </h3>
              <p className="mt-2 text-white/60 max-w-md">
                $500 covers a family movie night: dinner, seats, and the moment. You
                can be the reason it happens.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#E8D48B]">
                Sponsor a night
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export function MotmContent() {
  return (
    <>
      <MotmHero />
      <MarqueeStrip />
      <WhyItMatters />
      <ExperienceSection />
      <NowShowing />
      <MotmCTA />
    </>
  );
}
