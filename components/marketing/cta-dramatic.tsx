'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, GraduationCap, Server, Heart, Users, Handshake } from 'lucide-react'

export function CTADramatic() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-[#1A1A1A] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-[#C9A84C]/5 blur-[150px]" />
      </div>

      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            Ready to Move{' '}
            <span className="text-[#C9A84C]">Forward</span>?
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Whether you&apos;re here to grow, serve, or support—there&apos;s a path for you.
          </p>
        </motion.div>

        {/* Two primary paths */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Programs path */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Link href="/programs" className="group block h-full">
              <div className="relative h-full bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] rounded-2xl p-8 border border-white/10 hover:border-[#C9A84C]/50 transition-all duration-300 overflow-hidden">
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/0 to-[#C9A84C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-[#C9A84C]/10 flex items-center justify-center mb-6 group-hover:bg-[#C9A84C]/20 transition-colors">
                    <GraduationCap className="h-8 w-8 text-[#C9A84C]" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">
                    Join a Program
                  </h3>
                  <p className="text-white/60 mb-6">
                    Transform your career with IT certifications and real-world skills. Programs for fathers, youth, and families.
                  </p>

                  <div className="flex items-center gap-2 text-[#C9A84C] font-semibold">
                    <span>Explore Programs</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Services path */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Link href="/services" className="group block h-full">
              <div className="relative h-full bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] rounded-2xl p-8 border border-white/10 hover:border-[#5A7247]/50 transition-all duration-300 overflow-hidden">
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#5A7247]/0 to-[#5A7247]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-[#5A7247]/10 flex items-center justify-center mb-6 group-hover:bg-[#5A7247]/20 transition-colors">
                    <Server className="h-8 w-8 text-[#5A7247]" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">
                    Get IT Services
                  </h3>
                  <p className="text-white/60 mb-6">
                    Enterprise-level IT support for your nonprofit or school. Start with a free assessment.
                  </p>

                  <div className="flex items-center gap-2 text-[#5A7247] font-semibold">
                    <span>Learn More</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Secondary actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {[
            { icon: Heart, text: 'Donate', href: '/get-involved/donate', color: '#C9A84C' },
            { icon: Users, text: 'Volunteer', href: '/get-involved/volunteer', color: '#5A7247' },
            { icon: Handshake, text: 'Partner', href: '/get-involved/partner', color: '#C9A84C' },
          ].map((action) => (
            <Link
              key={action.text}
              href={action.href}
              className="group flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-all"
            >
              <action.icon className="h-4 w-4" style={{ color: action.color }} />
              <span className="font-medium">{action.text}</span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
