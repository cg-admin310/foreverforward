"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Heart,
  Target,
  Lightbulb,
  Award,
  Building2,
  Rocket,
  GraduationCap,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatCounter } from "@/components/marketing/stat-counter";
import { CONTACT_INFO, IMPACT_STATS } from "@/lib/constants";

const missionPillars = [
  {
    icon: Users,
    title: "Empower Fathers",
    description:
      "We equip Black fathers with in-demand tech skills and leadership training to become providers, role models, and community leaders.",
  },
  {
    icon: Heart,
    title: "Strengthen Families",
    description:
      "Through events, resources, and support systems, we help families build stronger bonds and create lasting memories together.",
  },
  {
    icon: Rocket,
    title: "Inspire Youth",
    description:
      "We introduce young people to tech careers early, providing hands-on training and real pathways to success.",
  },
  {
    icon: Building2,
    title: "Serve Nonprofits",
    description:
      "Our IT services bring enterprise-level technology to mission-driven organizations at nonprofit-friendly prices.",
  },
];

const timelineEvents = [
  {
    year: "2023",
    title: "Forever Forward Founded",
    description:
      "TJ Wilform launches Forever Forward in Los Angeles, combining his IT expertise with his passion for community empowerment.",
  },
  {
    year: "2023",
    title: "First Father Forward Cohort",
    description:
      "The inaugural Father Forward program graduates its first class of fathers with Google IT certifications.",
  },
  {
    year: "2024",
    title: "IT Services Launch",
    description:
      "Forever Forward begins serving nonprofits across Los Angeles and the Inland Empire with managed IT services, creating the sustainable revenue model.",
  },
  {
    year: "2024",
    title: "Travis AI Introduced",
    description:
      "The AI-powered case manager Travis launches, providing 24/7 support for program participants.",
  },
  {
    year: "2025",
    title: "Expanding Impact",
    description:
      "Growing the workforce pool, launching new programs, and scaling services to more communities.",
  },
];

