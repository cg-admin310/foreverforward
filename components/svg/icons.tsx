'use client'

/**
 * Custom Icons for Forever Forward
 * Program and service icons with brand styling
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface IconProps {
  className?: string
  size?: number
  color?: string
  animate?: boolean
}

// =============================================================================
// PROGRAM ICONS
// =============================================================================

// Father Forward - Father figure with tech elements
export function FatherForwardIcon({
  className,
  size = 48,
  color = '#C9A84C',
  animate = false,
}: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('', className)}
      whileHover={animate ? { scale: 1.1 } : undefined}
    >
      {/* Person silhouette */}
      <circle cx="24" cy="12" r="6" stroke={color} strokeWidth="2" fill="none" />
      <path
        d="M16 44V32C16 28 20 24 24 24C28 24 32 28 32 32V44"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Tech element - circuit lines */}
      <motion.path
        d="M36 18H42M42 18V24M42 18L38 22"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
        initial={animate ? { pathLength: 0 } : undefined}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <circle cx="42" cy="18" r="2" fill={color} opacity="0.6" />
      {/* Small chevrons representing forward movement */}
      <path
        d="M6 30L10 34L6 38"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
    </motion.svg>
  )
}

// Tech-Ready Youth - Young person with laptop/code
export function TechReadyYouthIcon({
  className,
  size = 48,
  color = '#C9A84C',
  animate = false,
}: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('', className)}
      whileHover={animate ? { scale: 1.1 } : undefined}
    >
      {/* Person */}
      <circle cx="18" cy="10" r="5" stroke={color} strokeWidth="2" fill="none" />
      <path
        d="M10 38V28C10 25 13 22 18 22"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Laptop */}
      <rect
        x="22"
        y="24"
        width="18"
        height="12"
        rx="2"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path d="M20 36H44" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Code symbols */}
      <motion.g
        initial={animate ? { opacity: 0 } : undefined}
        animate={animate ? { opacity: 1 } : undefined}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <text
          x="26"
          y="32"
          fill={color}
          fontSize="6"
          fontFamily="monospace"
          opacity="0.7"
        >
          {'</>'}
        </text>
      </motion.g>
    </motion.svg>
  )
}

// Making Moments - Family with film reel
export function MakingMomentsIcon({
  className,
  size = 48,
  color = '#C9A84C',
  animate = false,
}: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('', className)}
      whileHover={animate ? { scale: 1.1, rotate: 5 } : undefined}
    >
      {/* Film reel */}
      <motion.circle
        cx="24"
        cy="24"
        r="16"
        stroke={color}
        strokeWidth="2"
        fill="none"
        initial={animate ? { rotate: 0 } : undefined}
        animate={animate ? { rotate: 360 } : undefined}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
      <circle cx="24" cy="24" r="4" stroke={color} strokeWidth="2" fill="none" />
      {/* Film holes */}
      <circle cx="24" cy="12" r="2" fill={color} opacity="0.6" />
      <circle cx="24" cy="36" r="2" fill={color} opacity="0.6" />
      <circle cx="12" cy="24" r="2" fill={color} opacity="0.6" />
      <circle cx="36" cy="24" r="2" fill={color} opacity="0.6" />
      {/* Heart in center */}
      <path
        d="M24 21C23 19 20 19 20 22C20 25 24 28 24 28C24 28 28 25 28 22C28 19 25 19 24 21Z"
        fill={color}
        opacity="0.8"
      />
    </motion.svg>
  )
}

// From Script to Screen - Camera + Unreal Engine
export function ScriptToScreenIcon({
  className,
  size = 48,
  color = '#C9A84C',
  animate = false,
}: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('', className)}
      whileHover={animate ? { scale: 1.1 } : undefined}
    >
      {/* Camera body */}
      <rect
        x="8"
        y="16"
        width="24"
        height="20"
        rx="2"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* Lens */}
      <circle cx="20" cy="26" r="6" stroke={color} strokeWidth="2" fill="none" />
      <circle cx="20" cy="26" r="2" fill={color} opacity="0.6" />
      {/* Viewfinder */}
      <rect
        x="24"
        y="12"
        width="6"
        height="4"
        rx="1"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Unreal Engine inspired "U" */}
      <motion.path
        d="M36 20V32C36 34 38 36 40 36C42 36 44 34 44 32V20"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0 } : undefined}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 1, delay: 0.3 }}
      />
    </motion.svg>
  )
}

