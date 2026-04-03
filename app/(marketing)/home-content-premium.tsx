'use client'

/**
 * Forever Forward Premium Homepage
 *
 * A completely redesigned homepage that breaks generic patterns:
 * - Split-screen hero with authentic imagery
 * - Timeline-style impact stats (not grid)
 * - Featured + masonry program layout
 * - Proof-based services showcase
 * - Full-bleed testimonial carousel
 * - Magazine-style blog preview
 * - Dramatic two-path CTA
 *
 * Uses real photos from /images/authentic/ instead of AI-generated
 */

import { HeroSectionPremium } from '@/components/marketing/hero-section-premium'
import { ImpactTimeline } from '@/components/marketing/impact-timeline'
import { AboutStory } from '@/components/marketing/about-story'
import { ProgramsMasonry } from '@/components/marketing/programs-masonry'
import { ServicesShowcase } from '@/components/marketing/services-showcase'
import { TestimonialCarousel } from '@/components/marketing/testimonial-carousel'
import { BlogMagazine } from '@/components/marketing/blog-magazine'
import { CTADramatic } from '@/components/marketing/cta-dramatic'

export function HomeContentPremium() {
  return (
    <>
      {/* Hero: Split-screen with authentic imagery */}
      <HeroSectionPremium />

      {/* Impact: Timeline layout, not grid */}
      <ImpactTimeline />

      {/* About: Who we are story section */}
      <AboutStory />

      {/* Programs: Featured hero + asymmetric masonry */}
      <ProgramsMasonry />

      {/* Services: Proof-based showcase with real tech photos */}
      <ServicesShowcase />

      {/* Testimonials: Full-bleed carousel */}
      <TestimonialCarousel />

      {/* Blog: Magazine layout (featured + list) */}
      <BlogMagazine />

      {/* CTA: Two clear paths + secondary actions */}
      <CTADramatic />
    </>
  )
}
