/**
 * Custom Animation Hooks for Forever Forward
 * Premium scroll effects, parallax, and animated values
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  useAnimationFrame,
  MotionValue,
} from 'framer-motion'

// =============================================================================
// SCROLL REVEAL HOOK
// =============================================================================

interface UseScrollRevealOptions {
  threshold?: number
  once?: boolean
  rootMargin?: string
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { threshold = 0.1, once = true, rootMargin = '-50px' } = options
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once,
    margin: rootMargin as `${number}px ${number}px ${number}px ${number}px` | `${number}px`,
    amount: threshold,
  })

  return { ref, isInView }
}

// =============================================================================
// PARALLAX HOOK
// =============================================================================

interface UseParallaxOptions {
  speed?: number // 0.5 = half speed, 2 = double speed
  direction?: 'up' | 'down'
  offset?: ["start end" | "end start" | "start start" | "end end", "start end" | "end start" | "start start" | "end end"]
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.5, direction = 'up', offset } = options
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset || ["start end" as const, "end start" as const],
  })

  const multiplier = direction === 'up' ? -1 : 1
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [100 * speed * multiplier, -100 * speed * multiplier]
  )

  const smoothY = useSpring(y, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return { ref, y: smoothY }
}

// =============================================================================
// PARALLAX OPACITY HOOK
// =============================================================================

export function useParallaxOpacity() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1])
  const y = useTransform(scrollYProgress, [0, 1], [100, 0])

  return { ref, opacity, y }
}

// =============================================================================
// ANIMATED COUNTER HOOK
// =============================================================================

interface UseAnimatedCounterOptions {
  from?: number
  to: number
  duration?: number
  delay?: number
  decimals?: number
  easing?: (t: number) => number
}

// Custom easing functions
const easings = {
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
}

export function useAnimatedCounter(options: UseAnimatedCounterOptions) {
  const {
    from = 0,
    to,
    duration = 2000,
    delay = 0,
    decimals = 0,
    easing = easings.easeOutExpo,
  } = options

  const [count, setCount] = useState(from)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView || hasStarted) return

    const timeout = setTimeout(() => {
      setHasStarted(true)
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easing(progress)
        const currentValue = from + (to - from) * easedProgress

        setCount(Number(currentValue.toFixed(decimals)))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timeout)
  }, [isInView, hasStarted, from, to, duration, delay, decimals, easing])

  return { ref, count }
}

// =============================================================================
// MOUSE PARALLAX HOOK (3D Card Effect)
// =============================================================================

interface UseMouseParallaxOptions {
  intensity?: number // How much the element moves
  perspective?: number
}

export function useMouseParallax(options: UseMouseParallaxOptions = {}) {
  const { intensity = 10, perspective = 1000 } = options
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity])

  const smoothRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const smoothRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      x.set((e.clientX - centerX) / rect.width)
      y.set((e.clientY - centerY) / rect.height)
    },
    [x, y]
  )

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return {
    ref,
    style: {
      perspective,
      rotateX: smoothRotateX,
      rotateY: smoothRotateY,
      transformStyle: 'preserve-3d' as const,
    },
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  }
}

// =============================================================================
// SMOOTH SCROLL PROGRESS
// =============================================================================

export function useSmoothScrollProgress() {
  const { scrollYProgress } = useScroll()

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return smoothProgress
}

// =============================================================================
// SCROLL VELOCITY
// =============================================================================

export function useScrollVelocity() {
  const { scrollY } = useScroll()
  const [velocity, setVelocity] = useState(0)
  const prevScrollY = useRef(0)

  useAnimationFrame(() => {
    const currentScrollY = scrollY.get()
    const newVelocity = currentScrollY - prevScrollY.current
    setVelocity(newVelocity)
    prevScrollY.current = currentScrollY
  })

  return velocity
}

// =============================================================================
// TYPEWRITER EFFECT
// =============================================================================

interface UseTypewriterOptions {
  text: string
  speed?: number
  delay?: number
}

export function useTypewriter(options: UseTypewriterOptions) {
  const { text, speed = 50, delay = 0 } = options
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let currentIndex = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(interval)
          setIsComplete(true)
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [isInView, text, speed, delay])

  return { ref, displayText, isComplete }
}

// =============================================================================
// STAGGERED CHILDREN
// =============================================================================

export function useStaggeredChildren(itemCount: number, baseDelay = 0.1) {
  return Array.from({ length: itemCount }, (_, i) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: baseDelay * i,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }))
}

// =============================================================================
// MAGNETIC EFFECT (For buttons/icons)
// =============================================================================

interface UseMagneticOptions {
  strength?: number
  radius?: number
}

export function useMagnetic(options: UseMagneticOptions = {}) {
  const { strength = 0.3, radius = 100 } = options
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const smoothX = useSpring(x, { stiffness: 150, damping: 15 })
  const smoothY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const distance = Math.sqrt(distX * distX + distY * distY)

      if (distance < radius) {
        const factor = 1 - distance / radius
        x.set(distX * strength * factor)
        y.set(distY * strength * factor)
      } else {
        x.set(0)
        y.set(0)
      }
    },
    [strength, radius, x, y]
  )

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return {
    ref,
    style: { x: smoothX, y: smoothY },
    onMouseLeave: handleMouseLeave,
  }
}

// =============================================================================
// PROGRESS RING
// =============================================================================

interface UseProgressRingOptions {
  value: number // 0 to 100
  duration?: number
}

export function useProgressRing(options: UseProgressRingOptions) {
  const { value, duration = 1500 } = options
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progressRatio = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progressRatio, 3) // easeOutCubic

      setProgress(value * easedProgress)

      if (progressRatio < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value, duration])

  // Calculate stroke dash for SVG circle
  const circumference = 2 * Math.PI * 45 // radius of 45
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return {
    ref,
    progress,
    strokeDasharray: circumference,
    strokeDashoffset,
  }
}

// =============================================================================
// INTERSECTION OBSERVER WITH THRESHOLD ARRAY
// =============================================================================

export function useScrollProgress(thresholds = 10) {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const thresholdArray = Array.from(
      { length: thresholds + 1 },
      (_, i) => i / thresholds
    )

    const observer = new IntersectionObserver(
      ([entry]) => {
        setProgress(entry.intersectionRatio)
      },
      { threshold: thresholdArray }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [thresholds])

  return { ref, progress }
}

// =============================================================================
// REDUCED MOTION PREFERENCE
// =============================================================================

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}
