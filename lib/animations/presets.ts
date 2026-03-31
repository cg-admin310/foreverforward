/**
 * Animation Presets for Forever Forward
 * Ready-to-use animation configurations
 */

import type { MotionProps, Transition } from 'framer-motion'

// =============================================================================
// SCROLL TRIGGER PRESETS
// =============================================================================

export const scrollTriggerPresets = {
  // Default scroll reveal
  default: {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },

  // Dramatic reveal with blur
  dramatic: {
    initial: { opacity: 0, y: 60, filter: 'blur(10px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },

  // Scale up reveal
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  },

  // Slide from left
  slideLeft: {
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },

  // Slide from right
  slideRight: {
    initial: { opacity: 0, x: 60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },

  // Stagger parent container
  staggerContainer: {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, margin: '-50px' },
  },
} as const

// =============================================================================
// HOVER PRESETS
// =============================================================================

export const hoverPresets = {
  // Lift up effect
  lift: {
    whileHover: { y: -5, transition: { duration: 0.2 } },
    whileTap: { y: 0, scale: 0.98 },
  },

  // Scale effect
  scale: {
    whileHover: { scale: 1.05, transition: { duration: 0.2 } },
    whileTap: { scale: 0.95 },
  },

  // Glow effect (use with boxShadow)
  glow: {
    whileHover: {
      boxShadow: '0 0 30px rgba(201, 168, 76, 0.4)',
      transition: { duration: 0.3 },
    },
  },

  // Card hover (lift + shadow)
  card: {
    whileHover: {
      y: -8,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    whileTap: { scale: 0.98 },
  },

  // Button press
  button: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  },

  // Icon bounce
  iconBounce: {
    whileHover: {
      y: [0, -5, 0],
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
  },

  // Rotate on hover
  rotate: {
    whileHover: { rotate: 5, transition: { duration: 0.2 } },
    whileTap: { rotate: 0 },
  },
} as const

// =============================================================================
// ENTRANCE PRESETS
// =============================================================================

export const entrancePresets = {
  // Fade in
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  },

  // Fade up
  fadeUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },

  // Pop in
  pop: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  },

  // Blur in
  blur: {
    initial: { opacity: 0, filter: 'blur(20px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 0.6 },
  },

  // Slide from bottom
  slideUp: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
} as const

// =============================================================================
// STAGGER PRESETS
// =============================================================================

export const staggerPresets = {
  // Fast stagger (for nav items)
  fast: {
    staggerChildren: 0.05,
    delayChildren: 0,
  },

  // Normal stagger (for content)
  normal: {
    staggerChildren: 0.1,
    delayChildren: 0.1,
  },

  // Slow stagger (for hero elements)
  slow: {
    staggerChildren: 0.15,
    delayChildren: 0.2,
  },

  // Very slow (for dramatic reveals)
  dramatic: {
    staggerChildren: 0.2,
    delayChildren: 0.3,
  },
} as const

// =============================================================================
// SPRING PRESETS
// =============================================================================

export const springPresets = {
  // Gentle, smooth movement
  gentle: { type: 'spring', stiffness: 100, damping: 15 } as Transition,

  // Snappy, responsive
  snappy: { type: 'spring', stiffness: 300, damping: 20 } as Transition,

  // Bouncy, playful
  bouncy: { type: 'spring', stiffness: 400, damping: 10 } as Transition,

  // Ultra smooth
  smooth: { type: 'spring', stiffness: 200, damping: 25 } as Transition,

  // Heavy, weighty
  heavy: { type: 'spring', stiffness: 100, damping: 20 } as Transition,
} as const

// =============================================================================
// DURATION PRESETS
// =============================================================================

export const durationPresets = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  dramatic: 0.8,
  hero: 1.2,
  cinematic: 2,
} as const

// =============================================================================
// EASING PRESETS
// =============================================================================

export const easingPresets = {
  // Standard easings
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],

  // Custom easings
  smooth: [0.22, 1, 0.36, 1],
  dramatic: [0.16, 1, 0.3, 1],
  bounce: [0.34, 1.56, 0.64, 1],
  anticipate: [0.36, 0, 0.66, -0.56],

  // Apple-style
  apple: [0.25, 0.1, 0.25, 1],

  // Material design
  material: [0.4, 0, 0.2, 1],
} as const

// =============================================================================
// COMBINED PRESETS (Ready to spread)
// =============================================================================

export const combinePresets = {
  // Hero title animation
  heroTitle: {
    initial: { opacity: 0, y: 60, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 1, ease: easingPresets.dramatic, delay: 0.2 },
  },

  // Hero subtitle
  heroSubtitle: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: easingPresets.smooth, delay: 0.4 },
  },

  // Hero CTA buttons
  heroCTA: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, ease: easingPresets.smooth, delay: 0.6 },
  },

  // Section heading
  sectionHeading: {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.6, ease: easingPresets.smooth },
  },

  // Card in grid
  gridCard: {
    initial: { opacity: 0, y: 40, scale: 0.95 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.5, ease: easingPresets.smooth },
    whileHover: {
      y: -8,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
      transition: { duration: 0.2 },
    },
  },

  // Stats counter
  statsCounter: {
    initial: { opacity: 0, scale: 0.5 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: '-100px' },
    transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 },
  },

  // Image reveal
  imageReveal: {
    initial: { opacity: 0, scale: 1.1, filter: 'blur(10px)' },
    whileInView: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    viewport: { once: true },
    transition: { duration: 0.8, ease: easingPresets.smooth },
  },

  // Testimonial quote
  testimonialQuote: {
    initial: { opacity: 0, x: -30 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.6, ease: easingPresets.smooth },
  },

  // Footer link
  footerLink: {
    whileHover: { x: 5, color: '#C9A84C' },
    transition: { duration: 0.2 },
  },
} as const

// =============================================================================
// KEYFRAME ANIMATIONS (For CSS)
// =============================================================================

export const keyframes = {
  // Float animation
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
  `,

  // Pulse glow
  pulseGlow: `
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(201, 168, 76, 0); }
      50% { box-shadow: 0 0 30px 10px rgba(201, 168, 76, 0.3); }
    }
  `,

  // Gradient shift
  gradientShift: `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `,

  // Shimmer
  shimmer: `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,

  // Spin slow
  spinSlow: `
    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,

  // Bounce subtle
  bounceSubtle: `
    @keyframes bounceSubtle {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `,

  // Fade in up
  fadeInUp: `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,

  // Scale pulse
  scalePulse: `
    @keyframes scalePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `,
}

// =============================================================================
// UTILITY FUNCTION: Create staggered delay
// =============================================================================

export function createStaggerDelay(
  index: number,
  baseDelay = 0.1,
  initialDelay = 0
): number {
  return initialDelay + index * baseDelay
}

// =============================================================================
// UTILITY FUNCTION: Create responsive animation
// =============================================================================

export function createResponsiveAnimation(
  mobileProps: MotionProps,
  desktopProps: MotionProps
): MotionProps {
  // This would need to be used with a useMediaQuery hook
  // Returns desktop props by default
  return desktopProps
}
