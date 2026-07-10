"use client";

/**
 * Donate — fund the mission.
 * Observatory design language wrapped around untouched checkout logic:
 * amount selection state, one-time/monthly toggle, POST /api/stripe/checkout,
 * and Stripe redirect handling all preserved exactly.
 */

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FFIcon, type FFIconName } from "@/components/shared/ff-icons";
import { IMPACT_GOALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase",
        light ? "text-[#C9A84C]" : "text-[#A68A2E]"
      )}
    >
      <span className="inline-block h-px w-8 bg-current opacity-60" />
      {children}
    </div>
  );
}

/** Animated counter that spins up when scrolled into view. */
function GoalCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 2200, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, motionVal, value]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return () => unsub();
  }, [spring]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-bold text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-[#E8D48B] to-[#C9A84C] tabular-nums">
        {display.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-2 text-xs sm:text-sm tracking-[0.2em] uppercase text-white/50">{label}</div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Content data
 * ------------------------------------------------------------------------- */

const AMOUNT_TIERS: {
  amount: number;
  icon: FFIconName;
  title: string;
  impact: string;
  popular?: boolean;
}[] = [
  {
    amount: 50,
    icon: "robot",
    title: "The Spark",
    impact: "Puts a robotics kit in a kid's hands.",
  },
  {
    amount: 200,
    icon: "certificate",
    title: "The Builder",
    impact: "Covers a father's certification exam. That's a career for $200.",
    popular: true,
  },
  {
    amount: 500,
    icon: "spark",
    title: "The Moment",
    impact: "Funds a full family movie night, dinner included.",
  },
];

const PILLAR_IMPACT: { icon: FFIconName; title: string; text: string }[] = [
  {
    icon: "briefcase",
    title: "Career Forward",
    text: "Free IT training for fathers, toward a CompTIA ITF+ and a paycheck that holds.",
  },
  {
    icon: "chip",
    title: "Future Builders",
    text: "Robotics, AI, 3D printing, and satellite tracking for kids who deserve a head start.",
  },
  {
    icon: "crew",
    title: "Making Moments",
    text: "Movie nights, robot races, and festivals that put dads and kids in the same moment.",
  },
];

const OTHER_WAYS = [
  {
    title: "Corporate matching",
    text: "Many employers match dollar for dollar. One email to HR could double your gift.",
  },
  {
    title: "Monthly giving",
    text: "Recurring gifts keep programs running all year. Cancel anytime, no hard feelings.",
  },
  {
    title: "In-kind donations",
    text: "Laptops, robotics kits, 3D printers, tools, skills. If it helps, we put it to work.",
  },
  {
    title: "Planned giving",
    text: "Legacy is kind of our whole thing. Include Forever Forward in your estate plans.",
  },
];

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export function DonateContent() {
  const searchParams = useSearchParams();
  const [donationType, setDonationType] = useState<"one_time" | "monthly">("one_time");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(200);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [donorEmail, setDonorEmail] = useState("");
  const [donorFirstName, setDonorFirstName] = useState("");
  const [donorLastName, setDonorLastName] = useState("");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check for cancelled checkout
  useEffect(() => {
    if (searchParams.get("cancelled") === "true") {
      setError("No worries, checkout got cancelled. We'll be right here when you're ready.");
    }
  }, [searchParams]);

  const handleDonate = async () => {
    setIsProcessing(true);
    setError(null);

    const amount = customAmount ? parseInt(customAmount) : selectedAmount;

    if (!amount || amount < 1) {
      setError("Please select or enter a valid donation amount.");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          frequency: donationType,
          donorEmail: donorEmail || undefined,
          donorFirstName: donorFirstName || undefined,
          donorLastName: donorLastName || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Donation error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  const currentAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  const scrollToGive = (monthly: boolean) => {
    if (monthly) setDonationType("monthly");
    document.getElementById("give")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* 1. Hero — the night sky, the ask */}
      <section className="relative min-h-[72vh] lg:min-h-[82vh] bg-[#141413] overflow-hidden flex items-center">
        <div className="absolute inset-0 grain-overlay">
          <Image
            src="/images/future/impact-hands.jpg"
            alt="Hands joined together over future technology"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141413] via-[#141413]/85 to-[#141413]/35" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#141413] to-transparent" />
        </div>
        <div className="absolute inset-0 bg-starfield opacity-50" aria-hidden />
        <div
          className="aurora-blob absolute -top-40 -right-40 w-[34rem] h-[34rem] rounded-full bg-[#C9A84C]/12"
          aria-hidden
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="max-w-2xl"
          >
            <Eyebrow light>Fund the Mission</Eyebrow>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[4.25rem] font-bold text-white leading-[1.02] tracking-tight">
              Fund the future you{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C]">
                want to see.
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/75 leading-relaxed max-w-xl">
              Every dollar puts real technology in real hands: a father&apos;s
              certification, a kid&apos;s first robot, a family&apos;s night under
              the stars.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="#give"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A] font-semibold shadow-[0_0_40px_rgba(201,168,76,0.3)] hover:shadow-[0_0_60px_rgba(201,168,76,0.5)] transition-shadow"
              >
                Give Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/55">
              {["501(c)(3) nonprofit", "Tax-deductible", "Receipt by email"].map((chip) => (
                <span key={chip} className="inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#C9A84C]" aria-hidden />
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* 2. The give — untouched checkout logic in a premium shell */}
      <section id="give" className="relative py-16 lg:py-24 bg-[#FAFAF8] scroll-mt-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative bg-white rounded-3xl p-6 sm:p-8 lg:p-12 shadow-[0_20px_60px_rgba(26,26,26,0.08)] border border-[#DDDDDD] overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C]" aria-hidden />

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Donation Type Toggle */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex rounded-xl bg-[#F5F3EF] p-1.5 border border-[#DDDDDD]">
                <button
                  onClick={() => setDonationType("one_time")}
                  className={cn(
                    "px-6 sm:px-8 py-3 rounded-lg text-sm font-semibold transition-all",
                    donationType === "one_time"
                      ? "bg-[#C9A84C] text-[#1A1A1A] shadow-sm"
                      : "text-[#555555] hover:text-[#1A1A1A]"
                  )}
                >
                  One-Time Gift
                </button>
                <button
                  onClick={() => setDonationType("monthly")}
                  className={cn(
                    "px-6 sm:px-8 py-3 rounded-lg text-sm font-semibold transition-all",
                    donationType === "monthly"
                      ? "bg-[#C9A84C] text-[#1A1A1A] shadow-sm"
                      : "text-[#555555] hover:text-[#1A1A1A]"
                  )}
                >
                  Monthly Giving
                </button>
              </div>
            </div>

            {/* Amount Tiles */}
            <div className="mb-8">
              <p className="text-center text-sm font-medium text-[#555555] mb-6">
                Pick what your gift does
                {donationType === "monthly" && (
                  <span className="text-[#888888]"> (charged monthly)</span>
                )}
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {AMOUNT_TIERS.map((tier) => {
                  const active = selectedAmount === tier.amount && !customAmount;
                  return (
                    <button
                      key={tier.amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(tier.amount);
                        setCustomAmount("");
                      }}
                      className={cn(
                        "relative rounded-2xl p-5 text-left border-2 transition-all",
                        active
                          ? "border-[#C9A84C] bg-[#FBF6E9] shadow-[0_8px_30px_rgba(201,168,76,0.25)]"
                          : "border-[#DDDDDD] bg-[#FAFAF8] hover:border-[#C9A84C]/50"
                      )}
                    >
                      {tier.popular && (
                        <span className="absolute -top-3 left-5 px-3 py-1 bg-[#C9A84C] text-[#1A1A1A] text-[11px] font-semibold uppercase tracking-wide rounded-full">
                          Most Popular
                        </span>
                      )}
                      <span
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-xl border transition-colors",
                          active
                            ? "bg-[#C9A84C] border-[#A68A2E] text-[#1A1A1A]"
                            : "bg-[#C9A84C]/10 border-[#C9A84C]/30 text-[#A68A2E]"
                        )}
                      >
                        <FFIcon name={tier.icon} className="h-5.5 w-5.5" />
                      </span>
                      <span className="mt-4 block text-3xl font-bold text-[#1A1A1A]">
                        ${tier.amount}
                      </span>
                      <span className="mt-0.5 block text-xs font-semibold tracking-[0.18em] uppercase text-[#A68A2E]">
                        {tier.title}
                      </span>
                      <span className="mt-2 block text-sm text-[#555555] leading-snug">
                        {tier.impact}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount */}
              <div className="mt-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] text-lg">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="Or name your own amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    className={cn(
                      "pl-8 text-center text-lg h-14 rounded-xl",
                      customAmount && "border-[#C9A84C] bg-[#FBF6E9]"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Impact Preview */}
            {currentAmount && currentAmount >= 25 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-8 p-4 rounded-xl bg-[#EFF4EB] border border-[#7A9A63]"
              >
                <p className="text-[#3D5030] text-center text-sm sm:text-base">
                  <span className="font-semibold">Your ${currentAmount}</span>{" "}
                  {donationType === "monthly" ? "monthly " : ""}gift will help
                  us {currentAmount >= 500 ? "host a family movie night or a full 3D-printing workshop" : currentAmount >= 200 ? "cover a father's certification exam" : "put a robotics kit in a kid's hands"}.
                </p>
              </motion.div>
            )}

            {/* Optional Donor Info */}
            <div className="mb-8 space-y-4">
              <p className="text-sm text-[#888888] text-center">
                Optional: save yourself some typing on the next page
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="First Name"
                  value={donorFirstName}
                  onChange={(e) => setDonorFirstName(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={donorLastName}
                  onChange={(e) => setDonorLastName(e.target.value)}
                />
              </div>
              <Input
                type="email"
                placeholder="Email Address"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
              />
            </div>

            {/* Donate Button */}
            <Button
              onClick={handleDonate}
              disabled={!currentAmount || currentAmount < 1 || isProcessing}
              size="lg"
              className="w-full h-14 text-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Redirecting to secure checkout...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Donate{" "}
                  {currentAmount ? `$${currentAmount}` : ""}
                  {donationType === "monthly" && currentAmount ? "/month" : ""}
                </>
              )}
            </Button>

            {/* Security Note */}
            <p className="text-center text-sm text-[#888888] mt-4">
              Secure checkout via Stripe. Tax-deductible, and the receipt hits
              your inbox before you can ask for it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Where every dollar goes */}
      <section className="relative py-20 lg:py-28 bg-[#F5F3EF] overflow-hidden">
        <div className="absolute inset-0 bg-mesh" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Eyebrow>Where Every Dollar Goes</Eyebrow>
            <h2 className="mt-5 font-semibold text-[#1A1A1A] text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight max-w-2xl">
              Three pillars.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
                Zero mystery.
              </span>
            </h2>
            <p className="mt-4 text-[#555555] text-base sm:text-lg max-w-2xl">
              We&apos;re a 501(c)(3) and we like receipts as much as you do. Your
              donation lands in one of three places.
            </p>
          </motion.div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {PILLAR_IMPACT.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="group bg-white rounded-2xl p-7 border border-[#DDDDDD] hover:border-[#C9A84C]/60 hover:shadow-[0_12px_40px_rgba(26,26,26,0.08)] transition-all"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#A68A2E] group-hover:bg-[#C9A84C] group-hover:text-[#1A1A1A] transition-colors">
                  <FFIcon name={pillar.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-[#1A1A1A]">{pillar.title}</h3>
                <p className="mt-2 text-[#555555] text-sm leading-relaxed">{pillar.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The goals your gift moves */}
      <section className="relative py-20 lg:py-28 bg-[#141413] overflow-hidden">
        <div className="absolute inset-0 bg-starfield opacity-60" aria-hidden />
        <div
          className="aurora-blob absolute -bottom-40 left-1/4 w-[30rem] h-[30rem] rounded-full bg-[#5A7247]/12"
          aria-hidden
        />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-center"
          >
            <div className="flex justify-center">
              <Eyebrow light>The Mission, In Numbers</Eyebrow>
            </div>
            <h2 className="mt-5 font-semibold text-white text-3xl sm:text-4xl tracking-tight">
              This is what we&apos;re building toward.
            </h2>
          </motion.div>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {IMPACT_GOALS.map((goal) => (
              <GoalCounter
                key={goal.label}
                value={goal.value}
                suffix={goal.suffix}
                label={goal.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Other ways to give */}
      <section className="py-20 lg:py-28 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Eyebrow>Other Ways In</Eyebrow>
            <h2 className="mt-5 font-semibold text-[#1A1A1A] text-3xl sm:text-4xl tracking-tight">
              Cash isn&apos;t the only way to move a family forward.
            </h2>
          </motion.div>

          <div className="mt-10 grid sm:grid-cols-2 gap-5">
            {OTHER_WAYS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#DDDDDD] hover:border-[#C9A84C]/50 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5 text-[#5A7247] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#1A1A1A]">{item.title}</h3>
                  <p className="mt-1 text-[#555555] text-sm leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 text-sm text-[#888888]"
          >
            Questions about stock gifts or anything else?{" "}
            <Link href="/contact" className="text-[#A68A2E] font-semibold hover:underline">
              Ask away.
            </Link>{" "}
            We&apos;re easy to talk to.
          </motion.p>
        </div>
      </section>

      {/* 6. Closing dual CTA */}
      <section className="relative bg-[#141413] py-24 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-starfield" aria-hidden />
        <div
          className="aurora-blob absolute -top-32 right-1/4 w-[30rem] h-[30rem] rounded-full bg-[#C9A84C]/12"
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <button
                type="button"
                onClick={() => scrollToGive(true)}
                className="group relative block w-full text-left rounded-3xl overflow-hidden border border-[#C9A84C]/30 bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] p-8 sm:p-10 min-h-[15rem] hover:shadow-[0_0_80px_rgba(201,168,76,0.35)] transition-shadow"
              >
                <p className="text-[#1A1A1A]/70 text-xs font-semibold tracking-[0.3em] uppercase">
                  Keep It Going
                </p>
                <h3 className="mt-3 font-bold text-[#1A1A1A] text-2xl sm:text-3xl leading-tight max-w-md">
                  Give monthly. Build steady.
                </h3>
                <p className="mt-2 text-[#1A1A1A]/75 max-w-md">
                  Monthly donors keep cohorts funded and movie nights on the
                  calendar all year. Cancel anytime.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#1A1A1A]">
                  Start a monthly gift
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            >
              <Link
                href="/get-involved/partner"
                className="group relative block rounded-3xl overflow-hidden border border-white/15 bg-white/[0.04] backdrop-blur p-8 sm:p-10 min-h-[15rem] hover:border-[#C9A84C]/50 transition-colors"
              >
                <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase">
                  Go Bigger
                </p>
                <h3 className="mt-3 font-bold text-white text-2xl sm:text-3xl leading-tight max-w-md">
                  Talk to us about sponsorship.
                </h3>
                <p className="mt-2 text-white/60 max-w-md">
                  Sponsor a cohort, an event series, or a whole program. We&apos;ll
                  show you exactly what your name makes possible.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#E8D48B]">
                  Join forces
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Tax info */}
      <section className="py-12 bg-[#FBF6E9]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <p className="text-[#555555]">
            Forever Forward Foundation is a registered 501(c)(3) nonprofit
            organization. Your donation is tax-deductible to the fullest extent
            allowed by law.
          </p>
          <p className="text-[#888888] text-sm mt-2">EIN: 87-0944016</p>
        </div>
      </section>
    </>
  );
}
