"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SERVICES, CONTACT_INFO } from "@/lib/constants";
import { createLead } from "@/lib/actions/leads";
import { cn } from "@/lib/utils";

const serviceImages: Record<string, string> = {
  "managed-it": "/images/authentic/tech/it-professional-server-room.jpg",
  "software-ai": "/images/authentic/fathers/father-teaching-daughter.jpg",
  "low-voltage": "/images/authentic/tech/cctv-installation-work.jpg",
};

const differentiators = [
  {
    icon: HeartHandshake,
    title: "Mission-Aligned",
    description: "We understand nonprofits because we ARE a nonprofit.",
  },
  {
    icon: Users,
    title: "Community Impact",
    description: "Your IT spend creates jobs for fathers and youth.",
  },
  {
    icon: Shield,
    title: "Enterprise Quality",
    description: "Fortune 500 tools adapted for your budget.",
  },
  {
    icon: Award,
    title: "Proven Results",
    description: "25+ nonprofit clients trust us.",
  },
];

const processSteps = [
  { step: 1, title: "Schedule a Call", description: "Tell us about your organization" },
  { step: 2, title: "Get an Assessment", description: "We evaluate your infrastructure" },
  { step: 3, title: "Review Your Proposal", description: "Transparent, nonprofit-friendly pricing" },
  { step: 4, title: "Onboard Smoothly", description: "Deploy tools, train team" },
  { step: 5, title: "Enjoy Peace of Mind", description: "Focus on your mission" },
];

const techPartners = [
  "Microsoft 365",
  "Dell",
  "SonicWall",
  "Ubiquiti",
  "Windows Server",
  "ConnectWise",
];

