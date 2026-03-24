"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Handshake,
  Building2,
  GraduationCap,
  Users,
  Heart,
  Trophy,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";

const partnershipTypes = [
  {
    icon: Building2,
    title: "Corporate Sponsor",
    description:
      "Sponsor programs, events, or scholarships with your company's support.",
    benefits: [
      "Logo on program materials",
      "Recognition at events",
      "Employee volunteer opportunities",
      "Impact reporting",
    ],
  },
  {
    icon: GraduationCap,
    title: "Training Partner",
    description:
      "Provide internships, apprenticeships, or job placements for graduates.",
    benefits: [
      "Access to trained talent pool",
      "Customized training pipelines",
      "Reduced hiring costs",
      "Community goodwill",
    ],
  },
  {
    icon: Heart,
    title: "Community Partner",
    description:
      "Collaborate on events, share resources, or cross-refer participants.",
    benefits: [
      "Network expansion",
      "Shared event opportunities",
      "Resource exchange",
      "Aligned missions",
    ],
  },
];

const currentPartners = [
  "A New Day Foundation",
  "Google.org",
  "Microsoft Philanthropies",
  "Los Angeles USD",
];

export default function PartnerPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    title: "",
    partnershipType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Connect to Supabase leads
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] lg:min-h-[70vh] bg-[#1A1A1A] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/generated/partner-handshake.png"
            alt="Business partnership handshake"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-[#1A1A1A]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-sm text-white/80 mb-6">
              <Handshake className="h-4 w-4 text-[#C9A84C]" />
              Partnership Opportunities
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Let&apos;s Build{" "}
              <span className="text-[#C9A84C]">Together</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80">
              Partner with Forever Forward to create meaningful impact. Whether
              you&apos;re a corporation, nonprofit, or community organization, there&apos;s
              a way to collaborate.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Partnership Types */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Partnership Opportunities"
            subtitle="Multiple ways to collaborate and create impact together."
            centered
          />

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {partnershipTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-[#DDDDDD] hover:border-[#C9A84C] transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-[#FBF6E9] flex items-center justify-center mb-6">
                  <type.icon className="h-7 w-7 text-[#C9A84C]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">
                  {type.title}
                </h3>
                <p className="text-[#555555] text-sm mb-6">{type.description}</p>
                <ul className="space-y-2">
                  {type.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-center gap-2 text-sm text-[#555555]"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#5A7247]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-6">
                Why Partner With Forever Forward?
              </h2>
              <p className="text-[#555555] leading-relaxed mb-6">
                When you partner with us, you&apos;re not just writing a check—you&apos;re
                investing in a sustainable model that transforms lives and
                communities. Our dual-engine approach means your support creates
                lasting impact.
              </p>
              <ul className="space-y-4">
                {[
                  "Measurable outcomes and transparent reporting",
                  "Direct connection to the communities you serve",
                  "Tax-deductible contributions (501(c)(3))",
                  "Flexible partnership structures",
                  "Alignment with DEI and workforce development goals",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[#555555]"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#5A7247] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "500+", label: "Lives Changed" },
                { value: "25+", label: "Partner Orgs" },
                { value: "100%", label: "Transparency" },
                { value: "$0", label: "Wasted Impact" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-[#FBF6E9] rounded-xl p-6 text-center"
                >
                  <span className="text-3xl font-bold text-[#C9A84C]">
                    {stat.value}
                  </span>
                  <p className="text-[#555555] text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-16 lg:py-24 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Trophy className="h-12 w-12 text-[#C9A84C] mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
              Organizations That Believe in Our Mission
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentPartners.map((partner, index) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#2D2D2D] rounded-xl p-6 border border-[#444444] flex items-center justify-center"
              >
                <span className="text-white/70 text-sm font-medium text-center">
                  {partner}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Inquiry Form */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Start a Conversation"
            subtitle="Tell us about your organization and how you'd like to collaborate."
            centered
          />

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 bg-white rounded-xl p-8 text-center border border-[#DDDDDD]"
            >
              <div className="w-16 h-16 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-[#5A7247]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                Thank You for Your Interest!
              </h3>
              <p className="text-[#555555]">
                We&apos;ll review your inquiry and reach out within a few business
                days to discuss partnership opportunities.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="mt-12 bg-white rounded-xl p-6 lg:p-8 border border-[#DDDDDD]"
            >
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                      Your Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                      Organization
                    </label>
                    <Input
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
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                      Your Title
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Partnership Interest
                  </label>
                  <select
                    value={formData.partnershipType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        partnershipType: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    required
                  >
                    <option value="">Select a partnership type</option>
                    <option value="corporate">Corporate Sponsor</option>
                    <option value="training">Training Partner</option>
                    <option value="community">Community Partner</option>
                    <option value="other">Other / Not Sure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Tell us about your partnership ideas
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={4}
                    placeholder="What does your organization do, and how would you like to collaborate with Forever Forward?"
                    className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit Partnership Inquiry"}
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#FBF6E9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#555555]">
            Prefer to talk directly?{" "}
            <Link
              href="/contact"
              className="text-[#C9A84C] font-semibold hover:underline"
            >
              Contact us
            </Link>{" "}
            to schedule a call.
          </p>
        </div>
      </section>
    </>
  );
}
