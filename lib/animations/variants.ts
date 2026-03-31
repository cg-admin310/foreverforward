/**
 * Premium Animation Variants for Forever Forward
 * Bold, dramatic animations with professional timing
 */

import type { Variants, Transition } from 'framer-motion'

// =============================================================================
// TIMING PRESETS
// =============================================================================

export const timing = {
  // Spring configs for natural movement
  spring: {
    gentle: { type: 'spring', stiffness: 100, damping: 15 },
    snappy: { type: 'spring', stiffness: 300, damping: 20 },
    bouncy: { type: 'spring', stiffness: 400, damping: 10 },
    smooth: { type: 'spring', stiffness: 200, damping: 25 },
  },
  // Easing curves
  ease: {
    out: [0.22, 1, 0.36, 1], // Smooth deceleration
    inOut: [0.65, 0, 0.35, 1], // Balanced
    dramatic: [0.16, 1, 0.3, 1], // Strong ease-out
    bounce: [0.34, 1.56, 0.64, 1], // Overshoot
  },
  // Duration presets
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    dramatic: 0.8,
    hero: 1.2,
  },
} as const

// =============================================================================
// FADE VARIANTS
// =============================================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: timing.duration.normal, ease: timing.ease.out },
  },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: timing.duration.slow, ease: timing.ease.out },
  },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: timing.duration.slow, ease: timing.ease.out },
  },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: timing.duration.slow, ease: timing.ease.out },
  },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: timing.duration.slow, ease: timing.ease.out },
  },
}

// =============================================================================
// SCALE VARIANTS
// =============================================================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: timing.duration.slow, ease: timing.ease.bounce },
  },
}

export const scaleInUp: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: timing.duration.slow, ease: timing.ease.out },
  },
}

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: timing.spring.bouncy,
  },
}

// =============================================================================
// BLUR VARIANTS (Premium effect)
// =============================================================================

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(20px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: timing.duration.dramatic, ease: timing.ease.out },
  },
}

export const blurInUp: Variants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(15px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: timing.duration.dramatic, ease: timing.ease.out },
  },
}

// =============================================================================
// SLIDE VARIANTS
// =============================================================================

export const slideInLeft: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: timing.duration.slow, ease: timing.ease.dramatic },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { duration: timing.duration.normal, ease: timing.ease.inOut },
  },
}

export const slideInRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: timing.duration.slow, ease: timing.ease.dramatic },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: timing.duration.normal, ease: timing.ease.inOut },
  },
}

export const slideInUp: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: timing.duration.slow, ease: timing.ease.dramatic },
  },
}

// =============================================================================
// STAGGER CONTAINERS
// =============================================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

// =============================================================================
// HERO VARIANTS (Dramatic entry)
// =============================================================================

export const heroTitle: Variants = {
  hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: timing.duration.hero,
      ease: timing.ease.dramatic,
    },
  },
}

export const heroSubtitle: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.duration.dramatic,
      delay: 0.3,
      ease: timing.ease.out,
    },
  },
}

export const heroCTA: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: timing.duration.slow,
      delay: 0.5,
      ease: timing.ease.out,
    },
  },
}

export const heroBackground: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: timing.duration.hero * 1.5,
      ease: timing.ease.out,
    },
  },
}

// =============================================================================
// CARD VARIANTS
// =============================================================================

export const cardHover: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    transition: timing.spring.snappy,
  },
  tap: {
    scale: 0.98,
    transition: { duration: timing.duration.fast },
  },
}

export const card3D: Variants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    transformPerspective: 1000,
  },
  hover: {
    transition: { duration: timing.duration.normal },
  },
}

// =============================================================================
// FLOATING ANIMATION
// =============================================================================

export const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const floatSlow: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-15, 15, -15],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const floatRotate: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [-10, 10, -10],
    rotate: [-3, 3, -3],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// =============================================================================
// PULSE & GLOW
// =============================================================================

export const pulse: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const glowPulse: Variants = {
  initial: { boxShadow: '0 0 0 0 rgba(201, 168, 76, 0)' },
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(201, 168, 76, 0)',
      '0 0 20px 10px rgba(201, 168, 76, 0.3)',
      '0 0 0 0 rgba(201, 168, 76, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// =============================================================================
// REVEAL VARIANTS (For scroll-triggered content)
// =============================================================================

export const revealFromBottom: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: timing.duration.dramatic,
      ease: timing.ease.dramatic,
    },
  },
}

export const revealFromLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: timing.duration.dramatic,
      ease: timing.ease.dramatic,
    },
  },
}

export const revealFromRight: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: timing.duration.dramatic,
      ease: timing.ease.dramatic,
    },
  },
}

// =============================================================================
// TEXT REVEAL (Character by character)
// =============================================================================

export const textRevealContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.2,
    },
  },
}

export const textRevealChar: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.duration.normal,
      ease: timing.ease.out,
    },
  },
}

// =============================================================================
// WORD REVEAL
// =============================================================================

export const wordRevealContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: timing.duration.slow,
      ease: timing.ease.out,
    },
  },
}

// =============================================================================
// COUNTERS & NUMBERS
// =============================================================================

export const counterReveal: Variants = {
  hidden: { opacity: 0, scale: 0.5, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: timing.duration.slow,
      ease: timing.ease.bounce,
    },
  },
}

// =============================================================================
// PAGE TRANSITIONS
// =============================================================================

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.duration.normal,
      ease: timing.ease.out,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: timing.duration.fast,
      ease: timing.ease.inOut,
    },
  },
}

// =============================================================================
// NAVBAR VARIANTS
// =============================================================================

export const navbarHidden: Variants = {
  visible: { y: 0, opacity: 1 },
  hidden: { y: -100, opacity: 0 },
}

export const navDropdown: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: timing.duration.fast,
      ease: timing.ease.out,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: timing.duration.fast,
      ease: timing.ease.inOut,
    },
  },
}

export const navDropdownItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: timing.duration.fast,
      ease: timing.ease.out,
    },
  },
}

// =============================================================================
// MOBILE MENU
// =============================================================================

export const mobileMenu: Variants = {
  hidden: {
    opacity: 0,
    x: '100%',
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: timing.duration.normal,
      ease: timing.ease.dramatic,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: {
      duration: timing.duration.fast,
      ease: timing.ease.inOut,
    },
  },
}

export const mobileMenuItem: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: timing.duration.normal,
      ease: timing.ease.out,
    },
  },
}

// =============================================================================
// INTERACTIVE ELEMENTS
// =============================================================================

export const buttonTap = {
  scale: 0.95,
  transition: { duration: timing.duration.fast },
}

export const buttonHover = {
  scale: 1.02,
  transition: timing.spring.snappy,
}

export const linkUnderline: Variants = {
  rest: { scaleX: 0, originX: 0 },
  hover: {
    scaleX: 1,
    transition: {
      duration: timing.duration.normal,
      ease: timing.ease.out,
    },
  },
}
