"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
};

const socialIcons = [
  { href: SOCIAL_LINKS.instagram, icon: Instagram, label: "Instagram" },
  { href: SOCIAL_LINKS.facebook, icon: Facebook, label: "Facebook" },
  { href: SOCIAL_LINKS.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: SOCIAL_LINKS.youtube, icon: Youtube, label: "YouTube" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

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
    <footer className="bg-[#1A1A1A]">
      {/* Gold accent line */}
      <div className="h-1 bg-[#C9A84C]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-[#C9A84C]">
                Forever Forward
              </span>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Empowering fathers, strengthening families, and inspiring youth
              through transformative education and technology.
            </p>
            <div className="space-y-3 text-sm text-white/70">
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/[^0-9]/g, "")}`}
                className="flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
              >
                <Phone className="h-4 w-4 text-[#C9A84C]" />
                {CONTACT_INFO.phone}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
              >
                <Mail className="h-4 w-4 text-[#C9A84C]" />
                {CONTACT_INFO.email}
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#C9A84C] mt-0.5 shrink-0" />
                <span>{CONTACT_INFO.address}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Programs */}
          <div>
            <h3 className="text-white font-semibold mb-6">Programs</h3>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-[#C9A84C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services & More */}
          <div>
            <h3 className="text-white font-semibold mb-6">Services & More</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-[#C9A84C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h3 className="text-white font-semibold mb-6">Stay Connected</h3>

            {/* Social Links */}
            <div className="flex gap-3 mb-6">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#2D2D2D] text-white/70 hover:bg-[#C9A84C] hover:text-[#1A1A1A] transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div>
              <p className="text-sm text-white/70 mb-3">
                Get updates on events, programs, and community stories.
              </p>
              {isSubscribed ? (
                <p className="text-[#C9A84C] text-sm font-medium">
                  Thanks for subscribing!
                </p>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex gap-2"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#2D2D2D] border-[#444444] text-white placeholder:text-white/50 focus-visible:ring-[#C9A84C]"
                    required
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isSubmitting}
                    className="shrink-0"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2D2D2D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-white/50 text-center md:text-left">
              <p>
                &copy; {new Date().getFullYear()} Forever Forward Foundation.
                All rights reserved.
              </p>
              <p className="mt-1">
                A 501(c)(3) nonprofit organization. EIN: 87-0944016
              </p>
            </div>
            <div className="flex gap-6 text-sm text-white/50">
              <Link
                href="/privacy"
                className="hover:text-[#C9A84C] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-[#C9A84C] transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