// Stories from My Future - Child + 3D printer
export function StoriesFromFutureIcon({
  className,
  size = 48,
  color = '#C9A84C',
  animate = false,
}: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('', className)}
      whileHover={animate ? { scale: 1.1 } : undefined}
    >
      {/* 3D Printer frame */}
      <rect
        x="20"
        y="20"
        width="20"
        height="20"
        rx="2"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* Print head */}
      <motion.rect
        x="26"
        y="24"
        width="8"
        height="4"
        fill={color}
        opacity="0.6"
        animate={animate ? { x: [26, 30, 26] } : undefined}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Printed object (star) */}
      <motion.path
        d="M30 34L31.5 37L35 37.5L32.5 40L33 44L30 42.5L27 44L27.5 40L25 37.5L28.5 37L30 34Z"
        fill={color}
        opacity="0.8"
        initial={animate ? { scale: 0 } : undefined}
        animate={animate ? { scale: 1 } : undefined}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      {/* Book/Story element */}
      <rect
        x="6"
        y="8"
        width="14"
        height="18"
        rx="1"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path d="M10 12H16M10 16H14" stroke={color} strokeWidth="1" opacity="0.5" />
      {/* Sparkle */}
      <motion.path
        d="M4 4L5 6L4 8L3 6L4 4Z"
        fill={color}
        animate={animate ? { opacity: [0.3, 1, 0.3] } : undefined}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.svg>
  )
}

// LULA - Gaming controller + books
export function LULAIcon({
  className,
  size = 48,
  color = '#C9A84C',
  animate = false,
}: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('', className)}
      whileHover={animate ? { scale: 1.1 } : undefined}
    >
      {/* Game controller */}
      <path
        d="M12 20C8 20 6 24 6 28C6 32 8 36 12 36H16C18 36 20 34 20 32V28C20 26 18 24 16 24H12"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M36 20C40 20 42 24 42 28C42 32 40 36 36 36H32C30 36 28 34 28 32V28C28 26 30 24 32 24H36"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path d="M16 24H32" stroke={color} strokeWidth="2" />
      {/* D-pad */}
      <path d="M12 26V30M10 28H14" stroke={color} strokeWidth="1.5" />
      {/* Buttons */}
      <circle cx="34" cy="26" r="1.5" fill={color} />
      <circle cx="38" cy="28" r="1.5" fill={color} />
      {/* Books/Learning */}
      <rect
        x="18"
        y="6"
        width="12"
        height="14"
        rx="1"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path d="M20 10H28M20 14H26" stroke={color} strokeWidth="1" opacity="0.5" />
      {/* Level up arrow */}
      <motion.path
        d="M24 4L28 8H20L24 4Z"
        fill={color}
        initial={animate ? { y: 0 } : undefined}
        animate={animate ? { y: [-2, 2, -2] } : undefined}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.svg>
  )
}

// =============================================================================
// SERVICE ICONS
// =============================================================================

// Managed IT - Server rack + shield
export function ManagedITIcon({
  className,
  size = 48,
  color = '#C9A84C',
  animate = false,
}: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('', className)}
      whileHover={animate ? { scale: 1.1 } : undefined}
    >
      {/* Server rack */}
      <rect
        x="8"
        y="8"
        width="20"
        height="32"
        rx="2"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* Server units */}
      <rect x="10" y="12" width="16" height="6" rx="1" fill={color} opacity="0.3" />
      <rect x="10" y="22" width="16" height="6" rx="1" fill={color} opacity="0.3" />
      <rect x="10" y="32" width="16" height="6" rx="1" fill={color} opacity="0.3" />
      {/* Status lights */}
      <motion.circle
        cx="14"
        cy="15"
        r="1.5"
        fill="#5A7247"
        animate={animate ? { opacity: [1, 0.3, 1] } : undefined}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.circle
        cx="14"
        cy="25"
        r="1.5"
        fill="#5A7247"
        animate={animate ? { opacity: [1, 0.3, 1] } : undefined}
        transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
      />
      {/* Shield */}
      <motion.path
        d="M36 16C36 16 32 18 32 24C32 30 36 36 36 36C36 36 40 30 40 24C40 18 36 16 36 16Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
        initial={animate ? { scale: 0.8, opacity: 0 } : undefined}
        animate={animate ? { scale: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.5 }}
      />
      <path
        d="M34 24L36 26L40 22"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  )
}

// IT Refresh - Device with refresh arrows
export function ITRefreshIcon({
  className,
  size = 48,
  color = '#C9A84C',
  animate = false,
}: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('', className)}
      whileHover={animate ? { scale: 1.1 } : undefined}
    >
      {/* Laptop */}
      <rect
        x="8"
        y="12"
        width="32"
        height="20"
        rx="2"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path d="M4 36H44" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Refresh arrows */}
      <motion.g
        initial={animate ? { rotate: 0 } : undefined}
        animate={animate ? { rotate: 360 } : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '24px 22px' }}
      >
        <path
          d="M20 18C22 16 26 16 28 18"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M28 18L30 16M28 18L30 20" stroke={color} strokeWidth="1.5" />
        <path
          d="M28 26C26 28 22 28 20 26"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M20 26L18 24M20 26L18 28" stroke={color} strokeWidth="1.5" />
      </motion.g>
    </motion.svg>
  )
}

