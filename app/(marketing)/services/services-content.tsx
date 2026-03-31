"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Server,
  Code,
  Cable,
  Shield,
  Users,
  HeartHandshake,
  Award,
  CheckCircle2,
  MapPin,
  Sparkles,
  Clock,
  Target,
  FileText,
  Zap,
  Building2,
  Phone,
  Mail,
  ChevronRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SERVICES, CONTACT_INFO } from "@/lib/constants";
import { createLead } from "@/lib/actions/leads";
import { cn } from "@/lib/utils";

// Import SVG components and backgrounds
import { GradientMesh, ParticleField } from "@/components/svg/backgrounds";
import { FloatingChevron, GradientOrb, GridPattern } from "@/components/svg/decorative";
import {
  ManagedITIcon,
  SoftwareDevIcon,
  CablingIcon,
  CCTVIcon,
  ForwardArrowIcon,
} from "@/components/svg/icons";

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

const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const differentiators = [
  {
    icon: HeartHandshake,
    title: "Mission-Aligned",
    description:
      "We understand nonprofits because we ARE a nonprofit. Your success is our success.",
    color: "gold" as const,
  },
  {
    icon: Users,
    title: "Community Impact",
    description:
      "Our technicians are program graduates—your IT spend creates jobs for fathers and youth.",
    color: "olive" as const,
  },
  {
    icon: Shield,
    title: "Enterprise Quality",
    description:
      "Same tools and practices used by Fortune 500 companies, adapted for your budget.",
    color: "gold" as const,
  },
  {
    icon: Award,
    title: "Proven Results",
    description:
      "25+ nonprofit clients trust us to keep their technology running smoothly.",
    color: "olive" as const,
  },
];

const serviceIcons: Record<string, React.FC<{ className?: string; size?: number; color?: string; animate?: boolean }>> = {
  "managed-it": ManagedITIcon,
  "software-ai": SoftwareDevIcon,
  "low-voltage": CablingIcon,
};

const processSteps = [
  {
    step: 1,
    title: "Schedule a Call",
    description: "Tell us about your organization and technology challenges.",
    icon: Phone,
  },
  {
    step: 2,
    title: "Get an Assessment",
    description: "We evaluate your infrastructure and identify opportunities.",
    icon: Target,
  },
  {
    step: 3,
    title: "Review Your Proposal",
    description: "Receive a detailed plan with transparent, nonprofit-friendly pricing.",
    icon: FileText,
  },
  {
    step: 4,
    title: "Onboard Smoothly",
    description: "We deploy our tools and train your team—minimal disruption guaranteed.",
    icon: Zap,
  },
  {
    step: 5,
    title: "Enjoy Peace of Mind",
    description: "Focus on your mission while we handle your technology.",
    icon: Shield,
  },
];

const techStack = [
  { name: "Microsoft 365", category: "Productivity" },
  { name: "Dell", category: "Hardware" },
  { name: "SonicWall", category: "Security" },
  { name: "Ubiquiti", category: "Networking" },
  { name: "Windows Server", category: "Infrastructure" },
  { name: "ConnectWise", category: "Management" },
];

