"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { SERVICES, CONTACT_INFO } from "@/lib/constants";
import { createLead } from "@/lib/actions/leads";

const differentiators = [
  {
    icon: HeartHandshake,
    title: "Mission-Aligned",
    description:
      "We understand nonprofits because we ARE a nonprofit. Your success is our success.",
  },
  {
    icon: Users,
    title: "Community Impact",
    description:
      "Our technicians are program graduates—your IT spend creates jobs for fathers and youth.",
  },
  {
    icon: Shield,
    title: "Enterprise Quality",
    description:
      "Same tools and practices used by Fortune 500 companies, adapted for your budget.",
  },
  {
    icon: Award,
    title: "Proven Results",
    description:
      "25+ nonprofit clients trust us to keep their technology running smoothly.",
  },
];

const serviceIcons: Record<string, typeof Server> = {
  "managed-it": Server,
  "software-ai": Code,
  "low-voltage": Cable,
};

const processSteps = [
  {
    step: 1,
    title: "Schedule a Call",
    description: "Tell us about your organization and technology challenges.",
  },
  {
    step: 2,
    title: "Get an Assessment",
    description: "We evaluate your infrastructure and identify opportunities.",
  },
  {
    step: 3,
    title: "Review Your Proposal",
    description: "Receive a detailed plan with transparent, nonprofit-friendly pricing.",
  },
  {
    step: 4,
    title: "Onboard Smoothly",
    description: "We deploy our tools and train your team—minimal disruption guaranteed.",
  },
  {
    step: 5,
    title: "Enjoy Peace of Mind",
    description: "Focus on your mission while we handle your technology.",
  },
];