export default function AboutPage() {
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
              Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              From Compton to the Cloud,{" "}
              <span className="text-[#C9A84C]">Forever Forward</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
              We&apos;re proving that workforce development and community service
              aren&apos;t just compatible—they&apos;re most powerful when combined.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-28 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-[#C9A84C]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1A1A1A]">Our Mission</h2>
              </div>
              <p className="text-[#555555] leading-relaxed text-lg">
                To empower Black fathers and youth with in-demand technology
                skills while providing enterprise IT services to nonprofits and
                schools—creating a self-sustaining cycle of education,
                employment, and community service.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#5A7247]/10 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-[#5A7247]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1A1A1A]">Our Vision</h2>
              </div>
              <p className="text-[#555555] leading-relaxed text-lg">
                A future where every father has the tools to provide, every
                young person has a pathway to tech careers, and every nonprofit
                has access to enterprise-level IT support.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Pillars */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What Drives Us"
            subtitle="Four interconnected pillars that guide everything we do."
            centered
          />

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 mt-12">
            {missionPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#FAFAF8] rounded-xl p-6 lg:p-8 border border-[#DDDDDD] hover:border-[#C9A84C] transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-[#FBF6E9] flex items-center justify-center mb-6">
                  <pillar.icon className="h-7 w-7 text-[#C9A84C]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">
                  {pillar.title}
                </h3>
                <p className="text-[#555555] leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual-Engine Model */}
      <section className="py-20 lg:py-28 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
              Our Approach
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
              The Dual-Engine Model
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Unlike traditional nonprofits that rely solely on donations, we
              generate sustainable revenue through IT services—then invest it
              back into our programs.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Engine 1: Programs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#2D2D2D] rounded-xl p-8 border border-[#444444]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-[#1A1A1A]" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Engine 1: Workforce Development
                </h3>
              </div>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-[#C9A84C]">→</span>
                  Train fathers and youth with IT certifications
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C9A84C]">→</span>
                  Provide leadership and soft skills development
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C9A84C]">→</span>
                  Graduates join our skilled workforce pool
                </li>
              </ul>
            </motion.div>

            {/* Engine 2: Services */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#2D2D2D] rounded-xl p-8 border border-[#444444]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#5A7247] flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Engine 2: IT Services
                </h3>
              </div>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-[#7A9A63]">→</span>
                  Deploy our workforce to serve nonprofits
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#7A9A63]">→</span>
                  Provide enterprise IT at nonprofit-friendly prices
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#7A9A63]">→</span>
                  Revenue funds more program cohorts
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Cycle Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-lg bg-[#FBF6E9]/10 text-[#C9A84C] font-medium">
              <Handshake className="h-5 w-5" />
              <span>The cycle sustains itself—and grows.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 lg:py-28 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Founder Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] overflow-hidden relative">
                <Image
                  src="/images/brand/founderpic.jpg"
                  alt="Thomas 'TJ' Wilform - Founder of Forever Forward"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {/* Decorative Quote */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -right-6 max-w-xs bg-white rounded-xl p-5 shadow-lg border border-[#DDDDDD]"
              >
                <p className="text-[#1A1A1A] italic text-sm leading-relaxed">
                  &ldquo;I&apos;ve seen what happens when fathers get the right
                  tools. Everything changes—for them, their kids, their
                  community.&rdquo;
                </p>
              </motion.div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
                Meet Our Founder
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-2 mb-6">
                Thomas &ldquo;TJ&rdquo; Wilform
              </h2>
              <div className="space-y-4 text-[#555555] leading-relaxed">
                <p>
                  TJ Wilform grew up in Compton, California—a community that
                  shaped his understanding of resilience, family, and the
                  transformative power of opportunity. He built his tech career
                  at Xeex Communication, the #2 Juniper Networks reseller in the
                  nation at the time, where he deployed large-scale data centers
                  for enterprise clients.
                </p>
                <p>
                  Everything changed when TJ became a single father. Suddenly
                  thrust into a world where he needed support, he discovered a
                  painful truth: resources for fathers raising children alone
                  were nearly nonexistent. Many organizations made him feel like
                  his daughter should be with her mother—which wasn&apos;t an
                  option for her safety. He was determined to be there for his
                  child while building a career that could provide.
                </p>
                <p>
                  Through perseverance, TJ stayed in tech, earned certifications,
                  and gained valuable experience. But he didn&apos;t stop there.
                  He started teaching friends from the neighborhood how to break
                  into IT—showing them the same path that had given him stability.
                  Watching their transformations sparked a bigger vision.
                </p>
                <p>
                  In 2023, TJ founded Forever Forward to solve the problems he
                  lived through: fathers without pathways, communities without
                  resources, and nonprofits without enterprise IT. The result is
                  an organization that doesn&apos;t just teach skills—it creates
                  jobs, serves the community, and sustains itself.
                </p>
              </div>

              <div className="mt-8 p-4 rounded-lg bg-[#FBF6E9] border border-[#E8D48B]">
                <p className="text-sm text-[#555555]">
                  <span className="font-medium text-[#1A1A1A]">Fun fact:</span>{" "}
                  TJ is also building CommonGround, an AI-powered co-parenting
                  app helping families navigate shared custody with less
                  conflict—inspired by his own journey as a father.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Goals */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Goals"
            subtitle="The impact we're working toward—help us reach these milestones."
            centered
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mt-12">
            {IMPACT_STATS.map((stat) => (
              <StatCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28 bg-[#EFF4EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Journey"
            subtitle="Key milestones in the Forever Forward story."
            centered
          />

          <div className="mt-12 relative">
            {/* Timeline Line */}
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-[#C9A84C]/30 -translate-x-1/2" />

            {/* Timeline Events */}
            <div className="space-y-8">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-start gap-6 ${
                    index % 2 === 0 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 lg:left-1/2 w-4 h-4 rounded-full bg-[#C9A84C] -translate-x-1/2 z-10" />

                  {/* Content */}
                  <div
                    className={`ml-12 lg:ml-0 lg:w-5/12 ${
                      index % 2 === 0 ? "lg:text-right lg:pr-12" : "lg:pl-12"
                    }`}
                  >
                    <span className="inline-block px-3 py-1 rounded-full bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold mb-2">
                      {event.year}
                    </span>
                    <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                      {event.title}
                    </h3>
                    <p className="text-[#555555]">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Partners"
            subtitle="Organizations that believe in our mission and help us grow."
            centered
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
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
            ].map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-[3/2] rounded-xl bg-white border border-[#DDDDDD] flex items-center justify-center p-6 hover:border-[#C9A84C] hover:shadow-md transition-all group"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={60}
                  className="max-h-12 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button asChild variant="outline">
              <Link href="/get-involved/partner">
                Become a Partner
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Travis AI Preview */}
      <section className="py-20 lg:py-28 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D2D2D] text-[#C9A84C] text-sm font-medium mb-4">
                <Award className="h-4 w-4" />
                AI-Powered Support
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Meet Travis, Your AI Case Manager
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Travis is our AI-powered support system that provides 24/7
                guidance to program participants. From answering questions about
                coursework to connecting people with resources, Travis is always
                there—kind, caring, and knowledgeable.
              </p>
              <Button asChild>
                <Link href="/about/travis">
                  Learn About Travis
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            {/* Chat Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#444444]">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#444444]">
                  <div className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center">
                    <span className="text-[#1A1A1A] font-bold">T</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Travis</p>
                    <p className="text-xs text-white/50">AI Case Manager</p>
                  </div>
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#7A9A63]" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-[#C9A84C] text-[#1A1A1A] rounded-lg rounded-br-sm px-4 py-2 max-w-[80%]">
                      Hey Travis, I&apos;m struggling with the networking module.
                    </div>
                  </div>
                  <div className="flex">
                    <div className="bg-[#444444] text-white rounded-lg rounded-bl-sm px-4 py-2 max-w-[80%]">
                      I hear you—networking can feel overwhelming at first. Let
                      me pull up some resources that break it down step by step.
                      Would you prefer a video walkthrough or a hands-on lab?
                    </div>
                  </div>
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
              Ready to Join the Movement?
            </h2>
            <p className="text-[#555555] mb-8">
              Whether you want to enroll in a program, partner with us, or
              explore our IT services—we&apos;d love to connect.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/get-involved/enroll">Enroll in a Program</Link>
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
