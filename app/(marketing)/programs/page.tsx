"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, GraduationCap, Users, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProgramCard } from "@/components/marketing/program-card";
import { PROGRAMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type AudienceFilter = "all" | "fathers" | "youth" | "families" | "kids" | "students";

const audienceFilters: { id: AudienceFilter; label: string; icon: typeof Users }[] = [
  { id: "all", label: "All Programs", icon: Sparkles },
  { id: "fathers", label: "Fathers", icon: Users },
  { id: "youth", label: "Youth", icon: GraduationCap },
  { id: "families", label: "Families", icon: Heart },
  { id: "kids", label: "Kids", icon: Sparkles },
  { id: "students", label: "Students", icon: GraduationCap },
];

export default function ProgramsPage() {
  const [activeFilter, setActiveFilter] = useState<AudienceFilter>("all");

  const filteredPrograms = PROGRAMS.filter((program) => {
    if (activeFilter === "all") return true;
    return program.audience === activeFilter;
  });

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
              <GraduationCap className="h-4 w-4 text-[#C9A84C]" />
              Workforce Development & Enrichment
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Programs That{" "}
              <span className="text-[#C9A84C]">Transform Lives</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
              From IT certifications for fathers to creative workshops for kids,
              our programs are designed to empower every member of the family.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-[#FAFAF8] border-b border-[#DDDDDD] sticky top-16 lg:top-20 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            {audienceFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                  activeFilter === filter.id
                    ? "bg-[#C9A84C] text-[#1A1A1A]"
                    : "bg-white text-[#555555] border border-[#DDDDDD] hover:border-[#C9A84C] hover:text-[#C9A84C]"
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
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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
                <div className="col-span-full text-center py-12">
                  <p className="text-[#888888]">
                    No programs match this filter. Try selecting a different
                    audience.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Leadership Thread Callout */}
      <section className="py-16 lg:py-24 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Training Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
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
              </div>
              {/* Overlay stat */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#FBF6E9] flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#1A1A1A]">50+</p>
                    <p className="text-xs text-[#888888]">Graduates in 2025</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <span className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
                The Leadership Thread
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-6">
                Every Program Builds Leaders
              </h2>
              <p className="text-white/70 leading-relaxed mb-8">
                Whether it&apos;s a father learning IT skills or a child creating their
                first story, every Forever Forward program weaves in leadership
                development. We believe everyone has the potential to lead—in their
                families, workplaces, and communities.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-[#C9A84C] text-sm font-medium">
                <span className="px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444]">
                  Communication
                </span>
                <span className="px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444]">
                  Problem Solving
                </span>
                <span className="px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444]">
                  Teamwork
                </span>
                <span className="px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444]">
                  Responsibility
                </span>
                <span className="px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444]">
                  Empathy
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Travis AI Support */}
      <section className="py-16 lg:py-24 bg-[#EFF4EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-semibold text-[#5A7247] uppercase tracking-wider">
                AI-Powered Support
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-2 mb-6">
                Meet Travis, Your 24/7 Case Manager
              </h2>
              <p className="text-[#555555] leading-relaxed mb-6">
                Every participant in our workforce programs gets access to
                Travis—an AI assistant that provides study help, answers
                questions, connects you with resources, and offers encouragement
                whenever you need it.
              </p>
              <Button asChild>
                <Link href="/about/travis">
                  Learn About Travis
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg border border-[#DDDDDD]">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#DDDDDD]">
                  <div className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center">
                    <span className="text-[#1A1A1A] font-bold">T</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#1A1A1A]">Travis</p>
                    <p className="text-xs text-[#888888]">AI Case Manager</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="bg-[#F5F3EF] rounded-lg px-4 py-3 text-[#555555] text-sm">
                    Great progress on your subnetting practice! You&apos;ve
                    completed 80% of this week&apos;s labs. Ready for the final
                    challenge?
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-[#FBF6E9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4">
              Ready to Enroll?
            </h2>
            <p className="text-[#555555] mb-8">
              Take the first step toward transforming your future. Applications
              are open for all programs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/get-involved/enroll">Apply Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
