"use client";

/**
 * Volunteer — "Got skills? Got a Saturday?"
 * Observatory design language: full-bleed mentor-and-teen hero, four ways to
 * show up, a slim "what it takes" strip, and a warm sign-up form.
 */

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
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
 * Data — role titles double as the submitted interest values. Do not rename.
 * ------------------------------------------------------------------------- */

const VOLUNTEER_ROLES: {
  icon: FFIconName;
  title: string;
  commitment: string;
  text: string;
}[] = [
  {
    icon: "compass",
    title: "Career Pathway Mentor",
    commitment: "2-4 hours/week",
    text: "Walk beside a father on the IT, trades, or auto & EV pathway: real talk, resume help, and someone in his corner.",
  },
  {
    icon: "crew",
    title: "Event Crew",
    commitment: "Flexible",
    text: "Help run Movies on the Menu, robot races, and festival pop-ups. You keep the joy on schedule.",
  },
  {
    icon: "book",
    title: "Instructor / Guest Speaker",
    commitment: "By session",
    text: "Teach a hands-on session or tell your career story. Tradespeople, technicians, and creators all welcome.",
  },
  {
    icon: "chip",
    title: "Tech Volunteer",
    commitment: "Project-based",
    text: "Put your dev, design, or data skills into community apps we build with fellow nonprofits.",
  },
];

/* ----------------------------------------------------------------------------
 * 1. Hero
 * ------------------------------------------------------------------------- */

function VolunteerHero() {
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
          src="/images/events/volunteer-hero.jpg"
          alt="A volunteer mentor guiding a teen through a hands-on robot build at a Forever Forward workshop"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-[#141413]/50 to-[#141413]/55" />
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
            <Eyebrow light>Join the Mission</Eyebrow>
          </motion.div>

          <h1 className="mt-5 font-bold tracking-tight leading-[0.95]">
            <span className="block overflow-hidden">
              <motion.span
                className="block text-white text-[10.5vw] sm:text-6xl lg:text-8xl"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              >
                GOT SKILLS?
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C] animate-gradient text-[10.5vw] sm:text-6xl lg:text-8xl"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
              >
                GOT A SATURDAY?
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-5 max-w-2xl text-lg sm:text-xl text-white/75 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          >
            Mentors, event crew, guest speakers, tech volunteers. Fathers chasing
            new careers and kids building robots would love to meet you.
          </motion.p>

          <motion.p
            className="mt-4 text-sm text-white/45 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
          >
            Background-friendly onboarding · We train you · 501(c)(3) nonprofit
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          >
            <a
              href="#volunteer-form"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A] font-semibold shadow-[0_0_40px_rgba(201,168,76,0.3)] hover:shadow-[0_0_60px_rgba(201,168,76,0.5)] transition-shadow"
            >
              Sign Up to Volunteer
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#roles"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/25 text-white font-semibold hover:border-[#C9A84C]/60 hover:bg-white/5 transition-colors"
            >
              <FFIcon name="crew" className="h-5 w-5 text-[#C9A84C]" />
              See the Roles
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 2. Ways to show up
 * ------------------------------------------------------------------------- */

