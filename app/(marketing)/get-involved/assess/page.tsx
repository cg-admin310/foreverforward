"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Heart,
  Laptop,
  Target,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { PROGRAMS } from "@/lib/constants";
import { submitProgramAssessment } from "@/lib/actions/lead-routing";
import type {
  ProgramAssessmentData,
  EmploymentStatus,
  IncomeRange,
  EducationLevel,
  SchedulePreference,
  ITExperienceLevel,
  PrimaryGoal,
  BarrierType,
  ProgramType,
} from "@/types/database";

type FormStep = "about" | "situation" | "tech" | "goals" | "youth" | "results";

interface AssessmentFormData {
  // Step 1: About You
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  isFather: boolean | null;
  numberOfChildren: number;
  childrenAges: string[];

  // Step 2: Current Situation
  currentEmploymentStatus: EmploymentStatus | "";
  monthlyIncomeRange: IncomeRange | "";
  highestEducation: EducationLevel | "";
  barriers: BarrierType[];
  otherBarrier: string;

  // Step 3: Tech Background
  itExperienceLevel: ITExperienceLevel | "";
  hasComputer: boolean | null;
  hasInternet: boolean | null;
  techInterests: string[];

  // Step 4: Goals & Schedule
  primaryGoal: PrimaryGoal | "";
  sixMonthVision: string;
  whatBroughtYouHere: string;
  preferredSchedule: SchedulePreference | "";
  hasReliableTransportation: boolean | null;
  hasChildcareNeeds: boolean | null;

  // Step 5: Youth Info
  isMinor: boolean;
  parentGuardianName: string;
  parentGuardianPhone: string;
  parentGuardianEmail: string;
  schoolName: string;
  gradeLevel: string;
}

const initialFormData: AssessmentFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  isFather: null,
  numberOfChildren: 0,
  childrenAges: [],

  currentEmploymentStatus: "",
  monthlyIncomeRange: "",
  highestEducation: "",
  barriers: [],
  otherBarrier: "",

  itExperienceLevel: "",
  hasComputer: null,
  hasInternet: null,
  techInterests: [],

  primaryGoal: "",
  sixMonthVision: "",
  whatBroughtYouHere: "",
  preferredSchedule: "",
  hasReliableTransportation: null,
  hasChildcareNeeds: null,

  isMinor: false,
  parentGuardianName: "",
  parentGuardianPhone: "",
  parentGuardianEmail: "",
  schoolName: "",
  gradeLevel: "",
};

const STEPS: { id: FormStep; label: string; icon: React.ReactNode }[] = [
  { id: "about", label: "About You", icon: <User className="w-5 h-5" /> },
  { id: "situation", label: "Situation", icon: <Heart className="w-5 h-5" /> },
  { id: "tech", label: "Tech Background", icon: <Laptop className="w-5 h-5" /> },
  { id: "goals", label: "Goals", icon: <Target className="w-5 h-5" /> },
  { id: "youth", label: "Youth Info", icon: <UserCheck className="w-5 h-5" /> },
  { id: "results", label: "Results", icon: <Award className="w-5 h-5" /> },
];

const BARRIER_OPTIONS: { value: BarrierType; label: string }[] = [
  { value: "transportation", label: "Transportation" },
  { value: "childcare", label: "Childcare" },
  { value: "housing", label: "Housing instability" },
  { value: "legal", label: "Legal issues" },
  { value: "health", label: "Health challenges" },
  { value: "financial", label: "Financial stress" },
  { value: "time", label: "Time constraints" },
  { value: "language", label: "Language barriers" },
  { value: "technology_access", label: "Limited tech access" },
];

const TECH_INTEREST_OPTIONS = [
  { value: "it_support", label: "IT Support & Help Desk" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "cloud", label: "Cloud Computing" },
  { value: "ai_automation", label: "AI & Automation" },
  { value: "filmmaking", label: "Filmmaking & Media" },
  { value: "3d_printing", label: "3D Printing & Design" },
  { value: "digital_literacy", label: "General Digital Skills" },
];

