'use client'

/**
 * Decorative SVG Components for Forever Forward
 * Floating shapes, patterns, chevrons, and visual elements
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// =============================================================================
// FLOATING CHEVRONS (Brand element)
// =============================================================================

interface FloatingChevronProps {
  className?: string
  color?: 'gold' | 'olive' | 'white' | 'black'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  direction?: 'right' | 'left' | 'up' | 'down'
  animate?: boolean
  delay?: number
}

const chevronColors = {
  gold: '#C9A84C',
  olive: '#5A7247',
  white: '#FFFFFF',
  black: '#1A1A1A',
}

const chevronSizes = {
  sm: { width: 24, height: 24, stroke: 2 },
  md: { width: 40, height: 40, stroke: 2.5 },
  lg: { width: 60, height: 60, stroke: 3 },
  xl: { width: 80, height: 80, stroke: 3.5 },
}

export function FloatingChevron({
  className,
  color = 'gold',
  size = 'md',
  direction = 'right',
  animate = true,
  delay = 0,
}: FloatingChevronProps) {
  const { width, height, stroke } = chevronSizes[size]
  const fillColor = chevronColors[color]

  const rotation = {
    right: 0,
    down: 90,
    left: 180,
    up: -90,
  }[direction]

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('pointer-events-none', className)}
      style={{ rotate: rotation }}
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={
        animate
          ? {
              opacity: [0.6, 1, 0.6],
              y: [-10, 10, -10],
            }
          : undefined
      }
      transition={
        animate
          ? {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            }
          : undefined
      }
    >
      <path
        d="M9 18L15 12L9 6"
        stroke={fillColor}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </motion.svg>
  )
}

// =============================================================================
// DOUBLE CHEVRON (Logo-inspired element)
// =============================================================================

interface DoubleChevronProps {
  className?: string
  size?: number
  animate?: boolean
  delay?: number
}

export function DoubleChevron({
  className,
  size = 60,
  animate = true,
  delay = 0,
}: DoubleChevronProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      className={cn('pointer-events-none', className)}
      initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
      animate={
        animate
          ? {
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0, -5, 0],
            }
          : undefined
      }
      transition={
        animate
          ? {
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            }
          : undefined
      }
    >
      {/* Gold chevron */}
      <path
        d="M15 45L30 30L15 15"
        stroke="#C9A84C"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Olive chevron */}
      <path
        d="M30 45L45 30L30 15"
        stroke="#5A7247"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.8"
      />
    </motion.svg>
  )
}

// =============================================================================
// GRADIENT ORB
// =============================================================================

interface GradientOrbProps {
  className?: string
  size?: number
  colors?: [string, string]
  blur?: number
  animate?: boolean
  delay?: number
}

export function GradientOrb({
  className,
  size = 400,
  colors = ['#C9A84C', '#5A7247'],
  blur = 60,
  animate = true,
  delay = 0,
}: GradientOrbProps) {
  const id = `orb-gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <motion.div
      className={cn('pointer-events-none absolute', className)}
      style={{
        width: size,
        height: size,
        filter: `blur(${blur}px)`,
      }}
      initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
      animate={
        animate
          ? {
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
              x: [-20, 20, -20],
              y: [-10, 10, -10],
            }
          : undefined
      }
      transition={
        animate
          ? {
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            }
          : undefined
      }
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <defs>
          <radialGradient id={id} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors[0]} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors[1]} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#${id})`} />
      </svg>
    </motion.div>
  )
}

// =============================================================================
// GRID PATTERN
// =============================================================================

interface GridPatternProps {
  className?: string
  color?: string
  size?: number
  opacity?: number
}