function VolunteerRoles() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section id="roles" className="relative bg-[#FAFAF8] py-24 sm:py-32 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" ref={ref}>
        <Eyebrow>Ways to Show Up</Eyebrow>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-5xl leading-[1.12] tracking-tight max-w-3xl"
        >
          No perfection required.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
            Just presence.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="mt-4 text-[#555555] text-base sm:text-lg max-w-2xl"
        >
          Pick what fits your skills and your calendar.
        </motion.p>

        <div className="mt-14 grid sm:grid-cols-2 gap-6">
          {VOLUNTEER_ROLES.map((role, i) => (
            <motion.div
              key={role.title}
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
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBF6E9] border border-[#C9A84C]/25 text-[#A68A2E]">
                  <FFIcon name={role.icon} className="h-7 w-7" />
                </span>
                <span className="inline-flex items-center rounded-full border border-[#5A7247]/30 bg-[#EFF4EB] px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase text-[#3D5030]">
                  {role.commitment}
                </span>
              </div>
              <h3 className="mt-6 text-xl sm:text-2xl font-semibold text-[#1A1A1A] tracking-tight">
                {role.title}
              </h3>
              <p className="mt-3 text-[#555555] text-sm sm:text-base leading-relaxed">
                {role.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * 3. What it takes — slim strip
 * ------------------------------------------------------------------------- */

const TAKES = [
  { icon: "route" as FFIconName, text: "A few hours a month. We schedule around your actual life." },
  { icon: "certificate" as FFIconName, text: "We train you and onboard you. Backgrounds welcome here." },
  { icon: "crew" as FFIconName, text: "You're never solo. There's always a crew beside you." },
];

function WhatItTakes() {
  return (
    <section className="relative bg-[#141413] py-20 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-blueprint opacity-30" aria-hidden />
      <div
        className="aurora-blob absolute -bottom-40 left-1/4 w-[28rem] h-[28rem] rounded-full bg-[#5A7247]/12"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <Eyebrow light>What It Takes</Eyebrow>
            <h2 className="mt-5 font-semibold text-white text-3xl sm:text-4xl tracking-tight leading-[1.1]">
              A few hours a month.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]">
                We handle the rest.
              </span>
            </h2>
          </div>
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-4 sm:gap-6">
          {TAKES.map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="glass-dark rounded-2xl p-6 border border-white/10 flex items-start gap-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E8D48B]">
                <FFIcon name={item.icon} className="h-5 w-5" />
              </span>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
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

function VolunteerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interests: [] as string[],
    availability: "",
    experience: "",
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
        formType: "volunteer",
        formData: {
          firstName,
          lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          skills: formData.interests,
          availability: formData.availability,
          message: formData.experience,
          source: "volunteer_form",
        },
      });

      if (result.success) {
        setIsSubmitted(true);
      } else {
        console.error("Failed to create lead:", result.error);
        // Still show success to user, but log error
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Still show success to avoid blocking user
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(role)
        ? prev.interests.filter((r) => r !== role)
        : [...prev.interests, role],
    }));
  };

  return (
    <section id="volunteer-form" className="relative bg-[#F5F3EF] py-24 sm:py-32 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Eyebrow>Roll Call</Eyebrow>
          </div>
          <h2 className="mt-6 font-semibold text-[#1A1A1A] text-3xl sm:text-5xl leading-[1.12] tracking-tight">
            Sign up to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68A2E] to-[#C9A84C]">
              volunteer.
            </span>
          </h2>
          <p className="mt-4 text-[#555555] text-base sm:text-lg max-w-xl mx-auto">
            Tell us who you are. We&apos;ll find you a spot.
          </p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-12 bg-white rounded-3xl p-10 sm:p-12 text-center border border-[#C9A84C]/30 shadow-[0_12px_48px_rgba(201,168,76,0.14)]"
          >
            <div className="w-16 h-16 rounded-full bg-[#EFF4EB] border border-[#5A7247]/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-[#5A7247]" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-[#1A1A1A] tracking-tight">
              Good looking out.
            </h3>
            <p className="mt-3 text-[#555555] max-w-md mx-auto">
              We&apos;ll read your application and reach out within a week to find
              where you fit best. In the meantime, guard that Saturday.
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
                  <label className={labelClass}>Full Name</label>
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
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  className={fieldClass}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Areas of Interest (select all that apply)
                </label>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {VOLUNTEER_ROLES.map((role) => {
                    const selected = formData.interests.includes(role.title);
                    return (
                      <button
                        key={role.title}
                        type="button"
                        onClick={() => toggleInterest(role.title)}
                        aria-pressed={selected}
                        className={cn(
                          "flex items-center gap-3 p-3.5 rounded-xl border text-left text-sm font-medium transition-all",
                          selected
                            ? "border-[#C9A84C] bg-[#FBF6E9] text-[#1A1A1A] shadow-[0_4px_16px_rgba(201,168,76,0.18)]"
                            : "border-[#DDDDDD] text-[#555555] hover:border-[#C9A84C]/60"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                            selected
                              ? "bg-[#C9A84C]/15 border-[#C9A84C]/40 text-[#A68A2E]"
                              : "bg-[#FAFAF8] border-[#DDDDDD] text-[#888888]"
                          )}
                        >
                          <FFIcon name={role.icon} className="h-4.5 w-4.5" />
                        </span>
                        {role.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className={labelClass}>Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) =>
                    setFormData({ ...formData, availability: e.target.value })
                  }
                  className={fieldClass}
                  required
                >
                  <option value="">Select your availability</option>
                  <option value="weekday-mornings">Weekday mornings</option>
                  <option value="weekday-evenings">Weekday evenings</option>
                  <option value="weekends">Weekends</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Relevant Experience</label>
                <textarea
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  rows={4}
                  placeholder="What do you do, and what makes you want to do this with us?"
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
                    Submit Application
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-[#888888]">
                501(c)(3) nonprofit. Background-friendly onboarding, and we train
                every volunteer before day one.
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

function VolunteerCTA() {
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
              href="#volunteer-form"
              className="group relative block rounded-3xl overflow-hidden border border-[#C9A84C]/30 bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] p-8 sm:p-10 min-h-[15rem] hover:shadow-[0_0_80px_rgba(201,168,76,0.35)] transition-shadow"
            >
              <p className="text-[#1A1A1A]/70 text-xs font-semibold tracking-[0.3em] uppercase">
                For Doers
              </p>
              <h3 className="mt-3 font-bold text-[#1A1A1A] text-2xl sm:text-3xl leading-tight max-w-md">
                Give us that Saturday.
              </h3>
              <p className="mt-2 text-[#1A1A1A]/75 max-w-md">
                Two minutes to sign up. A kid&apos;s robot crossing the finish line
                is your return on investment.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#1A1A1A]">
                Sign up to volunteer
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
              href="/contact"
              className="group relative block rounded-3xl overflow-hidden border border-white/15 bg-white/[0.04] backdrop-blur p-8 sm:p-10 min-h-[15rem] hover:border-[#C9A84C]/50 transition-colors"
            >
              <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase">
                For Tradespeople
              </p>
              <h3 className="mt-3 font-bold text-white text-2xl sm:text-3xl leading-tight max-w-md">
                Know a trade? Help us build the next track.
              </h3>
              <p className="mt-2 text-white/60 max-w-md">
                Plumbers, electricians, mechanics, welders: your know-how could
                become a whole career pathway for fathers in LA.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#E8D48B]">
                Talk to us
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>

        <p className="mt-10 text-center text-white/40 text-sm">
          Not sure where you&apos;d fit?{" "}
          <Link href="/contact" className="text-[#E8D48B] hover:underline">
            Talk to us
          </Link>{" "}
          and we&apos;ll help you find your spot.
        </p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export function VolunteerContent() {
  return (
    <>
      <VolunteerHero />
      <VolunteerRoles />
      <WhatItTakes />
      <VolunteerForm />
      <VolunteerCTA />
    </>
  );
}