export function ServicesContentPremium() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const processRef = useRef<HTMLElement>(null);
  const isProcessInView = useInView(processRef, { once: true, margin: "-100px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
    }
    setIsSubmitting(false);
  };

  return (
    <>
      {/* Hero Section - Split Screen */}
      <section className="relative min-h-[90vh] bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 grid lg:grid-cols-2">
          {/* Left - Content */}
          <div className="relative z-10 flex items-center px-6 sm:px-12 lg:px-16 xl:px-24 pt-32 pb-20 lg:py-0">
            <div className="max-w-xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-white/80">
                  <Server className="h-4 w-4 text-[#C9A84C]" />
                  IT Services for Nonprofits
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6"
              >
                Enterprise IT.
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C]">
                  Nonprofit Heart.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg sm:text-xl text-white/60 leading-relaxed mb-10"
              >
                Technology that powers your mission—managed by people who understand it.
                From help desk to cloud strategy, we&apos;ve got you covered.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-8 mb-10"
              >
                {[
                  { value: "25+", label: "Clients" },
                  { value: "99.9%", label: "Uptime" },
                  { value: "<4hr", label: "Response" },
                ].map((stat) => (
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
                  <Link href="/services/free-assessment">
                    Free IT Assessment
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Services
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative hidden lg:block">
            <Image
              src="/images/authentic/tech/it-professional-server-room.jpg"
              alt="IT professional working in server room"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 via-transparent to-[#1A1A1A]/20" />

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-24 left-8 bg-white rounded-2xl p-5 shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5A7247] to-[#7A9A63] flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A1A1A]">99.9%</p>
                  <p className="text-sm text-[#888888]">Uptime SLA</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute top-32 right-8 bg-[#C9A84C] rounded-xl px-5 py-3 shadow-lg"
            >
              <p className="text-[#1A1A1A] font-semibold">Microsoft Partner</p>
            </motion.div>
          </div>
        </div>

        {/* Mobile hero overlay */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="/images/authentic/tech/it-professional-server-room.jpg"
            alt="IT professional working in server room"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/80 to-[#1A1A1A]" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 lg:py-28 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBF6E9] text-[#A68A2E] text-sm font-semibold mb-4">
              <Award className="h-4 w-4" />
              What Sets Us Apart
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A]">
              Why Choose Forever Forward?
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-[#DDDDDD] hover:border-[#C9A84C]/30 hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-[#FBF6E9] group-hover:bg-[#C9A84C]/20 flex items-center justify-center mb-6 transition-colors">
                  <item.icon className="h-7 w-7 text-[#C9A84C]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{item.title}</h3>
                <p className="text-[#555555] leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 lg:py-28 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFF4EB] text-[#5A7247] text-sm font-semibold mb-4">
              <Zap className="h-4 w-4" />
              Our Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
              Comprehensive IT Services
            </h2>
            <p className="text-xl text-[#555555] max-w-2xl mx-auto">
              Tailored solutions for mission-driven organizations
            </p>
          </motion.div>

          <div className="space-y-8">
            {SERVICES.map((service, index) => {
              const Icon = service.slug === "managed-it" ? Server : service.slug === "software-ai" ? Code : Cable;
              const isReverse = index % 2 === 1;

              return (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/services/${service.slug}`} className="group block">
                    <div
                      className={cn(
                        "relative rounded-3xl overflow-hidden bg-[#1A1A1A]",
                        "grid lg:grid-cols-2"
                      )}
                    >
                      {/* Image */}
                      <div
                        className={cn(
                          "relative aspect-[4/3] lg:aspect-auto lg:min-h-[350px]",
                          isReverse && "lg:order-2"
                        )}
                      >
                        <Image
                          src={serviceImages[service.slug]}
                          alt={service.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div
                          className={cn(
                            "absolute inset-0 hidden lg:block",
                            isReverse
                              ? "bg-gradient-to-l from-transparent to-[#1A1A1A]"
                              : "bg-gradient-to-r from-transparent to-[#1A1A1A]"
                          )}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent lg:hidden" />
                      </div>

                      {/* Content */}
                      <div
                        className={cn(
                          "relative p-8 lg:p-12 flex flex-col justify-center",
                          isReverse && "lg:order-1"
                        )}
                      >
                        <div className="w-14 h-14 rounded-xl bg-[#C9A84C]/20 flex items-center justify-center mb-6">
                          <Icon className="h-7 w-7 text-[#C9A84C]" />
                        </div>

                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-[#C9A84C] transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-[#C9A84C] font-semibold mb-4">{service.tagline}</p>
                        <p className="text-white/60 leading-relaxed mb-6">{service.description}</p>

                        <div className="flex items-center justify-between pt-6 border-t border-white/10">
                          <div>
                            <span className="text-sm text-white/40">Starting at</span>
                            <span className="block text-xl font-bold text-white">
                              {service.startingPrice}
                            </span>
                          </div>
                          <span className="flex items-center text-[#C9A84C] font-semibold group-hover:gap-3 gap-2 transition-all">
                            Learn More
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Partners */}
      <section className="py-16 bg-[#1A1A1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/40 text-sm uppercase tracking-widest mb-8"
          >
            Trusted Technology Partners
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {techPartners.map((partner) => (
              <span
                key={partner}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium hover:border-[#C9A84C]/30 hover:bg-white/10 transition-all"
              >
                {partner}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section
        ref={processRef}
        className="py-20 lg:py-28 bg-gradient-to-br from-[#EFF4EB] via-[#FAFAF8] to-[#EFF4EB]"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#5A7247] text-sm font-semibold mb-4 shadow-sm">
              <Target className="h-4 w-4" />
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A]">
              How We Work Together
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                animate={isProcessInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="relative flex items-start gap-6 pb-12 last:pb-0"
              >
                {/* Step number */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] flex items-center justify-center z-10 relative">
                    <span className="text-xl font-bold text-white">{step.step}</span>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="absolute top-14 left-1/2 w-0.5 h-12 -translate-x-1/2 bg-gradient-to-b from-[#C9A84C] to-[#C9A84C]/20" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">{step.title}</h3>
                  <p className="text-[#555555]">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FBF6E9] to-[#F5EDD8] flex items-center justify-center mx-auto mb-8">
              <MapPin className="h-10 w-10 text-[#C9A84C]" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-6">
              Service Area
            </h2>
            <p className="text-lg text-[#555555] leading-relaxed mb-10">
              On-site IT services throughout{" "}
              <span className="font-semibold text-[#1A1A1A]">Greater Los Angeles</span> and the{" "}
              <span className="font-semibold text-[#1A1A1A]">Inland Empire</span>—including
              South LA, Compton, Inglewood, Carson, Long Beach, Riverside, and more.{" "}
              <span className="text-[#C9A84C] font-semibold">Remote support available nationwide.</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#EFF4EB] border border-[#5A7247]/20">
                <CheckCircle2 className="h-5 w-5 text-[#5A7247]" />
                <span className="font-semibold text-[#5A7247]">Los Angeles County</span>
              </span>
              <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FBF6E9] border border-[#C9A84C]/20">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C]" />
                <span className="font-semibold text-[#A68A2E]">Inland Empire</span>
              </span>
              <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#1A1A1A]">
                <Zap className="h-5 w-5 text-[#C9A84C]" />
                <span className="font-semibold text-white">Remote: Nationwide</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-[#1A1A1A] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Transform Your IT?
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Choose the option that works best for you—personalized recommendations with no
              obligation.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Assessment CTA */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C9A84C] to-[#A68A2E] rounded-3xl opacity-50 group-hover:opacity-100 blur transition-all duration-500" />
              <div className="relative bg-[#1A1A1A] rounded-3xl p-8 lg:p-10">
                <span className="absolute -top-4 left-8 px-4 py-1.5 bg-gradient-to-r from-[#C9A84C] to-[#A68A2E] rounded-full text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">
                  Recommended
                </span>

                <div className="flex items-center gap-4 mb-6 mt-4">
                  <div className="w-14 h-14 rounded-xl bg-[#C9A84C]/20 flex items-center justify-center">
                    <FileText className="h-7 w-7 text-[#C9A84C]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Free IT Assessment</h3>
                    <p className="text-white/50">5 minutes • No obligation</p>
                  </div>
                </div>

                <p className="text-white/70 mb-8">
                  Complete our assessment and we&apos;ll prepare personalized recommendations for
                  your specific needs.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Tailored recommendations",
                    "Custom quote within 24 hours",
                    "Security review included",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/80">
                      <CheckCircle2 className="h-5 w-5 text-[#C9A84C]" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button asChild size="lg" className="w-full group">
                  <Link href="/services/free-assessment">
                    Start Free Assessment
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Quick Contact */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#2D2D2D] rounded-3xl p-8 lg:p-10 border border-[#444444]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#5A7247]/20 flex items-center justify-center">
                  <Users className="h-7 w-7 text-[#7A9A63]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Quick Contact</h3>
                  <p className="text-white/50">We&apos;ll call you back</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-8 w-8 text-[#5A7247]" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Thank You!</h4>
                    <p className="text-white/60">We&apos;ll be in touch within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                      {isSubmitting ? "Sending..." : "Request Callback"}
                    </Button>
                  </form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Bar */}
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
