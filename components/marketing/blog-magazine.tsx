'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BlogPost {
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  slug: string
  image: string
}

const BLOG_POSTS: BlogPost[] = [
  {
    title: '5 Ways Tech Skills Are Transforming Fatherhood',
    excerpt: 'Discover how dads are using technology to stay connected, create memories, and build stronger bonds with their children in the digital age.',
    category: 'Fatherhood',
    date: 'Mar 15, 2024',
    readTime: '5 min read',
    slug: 'tech-skills-transforming-fatherhood',
    image: '/images/authentic/fathers/father-with-baby.jpg',
  },
  {
    title: 'From the Shop Floor to the Server Room',
    excerpt: 'How one Father Forward graduate went from manufacturing to managing IT.',
    category: 'Success Stories',
    date: 'Mar 10, 2024',
    readTime: '7 min read',
    slug: 'marcus-success-story',
    image: '/images/authentic/tech/it-professional-server-room.jpg',
  },
  {
    title: 'Why Nonprofits Need Managed IT in 2024',
    excerpt: 'Security threats are evolving. Here\'s how to protect your organization.',
    category: 'IT for Nonprofits',
    date: 'Mar 5, 2024',
    readTime: '6 min read',
    slug: 'nonprofits-managed-it-2024',
    image: '/images/authentic/tech/tech-installing-cctv.jpg',
  },
  {
    title: 'Building Family Traditions in the Digital Age',
    excerpt: 'Creating meaningful connections through intentional technology use.',
    category: 'Fatherhood',
    date: 'Feb 28, 2024',
    readTime: '4 min read',
    slug: 'family-traditions-digital-age',
    image: '/images/authentic/fathers/father-child-shoulders.jpg',
  },
]

export function BlogMagazine() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const featuredPost = BLOG_POSTS[0]
  const recentPosts = BLOG_POSTS.slice(1)

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-sm font-medium text-[#C9A84C] uppercase tracking-wider">
              From the Blog
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mt-2">
              Stories & Insights
            </h2>
          </div>
          <Button asChild variant="outline" className="group w-fit">
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {/* Magazine layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured post - 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="relative bg-[#FAFAF8] rounded-2xl overflow-hidden border border-[#DDDDDD] hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent" />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#C9A84C] text-[#1A1A1A] text-xs font-semibold">
                      {featuredPost.category}
                    </span>
                  </div>

                  {/* Featured label */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 text-[#1A1A1A] text-xs font-medium">
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-4 text-sm text-[#888888] mb-4">
                    <span>{featuredPost.date}</span>
                    <span className="w-1 h-1 rounded-full bg-[#888888]" />
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#C9A84C] transition-colors">
                    {featuredPost.title}
                  </h3>

                  <p className="text-[#555555] text-lg leading-relaxed mb-4">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-[#C9A84C] font-medium">
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Recent posts list - 1 column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col"
          >
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-6">
              Recent Posts
            </h3>

            <div className="space-y-6 flex-1">
              {recentPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <article className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="80px"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-[#C9A84C]">
                        {post.category}
                      </span>
                      <h4 className="text-[#1A1A1A] font-semibold leading-snug mt-1 group-hover:text-[#C9A84C] transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#888888] mt-2">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* View all link */}
            <Link
              href="/blog"
              className="flex items-center gap-2 text-[#555555] hover:text-[#C9A84C] font-medium mt-6 pt-6 border-t border-[#DDDDDD] group"
            >
              <span>View All Articles</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
