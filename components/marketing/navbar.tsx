"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Heart,
  Users,
  Handshake,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PROGRAMS, SERVICES } from "@/lib/constants";

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
  },
  {
    href: "/get-involved/volunteer",
    label: "Volunteer",
    icon: Users,
    description: "Give your time",
  },
  {
    href: "/get-involved/partner",
    label: "Partner",
    icon: Handshake,
    description: "Collaborate with us",
  },
  {
    href: "/get-involved/enroll",
    label: "Enroll",
    icon: GraduationCap,
    description: "Join a program",
  },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

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

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#1A1A1A] shadow-lg"
          : "bg-[#1A1A1A]"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl lg:text-2xl font-bold text-[#C9A84C]">
              Forever Forward
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {link.dropdown ? (
                  <>
                    <button
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors",
                        openDropdown === link.label
                          ? "text-[#C9A84C]"
                          : "text-white hover:text-[#C9A84C]"
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openDropdown === link.label && "rotate-180"
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#DDDDDD] overflow-hidden"
                        >
                          <div className="p-2">
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                  "block px-4 py-3 rounded-lg transition-colors",
                                  isActive(item.href)
                                    ? "bg-[#FBF6E9]"
                                    : "hover:bg-[#F5F3EF]"
                                )}
                              >
                                <span className="block font-medium text-[#1A1A1A]">
                                  {item.label}
                                </span>
                                <span className="block text-sm text-[#555555]">
                                  {item.description}
                                </span>
                              </Link>
                            ))}
                          </div>
                          {link.viewAllHref && (
                            <Link
                              href={link.viewAllHref}
                              className="block px-6 py-3 text-sm font-medium text-[#C9A84C] border-t border-[#DDDDDD] hover:bg-[#FBF6E9] transition-colors"
                            >
                              View all {link.label.toLowerCase()} →
                            </Link>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={link.href!}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors",
                      isActive(link.href!)
                        ? "text-[#C9A84C]"
                        : "text-white hover:text-[#C9A84C]"
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Get Involved Button (Desktop) */}
          <div
            className="hidden lg:block relative"
            onMouseEnter={() => setOpenDropdown("get-involved")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <Button size="lg">
              Get Involved
              <ChevronDown
                className={cn(
                  "h-4 w-4 ml-1 transition-transform",
                  openDropdown === "get-involved" && "rotate-180"
                )}
              />
            </Button>
            <AnimatePresence>
              {openDropdown === "get-involved" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#DDDDDD] overflow-hidden"
                >
                  <div className="p-2">
                    {getInvolvedLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3 rounded-lg transition-colors",
                          isActive(item.href)
                            ? "bg-[#FBF6E9]"
                            : "hover:bg-[#F5F3EF]"
                        )}
                      >
                        <item.icon className="h-5 w-5 text-[#C9A84C] mt-0.5" />
                        <div>
                          <span className="block font-medium text-[#1A1A1A]">
                            {item.label}
                          </span>
                          <span className="block text-sm text-[#555555]">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#C9A84C]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#1A1A1A] border-t border-[#2D2D2D] overflow-hidden"
          >
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    {link.dropdown ? (
                      <div>
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === link.label ? null : link.label
                            )
                          }
                          className="flex items-center justify-between w-full py-2 text-white font-medium"
                        >
                          {link.label}
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 text-[#C9A84C] transition-transform",
                              openDropdown === link.label && "rotate-180"
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {openDropdown === link.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 mt-2 space-y-2 border-l-2 border-[#C9A84C]"
                            >
                              {link.dropdown.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className={cn(
                                    "block py-2",
                                    isActive(item.href)
                                      ? "text-[#C9A84C]"
                                      : "text-white/80 hover:text-[#C9A84C]"
                                  )}
                                >
                                  {item.label}
                                </Link>
                              ))}
                              {link.viewAllHref && (
                                <Link
                                  href={link.viewAllHref}
                                  className="block py-2 text-[#C9A84C] font-medium"
                                >
                                  View all →
                                </Link>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href!}
                        className={cn(
                          "block py-2 font-medium",
                          isActive(link.href!)
                            ? "text-[#C9A84C]"
                            : "text-white hover:text-[#C9A84C]"
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Get Involved Section (Mobile) */}
                <div className="pt-4 border-t border-[#2D2D2D]">
                  <span className="block text-sm text-[#888888] mb-3">
                    Get Involved
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {getInvolvedLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 py-3 px-4 bg-[#2D2D2D] rounded-lg text-white hover:bg-[#C9A84C] hover:text-[#1A1A1A] transition-colors"
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
