/**
 * GSAP Animation Presets for Forever Forward
 * Premium, elegant animations with subtle sophistication
 */

import { gsap } from 'gsap'

// Elegant easing curves
export const easings = {
  // Primary easing - smooth and professional
  smooth: 'power2.out',
  smoothIn: 'power2.in',
  smoothInOut: 'power2.inOut',

  // Premium easing - more dramatic but still elegant
  premium: 'power3.out',
  premiumIn: 'power3.in',
  premiumInOut: 'power3.inOut',

  // Subtle bounce - for attention without being flashy
  subtleBounce: 'back.out(1.2)',

  // Expo for dramatic reveals
  expo: 'expo.out',
  expoIn: 'expo.in',
  expoInOut: 'expo.inOut',

  // Custom cubic bezier equivalent
  elegant: 'power4.out',
}

// Duration presets
export const durations = {
  instant: 0.15,
  fast: 0.3,
  normal: 0.5,
  smooth: 0.7,
  slow: 1.0,
  dramatic: 1.2,
}

// Stagger presets
export const staggers = {
  tight: 0.05,
  normal: 0.1,
  relaxed: 0.15,
  dramatic: 0.2,
}

// Animation preset configurations with from/to pairs
export const scrollAnimationPresets = {
  // Fade in from bottom (most common)
  fadeInUp: {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0, duration: durations.smooth, ease: easings.premium },
  },

  // Fade in from left
  fadeInLeft: {
    from: { opacity: 0, x: -40 },
    to: { opacity: 1, x: 0, duration: durations.smooth, ease: easings.premium },
  },

  // Fade in from right
  fadeInRight: {
    from: { opacity: 0, x: 40 },
    to: { opacity: 1, x: 0, duration: durations.smooth, ease: easings.premium },
  },

  // Scale in (for cards, images)
  scaleIn: {
    from: { opacity: 0, scale: 0.95 },
    to: { opacity: 1, scale: 1, duration: durations.normal, ease: easings.smooth },
  },

  // Reveal (clip-path based)
  reveal: {
    from: { clipPath: 'inset(0 100% 0 0)' },
    to: { clipPath: 'inset(0 0% 0 0)', duration: durations.slow, ease: easings.expo },
  },

  // Line draw (for SVG paths)
  drawLine: {
    from: { strokeDashoffset: 1000 },
    to: { strokeDashoffset: 0, duration: durations.dramatic, ease: easings.smooth },
  },
}

// Simple tween presets (no from/to)
export const tweenPresets = {
  // Counter animation
  counter: {
    duration: durations.dramatic,
    ease: easings.expo,
  },

  // Image parallax
  parallax: {
    yPercent: -15,
    ease: 'none',
  },

  // Subtle hover lift
  hoverLift: {
    y: -4,
    duration: durations.fast,
    ease: easings.smooth,
  },

  // Card hover
  cardHover: {
    y: -6,
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    duration: durations.fast,
    ease: easings.smooth,
  },
}

// Helper function to create scroll-triggered animations
export function createScrollAnimation(
  element: string | Element | Element[],
  animation: keyof typeof scrollAnimationPresets,
  options?: {
    trigger?: string | Element
    start?: string
    end?: string
    scrub?: boolean | number
    markers?: boolean
    stagger?: number
  }
) {
  const preset = scrollAnimationPresets[animation]

  return gsap.fromTo(
    element,
    preset.from,
    {
      ...preset.to,
      scrollTrigger: {
        trigger: options?.trigger || element,
        start: options?.start || 'top 85%',
        end: options?.end || 'bottom 15%',
        scrub: options?.scrub || false,
        markers: options?.markers || false,
      },
      stagger: options?.stagger || 0,
    }
  )
}

// Text split animation helper
export function splitTextAnimation(
  element: Element,
  options?: {
    type?: 'chars' | 'words' | 'lines'
    stagger?: number
    duration?: number
  }
) {
  const text = element.textContent || ''
  const type = options?.type || 'words'

  let parts: string[]
  if (type === 'chars') {
    parts = text.split('')
  } else if (type === 'words') {
    parts = text.split(' ')
  } else {
    parts = [text]
  }

  // Create span elements
  element.innerHTML = parts
    .map((part, i) =>
      `<span class="split-text-part" style="display: inline-block; overflow: hidden;">
        <span class="split-text-inner" style="display: inline-block;">${part}${type === 'words' ? '&nbsp;' : ''}</span>
      </span>`
    )
    .join('')

  const inners = element.querySelectorAll('.split-text-inner')

  return gsap.fromTo(
    inners,
    { y: '100%', opacity: 0 },
    {
      y: '0%',
      opacity: 1,
      duration: options?.duration || durations.smooth,
      ease: easings.premium,
      stagger: options?.stagger || staggers.tight,
    }
  )
}

// Counter animation
export function animateCounter(
  element: Element,
  endValue: number,
  options?: {
    duration?: number
    prefix?: string
    suffix?: string
    decimals?: number
  }
) {
  const obj = { value: 0 }
  const decimals = options?.decimals || 0
  const prefix = options?.prefix || ''
  const suffix = options?.suffix || ''

  return gsap.to(obj, {
    value: endValue,
    duration: options?.duration || durations.dramatic,
    ease: easings.expo,
    onUpdate: () => {
      element.textContent = `${prefix}${obj.value.toFixed(decimals)}${suffix}`
    },
  })
}

// Magnetic button effect
export function createMagneticEffect(button: HTMLElement, strength: number = 0.3) {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = button.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    gsap.to(button, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: easings.smooth,
    })
  }

  const handleMouseLeave = () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: easings.subtleBounce,
    })
  }

  button.addEventListener('mousemove', handleMouseMove)
  button.addEventListener('mouseleave', handleMouseLeave)

  // Return cleanup function
  return () => {
    button.removeEventListener('mousemove', handleMouseMove)
    button.removeEventListener('mouseleave', handleMouseLeave)
  }
}
