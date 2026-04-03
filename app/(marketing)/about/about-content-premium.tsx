'use client'

/**
 * Forever Forward About Page - Premium Redesign
 *
 * A story-driven about page featuring:
 * - Full-bleed hero with authentic imagery
 * - Founder story with real photos
 * - Visual timeline
 * - Mission pillars with better visual interest
 */

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Users,
  Heart,
  Target,
  Rocket,
  Building2,
  GraduationCap,
  Quote,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const MISSION_PILLARS = [
  {
    icon: Users,
    title: 'Empower Fathers',
    description: 'Equipping Black fathers with in-demand tech skills and leadership training.',
    color: 'gold' as const,
  },
  {
    icon: Heart,
    title: 'Strengthen Families',
    description: 'Building stronger bonds through events, resources, and community support.',
    color: 'olive' as const,
  },
  {
    icon: Rocket,
    title: 'Inspire Youth',
    description: 'Introducing young people to tech careers with hands-on training.',
    color: 'gold' as const,
  },
  {
    icon: Building2,
    title: 'Serve Nonprofits',
    description: 'Enterprise-level IT for mission-driven organizations.',
    color: 'olive' as const,
  },
]

const TIMELINE = [
  { year: '2023', title: 'Forever Forward Founded', description: 'TJ Wilform launches Forever Forward in Los Angeles' },
  { year: '2023', title: 'First Cohort Graduates', description: 'Inaugural Father Forward program graduates' },
  { year: '2024', title: 'IT Services Launch', description: 'Serving nonprofits across LA and Inland Empire' },
  { year: '2024', title: 'Travis AI Introduced', description: '24/7 AI-powered support for participants' },
  { year: '2025', title: 'Expanding Impact', description: 'Growing programs and workforce pool' },
]

