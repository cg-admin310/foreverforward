'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { Users, TrendingUp, DollarSign, Building2 } from 'lucide-react'

interface StatItem {
  value: number
  suffix: string
  label: string
  sublabel: string
  icon: React.ElementType
  color: 'gold' | 'olive'
}

const STATS: StatItem[] = [
  {
    value: 500,
    suffix: '+',
    label: 'Fathers Empowered',
    sublabel: 'Lives transformed through tech education',
    icon: Users,
    color: 'gold',
  },
  {
    value: 92,
    suffix: '%',
    label: 'Job Placement',
    sublabel: 'Graduates employed within 6 months',
    icon: TrendingUp,
    color: 'olive',
  },
  {
    value: 2.5,
    suffix: 'M',
    label: 'Revenue Generated',
    sublabel: 'IT services funding our mission',
    icon: DollarSign,
    color: 'gold',
  },
  {
    value: 25,
    suffix: '+',
    label: 'Organizations Served',
    sublabel: 'Nonprofits & schools protected',
    icon: Building2,
    color: 'olive',
  },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const start = 0
    const end = value
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out expo
      const easeOut = 1 - Math.pow(2, -10 * progress)
      const current = start + (end - start) * easeOut

      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value])

  const formatValue = (val: number) => {
    if (suffix === 'M') return val.toFixed(1)
    if (suffix === '%') return Math.round(val)
    return Math.round(val)
  }

  return (
    <span ref={ref} className="tabular-nums">
      {formatValue(displayValue)}{suffix}
    </span>
  )
}

export function ImpactTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section className="py-24 lg:py-32 bg-[#FAFAF8] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1A1A1A 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 text-[#A68A2E] text-sm font-medium mb-4">
            Our Impact
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
            What We&apos;re{' '}
            <span className="text-[#C9A84C]">Building Toward</span>
          </h2>
          <p className="text-[#555555] text-lg max-w-2xl mx-auto">
            Every number represents a life changed, a family strengthened, a community uplifted.
          </p>
        </motion.div>

        {/* Timeline container */}
        <div ref={containerRef} className="relative">
          {/* Connecting line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent origin-left hidden lg:block"
          />

          {/* Stats grid - staggered positioning */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative ${index % 2 === 0 ? 'lg:-translate-y-8' : 'lg:translate-y-8'}`}
              >
                {/* Connection dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.5 + index * 0.15, duration: 0.4 }}
                  className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full hidden lg:block ${
                    stat.color === 'gold' ? 'bg-[#C9A84C]' : 'bg-[#5A7247]'
                  } ${index % 2 === 0 ? 'bottom-[-2.5rem]' : 'top-[-2.5rem]'}`}
                >
                  {/* Pulse ring */}
                  <span className={`absolute inset-0 rounded-full animate-ping ${
                    stat.color === 'gold' ? 'bg-[#C9A84C]/30' : 'bg-[#5A7247]/30'
                  }`} />
                </motion.div>

                {/* Card */}
                <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#DDDDDD] hover:shadow-lg hover:border-[#C9A84C] transition-all duration-300">
                  {/* Hover accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity ${
                    stat.color === 'gold' ? 'bg-[#C9A84C]' : 'bg-[#5A7247]'
                  }`} />

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    stat.color === 'gold' ? 'bg-[#FBF6E9]' : 'bg-[#EFF4EB]'
                  }`}>
                    <stat.icon className={`h-6 w-6 ${
                      stat.color === 'gold' ? 'text-[#C9A84C]' : 'text-[#5A7247]'
                    }`} />
                  </div>

                  {/* Number */}
                  <div className={`text-4xl lg:text-5xl font-bold mb-2 ${
                    stat.color === 'gold' ? 'text-[#C9A84C]' : 'text-[#5A7247]'
                  }`}>
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Labels */}
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-[#888888]">
                    {stat.sublabel}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
