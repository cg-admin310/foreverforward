"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Handshake,
  Server,
  Code,
  Cable,
  ArrowRight,
  Calendar,
  Film,
  CheckCircle,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProgramCard } from "@/components/marketing/program-card";
import { StatCounter } from "@/components/marketing/stat-counter";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { BlogPreviewCard } from "@/components/marketing/blog-preview-card";
import { PROGRAMS, IMPACT_STATS } from "@/lib/constants";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

// Placeholder blog posts
const BLOG_POSTS = [
  {
    title: "5 Ways Tech Skills Are Transforming Fatherhood",
    excerpt:
      "Discover how dads are using technology to stay connected, create memories, and build stronger bonds with their children.",
    category: "Fatherhood",
    date: "Mar 15, 2024",
    readTime: "5 min read",
    slug: "tech-skills-transforming-fatherhood",
    image: "/images/generated/blog-present-father.png",
  },
  {
    title: "From the Shop Floor to the Server Room: Marcus's Story",
    excerpt:
      "How one Father Forward graduate went from manufacturing to managing IT infrastructure for local schools.",
    category: "Success Stories",
    date: "Mar 10, 2024",
    readTime: "7 min read",
    slug: "marcus-success-story",
    image: "/images/generated/blog-south-la-tech.png",
  },
  {
    title: "Why Nonprofits Need Managed IT Services in 2024",
    excerpt:
      "Security threats are evolving. Here's how nonprofit organizations can protect their data and community trust.",
    category: "IT for Nonprofits",
    date: "Mar 5, 2024",
    readTime: "6 min read",
    slug: "nonprofits-managed-it-2024",
    image: "/images/generated/blog-nonprofit-it.png",
  },
];

// Testimonials - Black men in their 30s
const TESTIMONIALS = [
  {
    quote:
      "Man, this program changed everything. Got my Google cert, landed a help desk gig, and now I can actually provide for my kids the right way.",
    name: "Marcus Thompson",
    role: "Father Forward Graduate '23",
  },
  {
    quote:
      "I was out here hustling with no direction. TJ and the team showed me a whole different path. Now my daughter tells everyone her dad works in tech.",
    name: "Darnell Washington",
    role: "Father Forward Graduate '24",
  },
  {
    quote:
      "Real talk—I almost gave up. But these folks believed in me when I didn't believe in myself. Got my certification, got the job. My son sees a different future now.",
    name: "Jerome Mitchell",
    role: "Father Forward Graduate '23",
  },
];

