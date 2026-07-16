"use client";

/**
 * Forever Forward — Umbrella Program page (Father Forward, Tech-Ready Youth).
 * An umbrella introduces the family of programs beneath it, then links out to
 * each one. Design language: "Afro-futurist observatory".
 */

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Compass, Sparkles } from "lucide-react";
import { FFIcon, isFFIconName } from "@/components/shared/ff-icons";
import type { UmbrellaDetail } from "@/lib/data/umbrellas";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

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
 * 1. Hero
 * ------------------------------------------------------------------------- */

function UmbrellaHero({ umbrella }: { umbrella: UmbrellaDetail }) {
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
      className="relative min-h-[86svh] bg-[#141413] overflow-hidden flex items-end"
    >
      <motion.div style={{ y: imgY }} className="absolute -inset-y-[8%] inset-x-0">
        <Image
          src={umbrella.heroImage}
          alt={umbrella.name}
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
            {umbrella.pillar} · {umbrella.kicker} ·{" "}
            {umbrella.programs.length} Programs
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
              {umbrella.name}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-2">
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient text-[6.5vw] sm:text-3xl lg:text-[2.6rem] font-semibold"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
            >
              {umbrella.tagline}
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-5 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
        >
          {umbrella.heroDescription}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
        >
          <a
            href="#programs"
            className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A] font-semibold shadow-[0_0_40px_rgba(201,168,76,0.25)] hover:shadow-[0_0_60px_rgba(201,168,76,0.45)] transition-shadow"
          >
            See the Programs
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            href="/get-involved/enroll"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/20 text-white font-semibold hover:border-[#C9A84C]/60 hover:bg-white/5 transition-colors"
          >
            Apply Now
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 2. Overview
 * ------------------------------------------------------------------------- */

function Overview({ umbrella }: { umbrella: UmbrellaDetail }) {
  const [lead, ...rest] = umbrella.overview;
  return (
    <section className="relative bg-[#FAFAF8] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
        <Eyebrow>The Umbrella</Eyebrow>
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
        {rest.length > 0 && (
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
        )}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 3. The programs — the whole point of an umbrella
 * ------------------------------------------------------------------------- */

function Programs({ umbrella }: { umbrella: UmbrellaDetail }) {
  return (
    <section
      id="programs"
      className="relative bg-[#141413] py-24 sm:py-32 overflow-hidden scroll-mt-20"
    >
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

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow light>{umbrella.programsEyebrow}</Eyebrow>
          <h2 className="mt-6 font-semibold text-white text-3xl sm:text-5xl tracking-tight leading-[1.08]">
            {umbrella.programsTitle}
          </h2>
          <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">
            {umbrella.programsIntro}
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:gap-7">
          {umbrella.programs.map((program, index) => (
            <motion.div
              key={program.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: EASE }}
            >
              <Link
                href={`/programs/${program.slug}`}
                className="group grid md:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-[#C9A84C]/50 transition-colors"
              >
                <div
                  className={cn(
                    "grain-overlay relative aspect-[16/10] md:aspect-auto md:min-h-[19rem] overflow-hidden",
                    index % 2 === 1 && "md:order-2"
                  )}
                >
                  <Image
                    src={program.image}
                    alt={program.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 560px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-[#141413]/15 to-transparent md:bg-gradient-to-r" />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C] text-[#1A1A1A] text-[10px] font-bold tracking-[0.16em] uppercase">
                    <FFIcon
                      name={isFFIconName(program.icon) ? program.icon : "spark"}
                      className="h-3.5 w-3.5"
                    />
                    {program.kind}
                  </span>
                </div>
                <div className="relative p-7 sm:p-10 flex flex-col justify-center">
                  <span
                    className="text-outline-gold font-bold text-4xl sm:text-5xl leading-none select-none"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-semibold text-white text-2xl sm:text-3xl leading-tight group-hover:text-[#E8D48B] transition-colors">
                    {program.name}
                  </h3>
                  <p className="mt-1.5 text-[#C9A84C] font-semibold text-sm sm:text-base">
                    {program.tagline}
                  </p>
                  <p className="mt-4 text-white/65 text-base leading-relaxed max-w-md">
                    {program.blurb}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-semibold text-white group-hover:text-[#E8D48B] transition-colors">
                    Explore {program.name}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 4. Sponsor CTA
 * ------------------------------------------------------------------------- */

function SponsorCta() {
  return (
    <section className="relative bg-[#FBF6E9] py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-blueprint opacity-60" aria-hidden />
      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-3xl border border-[#C9A84C]/40 bg-white p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center gap-5 justify-between"
        >
          <div>
            <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#A68A2E]">
              For Partners &amp; Sponsors
            </p>
            <p className="mt-2 text-[#1A1A1A] font-semibold text-lg sm:text-xl leading-snug max-w-xl">
              Put your company in the room. Sponsor a program, send a speaker, or
              host the visit.
            </p>
          </div>
          <Link
            href="/get-involved/partner"
            className="group shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1A1A1A] text-[#E8D48B] font-semibold hover:bg-[#2D2D2D] transition-colors"
          >
            Sponsor a program
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 5. CTA
 * ------------------------------------------------------------------------- */

function UmbrellaCTA({ umbrella }: { umbrella: UmbrellaDetail }) {
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
                {umbrella.kicker} · Free for qualifying participants
              </p>
              <h2 className="mt-3 font-bold text-[#1A1A1A] text-3xl sm:text-4xl leading-tight tracking-tight max-w-xl">
                Ready for {umbrella.name}? Pick your program.
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

export function UmbrellaPageClient({ umbrella }: { umbrella: UmbrellaDetail }) {
  return (
    <>
      <UmbrellaHero umbrella={umbrella} />
      <Overview umbrella={umbrella} />
      <Programs umbrella={umbrella} />
      {umbrella.sponsorCta && <SponsorCta />}
      <UmbrellaCTA umbrella={umbrella} />
    </>
  );
}