export function AboutContentPremium() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(heroScroll, [0, 1], [0, 100])
  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0])

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] bg-[#1A1A1A] flex items-center overflow-hidden"
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/authentic/fathers/father-child-shoulders.jpg"
            alt="Father and child - Forever Forward empowers families"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C] text-sm font-medium mb-6">
              Our Story
            </span>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              From{' '}
              <span className="text-[#C9A84C]">Compton</span>
              <br />
              to the Cloud
            </h1>

            <p className="text-xl text-white/70 leading-relaxed">
              A 501(c)(3) nonprofit built on the belief that technology can transform lives—when paired with community, mentorship, and opportunity.
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAF8] to-transparent" />
      </section>

      {/* Mission Pillars */}
      <section className="py-24 lg:py-32 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
              Our <span className="text-[#C9A84C]">Mission</span>
            </h2>
            <p className="text-[#555555] text-lg max-w-2xl mx-auto">
              Four pillars guiding everything we do.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MISSION_PILLARS.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full bg-white rounded-2xl p-6 border border-[#DDDDDD] hover:border-[#C9A84C] hover:shadow-lg transition-all duration-300">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                    pillar.color === 'gold' ? 'bg-[#FBF6E9]' : 'bg-[#EFF4EB]'
                  }`}>
                    <pillar.icon className={`h-7 w-7 ${
                      pillar.color === 'gold' ? 'text-[#C9A84C]' : 'text-[#5A7247]'
                    }`} />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{pillar.title}</h3>
                  <p className="text-[#555555] text-sm leading-relaxed">{pillar.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src="/images/brand/founderpic.jpg"
                  alt="Thomas 'TJ' Wilform, Founder of Forever Forward"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Quote card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -bottom-8 -right-8 lg:-right-12 bg-[#1A1A1A] rounded-xl p-5 max-w-xs shadow-2xl"
              >
                <Quote className="h-6 w-6 text-[#C9A84C] mb-3" />
                <p className="text-white text-sm italic leading-relaxed">
                  "I know firsthand how hard it is to find resources when you're a dad going it alone."
                </p>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-sm font-medium text-[#C9A84C] uppercase tracking-wider">
                Meet the Founder
              </span>

              <h2 className="text-4xl font-bold text-[#1A1A1A] mt-3 mb-6">
                Thomas "TJ" Wilform
              </h2>

              <div className="space-y-4 text-[#555555] leading-relaxed">
                <p>
                  A <strong className="text-[#1A1A1A]">Compton native</strong>, former enterprise data center engineer, and single father who turned his career in technology into a mission to uplift his community.
                </p>
                <p>
                  After years building and managing IT infrastructure for major corporations, TJ saw an opportunity: the same skills that transformed his life could transform others—especially fathers like him who needed a path forward.
                </p>
                <p>
                  In 2023, he founded Forever Forward with a unique <strong className="text-[#1A1A1A]">dual-engine model</strong>: train fathers and youth in tech, then deploy them to serve nonprofits. The revenue funds the programs—creating a self-sustaining cycle of empowerment.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2 text-sm text-[#888888]">
                  <CheckCircle className="h-4 w-4 text-[#5A7247]" />
                  <span>Enterprise IT Background</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#888888]">
                  <CheckCircle className="h-4 w-4 text-[#5A7247]" />
                  <span>Single Father</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#888888]">
                  <CheckCircle className="h-4 w-4 text-[#5A7247]" />
                  <span>Compton Native</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 lg:py-32 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Our <span className="text-[#C9A84C]">Journey</span>
            </h2>
            <p className="text-white/60 text-lg">
              From founding to growing impact.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#C9A84C] via-[#5A7247] to-[#C9A84C]/30" />

            <div className="space-y-12">
              {TIMELINE.map((event, index) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-start gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#C9A84C] border-4 border-[#1A1A1A]" />

                  {/* Content */}
                  <div className={`ml-20 lg:ml-0 lg:w-[calc(50%-2rem)] ${
                    index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8'
                  }`}>
                    <span className="text-[#C9A84C] font-bold">{event.year}</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2">{event.title}</h3>
                    <p className="text-white/60">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dual Engine Model */}
      <section className="py-24 lg:py-32 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
              The Dual-Engine <span className="text-[#5A7247]">Model</span>
            </h2>
            <p className="text-[#555555] text-lg max-w-2xl mx-auto">
              A self-sustaining cycle of empowerment.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Engine 1 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-white rounded-2xl p-8 border border-[#DDDDDD]"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#FBF6E9] flex items-center justify-center mb-6">
                <GraduationCap className="h-8 w-8 text-[#C9A84C]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                Engine 1: Programs
              </h3>
              <p className="text-[#555555] leading-relaxed mb-6">
                We train Black fathers and youth with Google IT certifications, hands-on experience, and leadership skills. Graduates join our workforce pool—ready to serve.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Father Forward', 'Tech-Ready Youth', 'Making Moments'].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-[#FBF6E9] text-[#A68A2E] text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Engine 2 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 border border-[#DDDDDD]"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#EFF4EB] flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-[#5A7247]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                Engine 2: IT Services
              </h3>
              <p className="text-[#555555] leading-relaxed mb-6">
                Our graduates serve nonprofits and schools with enterprise-level IT services. The revenue generated funds our programs—completing the cycle.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Managed IT', 'Software & AI', 'Low Voltage'].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-[#EFF4EB] text-[#3D5030] text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Connecting arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center mt-8"
          >
            <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-[#1A1A1A] text-white">
              <span className="text-[#C9A84C] font-semibold">Revenue</span>
              <ArrowRight className="h-5 w-5" />
              <span className="text-[#5A7247] font-semibold">Programs</span>
              <ArrowRight className="h-5 w-5" />
              <span className="text-[#C9A84C] font-semibold">Repeat</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-6">
              Ready to Move <span className="text-[#C9A84C]">Forward</span>?
            </h2>
            <p className="text-[#555555] text-lg mb-10 max-w-xl mx-auto">
              Whether you want to join a program, get IT services, or support our mission—there's a place for you.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="group">
                <Link href="/programs">
                  Explore Programs
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="group">
                <Link href="/services">
                  IT Services
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="group text-[#C9A84C]">
                <Link href="/get-involved/donate">
                  Donate
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
