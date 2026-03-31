"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Heart,
  Users,
  Handshake,
  Server,
  Code,
  Cable,
  ArrowRight,
  Calendar,
  Film,
  CheckCircle,
  GraduationCap,
  ChevronDown,
  Quote,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProgramCard } from "@/components/marketing/program-card";
import { StatCounter } from "@/components/marketing/stat-counter";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { BlogPreviewCard } from "@/components/marketing/blog-preview-card";
import { PROGRAMS, IMPACT_STATS } from "@/lib/constants";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

// Animation system imports
import {
  motion as m,
  heroTitle,
  heroSubtitle,
  heroCTA,
  staggerContainer,
  fadeInUp,
  scaleIn,
  useParallax,
  useAnimatedCounter,
  useScrollReveal,
} from "@/lib/animations";

// SVG component imports
import {
  GradientMesh,
  ParticleField,
  ParallaxGradient,
  AuroraBackground,
} from "@/components/svg/backgrounds";
import {
  FloatingChevron,
  DoubleChevron,
  GradientOrb,
  GridPattern,
  DotPattern,
  ScrollIndicator,
  WaveDivider,
} from "@/components/svg/decorative";
import {
  AnimatedLogoMark,
  BrandBadge,
  HeroChevronPattern,
  MomentumLines,
  ChevronDivider,
} from "@/components/svg/brand";
import {
  ManagedITIcon,
  SoftwareDevIcon,
  CablingIcon,
} from "@/components/svg/icons";

// Placeholder blog posts
const BLOG_POSTS = [
  {
    title: "5 Ways Tech Skills Are Transforming Fatherhood",
    excerpt:
      "Discover how dads are using technology to stay connected, create memories, and build stronger bonds with their children.",
    category: "Fatherhood",
    date: "Mar 15, 2024",
    readTime: "5 min read",
    slug: "tech-skills-transforming-fatherhood",
    image: "/images/generated/blog-present-father.png",
  },
  {
    title: "From the Shop Floor to the Server Room: Marcus's Story",
    excerpt:
      "How one Father Forward graduate went from manufacturing to managing IT infrastructure for local schools.",
    category: "Success Stories",
    date: "Mar 10, 2024",
    readTime: "7 min read",
    slug: "marcus-success-story",
    image: "/images/generated/blog-south-la-tech.png",
  },
  {
    title: "Why Nonprofits Need Managed IT Services in 2024",
    excerpt:
      "Security threats are evolving. Here's how nonprofit organizations can protect their data and community trust.",
    category: "IT for Nonprofits",
    date: "Mar 5, 2024",
    readTime: "6 min read",
    slug: "nonprofits-managed-it-2024",
    image: "/images/generated/blog-nonprofit-it.png",
  },
];

// Testimonials - Black men in their 30s
const TESTIMONIALS = [
  {
    quote:
      "Man, this program changed everything. Got my Google cert, landed a help desk gig, and now I can actually provide for my kids the right way.",
    name: "Marcus Thompson",
    role: "Father Forward Graduate '23",
  },
  {
    quote:
      "I was out here hustling with no direction. TJ and the team showed me a whole different path. Now my daughter tells everyone her dad works in tech.",
    name: "Darnell Washington",
    role: "Father Forward Graduate '24",
  },
  {
    quote:
      "Real talk—I almost gave up. But these folks believed in me when I didn't believe in myself. Got my certification, got the job. My son sees a different future now.",
    name: "Jerome Mitchell",
    role: "Father Forward Graduate '23",
  },
];

