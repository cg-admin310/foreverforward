"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/shared/badge";
import { PROGRAMS } from "@/lib/constants";
import { routeFormSubmission } from "@/lib/actions/lead-routing";
import { createParticipant } from "@/lib/actions/participants";
import type { ProgramType } from "@/types/database";

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

const enrollablePrograms = PROGRAMS.filter(
  (p) =>
    p.slug === "father-forward" ||
    p.slug === "tech-ready-youth" ||
    p.slug === "from-script-to-screen" ||
    p.slug === "stories-from-my-future"
);

export default function EnrollPage() {
  const [step, setStep] = useState<FormStep>("program");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProgram = PROGRAMS.find((p) => p.slug === formData.program);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Map slug to program type
      const programTypeMap: Record<string, ProgramType> = {
        "father-forward": "father_forward",
        "tech-ready-youth": "tech_ready_youth",
        "from-script-to-screen": "from_script_to_screen",
        "stories-from-my-future": "stories_from_my_future",
        "making-moments": "making_moments",
        "lula": "lula",
      };

      const programType = programTypeMap[formData.program] || "father_forward";

      // Route through unified lead system (creates lead + triggers AI classification)
      const leadResult = await routeFormSubmission({
        formType: "program_enrollment",
        formData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          program: programType,
          programInterest: programType,
          goals: formData.goals,
          barriers: formData.barriers,
          howDidYouHear: formData.howDidYouHear,
          employmentStatus: formData.employmentStatus,
          itExperienceLevel: formData.itExperience,
          parentGuardianName: formData.parentGuardianName,
          parentGuardianPhone: formData.parentGuardianPhone,
          parentGuardianEmail: formData.parentGuardianEmail,
          source: "enrollment_form",
        },
      });

      if (!leadResult.success) {
        console.error("Failed to create lead:", leadResult.error);
        alert("Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Create full participant record with all details
      // (lead routing creates basic participant, but we need full details)
      const participantResult = await createParticipant({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        program: programType,
        addressLine1: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || "CA",
        zipCode: formData.zip || undefined,
        employmentStatus: formData.employmentStatus || undefined,
        itExperienceLevel: formData.itExperience || undefined,
        parentGuardianName: formData.parentGuardianName || undefined,
        parentGuardianPhone: formData.parentGuardianPhone || undefined,
        parentGuardianEmail: formData.parentGuardianEmail || undefined,
        schoolName: formData.schoolName || undefined,
        gradeLevel: formData.gradeLevel || undefined,
        goals: formData.goals || undefined,
        barriers: formData.barriers || undefined,
        emergencyContactName: formData.emergencyContactName || undefined,
        emergencyContactPhone: formData.emergencyContactPhone || undefined,
        howDidYouHear: formData.howDidYouHear || undefined,
      });

      if (participantResult.success) {
        setStep("confirmation");
      } else {
        console.error("Failed to create participant:", participantResult.error);
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
    formData.program === "tech-ready-youth" ||
    formData.program === "from-script-to-screen" ||
    formData.program === "stories-from-my-future";

  const isFatherProgram = formData.program === "father-forward";

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#2D2D2D]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-sm text-white/80 mb-6">
              <GraduationCap className="h-4 w-4 text-[#C9A84C]" />
              Program Enrollment
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Start Your{" "}
              <span className="text-[#C9A84C]">Journey Forward</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
              Take the first step toward building new skills, earning
              certifications, and unlocking new opportunities. We&apos;re here
              to support you every step of the way.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-white border-b border-[#DDDDDD]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4">
            {[
              { key: "program", label: "Select Program", num: 1 },
              { key: "details", label: "Your Details", num: 2 },
              { key: "confirmation", label: "Confirmation", num: 3 },
            ].map((s, index) => (
              <div key={s.key} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                    step === s.key
                      ? "bg-[#C9A84C] text-[#1A1A1A]"
                      : step === "confirmation" ||
                        (step === "details" && s.key === "program")
                      ? "bg-[#5A7247] text-white"
                      : "bg-[#DDDDDD] text-[#888888]"
                  }`}
                >
                  {step === "confirmation" ||
                  (step === "details" && s.key === "program") ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    s.num
                  )}
                </div>
                <span
                  className={`ml-2 text-sm hidden sm:inline ${
                    step === s.key
                      ? "text-[#1A1A1A] font-medium"
                      : "text-[#888888]"
                  }`}
                >
                  {s.label}
                </span>
                {index < 2 && (
                  <div className="w-8 sm:w-16 h-0.5 bg-[#DDDDDD] mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Program Selection */}
            {step === "program" && (
              <motion.div
                key="program"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SectionHeading
                  title="Choose Your Program"
                  subtitle="Select the program that best fits your goals and situation."
                  centered
                />

                <div className="mt-12 space-y-4">
                  {enrollablePrograms.map((program) => (
                    <button
                      key={program.slug}
                      type="button"
                      onClick={() => updateField("program", program.slug)}
                      className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                        formData.program === program.slug
                          ? "border-[#C9A84C] bg-[#FBF6E9]"
                          : "border-[#DDDDDD] bg-white hover:border-[#C9A84C]/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{program.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-[#1A1A1A]">
                              {program.name}
                            </h3>
                            <Badge variant={program.audience} size="sm" />
                          </div>
                          <p className="text-[#555555] text-sm mb-2">
                            {program.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-[#888888]">
                            <span>{program.duration}</span>
                            <span>•</span>
                            <span>{program.format}</span>
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            formData.program === program.slug
                              ? "border-[#C9A84C] bg-[#C9A84C]"
                              : "border-[#DDDDDD]"
                          }`}
                        >
                          {formData.program === program.slug && (
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
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
                  Looking for{" "}
                  <Link
                    href="/programs/making-moments"
                    className="text-[#C9A84C] hover:underline"
                  >
                    Making Moments
                  </Link>{" "}
                  events?{" "}
                  <Link
                    href="/events"
                    className="text-[#C9A84C] hover:underline"
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
                <div className="mb-8 p-4 rounded-lg bg-[#FBF6E9] border border-[#C9A84C]/30">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedProgram?.icon}</span>
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A]">
                        {selectedProgram?.name}
                      </h3>
                      <p className="text-sm text-[#555555]">
                        {selectedProgram?.duration} • {selectedProgram?.format}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep("program")}
                      className="ml-auto text-sm text-[#C9A84C] hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                      <User className="h-5 w-5 text-[#C9A84C]" />
                      Personal Information
                    </h3>

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
                  </div>

                  {/* Address */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                      <MapPin className="h-5 w-5 text-[#C9A84C]" />
                      Address
                    </h3>

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
                  </div>

                  {/* Father Forward Specific Fields */}
                  {isFatherProgram && (
                    <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                        <Briefcase className="h-5 w-5 text-[#C9A84C]" />
                        Background Information
                      </h3>

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
                    </div>
                  )}

                  {/* Youth Program Specific Fields */}
                  {isYouthProgram && (
                    <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                        <Users className="h-5 w-5 text-[#C9A84C]" />
                        Parent/Guardian Information
                      </h3>

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
                    </div>
                  )}

                  {/* Goals & Additional Info */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                      <Rocket className="h-5 w-5 text-[#C9A84C]" />
                      Your Goals
                    </h3>

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
                          placeholder="Tell us about your goals and what success looks like for you..."
                          className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Are there any barriers we should know about?
                        </label>
                        <textarea
                          value={formData.barriers}
                          onChange={(e) =>
                            updateField("barriers", e.target.value)
                          }
                          rows={2}
                          placeholder="Transportation, childcare, work schedule, etc. We're here to help find solutions."
                          className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                      <Phone className="h-5 w-5 text-[#C9A84C]" />
                      Emergency Contact
                    </h3>

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
                  </div>

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
                <div className="w-20 h-20 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-[#5A7247]" />
                </div>

                <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
                  Application Received!
                </h2>

                <p className="text-[#555555] text-lg max-w-lg mx-auto mb-8">
                  Thank you for applying to {selectedProgram?.name}. We&apos;re
                  excited to review your application and will be in touch within
                  3-5 business days.
                </p>

                <div className="bg-white rounded-xl p-6 border border-[#DDDDDD] text-left max-w-md mx-auto mb-8">
                  <h3 className="font-semibold text-[#1A1A1A] mb-4">
                    What Happens Next?
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "You'll receive a confirmation email shortly",
                      "Our team will review your application",
                      "We'll schedule a brief phone or video interview",
                      "You'll receive your acceptance and next steps",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-[#555555]"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#C9A84C] text-white text-xs font-bold shrink-0">
                          {index + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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

      {/* Help Section */}
      {step !== "confirmation" && (
        <section className="py-12 bg-[#FBF6E9]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#555555]">
              Have questions about enrollment?{" "}
              <Link
                href="/contact"
                className="text-[#C9A84C] font-semibold hover:underline"
              >
                Contact us
              </Link>{" "}
              or call{" "}
              <a
                href="tel:+19518775196"
                className="text-[#C9A84C] font-semibold hover:underline"
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
