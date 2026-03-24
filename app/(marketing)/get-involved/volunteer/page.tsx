"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  Film,
  Server,
  Clock,
  Calendar,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";

const volunteerRoles = [
  {
    icon: GraduationCap,
    title: "Program Mentor",
    commitment: "4 hours/week",
    description:
      "Guide Father Forward or Tech-Ready Youth participants through their journey with encouragement and advice.",
  },
  {
    icon: Server,
    title: "IT Instructor",
    commitment: "2-4 hours/week",
    description:
      "Teach hands-on IT skills to program cohorts. Ideal for IT professionals who want to give back.",
  },
  {
    icon: Film,
    title: "Event Volunteer",
    commitment: "Flexible",
    description:
      "Help run Movies on the Menu and other community events—setup, registration, and cleanup.",
  },
  {
    icon: Users,
    title: "Career Coach",
    commitment: "2 hours/week",
    description:
      "Help participants with resume writing, interview prep, and job search strategies.",
  },
];

export default function VolunteerPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interests: [] as string[],
    availability: "",
    experience: "",
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

  const toggleInterest = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(role)
        ? prev.interests.filter((r) => r !== role)
        : [...prev.interests, role],
    }));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#2D2D2D]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-sm text-white/80 mb-6">
              <Users className="h-4 w-4 text-[#C9A84C]" />
              Join Our Team
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Give Your Time,{" "}
              <span className="text-[#C9A84C]">Change Lives</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
              Whether you have a few hours a month or want to commit weekly,
              there&apos;s a place for you at Forever Forward. Your skills and
              experience can transform someone&apos;s future.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Volunteer Roles */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Volunteer Opportunities"
            subtitle="Find the right fit for your skills and schedule."
            centered
          />

          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            {volunteerRoles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-[#DDDDDD] hover:border-[#C9A84C] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FBF6E9] flex items-center justify-center shrink-0">
                    <role.icon className="h-6 w-6 text-[#C9A84C]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
                      {role.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-[#888888] mb-3">
                      <Clock className="h-4 w-4" />
                      {role.commitment}
                    </div>
                    <p className="text-[#555555] text-sm">{role.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-6">
                Why Volunteer With Us?
              </h2>
              <ul className="space-y-4">
                {[
                  "Make a direct impact on fathers, youth, and families",
                  "Gain teaching and mentorship experience",
                  "Connect with a community of like-minded people",
                  "Flexible scheduling that works with your life",
                  "See the real results of your contribution",
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
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#5A7247] to-[#3D5030] flex items-center justify-center">
                <div className="text-center text-white/80">
                  <Heart className="h-20 w-20 mx-auto mb-4" />
                  <span className="font-semibold text-lg">Volunteer Image</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 lg:py-24 bg-[#EFF4EB]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Sign Up to Volunteer"
            subtitle="Tell us about yourself and how you'd like to help."
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
                We&apos;ll review your application and reach out within a week to
                discuss next steps.
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
                      Full Name
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

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                    Areas of Interest (select all that apply)
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {volunteerRoles.map((role) => (
                      <button
                        key={role.title}
                        type="button"
                        onClick={() => toggleInterest(role.title)}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-colors ${
                          formData.interests.includes(role.title)
                            ? "border-[#C9A84C] bg-[#FBF6E9]"
                            : "border-[#DDDDDD] hover:border-[#C9A84C]"
                        }`}
                      >
                        <role.icon className="h-4 w-4 text-[#C9A84C]" />
                        {role.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Availability
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    required
                  >
                    <option value="">Select your availability</option>
                    <option value="weekday-mornings">Weekday mornings</option>
                    <option value="weekday-evenings">Weekday evenings</option>
                    <option value="weekends">Weekends</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Relevant Experience
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    rows={4}
                    placeholder="Tell us about your background and why you want to volunteer..."
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
                  {isSubmitting ? "Submitting..." : "Submit Application"}
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
            Questions about volunteering?{" "}
            <Link
              href="/contact"
              className="text-[#C9A84C] font-semibold hover:underline"
            >
              Contact us
            </Link>{" "}
            and we&apos;ll be happy to help.
          </p>
        </div>
      </section>
    </>
  );
}
