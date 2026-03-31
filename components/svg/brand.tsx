'use client'

/**
 * Brand SVG Components for Forever Forward
 * Logo animations, chevron motifs, and brand elements
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// =============================================================================
// ANIMATED DOUBLE CHEVRON LOGO
// =============================================================================

interface AnimatedLogoMarkProps {
  className?: string
  size?: number
  animate?: boolean
  variant?: 'default' | 'mono-white' | 'mono-black'
}

export function AnimatedLogoMark({
  className,
  size = 48,
  animate = true,
  variant = 'default',
}: AnimatedLogoMarkProps) {
  const colors = {
    default: { gold: '#C9A84C', olive: '#5A7247' },
    'mono-white': { gold: '#FFFFFF', olive: '#FFFFFF' },
    'mono-black': { gold: '#1A1A1A', olive: '#1A1A1A' },
  }

  const { gold, olive } = colors[variant]

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('', className)}
      initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Gold chevron (front) */}
      <motion.path
        d="M12 38L24 24L12 10"
        stroke={gold}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
        animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      />
      {/* Olive chevron (back) */}
      <motion.path
        d="M24 38L36 24L24 10"
        stroke={olive}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
        animate={animate ? { pathLength: 1, opacity: 0.8 } : undefined}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      />
    </motion.svg>
  )
}

// =============================================================================
// LOADING LOGO (Animated spinner)
// =============================================================================

interface LoadingLogoProps {
  className?: string
  size?: number
}

export function LoadingLogo({ className, size = 48 }: LoadingLogoProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('', className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      {/* Outer ring */}
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="#2D2D2D"
        strokeWidth="2"
        fill="none"
      />
      {/* Progress arc */}
      <motion.circle
        cx="24"
        cy="24"
        r="20"
        stroke="#C9A84C"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="126"
        strokeDashoffset="90"
      />
      {/* Center chevron */}
      <path
        d="M18 28L24 22L18 16"
        stroke="#C9A84C"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M24 28L30 22L24 16"
        stroke="#5A7247"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.7"
      />
    </motion.svg>
  )
}

// =============================================================================
// HERO CHEVRON PATTERN
// =============================================================================

interface HeroChevronPatternProps {
  className?: string
}

export function HeroChevronPattern({ className }: HeroChevronPatternProps) {
  const chevrons = [
    { x: 10, y: 20, size: 40, delay: 0, opacity: 0.15 },
    { x: 70, y: 60, size: 60, delay: 0.2, opacity: 0.1 },
    { x: 30, y: 80, size: 30, delay: 0.4, opacity: 0.2 },
    { x: 85, y: 15, size: 35, delay: 0.6, opacity: 0.12 },
    { x: 50, y: 40, size: 50, delay: 0.8, opacity: 0.08 },
  ]

  return (
    <div className={cn('pointer-events-none absolute inset-0', className)}>
      {chevrons.map((chevron, i) => (
        <motion.svg
          key={i}
          width={chevron.size}
          height={chevron.size}
          viewBox="0 0 48 48"
          fill="none"
          className="absolute"
          style={{
            left: `${chevron.x}%`,
            top: `${chevron.y}%`,
            opacity: chevron.opacity,
          }}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{
            opacity: chevron.opacity,
            scale: 1,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { duration: 0.6, delay: chevron.delay },
            scale: { duration: 0.6, delay: chevron.delay },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <path
            d="M14 34L24 24L14 14"
            stroke="#C9A84C"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M24 34L34 24L24 14"
            stroke="#5A7247"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.7"
          />
        </motion.svg>
      ))}
    </div>
  )
}

// =============================================================================
// FORWARD MOMENTUM LINES
// =============================================================================

interface MomentumLinesProps {
  className?: string
  direction?: 'right' | 'left'
}

export function MomentumLines({
  className,
  direction = 'right',
}: MomentumLinesProps) {
  const lines = [
    { width: 100, y: 20, delay: 0 },
    { width: 80, y: 35, delay: 0.1 },
    { width: 120, y: 50, delay: 0.2 },
    { width: 60, y: 65, delay: 0.3 },
    { width: 90, y: 80, delay: 0.4 },
  ]

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{ transform: direction === 'left' ? 'scaleX(-1)' : undefined }}
    >
      <svg className="h-full w-full" viewBox="0 0 200 100" preserveAspectRatio="none">
        {lines.map((line, i) => (
          <motion.line
            key={i}
            x1="-20"
            y1={line.y}
            x2={line.width}
            y2={line.y}
            stroke="url(#momentum-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ x1: -100, x2: -80 }}
            animate={{ x1: 220, x2: 240 }}
            transition={{
              duration: 2,
              delay: line.delay,
              repeat: Infinity,
              repeatDelay: 1,
              ease: 'easeOut',
            }}
          />
        ))}
        <defs>
          <linearGradient id="momentum-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
            <stop offset="50%" stopColor="#C9A84C" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// =============================================================================
// BRAND BADGE
// =============================================================================

interface BrandBadgeProps {
  className?: string
  text?: string
  animate?: boolean
}

export function BrandBadge({
  className,
  text = 'Forever Forward',
  animate = true,
}: BrandBadgeProps) {
  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-2',
        className
      )}
      initial={animate ? { opacity: 0, y: 20, scale: 0.9 } : undefined}
      animate={animate ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="h-2 w-2 rounded-full bg-[#C9A84C]"
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-sm font-medium text-[#C9A84C]">{text}</span>
    </motion.div>
  )
}

