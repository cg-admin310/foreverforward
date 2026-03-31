"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Heart,
  Users,
  Handshake,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PROGRAMS, SERVICES } from "@/lib/constants";
import { timing } from "@/lib/animations";

const navLinks = [
  { href: "/about", label: "About" },
  {
    label: "Programs",
    dropdown: PROGRAMS.map((p) => ({
      href: `/programs/${p.slug}`,
      label: p.name,
      description: p.tagline,
    })),
    viewAllHref: "/programs",
  },
  {
    label: "Services",
    dropdown: SERVICES.map((s) => ({
      href: `/services/${s.slug}`,
      label: s.name,
      description: s.tagline,
    })),
    viewAllHref: "/services",
  },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
];

const getInvolvedLinks = [
  {
    href: "/get-involved/donate",
    label: "Donate",
    icon: Heart,
    description: "Support our mission",
    color: "text-rose-400",
  },
  {
    href: "/get-involved/volunteer",
    label: "Volunteer",
    icon: Users,
    description: "Give your time",
    color: "text-sky-400",
  },
  {
    href: "/get-involved/partner",
    label: "Partner",
    icon: Handshake,
    description: "Collaborate with us",
    color: "text-emerald-400",
  },
  {
    href: "/get-involved/enroll",
    label: "Enroll",
    icon: GraduationCap,
    description: "Join a program",
    color: "text-[#C9A84C]",
  },
];

// Animation variants
const logoVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.1 + i * 0.05,
      ease: [0.16, 1, 0.3, 1] as const
    }
  })
};

const dropdownVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1] as const
    }
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    transition: { duration: 0.15 }
  }
};

const dropdownItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      delay: i * 0.03,
      ease: [0.16, 1, 0.3, 1] as const
    }
  })
};

const mobileMenuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, delay: 0.2 }
  }
};

const mobileNavItemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      delay: 0.1 + i * 0.06,
      ease: [0.16, 1, 0.3, 1] as const
    }
  }),
  exit: (i: number) => ({
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
      delay: i * 0.02
    }
  })
};

// Animated underline component
function AnimatedUnderline({ isActive }: { isActive: boolean }) {
  return (
    <motion.div
      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]"
      initial={false}
      animate={{
        scaleX: isActive ? 1 : 0,
        opacity: isActive ? 1 : 0
      }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
      style={{ originX: 0.5 }}
    />
  );
}