export function HomeContent() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Parallax refs
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    const result = await subscribeToNewsletter(email, "homepage");

    if (result.success) {
      setIsSubscribed(true);
    } else {
      console.error("Failed to subscribe:", result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      {/* ============================================
          SECTION 1: HERO - COMPLETELY ELEVATED
          ============================================ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-[#1A1A1A] overflow-hidden"
      >
        {/* Premium Animated Background */}
        <div className="absolute inset-0">
          {/* Aurora gradient effect */}
          <AuroraBackground className="opacity-60" />

          {/* Animated gradient mesh */}
          <GradientMesh variant="hero" />

          {/* Grid pattern overlay */}
          <GridPattern color="#C9A84C" opacity={0.03} size={60} />

          {/* Floating particles */}
          <ParticleField
            particleCount={25}
            colors={["#C9A84C", "#5A7247", "#FFFFFF"]}
          />

          {/* Floating chevrons */}
          <HeroChevronPattern />

          {/* Momentum lines */}
          <MomentumLines className="opacity-30" />
        </div>

        {/* Decorative floating orbs */}
        <GradientOrb
          className="top-20 right-10 lg:right-40"
          size={300}
          colors={["#C9A84C", "#5A7247"]}
          blur={80}
          delay={0}
        />
        <GradientOrb
          className="bottom-40 left-10 lg:left-20"
          size={250}
          colors={["#5A7247", "#C9A84C"]}
          blur={60}
          delay={2}
        />

        {/* Floating decorative chevrons */}
        <FloatingChevron
          className="absolute top-32 left-[10%] hidden lg:block"
          color="gold"
          size="lg"
          delay={0.5}
        />
        <FloatingChevron
          className="absolute top-[60%] right-[15%] hidden lg:block"
          color="olive"
          size="md"
          delay={1.2}
        />
        <FloatingChevron
          className="absolute bottom-40 left-[20%] hidden lg:block"
          color="gold"
          size="sm"
          delay={0.8}
        />
        <DoubleChevron
          className="absolute top-[40%] right-[8%] hidden xl:block"
          size={80}
          delay={1.5}
        />

        {/* Main Content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#2D2D2D] to-[#1A1A1A] border border-[#C9A84C]/30 shadow-lg shadow-[#C9A84C]/10">
                <motion.span
                  className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-white/90">
                  501(c)(3) Nonprofit
                </span>
                <span className="w-px h-4 bg-white/20" />
                <span className="text-sm text-[#C9A84C]">
                  Los Angeles & Inland Empire
                </span>
              </div>
            </motion.div>

            {/* Hero Headline - Dramatic reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] mb-8 tracking-tight"
            >
              <span className="block">From Compton</span>
              <span className="block">
                to the{" "}
                <span className="text-gradient-gold inline-block">Cloud.</span>
              </span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="block text-3xl sm:text-4xl lg:text-5xl font-semibold text-white/60 mt-4"
              >
                Building Tomorrow&apos;s Tech Leaders Today.
              </motion.span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto mb-12 leading-relaxed"
            >
              Workforce development for{" "}
              <span className="text-white font-medium">Black fathers and youth</span>
              {" "}+ enterprise IT services for{" "}
              <span className="text-white font-medium">nonprofits and schools</span>
              —a self-sustaining cycle of empowerment.
            </motion.p>

            {/* CTA Buttons - Premium styling */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            >
              <Button
                asChild
                size="xl"
                className="min-w-[220px] relative overflow-hidden group btn-shine"
              >
                <Link href="/programs">
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Programs
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="xl"
                className="min-w-[220px] border-2"
              >
                <Link href="/services">
                  <span className="flex items-center gap-2">
                    IT Services
                    <Server className="h-5 w-5 opacity-70" />
                  </span>
                </Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/50 text-sm"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#C9A84C]" />
                <span>Google IT Certified</span>
              </div>
              <div className="w-px h-4 bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#5A7247]" />
                <span>92% Job Placement</span>
              </div>
              <div className="w-px h-4 bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#C9A84C]" />
                <span>50+ Graduates</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ScrollIndicator color="#C9A84C" />
        </motion.div>

        {/* Premium gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
      </section>

      {/* Wave divider transition */}
      <WaveDivider color="#FAFAF8" className="-mt-1" />

      {/* ============================================
          SECTION 2: IMPACT GOALS - ELEVATED
          ============================================ */}
      <section className="py-24 lg:py-32 bg-[#FAFAF8] relative overflow-hidden">
        {/* Background decoration */}
        <ParallaxGradient />
        <DotPattern color="#C9A84C" opacity={0.08} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 text-[#A68A2E] text-sm font-semibold uppercase tracking-wider mb-4"
            >
              <Sparkles className="h-4 w-4" />
              Our Vision
            </motion.span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mt-4">
              What We&apos;re{" "}
              <span className="text-gradient-brand">Building Toward</span>
            </h2>
            <p className="text-[#555555] text-lg mt-6 max-w-2xl mx-auto">
              These are our goals—the impact we&apos;re working to achieve together.
              Help us reach them.
            </p>
          </motion.div>

          {/* Stats grid with enhanced cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {IMPACT_STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group"
              >
                <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-[#DDDDDD] hover:shadow-xl hover:border-[#C9A84C] transition-all duration-300 card-hover-lift overflow-hidden">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#C9A84C]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

                  <StatCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: WHO WE ARE - ELEVATED
          ============================================ */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial-gold opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Hero Image - Enhanced with effects */}
            <motion.div
              initial={{ opacity: 0, x: -60, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative order-2 lg:order-1"
            >
              {/* Main image container with premium styling */}
              <div className="relative">
                {/* Decorative frame */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[#C9A84C]/20 via-transparent to-[#5A7247]/20 rounded-3xl blur-xl" />

                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C9A84C]/20">
                  <Image
                    src="/images/generated/hero-father-tech.png"
                    alt="Black father working confidently in a modern tech environment"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/30 via-transparent to-transparent" />
                </div>

                {/* Floating stats card - enhanced */}
                <motion.div
                  initial={{ opacity: 0, y: 30, x: 30 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-5 shadow-2xl border border-[#DDDDDD] glass-strong"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FBF6E9] to-[#E8D48B]/30 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <GraduationCap className="h-7 w-7 text-[#C9A84C]" />
                    </motion.div>
                    <div>
                      <p className="text-base font-bold text-[#1A1A1A]">
                        Google IT Certified
                      </p>
                      <p className="text-sm text-[#888888]">
                        Industry-recognized skills
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Secondary floating element */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -top-6 -left-6 bg-[#1A1A1A] rounded-xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#C9A84C] flex items-center justify-center">
                      <span className="text-[#1A1A1A] font-bold text-lg">FF</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Since 2023</p>
                      <p className="text-xs text-white/60">Los Angeles, CA</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Content - Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 lg:order-2"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9A84C] uppercase tracking-wider"
              >
                <AnimatedLogoMark size={24} animate={false} />
                Who We Are
              </motion.span>

              <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mt-4 mb-8 leading-tight">
                A Dual-Engine Model for{" "}
                <span className="relative">
                  Sustainable
                  <motion.span
                    className="absolute -bottom-2 left-0 h-1 bg-[#C9A84C] rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  />
                </span>{" "}
                Impact
              </h2>

              <div className="space-y-6 text-lg text-[#555555] leading-relaxed">
                <p>
                  Forever Forward operates with a unique approach:{" "}
                  <span className="text-[#1A1A1A] font-medium">
                    we train Black fathers and youth
                  </span>{" "}
                  with in-demand tech skills, then deploy them to serve nonprofit
                  organizations and schools with enterprise IT services.
                </p>
                <p>
                  The revenue from our IT services funds our programs—creating a{" "}
                  <span className="text-[#C9A84C] font-semibold">
                    self-sustaining cycle of empowerment
                  </span>
                  .
                </p>
              </div>

              {/* Founder callout */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-6 rounded-xl bg-gradient-to-br from-[#FBF6E9] to-[#EFF4EB] border-l-4 border-[#C9A84C]"
              >
                <p className="text-[#1A1A1A] italic">
                  &ldquo;Founded by Thomas &apos;TJ&apos; Wilform—a Compton native, former
                  enterprise data center engineer, and single father who knows
                  firsthand how hard it is to find resources when you&apos;re a dad
                  going it alone.&rdquo;
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-10"
              >
                <Button asChild size="lg" variant="outline" className="group">
                  <Link href="/about">
                    Read Our Full Story
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chevron divider */}
      <ChevronDivider className="py-8 bg-white" />

      {/* ============================================
          SECTION 4: PROGRAMS GRID - ELEVATED
          ============================================ */}
      <section className="py-24 lg:py-32 bg-[#EFF4EB] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <GridPattern color="#5A7247" opacity={0.05} size={80} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5A7247]/10 text-[#3D5030] text-sm font-semibold uppercase tracking-wider mb-4">
              <GraduationCap className="h-4 w-4" />
              Our Programs
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mt-4">
              Every Program Builds{" "}
              <span className="text-[#5A7247]">Leaders</span>
            </h2>
            <p className="text-[#555555] text-lg mt-6 max-w-2xl mx-auto">
              From workforce development to family enrichment, our programs uplift
              every member of the community.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROGRAMS.map((program, index) => (
              <motion.div
                key={program.slug}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ProgramCard
                  name={program.name}
                  slug={program.slug}
                  tagline={program.tagline}
                  description={program.description}
                  audience={program.audience}
                  icon={program.icon}
                  index={index}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <Button asChild size="lg" className="group">
              <Link href="/programs">
                View All Programs
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Wave divider */}
      <WaveDivider color="#1A1A1A" flip className="-mb-1" />

      {/* ============================================
          SECTION 5: IT SERVICES CALLOUT - ELEVATED
          ============================================ */}
      <section className="py-24 lg:py-32 bg-[#1A1A1A] relative overflow-hidden">
        {/* Premium animated background */}
        <GradientMesh variant="section" />

        {/* Decorative elements */}
        <GradientOrb
          className="top-0 right-0"
          size={500}
          colors={["#C9A84C", "transparent"]}
          blur={100}
        />
        <GradientOrb
          className="bottom-0 left-0"
          size={400}
          colors={["#5A7247", "transparent"]}
          blur={80}
          delay={2}
        />

        {/* Floating chevrons */}
        <FloatingChevron
          className="absolute top-20 left-[5%] hidden lg:block"
          color="gold"
          size="md"
          delay={0.3}
        />
        <FloatingChevron
          className="absolute bottom-32 right-[10%] hidden lg:block"
          color="olive"
          size="lg"
          delay={0.8}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C] text-sm font-semibold uppercase tracking-wider mb-4">
              <Server className="h-4 w-4" />
              IT Services
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
              Enterprise IT.{" "}
              <span className="text-gradient-gold">Nonprofit Heart.</span>
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Corporate-level IT infrastructure for nonprofits and schools across
              Los Angeles and the Inland Empire—at prices that respect your mission.
              Our technicians are program graduates who understand community service.
            </p>
          </motion.div>

          {/* Services grid - Enhanced cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                Icon: ManagedITIcon,
                title: "Managed IT",
                desc: "24/7 monitoring, help desk, security updates, and strategic planning.",
                price: "$50-$85/user/month",
              },
              {
                Icon: SoftwareDevIcon,
                title: "Software & AI",
                desc: "Custom web apps, automation tools, and AI solutions built for nonprofits.",
                price: "$1,500-$10,000",
              },
              {
                Icon: CablingIcon,
                title: "Low Voltage",
                desc: "Structured cabling, CCTV, network infrastructure—professionally installed.",
                price: "Custom quotes",
              },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group"
              >
                <div className="relative h-full bg-gradient-to-b from-[#2D2D2D] to-[#1A1A1A] rounded-2xl p-8 border border-[#444444] hover:border-[#C9A84C] transition-all duration-300 overflow-hidden">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/0 via-[#C9A84C]/5 to-[#C9A84C]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon */}
                  <motion.div
                    className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 flex items-center justify-center mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <service.Icon size={32} color="#C9A84C" animate />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-3 relative">
                    {service.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed mb-4 relative">
                    {service.desc}
                  </p>
                  <p className="text-[#C9A84C] font-semibold text-sm relative">
                    {service.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <Button asChild size="xl" className="group btn-glow">
              <Link href="/services/free-assessment">
                Get a Free IT Assessment
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 6: COMMUNITY EVENTS - ELEVATED
          ============================================ */}
      <section className="py-24 lg:py-32 bg-[#FAFAF8] relative overflow-hidden">
        <ParallaxGradient />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Event Photo - Enhanced */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative">
                {/* Decorative frame */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[#5A7247]/20 via-transparent to-[#C9A84C]/20 rounded-3xl blur-xl" />

                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/generated/movies-on-menu.png"
                    alt="Black families enjoying community events - fathers bonding with children"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 via-transparent to-transparent" />
                </div>

                {/* Floating card */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-2xl border border-[#DDDDDD]"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EFF4EB] to-[#5A7247]/20 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Users className="h-7 w-7 text-[#5A7247]" />
                    </motion.div>
                    <div>
                      <p className="text-base font-bold text-[#1A1A1A]">
                        Community First
                      </p>
                      <p className="text-sm text-[#888888]">Family Events</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBF6E9] text-[#A68A2E] text-sm font-semibold mb-6">
                <Calendar className="h-4 w-4" />
                Community Events
              </span>

              <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-6">
                Where Families{" "}
                <span className="text-[#5A7247]">Come Together</span>
              </h2>

              <p className="text-lg text-[#555555] leading-relaxed mb-8">
                From our signature &quot;Movies on the Menu&quot; dinner-and-movie nights
                to workshops, graduation ceremonies, and community celebrations—our
                events create spaces where fathers bond with their children and
                families make memories.
              </p>

              {/* Feature list with icons */}
              <div className="space-y-4 mb-10">
                {[
                  { icon: Film, text: "Movies on the Menu family nights" },
                  { icon: GraduationCap, text: "Program graduations & celebrations" },
                  { icon: Users, text: "Workshops, meetups & community gatherings" },
                ].map((item, i) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 text-[#555555]"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#FBF6E9] flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-[#C9A84C]" />
                    </div>
                    <span className="text-lg">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <Button asChild size="lg" className="group">
                <Link href="/events">
                  View Upcoming Events
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 7: TESTIMONIALS - ELEVATED
          ============================================ */}
      <section className="py-24 lg:py-32 bg-[#F5F3EF] relative overflow-hidden">
        {/* Background */}
        <DotPattern color="#C9A84C" opacity={0.06} spacing={30} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 text-[#A68A2E] text-sm font-semibold uppercase tracking-wider mb-4">
              <Quote className="h-4 w-4" />
              Testimonials
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mt-4">
              Voices from Our{" "}
              <span className="text-gradient-brand">Community</span>
            </h2>
            <p className="text-[#555555] text-lg mt-6 max-w-2xl mx-auto">
              Real stories from fathers, families, and organizations we&apos;ve had the
              privilege to serve.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 40, rotateY: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  role={testimonial.role}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 8: BLOG PREVIEW - ELEVATED
          ============================================ */}
      <section className="py-24 lg:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          >
            <div>
              <span className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
                From the Blog
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mt-2">
                Stories & Insights
              </h2>
            </div>
            <Button asChild variant="outline" className="group w-fit">
              <Link href="/blog">
                View All Articles
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <BlogPreviewCard
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  date={post.date}
                  readTime={post.readTime}
                  slug={post.slug}
                  image={post.image}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave divider */}
      <WaveDivider color="#1A1A1A" flip className="-mb-1" />

      {/* ============================================
          SECTION 9: GET INVOLVED CTA BAND - ELEVATED
          ============================================ */}
      <section className="py-24 lg:py-32 bg-[#1A1A1A] relative overflow-hidden">
        <GradientMesh variant="section" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Join the{" "}
              <span className="text-gradient-gold">Movement</span>
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Whether you give, serve, or partner—every action moves us forward.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Donate",
                desc: "Your gift funds programs that transform lives. Every dollar goes directly to families and youth in need.",
                cta: "Give Now",
                href: "/get-involved/donate",
                color: "#C9A84C",
              },
              {
                icon: Users,
                title: "Volunteer",
                desc: "Share your skills as a mentor, instructor, or event helper. Your time makes a lasting impact.",
                cta: "Sign Up",
                href: "/get-involved/volunteer",
                color: "#5A7247",
              },
              {
                icon: Handshake,
                title: "Partner",
                desc: "Corporate sponsors and organizational partners help us scale our mission and reach more families.",
                cta: "Learn More",
                href: "/get-involved/partner",
                color: "#C9A84C",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group"
              >
                <div className="relative h-full bg-gradient-to-b from-[#2D2D2D] to-[#1A1A1A] rounded-2xl p-8 text-center border border-[#444444] hover:border-[#C9A84C] transition-all duration-300 overflow-hidden">
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/0 via-[#C9A84C]/5 to-[#C9A84C]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <motion.div
                    className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1 }}
                    animate={
                      item.icon === Heart
                        ? { scale: [1, 1.05, 1] }
                        : undefined
                    }
                    transition={
                      item.icon === Heart
                        ? { duration: 1.5, repeat: Infinity }
                        : undefined
                    }
                  >
                    <item.icon
                      className="h-10 w-10"
                      style={{ color: item.color }}
                    />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-4 relative">
                    {item.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed mb-8 relative">
                    {item.desc}
                  </p>

                  <Link
                    href={item.href}
                    scroll={true}
                    className="relative inline-flex items-center justify-center w-full px-6 py-3 rounded-xl border-2 border-[#5A7247] text-[#5A7247] font-semibold transition-all duration-300 hover:bg-[#5A7247] hover:text-white group/btn"
                  >
                    {item.cta}
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 10: NEWSLETTER SIGNUP - ELEVATED
          ============================================ */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-[#FBF6E9] to-[#EFF4EB] relative overflow-hidden">
        {/* Background decoration */}
        <DotPattern color="#C9A84C" opacity={0.08} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl bg-[#C9A84C]/10 flex items-center justify-center mx-auto mb-6"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <Sparkles className="h-8 w-8 text-[#C9A84C]" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
              Stay in the Loop
            </h2>
            <p className="text-lg text-[#555555] mb-10">
              Get updates on upcoming events, program launches, success stories,
              and ways to get involved. No spam, just good news.
            </p>

            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#EFF4EB] border border-[#5A7247]/20 text-[#5A7247] font-medium text-lg"
              >
                <CheckCircle className="h-6 w-6" />
                You&apos;re in! Watch for updates from Forever Forward.
              </motion.div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              >
                <div className="relative flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 px-6 bg-white border-2 border-[#DDDDDD] rounded-xl text-lg focus:border-[#C9A84C] transition-colors"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="h-14 px-8 rounded-xl text-lg shrink-0"
                >
                  {isSubmitting ? (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Subscribing...
                    </motion.span>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
            )}

            <p className="text-sm text-[#888888] mt-6">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
