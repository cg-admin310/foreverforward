"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Users,
  Heart,
  Target,
  Lightbulb,
  Award,
  Building2,
  Rocket,
  GraduationCap,
  Handshake,
  Quote,
  ChevronRight,
  Sparkles,
  Play,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCounter } from "@/components/marketing/stat-counter";
import { IMPACT_STATS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Import SVG components
import { GradientMesh, ParticleField } from "@/components/svg/backgrounds";
import { GridPattern, GradientOrb } from "@/components/svg/decorative";
import { ForwardArrowIcon } from "@/components/svg/icons";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const missionPillars = [
  {
    icon: Users,
    title: "Empower Fathers",
    description:
      "We equip Black fathers with in-demand tech skills and leadership training to become providers, role models, and community leaders.",
    color: "gold" as const,
    stat: "100+",
    statLabel: "Fathers Trained",
  },
  {
    icon: Heart,
    title: "Strengthen Families",
    description:
      "Through events, resources, and support systems, we help families build stronger bonds and create lasting memories together.",
    color: "olive" as const,
    stat: "500+",
    statLabel: "Families Served",
  },
  {
    icon: Rocket,
    title: "Inspire Youth",
    description:
      "We introduce young people to tech careers early, providing hands-on training and real pathways to success.",
    color: "gold" as const,
    stat: "200+",
    statLabel: "Youth Reached",
  },
  {
    icon: Building2,
    title: "Serve Nonprofits",
    description:
      "Our IT services bring enterprise-level technology to mission-driven organizations at nonprofit-friendly prices.",
    color: "olive" as const,
    stat: "25+",
    statLabel: "Clients Served",
  },
];

const timelineEvents = [
  {
    year: "2023",
    title: "Forever Forward Founded",
    description:
      "TJ Wilform launches Forever Forward in Los Angeles, combining his IT expertise with his passion for community empowerment.",
  },
  {
    year: "2023",
    title: "First Father Forward Cohort",
    description:
      "The inaugural Father Forward program graduates its first class of fathers with Google IT certifications.",
  },
  {
    year: "2024",
    title: "IT Services Launch",
    description:
      "Forever Forward begins serving nonprofits across Los Angeles and the Inland Empire with managed IT services.",
  },
  {
    year: "2024",
    title: "Travis AI Introduced",
    description:
      "The AI-powered case manager Travis launches, providing 24/7 support for program participants.",
  },
  {
    year: "2025",
    title: "Expanding Impact",
    description:
      "Growing the workforce pool, launching new programs, and scaling services to more communities.",
  },
];

// Mission Pillar Card Component
function MissionPillarCard({ pillar, index }: { pillar: typeof missionPillars[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] as const }}
      className="group"
    >
      <div className={cn(
        "relative h-full rounded-2xl p-8 transition-all duration-500",
        "bg-gradient-to-br from-white to-[#FAFAF8]",
        "border border-[#DDDDDD] hover:border-transparent",
        "shadow-sm hover:shadow-2xl",
        pillar.color === "gold"
          ? "hover:shadow-[#C9A84C]/20"
          : "hover:shadow-[#5A7247]/20"
      )}>
        {/* Hover gradient overlay */}
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          pillar.color === "gold"
            ? "bg-gradient-to-br from-[#FBF6E9] to-white"
            : "bg-gradient-to-br from-[#EFF4EB] to-white"
        )} />

        {/* Content */}
        <div className="relative">
          {/* Icon */}
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500",
            pillar.color === "gold"
              ? "bg-[#FBF6E9] group-hover:bg-[#C9A84C]/20"
              : "bg-[#EFF4EB] group-hover:bg-[#5A7247]/20"
          )}>
            <pillar.icon className={cn(
              "h-8 w-8 transition-transform duration-500 group-hover:scale-110",
              pillar.color === "gold" ? "text-[#C9A84C]" : "text-[#5A7247]"
            )} />
          </div>

          {/* Stat badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: index * 0.15 + 0.3, type: "spring", stiffness: 200 }}
            className={cn(
              "absolute top-0 right-0 px-3 py-1 rounded-full text-sm font-bold",
              pillar.color === "gold"
                ? "bg-[#C9A84C] text-[#1A1A1A]"
                : "bg-[#5A7247] text-white"
            )}
          >
            {pillar.stat}
          </motion.div>

          <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{pillar.title}</h3>
          <p className="text-[#555555] leading-relaxed mb-4">{pillar.description}</p>
          <p className={cn(
            "text-sm font-medium",
            pillar.color === "gold" ? "text-[#C9A84C]" : "text-[#5A7247]"
          )}>
            {pillar.statLabel}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Timeline Event Component
function TimelineEvent({ event, index }: { event: typeof timelineEvents[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative flex items-center"
    >
      {/* Center dot with animated ring */}
      <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
          className="w-5 h-5 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] border-4 border-[#EFF4EB]"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#C9A84C]/50"
          initial={{ scale: 1, opacity: 1 }}
          animate={isInView ? { scale: 2, opacity: 0 } : {}}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
        />
      </div>

      {/* Content */}
      <div className={cn(
        "ml-12 lg:ml-0 w-full lg:w-[45%]",
        isLeft ? "lg:pr-12 lg:text-right" : "lg:pl-12 lg:ml-auto"
      )}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.1 + 0.1 }}
          className="bg-white rounded-xl p-6 border border-[#DDDDDD] shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#A68A2E] text-[#1A1A1A] text-sm font-bold mb-3">
            {event.year}
          </span>
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{event.title}</h3>
          <p className="text-[#555555] text-sm leading-relaxed">{event.description}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function AboutContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start" as const, "end start" as const],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [travisTyping, setTravisTyping] = useState(false);

  return (
    <>
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center py-20 lg:py-32 bg-[#1A1A1A] overflow-hidden">
        {/* Animated backgrounds */}
        <div className="absolute inset-0">
          <GradientMesh variant="hero" className="opacity-40" />
          <ParticleField particleCount={25} colors={["#C9A84C", "#5A7247", "#FFFFFF"]} className="opacity-30" />
        </div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-20 right-[15%] opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <ForwardArrowIcon size={100} color="#C9A84C" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-[10%] opacity-15"
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          <ForwardArrowIcon size={80} color="#5A7247" />
        </motion.div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#2D2D2D] to-[#333333] border border-[#444444] shadow-lg">
                <Quote className="h-4 w-4 text-[#C9A84C]" />
                <span className="text-sm font-medium text-white/90">Our Story</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8"
            >
              <span className="text-white">From Compton to the Cloud,</span>
              <br />
              <span className="bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] bg-clip-text text-transparent">
                Forever Forward
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed"
            >
              We&apos;re proving that workforce development and community service
              aren&apos;t just compatible—
              <span className="text-white font-semibold">they&apos;re most powerful when combined.</span>
            </motion.p>

            {/* Scroll indicator */}
            <motion.div
              variants={itemVariants}
              className="mt-16"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex flex-col items-center gap-2 text-white/40"
              >
                <span className="text-sm">Scroll to explore</span>
                <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
                  <motion.div
                    className="w-1.5 h-3 rounded-full bg-[#C9A84C]"
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
      </section>

      {/* MISSION & VISION */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-[#FAFAF8] to-white relative overflow-hidden">
        <GridPattern color="#C9A84C" opacity={0.02} size={50} className="absolute inset-0" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="group"
            >
              <div className="relative bg-white rounded-3xl p-8 lg:p-10 border border-[#DDDDDD] hover:border-[#C9A84C]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#C9A84C]/10">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-[#FBF6E9] opacity-50" />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] flex items-center justify-center">
                      <Target className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Our Mission</h2>
                  </div>
                  <p className="text-lg text-[#555555] leading-relaxed">
                    To empower Black fathers and youth with in-demand technology
                    skills while providing enterprise IT services to nonprofits and
                    schools—creating a{" "}
                    <span className="text-[#C9A84C] font-semibold">self-sustaining cycle</span> of education,
                    employment, and community service.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="group"
            >
              <div className="relative bg-white rounded-3xl p-8 lg:p-10 border border-[#DDDDDD] hover:border-[#5A7247]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#5A7247]/10">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-[#EFF4EB] opacity-50" />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5A7247] to-[#3D5030] flex items-center justify-center">
                      <Lightbulb className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Our Vision</h2>
                  </div>
                  <p className="text-lg text-[#555555] leading-relaxed">
                    A future where every father has the tools to provide, every
                    young person has a pathway to tech careers, and every nonprofit
                    has access to{" "}
                    <span className="text-[#5A7247] font-semibold">enterprise-level IT support</span>.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MISSION PILLARS */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <GradientOrb className="absolute top-20 right-10 opacity-20" size={300} colors={["#C9A84C", "#E8D48B"]} />
        <GradientOrb className="absolute bottom-20 left-10 opacity-15" size={250} colors={["#5A7247", "#7A9A63"]} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBF6E9] text-[#A68A2E] text-sm font-semibold mb-4">
              <Heart className="h-4 w-4" />
              What Drives Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
              Four Interconnected Pillars
            </h2>
            <p className="text-xl text-[#555555] max-w-2xl mx-auto">
              Every program, every service, every initiative stems from these core principles.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {missionPillars.map((pillar, index) => (
              <MissionPillarCard key={pillar.title} pillar={pillar} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* DUAL-ENGINE MODEL */}
      <section className="py-20 lg:py-32 bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute inset-0">
          <GradientMesh variant="subtle" className="opacity-30" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-[#C9A84C] text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Our Approach
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              The Dual-Engine Model
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Unlike traditional nonprofits, we generate sustainable revenue through IT services—
              then invest it back into our programs.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Engine 1 */}
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: -10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="group"
            >
              <div className="relative bg-gradient-to-br from-[#2D2D2D] to-[#222222] rounded-3xl p-8 lg:p-10 border border-[#444444] hover:border-[#C9A84C]/50 transition-all duration-500">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-[#C9A84C]/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                <div className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] flex items-center justify-center">
                      <GraduationCap className="h-8 w-8 text-[#1A1A1A]" />
                    </div>
                    <div>
                      <span className="text-[#C9A84C] text-sm font-semibold">Engine 1</span>
                      <h3 className="text-2xl font-bold text-white">Workforce Development</h3>
                    </div>
                  </div>

                  <ul className="space-y-5">
                    {[
                      "Train fathers and youth with IT certifications",
                      "Provide leadership and soft skills development",
                      "Graduates join our skilled workforce pool",
                    ].map((item, i) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.3 }}
                        className="flex items-start gap-4 text-white/80"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#C9A84C]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ChevronRight className="h-4 w-4 text-[#C9A84C]" />
                        </div>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Engine 2 */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="group"
            >
              <div className="relative bg-gradient-to-br from-[#2D2D2D] to-[#222222] rounded-3xl p-8 lg:p-10 border border-[#444444] hover:border-[#5A7247]/50 transition-all duration-500">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-[#5A7247]/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                <div className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5A7247] to-[#3D5030] flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <span className="text-[#7A9A63] text-sm font-semibold">Engine 2</span>
                      <h3 className="text-2xl font-bold text-white">IT Services</h3>
                    </div>
                  </div>

                  <ul className="space-y-5">
                    {[
                      "Deploy our workforce to serve nonprofits",
                      "Provide enterprise IT at nonprofit-friendly prices",
                      "Revenue funds more program cohorts",
                    ].map((item, i) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.4 }}
                        className="flex items-start gap-4 text-white/80"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#5A7247]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ChevronRight className="h-4 w-4 text-[#7A9A63]" />
                        </div>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Cycle indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C9A84C]/10 to-[#5A7247]/10 border border-[#444444]">
              <Handshake className="h-6 w-6 text-[#C9A84C]" />
              <span className="text-white font-semibold text-lg">The cycle sustains itself—and grows.</span>
              <Handshake className="h-6 w-6 text-[#5A7247]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-[#FAFAF8] to-white relative overflow-hidden">
        <GridPattern color="#C9A84C" opacity={0.02} size={60} className="absolute inset-0" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden relative shadow-2xl">
                <Image
                  src="/images/brand/founderpic.jpg"
                  alt="Thomas 'TJ' Wilform - Founder of Forever Forward"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent" />
              </div>

              {/* Quote card */}
              <motion.div
                initial={{ opacity: 0, x: 30, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-8 -right-8 lg:-right-12 max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-[#DDDDDD]"
              >
                <Quote className="h-8 w-8 text-[#C9A84C] mb-3" />
                <p className="text-[#1A1A1A] italic leading-relaxed">
                  &ldquo;I&apos;ve seen what happens when fathers get the right
                  tools. Everything changes—for them, their kids, their
                  community.&rdquo;
                </p>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-[#C9A84C]/10 blur-xl" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-[#5A7247]/10 blur-xl" />
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBF6E9] text-[#A68A2E] text-sm font-semibold mb-4">
                <Award className="h-4 w-4" />
                Meet Our Founder
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-8">
                Thomas &ldquo;TJ&rdquo; Wilform
              </h2>

              <div className="space-y-5 text-[#555555] leading-relaxed text-lg">
                <p>
                  TJ grew up in <span className="text-[#1A1A1A] font-semibold">Compton, California</span>—a community that
                  shaped his understanding of resilience, family, and the
                  transformative power of opportunity.
                </p>
                <p>
                  He built his tech career at Xeex Communication, deploying large-scale
                  data centers for enterprise clients. Everything changed when TJ became
                  a <span className="text-[#C9A84C] font-semibold">single father</span>.
                </p>
                <p>
                  Discovering that resources for fathers raising children alone were
                  nearly nonexistent, TJ was determined to be there for his child while
                  building a career that could provide.
                </p>
                <p>
                  In 2023, he founded Forever Forward to solve the problems he lived
                  through: fathers without pathways, communities without resources, and
                  nonprofits without enterprise IT.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-5 rounded-xl bg-gradient-to-r from-[#FBF6E9] to-[#F5EDD8] border border-[#E8D48B]"
              >
                <p className="text-[#555555]">
                  <span className="font-semibold text-[#1A1A1A]">Fun fact:</span>{" "}
                  TJ is also building CommonGround, an AI-powered co-parenting
                  app inspired by his own journey as a father.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFF4EB] text-[#5A7247] text-sm font-semibold mb-4">
              <Target className="h-4 w-4" />
              Our Goals
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
              The Impact We&apos;re Building
            </h2>
            <p className="text-xl text-[#555555] max-w-2xl mx-auto">
              Help us reach these milestones—every number represents real change.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {IMPACT_STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <StatCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-[#EFF4EB] via-[#F5F8F2] to-[#EFF4EB] relative overflow-hidden">
        <GridPattern color="#5A7247" opacity={0.03} size={40} className="absolute inset-0" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#5A7247] text-sm font-semibold mb-4 shadow-sm">
              <Rocket className="h-4 w-4" />
              Our Journey
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
              Key Milestones
            </h2>
            <p className="text-xl text-[#555555] max-w-2xl mx-auto">
              From vision to impact—the Forever Forward story continues.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C9A84C] via-[#C9A84C] to-[#5A7247] -translate-x-1/2" />

            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <TimelineEvent key={event.title} event={event} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRAVIS AI PREVIEW */}
      <section className="py-20 lg:py-32 bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute inset-0">
          <ParticleField particleCount={15} colors={["#C9A84C", "#5A7247"]} className="opacity-20" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-[#C9A84C] text-sm font-semibold mb-6">
                <MessageCircle className="h-4 w-4" />
                AI-Powered Support
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Meet Travis, Your AI Case Manager
              </h2>
              <p className="text-xl text-white/70 leading-relaxed mb-8">
                Travis provides 24/7 guidance to program participants. From answering
                questions about coursework to connecting people with resources, Travis
                is always there—kind, caring, and knowledgeable.
              </p>
              <Button asChild size="lg" className="group">
                <Link href="/about/travis">
                  Learn About Travis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            {/* Chat Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#C9A84C]/20 to-[#5A7247]/20 rounded-3xl blur-xl" />

                <div className="relative bg-gradient-to-br from-[#2D2D2D] to-[#222222] rounded-2xl p-6 border border-[#444444]">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#444444]">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] flex items-center justify-center">
                      <span className="text-[#1A1A1A] font-bold text-lg">T</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Travis</p>
                      <p className="text-sm text-white/50">AI Case Manager</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#7A9A63] animate-pulse" />
                      <span className="text-xs text-white/40">Online</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      className="flex justify-end"
                    >
                      <div className="bg-[#C9A84C] text-[#1A1A1A] rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%]">
                        Hey Travis, I&apos;m struggling with the networking module.
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 }}
                      className="flex"
                    >
                      <div className="bg-[#3D3D3D] text-white rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
                        I hear you—networking can feel overwhelming at first. Let
                        me pull up some resources that break it down step by step.
                        Would you prefer a video walkthrough or a hands-on lab?
                      </div>
                    </motion.div>
                  </div>

                  {/* Input area */}
                  <div className="mt-6 pt-4 border-t border-[#444444]">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#3D3D3D]">
                      <span className="text-white/40 text-sm">Ask Travis anything...</span>
                      <div className="ml-auto w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-[#1A1A1A]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[#FBF6E9] via-[#F5EDD8] to-[#FBF6E9] relative overflow-hidden">
        <GridPattern color="#C9A84C" opacity={0.05} size={30} className="absolute inset-0" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-6">
              Ready to Join the Movement?
            </h2>
            <p className="text-xl text-[#555555] mb-10 max-w-2xl mx-auto">
              Whether you want to enroll in a program, partner with us, or
              explore our IT services—we&apos;d love to connect.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="group">
                <Link href="/get-involved/enroll">
                  Enroll in a Program
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
