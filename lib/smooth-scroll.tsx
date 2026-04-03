'use client'

import { useEffect, useRef, createContext, useContext, ReactNode } from 'react'
import Lenis from 'lenis'

interface SmoothScrollContextType {
  lenis: Lenis | null
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
})

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

interface SmoothScrollProviderProps {
  children: ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis with premium scroll settings
    const lenis = new Lenis({
      duration: 1.2, // Slightly longer for premium feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: { offset?: number; duration?: number }
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.2,
      })
    }
  }

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}

// Hook to sync Lenis with Framer Motion scroll
export function useLenisScroll(callback: (scroll: number) => void) {
  const { lenis } = useSmoothScroll()

  useEffect(() => {
    if (!lenis) return

    const onScroll = () => {
      callback(lenis.scroll)
    }

    lenis.on('scroll', onScroll)

    return () => {
      lenis.off('scroll', onScroll)
    }
  }, [lenis, callback])
}
