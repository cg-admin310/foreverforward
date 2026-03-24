"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, BookOpen, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="text-[120px] sm:text-[180px] font-bold leading-none">
            <span className="text-[#C9A84C]">4</span>
            <motion.span
              className="text-[#5A7247] inline-block"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              0
            </motion.span>
            <span className="text-[#C9A84C]">4</span>
          </span>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Looks like this page took a wrong turn. Don&apos;t worry, even the best
            navigators get lost sometimes. Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button asChild size="lg">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="border-white/20 text-white hover:bg-white/10">
            <Link href="/programs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Explore Programs
            </Link>
          </Button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid sm:grid-cols-3 gap-4"
        >
          <Link
            href="/programs"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <Search className="h-6 w-6 text-[#C9A84C] mx-auto mb-2" />
            <p className="text-white font-medium">Programs</p>
            <p className="text-sm text-white/60">Find your path forward</p>
          </Link>
          <Link
            href="/services"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <BookOpen className="h-6 w-6 text-[#5A7247] mx-auto mb-2" />
            <p className="text-white font-medium">IT Services</p>
            <p className="text-sm text-white/60">For nonprofits & schools</p>
          </Link>
          <Link
            href="/contact"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <Phone className="h-6 w-6 text-[#C9A84C] mx-auto mb-2" />
            <p className="text-white font-medium">Contact Us</p>
            <p className="text-sm text-white/60">We&apos;re here to help</p>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-white/40 text-sm"
        >
          Forever Forward Foundation · Los Angeles, CA
        </motion.p>
      </div>
    </div>
  );
}
