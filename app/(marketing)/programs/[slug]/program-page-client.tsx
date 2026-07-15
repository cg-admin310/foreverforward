"use client";

/**
 * Forever Forward — Program Detail
 * Design language: "Afro-futurist observatory" — dark hero, gold starlight,
 * animated curriculum timeline, and a pull-quote testimonial.
 */

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  MapPin,
  CalendarDays,
  Users,
  BadgeCheck,
  Gift,
  Compass,
  Sparkles,
} from "lucide-react";
import { CAREER_PATHWAYS } from "@/lib/constants";
import { FFIcon, isFFIconName } from "@/components/shared/ff-icons";
import type { ProgramDetail, ProgramAudience } from "@/lib/data/programs";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const AUDIENCE_LABELS: Record<ProgramAudience, string> = {
  fathers: "For Fathers",
  youth: "For Youth",
  families: "For Families",
  kids: "For Kids",
  students: "For Students",
};

const PILLAR_LABELS: Record<ProgramAudience, string> = {
  fathers: "Career Forward",
  youth: "Future Builders",
  kids: "Future Builders",
  students: "Future Builders",
  families: "Making Moments",
};

interface ProgramPageClientProps {
  program: ProgramDetail;
}

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

/* ----------------------------------------------------------------------------
 * 1. Hero — the program, seen from orbit
 * ------------------------------------------------------------------------- */

