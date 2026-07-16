"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Bot,
} from "lucide-react";
import {
  updateCourse,
  saveLesson,
  deleteLesson,
  saveQuestion,
  deleteQuestion,
  assignCourseToProgram,
  unassignCourse,
  deleteCourse,
  type CourseDetail,
} from "@/lib/actions/courses";
import { ALL_PROGRAM_TYPES, programLabel } from "@/lib/lms";
import type { CourseLevel, CourseStatus, ProgramType } from "@/types/database";

export function CourseEditor({ detail }: { detail: CourseDetail }) {
  const router = useRouter();
  const { course, lessons, questions, assignments } = detail;
  const [pending, startTransition] = useTransition();
  const refresh = () => startTransition(() => router.refresh());

  const [title, setTitle] = useState(course.title);
  const [summary, setSummary] = useState(course.summary ?? "");
  const [audience, setAudience] = useState(course.audience ?? "");
  const [level, setLevel] = useState<CourseLevel>(course.level);
  const [minutes, setMinutes] = useState(course.estimated_minutes ?? 0);
  const [threshold, setThreshold] = useState(course.pass_threshold);
  const [savedMeta, setSavedMeta] = useState(false);

  const saveMeta = async () => {
    await updateCourse(course.id, {
      title,
      summary,
      audience,
      level,
      estimated_minutes: minutes || null,
      pass_threshold: threshold,
    });
    setSavedMeta(true);
    setTimeout(() => setSavedMeta(false), 1500);
    refresh();
  };

  const togglePublish = async () => {
    const next: CourseStatus = course.status === "published" ? "draft" : "published";
    await updateCourse(course.id, { status: next });
    refresh();
  };

  const removeCourse = async () => {
    if (!confirm("Delete this course and everything in it? This cannot be undone.")) return;
    await deleteCourse(course.id);
    router.push("/courses");
  };

  const unassignedPrograms = ALL_PROGRAM_TYPES.filter(
    (p) => !assignments.some((a) => a.program === p)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5A7247] hover:text-[#3D5030]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </Link>
        <div className="flex items-center gap-3">
          {course.ai_generated && (
            <span className="inline-flex items-center gap-1 text-xs text-[#A68A2E]">
              <Bot className="h-3.5 w-3.5" /> AI-generated
            </span>
          )}
          <button
            onClick={togglePublish}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              course.status === "published"
                ? "bg-[#EFF4EB] text-[#3D5030] border border-[#7A9A63]/40"
                : "bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] text-[#1A1A1A]"
            }`}
          >
            {course.status === "published" ? "Published — unpublish" : "Publish"}
          </button>
        </div>
      </div>

      {/* Metadata */}
      <Card title="Course details">
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2.5 text-lg font-semibold focus:border-[#C9A84C] focus:outline-none"
          />
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            placeholder="One-line summary of what learners will be able to do."
            className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none"
          />
          <div className="grid sm:grid-cols-4 gap-3">
            <LabeledInput label="Audience">
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none"
              />
            </LabeledInput>
            <LabeledInput label="Level">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as CourseLevel)}
                className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none"
              >
                <option value="intro">Intro</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </LabeledInput>
            <LabeledInput label="Minutes">
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none"
              />
            </LabeledInput>
            <LabeledInput label="Pass %">
              <input
                type="number"
                min={0}
                max={100}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none"
              />
            </LabeledInput>
          </div>
          <button
            onClick={saveMeta}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-4 py-2 text-sm font-semibold text-[#E8D48B] hover:bg-[#2D2D2D]"
          >
            {savedMeta ? <Check className="h-4 w-4" /> : null}
            {savedMeta ? "Saved" : "Save details"}
          </button>
        </div>
      </Card>

      {/* Program assignments */}
      <Card title="Assigned programs" subtitle="Members of these programs can take this course. Each assignment is a separate instance.">
        <div className="flex flex-wrap gap-2 mb-4">
          {assignments.length === 0 && (
            <p className="text-sm text-[#888888]">Not assigned to any program yet.</p>
          )}
          {assignments.map((a) => (
            <span
              key={a.id}
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/40 bg-[#FBF6E9] px-3 py-1.5 text-sm font-semibold text-[#A68A2E]"
            >
              {programLabel(a.program)}
              <button
                onClick={async () => {
                  await unassignCourse(a.id, course.id);
                  refresh();
                }}
                className="text-[#A68A2E]/60 hover:text-red-500"
                title="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        {unassignedPrograms.length > 0 && (
          <AddProgram
            programs={unassignedPrograms}
            onAdd={async (p) => {
              await assignCourseToProgram(course.id, p);
              refresh();
            }}
          />
        )}
      </Card>

      {/* Lessons */}
      <Card title={`Lessons (${lessons.length})`}>
        <div className="space-y-3">
          {lessons.map((l) => (
            <LessonRow key={l.id} lesson={l} onChange={refresh} />
          ))}
          <NewLesson courseId={course.id} nextPos={lessons.length} onChange={refresh} />
        </div>
      </Card>

      {/* Quiz */}
      <Card title={`Quiz questions (${questions.length})`}>
        <div className="space-y-3">
          {questions.map((q) => (
            <QuestionRow key={q.id} question={q} onChange={refresh} />
          ))}
          <NewQuestion courseId={course.id} nextPos={questions.length} onChange={refresh} />
        </div>
      </Card>

      <div className="pt-4">
        <button
          onClick={removeCourse}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" /> Delete course
        </button>
      </div>

      {pending && (
        <div className="fixed bottom-4 right-4 inline-flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-3 py-2 text-xs text-white">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
        </div>
      )}
    </div>
  );
}

/* --------------------------------- pieces -------------------------------- */

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#DDDDDD] bg-white p-6">
      <h2 className="text-lg font-semibold text-[#1A1A1A]">{title}</h2>
      {subtitle && <p className="text-sm text-[#888888] mt-0.5 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </div>
  );
}

function LabeledInput({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#888888] uppercase tracking-wide mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function AddProgram({
  programs,
  onAdd,
}: {
  programs: ProgramType[];
  onAdd: (p: ProgramType) => Promise<void>;
}) {
  const [value, setValue] = useState<ProgramType | "">("");
  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value as ProgramType)}
        className="rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none"
      >
        <option value="">Add a program…</option>
        {programs.map((p) => (
          <option key={p} value={p}>
            {programLabel(p)}
          </option>
        ))}
      </select>
      <button
        disabled={!value}
        onClick={() => value && onAdd(value)}
        className="inline-flex items-center gap-1 rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm font-semibold text-[#1A1A1A] disabled:opacity-40 hover:border-[#C9A84C]/60"
      >
        <Plus className="h-4 w-4" /> Assign
      </button>
    </div>
  );
}

function LessonRow({
  lesson,
  onChange,
}: {
  lesson: CourseDetail["lessons"][number];
  onChange: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [story, setStory] = useState(lesson.story_body ?? "");
  const [workbook, setWorkbook] = useState(lesson.workbook ?? "");
  const [saving, setSaving] = useState(false);

  return (
    <div className="rounded-xl border border-[#EEEEEE]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 p-3 text-left"
      >
        <span className="font-medium text-[#1A1A1A] truncate">
          {lesson.position + 1}. {title || "Untitled lesson"}
        </span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && (
        <div className="border-t border-[#EEEEEE] p-3 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm font-semibold focus:border-[#C9A84C] focus:outline-none"
          />
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={8}
            placeholder="The story-driven lesson (Markdown)"
            className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm font-mono focus:border-[#C9A84C] focus:outline-none"
          />
          <textarea
            value={workbook}
            onChange={(e) => setWorkbook(e.target.value)}
            rows={4}
            placeholder="Workbook / key takeaways (Markdown)"
            className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm font-mono focus:border-[#C9A84C] focus:outline-none"
          />
          <div className="flex items-center justify-between">
            <button
              onClick={async () => {
                setSaving(true);
                await saveLesson({
                  id: lesson.id,
                  course_id: lesson.course_id,
                  position: lesson.position,
                  title,
                  story_body: story,
                  workbook,
                });
                setSaving(false);
                onChange();
              }}
              className="rounded-lg bg-[#1A1A1A] px-4 py-2 text-sm font-semibold text-[#E8D48B]"
            >
              {saving ? "Saving…" : "Save lesson"}
            </button>
            <button
              onClick={async () => {
                if (!confirm("Delete this lesson?")) return;
                await deleteLesson(lesson.id, lesson.course_id);
                onChange();
              }}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NewLesson({
  courseId,
  nextPos,
  onChange,
}: {
  courseId: string;
  nextPos: number;
  onChange: () => void;
}) {
  const [adding, setAdding] = useState(false);
  return (
    <button
      onClick={async () => {
        setAdding(true);
        await saveLesson({ course_id: courseId, position: nextPos, title: "New lesson" });
        setAdding(false);
        onChange();
      }}
      className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#C9A84C]/50 px-4 py-2.5 text-sm font-semibold text-[#A68A2E] hover:bg-[#FBF6E9]"
    >
      <Plus className="h-4 w-4" /> {adding ? "Adding…" : "Add lesson"}
    </button>
  );
}

function QuestionRow({
  question,
  onChange,
}: {
  question: CourseDetail["questions"][number];
  onChange: () => void;
}) {
  const [prompt, setPrompt] = useState(question.prompt);
  const [options, setOptions] = useState<string[]>(
    question.options.length ? question.options : ["", "", "", ""]
  );
  const [correct, setCorrect] = useState(question.correct_index);
  const [explanation, setExplanation] = useState(question.explanation ?? "");

  return (
    <div className="rounded-xl border border-[#EEEEEE] p-3 space-y-2">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={2}
        placeholder="Question"
        className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none"
      />
      <div className="space-y-1.5">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => setCorrect(i)}
              title="Mark correct"
              className={`h-5 w-5 shrink-0 rounded-full border flex items-center justify-center ${
                correct === i ? "bg-[#7A9A63] border-[#3D5030]" : "border-[#DDDDDD]"
              }`}
            >
              {correct === i && <Check className="h-3 w-3 text-white" />}
            </button>
            <input
              value={opt}
              onChange={(e) => {
                const next = [...options];
                next[i] = e.target.value;
                setOptions(next);
              }}
              placeholder={`Option ${i + 1}`}
              className="flex-1 rounded-lg border border-[#DDDDDD] px-3 py-1.5 text-sm focus:border-[#C9A84C] focus:outline-none"
            />
          </div>
        ))}
      </div>
      <input
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        placeholder="Why the correct answer is right (optional)"
        className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none"
      />
      <div className="flex items-center justify-between">
        <button
          onClick={async () => {
            await saveQuestion({
              id: question.id,
              course_id: question.course_id,
              position: question.position,
              prompt,
              options: options.filter((o) => o.trim() !== ""),
              correct_index: correct,
              explanation,
            });
            onChange();
          }}
          className="rounded-lg bg-[#1A1A1A] px-4 py-2 text-sm font-semibold text-[#E8D48B]"
        >
          Save question
        </button>
        <button
          onClick={async () => {
            if (!confirm("Delete this question?")) return;
            await deleteQuestion(question.id, question.course_id);
            onChange();
          }}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function NewQuestion({
  courseId,
  nextPos,
  onChange,
}: {
  courseId: string;
  nextPos: number;
  onChange: () => void;
}) {
  return (
    <button
      onClick={async () => {
        await saveQuestion({
          course_id: courseId,
          position: nextPos,
          prompt: "New question",
          options: ["", "", "", ""],
          correct_index: 0,
        });
        onChange();
      }}
      className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#C9A84C]/50 px-4 py-2.5 text-sm font-semibold text-[#A68A2E] hover:bg-[#FBF6E9]"
    >
      <Plus className="h-4 w-4" /> Add question
    </button>
  );
}
