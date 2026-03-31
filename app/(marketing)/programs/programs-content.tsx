"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, GraduationCap, Users, Heart, Sparkles, Zap, Target, Trophy, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/components/marketing/program-card";
import { PROGRAMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { GradientMesh, ParticleField, FlowingLines } from "@/components/svg/backgrounds";
import { FloatingChevron, GradientOrb, GridPattern, WaveDivider } from "@/components/svg/decorative";
import { HeroChevronPattern, AnimatedUnderline, MomentumLines } from "@/components/svg/brand";

type AudienceFilter = "all" | "fathers" | "youth" | "families" | "kids" | "students";

const audienceFilters: { id: AudienceFilter; label: string; icon: typeof Users; color: string }[] = [
  { id: "all", label: "All Programs", icon: Sparkles, color: "#C9A84C" },
  { id: "fathers", label: "Fathers", icon: Users, color: "#C9A84C" },
  { id: "youth", label: "Youth", icon: GraduationCap, color: "#5A7247" },
  { id: "families", label: "Families", icon: Heart, color: "#f43f5e" },
  { id: "kids", label: "Kids", icon: Sparkles, color: "#0ea5e9" },
  { id: "students", label: "Students", icon: BookOpen, color: "#8b5cf6" },
];

// Stats for hero section
const heroStats = [
  { value: "6", label: "Programs", icon: BookOpen },
  { value: "500+", label: "Graduates", icon: GraduationCap },
  { value: "92%", label: "Completion Rate", icon: Target },
  { value: "100%", label: "Free to Participants", icon: Heart },
];

// Leadership skills
const leadershipSkills = [
  { name: "Communication", icon: "💬" },
  { name: "Problem Solving", icon: "🧩" },
  { name: "Teamwork", icon: "🤝" },
  { name: "Responsibility", icon: "✨" },
  { name: "Empathy", icon: "💛" },
  { name: "Critical Thinking", icon: "🧠" },
];

export function ProgramsContent() {
  const [activeFilter, setActiveFilter] = useState<AudienceFilter>("all");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const filterRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const heroRef = useRef<HTMLElement>(null);
  const leadershipRef = useRef<HTMLElement>(null);
  const isLeadershipInView = useInView(leadershipRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Update filter indicator position
  useEffect(() => {
    const activeIndex = audienceFilters.findIndex(f => f.id === activeFilter);
    const activeRef = filterRefs.current[activeIndex];
    if (activeRef) {
      setIndicatorStyle({
        left: activeRef.offsetLeft,
        width: activeRef.offsetWidth,
      });
    }
  }, [activeFilter]);

  const filteredPrograms = PROGRAMS.filter((program) => {
    if (activeFilter === "all") return true;
    return program.audience === activeFilter;
  });

  return (
    <>
      {/* Premium Hero Section */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center bg-[#1A1A1A] overflow-hidden">
        {/* Animated backgrounds */}
        <div className="absolute inset-0">
          <GradientMesh className="absolute inset-0 opacity-30" />
          <ParticleField className="absolute inset-0 opacity-50" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GradientOrb className="absolute top-20 -left-20 w-72 h-72 opacity-30" />
          <GradientOrb className="absolute bottom-20 -right-20 w-96 h-96 opacity-20" />

          {/* Floating chevrons */}
          <motion.div
            className="absolute top-1/4 left-10 opacity-20"
            animate={{ y: [-10, 10], rotate: [0, 5] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          >
            <FloatingChevron className="w-12 h-12" />
          </motion.div>
          <motion.div
            className="absolute bottom-1/3 right-20 opacity-15"
            animate={{ y: [10, -10], rotate: [0, -5] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          >
            <FloatingChevron className="w-16 h-16" />
          </motion.div>

          <HeroChevronPattern className="absolute top-0 right-0 w-full h-full opacity-10" />
          <MomentumLines className="absolute bottom-0 left-0 w-full h-64 opacity-20" />
        </div>

        {/* Grid pattern */}
        <GridPattern className="absolute inset-0 opacity-5" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-white/80 mb-8">
              <Zap className="h-4 w-4 text-[#C9A84C]" />
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Workforce Development & Enrichment
              </span>
            </span>
          </motion.div>

          {/* Headline with animated reveal */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block">Programs That</span>
            <span className="relative inline-block mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient">
                Transform Lives
              </span>
              <AnimatedUnderline className="absolute -bottom-2 left-0 w-full" />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            From IT certifications for fathers to creative workshops for kids,
            our programs are designed to empower every member of the family
            with real skills and lasting confidence.
          </motion.p>

          {/* Hero Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {heroStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-[#C9A84C]/30 transition-all duration-300">
                  <stat.icon className="h-5 w-5 text-[#C9A84C] mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-white/50">{stat.label}</div>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-[#C9A84C]/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity -z-10" />
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="flex flex-col items-center gap-2 text-white/40"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xs uppercase tracking-widest">Explore</span>
              <ArrowRight className="h-4 w-4 rotate-90" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAF8] to-transparent" />
      </section>

      {/* Filter Tabs with Sliding Indicator */}
      <section className="py-6 bg-[#FAFAF8] border-b border-[#DDDDDD] sticky top-16 lg:top-20 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            {/* Sliding indicator */}
            <motion.div
              className="absolute top-0 h-10 bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] rounded-lg -z-10"
              animate={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />

            {audienceFilters.map((filter, i) => (
              <button
                key={filter.id}
                ref={el => { filterRefs.current[i] = el }}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-300",
                  activeFilter === filter.id
                    ? "text-[#1A1A1A]"
                    : "text-[#555555] hover:text-[#1A1A1A] hover:bg-white/50"
                )}
              >
                <filter.icon className="h-4 w-4" />
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(#1A1A1A 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#555555]">
              {activeFilter === "all"
                ? "Showing all 6 programs"
                : `Showing ${filteredPrograms.length} program${filteredPrograms.length !== 1 ? 's' : ''} for ${activeFilter}`}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program, index) => (
                  <ProgramCard
                    key={program.slug}
                    name={program.name}
                    slug={program.slug}
                    tagline={program.tagline}
                    description={program.description}
                    audience={program.audience}
                    icon={program.icon}
                    index={index}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5F3EF] flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-[#888888]" />
                  </div>
                  <p className="text-[#888888] text-lg">
                    No programs match this filter.
                  </p>
                  <button
                    onClick={() => setActiveFilter("all")}
                    className="mt-4 text-[#C9A84C] font-semibold hover:underline"
                  >
                    View all programs
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Wave divider */}
      <WaveDivider className="text-[#1A1A1A] -mb-1" />

      {/* Leadership Thread Callout */}
      <section ref={leadershipRef} className="py-20 lg:py-32 bg-[#1A1A1A] relative overflow-hidden">
        {/* Background elements */}
        <FlowingLines className="absolute inset-0 opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 via-transparent to-[#5A7247]/5" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Training Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isLeadershipInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                <Image
                  src="/images/generated/programs-training.png"
                  alt="Black fathers learning IT skills together in a supportive training environment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 via-transparent to-transparent" />
              </div>

              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={isLeadershipInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-6 -right-6 lg:-right-8"
              >
                <div className="bg-white rounded-2xl p-5 shadow-2xl border border-[#DDDDDD]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#E8D48B] flex items-center justify-center">
                      <Trophy className="h-7 w-7 text-[#1A1A1A]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#1A1A1A]">50+</p>
                      <p className="text-sm text-[#888888]">Graduates in 2025</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Second floating card */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={isLeadershipInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -top-4 -left-4 lg:-left-8"
              >
                <div className="bg-[#5A7247] rounded-xl px-4 py-2 shadow-lg">
                  <p className="text-white font-semibold text-sm">100% Free</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isLeadershipInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-sm font-semibold mb-6">
                <Sparkles className="h-4 w-4" />
                The Leadership Thread
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Every Program
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
                  {" "}Builds Leaders
                </span>
              </h2>

              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Whether it&apos;s a father learning IT skills or a child creating their
                first story, every Forever Forward program weaves in leadership
                development. We believe everyone has the potential to lead—in their
                families, workplaces, and communities.
              </p>

              {/* Leadership skills grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {leadershipSkills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isLeadershipInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#C9A84C]/30 hover:bg-white/10 transition-all group cursor-default"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">{skill.icon}</span>
                    <span className="text-white/80 text-sm font-medium">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Travis AI Support */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[#EFF4EB] via-[#FAFAF8] to-[#FBF6E9] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#5A7247 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5A7247]/10 text-[#5A7247] text-sm font-semibold mb-6">
                <Zap className="h-4 w-4" />
                AI-Powered Support
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight mb-6">
                Meet Travis,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5A7247] to-[#7A9A63]">
                  {" "}Your 24/7 Case Manager
                </span>
              </h2>

              <p className="text-[#555555] text-lg leading-relaxed mb-8">
                Every participant in our workforce programs gets access to
                Travis—an AI assistant that provides study help, answers
                questions, connects you with resources, and offers encouragement
                whenever you need it.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="group">
                  <Link href="/about/travis">
                    Learn About Travis
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/get-involved/enroll">
                    Enroll Now
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Enhanced Travis Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-[#DDDDDD] overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-[#DDDDDD] bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D]">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E8D48B] flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-[#1A1A1A] font-bold text-lg">T</span>
                  </motion.div>
                  <div>
                    <p className="font-semibold text-white">Travis</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <p className="text-xs text-white/60">AI Case Manager • Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="p-6 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-[#F5F3EF] to-[#EFF4EB] rounded-2xl rounded-tl-none px-5 py-4 max-w-[85%]"
                  >
                    <p className="text-[#555555] text-sm leading-relaxed">
                      Great progress on your subnetting practice! You&apos;ve
                      completed <span className="font-semibold text-[#5A7247]">80%</span> of this week&apos;s labs.
                      Ready for the final challenge? 🎯
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-end"
                  >
                    <div className="bg-[#1A1A1A] rounded-2xl rounded-tr-none px-5 py-4 max-w-[85%]">
                      <p className="text-white/90 text-sm">
                        Yes! Let&apos;s do it. I want to ace this certification.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-r from-[#F5F3EF] to-[#EFF4EB] rounded-2xl rounded-tl-none px-5 py-4 max-w-[85%]"
                  >
                    <p className="text-[#555555] text-sm leading-relaxed">
                      That&apos;s the spirit! I&apos;ve prepared a practice exam with
                      <span className="font-semibold text-[#C9A84C]"> 50 questions</span> covering
                      network fundamentals. You&apos;ve got this, King! 👑
                    </p>
                  </motion.div>
                </div>

                {/* Input area */}
                <div className="px-6 pb-6">
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#F5F3EF] rounded-xl">
                    <input
                      type="text"
                      placeholder="Ask Travis anything..."
                      className="flex-1 bg-transparent text-sm text-[#555555] placeholder:text-[#888888] outline-none"
                      disabled
                    />
                    <button className="p-2 rounded-lg bg-[#C9A84C] text-[#1A1A1A]">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4"
                animate={{ y: [-5, 5] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <div className="px-4 py-2 rounded-full bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold shadow-lg">
                  24/7 Available
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-[#FBF6E9] to-[#FAFAF8] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <GradientOrb className="absolute -top-32 -left-32 w-96 h-96 opacity-20" />
          <GradientOrb className="absolute -bottom-32 -right-32 w-80 h-80 opacity-15" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-sm font-semibold mb-6">
              <Target className="h-4 w-4" />
              Start Your Journey
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-6">
              Ready to Transform
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#5A7247]">
                {" "}Your Future?
              </span>
            </h2>

            <p className="text-lg text-[#555555] max-w-2xl mx-auto mb-10">
              Take the first step toward transforming your future. All programs are
              <span className="font-semibold text-[#5A7247]"> 100% free</span> for participants.
              Applications are open now.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="group px-8">
                <Link href="/get-involved/enroll">
                  Apply Now
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/contact">
                  Have Questions? Contact Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
