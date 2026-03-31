'use client'

/**
 * Animated Background Components for Forever Forward
 * Premium gradient meshes, particle systems, and atmospheric effects
 */

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// =============================================================================
// GRADIENT MESH BACKGROUND
// =============================================================================

interface GradientMeshProps {
  className?: string
  variant?: 'hero' | 'section' | 'subtle'
}

export function GradientMesh({ className, variant = 'hero' }: GradientMeshProps) {
  const colors = {
    hero: {
      blob1: '#C9A84C',
      blob2: '#5A7247',
      blob3: '#1A1A1A',
    },
    section: {
      blob1: 'rgba(201, 168, 76, 0.3)',
      blob2: 'rgba(90, 114, 71, 0.2)',
      blob3: 'rgba(26, 26, 26, 0.1)',
    },
    subtle: {
      blob1: 'rgba(201, 168, 76, 0.15)',
      blob2: 'rgba(90, 114, 71, 0.1)',
      blob3: 'rgba(26, 26, 26, 0.05)',
    },
  }

  const { blob1, blob2, blob3 } = colors[variant]

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {/* Main gradient blob */}
      <motion.div
        className="absolute -top-1/4 -right-1/4 h-[150%] w-[150%] rounded-full opacity-30"
        style={{
          background: `radial-gradient(ellipse at center, ${blob1} 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary blob */}
      <motion.div
        className="absolute -bottom-1/4 -left-1/4 h-[120%] w-[120%] rounded-full opacity-20"
        style={{
          background: `radial-gradient(ellipse at center, ${blob2} 0%, transparent 70%)`,
          filter: 'blur(100px)',
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Accent blob */}
      <motion.div
        className="absolute top-1/3 left-1/2 h-[80%] w-[80%] -translate-x-1/2 rounded-full opacity-10"
        style={{
          background: `radial-gradient(ellipse at center, ${blob3} 0%, transparent 60%)`,
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

// =============================================================================
// PARALLAX GRADIENT BACKGROUND
// =============================================================================

interface ParallaxGradientProps {
  className?: string
}

export function ParallaxGradient({ className }: ParallaxGradientProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3])

  return (
    <div ref={ref} className={cn('absolute inset-0 overflow-hidden', className)}>
      <motion.div
        className="absolute -top-20 right-0 h-[600px] w-[600px] rounded-full"
        style={{
          y: y1,
          opacity,
          background:
            'radial-gradient(circle, rgba(201, 168, 76, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <motion.div
        className="absolute -bottom-20 left-0 h-[500px] w-[500px] rounded-full"
        style={{
          y: y2,
          opacity,
          background:
            'radial-gradient(circle, rgba(90, 114, 71, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
}

// =============================================================================
// ANIMATED GRID BACKGROUND
// =============================================================================

interface AnimatedGridProps {
  className?: string
  color?: string
  cellSize?: number
  animate?: boolean
}

export function AnimatedGrid({
  className,
  color = '#C9A84C',
  cellSize = 60,
  animate = true,
}: AnimatedGridProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <svg className="h-full w-full" style={{ opacity: 0.05 }}>
        <defs>
          <pattern
            id="animated-grid"
            width={cellSize}
            height={cellSize}
            patternUnits="userSpaceOnUse"
          >
            <motion.path
              d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
              fill="none"
              stroke={color}
              strokeWidth="1"
              initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
              animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
          </pattern>

          {/* Animated gradient overlay */}
          <linearGradient id="grid-fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="80%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <mask id="grid-mask">
            <rect width="100%" height="100%" fill="url(#grid-fade)" />
          </mask>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="url(#animated-grid)"
          mask="url(#grid-mask)"
        />

        {/* Animated highlight line */}
        {animate && (
          <motion.line
            x1="0"
            y1="0"
            x2="100%"
            y2="0"
            stroke={color}
            strokeWidth="2"
            opacity="0.3"
            initial={{ y1: 0, y2: 0 }}
            animate={{ y1: '100%', y2: '100%' }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </svg>
    </div>
  )
}

// =============================================================================
// FLOWING LINES BACKGROUND
// =============================================================================

interface FlowingLinesProps {
  className?: string
  lineCount?: number
  color?: string
}

export function FlowingLines({
  className,
  lineCount = 5,
  color = '#C9A84C',
}: FlowingLinesProps) {
  const lines = Array.from({ length: lineCount }, (_, i) => ({
    id: i,
    yOffset: (i / lineCount) * 100,
    delay: i * 0.5,
    amplitude: 20 + i * 5,
  }))

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        {lines.map((line) => (
          <motion.path
            key={line.id}
            d={`M -100 ${200 + line.yOffset} Q 360 ${200 + line.yOffset - line.amplitude}, 720 ${200 + line.yOffset} T 1540 ${200 + line.yOffset}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity={0.1 + line.id * 0.05}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 0.1 + line.id * 0.05,
              d: [
                `M -100 ${200 + line.yOffset} Q 360 ${200 + line.yOffset - line.amplitude}, 720 ${200 + line.yOffset} T 1540 ${200 + line.yOffset}`,
                `M -100 ${200 + line.yOffset} Q 360 ${200 + line.yOffset + line.amplitude}, 720 ${200 + line.yOffset} T 1540 ${200 + line.yOffset}`,
                `M -100 ${200 + line.yOffset} Q 360 ${200 + line.yOffset - line.amplitude}, 720 ${200 + line.yOffset} T 1540 ${200 + line.yOffset}`,
              ],
            }}
            transition={{
              pathLength: { duration: 2, delay: line.delay },
              opacity: { duration: 1, delay: line.delay },
              d: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// =============================================================================
// PARTICLE FIELD
// =============================================================================

interface ParticleFieldProps {
  className?: string
  particleCount?: number
  colors?: string[]
}

export function ParticleField({
  className,
  particleCount = 30,
  colors = ['#C9A84C', '#5A7247', '#FFFFFF'],
}: ParticleFieldProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      color: string
      duration: number
      delay: number
    }>
  >([])

  useEffect(() => {
    setParticles(
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 3,
      }))
    )
  }, [particleCount, colors])

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            y: [0, -50, -100],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// AURORA BACKGROUND
// =============================================================================

