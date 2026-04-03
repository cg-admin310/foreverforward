'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Users, GraduationCap, Heart, Film, Sparkles, Gamepad2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Program {
  name: string
  slug: string
  tagline: string
  description: string
  audience: 'fathers' | 'youth' | 'families'
  icon: React.ElementType
  image: string
  duration?: string
  featured?: boolean
}

const PROGRAMS: Program[] = [
  {
    name: 'Father Forward',
    slug: 'father-forward',
    tagline: 'From unemployed to IT professional',
    description: 'An intensive 8-week program equipping Black fathers with Google IT certifications, hands-on skills, and leadership training.',
    audience: 'fathers',
    icon: GraduationCap,
    image: '/images/authentic/fathers/father-teaching-daughter.jpg',
    duration: '8 weeks',
    featured: true,
  },
  {
    name: 'Tech-Ready Youth',
    slug: 'tech-ready-youth',
    tagline: 'Next-gen tech talent',
    description: 'Young adults ages 16+ earn Google IT certifications and real-world experience.',
    audience: 'youth',
    icon: Sparkles,
    image: '/images/authentic/tech/it-professional-server-room.jpg',
    duration: '8 weeks',
  },
  {
    name: 'Making Moments',
    slug: 'making-moments',
    tagline: 'Movies on the Menu',
    description: 'Monthly dinner-and-movie events where fathers bond with their children.',
    audience: 'families',
    icon: Film,
    image: '/images/authentic/fathers/father-child-shoulders.jpg',
  },
  {
    name: 'Stories from My Future',
    slug: 'stories-from-my-future',
    tagline: 'Imagination meets technology',
    description: 'Kids create stories, then bring them to life with AI and 3D printing.',
    audience: 'youth',
    icon: Sparkles,
    image: '/images/authentic/fathers/father-with-baby.jpg',
  },
  {
    name: 'From Script to Screen',
    slug: 'from-script-to-screen',
    tagline: 'Filmmaking for young creators',
    description: 'Students learn filmmaking with Dawnn Lewis and Unreal Engine.',
    audience: 'youth',
    icon: Film,
    image: '/images/authentic/family/father-three-children.jpg',
  },
  {
    name: 'LULA Academy',
    slug: 'lula',
    tagline: 'Level Up Learning Academy',
    description: 'Gamified STEM platform making learning fun and engaging.',
    audience: 'youth',
    icon: Gamepad2,
    image: '/images/authentic/fathers/father-daughter-selfie.jpg',
  },
]

function ProgramCardFeatured({ program }: { program: Program }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="col-span-full"
    >
      <Link href={`/programs/${program.slug}`} className="group block">
        <div className="relative bg-[#1A1A1A] rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Image side */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full">
              <Image
                src={program.image}
                alt={program.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#1A1A1A] hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent lg:hidden" />
            </div>

            {/* Content side */}
            <div className="relative p-8 lg:p-12 flex flex-col justify-center">
              {/* Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] text-xs font-semibold uppercase tracking-wider">
                  Flagship Program
                </span>
                {program.duration && (
                  <span className="text-white/50 text-sm">{program.duration}</span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {program.name}
              </h3>

              {/* Tagline */}
              <p className="text-xl text-[#C9A84C] font-medium mb-4">
                {program.tagline}
              </p>

              {/* Description */}
              <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-md">
                {program.description}
              </p>

              {/* CTA */}
              <div className="flex items-center gap-3 text-white group-hover:text-[#C9A84C] transition-colors">
                <span className="font-semibold">Learn More</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </div>

              {/* Decorative element */}
              <div className="absolute top-8 right-8 w-24 h-24 opacity-10">
                <program.icon className="w-full h-full text-[#C9A84C]" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function ProgramCard({ program, index }: { program: Program; index: number }) {
  const isLarge = index === 1 || index === 3
  const audienceColors = {
    fathers: { bg: 'bg-[#FBF6E9]', text: 'text-[#A68A2E]', border: 'group-hover:border-[#C9A84C]' },
    youth: { bg: 'bg-[#EFF4EB]', text: 'text-[#3D5030]', border: 'group-hover:border-[#5A7247]' },
    families: { bg: 'bg-[#FBF6E9]', text: 'text-[#A68A2E]', border: 'group-hover:border-[#C9A84C]' },
  }
  const colors = audienceColors[program.audience]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={isLarge ? 'lg:col-span-2' : ''}
    >
      <Link href={`/programs/${program.slug}`} className="group block h-full">
        <div className={`relative h-full bg-white rounded-2xl overflow-hidden border border-[#DDDDDD] ${colors.border} shadow-sm hover:shadow-xl transition-all duration-300`}>
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={program.image}
              alt={program.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={isLarge ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 100vw, 33vw'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/50 via-transparent to-transparent" />

            {/* Audience badge */}
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                {program.audience === 'fathers' && <Users className="h-3 w-3" />}
                {program.audience === 'youth' && <Sparkles className="h-3 w-3" />}
                {program.audience === 'families' && <Heart className="h-3 w-3" />}
                {program.audience.charAt(0).toUpperCase() + program.audience.slice(1)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#C9A84C] transition-colors">
              {program.name}
            </h3>
            <p className="text-[#555555] text-sm leading-relaxed mb-4">
              {program.tagline}
            </p>

            <div className="flex items-center gap-2 text-sm font-medium text-[#888888] group-hover:text-[#C9A84C] transition-colors">
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function ProgramsMasonry() {
  const featuredProgram = PROGRAMS.find(p => p.featured)
  const otherPrograms = PROGRAMS.filter(p => !p.featured)

  return (
    <section className="py-24 lg:py-32 bg-[#EFF4EB] relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #5A7247 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5A7247]/10 text-[#3D5030] text-sm font-medium mb-4">
            <GraduationCap className="h-4 w-4" />
            Our Programs
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
            Every Program Builds{' '}
            <span className="text-[#5A7247]">Leaders</span>
          </h2>
          <p className="text-[#555555] text-lg max-w-2xl mx-auto">
            From workforce development to family enrichment, our programs uplift every member of the community.
          </p>
        </motion.div>

        {/* Programs grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured program - full width */}
          {featuredProgram && <ProgramCardFeatured program={featuredProgram} />}

          {/* Other programs - masonry layout */}
          {otherPrograms.map((program, index) => (
            <ProgramCard key={program.slug} program={program} index={index} />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Button asChild size="lg" className="group">
            <Link href="/programs">
              View All Programs
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