export function HomeContent() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    const result = await subscribeToNewsletter(email, "homepage");

    if (result.success) {
      setIsSubscribed(true);
    } else {
      console.error("Failed to subscribe:", result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      {/* ============================================
          SECTION 1: HERO
          ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#1A1A1A] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#2D2D2D]" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
              <span className="text-sm text-white/80">
                A 501(c)(3) Nonprofit · Serving Los Angeles & Inland Empire
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
              Empowering Fathers.
              <br />
              <span className="text-[#C9A84C]">Strengthening Families.</span>
              <br />
              Building the Future.
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto mb-10"
            >
              Forever Forward delivers workforce development for Black fathers
              and youth while providing enterprise IT services to nonprofits
              and schools—creating a self-sustaining cycle of empowerment.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="/programs">Explore Programs</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="min-w-[200px]">
                <Link href="/services">IT Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Gold accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* ============================================
          SECTION 2: IMPACT GOALS
          ============================================ */}
      <section className="py-20 lg:py-28 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
              Our Vision
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-2">
              What We&apos;re Building Toward
            </h2>
            <p className="text-[#555555] mt-4 max-w-2xl mx-auto">
              These are our goals—the impact we&apos;re working to achieve together. Help us reach them.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {IMPACT_STATS.map((stat) => (
              <StatCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: WHO WE ARE
          ============================================ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-2 lg:order-1"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-xl">
                <Image
                  src="/images/generated/hero-father-tech.png"
                  alt="Black father working confidently in a modern tech environment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {/* Stats overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg border border-[#DDDDDD]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#FBF6E9] flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Google IT Certified</p>
                    <p className="text-xs text-[#888888]">Industry-recognized skills</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <span className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
                Who We Are
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-2 mb-6">
                A Dual-Engine Model for Sustainable Impact
              </h2>
              <p className="text-[#555555] leading-relaxed mb-6">
                Forever Forward operates with a unique approach: we train Black
                fathers and youth with in-demand tech skills, then deploy them
                to serve nonprofit organizations and schools with enterprise IT
                services. The revenue from our IT services funds our programs—
                creating a self-sustaining cycle of empowerment.
              </p>
              <p className="text-[#555555] leading-relaxed mb-8">
                Founded in 2023 by Thomas &quot;TJ&quot; Wilform—a Compton native, former
                enterprise data center engineer, and single father who knows
                firsthand how hard it is to find resources when you&apos;re a dad
                going it alone—Forever Forward is proving that workforce
                development and community service can go hand in hand.
              </p>

              <Button asChild variant="outline">
                <Link href="/about">
                  Read Our Full Story
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: PROGRAMS GRID
          ============================================ */}
      <section className="py-20 lg:py-28 bg-[#EFF4EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Programs"
            subtitle="From workforce development to family enrichment, our programs are designed to uplift every member of the community."
            centered
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {PROGRAMS.map((program, index) => (
              <ProgramCard
                key={program.slug}
                name={program.name}
                slug={program.slug}
                tagline={program.tagline}
                description={program.description}
                audience={program.audience}
                icon={program.icon}
                index={index}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button asChild>
              <Link href="/programs">
                View All Programs
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: IT SERVICES CALLOUT
          ============================================ */}
      <section className="py-20 lg:py-28 bg-[#1A1A1A] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#5A7247]/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
              IT Services
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">
              Enterprise IT.{" "}
              <span className="text-[#C9A84C]">Nonprofit Heart.</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              We bring corporate-level IT infrastructure to nonprofits and
              schools across Los Angeles and the Inland Empire—at prices that
              respect your mission. Our technicians are program graduates who
              understand community service.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {[
              {
                icon: Server,
                title: "Managed IT",
                desc: "24/7 monitoring, help desk, security updates, and strategic planning for $50-$85/user/month.",
              },
              {
                icon: Code,
                title: "Software & AI",
                desc: "Custom web apps, automation tools, and AI solutions built specifically for nonprofit needs.",
              },
              {
                icon: Cable,
                title: "Low Voltage",
                desc: "Structured cabling, CCTV, network infrastructure—professionally installed with minimal disruption.",
              },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#2D2D2D] rounded-xl p-6 lg:p-8 border border-[#444444] hover:border-[#C9A84C] transition-colors group"
              >
                <div className="w-14 h-14 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center mb-6 group-hover:bg-[#C9A84C]/20 transition-colors">
                  <service.icon className="h-7 w-7 text-[#C9A84C]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-white/60 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <Button asChild size="lg">
              <Link href="/services">
                Get a Free IT Assessment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 6: COMMUNITY EVENTS
          ============================================ */}
      <section className="py-20 lg:py-28 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Event Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-2 lg:order-1"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                <Image
                  src="/images/generated/movies-on-menu.png"
                  alt="Black families enjoying community events - fathers bonding with children"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Decorative card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg border border-[#DDDDDD]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#EFF4EB] flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#5A7247]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      Community First
                    </p>
                    <p className="text-xs text-[#888888]">Family Events</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBF6E9] text-[#A68A2E] text-sm font-medium mb-4">
                <Calendar className="h-4 w-4" />
                Community Events
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
                Where Families Come Together
              </h2>
              <p className="text-[#555555] leading-relaxed mb-6">
                From our signature &quot;Movies on the Menu&quot; dinner-and-movie nights
                to workshops, graduation ceremonies, and community celebrations—our
                events create spaces where fathers bond with their children, families
                make memories, and our community grows stronger together.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-[#555555]">
                  <Film className="h-5 w-5 text-[#C9A84C]" />
                  <span>Movies on the Menu family nights</span>
                </div>
                <div className="flex items-center gap-3 text-[#555555]">
                  <GraduationCap className="h-5 w-5 text-[#C9A84C]" />
                  <span>Program graduations & celebrations</span>
                </div>
                <div className="flex items-center gap-3 text-[#555555]">
                  <Users className="h-5 w-5 text-[#C9A84C]" />
                  <span>Workshops, meetups & community gatherings</span>
                </div>
              </div>

              <Button asChild size="lg">
                <Link href="/events">
                  View Upcoming Events
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 7: TESTIMONIALS
          ============================================ */}
      <section className="py-20 lg:py-28 bg-[#F5F3EF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Voices from Our Community"
            subtitle="Real stories from fathers, families, and organizations we've had the privilege to serve."
            centered
          />

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {TESTIMONIALS.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 8: BLOG PREVIEW
          ============================================ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="From the Blog"
            subtitle="Stories, insights, and resources for fathers, families, and mission-driven organizations."
          />

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {BLOG_POSTS.map((post, index) => (
              <BlogPreviewCard
                key={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                date={post.date}
                readTime={post.readTime}
                slug={post.slug}
                image={post.image}
                index={index}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button asChild variant="outline">
              <Link href="/blog">
                Read More Articles
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 9: GET INVOLVED CTA BAND
          ============================================ */}
      <section className="py-20 lg:py-28 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Join the Movement
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Whether you give, serve, or partner—every action moves us forward.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Heart,
                title: "Donate",
                desc: "Your gift funds programs that transform lives. Every dollar goes directly to families and youth in need.",
                cta: "Give Now",
                href: "/get-involved/donate",
              },
              {
                icon: Users,
                title: "Volunteer",
                desc: "Share your skills as a mentor, instructor, or event helper. Your time makes a lasting impact.",
                cta: "Sign Up",
                href: "/get-involved/volunteer",
              },
              {
                icon: Handshake,
                title: "Partner",
                desc: "Corporate sponsors and organizational partners help us scale our mission and reach more families.",
                cta: "Learn More",
                href: "/get-involved/partner",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#2D2D2D] rounded-xl p-8 text-center border border-[#444444] hover:border-[#C9A84C] transition-colors group"
              >
                <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C9A84C]/20 transition-colors">
                  <item.icon className="h-8 w-8 text-[#C9A84C]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-white/60 leading-relaxed mb-6">
                  {item.desc}
                </p>
                <Link
                  href={item.href}
                  scroll={true}
                  className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg border-2 border-[#5A7247] text-[#5A7247] font-semibold text-sm transition-colors hover:bg-[#5A7247] hover:text-white active:bg-[#3D5030] touch-manipulation"
                >
                  {item.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 10: NEWSLETTER SIGNUP
          ============================================ */}
      <section className="py-16 lg:py-20 bg-[#FBF6E9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">
              Stay in the Loop
            </h2>
            <p className="text-[#555555] mb-8">
              Get updates on upcoming events, program launches, success stories,
              and ways to get involved. No spam, just good news.
            </p>

            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#EFF4EB] text-[#5A7247] font-medium"
              >
                <CheckCircle className="h-5 w-5" />
                You&apos;re in! Watch for updates from Forever Forward.
              </motion.div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white border-[#DDDDDD]"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="shrink-0 bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            )}

            <p className="text-xs text-[#888888] mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
