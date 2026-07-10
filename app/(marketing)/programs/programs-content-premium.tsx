"use client";

/**
 * Forever Forward — Programs Hub
 * Design language: "Afro-futurist observatory" — six programs organized as
 * three doors (pillars): Career Forward, Future Builders, Making Moments.
 */

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Clock,
  MapPin,
  Sparkles,
  Compass,
  Users,
  Heart,
  Cpu,
} from "lucide-react";
import { PROGRAMS, CAREER_PATHWAYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type Program = (typeof PROGRAMS)[number];
type PathwayId = (typeof CAREER_PATHWAYS)[number]["id"];

const programsBySlug = new Map(PROGRAMS.map((p) => [p.slug, p]));

function getPrograms(slugs: string[]): Program[] {
  return slugs
    .map((slug) => programsBySlug.get(slug))
    .filter((p): p is Program => Boolean(p));
}

const FUTURE_BUILDER_SLUGS = [
  "tech-ready-youth",
  "stories-from-my-future",
  "from-script-to-screen",
  "lula",
];

const PROGRAM_IMAGES: Record<string, { src: string; alt: string }> = {
  "tech-ready-youth": {
    src: "/images/future/pillar-future-tech.jpg",
    alt: "Youth building and programming robots in a Forever Forward lab",
  },
  "stories-from-my-future": {
    src: "/images/future/program-3dprint-kids.jpg",
    alt: "A girl and her father watching her design come to life on a 3D printer",
  },
  "from-script-to-screen": {
    src: "/images/generated/program-script-to-screen.png",
    alt: "Students producing their own film with virtual production tools",
  },
  lula: {
    src: "/images/generated/program-lula-learning.png",
    alt: "A young learner leveling up through LULA's gamified STEM quests",
  },
};

const PATHWAY_IMAGES: Record<PathwayId, { src: string; alt: string }> = {
  it: {
    src: "/images/future/program-it-pathway.jpg",
    alt: "A father in IT training, hands-on with networks and hardware",
  },
  trades: {
    src: "/images/future/program-trades-pathway.jpg",
    alt: "A father learning EV and skilled-trade work in a modern shop",
  },
  auto: {
    src: "/images/future/pillar-careers.jpg",
    alt: "A father stepping into a hands-on career pathway",
  },
};

const AUDIENCE_LABELS: Record<Program["audience"], string> = {
  fathers: "For Fathers",
  youth: "For Youth",
  families: "For Families",
  kids: "For Kids",
  students: "For Students",
};

/* ----------------------------------------------------------------------------
 * Shared bits
 * ------------------------------------------------------------------------- */

function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
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

function MetaChip({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide",
        light
          ? "border border-white/15 bg-white/[0.05] text-white/70"
          : "border border-[#DDDDDD] bg-white/70 text-[#555555]"
      )}
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------------------
 * 1. Hero — three doors under one sky
 * ------------------------------------------------------------------------- */

const DOORS = [
  {
    number: "01",
    name: "Career Forward",
    kicker: "For Fathers",
    line: "Three career pathways. One flagship program.",
    href: "#career-forward",
    icon: Users,
  },
  {
    number: "02",
    name: "Future Builders",
    kicker: "For Kids & Youth",
    line: "Robotics, AI, film, and 3D-printed futures.",
    href: "#future-builders",
    icon: Cpu,
  },
  {
    number: "03",
    name: "Making Moments",
    kicker: "For Families",
    line: "Joy, on purpose. Events all year long.",
    href: "#making-moments",
    icon: Heart,
  },
] as const;

function ProgramsHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92svh] bg-[#141413] overflow-hidden flex items-center"
    >
      <div className="absolute inset-0 bg-starfield bg-starfield-twinkle" aria-hidden />
      <div className="absolute inset-0 bg-blueprint opacity-40" aria-hidden />
      <div
        className="aurora-blob absolute -top-48 right-[-10%] w-[38rem] h-[38rem] rounded-full bg-[#C9A84C]/15"
        aria-hidden
      />
      <div
        className="aurora-blob absolute -bottom-56 -left-40 w-[30rem] h-[30rem] rounded-full bg-[#5A7247]/20"
        style={{ animationDelay: "-8s" }}
        aria-hidden
      />

      {/* Orbit rings drifting behind the headline */}
      <div
        className="absolute -right-56 -top-56 w-[44rem] h-[44rem] hidden lg:block"
        aria-hidden
      >
        <div className="absolute inset-0 orbit-ring opacity-50" />
        <div className="absolute inset-20 orbit-ring opacity-30" />
        <div className="absolute inset-0 orbit-carrier">
          <span className="orbit-satellite absolute -bottom-1 left-1/2 w-2.5 h-2.5" />
        </div>
        <div className="absolute inset-20 orbit-carrier-reverse">
          <span className="orbit-satellite absolute top-1/3 -left-1 w-1.5 h-1.5" />
        </div>
      </div>

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full pt-28 pb-16 lg:py-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          <Eyebrow light>Programs · Free for Families · Greater LA + Virtual</Eyebrow>
        </motion.div>

        <h1 className="mt-6 font-bold leading-[0.95] tracking-tight">
          <span className="block overflow-hidden">
            <motion.span
              className="block text-outline-gold text-[12vw] sm:text-6xl lg:text-[5.6rem]"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            >
              SIX PROGRAMS.
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block text-white text-[12vw] sm:text-6xl lg:text-[5.6rem]"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.33, ease: EASE }}
            >
              THREE DOORS.
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-2">
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient text-[12vw] sm:text-6xl lg:text-[5.6rem]"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.46, ease: EASE }}
            >
              ONE DIRECTION: FORWARD.
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-6 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
        >
          Career pathways for fathers. Future tech in young hands. Family moments made
          on purpose. Every program is a different door into the same house. Pick
          yours and step through.
        </motion.p>

        {/* Door index */}
        <motion.div
          className="mt-10 grid sm:grid-cols-3 gap-3 max-w-4xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
        >
          {DOORS.map((door) => (
            <a
              key={door.number}
              href={door.href}
              className="group glass-dark rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-[#C9A84C]/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <span className="text-outline-gold font-bold text-3xl leading-none select-none">
                  {door.number}
                </span>
                <ArrowDown className="h-4 w-4 text-white/30 group-hover:text-[#C9A84C] group-hover:translate-y-0.5 transition-all" />
              </div>
              <p className="mt-3 text-[#E8D48B] text-[10px] font-semibold tracking-[0.25em] uppercase">
                {door.kicker}
              </p>
              <p className="mt-1 text-white font-semibold">{door.name}</p>
              <p className="mt-1 text-white/50 text-xs leading-relaxed">{door.line}</p>
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 2. Door 01 — Career Forward / Father Forward (flagship)
 * ------------------------------------------------------------------------- */

function CareerForwardSection() {
  const [activePathway, setActivePathway] = useState<PathwayId>("it");
  const fatherForward = programsBySlug.get("father-forward");
  const activeImage = PATHWAY_IMAGES[activePathway];
  const activeDetail =
    CAREER_PATHWAYS.find((p) => p.id === activePathway) ?? CAREER_PATHWAYS[0];

  if (!fatherForward) return null;

  return (
    <section
      id="career-forward"
      className="relative bg-[#FAFAF8] py-24 sm:py-32 overflow-hidden scroll-mt-20"
    >
      <div className="absolute inset-0 bg-blueprint opacity-60" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-baseline gap-5 flex-wrap">
          <span
            className="font-bold text-7xl sm:text-8xl leading-none select-none"
            style={{
              WebkitTextStroke: "1.5px rgba(166,138,46,0.5)",
              WebkitTextFillColor: "transparent",
            }}
            aria-hidden
          >
            01
          </span>
          <div>
            <Eyebrow>Door One · For Fathers</Eyebrow>
            <h2 className="mt-2 font-semibold text-[#1A1A1A] text-3xl sm:text-5xl tracking-tight">
              Career Forward
            </h2>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Copy + pathway selector */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="lg:col-span-5"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1A1A] text-[#E8D48B] text-[11px] font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Flagship Program
            </span>
            <h3 className="mt-5 font-semibold text-[#1A1A1A] text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
              Father Forward:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
                pick a path, build a legacy.
              </span>
            </h3>
            <p className="mt-5 text-[#555555] text-base sm:text-lg leading-relaxed">
              {fatherForward.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <MetaChip>
                <Clock className="h-3.5 w-3.5 text-[#A68A2E]" />
                {fatherForward.duration}
              </MetaChip>
              <MetaChip>
                <MapPin className="h-3.5 w-3.5 text-[#A68A2E]" />
                {fatherForward.format} · evenings &amp; Saturdays
              </MetaChip>
              <MetaChip>
                <Heart className="h-3.5 w-3.5 text-[#A68A2E]" />
                Free for qualifying fathers
              </MetaChip>
            </div>

            {/* Pathway selector */}
            <p className="mt-8 text-xs font-semibold tracking-[0.25em] uppercase text-[#888888]">
              Choose your pathway
            </p>
            <div className="mt-3 space-y-2.5">
              {CAREER_PATHWAYS.map((pathway, i) => {
                const isActive = pathway.id === activePathway;
                return (
                  <button
                    key={pathway.id}
                    type="button"
                    onClick={() => setActivePathway(pathway.id)}
                    onMouseEnter={() => setActivePathway(pathway.id)}
                    onFocus={() => setActivePathway(pathway.id)}
                    className={cn(
                      "w-full text-left rounded-2xl border p-4 sm:p-5 transition-all duration-300",
                      isActive
                        ? "border-[#C9A84C] bg-[#FBF6E9] shadow-[0_8px_30px_rgba(201,168,76,0.18)]"
                        : "border-[#DDDDDD] bg-white/70 hover:border-[#C9A84C]/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "font-bold text-lg tabular-nums transition-colors",
                          isActive ? "text-[#A68A2E]" : "text-[#DDDDDD]"
                        )}
                      >
                        0{i + 1}
                      </span>
                      <span className="font-semibold text-[#1A1A1A] text-sm sm:text-base">
                        {pathway.name}
                      </span>
                    </div>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="text-[#555555] text-xs sm:text-sm mt-2 pl-8 overflow-hidden"
                        >
                          {pathway.detail}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>

            <Link
              href="/programs/father-forward"
              className="mt-8 group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A] font-semibold shadow-[0_0_30px_rgba(201,168,76,0.2)] hover:shadow-[0_0_50px_rgba(201,168,76,0.4)] transition-shadow"
            >
              Explore Father Forward
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Image — swaps with pathway */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="lg:col-span-7 lg:sticky lg:top-28"
          >
            <div className="grain-overlay relative aspect-[3/2] rounded-3xl overflow-hidden border border-[#DDDDDD] shadow-xl">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activePathway}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeImage.src}
                    alt={activeImage.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/75 via-transparent to-transparent" />
              <div className="absolute inset-x-0 top-0 h-1/3 pointer-events-none overflow-hidden opacity-30">
                <div className="holo-sweep absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-[#E8D48B]/25 to-transparent" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePathway}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7"
                >
                  <p className="text-[#E8D48B] text-xs font-semibold tracking-[0.25em] uppercase">
                    {activeDetail.name}
                  </p>
                  <p className="text-white text-lg sm:text-2xl font-semibold mt-1 max-w-lg">
                    {activeDetail.detail}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="mt-4 text-[#888888] text-sm flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#A68A2E] shrink-0" />
              Whichever path you pick, the leadership thread of goals, family, and
              finances travels with you. So does Travis, your 24/7 AI mentor.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 3. Door 02 — Future Builders (youth & kids programs)
 * ------------------------------------------------------------------------- */

function FutureBuilderCard({ program, index }: { program: Program; index: number }) {
  const image = PROGRAM_IMAGES[program.slug] ?? PROGRAM_IMAGES["tech-ready-youth"];
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: (index % 2) * 0.12, ease: EASE }}
      className={cn("group", index % 2 === 1 && "lg:translate-y-14")}
    >
      <Link href={`/programs/${program.slug}`} className="block">
        <div className="grain-overlay image-zoom relative aspect-[3/2] rounded-3xl overflow-hidden border border-white/10">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/70 via-transparent to-transparent" />
          <span className="absolute top-5 left-5 text-[10px] font-semibold tracking-[0.25em] uppercase text-white bg-[#1A1A1A]/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/15">
            {AUDIENCE_LABELS[program.audience]} · {program.duration}
          </span>
          <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#C9A84C] text-[#1A1A1A] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-5 flex items-start gap-4">
          <span className="text-outline-gold font-bold text-3xl sm:text-4xl leading-none select-none pt-0.5">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-white font-semibold text-xl sm:text-2xl tracking-tight group-hover:text-[#E8D48B] transition-colors">
              {program.name}
            </h3>
            <p className="text-[#C9A84C] text-sm font-semibold mt-0.5">
              {program.tagline}
            </p>
            <p className="mt-2 text-white/55 text-sm sm:text-base leading-relaxed max-w-md">
              {program.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function FutureBuildersSection() {
  const futureBuilders = getPrograms(FUTURE_BUILDER_SLUGS);
  return (
    <section
      id="future-builders"
      className="relative bg-[#141413] py-24 sm:py-32 overflow-hidden scroll-mt-20"
    >
      <div className="absolute inset-0 bg-starfield opacity-70" aria-hidden />
      <div
        className="aurora-blob absolute top-1/4 -right-40 w-[32rem] h-[32rem] rounded-full bg-[#C9A84C]/12"
        aria-hidden
      />
      <div
        className="aurora-blob absolute -bottom-40 -left-32 w-[26rem] h-[26rem] rounded-full bg-[#5A7247]/15"
        style={{ animationDelay: "-11s" }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-baseline gap-5 flex-wrap">
          <span className="text-outline-gold font-bold text-7xl sm:text-8xl leading-none select-none" aria-hidden>
            02
          </span>
          <div>
            <Eyebrow light>Door Two · For Kids &amp; Youth</Eyebrow>
            <h2 className="mt-2 font-semibold text-white text-3xl sm:text-5xl tracking-tight">
              Future Builders
            </h2>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-white/60 text-base sm:text-lg leading-relaxed">
          A robot answering their code. A story printed into something they can hold.
          Their film on a real screen. The first time a kid sees the future,
          everything changes. Four programs, four ways in.
        </p>

        <div className="mt-14 sm:mt-16 grid lg:grid-cols-2 gap-x-10 gap-y-14 lg:gap-y-10 lg:pb-14">
          {futureBuilders.map((program, i) => (
            <FutureBuilderCard key={program.slug} program={program} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 4. Door 03 — Making Moments (families)
 * ------------------------------------------------------------------------- */

function MakingMomentsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const makingMoments = programsBySlug.get("making-moments");

  return (
    <section
      id="making-moments"
      ref={sectionRef}
      className="relative bg-[#141413] overflow-hidden scroll-mt-20"
    >
      <div className="relative h-[68svh] sm:h-[76svh] overflow-hidden">
        <motion.div style={{ y: imgY }} className="absolute -inset-y-[10%] inset-x-0">
          <Image
            src="/images/future/events-scene.jpg"
            alt="Families at a Forever Forward festival at golden hour, kids racing robots while fathers cheer"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-[#141413]/25 to-[#141413]/45" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full pb-12 sm:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <div className="flex items-baseline gap-5 flex-wrap">
                <span className="text-outline-white font-bold text-6xl sm:text-8xl leading-none select-none" aria-hidden>
                  03
                </span>
                <div>
                  <Eyebrow light>Door Three · For Families</Eyebrow>
                  <h2 className="mt-2 font-bold text-white text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.98]">
                    Making{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
                      Moments
                    </span>
                  </h2>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-24 sm:pb-28 pt-8">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="lg:col-span-7"
          >
            <p className="text-white/70 text-lg sm:text-xl leading-relaxed max-w-2xl">
              {makingMoments?.description ??
                "Community events that strengthen father-child bonds: dinner-and-a-movie nights, robot races, and festivals the whole family looks forward to."}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <MetaChip light>Movies on the Menu, dinner included</MetaChip>
              <MetaChip light>Robot races &amp; 3D-printing pop-ups</MetaChip>
              <MetaChip light>Night-sky &amp; satellite nights</MetaChip>
              <MetaChip light>Annual Forever Forward Festival</MetaChip>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
            className="lg:col-span-5 flex flex-col gap-3"
          >
            <Link
              href="/programs/making-moments"
              className="group flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] px-6 py-5 text-[#1A1A1A]"
            >
              <span className="font-semibold">Explore Making Moments</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/events"
              className="group flex items-center justify-between rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-5 text-white hover:border-[#C9A84C]/50 transition-colors"
            >
              <span className="font-semibold">See upcoming events</span>
              <ArrowUpRight className="h-5 w-5 text-[#C9A84C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <p className="text-white/40 text-sm px-1">
              Free for families · Across Greater Los Angeles
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 5. The leadership thread — one DNA across all six
 * ------------------------------------------------------------------------- */

const DNA_STRANDS = [
  {
    title: "Leadership, woven in",
    text: "Goal setting, accountability, and showing up: every curriculum carries the same leadership thread, whether you're 6 or 46.",
  },
  {
    title: "Family at the center",
    text: "Fathers and kids grow side by side. Graduations happen in public, out loud, with the whole family in the room.",
  },
  {
    title: "Future tech in hand",
    text: "AI, robotics, 3D printing, satellites overhead. Real tools in real hands, because exposure is where every career begins.",
  },
] as const;

function LeadershipThreadSection() {
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
                src="/images/future/impact-hands.jpg"
                alt="Hands holding a hard-earned certification, proof of a path forward"
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
            <Eyebrow>The Leadership Thread</Eyebrow>
            <h2 className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.12] tracking-tight">
              Six different programs.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
                One shared DNA.
              </span>
            </h2>

            <div className="mt-8 relative space-y-7 pl-8">
              <span
                className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-[#C9A84C] via-[#C9A84C]/50 to-transparent"
                aria-hidden
              />
              {DNA_STRANDS.map((strand, i) => (
                <motion.div
                  key={strand.title}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: EASE }}
                  className="relative"
                >
                  <span
                    className="absolute -left-8 top-1.5 h-3 w-3 rounded-full bg-[#C9A84C] shadow-[0_0_12px_2px_rgba(201,168,76,0.5)]"
                    aria-hidden
                  />
                  <h3 className="font-semibold text-[#1A1A1A] text-lg sm:text-xl">
                    {strand.title}
                  </h3>
                  <p className="mt-1.5 text-[#555555] text-sm sm:text-base leading-relaxed">
                    {strand.text}
                  </p>
                </motion.div>
              ))}
            </div>

            <p className="mt-8 text-sm text-[#888888] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#A68A2E] shrink-0" />
              And in every cohort, Travis, our AI mentor, rides along, 24/7.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 6. CTA — which door is yours?
 * ------------------------------------------------------------------------- */

function ProgramsCTA() {
  return (
    <section className="relative bg-[#141413] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-starfield" aria-hidden />
      <div
        className="aurora-blob absolute -top-32 left-1/4 w-[34rem] h-[34rem] rounded-full bg-[#C9A84C]/12"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow light>Your Move</Eyebrow>
          <h2 className="mt-5 font-semibold text-white text-3xl sm:text-5xl tracking-tight leading-[1.08]">
            Not sure which door is yours?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
              Knock on both.
            </span>
          </h2>
        </div>

        <div className="mt-14 grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Link
              href="/get-involved/enroll"
              className="group relative block h-full rounded-3xl overflow-hidden border border-[#C9A84C]/30 bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] p-8 sm:p-10 min-h-[15rem] hover:shadow-[0_0_80px_rgba(201,168,76,0.35)] transition-shadow"
            >
              <div className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#1A1A1A]/15 flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-[#C9A84C] transition-colors">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <p className="text-[#1A1A1A]/70 text-xs font-semibold tracking-[0.3em] uppercase">
                Ready Now
              </p>
              <h3 className="mt-4 font-bold text-[#1A1A1A] text-2xl sm:text-3xl leading-tight max-w-sm">
                Enroll. It costs nothing but the decision.
              </h3>
              <p className="mt-3 text-[#1A1A1A]/75 max-w-sm text-sm sm:text-base">
                Every program is free for qualifying participants. Tell us who you
                are and we&rsquo;ll take it from there.
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
              href="/get-involved/assess"
              className="group relative block h-full rounded-3xl overflow-hidden border border-white/15 bg-white/[0.04] backdrop-blur p-8 sm:p-10 min-h-[15rem] hover:border-[#C9A84C]/50 transition-colors"
            >
              <div className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-[#C9A84C] group-hover:text-[#1A1A1A] transition-colors">
                <Compass className="h-5 w-5" />
              </div>
              <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase">
                Still Deciding
              </p>
              <h3 className="mt-4 font-bold text-white text-2xl sm:text-3xl leading-tight max-w-sm">
                Take the two-minute program-fit quiz.
              </h3>
              <p className="mt-3 text-white/60 max-w-sm text-sm sm:text-base">
                A few quick questions, and we&rsquo;ll point you at the door that fits
                your family best. No wrong answers, just forward.
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

export function ProgramsContentPremium() {
  return (
    <>
      <ProgramsHero />
      <CareerForwardSection />
      <FutureBuildersSection />
      <MakingMomentsSection />
      <LeadershipThreadSection />
      <ProgramsCTA />
    </>
  );
}