export function GridPattern({
  className,
  color = '#C9A84C',
  size = 40,
  opacity = 0.1,
}: GridPatternProps) {
  const id = `grid-${Math.random().toString(36).substr(2, 9)}`

  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      style={{ opacity }}
    >
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// =============================================================================
// DOT PATTERN
// =============================================================================

interface DotPatternProps {
  className?: string
  color?: string
  size?: number
  spacing?: number
  opacity?: number
}

export function DotPattern({
  className,
  color = '#C9A84C',
  size = 2,
  spacing = 20,
  opacity = 0.2,
}: DotPatternProps) {
  const id = `dots-${Math.random().toString(36).substr(2, 9)}`

  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      style={{ opacity }}
    >
      <defs>
        <pattern id={id} width={spacing} height={spacing} patternUnits="userSpaceOnUse">
          <circle cx={spacing / 2} cy={spacing / 2} r={size} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// =============================================================================
// NOISE TEXTURE
// =============================================================================

interface NoiseTextureProps {
  className?: string
  opacity?: number
}

export function NoiseTexture({ className, opacity = 0.03 }: NoiseTextureProps) {
  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      style={{ opacity }}
    >
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="4"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  )
}

// =============================================================================
// WAVE DIVIDER
// =============================================================================

interface WaveDividerProps {
  className?: string
  color?: string
  flip?: boolean
  animate?: boolean
}

export function WaveDivider({
  className,
  color = '#FAFAF8',
  flip = false,
  animate = false,
}: WaveDividerProps) {
  return (
    <div
      className={cn('w-full overflow-hidden', flip && 'rotate-180', className)}
      style={{ height: 80 }}
    >
      <motion.svg
        viewBox="0 0 1440 80"
        fill="none"
        preserveAspectRatio="none"
        className="h-full w-full"
        animate={
          animate
            ? {
                x: [0, -50, 0],
              }
            : undefined
        }
        transition={
          animate
            ? {
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : undefined
        }
      >
        <path
          d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
          fill={color}
        />
      </motion.svg>
    </div>
  )
}

// =============================================================================
// CURVED DIVIDER
// =============================================================================

interface CurvedDividerProps {
  className?: string
  color?: string
  flip?: boolean
}

export function CurvedDivider({
  className,
  color = '#1A1A1A',
  flip = false,
}: CurvedDividerProps) {
  return (
    <div
      className={cn('w-full overflow-hidden', flip && 'rotate-180', className)}
      style={{ height: 100 }}
    >
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <path
          d="M0 100V60C360 100 720 0 1080 60C1260 90 1380 100 1440 100V100H0Z"
          fill={color}
        />
      </svg>
    </div>
  )
}

// =============================================================================
// ABSTRACT LINES
// =============================================================================

interface AbstractLinesProps {
  className?: string
  color?: string
  animate?: boolean
}

export function AbstractLines({
  className,
  color = '#C9A84C',
  animate = true,
}: AbstractLinesProps) {
  return (
    <motion.svg
      className={cn('pointer-events-none', className)}
      viewBox="0 0 200 200"
      fill="none"
      initial={animate ? { opacity: 0, pathLength: 0 } : undefined}
      animate={animate ? { opacity: 0.3, pathLength: 1 } : undefined}
      transition={animate ? { duration: 2, ease: 'easeInOut' } : undefined}
    >
      <motion.path
        d="M20 180 Q 100 100, 180 20"
        stroke={color}
        strokeWidth="1"
        fill="none"
        strokeDasharray="4 4"
      />
      <motion.path
        d="M40 180 Q 120 100, 180 40"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />
      <motion.path
        d="M60 180 Q 140 100, 180 60"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
      />
    </motion.svg>
  )
}

// =============================================================================
// FLOATING PARTICLES
// =============================================================================

interface FloatingParticlesProps {
  className?: string
  count?: number
  color?: string
}

export function FloatingParticles({
  className,
  count = 20,
  color = '#C9A84C',
}: FloatingParticlesProps) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 4 + 4,
    delay: Math.random() * 2,
  }))

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: 0.4,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// GLOW RING
// =============================================================================

interface GlowRingProps {
  className?: string
  size?: number
  color?: string
  animate?: boolean
}

export function GlowRing({
  className,
  size = 300,
  color = '#C9A84C',
  animate = true,
}: GlowRingProps) {
  return (
    <motion.div
      className={cn('pointer-events-none absolute', className)}
      style={{
        width: size,
        height: size,
      }}
      animate={
        animate
          ? {
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }
          : undefined
      }
      transition={
        animate
          ? {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : undefined
      }
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="glow-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="transparent" />
            <stop offset="85%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#glow-gradient)" />
      </svg>
    </motion.div>
  )
}

// =============================================================================
// HEXAGON PATTERN
// =============================================================================

interface HexagonPatternProps {
  className?: string
  color?: string
  size?: number
  opacity?: number
}

export function HexagonPattern({
  className,
  color = '#C9A84C',
  size = 30,
  opacity = 0.1,
}: HexagonPatternProps) {
  const id = `hex-${Math.random().toString(36).substr(2, 9)}`
  const hexPath = `M${size * 0.5},0 L${size},${size * 0.25} L${size},${size * 0.75} L${size * 0.5},${size} L0,${size * 0.75} L0,${size * 0.25} Z`

  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={id}
          width={size * 1.5}
          height={size * 1.73}
          patternUnits="userSpaceOnUse"
        >
          <path d={hexPath} fill="none" stroke={color} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// =============================================================================
// SCROLL INDICATOR
// =============================================================================

interface ScrollIndicatorProps {
  className?: string
  color?: string
}

export function ScrollIndicator({
  className,
  color = '#C9A84C',
}: ScrollIndicatorProps) {
  return (
    <motion.div
      className={cn('flex flex-col items-center gap-2', className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    >
      <span className="text-xs uppercase tracking-widest" style={{ color }}>
        Scroll
      </span>
      <motion.div
        className="h-12 w-6 rounded-full border-2"
        style={{ borderColor: color }}
      >
        <motion.div
          className="mx-auto mt-2 h-2 w-1 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ y: [0, 16, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </motion.div>
  )
}

// =============================================================================
// CORNER ACCENT
// =============================================================================

interface CornerAccentProps {
  className?: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  color?: string
  size?: number
}

export function CornerAccent({
  className,
  position = 'top-right',
  color = '#C9A84C',
  size = 100,
}: CornerAccentProps) {
  const rotations = {
    'top-left': 180,
    'top-right': 270,
    'bottom-left': 90,
    'bottom-right': 0,
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={cn('pointer-events-none absolute', className)}
      style={{
        transform: `rotate(${rotations[position]}deg)`,
        [position.includes('top') ? 'top' : 'bottom']: 0,
        [position.includes('left') ? 'left' : 'right']: 0,
      }}
    >
      <path
        d="M100 100 L100 60 Q100 0, 40 0 L0 0"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
      <circle cx="100" cy="0" r="4" fill={color} opacity="0.8" />
    </svg>
  )
}
