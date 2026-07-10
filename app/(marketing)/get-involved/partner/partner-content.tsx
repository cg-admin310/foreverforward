"use client";

/**
 * Partner — "Join forces with us."
 * Observatory design language: dark hero over community-builders imagery,
 * four partner lanes, the company we keep, and a conversation-starter form.
 * We build with partners. We never sell to them.
 */

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FFIcon, type FFIconName } from "@/components/shared/ff-icons";
import { routeFormSubmission } from "@/lib/actions/lead-routing";

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

/* ----------------------------------------------------------------------------
 * Data — titles align with the form's select options; values stay untouched
 * ------------------------------------------------------------------------- */

const PARTNER_TYPES: {
  icon: FFIconName;
  title: string;
  text: string;
}[] = [
  {
    icon: "crew",
    title: "Community Organizations",
    text: "Fellow nonprofits, joining forces. We co-run programs, share tech know-how, and build community apps together. Never for a fee.",
  },
  {
    icon: "briefcase",
    title: "Employers & Trade Programs",
    text: "Hire Career Forward graduates or host apprenticeships in IT, skilled trades, and auto & EV. Trained, motivated, and ready to work.",
  },
  {
    icon: "spark",
    title: "Sponsors",
    text: "Fund a cohort of fathers, a robotics build, or a family movie night. You see exactly where every dollar lands.",
  },
  {
    icon: "book",
    title: "Schools",
    text: "Host Future Builders workshops on your campus. We bring the robots, printers, and satellite trackers. You bring the students.",
  },
];

const GOALS = [
  { value: "500+", label: "Fathers to Train" },
  { value: "5,000+", label: "Youth to Reach" },
  { value: "50+", label: "Events Every Year" },
  { value: "25+", label: "Partner Orgs Strong" },
];

const CURRENT_PARTNERS = [
  {
    name: "A New Day Foundation",
    logo: "/images/partners/a-new-day-foundation.png",
    url: "https://anewdayfoundation.net/",
  },
  {
    name: "Google.org",
    logo: "/images/partners/google.svg",
    url: "https://www.google.org/",
  },
  {
    name: "Microsoft Philanthropies",
    logo: "/images/partners/microsoft.svg",
    url: "https://www.microsoft.com/en-us/corporate-responsibility/philanthropies",
  },
  {
    name: "Los Angeles Unified School District",
    logo: "/images/partners/lausd.png",
    url: "https://www.lausd.org/",
  },
];

/* ----------------------------------------------------------------------------
 * 1. Hero
 * ------------------------------------------------------------------------- */

function PartnerHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-[92svh] bg-[#141413] overflow-hidden">
      <motion.div style={{ y: imgY }} className="absolute -inset-y-[8%] inset-x-0">
        <Image
          src="/images/future/community-builders.jpg"
          alt="Nonprofit leaders collaborating around a touchscreen reviewing a community app"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-[#141413]/55 to-[#141413]/60" />
      <div className="absolute inset-0 grain-overlay" aria-hidden />
      <div className="absolute inset-0 bg-starfield opacity-40" aria-hidden />

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 min-h-[92svh] flex flex-col justify-end"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full pb-16 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            <Eyebrow light>Allies, Not Vendors</Eyebrow>
          </motion.div>

          <h1 className="mt-5 font-bold tracking-tight leading-[0.95]">
            <span className="block overflow-hidden">
              <motion.span
                className="block text-white text-[10.5vw] sm:text-6xl lg:text-8xl"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              >
                JOIN FORCES
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient text-[10.5vw] sm:text-6xl lg:text-8xl"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
              >
                WITH US.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-5 max-w-2xl text-lg sm:text-xl text-white/75 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          >
            We build with partners. We never sell to them. Community organizations,
            employers, sponsors, and schools, leveling up the whole neighborhood
            together.
          </motion.p>

          <motion.p
            className="mt-4 text-sm text-white/45 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
          >
            501(c)(3) nonprofit · Greater Los Angeles · Virtual nationwide
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          >
            <a
              href="#partner-form"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A] font-semibold shadow-[0_0_40px_rgba(201,168,76,0.3)] hover:shadow-[0_0_60px_rgba(201,168,76,0.5)] transition-shadow"
            >
              Start the Conversation
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/get-involved/donate"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/25 text-white font-semibold hover:border-[#C9A84C]/60 hover:bg-white/5 transition-colors"
            >
              <FFIcon name="spark" className="h-5 w-5 text-[#C9A84C]" />
              Sponsor a Night
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 2. Four ways in
 * ------------------------------------------------------------------------- */

function PartnerLanes() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section className="relative bg-[#FAFAF8] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" ref={ref}>
        <Eyebrow>Four Ways In</Eyebrow>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-5xl leading-[1.12] tracking-tight max-w-3xl"
        >
          Pick your lane, or{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
            invent a fifth.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="mt-4 text-[#555555] text-base sm:text-lg max-w-2xl"
        >
          Every partnership starts the same way: what are you great at, and what
          could we build together?
        </motion.p>

        <div className="mt-14 grid sm:grid-cols-2 gap-6">
          {PARTNER_TYPES.map((type, i) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
              className="group relative bg-white rounded-3xl p-7 sm:p-9 border border-[#DDDDDD] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(201,168,76,0.16)] hover:border-[#C9A84C]/60 transition-all duration-300 overflow-hidden"
            >
              <span
                className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
                aria-hidden
              />
              <div className="flex items-center justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBF6E9] border border-[#C9A84C]/25 text-[#A68A2E]">
                  <FFIcon name={type.icon} className="h-7 w-7" />
                </span>
                <span className="text-outline-gold font-bold text-4xl sm:text-5xl leading-none select-none">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-xl sm:text-2xl font-semibold text-[#1A1A1A] tracking-tight">
                {type.title}
              </h3>
              <p className="mt-3 text-[#555555] text-sm sm:text-base leading-relaxed">
                {type.text}
              </p>
              <a
                href="#partner-form"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#A68A2E] group-hover:text-[#C9A84C] transition-colors"
              >
                Talk about this lane
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 3. Goals + the company we keep
 * ------------------------------------------------------------------------- */

function CompanyWeKeep() {
  return (
    <section className="relative bg-[#141413] py-24 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-starfield opacity-60" aria-hidden />
      <div
        className="aurora-blob absolute -top-32 -right-40 w-[30rem] h-[30rem] rounded-full bg-[#C9A84C]/10"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Eyebrow light>What We&apos;re Building Toward</Eyebrow>
          <h2 className="mt-6 font-semibold text-white text-3xl sm:text-5xl leading-[1.1] tracking-tight">
            Big goals need{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
              good company.
            </span>
          </h2>
          <p className="mt-4 text-white/60 text-base sm:text-lg max-w-2xl">
            Every contribution is tax-deductible, every outcome gets reported, and
            every partner gets the credit they earned.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {GOALS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className="glass-dark rounded-2xl p-6 text-center border border-white/10"
            >
              <span className="block text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
                {stat.value}
              </span>
              <p className="mt-1.5 text-white/55 text-xs sm:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20">
          <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C9A84C]">
            The Company We Keep
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {CURRENT_PARTNERS.map((partner, i) => (
              <motion.a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="group aspect-[3/2] bg-white rounded-2xl p-6 border border-white/10 flex items-center justify-center hover:border-[#C9A84C]/60 hover:shadow-[0_0_40px_rgba(201,168,76,0.15)] transition-all"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={140}
                  height={50}
                  className="max-h-10 w-auto object-contain opacity-75 group-hover:opacity-100 transition-opacity"
                />
              </motion.a>
            ))}
          </div>
          <p className="mt-5 text-white/40 text-sm">
            A New Day Foundation, founded by Dawnn Lewis, is a key ally for events
            and laptop donations. Your logo could be next to theirs.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 4. The form — field names and values unchanged
 * ------------------------------------------------------------------------- */

const fieldClass =
  "w-full rounded-xl border border-[#DDDDDD] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#888888]/70 focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/25 transition-colors";

const labelClass =
  "block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#555555] mb-2";

function PartnerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    title: "",
    partnershipType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Split name into first and last
      const nameParts = formData.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const result = await routeFormSubmission({
        formType: "partner",
        formData: {
          firstName,
          lastName,
          email: formData.email,
          organization: formData.organization,
          title: formData.title || undefined,
          partnershipType: formData.partnershipType,
          message: formData.message,
          source: "partner_form",
        },
      });

      if (result.success) {
        setIsSubmitted(true);
      } else {
        console.error("Failed to create lead:", result.error);
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="partner-form" className="relative bg-[#F5F3EF] py-24 sm:py-32 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Eyebrow>Step One</Eyebrow>
          </div>
          <h2 className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-5xl leading-[1.12] tracking-tight">
            Start the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
              conversation.
            </span>
          </h2>
          <p className="mt-4 text-[#555555] text-base sm:text-lg max-w-xl mx-auto">
            Tell us what your organization does. We&apos;ll bring ideas, and
            probably snacks.
          </p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-12 bg-white rounded-3xl p-10 sm:p-12 text-center border border-[#C9A84C]/30 shadow-[0_12px_48px_rgba(201,168,76,0.14)]"
          >
            <div className="w-16 h-16 rounded-full bg-[#FBF6E9] border border-[#C9A84C]/30 flex items-center justify-center mx-auto">
              <FFIcon name="spark" className="h-8 w-8 text-[#A68A2E]" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-[#1A1A1A] tracking-tight">
              Let&apos;s build something.
            </h3>
            <p className="mt-3 text-[#555555] max-w-md mx-auto">
              We&apos;ll read your inquiry and reach out within a few business days.
              Real people, real replies. That&apos;s the policy.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: EASE }}
            onSubmit={handleSubmit}
            className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-[#DDDDDD] shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
          >
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Your Name</label>
                  <input
                    className={fieldClass}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="First and last"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    className={fieldClass}
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="you@yourorg.org"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Organization</label>
                  <input
                    className={fieldClass}
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organization: e.target.value,
                      })
                    }
                    placeholder="Who you're with"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Your Title</label>
                  <input
                    className={fieldClass}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Partnership Interest</label>
                <select
                  value={formData.partnershipType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      partnershipType: e.target.value,
                    })
                  }
                  className={fieldClass}
                  required
                >
                  <option value="">Select a partnership type</option>
                  <option value="community_org">Community Organization</option>
                  <option value="employer">Employer / Trade Program</option>
                  <option value="sponsor">Sponsor</option>
                  <option value="school">School</option>
                  <option value="other">Other / Not Sure</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Your Partnership Ideas</label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  placeholder="What does your organization do, and what could we build together?"
                  className={fieldClass}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A] font-semibold shadow-[0_0_30px_rgba(201,168,76,0.25)] hover:shadow-[0_0_50px_rgba(201,168,76,0.4)] transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Submit Partnership Inquiry
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-[#888888]">
                501(c)(3) nonprofit. We reply to every inquiry, usually within a
                few business days.
              </p>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 5. Closing CTA pair
 * ------------------------------------------------------------------------- */

function PartnerCTA() {
  return (
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
            <a
              href="#partner-form"
              className="group relative block rounded-3xl overflow-hidden border border-[#C9A84C]/30 bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] p-8 sm:p-10 min-h-[15rem] hover:shadow-[0_0_80px_rgba(201,168,76,0.35)] transition-shadow"
            >
              <p className="text-[#1A1A1A]/70 text-xs font-semibold tracking-[0.3em] uppercase">
                For Future Allies
              </p>
              <h3 className="mt-3 font-bold text-[#1A1A1A] text-2xl sm:text-3xl leading-tight max-w-md">
                Start the conversation.
              </h3>
              <p className="mt-2 text-[#1A1A1A]/75 max-w-md">
                Two minutes, one form, zero sales pitch. Tell us who you are and
                we&apos;ll take it from there.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#1A1A1A]">
                Go to the form
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <Link
              href="/get-involved/donate"
              className="group relative block rounded-3xl overflow-hidden border border-white/15 bg-white/[0.04] backdrop-blur p-8 sm:p-10 min-h-[15rem] hover:border-[#C9A84C]/50 transition-colors"
            >
              <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase">
                For Believers
              </p>
              <h3 className="mt-3 font-bold text-white text-2xl sm:text-3xl leading-tight max-w-md">
                Sponsor a night.
              </h3>
              <p className="mt-2 text-white/60 max-w-md">
                Fund a family movie night, a robotics build, or a father&apos;s
                first step into a new career. Every dollar is tax-deductible.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#E8D48B]">
                Make it happen
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>

        <p className="mt-10 text-center text-white/40 text-sm">
          Forms not your thing?{" "}
          <Link href="/contact" className="text-[#E8D48B] hover:underline">
            Contact us
          </Link>{" "}
          and let&apos;s just talk.
        </p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export function PartnerContent() {
  return (
    <>
      <PartnerHero />
      <PartnerLanes />
      <CompanyWeKeep />
      <PartnerForm />
      <PartnerCTA />
    </>
  );
}
