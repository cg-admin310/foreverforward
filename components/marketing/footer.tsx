"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Send,
  Check,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PROGRAMS, SERVICES, CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

const footerLinks = {
  programs: PROGRAMS.map((p) => ({
    href: `/programs/${p.slug}`,
    label: p.name,
  })),
  services: [
    ...SERVICES.map((s) => ({
      href: `/services/${s.slug}`,
      label: s.name,
    })),
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  getInvolved: [
    { href: "/get-involved/donate", label: "Donate" },
    { href: "/get-involved/volunteer", label: "Volunteer" },
    { href: "/get-involved/partner", label: "Partner With Us" },
    { href: "/get-involved/enroll", label: "Enroll in a Program" },
  ],
};

const socialIcons = [
  { href: SOCIAL_LINKS.instagram, icon: Instagram, label: "Instagram", color: "hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400" },
  { href: SOCIAL_LINKS.facebook, icon: Facebook, label: "Facebook", color: "hover:bg-[#1877F2]" },
  { href: SOCIAL_LINKS.linkedin, icon: Linkedin, label: "LinkedIn", color: "hover:bg-[#0A66C2]" },
  { href: SOCIAL_LINKS.youtube, icon: Youtube, label: "YouTube", color: "hover:bg-[#FF0000]" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

// Animated link component with underline slide effect
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative text-sm text-white/70 hover:text-white transition-colors duration-200"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] group-hover:w-full transition-all duration-300" />
    </Link>
  );
}

// Double chevron SVG for footer
function FooterChevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-[#C9A84C]/20"
      fill="currentColor"
    >
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
      <path d="M12.59 16.59L17.17 12 12.59 7.41 14 6l6 6-6 6-1.41-1.41z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const result = await subscribeToNewsletter(email, "footer");
      if (result.success) {
        setIsSubscribed(true);
        setEmail("");
      } else {
        console.error("Failed to subscribe:", result.error);
      }
    } catch (error) {
      console.error("Error subscribing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer ref={footerRef} className="relative bg-[#1A1A1A] overflow-hidden">
      {/* Animated gradient top border */}
      <div className="relative h-1 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5A7247] via-[#C9A84C] to-[#5A7247]" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#5A7247]/5 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #C9A84C 1px, transparent 1px),
              linear-gradient(to bottom, #C9A84C 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Decorative chevrons */}
        <div className="absolute top-20 right-20 opacity-10">
          <FooterChevron />
        </div>
        <div className="absolute bottom-40 left-16 opacity-10">
          <FooterChevron />
        </div>
      </div>

      {/* Main Footer Content */}
      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Column 1: Brand & Contact - Takes more space */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            {/* Animated Logo */}
            <motion.div variants={logoVariants} className="mb-6">
              <Link href="/" className="inline-block group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Image
                    src="/images/brand/ff-logo-stacked-tagline-dark-bg.svg"
                    alt="Forever Forward"
                    width={200}
                    height={80}
                    className="h-20 w-auto"
                  />
                </motion.div>
              </Link>
            </motion.div>

            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
              Building futures through technology. Empowering fathers, strengthening families,
              and inspiring youth across Los Angeles.
            </p>

            {/* Contact Info with hover effects */}
            <div className="space-y-3 text-sm">
              <motion.a
                href={`tel:${CONTACT_INFO.phone.replace(/[^0-9]/g, "")}`}
                className="group flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <span className="p-2 rounded-lg bg-[#2D2D2D] group-hover:bg-[#C9A84C]/20 transition-colors">
                  <Phone className="h-4 w-4 text-[#C9A84C]" />
                </span>
                <span className="group-hover:text-[#C9A84C] transition-colors">
                  {CONTACT_INFO.phone}
                </span>
              </motion.a>

              <motion.a
                href={`mailto:${CONTACT_INFO.email}`}
                className="group flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <span className="p-2 rounded-lg bg-[#2D2D2D] group-hover:bg-[#C9A84C]/20 transition-colors">
                  <Mail className="h-4 w-4 text-[#C9A84C]" />
                </span>
                <span className="group-hover:text-[#C9A84C] transition-colors break-all">
                  {CONTACT_INFO.email}
                </span>
              </motion.a>

              <motion.div
                className="group flex items-start gap-3 text-white/70"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <span className="p-2 rounded-lg bg-[#2D2D2D] shrink-0">
                  <MapPin className="h-4 w-4 text-[#C9A84C]" />
                </span>
                <span className="pt-2">{CONTACT_INFO.address}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Column 2: Programs */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-[#C9A84C] to-transparent" />
              Programs
            </h3>
            <ul className="space-y-3">
              {footerLinks.programs.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Services & More */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-[#C9A84C] to-transparent" />
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.05 }}
                >
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Get Involved */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-[#C9A84C] to-transparent" />
              Get Involved
            </h3>
            <ul className="space-y-3">
              {footerLinks.getInvolved.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.05 }}
                >
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 5: Newsletter & Social */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-[#C9A84C] to-transparent" />
              Stay Connected
            </h3>

            {/* Social Links with hover animations */}
            <div className="flex gap-2 mb-6">
              {socialIcons.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "p-2.5 rounded-lg bg-[#2D2D2D] text-white transition-all duration-300",
                    social.color,
                    "hover:text-white hover:shadow-lg"
                  )}
                  aria-label={social.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>

            {/* Newsletter with premium styling */}
            <div>
              <p className="text-sm text-white/60 mb-3">
                Updates on events, programs & stories.
              </p>

              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 py-3 px-4 bg-[#5A7247]/20 border border-[#5A7247]/30 rounded-xl"
                >
                  <div className="p-1 rounded-full bg-[#5A7247]">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-[#5A7247] text-sm font-medium">
                    You're subscribed!
                  </span>
                </motion.div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="relative">
                  <div
                    className={cn(
                      "relative rounded-xl overflow-hidden transition-all duration-300",
                      inputFocused
                        ? "ring-2 ring-[#C9A84C]/50 shadow-[0_0_20px_rgba(201,168,76,0.15)]"
                        : "ring-1 ring-white/10"
                    )}
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      className="w-full px-4 py-3 pr-12 bg-[#2D2D2D] border-0 text-white text-sm placeholder:text-white/40 focus:outline-none"
                      required
                    />
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg",
                        "bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A]",
                        "hover:shadow-[0_0_15px_rgba(201,168,76,0.4)] transition-all duration-300",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/5">
        {/* Gradient line overlay */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-white/40 text-center md:text-left">
              <p className="flex items-center gap-2 justify-center md:justify-start">
                <span>&copy; {new Date().getFullYear()} Forever Forward Foundation.</span>
                <span className="hidden sm:inline">All rights reserved.</span>
              </p>
              <p className="mt-1 flex items-center gap-2 justify-center md:justify-start">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#5A7247]/10 rounded text-[#5A7247] text-xs font-medium">
                  501(c)(3)
                </span>
                <span>EIN: 87-0944016</span>
              </p>
            </div>

            <div className="flex gap-6 text-sm text-white/40">
              <Link
                href="/privacy"
                className="hover:text-[#C9A84C] transition-colors relative group"
              >
                Privacy Policy
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#C9A84C] group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/terms"
                className="hover:text-[#C9A84C] transition-colors relative group"
              >
                Terms of Service
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#C9A84C] group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/about"
                className="hover:text-[#C9A84C] transition-colors relative group"
              >
                About
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#C9A84C] group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Powered by badge */}
        <motion.div
          className="flex items-center justify-center pb-6 gap-2 text-xs text-white/30"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <span>Building Tomorrow's Tech Leaders</span>
          <span className="w-1 h-1 bg-[#C9A84C]/50 rounded-full" />
          <span>Los Angeles</span>
        </motion.div>
      </div>
    </footer>
  );
}
