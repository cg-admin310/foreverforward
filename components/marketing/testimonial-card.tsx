"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  index?: number;
}

export function TestimonialCard({
  quote,
  name,
  role,
  index = 0,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative bg-[#FBF6E9] rounded-xl p-6 pl-8 border-l-4 border-[#C9A84C]"
    >
      <Quote className="absolute top-6 right-6 h-8 w-8 text-[#C9A84C]/30" />
      <blockquote className="text-[#1A1A1A] leading-relaxed mb-4 relative z-10">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div>
        <p className="font-semibold text-[#1A1A1A]">{name}</p>
        <p className="text-sm text-[#555555]">{role}</p>
      </div>
    </motion.div>
  );
}
