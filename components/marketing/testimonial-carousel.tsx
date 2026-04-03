'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

interface Testimonial {
  quote: string
  name: string
  role: string
  image?: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "This program changed everything for me. I went from unemployed to making $75K in IT within 6 months. My daughter tells everyone her dad works in tech now.",
    name: "Marcus Thompson",
    role: "Father Forward Graduate '23",
  },
  {
    quote: "I was out here hustling with no direction. TJ and the team showed me a whole different path. Now I can actually provide for my kids the right way.",
    name: "Darnell Washington",
    role: "Father Forward Graduate '24",
  },
  {
    quote: "Real talk—I almost gave up. But these folks believed in me when I didn't believe in myself. Got my certification, got the job. My son sees a different future now.",
    name: "Jerome Mitchell",
    role: "Father Forward Graduate '23",
  },
]

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const next = () => {
    setCurrent((prev) => (prev + 1) % TESTIMONIALS.length)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(next, 6000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isAutoPlaying])

  const handleManualNav = (direction: 'prev' | 'next') => {
    setIsAutoPlaying(false)
    if (direction === 'prev') prev()
    else next()
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="py-24 lg:py-32 bg-[#1A1A1A] relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '48px 48px',
        }} />
      </div>

      {/* Large quote icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.05, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-12 left-12 lg:left-24"
      >
        <Quote className="w-32 h-32 lg:w-48 lg:h-48 text-[#C9A84C]" fill="currentColor" />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-sm font-medium">
            Testimonials
          </span>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              {/* Quote */}
              <blockquote className="text-2xl lg:text-4xl font-medium text-white leading-relaxed mb-10">
                &ldquo;{TESTIMONIALS[current].quote}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="flex flex-col items-center gap-2">
                {/* Avatar placeholder */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#5A7247] flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-xl">
                    {TESTIMONIALS[current].name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <p className="text-white font-semibold text-lg">
                  {TESTIMONIALS[current].name}
                </p>
                <p className="text-[#C9A84C]">
                  {TESTIMONIALS[current].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-8 mt-12">
            {/* Prev button */}
            <button
              onClick={() => handleManualNav('prev')}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-3">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false)
                    setCurrent(index)
                    setTimeout(() => setIsAutoPlaying(true), 10000)
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === current
                      ? 'bg-[#C9A84C] w-8'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={() => handleManualNav('next')}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