export default function ServicesPage() {
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
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#2D2D2D]" />

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#C9A84C]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-[#5A7247]/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-sm text-white/80 mb-6">
              <Server className="h-4 w-4 text-[#C9A84C]" />
              IT Services for Nonprofits & Schools
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Enterprise IT.{" "}
              <span className="text-[#C9A84C]">Nonprofit Heart.</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Technology that powers your mission—managed by people who
              understand it. From help desk to cloud strategy, we&apos;ve got you
              covered.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/services/free-assessment">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Take Free IT Assessment
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#services">View Services</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Differentiators */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why Choose Forever Forward?"
            subtitle="We're not just another IT company. Here's what makes us different."
            centered
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-[#FBF6E9] flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-[#C9A84C]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#555555] text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-16 lg:py-24 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Services"
            subtitle="Comprehensive IT solutions tailored for mission-driven organizations."
            centered
          />

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {SERVICES.map((service, index) => {
              const Icon = serviceIcons[service.slug] || Server;
              return (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="group block h-full"
                  >
                    <div className="h-full bg-[#FAFAF8] rounded-xl p-6 lg:p-8 border border-[#DDDDDD] hover:border-[#C9A84C] transition-all hover:shadow-lg">
                      <div className="w-14 h-14 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center mb-6 group-hover:bg-[#C9A84C]/20 transition-colors">
                        <Icon className="h-7 w-7 text-[#C9A84C]" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#C9A84C] transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm font-medium text-[#C9A84C] mb-3">
                        {service.tagline}
                      </p>
                      <p className="text-[#555555] text-sm leading-relaxed mb-4">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#888888]">
                          Starting at {service.startingPrice}
                        </span>
                        <ArrowRight className="h-5 w-5 text-[#5A7247] group-hover:text-[#C9A84C] transition-colors group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 lg:py-24 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
              Trusted Technology
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-6">
              Our Tech Stack
            </h2>
            <p className="text-white/70 mb-12 max-w-2xl mx-auto">
              We partner with industry leaders to deliver reliable, secure, and
              scalable solutions.
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              "Microsoft 365",
              "Dell",
              "SonicWall",
              "Ubiquiti",
              "Windows Server",
              "ConnectWise",
            ].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="px-6 py-3 rounded-lg bg-[#2D2D2D] border border-[#444444] text-white/80 font-medium"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 lg:py-24 bg-[#EFF4EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="How We Work"
            subtitle="From first call to ongoing support, here's what to expect."
            centered
          />

          <div className="mt-12 relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-[#C9A84C]/30" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#C9A84C] flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-[#1A1A1A] font-bold text-xl">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#555555] text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-full bg-[#FBF6E9] flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-[#C9A84C]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
              Service Area
            </h2>
            <p className="text-[#555555] leading-relaxed max-w-2xl mx-auto mb-8">
              We provide on-site IT services throughout the Greater Los Angeles
              area and the Inland Empire—including South LA, Compton, Inglewood, Carson,
              Long Beach, Riverside, San Bernardino, and Ontario. Remote
              monitoring and support is available nationwide.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFF4EB] text-[#5A7247] font-medium">
                <CheckCircle2 className="h-5 w-5" />
                Los Angeles County
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBF6E9] text-[#A68A2E] font-medium">
                <CheckCircle2 className="h-5 w-5" />
                Inland Empire
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Free Assessment CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#C9A84C]/30 text-sm text-[#C9A84C] mb-6">
              <Sparkles className="h-4 w-4" />
              Two Ways to Get Started
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your IT?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Choose the option that works best for you—either way, you&apos;ll get
              personalized recommendations with no obligation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Option 1: Comprehensive Assessment */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-[#C9A84C]/10 to-[#C9A84C]/5 rounded-2xl p-6 lg:p-8 border-2 border-[#C9A84C]/50"
            >
              <div className="absolute -top-3 left-6 px-3 py-1 bg-[#C9A84C] rounded-full text-xs font-semibold text-[#1A1A1A]">
                RECOMMENDED
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#C9A84C]/20 flex items-center justify-center">
                  <FileText className="h-7 w-7 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Free IT Assessment
                  </h3>
                  <p className="text-sm text-white/60">5 minutes • No obligation</p>
                </div>
              </div>
              <p className="text-white/70 mb-6">
                Complete our detailed assessment form and we&apos;ll prepare
                personalized recommendations based on your specific needs, challenges,
                and goals.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { icon: Target, text: "Tailored recommendations" },
                  { icon: Clock, text: "Custom quote within 24 hours" },
                  { icon: Shield, text: "Security & compliance review" },
                  { icon: Users, text: "Right-sized package for your org" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-white/70">
                    <item.icon className="h-4 w-4 text-[#C9A84C]" />
                    <span className="text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="w-full">
                <Link href="/services/free-assessment">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Free Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Option 2: Quick Contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#2D2D2D] rounded-2xl p-6 lg:p-8 border border-[#444444]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#5A7247]/20 flex items-center justify-center">
                  <Users className="h-7 w-7 text-[#7A9A63]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Quick Contact
                  </h3>
                  <p className="text-sm text-white/60">We&apos;ll call you back</p>
                </div>
              </div>
              <p className="text-white/70 mb-6">
                Prefer to talk first? Leave your info and we&apos;ll schedule a call
                to discuss your needs.
              </p>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-7 w-7 text-[#5A7247]" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Thank You!
                  </h4>
                  <p className="text-white/70 text-sm">
                    We&apos;ll be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-[#444444] border-[#555555] text-white placeholder:text-white/40"
                      required
                    />
                    <Input
                      type="tel"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="bg-[#444444] border-[#555555] text-white placeholder:text-white/40"
                    />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-[#444444] border-[#555555] text-white placeholder:text-white/40"
                    required
                  />
                  <Input
                    placeholder="Organization Name"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                    className="bg-[#444444] border-[#555555] text-white placeholder:text-white/40"
                    required
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? "Sending..." : "Request Callback"}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-[#FBF6E9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#555555]">
            Questions? Call us at{" "}
            <a
              href={`tel:${CONTACT_INFO.phone.replace(/[^0-9]/g, "")}`}
              className="text-[#C9A84C] font-semibold hover:underline"
            >
              {CONTACT_INFO.phone}
            </a>{" "}
            or email{" "}
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="text-[#C9A84C] font-semibold hover:underline"
            >
              {CONTACT_INFO.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
