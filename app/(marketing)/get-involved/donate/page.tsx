"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  GraduationCap,
  Users,
  Gift,
  CheckCircle2,
  CreditCard,
  Repeat,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

const impactTiers = [
  {
    amount: 50,
    title: "Champion",
    impact: "Provides learning materials for one participant for a month",
    icon: "📚",
  },
  {
    amount: 200,
    title: "Builder",
    impact: "Sponsors a father's Google IT certification exam",
    icon: "🎓",
    popular: true,
  },
  {
    amount: 500,
    title: "Transformer",
    impact: "Funds one full scholarship to Father Forward",
    icon: "🚀",
  },
];

const impactAreas = [
  {
    icon: GraduationCap,
    title: "Workforce Development",
    description:
      "Your gift helps fathers and youth earn IT certifications and launch tech careers.",
  },
  {
    icon: Users,
    title: "Family Events",
    description:
      "Support Movies on the Menu and other events that strengthen family bonds.",
  },
  {
    icon: Heart,
    title: "Travis AI Support",
    description:
      "Keep our 24/7 AI case manager running, providing guidance to participants anytime.",
  },
];

export default function DonatePage() {
  const searchParams = useSearchParams();
  const [donationType, setDonationType] = useState<"one_time" | "monthly">("one_time");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(200);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [donorEmail, setDonorEmail] = useState("");
  const [donorFirstName, setDonorFirstName] = useState("");
  const [donorLastName, setDonorLastName] = useState("");

  const amounts = [25, 50, 100, 200, 500, 1000];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check for cancelled checkout
  useEffect(() => {
    if (searchParams.get("cancelled") === "true") {
      setError("Your donation was cancelled. Feel free to try again when you're ready.");
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

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] lg:min-h-[70vh] bg-[#1A1A1A] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/generated/donate-impact.png"
            alt="Father and son learning together"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-[#1A1A1A]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-sm text-white/80 mb-6">
              <Heart className="h-4 w-4 text-[#C9A84C]" />
              Support Our Mission
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Gift Creates{" "}
              <span className="text-[#C9A84C]">Lasting Change</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80">
              Every dollar you give goes directly to empowering fathers, training
              youth, and strengthening families in our community.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Donation Form */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 lg:p-10 shadow-lg border border-[#DDDDDD]"
          >
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
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-lg bg-[#F5F3EF] p-1">
                <button
                  onClick={() => setDonationType("one_time")}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all",
                    donationType === "one_time"
                      ? "bg-[#C9A84C] text-[#1A1A1A]"
                      : "text-[#555555] hover:text-[#1A1A1A]"
                  )}
                >
                  <Gift className="h-4 w-4" />
                  One-Time Gift
                </button>
                <button
                  onClick={() => setDonationType("monthly")}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all",
                    donationType === "monthly"
                      ? "bg-[#C9A84C] text-[#1A1A1A]"
                      : "text-[#555555] hover:text-[#1A1A1A]"
                  )}
                >
                  <Repeat className="h-4 w-4" />
                  Monthly Giving
                </button>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-4 text-center">
                Select an amount{" "}
                {donationType === "monthly" && (
                  <span className="text-[#888888]">(charged monthly)</span>
                )}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={cn(
                      "py-4 rounded-lg text-lg font-semibold transition-all",
                      selectedAmount === amount && !customAmount
                        ? "bg-[#C9A84C] text-[#1A1A1A]"
                        : "bg-[#F5F3EF] text-[#555555] hover:bg-[#FBF6E9] hover:text-[#1A1A1A]"
                    )}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mt-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] text-lg">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="Other amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    className="pl-8 text-center text-lg h-14"
                  />
                </div>
              </div>
            </div>

            {/* Impact Preview */}
            {currentAmount && currentAmount >= 25 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-8 p-4 rounded-lg bg-[#EFF4EB] border border-[#7A9A63]"
              >
                <p className="text-[#5A7247] text-center">
                  <span className="font-semibold">Your ${currentAmount}</span>{" "}
                  {donationType === "monthly" ? "monthly " : ""}gift will help
                  us {currentAmount >= 500 ? "fully sponsor a Father Forward participant" : currentAmount >= 200 ? "cover certification exam costs" : "provide learning materials"}.
                </p>
              </motion.div>
            )}

            {/* Optional Donor Info */}
            <div className="mb-8 space-y-4">
              <p className="text-sm text-[#888888] text-center">
                Optional: Pre-fill your information (you can also enter it on the next page)
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
              Secure payment powered by Stripe. Your donation is tax-deductible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Tiers */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Your Impact"
            subtitle="See how your generosity transforms lives."
            centered
          />

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {impactTiers.map((tier, index) => (
              <motion.div
                key={tier.amount}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative rounded-xl p-6 border-2 text-center",
                  tier.popular
                    ? "border-[#C9A84C] bg-[#FBF6E9]"
                    : "border-[#DDDDDD] bg-[#FAFAF8]"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#C9A84C] text-[#1A1A1A] text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <span className="text-4xl mb-4 block">{tier.icon}</span>
                <span className="text-3xl font-bold text-[#C9A84C]">
                  ${tier.amount}
                </span>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mt-2 mb-3">
                  {tier.title}
                </h3>
                <p className="text-[#555555] text-sm">{tier.impact}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Where Your Money Goes */}
      <section className="py-16 lg:py-24 bg-[#1A1A1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Where Your Money Goes
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              As a 501(c)(3) nonprofit, we&apos;re committed to transparency. Here&apos;s
              how your donation makes an impact.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {impactAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#2D2D2D] rounded-xl p-6 border border-[#444444]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center mb-4">
                  <area.icon className="h-6 w-6 text-[#C9A84C]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {area.title}
                </h3>
                <p className="text-white/60 text-sm">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Ways to Give */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Other Ways to Give"
            subtitle="There are many ways to support our mission."
            centered
          />

          <div className="mt-12 space-y-6">
            {[
              {
                title: "Corporate Matching",
                description:
                  "Many employers match charitable donations. Check if yours does!",
              },
              {
                title: "Stock Donations",
                description:
                  "Donate appreciated securities for potential tax benefits.",
              },
              {
                title: "Planned Giving",
                description:
                  "Include Forever Forward in your estate planning.",
              },
              {
                title: "In-Kind Donations",
                description:
                  "Donate laptops, equipment, or professional services.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-lg bg-white border border-[#DDDDDD]"
              >
                <CheckCircle2 className="h-6 w-6 text-[#5A7247] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#1A1A1A]">{item.title}</h3>
                  <p className="text-[#555555] text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-[#555555] mb-4">
              Questions about giving? We&apos;re happy to help.
            </p>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Tax Info */}
      <section className="py-12 bg-[#FBF6E9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
