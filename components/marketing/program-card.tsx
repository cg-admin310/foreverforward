"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/shared/badge";
import { useRef, useState } from "react";
import {
  FatherForwardIcon,
  TechReadyYouthIcon,
  MakingMomentsIcon,
  ScriptToScreenIcon,
  StoriesFromFutureIcon,
  LULAIcon,
} from "@/components/svg/icons";

interface ProgramCardProps {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  audience: "fathers" | "youth" | "families" | "kids" | "students";
  icon: string;
  index?: number;
}

// Map slug to custom icon component
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  "father-forward": FatherForwardIcon,
  "tech-ready-youth": TechReadyYouthIcon,
  "making-moments": MakingMomentsIcon,
  "from-script-to-screen": ScriptToScreenIcon,
  "stories-from-my-future": StoriesFromFutureIcon,
  "lula": LULAIcon,
};

// Audience color schemes
const audienceColors: Record<string, { bg: string; border: string; glow: string }> = {
  fathers: {
    bg: "from-[#C9A84C]/10 to-[#E8D48B]/5",
    border: "group-hover:border-[#C9A84C]",
    glow: "group-hover:shadow-[0_8px_40px_rgba(201,168,76,0.15)]",
  },
  youth: {
    bg: "from-[#5A7247]/10 to-[#7A9A63]/5",
    border: "group-hover:border-[#5A7247]",
    glow: "group-hover:shadow-[0_8px_40px_rgba(90,114,71,0.15)]",
  },
  families: {
    bg: "from-rose-500/10 to-rose-400/5",
    border: "group-hover:border-rose-400",
    glow: "group-hover:shadow-[0_8px_40px_rgba(251,113,133,0.15)]",
  },
  kids: {
    bg: "from-sky-500/10 to-sky-400/5",
    border: "group-hover:border-sky-400",
    glow: "group-hover:shadow-[0_8px_40px_rgba(56,189,248,0.15)]",
  },
  students: {
    bg: "from-violet-500/10 to-violet-400/5",
    border: "group-hover:border-violet-400",
    glow: "group-hover:shadow-[0_8px_40px_rgba(167,139,250,0.15)]",
  },
};

export function ProgramCard({
  name,
  slug,
  tagline,
  description,
  audience,
  icon,
  index = 0,
}: ProgramCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const IconComponent = iconMap[slug];
  const colors = audienceColors[audience];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <Link href={`/programs/${slug}`} className="group block h-full">
          <article
            className={cn(
              "relative h-full rounded-2xl bg-white p-6 lg:p-8",
              "border border-[#DDDDDD] transition-all duration-500",
              "shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
              colors.border,
              colors.glow,
              "overflow-hidden"
            )}
          >
            {/* Gradient background overlay */}
            <div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                "bg-gradient-to-br",
                colors.bg
              )}
            />

            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, transparent 40%, ${audience === 'fathers' ? 'rgba(201,168,76,0.2)' : 'rgba(90,114,71,0.2)'} 50%, transparent 60%)`,
                backgroundSize: "200% 200%",
              }}
              animate={isHovered ? {
                backgroundPosition: ["0% 0%", "100% 100%"]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Content wrapper */}
            <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
              {/* Icon & Badge Row */}
              <div className="flex items-start justify-between mb-5">
                {/* Icon container with glow */}
                <div className={cn(
                  "relative p-3 rounded-xl transition-all duration-300",
                  "bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D]",
                  "group-hover:shadow-lg group-hover:scale-105",
                  audience === 'fathers' && "group-hover:shadow-[#C9A84C]/20",
                  audience === 'youth' && "group-hover:shadow-[#5A7247]/20"
                )}>
                  {IconComponent ? (
                    <IconComponent className="w-8 h-8" />
                  ) : (
                    <span className="text-3xl block">{icon}</span>
                  )}
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-[#C9A84C]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>
                <Badge variant={audience} size="sm" />
              </div>

              {/* Title with hover gradient */}
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#C9A84C] group-hover:to-[#5A7247]">
                {name}
              </h3>

              {/* Tagline with animated underline */}
              <p className="relative inline-block text-sm font-semibold text-[#C9A84C] mb-3">
                {tagline}
                <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] group-hover:w-full transition-all duration-300" />
              </p>

              {/* Description */}
              <p className="text-[#555555] text-sm leading-relaxed mb-5 line-clamp-3">
                {description}
              </p>

              {/* CTA with animated arrow */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#5A7247] group-hover:text-[#C9A84C] transition-colors">
                  Explore Program
                </span>
                <motion.div
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-[#5A7247]/10 group-hover:bg-[#C9A84C]/10 transition-colors"
                  animate={isHovered ? { x: [0, 4, 0] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  <ArrowRight className="h-3.5 w-3.5 text-[#5A7247] group-hover:text-[#C9A84C] transition-colors" />
                </motion.div>
              </div>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute -bottom-2 -right-2 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id={`cornerGrad-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#5A7247" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <path
                  d="M100,100 L100,0 Q100,100 0,100 Z"
                  fill={`url(#cornerGrad-${slug})`}
                />
              </svg>
            </div>
          </article>
        </Link>
      </motion.div>
    </motion.div>
  );
}
