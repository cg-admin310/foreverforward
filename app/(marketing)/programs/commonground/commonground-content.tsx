"use client";

/**
 * CommonGround — a Forever Forward partner.
 * A co-parenting app that lowers conflict so kids can just be kids.
 * Observatory design language, warm family thread. Falls under our
 * "Family" work alongside Making Moments.
 */

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Wand2,
  CalendarDays,
  Receipt,
  Video,
  MapPin,
  ShieldCheck,
  Heart,
  Handshake,
  Share2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const CG_URL = "https://www.find-commonground.com/";

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

function CgHero() {
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
          src="/images/programs/commonground-hero.jpg"
          alt="A father laughing with his child on his shoulders at a park, present and at peace"
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
          <Eyebrow light>A Forever Forward Partner · For Co-Parents</Eyebrow>
        </motion.div>

        <h1 className="mt-5 font-bold leading-[0.95] tracking-tight max-w-4xl">
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block text-outline-gold text-[13vw] sm:text-6xl lg:text-[5.4rem]"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            >
              COMMONGROUND
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-2">
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient text-[8vw] sm:text-4xl lg:text-[3rem] font-semibold"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
            >
              Less conflict. More childhood.
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-5 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
        >
          CommonGround is a co-parenting app built to take the heat out of raising
          kids across two homes. It cools tense messages, keeps the schedule
          straight, splits the costs fairly, and keeps kids out of the middle. So
          co-parents can stop fighting and get back to parenting.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
        >
          <a
            href={CG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A] font-semibold shadow-[0_0_40px_rgba(201,168,76,0.3)] hover:shadow-[0_0_60px_rgba(201,168,76,0.5)] transition-shadow"
          >
            Start free on CommonGround
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
          Free to start, no card needed. A proud Forever Forward partner.
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
            <Eyebrow>Why CommonGround Exists</Eyebrow>
            <h2 className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.14] tracking-tight">
              When co-parents are at war,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
                the kids carry it.
              </span>
            </h2>
            <p className="mt-6 text-[#555555] text-base sm:text-lg leading-relaxed">
              A text that lands wrong. A pickup nobody confirmed. A bill that turns
              into a fight. A kid asked to pass a message they should never have to
              carry. None of it is about love. It&rsquo;s about tools built for two
              homes, and most families never had them.
            </p>
            <p className="mt-4 text-[#555555] text-base sm:text-lg leading-relaxed">
              CommonGround gives co-parents that structure, so the friction fades
              and the childhood stays whole.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            <div className="grain-overlay relative aspect-[3/2] rounded-3xl overflow-hidden border border-[#DDDDDD] shadow-xl">
              <Image
                src="/images/programs/commonground-family.jpg"
                alt="A parent and child calmly doing homework together in a supported home"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white text-lg sm:text-xl font-semibold leading-snug">
                  Calm co-parents raise steady kids.
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
 * 3. Features
 * ------------------------------------------------------------------------- */

