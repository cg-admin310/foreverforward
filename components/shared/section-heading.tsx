"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  dark?: boolean;
  className?: string;
  titleClassName?: string;
  animate?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  dark = false,
  className,
  titleClassName,
  animate = true,
}: SectionHeadingProps) {
  const Wrapper = animate ? motion.div : "div";
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.5 },
      }
    : {};

  return (
    <Wrapper
      className={cn(
        "mb-12",
        centered && "text-center",
        className
      )}
      {...animationProps}
    >
      <h2
        className={cn(
          "text-3xl md:text-4xl font-semibold mb-4 relative inline-block",
          dark ? "text-white" : "text-[#1A1A1A]",
          titleClassName
        )}
      >
        {title}
        <span
          className={cn(
            "absolute -bottom-2 left-0 h-1 bg-[#C9A84C] rounded-full",
            centered ? "left-1/2 -translate-x-1/2 w-16" : "w-12"
          )}
        />
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-6 text-lg max-w-2xl",
            centered && "mx-auto",
            dark ? "text-white/80" : "text-[#555555]"
          )}
        >
          {subtitle}
        </p>
      )}
    </Wrapper>
  );
}
