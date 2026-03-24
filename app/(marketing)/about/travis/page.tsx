"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  Brain,
  Shield,
  Clock,
  BookOpen,
  Heart,
  Users,
  Sparkles,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";

const capabilities = [
  {
    icon: MessageCircle,
    title: "24/7 Support",
    description:
      "Travis is always available to answer questions, provide guidance, and offer encouragement—day or night.",
  },
  {
    icon: BookOpen,
    title: "Study Assistance",
    description:
      "Get help with coursework, exam prep, and understanding complex IT concepts in plain language.",
  },
  {
    icon: Brain,
    title: "Personalized Learning",
    description:
      "Travis knows your Path Forward Plan and adapts recommendations based on your progress and goals.",
  },
  {
    icon: Heart,
    title: "Emotional Support",
    description:
      "Juggling work, family, and school is tough. Travis offers encouragement and connects you with resources.",
  },
  {
    icon: Users,
    title: "Resource Connection",
    description:
      "Need childcare? Legal help? Travis can search our resource database and point you to local support.",
  },
  {
    icon: Shield,
    title: "Safe Space",
    description:
      "All conversations are confidential. Travis escalates to human staff only when you need more help.",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Enroll in a Program",
    description:
      "When you join Father Forward or Tech-Ready Youth, you get instant access to Travis through our participant portal.",
  },
  {
    step: 2,
    title: "Set Your Goals",
    description:
      "Work with your case worker to create a Path Forward Plan. Travis uses this to personalize your support.",
  },
  {
    step: 3,
    title: "Chat Anytime",
    description:
      "Ask questions, get study help, request resources, or just check in. Travis is always ready to help.",
  },
];

const trustFeatures = [
  {
    icon: Lock,
    title: "Private & Secure",
    description: "Your conversations are encrypted and never shared without your consent.",
  },
  {
    icon: Users,
    title: "Human Backup",
    description: "Travis flags conversations that need human attention, so you always have support.",
  },
  {
    icon: Zap,
    title: "Powered by Claude",
    description: "Built on Anthropic's Claude AI, known for being helpful, harmless, and honest.",
  },
];