const FEATURES = [
  {
    icon: Wand2,
    title: "ARIA",
    text: "An AI that softens a heated message before it ever gets sent.",
  },
  {
    icon: CalendarDays,
    title: "TimeBridge",
    text: "Recurring pickups, dropoffs, and holidays, handled without the back-and-forth.",
  },
  {
    icon: Receipt,
    title: "ClearFund",
    text: "Shared costs split clean, with receipts logged so nobody keeps score.",
  },
  {
    icon: Video,
    title: "KidSpace",
    text: "A safe way for kids to video-call the parent they're missing.",
  },
  {
    icon: MapPin,
    title: "Silent Handoff",
    text: "GPS-verified, contactless exchanges. No standoff in the parking lot.",
  },
  {
    icon: ShieldCheck,
    title: "Court-Ready Records",
    text: "Every message logged and exportable, if it ever needs to be.",
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
          <Eyebrow light>What&rsquo;s Inside</Eyebrow>
          <h2 className="mt-6 font-semibold text-white text-3xl sm:text-5xl tracking-tight leading-[1.08]">
            Built for the hard parts,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
              so they get easier.
            </span>
          </h2>
          <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">
            Every feature targets a place co-parenting usually breaks down, and
            takes the edge off it.
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
 * 4. How to get started
 * ------------------------------------------------------------------------- */

const STEPS = [
  {
    number: "01",
    title: "Start free",
    text: "Sign up in about two minutes. No card needed to begin.",
  },
  {
    number: "02",
    title: "Invite your co-parent",
    text: "When you're ready, bring them in. Everything lives in one shared place.",
  },
  {
    number: "03",
    title: "Find your rhythm",
    text: "Schedules, messages, and money in one calm system. Upgrade only if you want more.",
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
          <Eyebrow>Getting Started</Eyebrow>
          <h2 className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.12] tracking-tight">
            You can be set up{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
              before the next handoff.
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
            href={CG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1A1A1A] text-[#E8D48B] font-semibold hover:bg-[#2D2D2D] transition-colors"
          >
            Create your free account
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 5. Partnership framing
 * ------------------------------------------------------------------------- */

function PartnershipSection() {
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
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            className="order-2 lg:order-1"
          >
            <div className="grain-overlay relative aspect-[3/2] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/programs/commonground-app.jpg"
                alt="A parent holding a phone showing a calm shared co-parenting calendar"
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

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="order-1 lg:order-2"
          >
            <Eyebrow light>Why We Stand With It</Eyebrow>
            <h2 className="mt-6 font-semibold text-white text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.12] tracking-tight">
              Strong families are the whole point.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
                This is family work.
              </span>
            </h2>
            <p className="mt-6 text-white/65 text-base sm:text-lg leading-relaxed">
              Forever Forward is built around fathers, kids, and the families that
              hold them. A calmer co-parenting relationship changes a child&rsquo;s
              whole world, and keeps a father in it.
            </p>
            <p className="mt-4 text-white/65 text-base sm:text-lg leading-relaxed">
              That&rsquo;s why we partner with CommonGround: it&rsquo;s technology
              pointed straight at one of the hardest parts of family life. It sits
              right alongside our Making Moments work, under the same roof.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-white/70">
                <Heart className="h-4 w-4 text-[#E8D48B]" />
                Part of our Family work
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-white/70">
                <Sparkles className="h-4 w-4 text-[#E8D48B]" />
                Technology for real family life
              </span>
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
    icon: Video,
    kicker: "Try It",
    title: "Start free today.",
    text: "If you're co-parenting, this is for you. Create an account and invite your co-parent when you're ready.",
    href: CG_URL,
    cta: "Open CommonGround",
    external: true,
  },
  {
    icon: Share2,
    kicker: "Spread the Word",
    title: "Tell a co-parent.",
    text: "Someone you love is doing this the hard way. A calmer path is a link away.",
    href: CG_URL,
    cta: "Share CommonGround",
    external: true,
  },
  {
    icon: Heart,
    kicker: "Support the Mission",
    title: "Back our family work.",
    text: "Your gift to Forever Forward fuels the family programs this partnership grows from.",
    href: "/get-involved/donate?fund=making-moments",
    cta: "Donate to family work",
    external: false,
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
            Be part of it.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
              Three easy ways.
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

function CgCTA() {
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
            Give your kids{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
              two calm homes.
            </span>
          </h2>
          <p className="mt-6 text-white/65 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            CommonGround is free to start and ready right now. Set it up today and
            take the temperature down for good.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={CG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A] font-semibold shadow-[0_0_50px_rgba(201,168,76,0.35)] hover:shadow-[0_0_70px_rgba(201,168,76,0.55)] transition-shadow"
            >
              Start free on CommonGround
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
            find-commonground.com · A Forever Forward partner
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export function CommonGroundContent() {
  return (
    <>
      <CgHero />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PartnershipSection />
      <GetInvolvedSection />
      <CgCTA />
    </>
  );
}
