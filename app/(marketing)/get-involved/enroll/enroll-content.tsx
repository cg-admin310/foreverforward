"use client";

/**
 * Enroll — the front door to every program.
 * Observatory design language around an untouched enrollment flow:
 * the three-step state machine, validation, routeFormSubmission and
 * createParticipant server actions are preserved exactly.
 */

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/shared/badge";
import { FFIcon, isFFIconName, type FFIconName } from "@/components/shared/ff-icons";
import { createEnrollmentRequest } from "@/lib/actions/program-access";
import type { ProgramType } from "@/types/database";
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

type FormStep = "program" | "details" | "confirmation";

interface FormData {
  // Step 1: Program Selection
  program: string;
  // Step 2: Personal Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dateOfBirth: string;
  // Father Forward specific
  employmentStatus: string;
  itExperience: string;
  // Youth specific
  parentGuardianName: string;
  parentGuardianPhone: string;
  parentGuardianEmail: string;
  schoolName: string;
  gradeLevel: string;
  // General
  howDidYouHear: string;
  goals: string;
  barriers: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

const initialFormData: FormData = {
  program: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "CA",
  zip: "",
  dateOfBirth: "",
  employmentStatus: "",
  itExperience: "",
  parentGuardianName: "",
  parentGuardianPhone: "",
  parentGuardianEmail: "",
  schoolName: "",
  gradeLevel: "",
  howDidYouHear: "",
  goals: "",
  barriers: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
};

// The programs a person can apply to, grouped under their umbrella. Each maps to
// a CRM ProgramType (kept stable) while the specific program name is passed
// through as the interest so the admin sees exactly which one they chose.
type EnrollableProgram = {
  slug: string;
  name: string;
  umbrella: string;
  audience: "fathers" | "youth" | "kids";
  blurb: string;
  duration: string;
  format: string;
  icon: string;
  programType: ProgramType;
};

const enrollablePrograms: EnrollableProgram[] = [
  {
    slug: "it-foundations",
    name: "IT & Cybersecurity Foundations",
    umbrella: "Father Forward",
    audience: "fathers",
    blurb: "Earn your CompTIA Tech+ and start a real tech career, help desk to network engineer.",
    duration: "12 weeks",
    format: "Hybrid",
    icon: "certificate",
    programType: "father_forward",
  },
  {
    slug: "networking-live",
    name: "Networking Live",
    umbrella: "Father Forward",
    audience: "fathers",
    blurb: "Build a live network by hand, then tour the Cosm LED dome in Inglewood.",
    duration: "Half-day",
    format: "Hands-on + trip",
    icon: "network",
    programType: "father_forward",
  },
  {
    slug: "security-path",
    name: "The Security Path",
    umbrella: "Father Forward",
    audience: "fathers",
    blurb: "Certified safety training and a real door into an armed-security career.",
    duration: "One-day",
    format: "Training",
    icon: "bolt",
    programType: "father_forward",
  },
  {
    slug: "future-tech-lab",
    name: "Future Tech Lab",
    umbrella: "Tech-Ready Youth",
    audience: "youth",
    blurb: "Robots, AI, 3D printing, and a field trip inside a real tech company.",
    duration: "8 weeks",
    format: "Hybrid",
    icon: "robot",
    programType: "tech_ready_youth",
  },
  {
    slug: "stories-from-my-future",
    name: "Stories from My Future",
    umbrella: "Tech-Ready Youth",
    audience: "kids",
    blurb: "Kids write a story with an AI partner and 3D-print their own hero.",
    duration: "Workshop",
    format: "In-person",
    icon: "spark",
    programType: "stories_from_my_future",
  },
];

const STEPS: { key: FormStep; label: string }[] = [
  { key: "program", label: "Pick Your Program" },
  { key: "details", label: "Tell Us About You" },
  { key: "confirmation", label: "You're In Motion" },
];

const NEXT_STEPS: { icon: FFIconName; title: string; text: string }[] = [
  {
    icon: "route",
    title: "You apply",
    text: "Five minutes, no essays, no fees. Done from your phone.",
  },
  {
    icon: "crew",
    title: "We call",
    text: "A real team member reads every word and reaches out within a week.",
  },
  {
    icon: "rocket",
    title: "You start",
    text: "We handle the details together. You show up ready to build.",
  },
];

/** Section card wrapper for the details form. */
function FormSection({
  icon,
  title,
  children,
}: {
  icon: FFIconName;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDDDDD]">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A] mb-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#A68A2E]">
          <FFIcon name={icon} className="h-5 w-5" />
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

export function EnrollContent() {
  const [step, setStep] = useState<FormStep>("program");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProgram = enrollablePrograms.find((p) => p.slug === formData.program);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!selectedProgram) {
        alert("Please pick a program.");
        setIsSubmitting(false);
        return;
      }

      // The application lands directly in Program Requests, keyed by email, with
      // every field the applicant filled in. Approving it grants program access.
      const details: Record<string, unknown> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        programName: selectedProgram.name,
        umbrella: selectedProgram.umbrella,
        employmentStatus: formData.employmentStatus,
        itExperience: formData.itExperience,
        parentGuardianName: formData.parentGuardianName,
        parentGuardianPhone: formData.parentGuardianPhone,
        parentGuardianEmail: formData.parentGuardianEmail,
        schoolName: formData.schoolName,
        gradeLevel: formData.gradeLevel,
        goals: formData.goals,
        barriers: formData.barriers,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        howDidYouHear: formData.howDidYouHear,
      };

