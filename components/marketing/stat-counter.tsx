"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}

export function StatCounter({
  value,
  suffix = "",
  label,
  duration = 2,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, value, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="relative inline-block">
        <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A]">
          {count.toLocaleString()}
          {suffix}
        </span>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#C9A84C] rounded-full" />
      </div>
      <p className="mt-4 text-[#555555] font-medium">{label}</p>
    </motion.div>
  );
}
