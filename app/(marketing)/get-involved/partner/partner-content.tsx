"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Handshake,
  Building2,
  Briefcase,
  Heart,
  School,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { routeFormSubmission } from "@/lib/actions/lead-routing";

const partnershipTypes = [
  {
    icon: Heart,
    title: "Community Organizations",
    description:
      "Fellow nonprofits joining forces — co-run programs, share tech know-how, and build community apps together.",
    benefits: [
      "Community apps built together",
      "Shared AI & tech know-how",
      "Co-hosted programs and events",
      "Cross-referrals for families",
    ],
  },
  {
    icon: Briefcase,
    title: "Employers & Trade Programs",
    description:
      "Hire Career Forward graduates or host apprenticeships in IT, skilled trades, and auto/EV.",
    benefits: [
      "Access to trained, motivated talent",
      "Apprenticeship pipelines",
      "Reduced hiring costs",
      "Community goodwill",
    ],
  },
  {
    icon: Building2,
    title: "Sponsors",
    description:
      "Fund a cohort of fathers, a robotics workshop, or a family event — and see exactly where it lands.",
    benefits: [
      "Name a cohort or event",
      "Recognition at events",
      "Employee volunteer days",
      "Transparent impact reporting",
    ],
  },
  {
    icon: School,
    title: "Schools",
    description:
      "Host Future Builders workshops — robotics, 3D printing, and satellite tracking on your campus.",
    benefits: [
      "Turnkey STEM workshops",
      "Robotics & 3D-printing gear provided",
      "Family engagement nights",
      "Pathways for graduating students",
    ],
  },
];

const currentPartners = [
  {
    name: "A New Day Foundation",
    logo: "/images/partners/a-new-day-foundation.png",
    url: "https://anewdayfoundation.net/",
  },
  {
    name: "Google.org",
    logo: "/images/partners/google.svg",
    url: "https://www.google.org/",
  },
  {
    name: "Microsoft Philanthropies",
    logo: "/images/partners/microsoft.svg",
    url: "https://www.microsoft.com/en-us/corporate-responsibility/philanthropies",
  },
  {
    name: "Los Angeles Unified School District",
    logo: "/images/partners/lausd.png",
    url: "https://www.lausd.org/",
  },
];

export function PartnerContent() {
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

    try {
      // Split name into first and last
      const nameParts = formData.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const result = await routeFormSubmission({
        formType: "partner",
        formData: {
          firstName,
          lastName,
          email: formData.email,
          organization: formData.organization,
          title: formData.title || undefined,
          partnershipType: formData.partnershipType,
          message: formData.message,
          source: "partner_form",
        },
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
      <section className="relative min-h-[60vh] lg:min-h-[70vh] bg-[#141413] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 grain-overlay">
          <Image
            src="/images/future/community-builders.jpg"
            alt="Nonprofit leaders collaborating around a touchscreen reviewing a community app"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141413] via-[#141413]/80 to-[#141413]/40" />
        </div>
        <div className="absolute inset-0 bg-starfield opacity-50" aria-hidden />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#C9A84C] mb-6">
              <span className="inline-block h-px w-8 bg-current opacity-60" />
              <Handshake className="h-4 w-4" />
              Join Forces
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Stronger{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C]">
                Together
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80">
              We don&apos;t do vendors and clients — we do allies. Community
              organizations, employers, sponsors, and schools joining forces so the
              whole neighborhood levels up.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Partnership Types */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Four Ways to Join Forces"
            subtitle="Pick the lane that fits your organization — or invent a fifth. We're flexible like that."
            centered
          />

          <div className="grid md:grid-cols-2 gap-6 mt-12">
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
                Why Join Forces With{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
                  Forever Forward?
                </span>
              </h2>
              <p className="text-[#555555] leading-relaxed mb-6">
                We&apos;re never selling — we&apos;re pooling strengths. We bring technical
                muscle, training pipelines, and future-tech gear; you bring roots,
                trust, and reach. When we combine them, fathers get careers, kids get
                exposure, and the whole community-resource space levels up.
              </p>
              <ul className="space-y-4">
                {[
                  "Measurable outcomes and transparent reporting",
                  "Community apps and shared tech — built with you, never sold to you",
                  "Tax-deductible contributions (501(c)(3))",
                  "Flexible partnership structures",
                  "A trained, motivated talent pool of program graduates",
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
                { value: "500+", label: "Fathers to Train" },
                { value: "5,000+", label: "Youth to Reach" },
                { value: "50+", label: "Events Every Year" },
                { value: "25+", label: "Partner Orgs Strong" },
              ].map((stat) => (
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
      <section className="relative py-16 lg:py-24 bg-[#141413] overflow-hidden">
        <div className="absolute inset-0 bg-starfield opacity-70" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              <motion.a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="aspect-[3/2] bg-white rounded-xl p-6 border border-[#444444] flex items-center justify-center hover:border-[#C9A84C] transition-all group"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={140}
                  height={50}
                  className="max-h-10 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </motion.a>
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
                    <option value="community_org">Community Organization</option>
                    <option value="employer">Employer / Trade Program</option>
                    <option value="sponsor">Sponsor</option>
                    <option value="school">School</option>
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