const CHILDREN_AGE_OPTIONS = [
  "0-2 (Infant/Toddler)",
  "3-5 (Preschool)",
  "6-10 (Elementary)",
  "11-13 (Middle School)",
  "14-17 (High School)",
  "18+ (Adult)",
];

export default function AssessPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<FormStep>("about");
  const [formData, setFormData] = useState<AssessmentFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{
    leadId: string;
    recommendedPrograms: Array<{
      program: ProgramType;
      fitScore: number;
      reasoning: string;
    }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if minor based on DOB
  useEffect(() => {
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const isMinor = age < 18 || (age === 18 && today < new Date(dob.setFullYear(dob.getFullYear() + 18)));
      setFormData((prev) => ({ ...prev, isMinor }));
    }
  }, [formData.dateOfBirth]);

  const updateField = <K extends keyof AssessmentFormData>(
    field: K,
    value: AssessmentFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleBarrier = (barrier: BarrierType) => {
    setFormData((prev) => ({
      ...prev,
      barriers: prev.barriers.includes(barrier)
        ? prev.barriers.filter((b) => b !== barrier)
        : [...prev.barriers, barrier],
    }));
  };

  const toggleTechInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      techInterests: prev.techInterests.includes(interest)
        ? prev.techInterests.filter((i) => i !== interest)
        : [...prev.techInterests, interest],
    }));
  };

  const toggleChildrenAge = (age: string) => {
    setFormData((prev) => ({
      ...prev,
      childrenAges: prev.childrenAges.includes(age)
        ? prev.childrenAges.filter((a) => a !== age)
        : [...prev.childrenAges, age],
    }));
  };

  const getStepIndex = () => STEPS.findIndex((s) => s.id === step);
  const visibleSteps = formData.isMinor ? STEPS : STEPS.filter((s) => s.id !== "youth");

  const nextStep = () => {
    const currentIndex = getStepIndex();
    const nextIndex = currentIndex + 1;

    // Skip youth step if not a minor
    if (STEPS[nextIndex]?.id === "youth" && !formData.isMinor) {
      setStep("results");
      handleSubmit();
      return;
    }

    if (nextIndex < STEPS.length) {
      if (STEPS[nextIndex].id === "results") {
        handleSubmit();
      }
      setStep(STEPS[nextIndex].id);
    }
  };

  const prevStep = () => {
    const currentIndex = getStepIndex();
    const prevIndex = currentIndex - 1;

    // Skip youth step if not a minor
    if (STEPS[prevIndex]?.id === "youth" && !formData.isMinor) {
      setStep("goals");
      return;
    }

    if (prevIndex >= 0) {
      setStep(STEPS[prevIndex].id);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get UTM params from URL
      const utmParams = {
        utm_source: searchParams.get("utm_source") || undefined,
        utm_medium: searchParams.get("utm_medium") || undefined,
        utm_campaign: searchParams.get("utm_campaign") || undefined,
      };

      const assessmentData: ProgramAssessmentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        isFather: formData.isFather ?? false,
        numberOfChildren: formData.numberOfChildren || undefined,
        childrenAges: formData.childrenAges.length > 0 ? formData.childrenAges : undefined,
        currentEmploymentStatus: formData.currentEmploymentStatus as EmploymentStatus,
        monthlyIncomeRange: formData.monthlyIncomeRange as IncomeRange || undefined,
        highestEducation: formData.highestEducation as EducationLevel,
        barriers: formData.barriers,
        otherBarrier: formData.otherBarrier || undefined,
        itExperienceLevel: formData.itExperienceLevel as ITExperienceLevel,
        hasComputer: formData.hasComputer ?? false,
        hasInternet: formData.hasInternet ?? false,
        techInterests: formData.techInterests,
        primaryGoal: formData.primaryGoal as PrimaryGoal,
        sixMonthVision: formData.sixMonthVision || undefined,
        whatBroughtYouHere: formData.whatBroughtYouHere || undefined,
        preferredSchedule: formData.preferredSchedule as SchedulePreference,
        hasReliableTransportation: formData.hasReliableTransportation ?? false,
        hasChildcareNeeds: formData.hasChildcareNeeds ?? false,
        isMinor: formData.isMinor,
        parentGuardianName: formData.parentGuardianName || undefined,
        parentGuardianPhone: formData.parentGuardianPhone || undefined,
        parentGuardianEmail: formData.parentGuardianEmail || undefined,
        schoolName: formData.schoolName || undefined,
        gradeLevel: formData.gradeLevel || undefined,
        submittedAt: new Date().toISOString(),
        formVersion: "1.0",
      };

      const result = await submitProgramAssessment(assessmentData, utmParams);

      if (result.success && result.data) {
        setResults({
          leadId: result.data.leadId,
          recommendedPrograms: result.data.recommendedPrograms,
        });
        setStep("results");
      } else {
        setError(result.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Assessment submission error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgramDetails = (slug: ProgramType) => {
    const slugMap: Record<ProgramType, string> = {
      father_forward: "father-forward",
      tech_ready_youth: "tech-ready-youth",
      making_moments: "making-moments",
      from_script_to_screen: "from-script-to-screen",
      stories_from_my_future: "stories-from-my-future",
      lula: "lula",
    };
    return PROGRAMS.find((p) => p.slug === slugMap[slug]);
  };

  const canProceed = () => {
    switch (step) {
      case "about":
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.isFather !== null
        );
      case "situation":
        return (
          formData.currentEmploymentStatus &&
          formData.highestEducation
        );
      case "tech":
        return formData.itExperienceLevel && formData.hasComputer !== null && formData.hasInternet !== null;
      case "goals":
        return (
          formData.primaryGoal &&
          formData.preferredSchedule &&
          formData.hasReliableTransportation !== null
        );
      case "youth":
        return (
          !formData.isMinor ||
          (formData.parentGuardianName && formData.parentGuardianPhone && formData.parentGuardianEmail)
        );
      default:
        return true;
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#2D2D2D]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-sm text-white/80 mb-6">
              <Sparkles className="w-4 h-4 text-[#C9A84C]" />
              Find Your Path Forward
            </span>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Program Fit Assessment
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Answer a few questions to help us understand your situation and goals.
              We'll recommend the best programs for your unique journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      {step !== "results" && (
        <div className="bg-[#FAFAF8] border-b border-[#DDDDDD] py-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between overflow-x-auto">
              {visibleSteps.slice(0, -1).map((s, idx) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    s.id === step
                      ? "bg-[#C9A84C]/10 text-[#C9A84C]"
                      : getStepIndex() > idx
                      ? "text-[#5A7247]"
                      : "text-[#888888]"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      s.id === step
                        ? "bg-[#C9A84C] text-black"
                        : getStepIndex() > idx
                        ? "bg-[#5A7247] text-white"
                        : "bg-[#DDDDDD] text-[#888888]"
                    }`}
                  >
                    {getStepIndex() > idx ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className="hidden sm:inline font-medium text-sm whitespace-nowrap">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <section className="py-12 bg-[#FAFAF8]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: About You */}
              {step === "about" && (
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                  <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-6 flex items-center gap-3">
                    <User className="w-6 h-6 text-[#C9A84C]" />
                    About You
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-1">
                          First Name *
                        </label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => updateField("firstName", e.target.value)}
                          placeholder="Your first name"
                          className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-1">
                          Last Name *
                        </label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => updateField("lastName", e.target.value)}
                          placeholder="Your last name"
                          className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-1">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-1">
                          Phone (Optional)
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="(555) 555-5555"
                          className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-1">
                          Date of Birth (Optional)
                        </label>
                        <Input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => updateField("dateOfBirth", e.target.value)}
                          className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-3">
                        Are you a father? *
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => updateField("isFather", true)}
                          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                            formData.isFather === true
                              ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#1A1A1A]"
                              : "border-[#DDDDDD] text-[#555555] hover:border-[#C9A84C]/50"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField("isFather", false)}
                          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                            formData.isFather === false
                              ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#1A1A1A]"
                              : "border-[#DDDDDD] text-[#555555] hover:border-[#C9A84C]/50"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {formData.isFather && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-[#555555] mb-1">
                            How many children?
                          </label>
                          <Input
                            type="number"
                            min="0"
                            value={formData.numberOfChildren || ""}
                            onChange={(e) =>
                              updateField("numberOfChildren", parseInt(e.target.value) || 0)
                            }
                            className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C] w-32"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#555555] mb-2">
                            Children's ages (select all that apply)
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {CHILDREN_AGE_OPTIONS.map((age) => (
                              <button
                                key={age}
                                type="button"
                                onClick={() => toggleChildrenAge(age)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                  formData.childrenAges.includes(age)
                                    ? "bg-[#C9A84C] text-black"
                                    : "bg-[#F5F3EF] text-[#555555] hover:bg-[#E8D48B]/30"
                                }`}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Current Situation */}
              {step === "situation" && (
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                  <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-6 flex items-center gap-3">
                    <Heart className="w-6 h-6 text-[#C9A84C]" />
                    Your Current Situation
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-2">
                        Employment Status *
                      </label>
                      <select
                        value={formData.currentEmploymentStatus}
                        onChange={(e) =>
                          updateField("currentEmploymentStatus", e.target.value as EmploymentStatus)
                        }
                        className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] bg-white"
                      >
                        <option value="">Select your status...</option>
                        <option value="employed_full">Employed Full-Time</option>
                        <option value="employed_part">Employed Part-Time</option>
                        <option value="unemployed_looking">Unemployed - Seeking Work</option>
                        <option value="unemployed_not">Unemployed - Not Seeking</option>
                        <option value="self_employed">Self-Employed</option>
                        <option value="student">Student</option>
                        <option value="retired">Retired</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-2">
                        Monthly Income Range (Optional)
                      </label>
                      <select
                        value={formData.monthlyIncomeRange}
                        onChange={(e) =>
                          updateField("monthlyIncomeRange", e.target.value as IncomeRange)
                        }
                        className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] bg-white"
                      >
                        <option value="">Prefer not to say</option>
                        <option value="under_1000">Under $1,000/month</option>
                        <option value="1000_2500">$1,000 - $2,500/month</option>
                        <option value="2500_5000">$2,500 - $5,000/month</option>
                        <option value="5000_plus">$5,000+/month</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-2">
                        Highest Education Level *
                      </label>
                      <select
                        value={formData.highestEducation}
                        onChange={(e) =>
                          updateField("highestEducation", e.target.value as EducationLevel)
                        }
                        className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] bg-white"
                      >
                        <option value="">Select your education...</option>
                        <option value="less_than_high_school">Less than High School</option>
                        <option value="high_school_ged">High School / GED</option>
                        <option value="some_college">Some College</option>
                        <option value="associates">Associate's Degree</option>
                        <option value="bachelors">Bachelor's Degree</option>
                        <option value="masters_plus">Master's or Higher</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-3">
                        Current Barriers (select all that apply)
                      </label>
                      <p className="text-sm text-[#888888] mb-3">
                        We ask this to connect you with resources. Your answers are confidential.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {BARRIER_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleBarrier(option.value)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium text-left transition-colors ${
                              formData.barriers.includes(option.value)
                                ? "bg-[#5A7247] text-white"
                                : "bg-[#F5F3EF] text-[#555555] hover:bg-[#EFF4EB]"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>

                      {formData.barriers.includes("other" as BarrierType) && (
                        <Input
                          placeholder="Please describe..."
                          value={formData.otherBarrier}
                          onChange={(e) => updateField("otherBarrier", e.target.value)}
                          className="mt-3 border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Tech Background */}
              {step === "tech" && (
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                  <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-6 flex items-center gap-3">
                    <Laptop className="w-6 h-6 text-[#C9A84C]" />
                    Tech Background
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-2">
                        IT/Tech Experience Level *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "none", label: "None", desc: "New to tech" },
                          { value: "basic", label: "Basic", desc: "Can use email, browse web" },
                          { value: "intermediate", label: "Intermediate", desc: "Comfortable with software" },
                          { value: "advanced", label: "Advanced", desc: "IT background" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateField("itExperienceLevel", option.value as ITExperienceLevel)}
                            className={`p-4 rounded-lg border-2 text-left transition-colors ${
                              formData.itExperienceLevel === option.value
                                ? "border-[#C9A84C] bg-[#C9A84C]/10"
                                : "border-[#DDDDDD] hover:border-[#C9A84C]/50"
                            }`}
                          >
                            <div className="font-medium text-[#1A1A1A]">{option.label}</div>
                            <div className="text-xs text-[#888888] mt-1">{option.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-3">
                          Do you have access to a computer? *
                        </label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => updateField("hasComputer", true)}
                            className={`flex-1 py-2.5 px-4 rounded-lg border-2 font-medium transition-colors ${
                              formData.hasComputer === true
                                ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#1A1A1A]"
                                : "border-[#DDDDDD] text-[#555555] hover:border-[#C9A84C]/50"
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => updateField("hasComputer", false)}
                            className={`flex-1 py-2.5 px-4 rounded-lg border-2 font-medium transition-colors ${
                              formData.hasComputer === false
                                ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#1A1A1A]"
                                : "border-[#DDDDDD] text-[#555555] hover:border-[#C9A84C]/50"
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-3">
                          Reliable internet access? *
                        </label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => updateField("hasInternet", true)}
                            className={`flex-1 py-2.5 px-4 rounded-lg border-2 font-medium transition-colors ${
                              formData.hasInternet === true
                                ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#1A1A1A]"
                                : "border-[#DDDDDD] text-[#555555] hover:border-[#C9A84C]/50"
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => updateField("hasInternet", false)}
                            className={`flex-1 py-2.5 px-4 rounded-lg border-2 font-medium transition-colors ${
                              formData.hasInternet === false
                                ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#1A1A1A]"
                                : "border-[#DDDDDD] text-[#555555] hover:border-[#C9A84C]/50"
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-3">
                        What tech areas interest you? (select all that apply)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TECH_INTEREST_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleTechInterest(option.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              formData.techInterests.includes(option.value)
                                ? "bg-[#C9A84C] text-black"
                                : "bg-[#F5F3EF] text-[#555555] hover:bg-[#E8D48B]/30"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Goals & Schedule */}
              {step === "goals" && (
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                  <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-6 flex items-center gap-3">
                    <Target className="w-6 h-6 text-[#C9A84C]" />
                    Your Goals
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-3">
                        What's your primary goal? *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "career_change", label: "Career Change to Tech", icon: "💼" },
                          { value: "certification", label: "Earn IT Certification", icon: "📜" },
                          { value: "skills_upgrade", label: "Upgrade My Skills", icon: "📈" },
                          { value: "employment", label: "Find Employment", icon: "🎯" },
                          { value: "personal_growth", label: "Personal Growth", icon: "🌱" },
                          { value: "help_family", label: "Help My Family", icon: "👨‍👩‍👧" },
                          { value: "creative_expression", label: "Creative Expression", icon: "🎨" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateField("primaryGoal", option.value as PrimaryGoal)}
                            className={`p-3 rounded-lg border-2 text-left transition-colors ${
                              formData.primaryGoal === option.value
                                ? "border-[#C9A84C] bg-[#C9A84C]/10"
                                : "border-[#DDDDDD] hover:border-[#C9A84C]/50"
                            }`}
                          >
                            <span className="text-lg mr-2">{option.icon}</span>
                            <span className="text-sm font-medium text-[#1A1A1A]">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-1">
                        Where do you see yourself in 6 months? (Optional)
                      </label>
                      <textarea
                        value={formData.sixMonthVision}
                        onChange={(e) => updateField("sixMonthVision", e.target.value)}
                        placeholder="Describe your ideal situation..."
                        rows={3}
                        className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-1">
                        What brought you to Forever Forward? (Optional)
                      </label>
                      <textarea
                        value={formData.whatBroughtYouHere}
                        onChange={(e) => updateField("whatBroughtYouHere", e.target.value)}
                        placeholder="Share your story..."
                        rows={3}
                        className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-2">
                        Preferred Schedule *
                      </label>
                      <select
                        value={formData.preferredSchedule}
                        onChange={(e) =>
                          updateField("preferredSchedule", e.target.value as SchedulePreference)
                        }
                        className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] bg-white"
                      >
                        <option value="">Select your availability...</option>
                        <option value="weekday_morning">Weekday Mornings</option>
                        <option value="weekday_afternoon">Weekday Afternoons</option>
                        <option value="weekday_evening">Weekday Evenings</option>
                        <option value="weekend">Weekends</option>
                        <option value="flexible">Flexible / Self-paced</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-3">
                          Reliable transportation? *
                        </label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => updateField("hasReliableTransportation", true)}
                            className={`flex-1 py-2.5 px-4 rounded-lg border-2 font-medium transition-colors ${
                              formData.hasReliableTransportation === true
                                ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#1A1A1A]"
                                : "border-[#DDDDDD] text-[#555555] hover:border-[#C9A84C]/50"
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => updateField("hasReliableTransportation", false)}
                            className={`flex-1 py-2.5 px-4 rounded-lg border-2 font-medium transition-colors ${
                              formData.hasReliableTransportation === false
                                ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#1A1A1A]"
                                : "border-[#DDDDDD] text-[#555555] hover:border-[#C9A84C]/50"
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-3">
                          Need childcare support?
                        </label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => updateField("hasChildcareNeeds", true)}
                            className={`flex-1 py-2.5 px-4 rounded-lg border-2 font-medium transition-colors ${
                              formData.hasChildcareNeeds === true
                                ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#1A1A1A]"
                                : "border-[#DDDDDD] text-[#555555] hover:border-[#C9A84C]/50"
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => updateField("hasChildcareNeeds", false)}
                            className={`flex-1 py-2.5 px-4 rounded-lg border-2 font-medium transition-colors ${
                              formData.hasChildcareNeeds === false
                                ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#1A1A1A]"
                                : "border-[#DDDDDD] text-[#555555] hover:border-[#C9A84C]/50"
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Youth Info (conditional) */}
              {step === "youth" && formData.isMinor && (
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                  <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-6 flex items-center gap-3">
                    <UserCheck className="w-6 h-6 text-[#C9A84C]" />
                    Parent/Guardian Information
                  </h2>

                  <p className="text-sm text-[#888888] mb-6">
                    Since you are under 18, we need your parent or guardian's contact information.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-1">
                        Parent/Guardian Name *
                      </label>
                      <Input
                        value={formData.parentGuardianName}
                        onChange={(e) => updateField("parentGuardianName", e.target.value)}
                        placeholder="Full name"
                        className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-1">
                          Phone *
                        </label>
                        <Input
                          type="tel"
                          value={formData.parentGuardianPhone}
                          onChange={(e) => updateField("parentGuardianPhone", e.target.value)}
                          placeholder="(555) 555-5555"
                          className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-1">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={formData.parentGuardianEmail}
                          onChange={(e) => updateField("parentGuardianEmail", e.target.value)}
                          placeholder="parent@email.com"
                          className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-1">
                          School Name (Optional)
                        </label>
                        <Input
                          value={formData.schoolName}
                          onChange={(e) => updateField("schoolName", e.target.value)}
                          placeholder="Your school"
                          className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-1">
                          Grade Level (Optional)
                        </label>
                        <select
                          value={formData.gradeLevel}
                          onChange={(e) => updateField("gradeLevel", e.target.value)}
                          className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] bg-white"
                        >
                          <option value="">Select grade...</option>
                          <option value="9">9th Grade</option>
                          <option value="10">10th Grade</option>
                          <option value="11">11th Grade</option>
                          <option value="12">12th Grade</option>
                          <option value="college">College</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Results */}
              {step === "results" && (
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                  {isSubmitting ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 text-[#C9A84C] animate-spin mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                        Analyzing Your Assessment...
                      </h3>
                      <p className="text-[#888888]">
                        Our AI is finding the best programs for you
                      </p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                        Something went wrong
                      </h3>
                      <p className="text-[#888888] mb-6">{error}</p>
                      <Button onClick={() => setStep("goals")}>
                        Try Again
                      </Button>
                    </div>
                  ) : results ? (
                    <div>
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#5A7247]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-8 h-8 text-[#5A7247]" />
                        </div>
                        <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                          Your Recommended Programs
                        </h2>
                        <p className="text-[#888888]">
                          Based on your assessment, here are the programs that best match your goals
                        </p>
                      </div>

                      <div className="space-y-4">
                        {results.recommendedPrograms.map((rec, idx) => {
                          const program = getProgramDetails(rec.program);
                          if (!program) return null;

                          return (
                            <motion.div
                              key={rec.program}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className={`p-5 rounded-xl border-2 ${
                                idx === 0
                                  ? "border-[#C9A84C] bg-[#C9A84C]/5"
                                  : "border-[#DDDDDD] bg-[#FAFAF8]"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl">{program.icon}</span>
                                    <h3 className="text-lg font-semibold text-[#1A1A1A]">
                                      {program.name}
                                    </h3>
                                    {idx === 0 && (
                                      <span className="px-2 py-0.5 bg-[#C9A84C] text-black text-xs font-semibold rounded-full">
                                        Best Match
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-[#C9A84C] font-medium">
                                    {program.tagline}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-[#1A1A1A]">
                                    {rec.fitScore}%
                                  </div>
                                  <div className="text-xs text-[#888888]">Fit Score</div>
                                </div>
                              </div>

                              <p className="text-sm text-[#555555] mb-4">{rec.reasoning}</p>

                              <div className="flex items-center gap-4 text-sm text-[#888888] mb-4">
                                <span>{program.duration}</span>
                                <span>•</span>
                                <span>{program.format}</span>
                              </div>

                              <Link
                                href={`/get-involved/enroll?program=${program.slug}`}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                  idx === 0
                                    ? "bg-[#C9A84C] text-black hover:bg-[#A68A2E]"
                                    : "bg-[#1A1A1A] text-white hover:bg-[#2D2D2D]"
                                }`}
                              >
                                Enroll in {program.name}
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>

                      <div className="mt-8 p-4 bg-[#EFF4EB] rounded-lg">
                        <p className="text-sm text-[#5A7247]">
                          <strong>Not sure which to choose?</strong> Our team will reach out within
                          24 hours to discuss your options and answer any questions.
                        </p>
                      </div>

                      <div className="mt-6 text-center">
                        <Link
                          href="/contact"
                          className="text-[#C9A84C] hover:underline font-medium"
                        >
                          Have questions? Contact us →
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {step !== "results" && (
            <div className="flex justify-between mt-6">
              {step !== "about" ? (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="border-[#DDDDDD] text-[#555555] hover:bg-[#F5F3EF]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              <Button
                onClick={nextStep}
                disabled={!canProceed() || isSubmitting}
                className="bg-[#C9A84C] text-black hover:bg-[#A68A2E] disabled:opacity-50"
              >
                {step === "goals" || (step === "youth" && formData.isMinor)
                  ? "See My Results"
                  : "Continue"}
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 ml-2" />
                )}
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
