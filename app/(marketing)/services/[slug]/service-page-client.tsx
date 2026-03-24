"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";
import { CONTACT_INFO } from "@/lib/constants";
import { createLead } from "@/lib/actions/leads";
import type { ServiceDetail } from "@/lib/data/services";

interface ServicePageClientProps {
  service: ServiceDetail;
}

export function ServicePageClient({ service }: ServicePageClientProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Split name into first and last
      const nameParts = formData.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const result = await createLead({
        firstName,
        lastName,
        email: formData.email,
        organization: formData.organization,
        leadType: "msp",
        source: "service_page",
        serviceInterests: [service.slug],
        notes: `Service Interest: ${service.name}\n\nNeeds: ${formData.message}`,
      });

      if (result.success) {
        setIsSubmitted(true);
      } else {
        console.error("Failed to create lead:", result.error);
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] lg:min-h-[80vh] bg-[#1A1A1A] overflow-hidden">
        {/* Background Image */}
        {service.heroImage && (
          <div className="absolute inset-0">
            <Image
              src={service.heroImage}
              alt={service.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-[#1A1A1A]/40" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-5xl mb-6 block">{service.icon}</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {service.name}
            </h1>
            <p className="text-xl sm:text-2xl text-[#C9A84C] font-medium mb-6">
              {service.tagline}
            </p>
            <p className="text-lg text-white/80 mb-8">
              {service.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button asChild size="lg">
                <Link href="#contact">Get a Quote</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Overview */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Service Overview"
            subtitle="Everything you need to know about this service."
          />
          <div className="mt-8 space-y-6">
            {service.overview.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-[#555555] leading-relaxed text-lg"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What's Included"
            subtitle="Key features and benefits of this service."
            centered
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {service.benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#FAFAF8] rounded-xl p-6 border border-[#DDDDDD]"
              >
                <span className="text-3xl mb-4 block">{benefit.icon}</span>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-[#555555] text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 lg:py-24 bg-[#EFF4EB] scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Pricing"
            subtitle="Transparent pricing designed for nonprofit budgets."
            centered
          />

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {service.pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative bg-white rounded-xl p-6 lg:p-8 border-2 transition-all",
                  tier.popular
                    ? "border-[#C9A84C] shadow-lg"
                    : "border-[#DDDDDD]"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  {tier.name}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-[#C9A84C]">
                    {tier.price}
                  </span>
                  {tier.unit && (
                    <span className="text-[#888888] text-sm ml-1">
                      {tier.unit}
                    </span>
                  )}
                </div>
                <p className="text-[#555555] text-sm mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-2 text-[#555555] text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#5A7247] shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={tier.popular ? "default" : "outline"}
                  className="w-full"
                >
                  <Link href="#contact">Get Started</Link>
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[#888888] text-sm mt-8"
          >
            All pricing is customized based on your organization&apos;s needs.
            Contact us for a detailed quote.
          </motion.p>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Process"
            subtitle="How we work with you from start to finish."
            centered
          />

          <div className="mt-12 relative">
            {/* Timeline Line */}
            <div className="absolute left-4 lg:left-8 top-0 bottom-0 w-0.5 bg-[#DDDDDD]" />

            <div className="space-y-8">
              {service.process.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-12 lg:pl-20"
                >
                  {/* Step Number */}
                  <div className="absolute left-2 lg:left-5.5 w-5 h-5 rounded-full bg-[#C9A84C] flex items-center justify-center ring-4 ring-[#FBF6E9]">
                    <span className="text-[#1A1A1A] font-bold text-xs">
                      {step.step}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[#555555]">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      {service.techStack && service.techStack.length > 0 && (
        <section className="py-16 lg:py-24 bg-[#1A1A1A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
                Technology We Use
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {service.techStack.map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="px-5 py-2 rounded-lg bg-[#2D2D2D] border border-[#444444] text-white/80 font-medium"
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Service Area */}
      <section className="py-12 bg-[#FBF6E9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[#555555]">
            <MapPin className="h-5 w-5 text-[#C9A84C]" />
            <span>{service.serviceArea}</span>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-16 lg:py-24 bg-[#FAFAF8] scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionHeading
                title="Get in Touch"
                subtitle={`Ready to discuss ${service.name.toLowerCase()} for your organization?`}
              />

              <div className="mt-8 space-y-4">
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/[^0-9]/g, "")}`}
                  className="flex items-center gap-3 text-[#555555] hover:text-[#C9A84C] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#FBF6E9] flex items-center justify-center">
                    <Phone className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <span>{CONTACT_INFO.phone}</span>
                </a>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-3 text-[#555555] hover:text-[#C9A84C] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#FBF6E9] flex items-center justify-center">
                    <Mail className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <span>{CONTACT_INFO.email}</span>
                </a>
                <div className="flex items-start gap-3 text-[#555555]">
                  <div className="w-10 h-10 rounded-lg bg-[#FBF6E9] flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <span>{CONTACT_INFO.address}</span>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {isSubmitted ? (
                <div className="bg-white rounded-xl p-8 border border-[#DDDDDD] text-center">
                  <div className="w-16 h-16 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-[#5A7247]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-[#555555]">
                    We&apos;ll get back to you within 24 business hours.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-xl p-6 lg:p-8 border border-[#DDDDDD]"
                >
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-[#1A1A1A] mb-1"
                      >
                        Your Name
                      </label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#1A1A1A] mb-1"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="organization"
                        className="block text-sm font-medium text-[#1A1A1A] mb-1"
                      >
                        Organization
                      </label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-[#1A1A1A] mb-1"
                      >
                        Tell us about your needs
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                      size="lg"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/services">
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              View All Services
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