// Glowing button component
function GlowButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      className={cn(
        "relative group px-5 py-2.5 rounded-lg font-semibold text-sm",
        "bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A]",
        "transition-all duration-300",
        "hover:shadow-[0_0_25px_rgba(201,168,76,0.4)]",
        "active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {/* Animated glow ring */}
      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />

      {/* Shine effect */}
      <span className="absolute inset-0 rounded-lg overflow-hidden">
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
      </span>

      <span className="relative flex items-center gap-1.5">
        {children}
      </span>
    </button>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // Scroll-based opacity for glassmorphism
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(26, 26, 26, 0.7)", "rgba(26, 26, 26, 0.95)"]
  );
  const headerBlur = useTransform(scrollY, [0, 100], [8, 16]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <motion.header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-shadow duration-300",
          isScrolled && "shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
        )}
        style={{
          backgroundColor: headerBg as any,
          backdropFilter: `blur(${headerBlur.get()}px)`,
          WebkitBackdropFilter: `blur(${headerBlur.get()}px)`,
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Animated Logo */}
            <motion.div
              variants={logoVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
            >
              <Link
                href="/"
                className="flex items-center shrink-0 group relative"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={timing.spring.snappy}
                >
                  <Image
                    src="/images/brand/ff-logo-horizontal-dark-bg.svg"
                    alt="Forever Forward"
                    width={180}
                    height={40}
                    className="h-8 lg:h-10 w-auto"
                    priority
                  />
                </motion.div>
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/5 rounded-lg blur-xl transition-all duration-300" />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  className="relative"
                  variants={navItemVariants}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  custom={index}
                  onMouseEnter={() => link.dropdown && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {link.dropdown ? (
                    <>
                      <button
                        className={cn(
                          "relative flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors",
                          openDropdown === link.label
                            ? "text-[#C9A84C]"
                            : "text-white/90 hover:text-white"
                        )}
                      >
                        {link.label}
                        <motion.span
                          animate={{ rotate: openDropdown === link.label ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.span>
                        <AnimatedUnderline isActive={openDropdown === link.label} />
                      </button>

                      <AnimatePresence>
                        {openDropdown === link.label && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute top-full left-0 mt-2 w-80 origin-top"
                          >
                            {/* Dropdown card with glassmorphism */}
                            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/20 overflow-hidden">
                              {/* Gradient accent at top */}
                              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C]" />

                              <div className="p-3">
                                {link.dropdown.map((item, i) => (
                                  <motion.div
                                    key={item.href}
                                    variants={dropdownItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={i}
                                  >
                                    <Link
                                      href={item.href}
                                      className={cn(
                                        "group block px-4 py-3 rounded-xl transition-all duration-200",
                                        isActive(item.href)
                                          ? "bg-gradient-to-r from-[#FBF6E9] to-[#EFF4EB]"
                                          : "hover:bg-[#F5F3EF]"
                                      )}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-semibold text-[#1A1A1A] group-hover:text-[#C9A84C] transition-colors">
                                          {item.label}
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-[#C9A84C] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                                      </div>
                                      <span className="block text-sm text-[#555555] mt-0.5">
                                        {item.description}
                                      </span>
                                    </Link>
                                  </motion.div>
                                ))}
                              </div>

                              {link.viewAllHref && (
                                <Link
                                  href={link.viewAllHref}
                                  className="flex items-center justify-between px-6 py-3 text-sm font-semibold text-[#5A7247] border-t border-[#DDDDDD] hover:bg-[#EFF4EB] transition-colors group"
                                >
                                  <span>View all {link.label.toLowerCase()}</span>
                                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={link.href!}
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium transition-colors",
                        isActive(link.href!)
                          ? "text-[#C9A84C]"
                          : "text-white/90 hover:text-white"
                      )}
                    >
                      {link.label}
                      <AnimatedUnderline isActive={isActive(link.href!)} />
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Get Involved Button (Desktop) */}
            <motion.div
              className="hidden lg:block relative"
              variants={navItemVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              custom={navLinks.length}
              onMouseEnter={() => setOpenDropdown("get-involved")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <GlowButton>
                <Sparkles className="h-4 w-4" />
                Get Involved
                <motion.span
                  animate={{ rotate: openDropdown === "get-involved" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </GlowButton>

              <AnimatePresence>
                {openDropdown === "get-involved" && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full right-0 mt-2 w-72 origin-top-right"
                  >
                    <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/20 overflow-hidden">
                      {/* Gradient accent */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A84C] via-[#5A7247] to-[#C9A84C]" />

                      <div className="p-3">
                        {getInvolvedLinks.map((item, i) => (
                          <motion.div
                            key={item.href}
                            variants={dropdownItemVariants}
                            initial="hidden"
                            animate="visible"
                            custom={i}
                          >
                            <Link
                              href={item.href}
                              className={cn(
                                "group flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive(item.href)
                                  ? "bg-gradient-to-r from-[#FBF6E9] to-[#EFF4EB]"
                                  : "hover:bg-[#F5F3EF]"
                              )}
                            >
                              <div className={cn(
                                "p-2 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D]",
                                "group-hover:scale-110 transition-transform duration-200"
                              )}>
                                <item.icon className={cn("h-5 w-5", item.color)} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-[#1A1A1A] group-hover:text-[#C9A84C] transition-colors">
                                    {item.label}
                                  </span>
                                  <ArrowRight className="h-4 w-4 text-[#C9A84C] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                                </div>
                                <span className="block text-sm text-[#555555]">
                                  {item.description}
                                </span>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden relative p-2 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
              variants={navItemVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              custom={0}
            >
              <div className="relative w-6 h-6">
                <motion.span
                  className="absolute top-1 left-0 w-6 h-0.5 bg-[#C9A84C] rounded-full"
                  animate={isMobileMenuOpen
                    ? { rotate: 45, y: 7 }
                    : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute top-3 left-0 w-6 h-0.5 bg-[#C9A84C] rounded-full"
                  animate={isMobileMenuOpen
                    ? { opacity: 0, x: -10 }
                    : { opacity: 1, x: 0 }
                  }
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute top-5 left-0 w-6 h-0.5 bg-[#C9A84C] rounded-full"
                  animate={isMobileMenuOpen
                    ? { rotate: -45, y: -7 }
                    : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-[#1A1A1A]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Gradient orbs */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#5A7247]/10 rounded-full blur-3xl" />

              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #C9A84C 1px, transparent 1px),
                    linear-gradient(to bottom, #C9A84C 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }}
              />
            </div>

            {/* Menu Content */}
            <div className="relative h-full flex flex-col pt-20 pb-8 px-6 overflow-y-auto">
              {/* Main Navigation */}
              <div className="flex-1 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.label}
                    variants={mobileNavItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={index}
                  >
                    {link.dropdown ? (
                      <div>
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === link.label ? null : link.label
                            )
                          }
                          className="flex items-center justify-between w-full py-4 text-xl font-semibold text-white"
                        >
                          {link.label}
                          <motion.span
                            animate={{ rotate: openDropdown === link.label ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-6 w-6 text-[#C9A84C]" />
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {openDropdown === link.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pb-4 space-y-1 border-l-2 border-[#C9A84C]/30">
                                {link.dropdown.map((item, i) => (
                                  <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                  >
                                    <Link
                                      href={item.href}
                                      className={cn(
                                        "block py-3 px-4 rounded-lg transition-all",
                                        isActive(item.href)
                                          ? "bg-[#C9A84C]/10 text-[#C9A84C]"
                                          : "text-white/70 hover:text-white hover:bg-white/5"
                                      )}
                                    >
                                      <span className="font-medium">{item.label}</span>
                                      <span className="block text-sm text-white/50 mt-0.5">
                                        {item.description}
                                      </span>
                                    </Link>
                                  </motion.div>
                                ))}
                                {link.viewAllHref && (
                                  <Link
                                    href={link.viewAllHref}
                                    className="flex items-center gap-2 py-3 px-4 text-[#C9A84C] font-semibold"
                                  >
                                    View all
                                    <ArrowRight className="h-4 w-4" />
                                  </Link>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href!}
                        className={cn(
                          "block py-4 text-xl font-semibold transition-colors",
                          isActive(link.href!)
                            ? "text-[#C9A84C]"
                            : "text-white hover:text-[#C9A84C]"
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Get Involved Section (Mobile) */}
              <motion.div
                className="pt-6 mt-6 border-t border-white/10"
                variants={mobileNavItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={navLinks.length}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-[#C9A84C] mb-4">
                  <Sparkles className="h-4 w-4" />
                  Get Involved
                </span>

                <div className="grid grid-cols-2 gap-3">
                  {getInvolvedLinks.map((item, i) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex flex-col items-center gap-2 py-4 px-3 rounded-xl",
                          "bg-gradient-to-b from-white/10 to-white/5 border border-white/10",
                          "hover:border-[#C9A84C]/30 hover:bg-white/10",
                          "transition-all duration-200 group"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg bg-[#1A1A1A]",
                          "group-hover:scale-110 transition-transform duration-200"
                        )}>
                          <item.icon className={cn("h-5 w-5", item.color)} />
                        </div>
                        <span className="font-semibold text-white text-sm">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                className="mt-8 pt-6 border-t border-white/10 text-center"
                variants={mobileNavItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={navLinks.length + 1}
              >
                <p className="text-white/50 text-sm">Need help?</p>
                <a
                  href="tel:+19518775196"
                  className="text-[#C9A84C] font-semibold hover:underline"
                >
                  (951) 877-5196
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
