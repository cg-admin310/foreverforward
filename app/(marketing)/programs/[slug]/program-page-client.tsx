"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ProgramDetail } from "@/lib/data/programs";

interface ProgramPageClientProps {
  program: ProgramDetail;
}

export function ProgramPageClient({ program }: ProgramPageClientProps) {
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
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-5xl">{program.icon}</span>
              <Badge variant={program.audience} size="lg" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {program.name}
            </h1>
            <p className="text-xl sm:text-2xl text-[#C9A84C] font-medium mb-6">
              {program.tagline}
            </p>
            <p className="text-lg text-white/70 max-w-3xl mx-auto mb-8">
              {program.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/get-involved/enroll">Apply Now</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">Ask a Question</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* At a Glance */}
      <section className="py-12 bg-[#FBF6E9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            <div className="text-center">
              <Clock className="h-6 w-6 text-[#C9A84C] mx-auto mb-2" />
              <p className="text-sm text-[#888888]">Duration</p>
              <p className="font-semibold text-[#1A1A1A]">
                {program.atAGlance.duration}
              </p>
            </div>
            <div className="text-center">
              <MapPin className="h-6 w-6 text-[#C9A84C] mx-auto mb-2" />
              <p className="text-sm text-[#888888]">Format</p>
              <p className="font-semibold text-[#1A1A1A]">
                {program.atAGlance.format}
              </p>
            </div>
            <div className="text-center">
              <Calendar className="h-6 w-6 text-[#C9A84C] mx-auto mb-2" />
              <p className="text-sm text-[#888888]">Schedule</p>
              <p className="font-semibold text-[#1A1A1A]">
                {program.atAGlance.schedule}
              </p>
            </div>
            {program.atAGlance.ageRange && (
              <div className="text-center">
                <Users className="h-6 w-6 text-[#C9A84C] mx-auto mb-2" />
                <p className="text-sm text-[#888888]">Ages</p>
                <p className="font-semibold text-[#1A1A1A]">
                  {program.atAGlance.ageRange}
                </p>
              </div>
            )}
            <div className="text-center">
              <Award className="h-6 w-6 text-[#C9A84C] mx-auto mb-2" />
              <p className="text-sm text-[#888888]">Cost</p>
              <p className="font-semibold text-[#1A1A1A]">
                {program.atAGlance.cost}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Program Overview"
            subtitle="Everything you need to know about this program."
          />
          <div className="mt-8 space-y-6">
            {program.overview.map((paragraph, index) => (
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

      {/* Curriculum / Timeline */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What You'll Learn"
            subtitle="A structured curriculum designed for real-world success."
            centered
          />

          <div className="mt-12 relative">
            {/* Timeline Line */}
            <div className="absolute left-4 lg:left-8 top-0 bottom-0 w-0.5 bg-[#DDDDDD]" />

            <div className="space-y-8">
              {program.curriculum.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-12 lg:pl-20"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-2.5 lg:left-6.5 w-3 h-3 rounded-full bg-[#C9A84C] ring-4 ring-[#FBF6E9]" />

                  {/* Content */}
                  <div className="bg-[#FAFAF8] rounded-xl p-6 border border-[#DDDDDD]">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold">
                        {item.week ? `Week ${item.week}` : item.phase}
                      </span>
                      <h3 className="text-lg font-semibold text-[#1A1A1A]">
                        {item.title}
                      </h3>
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {item.topics.map((topic, topicIndex) => (
                        <li
                          key={topicIndex}
                          className="flex items-start gap-2 text-[#555555] text-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 text-[#5A7247] shrink-0 mt-0.5" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-16 lg:py-24 bg-[#EFF4EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What You'll Receive"
            subtitle="Everything included in this program."
            centered
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {program.deliverables.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-[#DDDDDD]"
              >
                <span className="text-3xl mb-4 block">{item.icon}</span>
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

      {/* Testimonial */}
      {program.testimonial && (
        <section className="py-16 lg:py-24 bg-[#1A1A1A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <Quote className="h-12 w-12 text-[#C9A84C]/30 mx-auto mb-6" />
              <blockquote className="text-xl sm:text-2xl text-white leading-relaxed mb-8">
                &ldquo;{program.testimonial.quote}&rdquo;
              </blockquote>
              <div>
                <p className="text-[#C9A84C] font-semibold">
                  {program.testimonial.name}
                </p>
                <p className="text-white/60 text-sm">
                  {program.testimonial.role}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-[#FBF6E9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4">
              Ready to Join {program.name}?
            </h2>
            <p className="text-[#555555] mb-8">
              Take the first step toward transforming your future. Applications
              are open now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/get-involved/enroll">Apply Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/programs">
                  View All Programs
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
