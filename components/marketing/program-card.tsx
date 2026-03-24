"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/shared/badge";

interface ProgramCardProps {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  audience: "fathers" | "youth" | "families" | "kids" | "students";
  icon: string;
  index?: number;
}

export function ProgramCard({
  name,
  slug,
  tagline,
  description,
  audience,
  icon,
  index = 0,
}: ProgramCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/programs/${slug}`}
        className="group block h-full"
      >
        <article
          className={cn(
            "relative h-full rounded-xl bg-white p-6",
            "shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
            "transition-all duration-300",
            "hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]",
            "hover:border-t-[3px] hover:border-t-[#C9A84C]",
            "border-t-[3px] border-t-transparent"
          )}
        >
          {/* Icon & Badge Row */}
          <div className="flex items-start justify-between mb-4">
            <span className="text-4xl">{icon}</span>
            <Badge variant={audience} size="sm" />
          </div>

          {/* Content */}
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#C9A84C] transition-colors">
            {name}
          </h3>
          <p className="text-sm font-medium text-[#C9A84C] mb-3">{tagline}</p>
          <p className="text-[#555555] text-sm leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-1 text-[#5A7247] font-medium text-sm group-hover:text-[#C9A84C] transition-colors">
            <span>Learn More</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