      const result = await createEnrollmentRequest({
        email: formData.email,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        program: selectedProgram.slug,
        source: "website",
        phone: formData.phone || undefined,
        message: formData.goals || undefined,
        details,
      });

      if (result.success) {
        setStep("confirmation");
      } else {
        console.error("Failed to submit application:", result.error);
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting enrollment:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isYouthProgram =
    selectedProgram?.audience === "youth" || selectedProgram?.audience === "kids";

  const isFatherProgram = selectedProgram?.audience === "fathers";

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <>
      {/* Hero — the launch pad */}
      <section className="relative py-24 lg:py-32 bg-[#141413] overflow-hidden">
        <div className="absolute inset-0 bg-starfield bg-starfield-twinkle" aria-hidden />
        <div className="absolute inset-0 bg-blueprint opacity-30" aria-hidden />
        <div
          className="aurora-blob absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-[#C9A84C]/12"
          aria-hidden
        />
        <div
          className="aurora-blob absolute -bottom-40 -left-24 w-[26rem] h-[26rem] rounded-full bg-[#5A7247]/15"
          style={{ animationDelay: "-8s" }}
          aria-hidden
        />

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="flex justify-center">
              <Eyebrow light>
                Program Enrollment
                <span className="inline-block h-px w-8 bg-current opacity-60" />
              </Eyebrow>
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              Your path forward{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8D48B] to-[#C9A84C]">
                starts here.
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Pick a program, tell us about you, and we take it from there.
            </p>
            <div className="mt-7 flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-sm text-white/55">
              {[
                "Free for qualifying participants",
                "Real humans review every application",
              ].map((chip) => (
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

      {/* Step indicator — gold progress */}
      <section className="py-8 bg-white border-b border-[#DDDDDD]">
        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            {STEPS.map((s, index) => {
              const done = index < stepIndex;
              const active = index === stepIndex;
              return (
                <div key={s.key} className={cn("flex items-center", index < 2 && "flex-1 sm:flex-initial")}>
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all",
                        active &&
                          "bg-[#C9A84C] text-[#1A1A1A] shadow-[0_0_20px_rgba(201,168,76,0.4)]",
                        done && "bg-[#5A7247] text-white",
                        !active && !done &&
                          "bg-transparent border-2 border-[#DDDDDD] text-[#888888]"
                      )}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                    </div>
                    <span
                      className={cn(
                        "text-sm hidden sm:inline whitespace-nowrap",
                        active ? "text-[#1A1A1A] font-semibold" : "text-[#888888]"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {index < 2 && (
                    <div className="relative flex-1 sm:w-14 lg:w-20 h-0.5 mx-3 sm:mx-4 bg-[#DDDDDD] overflow-hidden rounded-full">
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] transition-all duration-500",
                          index < stepIndex ? "w-full" : "w-0"
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Program Selection */}
            {step === "program" && (
              <motion.div
                key="program"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center">
                  <div className="flex justify-center">
                    <Eyebrow>Step One</Eyebrow>
                  </div>
                  <h2 className="mt-4 font-semibold text-[#1A1A1A] text-3xl sm:text-4xl tracking-tight">
                    Choose your door.
                  </h2>
                  <p className="mt-3 text-[#555555] max-w-xl mx-auto">
                    Career training for fathers, future tech for kids and youth.
                    Pick the one that fits. You can&apos;t get this wrong.
                  </p>
                </div>

                <div className="mt-12 space-y-4">
                  {enrollablePrograms.map((program) => {
                    const active = formData.program === program.slug;
                    return (
                      <button
                        key={program.slug}
                        type="button"
                        onClick={() => updateField("program", program.slug)}
                        className={cn(
                          "w-full text-left p-6 rounded-2xl border-2 transition-all",
                          active
                            ? "border-[#C9A84C] bg-[#FBF6E9] shadow-[0_8px_30px_rgba(201,168,76,0.2)]"
                            : "border-[#DDDDDD] bg-white hover:border-[#C9A84C]/50"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          {isFFIconName(program.icon) && (
                            <span
                              className={cn(
                                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors",
                                active
                                  ? "bg-[#C9A84C] border-[#A68A2E] text-[#1A1A1A]"
                                  : "bg-[#C9A84C]/10 border-[#C9A84C]/30 text-[#A68A2E]"
                              )}
                            >
                              <FFIcon name={program.icon} className="h-6 w-6" />
                            </span>
                          )}
                          <div className="flex-1">
                            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#A68A2E] mb-1">
                              {program.umbrella}
                            </p>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                                {program.name}
                              </h3>
                              <Badge variant={program.audience} size="sm" />
                            </div>
                            <p className="text-[#555555] text-sm mb-3 leading-relaxed">
                              {program.blurb}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#A68A2E]">
                                {program.duration}
                              </span>
                              <span className="inline-flex items-center rounded-full border border-[#DDDDDD] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#888888]">
                                {program.format}
                              </span>
                            </div>
                          </div>
                          <div
                            className={cn(
                              "w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
                              active
                                ? "border-[#C9A84C] bg-[#C9A84C]"
                                : "border-[#DDDDDD]"
                            )}
                          >
                            {active && (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 text-center">
                  <Button
                    onClick={() => setStep("details")}
                    disabled={!formData.program}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <p className="text-center text-sm text-[#888888] mt-6">
                  Looking for Making Moments family events?{" "}
                  <Link
                    href="/events"
                    className="text-[#A68A2E] font-semibold hover:underline"
                  >
                    View upcoming events
                  </Link>
                </p>
              </motion.div>
            )}

            {/* Step 2: Details Form */}
            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8 p-4 rounded-2xl bg-[#FBF6E9] border border-[#C9A84C]/40">
                  <div className="flex items-center gap-3">
                    {selectedProgram && isFFIconName(selectedProgram.icon) && (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C9A84C] text-[#1A1A1A]">
                        <FFIcon name={selectedProgram.icon} className="h-5 w-5" />
                      </span>
                    )}
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A]">
                        {selectedProgram?.name}
                      </h3>
                      <p className="text-sm text-[#555555]">
                        {selectedProgram?.duration} &middot; {selectedProgram?.format}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep("program")}
                      className="ml-auto text-sm text-[#A68A2E] font-semibold hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <FormSection icon="compass" title="Personal Information">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          First Name *
                        </label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) =>
                            updateField("firstName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Last Name *
                        </label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) =>
                            updateField("lastName", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Phone *
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                        Date of Birth *
                      </label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          updateField("dateOfBirth", e.target.value)
                        }
                        required
                      />
                    </div>
                  </FormSection>

                  {/* Address */}
                  <FormSection icon="network" title="Address">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                        Street Address *
                      </label>
                      <Input
                        value={formData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          City *
                        </label>
                        <Input
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          State *
                        </label>
                        <Input
                          value={formData.state}
                          onChange={(e) => updateField("state", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          ZIP *
                        </label>
                        <Input
                          value={formData.zip}
                          onChange={(e) => updateField("zip", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </FormSection>

                  {/* Father Forward Specific Fields */}
                  {isFatherProgram && (
                    <FormSection icon="briefcase" title="Background Information">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                            Current Employment Status *
                          </label>
                          <select
                            value={formData.employmentStatus}
                            onChange={(e) =>
                              updateField("employmentStatus", e.target.value)
                            }
                            className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                            required
                          >
                            <option value="">Select status</option>
                            <option value="employed-full">
                              Employed Full-Time
                            </option>
                            <option value="employed-part">
                              Employed Part-Time
                            </option>
                            <option value="unemployed-looking">
                              Unemployed, Looking for Work
                            </option>
                            <option value="unemployed-not">
                              Unemployed, Not Looking
                            </option>
                            <option value="self-employed">Self-Employed</option>
                            <option value="student">Student</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                            IT/Tech Experience Level *
                          </label>
                          <select
                            value={formData.itExperience}
                            onChange={(e) =>
                              updateField("itExperience", e.target.value)
                            }
                            className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                            required
                          >
                            <option value="">Select experience level</option>
                            <option value="none">No IT experience</option>
                            <option value="basic">
                              Basic (can use computers)
                            </option>
                            <option value="intermediate">
                              Intermediate (some tech skills)
                            </option>
                            <option value="advanced">
                              Advanced (worked in tech)
                            </option>
                          </select>
                        </div>
                      </div>
                    </FormSection>
                  )}

                  {/* Youth Program Specific Fields */}
                  {isYouthProgram && (
                    <FormSection icon="crew" title="Parent/Guardian Information">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                            Parent/Guardian Name *
                          </label>
                          <Input
                            value={formData.parentGuardianName}
                            onChange={(e) =>
                              updateField("parentGuardianName", e.target.value)
                            }
                            required
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                              Parent/Guardian Phone *
                            </label>
                            <Input
                              type="tel"
                              value={formData.parentGuardianPhone}
                              onChange={(e) =>
                                updateField(
                                  "parentGuardianPhone",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                              Parent/Guardian Email *
                            </label>
                            <Input
                              type="email"
                              value={formData.parentGuardianEmail}
                              onChange={(e) =>
                                updateField(
                                  "parentGuardianEmail",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                              School Name
                            </label>
                            <Input
                              value={formData.schoolName}
                              onChange={(e) =>
                                updateField("schoolName", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                              Grade Level
                            </label>
                            <select
                              value={formData.gradeLevel}
                              onChange={(e) =>
                                updateField("gradeLevel", e.target.value)
                              }
                              className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                            >
                              <option value="">Select grade</option>
                              <option value="9">9th Grade</option>
                              <option value="10">10th Grade</option>
                              <option value="11">11th Grade</option>
                              <option value="12">12th Grade</option>
                              <option value="graduated">
                                High School Graduate
                              </option>
                              <option value="college">In College</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </FormSection>
                  )}

                  {/* Goals & Additional Info */}
                  <FormSection icon="route" title="Your Goals">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          How did you hear about us? *
                        </label>
                        <select
                          value={formData.howDidYouHear}
                          onChange={(e) =>
                            updateField("howDidYouHear", e.target.value)
                          }
                          className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                          required
                        >
                          <option value="">Select one</option>
                          <option value="social-media">Social Media</option>
                          <option value="friend-family">
                            Friend or Family
                          </option>
                          <option value="community-event">
                            Community Event
                          </option>
                          <option value="school">School</option>
                          <option value="church">Church</option>
                          <option value="partner-org">
                            Partner Organization
                          </option>
                          <option value="google">Google Search</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          What do you hope to achieve through this program? *
                        </label>
                        <textarea
                          value={formData.goals}
                          onChange={(e) => updateField("goals", e.target.value)}
                          rows={3}
                          placeholder="What does forward look like for you? No wrong answers here."
                          className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Anything that could get in the way?
                        </label>
                        <textarea
                          value={formData.barriers}
                          onChange={(e) =>
                            updateField("barriers", e.target.value)
                          }
                          rows={2}
                          placeholder="Transportation, childcare, work schedule: tell us and our team will help you plan around it."
                          className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                        />
                      </div>
                    </div>
                  </FormSection>

                  {/* Emergency Contact */}
                  <FormSection icon="spark" title="Emergency Contact">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Contact Name *
                        </label>
                        <Input
                          value={formData.emergencyContactName}
                          onChange={(e) =>
                            updateField("emergencyContactName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Contact Phone *
                        </label>
                        <Input
                          type="tel"
                          value={formData.emergencyContactPhone}
                          onChange={(e) =>
                            updateField("emergencyContactPhone", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </FormSection>

                  {/* Submit Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("program")}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === "confirmation" && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full bg-[#C9A84C]/15 animate-pulse-glow-subtle" aria-hidden />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] flex items-center justify-center text-[#1A1A1A] shadow-[0_0_40px_rgba(201,168,76,0.4)]">
                    <FFIcon name="rocket" className="h-11 w-11" />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Eyebrow>Application Received</Eyebrow>
                </div>

                <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
                  That was the hard part.
                </h2>

                <p className="mt-4 text-[#555555] text-lg max-w-lg mx-auto">
                  Your application to {selectedProgram?.name} is in. A real
                  person will reach out within a week. We save the robots for
                  the workshops.
                </p>

                <div className="mt-8 bg-white rounded-2xl p-6 sm:p-7 border border-[#DDDDDD] text-left max-w-md mx-auto">
                  <h3 className="font-semibold text-[#1A1A1A] mb-4">
                    What happens next
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "A confirmation email lands in your inbox shortly",
                      "Our team reads your application, every word",
                      "We set up a quick call (more conversation than interview)",
                      "You get your acceptance and next steps",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-[#555555]"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#C9A84C] text-[#1A1A1A] text-xs font-bold shrink-0">
                          {index + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild>
                    <Link href="/">Return Home</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/programs">Explore Other Programs</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* What happens next — the flight plan */}
      {step !== "confirmation" && (
        <section className="relative bg-[#141413] py-20 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-starfield opacity-60" aria-hidden />
          <div
            className="aurora-blob absolute -top-32 right-1/4 w-[26rem] h-[26rem] rounded-full bg-[#C9A84C]/10"
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
                <Eyebrow light>What Happens Next</Eyebrow>
              </div>
              <h2 className="mt-5 font-semibold text-white text-3xl sm:text-4xl tracking-tight">
                Three steps. That&apos;s the whole thing.
              </h2>
            </motion.div>

            <div className="mt-12 grid sm:grid-cols-3 gap-6">
              {NEXT_STEPS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-7"
                >
                  <span className="absolute top-5 right-6 text-outline-gold font-bold text-4xl leading-none select-none" aria-hidden>
                    0{i + 1}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E8D48B]">
                    <FFIcon name={item.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-white/60 text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      {step !== "confirmation" && (
        <section className="py-12 bg-[#FBF6E9]">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <p className="text-[#555555]">
              Stuck on a question? Happens to everybody.{" "}
              <Link
                href="/contact"
                className="text-[#A68A2E] font-semibold hover:underline"
              >
                Contact us
              </Link>{" "}
              or call{" "}
              <a
                href="tel:+19518775196"
                className="text-[#A68A2E] font-semibold hover:underline"
              >
                (951) 877-5196
              </a>
            </p>
          </div>
        </section>
      )}
    </>
  );
}
