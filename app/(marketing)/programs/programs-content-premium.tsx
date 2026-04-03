"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Users,
  Heart,
  Sparkles,
  Zap,
  Target,
  Trophy,
  BookOpen,
  Clock,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROGRAMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type AudienceFilter = "all" | "fathers" | "youth" | "families" | "kids" | "students";

const audienceFilters: { id: AudienceFilter; label: string; icon: typeof Users }[] = [
  { id: "all", label: "All Programs", icon: Sparkles },
  { id: "fathers", label: "Fathers", icon: Users },
  { id: "youth", label: "Youth", icon: GraduationCap },
  { id: "families", label: "Families", icon: Heart },
  { id: "kids", label: "Kids", icon: Sparkles },
  { id: "students", label: "Students", icon: BookOpen },
];

// Leadership skills
const leadershipSkills = [
  { name: "Communication", description: "Express ideas clearly and listen actively" },
  { name: "Problem Solving", description: "Analyze challenges and find solutions" },
  { name: "Teamwork", description: "Collaborate effectively with others" },
  { name: "Responsibility", description: "Own your actions and commitments" },
  { name: "Critical Thinking", description: "Evaluate information and make decisions" },
  { name: "Empathy", description: "Understand and connect with others" },
];

// Program images mapping (using authentic images)
const programImages: Record<string, string> = {
  "father-forward": "/images/authentic/fathers/father-teaching-daughter.jpg",
  "tech-ready-youth": "/images/authentic/tech/it-professional-server-room.jpg",
  "making-moments": "/images/authentic/family/family-outdoor-portrait.jpg",
  "from-script-to-screen": "/images/authentic/family/father-daughter-creativity.jpg",
  "stories-from-my-future": "/images/authentic/fathers/father-focused-professional.jpg",
  "lula": "/images/authentic/fathers/father-son-outdoor-portrait.jpg",
};

// Get color for audience type
const audienceColors: Record<string, { bg: string; text: string; border: string }> = {
  fathers: { bg: "bg-[#C9A84C]/10", text: "text-[#C9A84C]", border: "border-[#C9A84C]/30" },
  youth: { bg: "bg-[#5A7247]/10", text: "text-[#5A7247]", border: "border-[#5A7247]/30" },
  families: { bg: "bg-rose-500/10", text: "text-rose-600", border: "border-rose-500/30" },
  kids: { bg: "bg-sky-500/10", text: "text-sky-600", border: "border-sky-500/30" },
  students: { bg: "bg-violet-500/10", text: "text-violet-600", border: "border-violet-500/30" },
};