function ProgramHero({ program }: { program: ProgramDetail }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[88svh] bg-[#141413] overflow-hidden flex items-end"
    >
      {/* Hero image, full-bleed with cinematic scrims */}
      <motion.div style={{ y: imgY }} className="absolute -inset-y-[8%] inset-x-0">
        <Image
          src={program.heroImage}
          alt={program.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#141413] via-[#141413]/70 to-[#141413]/25"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#141413] via-transparent to-[#141413]/50"
        aria-hidden
      />
      <div className="grain-overlay absolute inset-0" aria-hidden />
      <div className="absolute inset-0 bg-starfield bg-starfield-twinkle opacity-60" aria-hidden />

      {/* Orbit accent */}
      <div className="absolute top-24 right-8 w-40 h-40 hidden lg:block" aria-hidden>
        <div className="absolute inset-0 orbit-ring opacity-60" />
        <div className="absolute inset-0 orbit-carrier-slow">
          <span className="orbit-satellite absolute -top-1 left-1/2 w-2 h-2" />
        </div>
      </div>

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full pt-36 pb-16 sm:pb-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          <Eyebrow light>
            {PILLAR_LABELS[program.audience]} · {AUDIENCE_LABELS[program.audience]} ·{" "}
            {program.duration}
          </Eyebrow>
        </motion.div>

        <h1 className="mt-5 font-bold leading-[0.95] tracking-tight max-w-4xl">
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block text-white text-[13vw] sm:text-7xl lg:text-[5.8rem]"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            >
              {program.name}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-2">
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient text-[6.5vw] sm:text-3xl lg:text-[2.6rem] font-semibold"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
            >
              {program.tagline}
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-5 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
        >
          {program.heroDescription}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
        >
          <Link
            href="/get-involved/enroll"
            className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A] font-semibold shadow-[0_0_40px_rgba(201,168,76,0.25)] hover:shadow-[0_0_60px_rgba(201,168,76,0.45)] transition-shadow"
          >
            Apply Now
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/20 text-white font-semibold hover:border-[#C9A84C]/60 hover:bg-white/5 transition-colors"
          >
            Ask a Question
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 2. At a glance — mission telemetry
 * ------------------------------------------------------------------------- */

function AtAGlance({ program }: { program: ProgramDetail }) {
  const items: { icon: typeof Clock; label: string; value: string }[] = [
    { icon: Clock, label: "Duration", value: program.atAGlance.duration },
    { icon: MapPin, label: "Format", value: program.atAGlance.format },
    { icon: CalendarDays, label: "Schedule", value: program.atAGlance.schedule },
  ];
  if (program.atAGlance.ageRange) {
    items.push({ icon: Users, label: "Ages", value: program.atAGlance.ageRange });
  }
  if (program.atAGlance.certification) {
    items.push({
      icon: BadgeCheck,
      label: "Credential",
      value: program.atAGlance.certification,
    });
  }
  items.push({ icon: Gift, label: "Cost", value: program.atAGlance.cost });

  return (
    <section className="relative bg-[#FBF6E9] border-y border-[#C9A84C]/25 overflow-hidden">
      <div className="absolute inset-0 bg-blueprint opacity-70" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            >
              <item.icon className="h-5 w-5 text-[#A68A2E]" aria-hidden />
              <p className="mt-2.5 text-[10px] font-semibold tracking-[0.25em] uppercase text-[#888888]">
                {item.label}
              </p>
              <p className="mt-1 font-semibold text-[#1A1A1A] text-sm leading-snug">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 3. Overview — the story
 * ------------------------------------------------------------------------- */

function Overview({ program }: { program: ProgramDetail }) {
  const [lead, ...rest] = program.overview;
  return (
    <section className="relative bg-[#FAFAF8] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
        <Eyebrow>The Story</Eyebrow>
        {lead && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-6 text-[#1A1A1A] font-medium text-xl sm:text-2xl lg:text-[1.7rem] leading-[1.45] tracking-tight"
          >
            {lead}
          </motion.p>
        )}
        <div className="mt-8 space-y-6 border-l-2 border-[#C9A84C]/40 pl-6 sm:pl-8">
          {rest.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
              className="text-[#555555] leading-relaxed text-base sm:text-lg"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 4. The track — Father Forward only (IT now, trades next)
 * ------------------------------------------------------------------------- */

function CareerPathways() {
  const openTrack = CAREER_PATHWAYS.find((p) => p.status === "open");
  const comingTracks = CAREER_PATHWAYS.filter((p) => p.status === "coming");

  return (
    <section className="relative bg-[#F5F3EF] py-20 sm:py-28 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-20 bg-chevron-band opacity-60" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <Eyebrow>The Track</Eyebrow>
        <h2 className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.12] tracking-tight max-w-2xl">
          Right now, this one&rsquo;s about{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
            IT.
          </span>{" "}
          The trades are next.
        </h2>

        <div className="mt-12 grid lg:grid-cols-2 gap-6 items-start">
          {/* Live IT track */}
          {openTrack && (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="relative rounded-3xl bg-[#141413] border border-[#C9A84C]/40 p-7 sm:p-9 overflow-hidden"
            >
              <div className="absolute inset-0 bg-starfield opacity-40" aria-hidden />
              <div className="relative">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9A84C] text-[#1A1A1A] text-[11px] font-bold tracking-[0.18em] uppercase">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Enrolling Now
                </span>
                <h3 className="mt-5 font-semibold text-white text-2xl sm:text-3xl">
                  {openTrack.name}
                </h3>
                <p className="mt-3 text-white/65 text-base leading-relaxed max-w-md">
                  {openTrack.detail}
                </p>
                <p className="mt-5 inline-flex items-center gap-2 text-[#E8D48B] text-sm font-semibold">
                  <BadgeCheck className="h-4 w-4" />
                  You walk out CompTIA ITF+ certified and job-ready.
                </p>
              </div>
            </motion.div>
          )}

          {/* Coming tracks + tradesman CTA */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="rounded-3xl bg-white border border-[#DDDDDD] p-7 sm:p-9"
          >
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#888888]">
              Expanding Soon
            </p>
            <ul className="mt-4 space-y-3">
              {comingTracks.map((track) => (
                <li key={track.id} className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-[#1A1A1A] text-sm sm:text-base">
                    {track.name}
                  </span>
                  <span className="shrink-0 rounded-full border border-[#DDDDDD] bg-[#F5F3EF] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#888888]">
                    Coming Soon
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-[#DDDDDD]">
              <h3 className="font-semibold text-[#1A1A1A] text-lg">
                Know a trade? Help us build it.
              </h3>
              <p className="mt-2 text-[#555555] text-sm leading-relaxed">
                If you&rsquo;re a father who&rsquo;s mastered HVAC, auto, plumbing, or another
                trade and you want to teach the next man up, we want to hear from you.
              </p>
              <Link
                href="/contact"
                className="mt-4 group inline-flex items-center gap-2 font-semibold text-[#5A7247] hover:text-[#3D5030] transition-colors"
              >
                Reach out to us
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 5. Curriculum — the journey, plotted
 * ------------------------------------------------------------------------- */

function Curriculum({ program }: { program: ProgramDetail }) {
  const isWeekBased = program.curriculum.some((item) => item.week !== undefined);
  return (
    <section className="relative bg-[#141413] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-starfield opacity-70" aria-hidden />
      <div
        className="aurora-blob absolute top-1/4 -right-48 w-[32rem] h-[32rem] rounded-full bg-[#C9A84C]/10"
        aria-hidden
      />
      <div
        className="aurora-blob absolute -bottom-40 -left-32 w-[26rem] h-[26rem] rounded-full bg-[#5A7247]/15"
        style={{ animationDelay: "-10s" }}
        aria-hidden
      />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        <Eyebrow light>The Journey</Eyebrow>
        <h2 className="mt-6 font-semibold text-white text-3xl sm:text-5xl tracking-tight leading-[1.08]">
          {isWeekBased ? "Plotted week by week," : "One step at a time,"}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
            built to finish.
          </span>
        </h2>

        <div className="mt-14 relative">
          {/* Timeline spine */}
          <div
            className="absolute left-[19px] sm:left-6 top-2 bottom-2 w-px bg-gradient-to-b from-[#C9A84C] via-[#C9A84C]/40 to-transparent"
            aria-hidden
          />

          <div className="space-y-6 sm:space-y-8">
            {program.curriculum.map((item, index) => {
              const label = item.week !== undefined ? `Week ${item.week}` : item.phase;
              const number =
                item.week !== undefined
                  ? String(item.week).padStart(2, "0")
                  : String(index + 1).padStart(2, "0");

              if (item.image) {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: EASE }}
                    className="relative pl-12 sm:pl-16"
                  >
                    <span
                      className="absolute left-3 sm:left-[17px] top-7 h-3.5 w-3.5 rounded-full bg-[#C9A84C] shadow-[0_0_14px_3px_rgba(201,168,76,0.55)] ring-4 ring-[#141413]"
                      aria-hidden
                    />

                    <div className="group rounded-3xl border border-[#C9A84C]/40 bg-white/[0.04] backdrop-blur overflow-hidden hover:border-[#C9A84C]/70 transition-colors relative">
                      <div className="grain-overlay relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.imageAlt ?? item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 800px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-[#141413]/20 to-transparent" />
                        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C] text-[#1A1A1A] text-[10px] font-bold tracking-[0.2em] uppercase">
                          Milestone
                        </span>
                      </div>
                      <div className="p-6 sm:p-8">
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                          <span className="text-outline-gold font-bold text-3xl sm:text-4xl leading-none select-none">
                            {number}
                          </span>
                          <div>
                            <p className="text-[#E8D48B] text-[10px] font-semibold tracking-[0.25em] uppercase">
                              {label}
                            </p>
                            <h3 className="text-white font-semibold text-xl sm:text-2xl">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                        <ul className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                          {item.topics.map((topic, topicIndex) => (
                            <li
                              key={topicIndex}
                              className="flex items-start gap-2.5 text-white/60 text-sm leading-relaxed"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 14 14"
                                className="text-[#C9A84C] shrink-0 mt-1"
                                aria-hidden
                              >
                                <path
                                  d="M2 1l6 6-6 6M7 1l6 6-6 6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  fill="none"
                                />
                              </svg>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: EASE }}
                  className="relative pl-12 sm:pl-16"
                >
                  {/* Timeline node */}
                  <span
                    className="absolute left-3 sm:left-[17px] top-7 h-3.5 w-3.5 rounded-full bg-[#C9A84C] shadow-[0_0_14px_3px_rgba(201,168,76,0.55)] ring-4 ring-[#141413]"
                    aria-hidden
                  />

                  <div className="group rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-6 sm:p-7 hover:border-[#C9A84C]/40 transition-colors overflow-hidden relative">
                    <div
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-hidden
                    />
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="text-outline-gold font-bold text-3xl sm:text-4xl leading-none select-none">
                        {number}
                      </span>
                      <div>
                        <p className="text-[#E8D48B] text-[10px] font-semibold tracking-[0.25em] uppercase">
                          {label}
                        </p>
                        <h3 className="text-white font-semibold text-lg sm:text-xl">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <ul className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                      {item.topics.map((topic, topicIndex) => (
                        <li
                          key={topicIndex}
                          className="flex items-start gap-2.5 text-white/60 text-sm leading-relaxed"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 14 14"
                            className="text-[#C9A84C] shrink-0 mt-1"
                            aria-hidden
                          >
                            <path
                              d="M2 1l6 6-6 6M7 1l6 6-6 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 6. Deliverables — what you walk away with
 * ------------------------------------------------------------------------- */

function Deliverables({ program }: { program: ProgramDetail }) {
  return (
    <section className="relative bg-[#FAFAF8] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-blueprint opacity-50" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow>What You Walk Away With</Eyebrow>
          <h2 className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.12] tracking-tight">
            Not promises.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
              Proof.
            </span>
          </h2>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {program.deliverables.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
              className="group relative rounded-3xl bg-white border border-[#DDDDDD] p-6 sm:p-7 overflow-hidden hover:border-[#C9A84C]/60 hover:shadow-[0_12px_40px_rgba(201,168,76,0.15)] transition-all duration-300"
            >
              <div
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden
              />
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FBF6E9] border border-[#C9A84C]/30 text-[#A68A2E]">
                {isFFIconName(item.icon) ? (
                  <FFIcon name={item.icon} className="h-6 w-6" />
                ) : (
                  <FFIcon name="spark" className="h-6 w-6" />
                )}
              </span>
              <h3 className="mt-4 font-semibold text-[#1A1A1A] text-base sm:text-lg leading-snug">
                {item.title}
              </h3>
              <p className="mt-2 text-[#555555] text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 7. Testimonial — one voice, out loud
 * ------------------------------------------------------------------------- */

function Testimonial({
  testimonial,
}: {
  testimonial: NonNullable<ProgramDetail["testimonial"]>;
}) {
  return (
    <section className="relative bg-[#141413] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-starfield" aria-hidden />
      <div
        className="aurora-blob absolute -top-24 right-1/4 w-[30rem] h-[30rem] rounded-full bg-[#C9A84C]/12"
        aria-hidden
      />
      <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <span
            className="block text-outline-gold font-bold text-7xl sm:text-8xl leading-none select-none mx-auto"
            aria-hidden
          >
            &ldquo;
          </span>
          <blockquote className="mt-2 font-semibold text-white text-2xl sm:text-3xl lg:text-4xl leading-[1.3] tracking-tight">
            {testimonial.quote}
          </blockquote>
          <div className="mt-8 inline-flex flex-col items-center">
            <span className="h-px w-10 bg-[#C9A84C]/60" aria-hidden />
            <p className="mt-4 text-[#E8D48B] font-semibold">{testimonial.name}</p>
            <p className="mt-1 text-white/50 text-sm">{testimonial.role}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 8. CTA — step through
 * ------------------------------------------------------------------------- */

function ProgramCTA({ program }: { program: ProgramDetail }) {
  return (
    <section className="relative bg-[#F5F3EF] py-20 sm:py-28 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-20 bg-chevron-band opacity-60" aria-hidden />
      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] p-8 sm:p-12 lg:p-14"
        >
          <div className="absolute inset-0 bg-chevron-band opacity-30" aria-hidden />
          <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="text-[#1A1A1A]/70 text-xs font-semibold tracking-[0.3em] uppercase">
                {AUDIENCE_LABELS[program.audience]} · {program.atAGlance.cost}
              </p>
              <h2 className="mt-3 font-bold text-[#1A1A1A] text-3xl sm:text-4xl leading-tight tracking-tight max-w-xl">
                Ready for {program.name}? The door is open.
              </h2>
              <p className="mt-3 text-[#1A1A1A]/75 max-w-xl">
                Applications are open now. One step through, and you&rsquo;re not
                walking alone anymore.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <Link
                href="/get-involved/enroll"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#1A1A1A] text-[#E8D48B] font-semibold hover:bg-[#2D2D2D] transition-colors"
              >
                Apply Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/get-involved/assess"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border-2 border-[#1A1A1A]/25 text-[#1A1A1A] font-semibold hover:border-[#1A1A1A] transition-colors"
              >
                <Compass className="h-4 w-4" />
                Not sure? Take the fit quiz
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <Link
            href="/programs"
            className="group inline-flex items-center gap-2 font-semibold text-[#5A7247] hover:text-[#3D5030] transition-colors"
          >
            <ArrowUpRight className="h-4 w-4 rotate-[225deg] group-hover:-translate-x-1 transition-transform" />
            Back to all programs
          </Link>
          <p className="text-[#888888] text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#A68A2E]" />
            Every program carries the same thread: leadership, family, future tech.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export function ProgramPageClient({ program }: ProgramPageClientProps) {
  return (
    <>
      <ProgramHero program={program} />
      <AtAGlance program={program} />
      <Overview program={program} />
      {program.slug === "father-forward" && <CareerPathways />}
      <Curriculum program={program} />
      <Deliverables program={program} />
      {program.testimonial && <Testimonial testimonial={program.testimonial} />}
      <ProgramCTA program={program} />
    </>
  );
}
