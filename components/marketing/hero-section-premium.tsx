'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Server, GraduationCap, CheckCircle, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSectionPremium() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const textY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 50])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] bg-[#1A1A1A] overflow-hidden"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient orbs - subtle */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#C9A84C]/5 blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#5A7247]/5 blur-[120px]" />

      {/* Main content - Split screen */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: Text Content */}
            <motion.div
              style={{ y: textY, opacity }}
              className="order-2 lg:order-1 pt-24 lg:pt-0"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A84C]" />
                  </span>
                  <span className="text-sm text-white/70">501(c)(3) Nonprofit</span>
                  <span className="w-px h-3 bg-white/20" />
                  <span className="text-sm text-[#C9A84C]">Los Angeles</span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-white leading-[1.1] tracking-tight mb-6"
              >
                <span className="block">From Compton</span>
                <span className="block">
                  to the{' '}
                  <span className="relative inline-block">
                    <span className="text-[#C9A84C]">Cloud</span>
                    <motion.span
                      className="absolute -bottom-1 left-0 h-1 bg-[#C9A84C] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8, delay: 1 }}
                    />
                  </span>
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="text-lg lg:text-xl text-white/60 max-w-lg mb-10 leading-relaxed"
              >
                Workforce development for{' '}
                <span className="text-white">Black fathers and youth</span> +
                enterprise IT services for{' '}
                <span className="text-white">nonprofits and schools</span>.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Button asChild size="lg" className="group h-14 px-8 text-base">
                  <Link href="/programs">
                    Explore Programs
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base border-white/20 text-white hover:bg-white/10"
                >
                  <Link href="/services">
                    <Server className="mr-2 h-5 w-5 opacity-70" />
                    IT Services
                  </Link>
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-white/10"
              >
                {[
                  { icon: GraduationCap, text: 'Google IT Certified', color: '#C9A84C' },
                  { icon: CheckCircle, text: '92% Job Placement', color: '#5A7247' },
                  { icon: Users, text: '50+ Graduates', color: '#C9A84C' },
                ].map((item, i) => (
                  <div key={item.text} className="flex items-center gap-2 text-white/50 text-sm">
                    <item.icon className="h-4 w-4" style={{ color: item.color }} />
                    <span>{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Hero Image */}
            <motion.div
              style={{ y: imageY }}
              className="order-1 lg:order-2 relative"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Main image container */}
                <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden">
                  {/* Gold accent frame */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#C9A84C]/40 via-transparent to-[#5A7247]/40 rounded-2xl blur-sm" />

                  <div className="relative h-full rounded-2xl overflow-hidden border border-white/10">
                    <Image
                      src="/images/authentic/fathers/father-teaching-daughter.jpg"
                      alt="Black father helping his daughter with learning - Forever Forward empowers families"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />

                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent" />

                    {/* Film grain texture */}
                    <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay">
                      <div className="h-full w-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                      }} />
                    </div>
                  </div>
                </div>

                {/* Floating accent card */}
                <motion.div
                  initial={{ opacity: 0, y: 20, x: -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="absolute -bottom-6 -left-6 lg:-left-12 bg-white rounded-xl p-4 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FBF6E9] to-[#E8D48B]/30 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">Building Futures</p>
                      <p className="text-sm text-[#888888]">One family at a time</p>
                    </div>
                  </div>
                </motion.div>

                {/* Stats pill */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="absolute top-6 -right-4 lg:-right-8 bg-[#1A1A1A] rounded-full px-4 py-2 border border-[#C9A84C]/30"
                >
                  <span className="text-[#C9A84C] font-bold">Since 2023</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAF8] to-transparent" />
    </section>
  )
}
