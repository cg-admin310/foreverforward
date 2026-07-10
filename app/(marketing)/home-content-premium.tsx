"use client";

/**
 * Forever Forward — Home
 * Design language: "Afro-futurist observatory" — deep-space blacks, gold
 * starlight, orbit motifs. The future, seen from our own block.
 */

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Cpu,
  Bot,
  Printer,
  Satellite,
  Heart,
  Popcorn,
  Rocket,
  Blocks,
  Zap,
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

/** Word-by-word rise-in for big statements. */
function RevealWords({
  text,
  className,
  once = true,
}: {
  text: string;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "-15% 0px" });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : { y: "110%" }}
            transition={{ duration: 0.7, delay: i * 0.035, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Animated counter that spins up when scrolled into view. */
function GoalCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 2200, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, motionVal, value]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return () => unsub();
  }, [spring]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-bold text-4xl sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-[#E8D48B] to-[#C9A84C] tabular-nums">
        {display.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-2 text-xs sm:text-sm tracking-[0.2em] uppercase text-white/50">{label}</div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * 1. Hero — the observatory
 * ------------------------------------------------------------------------- */

function HeroOrbit() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] bg-[#141413] overflow-hidden flex items-center"
    >
      {/* Sky */}
      <div className="absolute inset-0 bg-starfield bg-starfield-twinkle" aria-hidden />
      <div className="absolute inset-0 bg-blueprint opacity-40" aria-hidden />
      <div
        className="aurora-blob absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-[#C9A84C]/15"
        aria-hidden
      />
      <div
        className="aurora-blob absolute -bottom-56 -left-32 w-[32rem] h-[32rem] rounded-full bg-[#5A7247]/20"
        style={{ animationDelay: "-9s" }}
        aria-hidden
      />

      {/* Orbit rings, anchored to the image side */}
      <div
        className="absolute right-[-12%] top-1/2 -translate-y-1/2 w-[52rem] h-[52rem] hidden lg:block"
        aria-hidden
      >
        <div className="absolute inset-0 orbit-ring opacity-60" />
        <div className="absolute inset-16 orbit-ring opacity-40" />
        <div className="absolute inset-36 orbit-ring opacity-25" />
        <div className="absolute inset-0 orbit-carrier">
          <span className="orbit-satellite absolute -top-1 left-1/2 w-2.5 h-2.5" />
        </div>
        <div className="absolute inset-16 orbit-carrier-reverse">
          <span className="orbit-satellite absolute -bottom-1 left-1/3 w-2 h-2" />
        </div>
        <div className="absolute inset-36 orbit-carrier-slow">
          <span className="orbit-satellite absolute top-1/4 -right-1 w-1.5 h-1.5" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full pt-28 pb-16 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Copy */}
          <motion.div style={{ y: textY, opacity: fade }} className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            >
              <Eyebrow light>Los Angeles · 501(c)(3) · Est. 2023</Eyebrow>
            </motion.div>

            <h1 className="mt-5 font-bold leading-[0.95] tracking-tight">
              <span className="block overflow-hidden">
                <motion.span
                  className="block text-outline-gold text-[13.5vw] sm:text-7xl lg:text-[6.5rem]"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
                >
                  THE FUTURE
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block text-white text-[10vw] sm:text-6xl lg:text-[5rem]"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.38, ease: EASE }}
                >
                  BELONGS TO
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient text-[13.5vw] sm:text-7xl lg:text-[6.5rem]"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.51, ease: EASE }}
                >
                  OUR FAMILIES
                </motion.span>
              </span>
            </h1>

            <motion.p
              className="mt-6 max-w-xl text-base sm:text-lg text-white/70 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
            >
              {MISSION.statement}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            >
              <Link
                href="/get-involved/enroll"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A] font-semibold text-base shadow-[0_0_40px_rgba(201,168,76,0.25)] hover:shadow-[0_0_60px_rgba(201,168,76,0.45)] transition-shadow"
              >
                Start Your Path Forward
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/20 text-white font-semibold text-base hover:border-[#C9A84C]/60 hover:bg-white/5 transition-colors"
              >
                <Sparkles className="h-5 w-5 text-[#C9A84C]" />
                See the Mission
              </Link>
            </motion.div>

            <motion.p
              className="mt-6 text-white/40 text-sm tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
            >
              Progress over perfection. Every single week.
            </motion.p>
          </motion.div>

          {/* Image — a window to the future */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
              className="relative"
            >
              <motion.div
                style={{ y: imgY }}
                className="grain-overlay relative aspect-[4/5] rounded-t-[10rem] rounded-b-3xl overflow-hidden border border-[#C9A84C]/25"
              >
                <Image
                  src="/images/future/hero-father-future.jpg"
                  alt="A father and daughter looking up at a glowing hologram of Earth and its satellites"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/70 via-transparent to-transparent" />
                {/* Holo scan line */}
                <div className="absolute inset-x-0 top-0 h-1/3 pointer-events-none overflow-hidden opacity-40">
                  <div className="holo-sweep absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#E8D48B]/25 to-transparent" />
                </div>
              </motion.div>

              {/* Floating chip */}
              <motion.div
                className="absolute -left-4 sm:-left-8 bottom-8 glass-dark rounded-2xl px-4 py-3 border border-[#C9A84C]/30"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C9A84C]" />
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">
                      Next cohort enrolling now
                    </p>
                    <p className="text-white/50 text-xs">Father Forward · Greater LA</p>
                  </div>
                </div>
              </motion.div>
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
        transition={{ delay: 1.6, duration: 1 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Look Up</span>
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
 * 2. Ticker — the tech we bring home
 * ------------------------------------------------------------------------- */

const TICKER_ITEMS = [
  "AI & Machine Learning",
  "Robotics",
  "3D Printing",
  "Rockets & Low Earth Orbit",
  "Blockchain",
  "Renewable Energy",
  "EV Mechanics",
  "Cybersecurity",
  "Skilled Trades",
  "Virtual Production",
];

function TickerStrip() {
  const row = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative bg-[#C9A84C] py-3.5 overflow-hidden border-y border-[#A68A2E]">
      <div className="animate-marquee flex w-max items-center gap-8 pr-8">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 shrink-0">
            <span className="text-[#1A1A1A] font-semibold text-sm sm:text-base tracking-[0.18em] uppercase whitespace-nowrap">
              {item}
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" className="text-[#1A1A1A]/60" aria-hidden>
              <path d="M2 1l6 6-6 6M7 1l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * 3. Manifesto — why we exist
 * ------------------------------------------------------------------------- */

function Manifesto() {
  return (
    <section className="relative bg-[#FAFAF8] py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        <Eyebrow>Why We Exist</Eyebrow>
        <h2 className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-5xl lg:text-[3.4rem] leading-[1.12] tracking-tight">
          <RevealWords text="Talent is everywhere. Exposure isn't. We close that gap one father, one kid, one" />{" "}
          <RevealWords
            text="unforgettable moment at a time."
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]"
          />
        </h2>

        <div className="mt-14 grid lg:grid-cols-[auto_1fr] gap-8 items-start max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-[#C9A84C] ring-offset-4 ring-offset-[#FAFAF8]">
              <Image
                src="/images/brand/founderpic.jpg"
                alt="Thomas 'TJ' Wilform, Founder and CEO of Forever Forward"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>
          <motion.blockquote
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            <p className="text-lg sm:text-xl text-[#555555] leading-relaxed">
              &ldquo;{MISSION.founderNote}{" "}
              The more you get exposed to, the more you find out about
              yourself.&rdquo;
            </p>
            <footer className="mt-4 text-sm font-semibold text-[#1A1A1A]">
              Thomas &ldquo;TJ&rdquo; Wilform
              <span className="text-[#888888] font-normal">, Founder &amp; CEO</span>
            </footer>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 4. Pillars — the three doors
 * ------------------------------------------------------------------------- */

function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof PILLARS)[number];
  index: number;
}) {
  const flip = index % 2 === 1;
  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.9, ease: EASE }}
      className={cn(
        "group grid lg:grid-cols-2 gap-8 lg:gap-16 items-center",
        flip && "lg:[direction:rtl]"
      )}
    >
      {/* Image */}
      <Link
        href={pillar.href}
        className="relative block [direction:ltr]"
        aria-label={`${pillar.name}: learn more`}
      >
        <div className="grain-overlay image-zoom relative aspect-[4/3] rounded-3xl overflow-hidden">
          <Image
            src={pillar.image}
            alt={pillar.headline}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 flex items-center gap-2 text-white">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase bg-[#1A1A1A]/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/15">
              {pillar.kicker}
            </span>
          </div>
          <div className="absolute top-5 right-5 w-11 h-11 rounded-full bg-[#C9A84C] text-[#1A1A1A] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
      </Link>

      {/* Copy */}
      <div className="[direction:ltr]">
        <div className="flex items-baseline gap-4">
          <span className="text-outline-gold font-bold text-5xl sm:text-6xl leading-none select-none">
            0{index + 1}
          </span>
          <h3 className="font-semibold text-[#C9A84C] text-sm tracking-[0.3em] uppercase">
            {pillar.name}
          </h3>
        </div>
        <h4 className="mt-5 font-semibold text-white text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
          {pillar.headline}
        </h4>
        <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed max-w-xl">
          {pillar.description}
        </p>
        <Link
          href={pillar.href}
          className="mt-7 inline-flex items-center gap-2 text-[#E8D48B] font-semibold group/link"
        >
          Step through this door
          <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1.5 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
}

function PillarsSection() {
  return (
    <section className="relative bg-[#141413] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-starfield opacity-70" aria-hidden />
      <div
        className="aurora-blob absolute top-1/3 -left-40 w-[30rem] h-[30rem] rounded-full bg-[#5A7247]/15"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Eyebrow light>What We Do</Eyebrow>
          <h2 className="mt-6 font-semibold text-white text-3xl sm:text-5xl leading-[1.1] tracking-tight">
            Three doors.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
              One direction: forward.
            </span>
          </h2>
        </div>
        <div className="mt-16 sm:mt-24 space-y-20 sm:space-y-28">
          {PILLARS.map((pillar, i) => (
            <PillarCard key={pillar.id} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 5. Future tech — what we put in their hands
 * ------------------------------------------------------------------------- */

const TECH_ICONS = {
  ai: Cpu,
  robotics: Bot,
  printing: Printer,
  orbit: Satellite,
  blockchain: Blocks,
  energy: Zap,
} as const;

function FutureTechSection() {
  const [active, setActive] = useState<string>("orbit");
  const activeTech = FUTURE_TECH.find((t) => t.id === active) ?? FUTURE_TECH[3];

  return (
    <section className="relative bg-[#FAFAF8] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-blueprint opacity-60" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <Eyebrow>The Tools of Tomorrow</Eyebrow>
            <h2 className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-5xl leading-[1.1] tracking-tight">
              We don&rsquo;t wait for the future to visit our neighborhoods.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
                We bring it home.
              </span>
            </h2>
            <p className="mt-5 text-[#555555] text-base sm:text-lg leading-relaxed max-w-xl">
              Every program puts real, working future-tech in real hands, until
              &ldquo;someday&rdquo; becomes &ldquo;why not me?&rdquo;
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {FUTURE_TECH.map((tech) => {
                const Icon = TECH_ICONS[tech.id as keyof typeof TECH_ICONS] ?? Cpu;
                const isActive = tech.id === active;
                return (
                  <button
                    key={tech.id}
                    onMouseEnter={() => setActive(tech.id)}
                    onFocus={() => setActive(tech.id)}
                    onClick={() => setActive(tech.id)}
                    className={cn(
                      "text-left rounded-2xl border p-4 sm:p-5 transition-all duration-300",
                      isActive
                        ? "border-[#C9A84C] bg-[#FBF6E9] shadow-[0_8px_30px_rgba(201,168,76,0.18)]"
                        : "border-[#DDDDDD] bg-white/70 hover:border-[#C9A84C]/50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6 mb-3 transition-colors",
                        isActive ? "text-[#A68A2E]" : "text-[#888888]"
                      )}
                    />
                    <div className="font-semibold text-[#1A1A1A] text-sm sm:text-base leading-snug">
                      {tech.name}
                    </div>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="text-[#555555] text-xs sm:text-sm mt-1.5 overflow-hidden"
                        >
                          {tech.line}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image side */}
          <div className="relative">
            <div className="grain-overlay relative aspect-[3/2] lg:aspect-[4/3.4] rounded-3xl overflow-hidden border border-[#DDDDDD]">
              <Image
                src="/images/future/program-satellite-kids.jpg"
                alt="A father and son on a rooftop at twilight tracking satellites with a tablet"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/70 via-transparent to-transparent" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTech.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="absolute bottom-5 left-5 right-5"
                >
                  <p className="text-[#E8D48B] text-xs font-semibold tracking-[0.25em] uppercase">
                    {activeTech.name}
                  </p>
                  <p className="text-white text-lg sm:text-xl font-semibold mt-1">
                    {activeTech.line}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Orbiting accent */}
            <div className="absolute -top-8 -right-8 w-28 h-28 hidden sm:block" aria-hidden>
              <div className="absolute inset-0 orbit-ring" />
              <div className="absolute inset-0 orbit-carrier">
                <span className="orbit-satellite absolute -top-1 left-1/2 w-2 h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 6. Making Moments — joy is a strategy
 * ------------------------------------------------------------------------- */

function MakingMomentsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={sectionRef} className="relative bg-[#141413] overflow-hidden">
      {/* Full-bleed image with parallax */}
      <div className="relative h-[70svh] sm:h-[80svh] overflow-hidden">
        <motion.div style={{ y: imgY }} className="absolute -inset-y-[10%] inset-x-0">
          <Image
            src="/images/future/events-scene.jpg"
            alt="Families at a community STEM festival at golden hour, kids racing robots while fathers cheer"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-[#141413]/30 to-[#141413]/40" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full pb-14 sm:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <Eyebrow light>Making Moments</Eyebrow>
              <h2 className="mt-4 font-bold text-white text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.98] max-w-3xl">
                Joy is a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
                  strategy.
                </span>
              </h2>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Below-image content */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-24 sm:pb-32 pt-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            {
              icon: Popcorn,
              title: "Movies on the Menu",
              text: "Dinner and a movie under the stars, on us, so a father can just be present.",
            },
            {
              icon: Bot,
              title: "Robot Races & Pop-Ups",
              text: "Build stations, 3D-printing corners, and robot races that turn a park into a playground of the future.",
            },
            {
              icon: Rocket,
              title: "Night Sky Nights",
              text: "Telescopes out, satellites tracked, the ISS passing over your own block, with your kids beside you.",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-6 sm:p-7 hover:border-[#C9A84C]/40 transition-colors overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <card.icon className="h-7 w-7 text-[#C9A84C]" />
              <h3 className="mt-4 text-white font-semibold text-lg">{card.title}</h3>
              <p className="mt-2 text-white/55 text-sm leading-relaxed">{card.text}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C9A84C] text-[#1A1A1A] font-semibold hover:bg-[#E8D48B] transition-colors"
          >
            Find your next moment
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-white/40 text-sm">
            Free for families · Across Greater Los Angeles
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 7. Community tech — stronger together
 * ------------------------------------------------------------------------- */

function CommunityTechSection() {
  return (
    <section className="relative bg-[#F5F3EF] py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-24 bg-chevron-band opacity-60" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="order-2 lg:order-1"
          >
            <div className="grain-overlay image-zoom relative aspect-[16/11] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/future/community-builders.jpg"
                alt="Nonprofit leaders collaborating around a touchscreen reviewing a community app"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="order-1 lg:order-2"
          >
            <Eyebrow>{COMMUNITY_TECH.kicker}</Eyebrow>
            <h2 className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.12] tracking-tight">
              {COMMUNITY_TECH.headline}
            </h2>
            <p className="mt-5 text-[#555555] text-base sm:text-lg leading-relaxed">
              {COMMUNITY_TECH.description}
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Modern platforms and nonprofit tech, set up right the first time",
                "Small custom tools and AI that stretch limited resources further",
                "One connected network of orgs serving the same neighborhoods",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-[#1A1A1A]">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#C9A84C] shrink-0" />
                  <span className="text-sm sm:text-base">{line}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/get-involved/partner"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-[#5A7247] hover:text-[#3D5030] transition-colors group"
            >
              Join forces with us
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 8. Impact goals + closing CTA
 * ------------------------------------------------------------------------- */

function ImpactAndCTA() {
  return (
    <section className="relative bg-[#141413] pt-24 sm:pt-32 pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-starfield" aria-hidden />
      <div
        className="aurora-blob absolute -top-32 left-1/3 w-[34rem] h-[34rem] rounded-full bg-[#C9A84C]/12"
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Goals */}
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow light>Where We&rsquo;re Headed</Eyebrow>
          <h2 className="mt-5 font-semibold text-white text-3xl sm:text-4xl tracking-tight">
            Goals we say out loud, so you can hold us to them.
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
          {IMPACT_GOALS.map((goal) => (
            <GoalCounter
              key={goal.label}
              value={goal.value}
              suffix={goal.suffix}
              label={goal.label}
            />
          ))}
        </div>

        {/* Dual-door CTA */}
        <div className="mt-24 sm:mt-32 grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Link
              href="/get-involved/enroll"
              className="group relative block rounded-3xl overflow-hidden border border-[#C9A84C]/30 bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] p-8 sm:p-12 min-h-[18rem] hover:shadow-[0_0_80px_rgba(201,168,76,0.35)] transition-shadow"
            >
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#1A1A1A]/15 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-[#C9A84C] text-[#1A1A1A] transition-colors">
                <ArrowUpRight className="h-6 w-6" />
              </div>
              <p className="text-[#1A1A1A]/70 text-xs font-semibold tracking-[0.3em] uppercase">
                For Fathers &amp; Families
              </p>
              <h3 className="mt-4 font-bold text-[#1A1A1A] text-3xl sm:text-4xl leading-tight max-w-md">
                Your path forward starts with one step.
              </h3>
              <p className="mt-3 text-[#1A1A1A]/75 max-w-md">
                Free career training, future tech for your kids, and a community
                that shows up.
              </p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
          >
            <Link
              href="/get-involved/donate"
              className="group relative block rounded-3xl overflow-hidden border border-white/15 bg-white/[0.04] backdrop-blur p-8 sm:p-12 min-h-[18rem] hover:border-[#C9A84C]/50 transition-colors"
            >
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-[#C9A84C] group-hover:text-[#1A1A1A] transition-colors">
                <Heart className="h-5 w-5" />
              </div>
              <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase">
                For Believers &amp; Builders
              </p>
              <h3 className="mt-4 font-bold text-white text-3xl sm:text-4xl leading-tight max-w-md">
                Fund the future you want to see.
              </h3>
              <p className="mt-3 text-white/60 max-w-md">
                Every tax-deductible dollar puts real technology in real hands.
              </p>
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

export function HomeContentPremium() {
  return (
    <>
      <HeroOrbit />
      <TickerStrip />
      <Manifesto />
      <PillarsSection />
      <FutureTechSection />
      <MakingMomentsSection />
      <CommunityTechSection />
      <ImpactAndCTA />
    </>
  );
}
