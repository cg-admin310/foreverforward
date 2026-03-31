"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Laptop,
  GraduationCap,
  Users,
  BookOpen,
  Coffee,
  Film,
  Gamepad2,
  Printer,
  ChevronRight,
  DollarSign,
  Sparkles,
} from "lucide-react";

// Impact tier definitions
const IMPACT_TIERS = [
  {
    threshold: 25,
    icon: Coffee,
    title: "Program Materials",
    description: "Provides one week of learning materials for a participant",
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50",
  },
  {
    threshold: 50,
    icon: BookOpen,
    title: "Resource Access",
    description: "Two weeks of curriculum materials and printed guides",
    color: "from-brand-gold to-brand-gold-dark",
    bgColor: "bg-brand-gold-bg",
  },
  {
    threshold: 100,
    icon: GraduationCap,
    title: "Certification Support",
    description: "Google IT Certification exam voucher for one graduate",
    color: "from-emerald-400 to-green-600",
    bgColor: "bg-emerald-50",
  },
  {
    threshold: 200,
    icon: Laptop,
    title: "Tech Empowerment",
    description: "A refurbished laptop for a program graduate entering the workforce",
    color: "from-brand-olive to-brand-olive-dark",
    bgColor: "bg-brand-olive-bg",
  },
  {
    threshold: 350,
    icon: Film,
    title: "Movies on the Menu",
    description: "Sponsor an entire family for our signature father-child dinner & movie event",
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    threshold: 500,
    icon: Users,
    title: "Program Sponsorship",
    description: "Fully sponsor one participant through the entire 8-week program",
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    threshold: 750,
    icon: Gamepad2,
    title: "LULA Academy",
    description: "Sponsor five youth through our Level Up Learning Academy gaming & STEM program",
    color: "from-pink-400 to-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    threshold: 1000,
    icon: Printer,
    title: "Innovation Lab",
    description: "Fund a full Stories from My Future workshop with 3D printing for 10 children",
    color: "from-brand-gold via-brand-olive to-brand-gold",
    bgColor: "bg-brand-warm",
  },
  {
    threshold: 2500,
    icon: GraduationCap,
    title: "Cohort Champion",
    description: "Sponsor an entire cohort of 8 participants through Father Forward",
    color: "from-brand-gold to-brand-gold-dark",
    bgColor: "bg-brand-gold-bg",
  },
  {
    threshold: 5000,
    icon: Heart,
    title: "Community Builder",
    description: "Fund a full quarter of programming, impacting 30+ families in South LA",
    color: "from-rose-400 to-red-600",
    bgColor: "bg-rose-50",
  },
];

// Animated number component
function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useSpring(value, { stiffness: 100, damping: 30 });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toLocaleString();
      }
    });
    return unsubscribe;
  }, [rounded]);

  return <span ref={ref}>{value.toLocaleString()}</span>;
}