export function ProgramsContentPremium() {
  const [activeFilter, setActiveFilter] = useState<AudienceFilter>("all");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const filterRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const heroRef = useRef<HTMLElement>(null);
  const leadershipRef = useRef<HTMLElement>(null);
  const isLeadershipInView = useInView(leadershipRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  // Update filter indicator position
  useEffect(() => {
    const activeIndex = audienceFilters.findIndex((f) => f.id === activeFilter);
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

  // Featured program is always Father Forward
  const featuredProgram = PROGRAMS.find((p) => p.slug === "father-forward");
  const otherPrograms = filteredPrograms.filter((p) => p.slug !== "father-forward");

  return (
    <>
      {/* Hero Section - Split Screen */}
      <section ref={heroRef} className="relative min-h-[90vh] bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 grid lg:grid-cols-2">
          {/* Left side - Content */}
          <motion.div
            style={{ y: heroContentY }}
            className="relative z-10 flex items-center px-6 sm:px-12 lg:px-16 xl:px-24 pt-32 pb-20 lg:py-0"
          >
            <div className="max-w-xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-white/80">
                  <Sparkles className="h-4 w-4 text-[#C9A84C]" />
                  6 Transformative Programs
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6"
              >
                Programs That
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C]">
                  Transform Lives
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg sm:text-xl text-white/60 leading-relaxed mb-10"
              >
                From IT certifications for fathers to creative workshops for kids,
                our programs are designed to empower every member of the family
                with real skills and lasting confidence.
              </motion.p>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-8 mb-10"
              >
                {[
                  { value: "500+", label: "Graduates" },
                  { value: "92%", label: "Completion" },
                  { value: "100%", label: "Free" },
                ].map((stat, i) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/50">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Button asChild size="lg" className="group">
                  <Link href="/get-involved/enroll">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    document.getElementById("programs-grid")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore Programs
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Image */}
          <motion.div
            style={{ y: heroImageY }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0">
              <Image
                src="/images/authentic/fathers/father-teaching-daughter.jpg"
                alt="Father teaching daughter technology skills"
                fill
                className="object-cover"
                priority
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 via-transparent to-[#1A1A1A]/20" />
            </div>

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-24 left-8 bg-white rounded-2xl p-5 shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#E8D48B] flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-[#1A1A1A]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A1A1A]">50+</p>
                  <p className="text-sm text-[#888888]">Graduates in 2025</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute top-32 right-8 bg-[#5A7247] rounded-xl px-5 py-3 shadow-lg"
            >
              <p className="text-white font-semibold">100% Free</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile hero image overlay */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="/images/authentic/fathers/father-teaching-daughter.jpg"
            alt="Father teaching daughter technology skills"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/80 to-[#1A1A1A]" />
        </div>
      </section>

      {/* Filter Tabs - Sticky */}
      <section
        id="programs-grid"
        className="py-6 bg-white border-b border-[#DDDDDD] sticky top-16 lg:top-20 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center gap-1 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
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
                ref={(el) => {
                  filterRefs.current[i] = el;
                }}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-300",
                  activeFilter === filter.id
                    ? "text-[#1A1A1A]"
                    : "text-[#555555] hover:text-[#1A1A1A] hover:bg-[#F5F3EF]"
                )}
              >
                <filter.icon className="h-4 w-4" />
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid - Featured + Masonry */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#888888] mb-8"
          >
            {activeFilter === "all"
              ? "Showing all 6 programs"
              : `Showing ${filteredPrograms.length} program${filteredPrograms.length !== 1 ? "s" : ""} for ${activeFilter}`}
          </motion.p>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {filteredPrograms.length > 0 ? (
                <div className="space-y-8">
                  {/* Featured Program - Father Forward */}
                  {(activeFilter === "all" || activeFilter === "fathers") && featuredProgram && (
                    <Link href={`/programs/${featuredProgram.slug}`} className="group block">
                      <div className="relative rounded-3xl overflow-hidden bg-[#1A1A1A]">
                        <div className="grid lg:grid-cols-2">
                          {/* Image side */}
                          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
                            <Image
                              src={programImages[featuredProgram.slug]}
                              alt={featuredProgram.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1A1A1A] hidden lg:block" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent lg:hidden" />
                          </div>

                          {/* Content side */}
                          <div className="relative p-8 lg:p-12 flex flex-col justify-center">
                            {/* Featured badge */}
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] text-xs font-semibold w-fit mb-6">
                              <Trophy className="h-3 w-3" />
                              FLAGSHIP PROGRAM
                            </span>

                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-[#C9A84C] transition-colors">
                              {featuredProgram.name}
                            </h2>

                            <p className="text-lg text-white/60 mb-6 leading-relaxed">
                              {featuredProgram.description}
                            </p>

                            {/* Program details */}
                            <div className="flex flex-wrap gap-4 mb-8">
                              <div className="flex items-center gap-2 text-white/50 text-sm">
                                <Clock className="h-4 w-4" />
                                8 Weeks
                              </div>
                              <div className="flex items-center gap-2 text-white/50 text-sm">
                                <Users className="h-4 w-4" />
                                Fathers
                              </div>
                              <div className="flex items-center gap-2 text-white/50 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-[#5A7247]" />
                                Google IT Cert Prep
                              </div>
                            </div>

                            <div className="flex items-center text-[#C9A84C] font-semibold group-hover:gap-3 gap-2 transition-all">
                              Learn More
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* Other Programs - Masonry Grid */}
                  {otherPrograms.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {otherPrograms.map((program, index) => {
                        const colors = audienceColors[program.audience] || audienceColors.fathers;
                        return (
                          <motion.div
                            key={program.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Link href={`/programs/${program.slug}`} className="group block h-full">
                              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-[#DDDDDD] hover:border-[#C9A84C]/30 transition-all duration-300 h-full flex flex-col">
                                {/* Image */}
                                <div className="relative aspect-[16/10] overflow-hidden">
                                  <Image
                                    src={programImages[program.slug] || "/images/authentic/fathers/father-teaching-daughter.jpg"}
                                    alt={program.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                                  {/* Audience badge */}
                                  <span
                                    className={cn(
                                      "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm",
                                      colors.bg,
                                      colors.text,
                                      "border",
                                      colors.border
                                    )}
                                  >
                                    {program.audience.charAt(0).toUpperCase() + program.audience.slice(1)}
                                  </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#C9A84C] transition-colors">
                                    {program.name}
                                  </h3>

                                  <p className="text-[#555555] text-sm leading-relaxed mb-4 flex-grow">
                                    {program.tagline}
                                  </p>

                                  <div className="flex items-center justify-between pt-4 border-t border-[#DDDDDD]">
                                    <span className="text-xs text-[#888888]">
                                      {program.audience === "families" ? "Ongoing Events" : "8 Weeks"}
                                    </span>
                                    <span className="flex items-center text-sm font-semibold text-[#C9A84C] group-hover:gap-2 gap-1 transition-all">
                                      Details
                                      <ArrowRight className="h-3 w-3" />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Empty state */
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#F5F3EF] flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-[#888888]" />
                  </div>
                  <p className="text-[#888888] text-xl mb-4">No programs match this filter.</p>
                  <button
                    onClick={() => setActiveFilter("all")}
                    className="text-[#C9A84C] font-semibold hover:underline"
                  >
                    View all programs
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Leadership Thread Section */}
      <section ref={leadershipRef} className="py-24 lg:py-32 bg-[#1A1A1A] relative overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image side */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isLeadershipInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden">
                <Image
                  src="/images/authentic/fathers/father-focused-professional.jpg"
                  alt="Father in professional setting"
                  width={600}
                  height={500}
                  className="object-cover w-full"
                />
                {/* Gold accent frame */}
                <div className="absolute inset-0 border-2 border-[#C9A84C]/30 rounded-3xl" />
              </div>

              {/* Floating quote card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isLeadershipInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-8 -right-8 lg:-right-12 max-w-[280px]"
              >
                <div className="bg-white rounded-2xl p-6 shadow-2xl">
                  <div className="text-[#C9A84C] text-4xl font-serif mb-2">&ldquo;</div>
                  <p className="text-[#1A1A1A] font-medium text-sm leading-relaxed">
                    Leadership isn&apos;t a title—it&apos;s a choice you make every day.
                  </p>
                  <p className="text-[#888888] text-xs mt-3">— TJ Wilform, Founder</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Content side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isLeadershipInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-sm font-semibold mb-6">
                <Target className="h-4 w-4" />
                The Leadership Thread
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Every Program
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
                  {" "}
                  Builds Leaders
                </span>
              </h2>

              <p className="text-white/60 text-lg leading-relaxed mb-10">
                Whether it&apos;s a father learning IT skills or a child creating their first story,
                every Forever Forward program weaves in leadership development. We believe everyone
                has the potential to lead—in their families, workplaces, and communities.
              </p>

              {/* Skills grid */}
              <div className="grid grid-cols-2 gap-4">
                {leadershipSkills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isLeadershipInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#C9A84C]/30 hover:bg-white/10 transition-all cursor-default"
                  >
                    <h4 className="text-white font-semibold mb-1">{skill.name}</h4>
                    <p className="text-white/40 text-xs leading-relaxed">{skill.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Travis AI Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-[#EFF4EB] via-[#FAFAF8] to-[#FBF6E9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
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
                  {" "}
                  Your 24/7 Mentor
                </span>
              </h2>

              <p className="text-[#555555] text-lg leading-relaxed mb-8">
                Every workforce program participant gets access to Travis—an AI assistant that
                provides study help, answers questions, connects you with resources, and offers
                encouragement whenever you need it.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  "Personalized study recommendations",
                  "Practice exams and instant feedback",
                  "Resource connection for life challenges",
                  "Progress tracking and encouragement",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#5A7247]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-[#5A7247]" />
                    </div>
                    <span className="text-[#555555]">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="group">
                  <Link href="/about/travis">
                    Learn About Travis
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/get-involved/enroll">Enroll Now</Link>
                </Button>
              </div>
            </motion.div>

            {/* Travis Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-2xl border border-[#DDDDDD] overflow-hidden">
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

                {/* Chat */}
                <div className="p-6 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#F5F3EF] rounded-2xl rounded-tl-none px-5 py-4 max-w-[85%]"
                  >
                    <p className="text-[#555555] text-sm leading-relaxed">
                      Great progress on your subnetting practice! You&apos;ve completed{" "}
                      <span className="font-semibold text-[#5A7247]">80%</span> of this week&apos;s labs.
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
                      <p className="text-white/90 text-sm">I want to ace this certification!</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="bg-[#F5F3EF] rounded-2xl rounded-tl-none px-5 py-4 max-w-[85%]"
                  >
                    <p className="text-[#555555] text-sm leading-relaxed">
                      That&apos;s the spirit! I&apos;ve got{" "}
                      <span className="font-semibold text-[#C9A84C]">50 practice questions</span>{" "}
                      ready. You&apos;ve got this, King! 👑
                    </p>
                  </motion.div>
                </div>

                {/* Input */}
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

              {/* Floating badge */}
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
      <section className="py-24 lg:py-32 bg-[#1A1A1A] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
                {" "}
                Your Future?
              </span>
            </h2>

            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
              Take the first step. All programs are{" "}
              <span className="font-semibold text-[#5A7247]">100% free</span> for participants.
              Applications are open now.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="group px-8">
                <Link href="/get-involved/enroll">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 border-white/20 text-white hover:bg-white/10"
              >
                <Link href="/contact">Have Questions? Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
