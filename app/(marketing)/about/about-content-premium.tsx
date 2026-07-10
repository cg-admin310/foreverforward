"use client";

/**
 * Forever Forward — About / Our Mission
 * Design language: "Afro-futurist observatory" — deep-space blacks, gold
 * starlight, orbit motifs. The story of who's holding the telescope.
 */

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Bot,
  Printer,
  Satellite,
  Heart,
  Handshake,
  MapPin,
  Globe2,
  DoorOpen,
  Compass,
} from "lucide-react";
import {
  MISSION,
  PILLARS,
  FUTURE_TECH,
  COMMUNITY_TECH,
  IMPACT_GOALS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ----------------------------------------------------------------------------
 * Shared bits
 * ------------------------------------------------------------------------- */

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

/** Outline section marker — "01", "02" … the observatory logbook numbers. */
function SectionNumber({ n, light = false }: { n: string; light?: boolean }) {
  return (
    <span
      className={cn(
        "block font-bold text-6xl sm:text-7xl leading-none select-none",
        light ? "text-outline-gold" : "text-outline-gold opacity-80"
      )}
      aria-hidden
    >
      {n}
    </span>
  );
}

/** Line-by-line rise-in for big statements. */
function RevealLines({ lines, className }: { lines: React.ReactNode[]; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block will-change-transform"
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : { y: "110%" }}
            transition={{ duration: 0.85, delay: i * 0.12, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ----------------------------------------------------------------------------
 * 1. Hero — we started with what we knew
 * ------------------------------------------------------------------------- */

function AboutHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] bg-[#141413] overflow-hidden flex items-center"
    >
      <div className="absolute inset-0 bg-starfield bg-starfield-twinkle" aria-hidden />
      <div
        className="aurora-blob absolute -top-48 -left-40 w-[34rem] h-[34rem] rounded-full bg-[#C9A84C]/12"
        aria-hidden
      />
      <div
        className="aurora-blob absolute -bottom-48 -right-32 w-[30rem] h-[30rem] rounded-full bg-[#5A7247]/18"
        style={{ animationDelay: "-7s" }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full pt-28 pb-16 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Copy */}
          <motion.div style={{ y: textY, opacity: fade }} className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              <Eyebrow light>Our Mission · Los Angeles · Est. 2023</Eyebrow>
            </motion.div>

            <h1 className="mt-6 font-bold tracking-tight leading-[1.04]">
              <RevealLines
                className="text-white text-[9vw] sm:text-5xl lg:text-[3.9rem]"
                lines={[
                  <>We started with</>,
                  <>what we knew.</>,
                  <span
                    key="gold"
                    className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient pb-2"
                  >
                    We&rsquo;re building
                  </span>,
                  <span
                    key="gold2"
                    className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient pb-2"
                  >
                    what comes next.
                  </span>,
                ]}
              />
            </h1>

            <motion.p
              className="mt-7 max-w-xl text-base sm:text-lg text-white/70 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            >
              {MISSION.statement}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            >
              {["501(c)(3) Nonprofit", "Founded by a Father", "Rooted in South LA"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2.5 text-sm text-white/50">
                    <svg width="12" height="12" viewBox="0 0 14 14" className="text-[#C9A84C]" aria-hidden>
                      <path d="M2 1l6 6-6 6M7 1l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                    {item}
                  </span>
                )
              )}
            </motion.div>
          </motion.div>

          {/* Image — father and daughter over the skyline */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
              className="relative max-w-md mx-auto lg:max-w-none"
            >
              {/* Offset gold frame */}
              <div
                className="absolute -inset-3 sm:-inset-4 translate-x-4 translate-y-4 rounded-3xl border border-[#C9A84C]/25"
                aria-hidden
              />
              <motion.div
                style={{ y: imgY }}
                className="grain-overlay relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10"
              >
                <Image
                  src="/images/future/about-legacy.jpg"
                  alt="A father carries his daughter on his shoulders at sunrise, looking out over the Los Angeles skyline"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/75 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[#E8D48B] text-[11px] font-semibold tracking-[0.25em] uppercase">
                    The whole point
                  </p>
                  <p className="text-white text-lg sm:text-xl font-semibold mt-1 leading-snug">
                    Kids on shoulders, looking past the skyline.
                  </p>
                </div>
              </motion.div>

              {/* Orbiting accent */}
              <div className="absolute -top-10 -left-10 w-24 h-24 hidden sm:block" aria-hidden>
                <div className="absolute inset-0 orbit-ring" />
                <div className="absolute inset-0 orbit-carrier-slow">
                  <span className="orbit-satellite absolute -top-1 left-1/2 w-2 h-2" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-white/40"
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">The Story</span>
        <motion.span
          className="block w-px h-10 bg-gradient-to-b from-[#C9A84C] to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 2. Founder — Compton, data centers, and building forward
 * ------------------------------------------------------------------------- */

const FOUNDER_BEATS = [
  {
    kicker: "Where it started",
    text: "Compton. A neighborhood full of talent the tech industry never bothered to visit.",
  },
  {
    kicker: "What he built",
    text: "Data centers — the physical backbone of the internet — for a living. Racks, cables, uptime, the whole thing.",
  },
  {
    kicker: "What he noticed",
    text: "The rooms he worked in were shaping the future. The block he came from wasn't invited into them.",
  },
  {
    kicker: "What he did about it",
    text: "Founded Forever Forward in 2023 to hold that door open — for fathers like him first, and for every kid coming up behind them.",
  },
];

function FounderSection() {
  return (
    <section className="relative bg-[#FAFAF8] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-end gap-5">
          <SectionNumber n="01" />
          <div className="pb-1.5">
            <Eyebrow>The Founder</Eyebrow>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="lg:col-span-5 lg:sticky lg:top-28"
          >
            <div className="grain-overlay image-zoom relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/brand/founderpic.jpg"
                alt="Thomas 'TJ' Wilform, Founder and CEO of Forever Forward"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white font-semibold text-xl">Thomas &ldquo;TJ&rdquo; Wilform</p>
                <p className="text-[#E8D48B] text-sm">Founder &amp; CEO · Father · Compton-raised</p>
              </div>
            </div>
          </motion.div>

          {/* Story */}
          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="font-semibold text-[#1A1A1A] text-3xl sm:text-4xl lg:text-[2.9rem] leading-[1.12] tracking-tight"
            >
              &ldquo;{MISSION.founderNote}&rdquo;
            </motion.h2>

            <div className="mt-10 space-y-0">
              {FOUNDER_BEATS.map((beat, i) => (
                <motion.div
                  key={beat.kicker}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                  className="group relative pl-8 pb-9 last:pb-0 border-l border-[#DDDDDD] last:border-transparent"
                >
                  <span className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full bg-[#FAFAF8] border-2 border-[#C9A84C] group-hover:bg-[#C9A84C] transition-colors" />
                  <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#A68A2E]">
                    {beat.kicker}
                  </p>
                  <p className="mt-2 text-[#555555] text-base sm:text-lg leading-relaxed max-w-xl">
                    {beat.text}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="mt-10 text-[#1A1A1A] text-lg sm:text-xl leading-relaxed font-medium max-w-xl"
            >
              TJ doesn&rsquo;t serve the fathers in our programs from across a desk. He&rsquo;s
              lived their story — which is why every program starts from respect, never
              rescue.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 3. The three pillars
 * ------------------------------------------------------------------------- */

function PillarRow({ pillar, index }: { pillar: (typeof PILLARS)[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.85, delay: index * 0.08, ease: EASE }}
    >
      <Link
        href={pillar.href}
        className="group grid sm:grid-cols-[2fr_3fr] items-stretch rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-[#C9A84C]/40 transition-colors"
      >
        <div className="grain-overlay image-zoom relative aspect-[4/3] sm:aspect-auto sm:min-h-[15rem] overflow-hidden">
          <Image
            src={pillar.image}
            alt={pillar.headline}
            fill
            sizes="(max-width: 640px) 100vw, 40vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#141413]/40 hidden sm:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/50 to-transparent sm:hidden" />
        </div>
        <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-4">
              <span className="text-outline-gold font-bold text-4xl sm:text-5xl leading-none select-none">
                0{index + 1}
              </span>
              <div>
                <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase">
                  {pillar.name}
                </p>
                <p className="text-white/40 text-xs mt-0.5 tracking-wide">{pillar.kicker}</p>
              </div>
            </div>
            <span className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C] group-hover:text-[#1A1A1A] transition-colors shrink-0">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
          <h3 className="mt-4 font-semibold text-white text-xl sm:text-2xl leading-snug tracking-tight">
            {pillar.headline}
          </h3>
          <p className="mt-3 text-white/55 text-sm sm:text-base leading-relaxed">
            {pillar.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

function PillarsSection() {
  return (
    <section className="relative bg-[#141413] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-starfield opacity-70" aria-hidden />
      <div
        className="aurora-blob absolute top-1/4 -right-40 w-[30rem] h-[30rem] rounded-full bg-[#C9A84C]/10"
        aria-hidden
      />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-end gap-5">
          <SectionNumber n="02" light />
          <div className="pb-1.5">
            <Eyebrow light>The Mission, In Three Moves</Eyebrow>
          </div>
        </div>
        <h2 className="mt-8 font-semibold text-white text-3xl sm:text-5xl leading-[1.1] tracking-tight max-w-3xl">
          Fathers get careers. Kids get the future.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
            Families get their moments.
          </span>
        </h2>
        <div className="mt-14 space-y-6">
          {PILLARS.map((pillar, i) => (
            <PillarRow key={pillar.id} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 4. The tech we champion
 * ------------------------------------------------------------------------- */

const TECH_ICONS = { ai: Cpu, robotics: Bot, printing: Printer, orbit: Satellite } as const;

function TechStrip() {
  return (
    <section className="relative bg-[#F5F3EF] py-24 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-blueprint opacity-50" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Eyebrow>The Tech We Champion</Eyebrow>
          <h2 className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.12] tracking-tight">
            Not tech for tech&rsquo;s sake —{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
              tomorrow&rsquo;s tools, in today&rsquo;s hands.
            </span>
          </h2>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {FUTURE_TECH.map((tech, i) => {
            const Icon = TECH_ICONS[tech.id as keyof typeof TECH_ICONS] ?? Cpu;
            return (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="group relative rounded-2xl bg-white border border-[#DDDDDD] p-6 sm:p-7 hover:border-[#C9A84C] hover:shadow-[0_8px_30px_rgba(201,168,76,0.16)] transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                <Icon className="h-7 w-7 text-[#A68A2E]" />
                <h3 className="mt-4 font-semibold text-[#1A1A1A] leading-snug">{tech.name}</h3>
                <p className="mt-2 text-[#555555] text-sm leading-relaxed">{tech.line}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="mt-10 text-[#555555] text-base sm:text-lg max-w-2xl"
        >
          The first time a kid races a robot they built, or a father watches a satellite
          he tracked pass over his own block, &ldquo;someday&rdquo; turns into{" "}
          <span className="font-semibold text-[#1A1A1A]">&ldquo;why not us?&rdquo;</span>
        </motion.p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 5. Stronger together — collaboration, never sales
 * ------------------------------------------------------------------------- */

function StrongerTogether() {
  return (
    <section className="relative bg-[#FAFAF8] py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-24 bg-chevron-band opacity-50" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-end gap-5">
          <SectionNumber n="03" />
          <div className="pb-1.5">
            <Eyebrow>{COMMUNITY_TECH.kicker}</Eyebrow>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <h2 className="font-semibold text-[#1A1A1A] text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.12] tracking-tight">
              {COMMUNITY_TECH.headline}
            </h2>
            <p className="mt-5 text-[#555555] text-base sm:text-lg leading-relaxed">
              {COMMUNITY_TECH.description}
            </p>
            <ul className="mt-8 space-y-4">
              {[
                {
                  icon: Handshake,
                  text: "We build community apps with fellow nonprofits — shoulder to shoulder, never as vendors.",
                },
                {
                  icon: Globe2,
                  text: "We share tools, training, and AI know-how so every partner org levels up together.",
                },
                {
                  icon: Heart,
                  text: "Partners like A New Day Foundation — founded by Dawnn Lewis — co-create events and put laptops in kids' hands.",
                },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-4">
                  <span className="mt-0.5 w-9 h-9 rounded-xl bg-[#EFF4EB] flex items-center justify-center shrink-0">
                    <item.icon className="h-4.5 w-4.5 text-[#5A7247]" />
                  </span>
                  <span className="text-[#1A1A1A] text-sm sm:text-base leading-relaxed">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/get-involved/partner"
              className="mt-9 inline-flex items-center gap-2 font-semibold text-[#5A7247] hover:text-[#3D5030] transition-colors group"
            >
              Build with us
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative"
          >
            <div className="grain-overlay image-zoom relative aspect-[16/11] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/future/community-builders.jpg"
                alt="Nonprofit leaders collaborating around a touchscreen, reviewing a community app together"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/45 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 glass-dark rounded-xl px-4 py-2.5 border border-[#C9A84C]/30">
                <p className="text-white text-sm font-semibold">Collaboration, never sales.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 6. How we work — values + where we show up
 * ------------------------------------------------------------------------- */

const VALUES = [
  {
    icon: DoorOpen,
    title: "Open to everyone",
    text: "Our programs are designed around Black fathers and youth — because that's who TJ is and where the gap is widest — and the door is open to every family, full stop.",
  },
  {
    icon: Compass,
    title: "Lived experience leads",
    text: "We don't guess what fathers need. Our founder is one. Programs are built from the inside out — respect first, never charity-pity.",
  },
  {
    icon: Satellite,
    title: "Future-focused, always",
    text: "If a technology is shaping tomorrow, our community meets it today. Exposure first — then training, credentials, and careers.",
  },
  {
    icon: Heart,
    title: "Joy counts as impact",
    text: "A father and kid laughing at a movie night is an outcome, not a perk. Strong families are the mission — everything else is the method.",
  },
];

const SERVICE_AREAS = ["South LA", "Compton", "Inglewood", "Carson", "Long Beach"];

function ValuesSection() {
  return (
    <section className="relative bg-[#141413] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-starfield opacity-60" aria-hidden />
      <div
        className="aurora-blob absolute -bottom-40 -left-32 w-[30rem] h-[30rem] rounded-full bg-[#5A7247]/15"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-end gap-5">
          <SectionNumber n="04" light />
          <div className="pb-1.5">
            <Eyebrow light>How We Work</Eyebrow>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="font-semibold text-white text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.12] tracking-tight">
              Rules we don&rsquo;t bend —{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
                because somebody&rsquo;s family is counting on them.
              </span>
            </h2>

            <div className="mt-12 grid sm:grid-cols-2 gap-5">
              {VALUES.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                  className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-6 hover:border-[#C9A84C]/40 transition-colors overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <value.icon className="h-6 w-6 text-[#C9A84C]" />
                  <h3 className="mt-4 text-white font-semibold">{value.title}</h3>
                  <p className="mt-2 text-white/55 text-sm leading-relaxed">{value.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Where we show up */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="lg:col-span-5"
          >
            <div className="grain-overlay relative rounded-3xl overflow-hidden border border-white/10 h-full min-h-[24rem]">
              <Image
                src="/images/future/impact-hands.jpg"
                alt="A father's hands receiving a certification folder"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-[#141413]/55 to-[#141413]/10" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-[#E8D48B] text-[11px] font-semibold tracking-[0.25em] uppercase">
                  Where we show up
                </p>
                <p className="mt-3 text-white text-lg font-semibold leading-snug">
                  In person across Greater Los Angeles.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SERVICE_AREAS.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white/85 text-xs font-medium"
                    >
                      <MapPin className="h-3 w-3 text-[#C9A84C]" />
                      {area}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-white/60 text-sm leading-relaxed">
                  Virtual programs available nationwide — the future doesn&rsquo;t check zip
                  codes, and neither do we.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 7. Timeline + goals
 * ------------------------------------------------------------------------- */

const TIMELINE = [
  {
    year: "2023",
    title: "Forever Forward is founded",
    text: "TJ Wilform launches a 501(c)(3) in Los Angeles with a simple bet: start with what you know, build forward from there.",
  },
  {
    year: "2023",
    title: "The first fathers walk through the door",
    text: "The inaugural Father Forward cohort begins — career training, leadership coaching, and a community that shows up.",
  },
  {
    year: "2024",
    title: "Making Moments takes off",
    text: "Movies on the Menu dinner-and-a-movie nights bring fathers and kids together — joy, officially on the program.",
  },
  {
    year: "2024",
    title: "Travis joins the team",
    text: "Our AI mentor goes live, giving every participant 24/7 support, study help, and a straight line to real resources.",
  },
  {
    year: "2025",
    title: "Future Builders expands",
    text: "Robotics, 3D printing, AI, and satellite tracking land in young hands across Greater LA — and virtually, nationwide.",
  },
] as const;

function TimelineAndGoals() {
  return (
    <section className="relative bg-[#F5F3EF] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-blueprint opacity-40" aria-hidden />
      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-end gap-5">
          <SectionNumber n="05" />
          <div className="pb-1.5">
            <Eyebrow>The Road So Far — and Ahead</Eyebrow>
          </div>
        </div>
        <h2 className="mt-8 font-semibold text-[#1A1A1A] text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.12] tracking-tight max-w-2xl">
          Young organization.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
            Old-school follow-through.
          </span>
        </h2>

        {/* Timeline */}
        <div className="mt-14 relative">
          <div
            className="absolute left-[7px] sm:left-[88px] top-2 bottom-2 w-px bg-gradient-to-b from-[#C9A84C] via-[#5A7247] to-[#C9A84C]/20"
            aria-hidden
          />
          <div className="space-y-10">
            {TIMELINE.map((event, i) => (
              <motion.div
                key={`${event.year}-${event.title}`}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
                className="relative grid sm:grid-cols-[72px_1fr] gap-x-8 pl-9 sm:pl-0"
              >
                <span
                  className="absolute left-0 sm:left-[81px] top-1.5 h-4 w-4 rounded-full bg-[#F5F3EF] border-2 border-[#C9A84C]"
                  aria-hidden
                />
                <span className="text-[#A68A2E] font-bold text-lg sm:text-right sm:pr-0">
                  {event.year}
                </span>
                <div className="sm:pl-9">
                  <h3 className="font-semibold text-[#1A1A1A] text-lg sm:text-xl">{event.title}</h3>
                  <p className="mt-1.5 text-[#555555] text-sm sm:text-base leading-relaxed max-w-xl">
                    {event.text}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* The goals — the next chapter, said out loud */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="relative grid sm:grid-cols-[72px_1fr] gap-x-8 pl-9 sm:pl-0"
            >
              <span
                className="absolute left-0 sm:left-[81px] top-1.5 h-4 w-4 rounded-full bg-[#C9A84C] border-2 border-[#C9A84C] animate-pulse"
                aria-hidden
              />
              <span className="text-[#A68A2E] font-bold text-lg sm:text-right">Next</span>
              <div className="sm:pl-9">
                <h3 className="font-semibold text-[#1A1A1A] text-lg sm:text-xl">
                  Goals we say out loud — so you can hold us to them.
                </h3>
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {IMPACT_GOALS.map((goal) => (
                    <div
                      key={goal.label}
                      className="rounded-2xl bg-white border border-[#DDDDDD] px-4 py-5 text-center"
                    >
                      <div className="font-bold text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-b from-[#C9A84C] to-[#A68A2E] tabular-nums">
                        {goal.value.toLocaleString()}
                        {goal.suffix}
                      </div>
                      <div className="mt-1.5 text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-[#888888] leading-snug">
                        {goal.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 8. Closing CTA — three ways in
 * ------------------------------------------------------------------------- */

const CTA_DOORS = [
  {
    href: "/get-involved/enroll",
    kicker: "For Fathers & Youth",
    title: "Enroll",
    text: "Free career training and future tech for your family. It costs nothing but the decision.",
    featured: true,
  },
  {
    href: "/get-involved/donate",
    kicker: "For Believers",
    title: "Donate",
    text: "Every dollar puts real technology in real hands — and every graduate lifts a whole family.",
    featured: false,
  },
  {
    href: "/get-involved/partner",
    kicker: "For Organizations",
    title: "Partner",
    text: "Join forces with us. We share tech, build apps together, and level up side by side.",
    featured: false,
  },
] as const;

function ClosingCTA() {
  return (
    <section className="relative bg-[#141413] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-starfield bg-starfield-twinkle" aria-hidden />
      <div
        className="aurora-blob absolute -top-32 right-1/4 w-[32rem] h-[32rem] rounded-full bg-[#C9A84C]/12"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Eyebrow light>Your Move</Eyebrow>
          <h2 className="mt-6 font-bold text-white text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.02]">
            The future is already overhead.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient">
              Come look up with us.
            </span>
          </h2>
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-5">
          {CTA_DOORS.map((door, i) => (
            <motion.div
              key={door.href}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            >
              <Link
                href={door.href}
                className={cn(
                  "group relative block h-full rounded-3xl p-7 sm:p-9 min-h-[15rem] overflow-hidden transition-all",
                  door.featured
                    ? "bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] border border-[#C9A84C]/40 hover:shadow-[0_0_70px_rgba(201,168,76,0.35)]"
                    : "glass-dark border border-white/10 hover:border-[#C9A84C]/50"
                )}
              >
                <div
                  className={cn(
                    "absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center transition-colors",
                    door.featured
                      ? "bg-[#1A1A1A]/15 text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-[#C9A84C]"
                      : "bg-white/10 text-white group-hover:bg-[#C9A84C] group-hover:text-[#1A1A1A]"
                  )}
                >
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <p
                  className={cn(
                    "text-[11px] font-semibold tracking-[0.3em] uppercase",
                    door.featured ? "text-[#1A1A1A]/70" : "text-[#C9A84C]"
                  )}
                >
                  {door.kicker}
                </p>
                <h3
                  className={cn(
                    "mt-4 font-bold text-3xl sm:text-4xl tracking-tight",
                    door.featured ? "text-[#1A1A1A]" : "text-white"
                  )}
                >
                  {door.title}
                </h3>
                <p
                  className={cn(
                    "mt-3 text-sm sm:text-base leading-relaxed max-w-xs",
                    door.featured ? "text-[#1A1A1A]/75" : "text-white/60"
                  )}
                >
                  {door.text}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export function AboutContentPremium() {
  return (
    <>
      <AboutHero />
      <FounderSection />
      <PillarsSection />
      <TechStrip />
      <StrongerTogether />
      <ValuesSection />
      <TimelineAndGoals />
      <ClosingCTA />
    </>
  );
}