export default function TravisPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#2D2D2D]" />

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#C9A84C]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-[#5A7247]/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-sm text-white/80 mb-6">
                <Sparkles className="h-4 w-4 text-[#C9A84C]" />
                AI-Powered Support
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Meet <span className="text-[#C9A84C]">Travis</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/70 mb-8">
                Your AI case manager who&apos;s available 24/7 to answer questions,
                provide study help, connect you with resources, and support you
                on your journey—with a kind heart and endless patience.
              </p>
              <Button asChild size="lg">
                <Link href="/get-involved/enroll">
                  Enroll to Access Travis
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            {/* Travis Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] flex items-center justify-center">
                  <span className="text-8xl lg:text-9xl font-bold text-[#1A1A1A]">
                    T
                  </span>
                </div>
                {/* Pulse Effect */}
                <div className="absolute inset-0 rounded-full border-2 border-[#C9A84C] animate-ping opacity-20" />
                {/* Status Badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7A9A63] animate-pulse" />
                  <span className="text-sm text-white/80">Online & Ready</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Capabilities Grid */}
      <section className="py-20 lg:py-28 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What Travis Can Do"
            subtitle="Your AI companion designed specifically for Forever Forward participants."
            centered
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-[#DDDDDD] hover:border-[#C9A84C] transition-colors shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FBF6E9] flex items-center justify-center mb-4">
                  <capability.icon className="h-6 w-6 text-[#C9A84C]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                  {capability.title}
                </h3>
                <p className="text-[#555555] text-sm leading-relaxed">
                  {capability.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="How It Works"
            subtitle="Getting started with Travis is simple."
            centered
          />

          <div className="mt-12 space-y-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex gap-6"
              >
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center">
                    <span className="text-[#1A1A1A] font-bold text-lg">
                      {step.step}
                    </span>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="w-0.5 h-16 bg-[#C9A84C]/30 mx-auto mt-2" />
                  )}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#555555] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Demo */}
      <section className="py-20 lg:py-28 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="bg-[#2D2D2D] rounded-xl border border-[#444444] overflow-hidden">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-[#444444] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center">
                    <span className="text-[#1A1A1A] font-bold">T</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Travis</p>
                    <p className="text-xs text-white/50">
                      AI Case Manager • Always Here
                    </p>
                  </div>
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#7A9A63]" />
                </div>

                {/* Chat Messages */}
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  <div className="flex">
                    <div className="bg-[#444444] text-white rounded-lg rounded-bl-sm px-4 py-3 max-w-[85%]">
                      Hey! I&apos;m Travis, your AI case manager. I&apos;m here to support
                      you through Father Forward. What can I help you with today?
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-[#C9A84C] text-[#1A1A1A] rounded-lg rounded-br-sm px-4 py-3 max-w-[85%]">
                      I&apos;m feeling overwhelmed with the networking section. There&apos;s
                      so much to learn.
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-[#444444] text-white rounded-lg rounded-bl-sm px-4 py-3 max-w-[85%]">
                      I totally get it—networking can feel like drinking from a
                      fire hose at first. The good news? You don&apos;t need to master
                      everything at once.
                      <br />
                      <br />
                      Let&apos;s break it down: which part feels most confusing right
                      now—subnetting, protocols, or something else?
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-[#C9A84C] text-[#1A1A1A] rounded-lg rounded-br-sm px-4 py-3 max-w-[85%]">
                      Definitely subnetting. The math confuses me.
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-[#444444] text-white rounded-lg rounded-bl-sm px-4 py-3 max-w-[85%]">
                      Perfect—that&apos;s actually one of the most common pain points,
                      so you&apos;re not alone! I&apos;ve got a great 10-minute video that
                      explains subnetting using a pizza analogy. Want me to pull
                      that up?
                      <br />
                      <br />
                      Also, I can quiz you after to make sure it sticks. 🍕
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="px-6 py-4 border-t border-[#444444] flex gap-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-[#444444] border border-[#555555] rounded-lg px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:border-[#C9A84C]"
                    disabled
                  />
                  <Button size="icon" disabled>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
                See It In Action
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-6">
                A Conversation With Travis
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Travis doesn&apos;t just give generic answers—he understands the
                challenges our participants face and responds with empathy,
                patience, and practical help.
              </p>
              <ul className="space-y-3">
                {[
                  "Breaks down complex concepts into simple terms",
                  "Remembers your progress and learning style",
                  "Connects you with relevant resources",
                  "Knows when to loop in human support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70">
                    <CheckCircle2 className="h-5 w-5 text-[#7A9A63] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-20 lg:py-28 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Built on Trust"
            subtitle="Your privacy and safety are our top priorities."
            centered
          />

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {trustFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-[#5A7247]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#555555] text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Common Questions"
            subtitle="Everything you need to know about Travis."
            centered
          />

          <div className="mt-12 space-y-6">
            {[
              {
                q: "Is Travis replacing human case workers?",
                a: "Not at all! Travis is a support tool that helps our human team be more effective. You'll still have a dedicated case worker who meets with you regularly. Travis just makes sure you always have someone to talk to between those meetings.",
              },
              {
                q: "Can Travis help with non-program questions?",
                a: "Yes! Travis can help with general life challenges—finding childcare, understanding legal resources, managing stress. If something is outside his expertise, he'll connect you with the right person or organization.",
              },
              {
                q: "Is my conversation data private?",
                a: "Absolutely. Your conversations are encrypted and only accessible to you and your case worker. We never sell or share your data. Travis will only escalate to human staff when you need more support—and you'll always be informed.",
              },
              {
                q: "What if Travis gives wrong information?",
                a: "Travis is designed to be helpful but cautious. If he's unsure, he'll say so and suggest connecting you with a human expert. You can also flag any response you think is incorrect, and we'll review it.",
              },
            ].map((faq, index) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#FAFAF8] rounded-xl p-6 border border-[#DDDDDD]"
              >
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
                  {faq.q}
                </h3>
                <p className="text-[#555555] leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-[#FBF6E9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4">
              Ready to Meet Travis?
            </h2>
            <p className="text-[#555555] mb-8">
              Enroll in Father Forward or Tech-Ready Youth to get instant access
              to Travis and start your journey toward a tech career.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/get-involved/enroll">Enroll Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/programs">Explore Programs</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
