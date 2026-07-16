"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { generateCourse } from "@/lib/actions/course-ai";
import { createCourse } from "@/lib/actions/courses";
import type { CourseLevel } from "@/types/database";

export default function NewCoursePage() {
  const router = useRouter();
  const search = useSearchParams();
  const blank = search.get("mode") === "blank";

  const [brief, setBrief] = useState("");
  const [audience, setAudience] = useState("");
  const [level, setLevel] = useState<CourseLevel>("intro");
  const [lessonCount, setLessonCount] = useState(4);
  const [quizCount, setQuizCount] = useState(5);
  const [outline, setOutline] = useState("");
  const [ownLesson, setOwnLesson] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    const res = await generateCourse({
      brief,
      audience: audience || "General",
      level,
      lessonCount,
      quizCount,
      outline: outline || undefined,
      ownLesson: ownLesson || undefined,
    });
    if (res.success && res.data) {
      router.push(`/courses/${res.data.id}`);
    } else {
      setError(res.error ?? "Something went wrong");
      setLoading(false);
    }
  };

  const handleBlank = async () => {
    setError(null);
    setLoading(true);
    const res = await createCourse({ title: title || "Untitled course", audience, level });
    if (res.success && res.data) {
      router.push(`/courses/${res.data.id}`);
    } else {
      setError(res.error ?? "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#5A7247] hover:text-[#3D5030]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">
          {blank ? "New blank course" : "Create a course with AI"}
        </h1>
        <p className="text-[#555555] mt-1">
          {blank
            ? "Start empty and add lessons and questions yourself."
            : "Describe the course in plain language. The AI writes a story-driven, real-world course with lessons, a workbook, and a quiz for you to review."}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="rounded-2xl border border-[#DDDDDD] bg-white p-6 space-y-5">
        {blank ? (
          <Field label="Course title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Home Networking Basics"
              className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none"
            />
          </Field>
        ) : (
          <Field
            label="What should this course teach?"
            hint="Include the topic, the goal, and who it's for. Be specific about the real-world task."
          >
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={4}
              placeholder="e.g. I want to create a course for kids 14-18 to teach basic networking and how to set up a home network so a PS5 works in one room, an Xbox in another, plus Wi-Fi for the house and guests. They should understand networks, subnets, cables (the physical layer), and how wireless works at a high level."
              className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none"
            />
          </Field>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Audience">
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Kids 14-18"
              className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none"
            />
          </Field>
          <Field label="Level">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as CourseLevel)}
              className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none"
            >
              <option value="intro">Intro</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </Field>
        </div>

        {!blank && (
          <>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Number of lessons">
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={lessonCount}
                  onChange={(e) => setLessonCount(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none"
                />
              </Field>
              <Field label="Quiz questions">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={quizCount}
                  onChange={(e) => setQuizCount(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none"
                />
              </Field>
            </div>
            <Field label="Outline (optional)" hint="Give the AI section points to expand, one per line.">
              <textarea
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none"
              />
            </Field>
            <Field label="Your own lesson content (optional)" hint="Paste a lesson you wrote; the AI will fit it in.">
              <textarea
                value={ownLesson}
                onChange={(e) => setOwnLesson(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none"
              />
            </Field>
          </>
        )}

        <div className="pt-2">
          <button
            onClick={blank ? handleBlank : handleGenerate}
            disabled={loading || (blank ? !title : brief.trim().length < 8)}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] px-5 py-3 text-sm font-semibold text-[#1A1A1A] disabled:opacity-50 hover:shadow-[0_0_24px_rgba(201,168,76,0.35)] transition-shadow"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {blank ? "Creating..." : "Writing your course..."}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {blank ? "Create course" : "Generate course"}
              </>
            )}
          </button>
          {!blank && (
            <p className="mt-3 text-xs text-[#888888]">
              This can take up to a minute. You&rsquo;ll land on the editor to review and tweak
              before publishing.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">{label}</label>
      {hint && <p className="text-xs text-[#888888] mb-2">{hint}</p>}
      {children}
    </div>
  );
}
