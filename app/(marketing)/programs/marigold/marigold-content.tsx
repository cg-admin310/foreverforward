"use client";

/**
 * Marigold — a Forever Forward tech initiative.
 * A free tool that decodes a child's IEP into plain language for parents
 * and connects families to matched resources. Observatory design language,
 * with a warm "growth / marigold" thread on top of the brand palette.
 */

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  MessageCircle,
  NotebookPen,
  LineChart,
  BookOpen,
  Compass,
  Upload,
  Eye,
  Sprout,
  Heart,
  Handshake,
  Share2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const MARIGOLD_URL = "https://marigold.4everforward.net/";

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

function MarigoldHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] bg-[#141413] overflow-hidden flex items-end"
    >
      <motion.div style={{ y: imgY }} className="absolute -inset-y-[8%] inset-x-0">
        <Image
          src="/images/programs/marigold-hero.jpg"
          alt="A mother and her child looking at a tablet together at home, relief and understanding on her face"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#141413] via-[#141413]/70 to-[#141413]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-transparent to-[#141413]/40" />
      <div className="grain-overlay absolute inset-0" aria-hidden />
      <div className="absolute inset-0 bg-starfield bg-starfield-twinkle opacity-50" aria-hidden />

      {/* Orbit accent */}
      <div className="absolute top-28 right-10 w-36 h-36 hidden lg:block" aria-hidden>
        <div className="absolute inset-0 orbit-ring opacity-50" />
        <div className="absolute inset-0 orbit-carrier-slow">
          <span className="orbit-satellite absolute -top-1 left-1/2 w-2 h-2" />
        </div>
      </div>

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full pt-36 pb-16 sm:pb-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          <Eyebrow light>A Forever Forward Tech Initiative · Free for Families</Eyebrow>
        </motion.div>

        <h1 className="mt-5 font-bold leading-[0.95] tracking-tight max-w-4xl">
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block text-outline-gold text-[15vw] sm:text-7xl lg:text-[6.5rem]"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            >
              MARIGOLD
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-2">
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient text-[8vw] sm:text-4xl lg:text-[3rem] font-semibold"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
            >
              Their plan. Your language.
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-5 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
        >
          Your child&rsquo;s IEP, decoded. Marigold turns a dense special-education
          document into plain language you can actually use, then connects you to the
          therapies and programs that fit your child. So you walk into every meeting
          knowing exactly what&rsquo;s happening, and what to ask for.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
        >
          <a
            href={MARIGOLD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A] font-semibold shadow-[0_0_40px_rgba(201,168,76,0.3)] hover:shadow-[0_0_60px_rgba(201,168,76,0.5)] transition-shadow"
          >
            Open Marigold, it&rsquo;s free
            <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <a
            href="#how"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/25 text-white font-semibold hover:border-[#C9A84C]/60 hover:bg-white/5 transition-colors"
          >
            See how it works
          </a>
        </motion.div>

        <motion.p
          className="mt-6 text-sm text-white/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          Free, always. Built by Forever Forward, a 501(c)(3) nonprofit.
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 2. The problem
 * ------------------------------------------------------------------------- */

function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section className="relative bg-[#FAFAF8] py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Eyebrow>Why Marigold Exists</Eyebrow>
            <h2 className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.14] tracking-tight">
              You deserve to understand your child&rsquo;s plan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
                as well as anyone at that table.
              </span>
            </h2>
            <p className="mt-6 text-[#555555] text-base sm:text-lg leading-relaxed">
              An IEP is one of the most important documents in your child&rsquo;s
              life, and it&rsquo;s written in acronyms, legal language, and
              education jargon. Parents get handed thirty pages and are expected to
              advocate from them. Too often, they leave the meeting unsure of what
              was decided, or what their child is owed.
            </p>
            <p className="mt-4 text-[#555555] text-base sm:text-lg leading-relaxed">
              That gap isn&rsquo;t about how much a parent cares. It&rsquo;s about
              access. Marigold closes it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            <div className="grain-overlay relative aspect-[3/2] rounded-3xl overflow-hidden border border-[#DDDDDD] shadow-xl">
              <Image
                src="/images/programs/marigold-meeting.jpg"
                alt="A confident parent prepared at a school IEP meeting with educators"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white text-lg sm:text-xl font-semibold leading-snug">
                  Walk in knowing. You&rsquo;ve always had the power.
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
 * 3. What Mari does — feature grid
 * ------------------------------------------------------------------------- */

const FEATURES = [
  {
    icon: FileText,
    title: "Plan Decoding",
    text: "Goals, services, and evaluations in plain language, with every acronym defined.",
  },
  {
    icon: MessageCircle,
    title: "Ask Mari Anything",
    text: "A chat that answers straight from your child's document, day or night.",
  },
  {
    icon: NotebookPen,
    title: "Care Journal",
    text: "A private space to log wins, worries, and notes before they slip away.",
  },
  {
    icon: LineChart,
    title: "Progress Snapshots",
    text: "Monthly recaps with talking points, ready for your next meeting.",
  },
  {
    icon: BookOpen,
    title: "Parent Playbook",
    text: "Guidance from real educators and advocates, always in your corner.",
  },
  {
    icon: Compass,
    title: "Resource Directory",
    text: "Therapies and programs matched to your child's actual goals.",
  },
] as const;

function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

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

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" ref={ref}>
        <div className="max-w-2xl">
          <Eyebrow light>Meet Mari</Eyebrow>
          <h2 className="mt-6 font-semibold text-white text-3xl sm:text-5xl tracking-tight leading-[1.08]">
            An assistant that reads the plan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
              with you, not at you.
            </span>
          </h2>
          <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">
            Upload your child&rsquo;s plan and Mari explains it the way a trusted
            friend would: what&rsquo;s happening, why, who&rsquo;s responsible, and
            what you can do next.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1 + Math.floor(i / 3) * 0.06, ease: EASE }}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-6 sm:p-7 hover:border-[#C9A84C]/40 transition-colors overflow-hidden"
            >
              <div
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden
              />
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C9A84C]/12 border border-[#C9A84C]/25 text-[#E8D48B]">
                <feature.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-white font-semibold text-lg">{feature.title}</h3>
              <p className="mt-2 text-white/55 text-sm leading-relaxed">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 4. How it works — three steps
 * ------------------------------------------------------------------------- */

const STEPS = [
  {
    icon: Upload,
    number: "01",
    title: "Plant the IEP",
    text: "Upload the PDF your school gave you. That's the whole setup.",
  },
  {
    icon: Eye,
    number: "02",
    title: "See it Clearly",
    text: "Mari lays out what's happening, why it matters, and who's responsible.",
  },
  {
    icon: Sprout,
    number: "03",
    title: "Grow With It",
    text: "Track progress, log notes, and walk into every meeting prepared.",
  },
] as const;

function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <section id="how" className="relative bg-[#F5F3EF] py-24 sm:py-32 overflow-hidden scroll-mt-20">
      <div className="absolute top-0 inset-x-0 h-20 bg-chevron-band opacity-60" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" ref={ref}>
        <div className="max-w-2xl">
          <Eyebrow>How It Works</Eyebrow>
          <h2 className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.12] tracking-tight">
            Three steps.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
              Plant it, see it, grow with it.
            </span>
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              className="relative rounded-3xl bg-white border border-[#DDDDDD] p-7 sm:p-8 overflow-hidden hover:border-[#C9A84C]/50 hover:shadow-[0_12px_40px_rgba(201,168,76,0.14)] transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FBF6E9] border border-[#C9A84C]/30 text-[#A68A2E]">
                  <step.icon className="h-6 w-6" />
                </span>
                <span
                  className="font-bold text-5xl leading-none select-none"
                  style={{
                    WebkitTextStroke: "1.5px rgba(166,138,46,0.4)",
                    WebkitTextFillColor: "transparent",
                  }}
                  aria-hidden
                >
                  {step.number}
                </span>
              </div>
              <h3 className="mt-5 font-semibold text-[#1A1A1A] text-xl">{step.title}</h3>
              <p className="mt-2 text-[#555555] text-sm sm:text-base leading-relaxed">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="mt-10"
        >
          <a
            href={MARIGOLD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1A1A1A] text-[#E8D48B] font-semibold hover:bg-[#2D2D2D] transition-colors"
          >
            Try it with your child&rsquo;s plan
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 5. Tech advancement framing
 * ------------------------------------------------------------------------- */

function TechInitiativeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <section className="relative bg-[#141413] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-blueprint opacity-40" aria-hidden />
      <div className="absolute inset-0 bg-starfield opacity-50" aria-hidden />
      <div
        className="aurora-blob absolute -top-32 right-1/4 w-[32rem] h-[32rem] rounded-full bg-[#C9A84C]/12"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Eyebrow light>Technology, Put to Work</Eyebrow>
            <h2 className="mt-6 font-semibold text-white text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.12] tracking-tight">
              Real tools for real problems.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
                Marigold is the first of many.
              </span>
            </h2>
            <p className="mt-6 text-white/65 text-base sm:text-lg leading-relaxed">
              Forever Forward doesn&rsquo;t just teach tomorrow&rsquo;s technology.
              We use it. Marigold is what happens when we point AI at a problem
              families actually face, and build the answer ourselves.
            </p>
            <p className="mt-4 text-white/65 text-base sm:text-lg leading-relaxed">
              It&rsquo;s free because understanding your child&rsquo;s education
              should never come with a price tag. And it&rsquo;s only the start.
              We&rsquo;re building the next tools right now.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-white/70">
                <Sparkles className="h-4 w-4 text-[#E8D48B]" />
                Built with AI, for families
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-white/70">
                <Heart className="h-4 w-4 text-[#E8D48B]" />
                Always free
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            <div className="grain-overlay relative aspect-[3/2] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/programs/marigold-app.jpg"
                alt="A parent holding a tablet showing a clean, calm app interface at home"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/60 via-transparent to-transparent" />
              <div className="absolute inset-x-0 top-0 h-1/3 pointer-events-none overflow-hidden opacity-30">
                <div className="holo-sweep absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-[#E8D48B]/25 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 6. Get involved
 * ------------------------------------------------------------------------- */

const WAYS = [
  {
    icon: Heart,
    kicker: "Support It",
    title: "Keep Marigold free.",
    text: "Your gift covers the tech that keeps this tool free for every parent who needs it.",
    href: "/get-involved/donate?fund=general",
    cta: "Donate",
    external: false,
  },
  {
    icon: Handshake,
    kicker: "Become a Resource",
    title: "List your program.",
    text: "Run a therapy, clinic, or support program? Get matched to the families who need you.",
    href: "/get-involved/partner",
    cta: "Partner with us",
    external: false,
  },
  {
    icon: Share2,
    kicker: "Spread the Word",
    title: "Tell a parent.",
    text: "Someone you know is walking into an IEP meeting unsure. Send them Marigold.",
    href: MARIGOLD_URL,
    cta: "Share Marigold",
    external: true,
  },
] as const;

function GetInvolvedSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <section className="relative bg-[#FAFAF8] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-blueprint opacity-50" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" ref={ref}>
        <div className="max-w-2xl">
          <Eyebrow>Get Involved</Eyebrow>
          <h2 className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.12] tracking-tight">
            It takes a village.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
              Here&rsquo;s how to be one.
            </span>
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {WAYS.map((way, i) => {
            const inner = (
              <>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FBF6E9] border border-[#C9A84C]/30 text-[#A68A2E]">
                    <way.icon className="h-6 w-6" />
                  </span>
                  <span className="w-10 h-10 rounded-full bg-[#1A1A1A]/[0.06] flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#C9A84C] transition-colors">
                    {way.external ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowRight className="h-5 w-5" />
                    )}
                  </span>
                </div>
                <p className="mt-5 text-[10px] font-semibold tracking-[0.28em] uppercase text-[#A68A2E]">
                  {way.kicker}
                </p>
                <h3 className="mt-2 font-semibold text-[#1A1A1A] text-xl">{way.title}</h3>
                <p className="mt-2 text-[#555555] text-sm sm:text-base leading-relaxed">
                  {way.text}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#5A7247] group-hover:text-[#3D5030] transition-colors">
                  {way.cta}
                </span>
              </>
            );

            const className =
              "group relative flex flex-col rounded-3xl bg-white border border-[#DDDDDD] p-7 sm:p-8 hover:border-[#C9A84C]/60 hover:shadow-[0_12px_40px_rgba(201,168,76,0.14)] transition-all duration-300";

            return (
              <motion.div
                key={way.kicker}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              >
                {way.external ? (
                  <a href={way.href} target="_blank" rel="noopener noreferrer" className={className}>
                    {inner}
                  </a>
                ) : (
                  <Link href={way.href} className={className}>
                    {inner}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 7. Closing CTA
 * ------------------------------------------------------------------------- */

function MarigoldCTA() {
  return (
    <section className="relative bg-[#141413] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-starfield" aria-hidden />
      <div
        className="aurora-blob absolute -top-32 left-1/3 w-[34rem] h-[34rem] rounded-full bg-[#C9A84C]/12"
        aria-hidden
      />
      <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <Eyebrow light>Your Move</Eyebrow>
          <h2 className="mt-5 font-semibold text-white text-3xl sm:text-5xl lg:text-[3.2rem] tracking-tight leading-[1.05]">
            Walk in knowing.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
              You&rsquo;ve always had the power.
            </span>
          </h2>
          <p className="mt-6 text-white/65 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Marigold is free, private, and ready when you are. Upload your
            child&rsquo;s plan and see it clearly today.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={MARIGOLD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A] font-semibold shadow-[0_0_50px_rgba(201,168,76,0.35)] hover:shadow-[0_0_70px_rgba(201,168,76,0.55)] transition-shadow"
            >
              Open Marigold
              <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/25 text-white font-semibold hover:border-[#C9A84C]/60 hover:bg-white/5 transition-colors"
            >
              See all our programs
            </Link>
          </div>
          <p className="mt-8 text-white/40 text-sm">
            marigold.4everforward.net · A Forever Forward tech initiative
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export function MarigoldContent() {
  return (
    <>
      <MarigoldHero />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TechInitiativeSection />
      <GetInvolvedSection />
      <MarigoldCTA />
    </>
  );
}