// 3D Service Card Component
function ServiceCard3D({ service, index }: { service: (typeof SERVICES)[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 300, damping: 30 });

  const Icon = serviceIcons[service.slug] || Server;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] as const }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group perspective-1000"
    >
      <Link href={`/services/${service.slug}`} className="block h-full">
        <div className={cn(
          "relative h-full rounded-2xl p-8 transition-all duration-500",
          "bg-gradient-to-br from-white to-[#FAFAF8]",
          "border border-[#DDDDDD] group-hover:border-[#C9A84C]/50",
          "shadow-sm group-hover:shadow-2xl group-hover:shadow-[#C9A84C]/10",
          "overflow-hidden"
        )}>
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${isHovered ? '50%' : '0%'} 0%, rgba(201, 168, 76, 0.08) 0%, transparent 70%)`,
            }}
          />

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <motion.path
                d="M100 0L100 100L0 100"
                stroke="#C9A84C"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={isHovered ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 0.5 }}
              />
            </svg>
          </div>

          {/* Icon with premium styling */}
          <div className="relative w-20 h-20 mb-6">
            <div className={cn(
              "absolute inset-0 rounded-2xl transition-all duration-500",
              "bg-gradient-to-br from-[#FBF6E9] to-[#F5EDD8]",
              "group-hover:from-[#C9A84C]/20 group-hover:to-[#C9A84C]/10"
            )} />
            <div className="relative w-full h-full flex items-center justify-center">
              <Icon
                size={48}
                color="#C9A84C"
                animate={isHovered}
              />
            </div>
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-[#C9A84C]/20 blur-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHovered ? { opacity: 0.5, scale: 1.2 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Content */}
          <div style={{ transform: "translateZ(30px)" }}>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#C9A84C] transition-colors duration-300">
              {service.name}
            </h3>
            <p className="text-[#C9A84C] font-semibold mb-4">{service.tagline}</p>
            <p className="text-[#555555] leading-relaxed mb-6">{service.description}</p>

            {/* Price and CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-[#DDDDDD]/50">
              <div>
                <span className="text-sm text-[#888888]">Starting at</span>
                <span className="block text-lg font-bold text-[#1A1A1A]">{service.startingPrice}</span>
              </div>
              <motion.div
                className="flex items-center gap-2 text-[#5A7247] group-hover:text-[#C9A84C] font-semibold"
                animate={isHovered ? { x: 5 } : { x: 0 }}
              >
                Learn More
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Animated Process Step Component
function ProcessStep({ step, index, isLast }: { step: typeof processSteps[0]; index: number; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative flex items-start gap-6"
    >
      {/* Step number with animated ring */}
      <div className="relative flex-shrink-0">
        <motion.div
          className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] flex items-center justify-center z-10"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: "spring", stiffness: 200 }}
        >
          <span className="text-2xl font-bold text-white">{step.step}</span>
        </motion.div>

        {/* Animated ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#C9A84C]/30"
          initial={{ scale: 1 }}
          animate={isInView ? { scale: 1.3, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: index * 0.15 + 0.4, repeat: Infinity, repeatDelay: 2 }}
        />

        {/* Connecting line */}
        {!isLast && (
          <motion.div
            className="absolute top-16 left-1/2 w-0.5 h-24 -translate-x-1/2 bg-gradient-to-b from-[#C9A84C] to-[#C9A84C]/20"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
            style={{ transformOrigin: "top" }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <div className="flex items-center gap-3 mb-2">
          <step.icon className="h-5 w-5 text-[#C9A84C]" />
          <h3 className="text-xl font-bold text-[#1A1A1A]">{step.title}</h3>
        </div>
        <p className="text-[#555555] leading-relaxed">{step.description}</p>
      </div>
    </motion.div>
  );
}

// Tech Stack Badge Component
function TechBadge({ tech, index }: { tech: typeof techStack[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="group relative"
    >
      <div className={cn(
        "px-6 py-4 rounded-xl transition-all duration-300",
        "bg-[#2D2D2D] border border-[#444444]",
        "group-hover:border-[#C9A84C]/50 group-hover:bg-[#333333]"
      )}>
        <p className="text-white font-semibold">{tech.name}</p>
        <p className="text-xs text-[#888888] mt-1">{tech.category}</p>
      </div>

      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-[#C9A84C]/10 blur-lg -z-10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  );
}

export function ServicesContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Split name into first/last
    const nameParts = formData.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const result = await createLead({
      firstName,
      lastName,
      email: formData.email,
      phone: formData.phone || undefined,
      organization: formData.organization || undefined,
      leadType: "msp",
      source: "services_assessment_form",
      notes: "Requested IT assessment from services page",
    });

    if (result.success) {
      setIsSubmitted(true);
    } else {
      console.error("Failed to create lead:", result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center py-20 lg:py-32 bg-[#1A1A1A] overflow-hidden">
        {/* Animated background layers */}
        <div className="absolute inset-0">
          <GradientMesh
            variant="hero"
            className="opacity-30"
          />
          <ParticleField
            particleCount={30}
            colors={["#C9A84C", "#5A7247", "#FFFFFF"]}
            className="opacity-40"
          />
        </div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-1/4 right-[10%] opacity-20"
          variants={floatVariants}
          initial="initial"
          animate="animate"
        >
          <ManagedITIcon size={120} color="#C9A84C" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 left-[5%] opacity-15"
          variants={floatVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
        >
          <SoftwareDevIcon size={100} color="#5A7247" />
        </motion.div>

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(201, 168, 76, 0.15) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(90, 114, 71, 0.1) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Premium badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#2D2D2D] to-[#333333] border border-[#444444] shadow-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#C9A84C]/20">
                  <Server className="h-4 w-4 text-[#C9A84C]" />
                </div>
                <span className="text-sm font-medium text-white/90">
                  IT Services for Nonprofits & Schools
                </span>
                <div className="w-2 h-2 rounded-full bg-[#5A7247] animate-pulse" />
              </span>
            </motion.div>

            {/* Main headline with gradient text */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8"
            >
              <span className="text-white">Enterprise IT.</span>
              <br />
              <span className="bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] bg-clip-text text-transparent">
                Nonprofit Heart.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Technology that powers your mission—managed by people who understand it.
              From help desk to cloud strategy,{" "}
              <span className="text-white font-semibold">we&apos;ve got you covered.</span>
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="relative group overflow-hidden">
                <Link href="/services/free-assessment">
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Take Free IT Assessment
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#services" className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  View Services
                </Link>
              </Button>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-8 mt-16"
            >
              {[
                { value: "25+", label: "Nonprofit Clients" },
                { value: "99.9%", label: "Uptime SLA" },
                { value: "< 4hr", label: "Response Time" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-bold text-[#C9A84C]">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <motion.div
              className="w-1.5 h-3 rounded-full bg-[#C9A84C]"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* DIFFERENTIATORS SECTION */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-[#FAFAF8] to-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <GridPattern color="#C9A84C" opacity={0.02} size={50} className="absolute inset-0" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBF6E9] text-[#A68A2E] text-sm font-semibold mb-4">
              <Award className="h-4 w-4" />
              What Sets Us Apart
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
              Why Choose Forever Forward?
            </h2>
            <p className="text-xl text-[#555555] max-w-2xl mx-auto">
              We&apos;re not just another IT company. Here&apos;s what makes us different.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className={cn(
                  "h-full p-8 rounded-2xl transition-all duration-500",
                  "bg-white border border-[#DDDDDD]",
                  "hover:border-[#C9A84C]/30 hover:shadow-xl hover:shadow-[#C9A84C]/5"
                )}>
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500",
                    item.color === "gold"
                      ? "bg-[#FBF6E9] group-hover:bg-[#C9A84C]/20"
                      : "bg-[#EFF4EB] group-hover:bg-[#5A7247]/20"
                  )}>
                    <item.icon className={cn(
                      "h-8 w-8 transition-colors duration-300",
                      item.color === "gold" ? "text-[#C9A84C]" : "text-[#5A7247]"
                    )} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#555555] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section id="services" className="py-20 lg:py-32 bg-white scroll-mt-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <GradientOrb className="absolute top-20 right-10 opacity-30" size={200} colors={["#C9A84C", "#E8D48B"]} />
          <GradientOrb className="absolute bottom-20 left-10 opacity-20" size={150} colors={["#5A7247", "#7A9A63"]} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFF4EB] text-[#5A7247] text-sm font-semibold mb-4">
              <Zap className="h-4 w-4" />
              Our Solutions
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
              Comprehensive IT Services
            </h2>
            <p className="text-xl text-[#555555] max-w-2xl mx-auto">
              Tailored solutions for mission-driven organizations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => (
              <ServiceCard3D key={service.slug} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-20 lg:py-32 bg-[#1A1A1A] relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <GradientMesh
            variant="subtle"
            className="opacity-50"
          />
        </div>

        {/* Floating chevrons */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10"
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            <ForwardArrowIcon size={60} color="#C9A84C" />
          </motion.div>
          <motion.div
            className="absolute bottom-20 right-10"
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            <ForwardArrowIcon size={80} color="#5A7247" />
          </motion.div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-[#C9A84C] text-sm font-semibold mb-4">
              <Shield className="h-4 w-4" />
              Trusted Technology
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Our Tech Stack
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              We partner with industry leaders to deliver reliable, secure, and scalable solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((tech, index) => (
              <TechBadge key={tech.name} tech={tech} index={index} />
            ))}
          </div>

          {/* Trust statement */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-white/50 text-sm"
          >
            Microsoft Partner • Dell Authorized • Ubiquiti Certified
          </motion.p>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
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
              <Target className="h-4 w-4" />
              Simple Process
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
              How We Work Together
            </h2>
            <p className="text-xl text-[#555555] max-w-2xl mx-auto">
              From first call to ongoing support, here&apos;s what to expect.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {processSteps.map((step, index) => (
              <ProcessStep
                key={step.step}
                step={step}
                index={index}
                isLast={index === processSteps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Animated map icon */}
            <motion.div
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FBF6E9] to-[#F5EDD8] flex items-center justify-center mx-auto mb-8"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <MapPin className="h-12 w-12 text-[#C9A84C]" />
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-6">
              Service Area
            </h2>
            <p className="text-xl text-[#555555] leading-relaxed max-w-3xl mx-auto mb-12">
              We provide on-site IT services throughout the{" "}
              <span className="font-semibold text-[#1A1A1A]">Greater Los Angeles area</span> and the{" "}
              <span className="font-semibold text-[#1A1A1A]">Inland Empire</span>—including South LA, Compton, Inglewood, Carson,
              Long Beach, Riverside, San Bernardino, and Ontario.{" "}
              <span className="text-[#C9A84C] font-semibold">Remote support available nationwide.</span>
            </p>

            {/* Area badges */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#EFF4EB] border border-[#5A7247]/20"
              >
                <CheckCircle2 className="h-6 w-6 text-[#5A7247]" />
                <span className="font-semibold text-[#5A7247]">Los Angeles County</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#FBF6E9] border border-[#C9A84C]/20"
              >
                <CheckCircle2 className="h-6 w-6 text-[#C9A84C]" />
                <span className="font-semibold text-[#A68A2E]">Inland Empire</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#1A1A1A]"
              >
                <Zap className="h-6 w-6 text-[#C9A84C]" />
                <span className="font-semibold text-white">Remote: Nationwide</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-[#1A1A1A] via-[#222222] to-[#1A1A1A] relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <ParticleField particleCount={20} colors={["#C9A84C", "#5A7247"]} className="opacity-30" />
        </div>

        {/* Gradient orbs */}
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201, 168, 76, 0.2) 0%, transparent 60%)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#C9A84C]/30 text-[#C9A84C] text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4" />
              Two Ways to Get Started
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Ready to Transform Your IT?
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Choose the option that works best for you—either way, you&apos;ll get
              personalized recommendations with no obligation.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Option 1: Comprehensive Assessment */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C9A84C] to-[#A68A2E] rounded-3xl opacity-50 group-hover:opacity-100 blur transition-all duration-500" />
              <div className="relative bg-[#1A1A1A] rounded-3xl p-8 lg:p-10">
                <div className="absolute -top-4 left-8 px-4 py-1.5 bg-gradient-to-r from-[#C9A84C] to-[#A68A2E] rounded-full">
                  <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">Recommended</span>
                </div>

                <div className="flex items-center gap-4 mb-6 mt-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#C9A84C]/20 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-[#C9A84C]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Free IT Assessment</h3>
                    <p className="text-white/50">5 minutes • No obligation</p>
                  </div>
                </div>

                <p className="text-white/70 mb-8 leading-relaxed">
                  Complete our detailed assessment form and we&apos;ll prepare
                  personalized recommendations based on your specific needs, challenges,
                  and goals.
                </p>

                <ul className="space-y-4 mb-8">
                  {[
                    { icon: Target, text: "Tailored recommendations for your org" },
                    { icon: Clock, text: "Custom quote within 24 hours" },
                    { icon: Shield, text: "Security & compliance review included" },
                    { icon: Users, text: "Right-sized package for your budget" },
                  ].map((item, i) => (
                    <motion.li
                      key={item.text}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-[#C9A84C]" />
                      </div>
                      <span className="text-white/80">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>

                <Button asChild size="lg" className="w-full group">
                  <Link href="/services/free-assessment">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Free Assessment
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Option 2: Quick Contact */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#2D2D2D] rounded-3xl p-8 lg:p-10 border border-[#444444]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#5A7247]/20 flex items-center justify-center">
                  <Users className="h-8 w-8 text-[#7A9A63]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Quick Contact</h3>
                  <p className="text-white/50">We&apos;ll call you back</p>
                </div>
              </div>

              <p className="text-white/70 mb-8 leading-relaxed">
                Prefer to talk first? Leave your info and we&apos;ll schedule a call
                to discuss your needs.
              </p>

              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="w-20 h-20 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle2 className="h-10 w-10 text-[#5A7247]" />
                    </motion.div>
                    <h4 className="text-2xl font-bold text-white mb-2">Thank You!</h4>
                    <p className="text-white/60">We&apos;ll be in touch within 24 hours.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-[#3D3D3D] border-[#555555] text-white placeholder:text-white/40 focus:border-[#C9A84C] h-12"
                        required
                      />
                      <Input
                        type="tel"
                        placeholder="Phone (optional)"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-[#3D3D3D] border-[#555555] text-white placeholder:text-white/40 focus:border-[#C9A84C] h-12"
                      />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#3D3D3D] border-[#555555] text-white placeholder:text-white/40 focus:border-[#C9A84C] h-12"
                      required
                    />
                    <Input
                      placeholder="Organization Name"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="bg-[#3D3D3D] border-[#555555] text-white placeholder:text-white/40 focus:border-[#C9A84C] h-12"
                      required
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={isSubmitting}
                      className="w-full h-12"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Sending...
                        </span>
                      ) : (
                        "Request Callback"
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT BAR */}
      <section className="py-8 bg-[#FBF6E9] border-t border-[#C9A84C]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
            <p className="text-[#555555]">Questions?</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-2 text-[#C9A84C] font-semibold hover:text-[#A68A2E] transition-colors"
              >
                <Phone className="h-4 w-4" />
                {CONTACT_INFO.phone}
              </a>
              <span className="hidden sm:block text-[#DDDDDD]">|</span>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="inline-flex items-center gap-2 text-[#C9A84C] font-semibold hover:text-[#A68A2E] transition-colors"
              >
                <Mail className="h-4 w-4" />
                {CONTACT_INFO.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
