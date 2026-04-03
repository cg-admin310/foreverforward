'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AboutStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#C9A84C]/5 blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative">
              {/* Main image */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="/images/authentic/fathers/father-daughter-selfie.jpg"
                  alt="Father and daughter sharing a moment - Forever Forward empowers families"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/30 via-transparent to-transparent" />
              </div>

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-6 -right-6 lg:-right-12 bg-white rounded-xl p-5 shadow-2xl border border-[#DDDDDD]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FBF6E9] to-[#E8D48B]/30 flex items-center justify-center">
                    <GraduationCap className="h-7 w-7 text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#1A1A1A]">Google IT Certified</p>
                    <p className="text-sm text-[#888888]">Industry-recognized skills</p>
                  </div>
                </div>
              </motion.div>

              {/* Since badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -top-4 -left-4 bg-[#1A1A1A] rounded-xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#C9A84C] flex items-center justify-center">
                    <span className="text-[#1A1A1A] font-bold text-lg">FF</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Since 2023</p>
                    <p className="text-xs text-white/60">Los Angeles, CA</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[#C9A84C] uppercase tracking-wider mb-4">
              Who We Are
            </span>

            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-6 leading-tight">
              A Dual-Engine Model for{' '}
              <span className="relative inline-block">
                Sustainable
                <motion.span
                  className="absolute -bottom-1 left-0 h-1 bg-[#C9A84C] rounded-full"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: '100%' } : { width: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>{' '}
              Impact
            </h2>

            <div className="space-y-5 text-lg text-[#555555] leading-relaxed mb-8">
              <p>
                Forever Forward operates with a unique approach:{' '}
                <span className="text-[#1A1A1A] font-medium">
                  we train Black fathers and youth
                </span>{' '}
                with in-demand tech skills, then deploy them to serve nonprofit
                organizations and schools with enterprise IT services.
              </p>
              <p>
                The revenue from our IT services funds our programs—creating a{' '}
                <span className="text-[#C9A84C] font-semibold">
                  self-sustaining cycle of empowerment
                </span>.
              </p>
            </div>

            {/* Founder quote */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#FBF6E9] to-[#EFF4EB] border-l-4 border-[#C9A84C] mb-8">
              <p className="text-[#1A1A1A] italic">
                &ldquo;Founded by Thomas &apos;TJ&apos; Wilform—a Compton native, former
                enterprise data center engineer, and single father who knows
                firsthand how hard it is to find resources when you&apos;re a dad
                going it alone.&rdquo;
              </p>
            </div>

            <Button asChild variant="outline" size="lg" className="group">
              <Link href="/about">
                Read Our Full Story
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