// =============================================================================
// SECTION DIVIDER WITH CHEVRON
// =============================================================================

interface ChevronDividerProps {
  className?: string
  variant?: 'single' | 'double'
}

export function ChevronDivider({
  className,
  variant = 'double',
}: ChevronDividerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-[#C9A84C]/30" />

      <motion.svg
        width={variant === 'double' ? 32 : 20}
        height="20"
        viewBox={variant === 'double' ? '0 0 32 20' : '0 0 20 20'}
        fill="none"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {variant === 'double' ? (
          <>
            <path
              d="M6 16L12 10L6 4"
              stroke="#C9A84C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 16L26 10L20 4"
              stroke="#5A7247"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />
          </>
        ) : (
          <path
            d="M6 16L12 10L6 4"
            stroke="#C9A84C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </motion.svg>

      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C9A84C]/30 to-[#C9A84C]/30" />
    </div>
  )
}

// =============================================================================
// ANIMATED UNDERLINE
// =============================================================================

interface AnimatedUnderlineProps {
  className?: string
  color?: string
  width?: string
  animate?: boolean
}

export function AnimatedUnderline({
  className,
  color = '#C9A84C',
  width = '60px',
  animate = true,
}: AnimatedUnderlineProps) {
  return (
    <motion.div
      className={cn('h-1 rounded-full', className)}
      style={{ backgroundColor: color, width }}
      initial={animate ? { scaleX: 0, opacity: 0 } : undefined}
      whileInView={animate ? { scaleX: 1, opacity: 1 } : undefined}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    />
  )
}

// =============================================================================
// CORNER CHEVRON ACCENT
// =============================================================================

interface CornerChevronProps {
  className?: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  size?: number
}

export function CornerChevron({
  className,
  position = 'top-right',
  size = 80,
}: CornerChevronProps) {
  const rotations = {
    'top-left': 180,
    'top-right': -90,
    'bottom-left': 90,
    'bottom-right': 0,
  }

  const positions = {
    'top-left': { top: 0, left: 0 },
    'top-right': { top: 0, right: 0 },
    'bottom-left': { bottom: 0, left: 0 },
    'bottom-right': { bottom: 0, right: 0 },
  }

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={cn('pointer-events-none absolute', className)}
      style={{
        ...positions[position],
        transform: `rotate(${rotations[position]}deg)`,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <path
        d="M20 60L40 40L20 20"
        stroke="#C9A84C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
      />
      <path
        d="M40 60L60 40L40 20"
        stroke="#5A7247"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.2"
      />
    </motion.svg>
  )
}

// =============================================================================
// GOLD ACCENT LINE
// =============================================================================

interface GoldAccentLineProps {
  className?: string
  direction?: 'horizontal' | 'vertical'
  animate?: boolean
}

export function GoldAccentLine({
  className,
  direction = 'horizontal',
  animate = true,
}: GoldAccentLineProps) {
  const isHorizontal = direction === 'horizontal'

  return (
    <motion.div
      className={cn(
        'bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent',
        isHorizontal ? 'h-px w-full' : 'h-full w-px',
        !isHorizontal && 'bg-gradient-to-b',
        className
      )}
      initial={
        animate
          ? { scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }
          : undefined
      }
      whileInView={animate ? { scaleX: 1, scaleY: 1 } : undefined}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}
