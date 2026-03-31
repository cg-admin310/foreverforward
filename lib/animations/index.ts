/**
 * Forever Forward Animation System
 * Premium, bold animations for a world-class website experience
 *
 * Usage:
 * import { fadeInUp, useParallax, scrollTriggerPresets } from '@/lib/animations'
 */

// Animation Variants
export * from './variants'

// Custom Hooks
export * from './hooks'

// Ready-to-use Presets
export * from './presets'

// Re-export commonly used Framer Motion components for convenience
export {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
  useReducedMotion as useFramerReducedMotion,
  LayoutGroup,
  Reorder,
} from 'framer-motion'

// Type exports
export type {
  Variants,
  Transition,
  MotionProps,
  MotionValue,
  Target,
  TargetAndTransition,
} from 'framer-motion'

// Export animationControls function (not a type)
export { animationControls } from 'framer-motion'
