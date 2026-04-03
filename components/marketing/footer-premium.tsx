'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Facebook, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { subscribeToNewsletter } from '@/lib/actions/newsletter'

const QUICK_LINKS = [
  { label: 'Programs', href: '/programs' },
  { label: 'IT Services', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const SOCIAL_LINKS = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
]

export function FooterPremium() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)

    const result = await subscribeToNewsletter(email, 'footer')
    if (result.success) {
      setIsSubscribed(true)
    }
    setIsSubmitting(false)
  }

  return (
    <footer className="bg-[#1A1A1A] relative overflow-hidden">
      {/* Newsletter section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                Stay in the Loop
              </h3>
              <p className="text-white/60">
                Get updates on programs, events, and community impact. No spam, just good news.
              </p>
            </div>

            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 px-6 py-4 rounded-xl bg-[#5A7247]/20 text-[#5A7247]"
              >
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">You&apos;re subscribed! Watch for updates.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#C9A84C]"
                  required
                />
                <Button type="submit" disabled={isSubmitting} className="h-12 px-6 shrink-0">
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/brand/ff-logo-horizontal-dark-bg.svg"
                alt="Forever Forward"
                width={180}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Empowering fathers, strengthening families, and inspiring youth through technology and leadership.
            </p>
            <p className="text-white/40 text-xs">
              501(c)(3) Nonprofit Organization
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#C9A84C] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:4ever4wardfoundation@gmail.com"
                  className="flex items-start gap-3 text-white/60 hover:text-[#C9A84C] transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>4ever4wardfoundation@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+19518775196"
                  className="flex items-start gap-3 text-white/60 hover:text-[#C9A84C] transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>(951) 877-5196</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    6111 S Gramercy Pl, Suite 4<br />
                    Los Angeles, CA 90047
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-6">Connect</h4>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:bg-[#C9A84C] hover:text-[#1A1A1A] transition-all"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>© {new Date().getFullYear()} Forever Forward Foundation. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white/60 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white/60 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