// Impact card component
function ImpactCard({
  tier,
  isActive,
  isUnlocked,
  index,
}: {
  tier: (typeof IMPACT_TIERS)[number];
  isActive: boolean;
  isUnlocked: boolean;
  index: number;
}) {
  const Icon = tier.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isUnlocked ? 1 : 0.4,
        y: 0,
        scale: isActive ? 1.05 : 1,
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        scale: { type: "spring", stiffness: 300, damping: 25 },
      }}
      className={`relative group ${isUnlocked ? "" : "grayscale"}`}
    >
      {/* Glow effect for active card */}
      {isActive && (
        <motion.div
          layoutId="activeGlow"
          className={`absolute -inset-1 bg-gradient-to-r ${tier.color} rounded-2xl blur-lg opacity-40`}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      )}

      <div
        className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
          isActive
            ? `border-transparent bg-gradient-to-br ${tier.color} shadow-xl`
            : isUnlocked
            ? `border-brand-border bg-white hover:border-brand-gold/50 hover:shadow-md`
            : "border-brand-border/50 bg-white/50"
        }`}
      >
        {/* Threshold badge */}
        <div
          className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold ${
            isActive
              ? "bg-white text-brand-black"
              : isUnlocked
              ? "bg-brand-gold text-brand-black"
              : "bg-brand-border text-brand-text-light"
          }`}
        >
          ${tier.threshold.toLocaleString()}+
        </div>

        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
            isActive
              ? "bg-white/20"
              : isUnlocked
              ? tier.bgColor
              : "bg-brand-warm"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              isActive ? "text-white" : isUnlocked ? "text-brand-black" : "text-brand-text-light"
            }`}
          />
        </div>

        {/* Title */}
        <h4
          className={`font-semibold text-sm mb-1 ${
            isActive ? "text-white" : isUnlocked ? "text-brand-black" : "text-brand-text-medium"
          }`}
        >
          {tier.title}
        </h4>

        {/* Description - show on hover or when active */}
        <AnimatePresence>
          {(isActive || isUnlocked) && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`text-xs leading-relaxed ${
                isActive ? "text-white/90" : "text-brand-text-medium"
              }`}
            >
              {tier.description}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Unlock indicator */}
        {!isUnlocked && (
          <div className="mt-2 flex items-center gap-1 text-xs text-brand-text-light">
            <DollarSign className="w-3 h-3" />
            <span>${(tier.threshold - (tier.threshold % 1)).toLocaleString()} to unlock</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Progress ring component
function ProgressRing({ progress, size = 200 }: { progress: number; size?: number }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-brand-warm"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A84C" />
            <stop offset="50%" stopColor="#5A7247" />
            <stop offset="100%" stopColor="#C9A84C" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          key={progress}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <span className="text-4xl font-bold text-brand-black">{Math.round(progress)}%</span>
          <p className="text-sm text-brand-text-medium">Impact Level</p>
        </motion.div>
      </div>
    </div>
  );
}

// Main Impact Calculator Component
export function ImpactCalculator() {
  const [amount, setAmount] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Calculate active tier and progress
  const { activeTier, activeTierIndex, progress, unlockedCount } = useMemo(() => {
    let activeIdx = 0;
    for (let i = IMPACT_TIERS.length - 1; i >= 0; i--) {
      if (amount >= IMPACT_TIERS[i].threshold) {
        activeIdx = i;
        break;
      }
    }

    const currentTier = IMPACT_TIERS[activeIdx];
    const nextTier = IMPACT_TIERS[activeIdx + 1];

    let tierProgress = 100;
    if (nextTier) {
      const range = nextTier.threshold - currentTier.threshold;
      const amountInRange = amount - currentTier.threshold;
      tierProgress = Math.min(100, (amountInRange / range) * 100);
    }

    // Overall progress across all tiers
    const maxThreshold = IMPACT_TIERS[IMPACT_TIERS.length - 1].threshold;
    const overallProgress = Math.min(100, (amount / maxThreshold) * 100);

    return {
      activeTier: currentTier,
      activeTierIndex: activeIdx,
      progress: overallProgress,
      unlockedCount: activeIdx + 1,
    };
  }, [amount]);

  // Preset amounts
  const presets = [25, 50, 100, 200, 500, 1000];

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-offwhite via-brand-olive-bg/20 to-brand-offwhite" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(90,114,71,0.1),transparent_60%)]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-olive/10 rounded-full border border-brand-olive/30 mb-6"
          >
            <Heart className="w-4 h-4 text-brand-olive" />
            <span className="text-sm font-medium text-brand-olive-dark">See Your Impact</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-6">
            Every Dollar <span className="text-brand-gold">Builds Futures</span>
          </h2>
          <p className="text-lg text-brand-text-medium leading-relaxed">
            Watch how your generosity transforms into tangible opportunities for Black fathers
            and youth in South LA. Move the slider to see what your contribution provides.
          </p>
        </motion.div>

        {/* Calculator Interface */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Slider & Amount Display */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Amount Display */}
              <div className="relative mb-8">
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-gold/20 via-brand-olive/10 to-brand-gold/20 rounded-3xl blur-2xl opacity-60" />
                <div className="relative bg-white rounded-2xl border border-brand-gold/30 p-8 shadow-xl">
                  <div className="text-center mb-6">
                    <p className="text-sm text-brand-text-medium mb-2">Your Donation</p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-3xl font-bold text-brand-gold">$</span>
                      <span className="text-6xl font-bold text-brand-black">
                        <AnimatedNumber value={amount} />
                      </span>
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="relative mb-8">
                    <input
                      type="range"
                      min="10"
                      max="5000"
                      step="5"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full h-3 bg-brand-warm rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-6
                        [&::-webkit-slider-thumb]:h-6
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-gradient-to-br
                        [&::-webkit-slider-thumb]:from-brand-gold
                        [&::-webkit-slider-thumb]:to-brand-gold-dark
                        [&::-webkit-slider-thumb]:cursor-grab
                        [&::-webkit-slider-thumb]:active:cursor-grabbing
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:shadow-brand-gold/30
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:hover:scale-110
                        [&::-moz-range-thumb]:w-6
                        [&::-moz-range-thumb]:h-6
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-gradient-to-br
                        [&::-moz-range-thumb]:from-brand-gold
                        [&::-moz-range-thumb]:to-brand-gold-dark
                        [&::-moz-range-thumb]:border-0
                        [&::-moz-range-thumb]:cursor-grab
                        [&::-moz-range-thumb]:active:cursor-grabbing"
                    />
                    <div className="flex justify-between mt-2 text-xs text-brand-text-light">
                      <span>$10</span>
                      <span>$5,000</span>
                    </div>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {presets.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setAmount(preset)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          amount === preset
                            ? "bg-brand-gold text-brand-black shadow-md"
                            : "bg-brand-warm text-brand-text-medium hover:bg-brand-gold/20"
                        }`}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Impact Highlight */}
              <motion.div
                key={activeTier.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl bg-gradient-to-br from-brand-gold/10 to-brand-olive/5 border border-brand-gold/20"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${activeTier.color}`}>
                    <activeTier.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-black mb-1">
                      Your Impact: {activeTier.title}
                    </h3>
                    <p className="text-brand-text-medium">{activeTier.description}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Impact Tiers Grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {IMPACT_TIERS.map((tier, idx) => (
                  <ImpactCard
                    key={tier.threshold}
                    tier={tier}
                    isActive={idx === activeTierIndex}
                    isUnlocked={amount >= tier.threshold}
                    index={idx}
                  />
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 flex items-center justify-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-gold">{unlockedCount}</p>
                  <p className="text-sm text-brand-text-medium">Impact Levels</p>
                </div>
                <ProgressRing progress={progress} size={120} />
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-olive">
                    {IMPACT_TIERS.length - unlockedCount}
                  </p>
                  <p className="text-sm text-brand-text-medium">More to Unlock</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <Link
              href={`/get-involved/donate?amount=${amount}`}
              className="inline-flex items-center gap-3 px-10 py-5 bg-brand-gold text-brand-black font-bold text-lg rounded-xl hover:bg-brand-gold-dark transition-all duration-300 shadow-xl shadow-brand-gold/25 hover:shadow-2xl hover:shadow-brand-gold/30 hover:-translate-y-1 group"
            >
              <Heart className="w-5 h-5" />
              <span>Donate ${amount.toLocaleString()} Now</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="mt-4 text-sm text-brand-text-medium">
              100% tax-deductible. Forever Forward is a registered 501(c)(3) nonprofit.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Compact version for embedding in sidebars or cards
export function ImpactCalculatorCompact() {
  const [amount, setAmount] = useState(100);

  const activeTier = useMemo(() => {
    for (let i = IMPACT_TIERS.length - 1; i >= 0; i--) {
      if (amount >= IMPACT_TIERS[i].threshold) {
        return IMPACT_TIERS[i];
      }
    }
    return IMPACT_TIERS[0];
  }, [amount]);

  return (
    <div className="p-6 bg-white rounded-2xl border border-brand-gold/20 shadow-lg">
      <h3 className="text-lg font-bold text-brand-black mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-brand-gold" />
        Calculate Your Impact
      </h3>

      <div className="mb-6">
        <div className="flex items-center justify-center gap-1 mb-4">
          <span className="text-2xl font-bold text-brand-gold">$</span>
          <input
            type="number"
            min="10"
            max="10000"
            value={amount}
            onChange={(e) => setAmount(Math.max(10, Number(e.target.value)))}
            className="text-4xl font-bold text-brand-black w-28 bg-transparent border-b-2 border-brand-gold/30 focus:border-brand-gold outline-none text-center"
          />
        </div>

        <input
          type="range"
          min="10"
          max="2500"
          step="10"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full h-2 bg-brand-warm rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-brand-gold
            [&::-webkit-slider-thumb]:cursor-grab"
        />
      </div>

      <motion.div
        key={activeTier.title}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-brand-gold-bg border border-brand-gold/20"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${activeTier.color}`}>
            <activeTier.icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-brand-black">{activeTier.title}</h4>
            <p className="text-xs text-brand-text-medium">{activeTier.description}</p>
          </div>
        </div>
      </motion.div>

      <Link
        href={`/get-involved/donate?amount=${amount}`}
        className="mt-4 block w-full text-center py-3 bg-brand-gold text-brand-black font-semibold rounded-xl hover:bg-brand-gold-dark transition-colors"
      >
        Donate ${amount}
      </Link>
    </div>
  );
}

export default ImpactCalculator;
