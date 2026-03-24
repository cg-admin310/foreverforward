"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Heart, ArrowRight, Mail, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DonationSuccessPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Short delay to show the celebration animation
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const sessionId = searchParams.get("session_id");
  const donationId = searchParams.get("donation_id");

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#2D2D2D]" />

        {/* Animated confetti/sparkles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#C9A84C] rounded-full"
              initial={{
                x: "50vw",
                y: "50vh",
                scale: 0,
                opacity: 0,
              }}
              animate={{
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                scale: [0, 1, 0.5],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#5A7247] flex items-center justify-center"
            >
              <CheckCircle2 className="w-14 h-14 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Thank You for Your{" "}
              <span className="text-[#C9A84C]">Generosity!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto"
            >
              Your donation is making a real difference in the lives of fathers,
              youth, and families in Los Angeles. Together, we&apos;re building
              brighter futures.
            </motion.p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* What Happens Next */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
              What Happens Next
            </h2>
            <p className="text-[#555555]">
              Here&apos;s what you can expect after your donation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mail,
                title: "Confirmation Email",
                description:
                  "You'll receive a tax receipt and thank you note at the email address you provided.",
              },
              {
                icon: Heart,
                title: "Impact Update",
                description:
                  "We'll share stories of how your gift is making a difference in our community.",
              },
              {
                icon: Share2,
                title: "Stay Connected",
                description:
                  "Follow our journey and see your impact through our newsletter and social media.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-[#DDDDDD] text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#FBF6E9] flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-[#C9A84C]" />
                </div>
                <h3 className="font-semibold text-[#1A1A1A] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#555555] text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Continue Engagement */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
              Continue Your Impact
            </h2>
            <p className="text-[#555555]">
              There are many ways to stay involved with Forever Forward.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link
                href="/get-involved/volunteer"
                className="block bg-[#FAFAF8] rounded-xl p-6 border border-[#DDDDDD] hover:border-[#C9A84C] transition-all"
              >
                <h3 className="font-semibold text-[#1A1A1A] mb-2 flex items-center justify-between">
                  Volunteer With Us
                  <ArrowRight className="h-5 w-5 text-[#C9A84C] group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-[#555555] text-sm">
                  Share your skills and time to mentor participants in our
                  programs.
                </p>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link
                href="/get-involved/partner"
                className="block bg-[#FAFAF8] rounded-xl p-6 border border-[#DDDDDD] hover:border-[#C9A84C] transition-all"
              >
                <h3 className="font-semibold text-[#1A1A1A] mb-2 flex items-center justify-between">
                  Corporate Partnership
                  <ArrowRight className="h-5 w-5 text-[#C9A84C] group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-[#555555] text-sm">
                  Partner with us to create pathways to employment for our
                  graduates.
                </p>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <Link
                href="/programs"
                className="block bg-[#FAFAF8] rounded-xl p-6 border border-[#DDDDDD] hover:border-[#C9A84C] transition-all"
              >
                <h3 className="font-semibold text-[#1A1A1A] mb-2 flex items-center justify-between">
                  Explore Our Programs
                  <ArrowRight className="h-5 w-5 text-[#C9A84C] group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-[#555555] text-sm">
                  Learn about the programs your donation is supporting.
                </p>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <Link
                href="/blog"
                className="block bg-[#FAFAF8] rounded-xl p-6 border border-[#DDDDDD] hover:border-[#C9A84C] transition-all"
              >
                <h3 className="font-semibold text-[#1A1A1A] mb-2 flex items-center justify-between">
                  Read Our Stories
                  <ArrowRight className="h-5 w-5 text-[#C9A84C] group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-[#555555] text-sm">
                  Discover inspiring stories from our community and programs.
                </p>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button asChild size="lg">
              <Link href="/">
                Return Home
              </Link>
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
          {donationId && (
            <p className="text-[#888888] text-xs mt-4">
              Donation Reference: {donationId}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
