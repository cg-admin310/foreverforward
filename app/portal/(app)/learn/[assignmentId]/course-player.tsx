"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  BookOpen,
  Trophy,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { markLessonComplete, submitQuiz, type CoursePlayerData, type QuizResult } from "@/lib/actions/portal";

type View = "lessons" | "quiz" | "result";

export function CoursePlayer({ data }: { data: CoursePlayerData }) {
  const { lessons, questions } = data;
  const [view, setView] = useState<View>("lessons");
  const [index, setIndex] = useState(() => {
    // resume at the first incomplete lesson
    const doneSet = new Set(data.progress.completedLessonIds);
    const firstIncomplete = lessons.findIndex((l) => !doneSet.has(l.id));
    return firstIncomplete === -1 ? Math.max(0, lessons.length - 1) : firstIncomplete;
  });
  const [savingLesson, setSavingLesson] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalLessons = lessons.length;
  const lesson = lessons[index];

  const nextFromLesson = async () => {
    setSavingLesson(true);
    if (lesson) await markLessonComplete(data.assignmentId, lesson.id);
    setSavingLesson(false);
    if (index < totalLessons - 1) {
      setIndex(index + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (questions.length > 0) {
      setView("quiz");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setView("result");
    }
  };

  const submit = async () => {
    setSubmitting(true);
    const res = await submitQuiz(data.assignmentId, answers);
    setSubmitting(false);
    if (res.success && res.data) {
      setResult(res.data);
      setView("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/portal"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#5A7247] hover:text-[#3D5030]"
      >
        <ArrowLeft className="h-4 w-4" /> My Learning
      </Link>

      <div className="mt-4 mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A68A2E]">
          {data.programLabel}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[#1A1A1A]">{data.course.title}</h1>
      </div>

      {/* progress rail */}
      {view === "lessons" && totalLessons > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-[#888888] mb-1.5">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" /> Lesson {index + 1} of {totalLessons}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#EEEEEE] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] transition-all"
              style={{ width: `${((index + 1) / totalLessons) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* LESSONS */}
      {view === "lessons" && lesson && (
        <article className="rounded-2xl border border-[#DDDDDD] bg-white p-6 sm:p-8">
          {lesson.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={lesson.image_url}
              alt=""
              className="mb-6 w-full rounded-xl object-cover max-h-64"
            />
          )}
          <h2 className="text-xl font-bold text-[#1A1A1A]">{lesson.title}</h2>
          <div className="mt-4">
            <Markdown text={lesson.story_body ?? ""} />
          </div>
          {lesson.workbook && (
            <div className="mt-6 rounded-xl border border-[#C9A84C]/30 bg-[#FBF6E9] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A68A2E] mb-2">
                Workbook
              </p>
              <Markdown text={lesson.workbook} />
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setIndex(Math.max(0, index - 1))}
              disabled={index === 0}
              className="text-sm font-semibold text-[#888888] disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={nextFromLesson}
              disabled={savingLesson}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] px-5 py-3 text-sm font-semibold text-[#1A1A1A] disabled:opacity-60"
            >
              {savingLesson ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {index < totalLessons - 1
                ? "Mark done & continue"
                : questions.length > 0
                ? "Finish & take the quiz"
                : "Finish course"}
            </button>
          </div>
        </article>
      )}

      {/* QUIZ */}
      {view === "quiz" && (
        <div className="space-y-5">
          <p className="text-[#555555]">Answer these to complete the course.</p>
          {questions.map((q, qi) => (
            <div key={q.id} className="rounded-2xl border border-[#DDDDDD] bg-white p-6">
              <p className="font-semibold text-[#1A1A1A]">
                {qi + 1}. {q.prompt}
              </p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[q.id] === oi;
                  return (
                    <button
                      key={oi}
                      onClick={() => setAnswers({ ...answers, [q.id]: oi })}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                        selected
                          ? "border-[#C9A84C] bg-[#FBF6E9]"
                          : "border-[#DDDDDD] hover:border-[#C9A84C]/50"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 shrink-0 rounded-full border ${
                          selected ? "border-[#C9A84C] bg-[#C9A84C]" : "border-[#CCCCCC]"
                        }`}
                      />
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <button
            onClick={submit}
            disabled={submitting || Object.keys(answers).length < questions.length}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-6 py-3 text-sm font-semibold text-[#E8D48B] disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Submit answers
          </button>
        </div>
      )}

      {/* RESULT */}
      {view === "result" && (
        <div className="rounded-2xl border border-[#DDDDDD] bg-white p-8 text-center">
          {result ? (
            <>
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  result.passed ? "bg-[#EFF4EB]" : "bg-[#FBEBEB]"
                }`}
              >
                {result.passed ? (
                  <Trophy className="h-8 w-8 text-[#3D5030]" />
                ) : (
                  <RotateCcw className="h-8 w-8 text-[#9B3B3B]" />
                )}
              </div>
              <h2 className="mt-4 text-2xl font-bold text-[#1A1A1A]">
                {result.passed ? "You passed!" : "Almost there"}
              </h2>
              <p className="mt-1 text-[#555555]">
                You scored {result.score} of {result.total}.
                {result.passed ? " Course complete." : " Review and try again."}
              </p>

              <div className="mt-6 space-y-2 text-left">
                {questions.map((q, qi) => {
                  const pq = result.perQuestion.find((p) => p.id === q.id);
                  const correct = pq?.correct;
                  return (
                    <div
                      key={q.id}
                      className="flex items-start gap-2 rounded-lg border border-[#EEEEEE] p-3"
                    >
                      {correct ? (
                        <CheckCircle2 className="h-5 w-5 text-[#3D5030] shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-[#9B3B3B] shrink-0" />
                      )}
                      <div className="text-sm">
                        <p className="font-medium text-[#1A1A1A]">
                          {qi + 1}. {q.prompt}
                        </p>
                        {!correct && pq && (
                          <p className="mt-1 text-[#555555]">
                            Correct answer: <strong>{q.options[pq.correctIndex]}</strong>
                            {pq.explanation ? ` — ${pq.explanation}` : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                {!result.passed && (
                  <button
                    onClick={() => {
                      setAnswers({});
                      setResult(null);
                      setView("quiz");
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] px-5 py-2.5 text-sm font-semibold text-[#1A1A1A]"
                  >
                    <RotateCcw className="h-4 w-4" /> Try again
                  </button>
                )}
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#DDDDDD] px-5 py-2.5 text-sm font-semibold text-[#1A1A1A]"
                >
                  Back to My Learning
                </Link>
              </div>
            </>
          ) : (
            <>
              <Trophy className="mx-auto h-12 w-12 text-[#C9A84C]" />
              <h2 className="mt-4 text-2xl font-bold text-[#1A1A1A]">Course complete</h2>
              <p className="mt-1 text-[#555555]">Nice work getting through it.</p>
              <Link
                href="/portal"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] px-5 py-2.5 text-sm font-semibold text-[#1A1A1A]"
              >
                Back to My Learning
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ------- tiny, safe Markdown renderer (headings, bold, bullets, paras) ---- */
function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-3 text-[#333333] leading-relaxed">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        const h = block.match(/^(#{1,3})\s+(.*)$/);
        if (h) {
          const level = h[1].length;
          const cls =
            level === 1
              ? "text-lg font-bold text-[#1A1A1A]"
              : level === 2
              ? "text-base font-bold text-[#1A1A1A]"
              : "text-sm font-semibold text-[#1A1A1A]";
          return (
            <p key={i} className={cls}>
              {inline(h[2])}
            </p>
          );
        }
        return <p key={i}>{inline(block.replace(/\n/g, " "))}</p>;
      })}
    </div>
  );
}

function inline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    /^\*\*[^*]+\*\*$/.test(p) ? (
      <strong key={i} className="font-semibold text-[#1A1A1A]">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}
