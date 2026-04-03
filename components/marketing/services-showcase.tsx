'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Server, Code, Cable, Camera, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SERVICES = [
  { icon: Server, name: 'Managed IT', desc: '24/7 monitoring & support' },
  { icon: Code, name: 'Software & AI', desc: 'Custom solutions' },
  { icon: Cable, name: 'Structured Cabling', desc: 'Network infrastructure' },
  { icon: Camera, name: 'CCTV & Security', desc: 'Professional installation' },
]

export function ServicesShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-[#1A1A1A] relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#C9A84C]/5 blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#5A7247]/5 blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C] text-sm font-medium mb-4">
            <Server className="h-4 w-4" />
            IT Services
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Enterprise IT.{' '}
            <span className="text-[#C9A84C]">Nonprofit Heart.</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Corporate-level infrastructure for organizations that serve the community.
          </p>
        </motion.div>

        {/* Main content - Image + Services */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              {/* Frame accent */}
              <div className="absolute -inset-1 bg-gradient-to-br from-[#C9A84C]/30 via-transparent to-[#5A7247]/30 rounded-2xl blur-sm" />

              <div className="relative h-full rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/images/authentic/tech/it-professional-server-room.jpg"
                  alt="IT professional managing server infrastructure"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 via-transparent to-transparent" />
              </div>
            </div>

            {/* Stats card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-6 -right-6 lg:-right-12 bg-white rounded-xl p-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#EFF4EB] flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-[#5A7247]" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A]">25+ Organizations</p>
                  <p className="text-sm text-[#888888]">Protected & served</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Services list */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="space-y-4">
              {SERVICES.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Link
                    href={`/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#C9A84C]/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center shrink-0 group-hover:bg-[#C9A84C]/20 transition-colors">
                      <service.icon className="h-6 w-6 text-[#C9A84C]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-[#C9A84C] transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-white/50 text-sm">{service.desc}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-[#C9A84C] group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Testimonial quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 p-6 rounded-xl bg-white/5 border-l-4 border-[#C9A84C]"
            >
              <p className="text-white/70 italic mb-3">
                &ldquo;Forever Forward reduced our IT costs by 40% while actually improving our service quality. They understand nonprofits.&rdquo;
              </p>
              <p className="text-[#C9A84C] font-medium text-sm">
                — Director, LA Community Foundation
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-8"
            >
              <Button asChild size="lg" className="group">
                <Link href="/services/free-assessment">
                  Get Free IT Assessment
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Partner logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1 }}
          className="mt-20 pt-12 border-t border-white/10"
        >
          <p className="text-center text-white/40 text-sm mb-8">Trusted technology partners</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {['Microsoft', 'Google', 'Dell', 'SonicWall'].map((partner) => (
              <span key={partner} className="text-white/60 text-lg font-medium">
                {partner}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