interface AuroraBackgroundProps {
  className?: string
}

export function AuroraBackground({ className }: AuroraBackgroundProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {/* Primary aurora band */}
      <motion.div
        className="absolute -top-1/2 left-0 h-[200%] w-full"
        style={{
          background: `linear-gradient(
            180deg,
            transparent 0%,
            rgba(201, 168, 76, 0.1) 20%,
            rgba(90, 114, 71, 0.15) 40%,
            rgba(201, 168, 76, 0.1) 60%,
            transparent 80%
          )`,
          filter: 'blur(100px)',
        }}
        animate={{
          y: ['-50%', '-30%', '-50%'],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary aurora band */}
      <motion.div
        className="absolute -top-1/4 left-1/4 h-[150%] w-[150%]"
        style={{
          background: `linear-gradient(
            135deg,
            transparent 0%,
            rgba(90, 114, 71, 0.1) 30%,
            rgba(201, 168, 76, 0.08) 50%,
            transparent 70%
          )`,
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

// =============================================================================
// SPOTLIGHT BACKGROUND
// =============================================================================

interface SpotlightProps {
  className?: string
  color?: string
}

export function Spotlight({ className, color = '#C9A84C' }: SpotlightProps) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <motion.div
      className={cn('pointer-events-none absolute inset-0', className)}
      animate={{
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${color}20 0%, transparent 50%)`,
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
    />
  )
}

// =============================================================================
// GEOMETRIC SHAPES BACKGROUND
// =============================================================================

interface GeometricShapesProps {
  className?: string
  shapeCount?: number
}

export function GeometricShapes({
  className,
  shapeCount = 8,
}: GeometricShapesProps) {
  const [shapes, setShapes] = useState<
    Array<{
      id: number
      type: 'circle' | 'square' | 'triangle'
      x: number
      y: number
      size: number
      rotation: number
      duration: number
    }>
  >([])

  useEffect(() => {
    setShapes(
      Array.from({ length: shapeCount }, (_, i) => ({
        id: i,
        type: (['circle', 'square', 'triangle'] as const)[
          Math.floor(Math.random() * 3)
        ],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 40 + 20,
        rotation: Math.random() * 360,
        duration: Math.random() * 10 + 10,
      }))
    )
  }, [shapeCount])

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
          }}
          initial={{ opacity: 0, rotate: shape.rotation }}
          animate={{
            opacity: [0.05, 0.1, 0.05],
            rotate: shape.rotation + 360,
            y: [0, -20, 0],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {shape.type === 'circle' && (
            <div
              className="h-full w-full rounded-full border border-[#C9A84C]"
              style={{ opacity: 0.3 }}
            />
          )}
          {shape.type === 'square' && (
            <div
              className="h-full w-full border border-[#5A7247]"
              style={{ opacity: 0.3 }}
            />
          )}
          {shape.type === 'triangle' && (
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <polygon
                points="50,10 90,90 10,90"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="1"
                opacity="0.3"
              />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// =============================================================================
// RADIAL GLOW
// =============================================================================

interface RadialGlowProps {
  className?: string
  color?: string
  intensity?: 'low' | 'medium' | 'high'
  position?: 'center' | 'top' | 'bottom'
}

export function RadialGlow({
  className,
  color = '#C9A84C',
  intensity = 'medium',
  position = 'center',
}: RadialGlowProps) {
  const opacityMap = {
    low: 0.1,
    medium: 0.2,
    high: 0.35,
  }

  const positionMap = {
    center: 'center center',
    top: 'center top',
    bottom: 'center bottom',
  }

  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        background: `radial-gradient(ellipse at ${positionMap[position]}, ${color} 0%, transparent 70%)`,
        opacity: opacityMap[intensity],
        filter: 'blur(60px)',
      }}
    />
  )
}