// Structured Cabling - Network cables/ports
export function CablingIcon({
  className,
  size = 48,
  color = '#C9A84C',
  animate = false,
}: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('', className)}
      whileHover={animate ? { scale: 1.1 } : undefined}
    >
      {/* Central hub */}
      <rect
        x="18"
        y="18"
        width="12"
        height="12"
        rx="2"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* Ports */}
      <rect x="20" y="22" width="3" height="4" fill={color} opacity="0.6" />
      <rect x="25" y="22" width="3" height="4" fill={color} opacity="0.6" />
      {/* Cables going out */}
      <motion.path
        d="M18 24H8M8 24V12M8 12H16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0 } : undefined}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 1 }}
      />
      <motion.path
        d="M30 24H40M40 24V12M40 12H32"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0 } : undefined}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <motion.path
        d="M24 30V40M24 40H16M24 40H32"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0 } : undefined}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 1, delay: 0.4 }}
      />
      {/* Endpoints */}
      <circle cx="16" cy="12" r="2" fill={color} />
      <circle cx="32" cy="12" r="2" fill={color} />
      <circle cx="16" cy="40" r="2" fill={color} />
      <circle cx="32" cy="40" r="2" fill={color} />
    </motion.svg>
  )
}

// CCTV - Security camera + monitoring
export function CCTVIcon({
  className,
  size = 48,
  color = '#C9A84C',
  animate = false,
}: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('', className)}
      whileHover={animate ? { scale: 1.1 } : undefined}
    >
      {/* Camera body */}
      <rect
        x="8"
        y="16"
        width="18"
        height="12"
        rx="2"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* Lens */}
      <circle cx="26" cy="22" r="4" stroke={color} strokeWidth="2" fill="none" />
      <motion.circle
        cx="26"
        cy="22"
        r="2"
        fill={color}
        animate={animate ? { opacity: [0.3, 1, 0.3] } : undefined}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Mount */}
      <path d="M14 28V36" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M10 36H18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Signal waves */}
      <motion.path
        d="M32 18C34 18 36 20 36 22C36 24 34 26 32 26"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
        initial={animate ? { opacity: 0 } : undefined}
        animate={animate ? { opacity: [0, 0.5, 0] } : undefined}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.path
        d="M36 14C40 14 44 18 44 22C44 26 40 30 36 30"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
        initial={animate ? { opacity: 0 } : undefined}
        animate={animate ? { opacity: [0, 0.3, 0] } : undefined}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      />
      {/* Recording indicator */}
      <motion.circle
        cx="12"
        cy="20"
        r="2"
        fill="#EF4444"
        animate={animate ? { opacity: [1, 0.3, 1] } : undefined}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </motion.svg>
  )
}

// Software Dev - Code brackets + AI brain
export function SoftwareDevIcon({
  className,
  size = 48,
  color = '#C9A84C',
  animate = false,
}: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('', className)}
      whileHover={animate ? { scale: 1.1 } : undefined}
    >
      {/* Code brackets */}
      <path
        d="M14 16L6 24L14 32"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 16L42 24L34 32"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Brain/AI element in center */}
      <circle cx="24" cy="24" r="8" stroke={color} strokeWidth="2" fill="none" />
      {/* Neural connections */}
      <motion.g
        initial={animate ? { opacity: 0 } : undefined}
        animate={animate ? { opacity: 1 } : undefined}
        transition={{ duration: 0.5 }}
      >
        <circle cx="24" cy="20" r="1.5" fill={color} />
        <circle cx="20" cy="24" r="1.5" fill={color} />
        <circle cx="28" cy="24" r="1.5" fill={color} />
        <circle cx="24" cy="28" r="1.5" fill={color} />
        <path
          d="M24 20L20 24M24 20L28 24M20 24L24 28M28 24L24 28"
          stroke={color}
          strokeWidth="0.5"
          opacity="0.5"
        />
      </motion.g>
      {/* Sparkles for AI magic */}
      <motion.path
        d="M40 8L41 10L40 12L39 10L40 8Z"
        fill={color}
        animate={animate ? { opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] } : undefined}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path
        d="M8 36L9 38L8 40L7 38L8 36Z"
        fill={color}
        animate={animate ? { opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] } : undefined}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
    </motion.svg>
  )
}

// =============================================================================
// GENERAL ICONS
// =============================================================================

// Forward Arrow (Brand element)
export function ForwardArrowIcon({
  className,
  size = 24,
  color = '#C9A84C',
  animate = false,
}: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('', className)}
      whileHover={animate ? { x: 5 } : undefined}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <path
        d="M5 12H19M19 12L13 6M19 12L13 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  )
}

// Heart/Impact Icon
export function ImpactHeartIcon({
  className,
  size = 24,
  color = '#C9A84C',
  animate = false,
}: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('', className)}
      animate={animate ? { scale: [1, 1.1, 1] } : undefined}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <path
        d="M12 21C12 21 4 14.5 4 9C4 5.5 7 3 10 3C11.5 3 12 4 12 4C12 4 12.5 3 14 3C17 3 20 5.5 20 9C20 14.5 12 21 12 21Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7V13M9 10H15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </motion.svg>
  )
}

// Check/Success Icon
export function SuccessCheckIcon({
  className,
  size = 24,
  color = '#5A7247',
  animate = false,
}: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('', className)}
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2"
        fill="none"
        initial={animate ? { pathLength: 0 } : undefined}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d="M8 12L11 15L16 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0 } : undefined}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.3, delay: 0.5 }}
      />
    </motion.svg>
  )
}
