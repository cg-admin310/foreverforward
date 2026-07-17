"use client";

import Link from "next/link";
import { ArrowLeft, Eye, CheckCircle2, Clock } from "lucide-react";
import { lmsProgramLabel } from "@/lib/lms";
import type { CourseDetail } from "@/lib/actions/courses";

/**
 * A read-only rendering of a course exactly the way a member reads it (lessons +
 * workbook), plus the quiz with the correct answers marked, for staff review.
 */
export function CoursePreview({ detail }: { detail: CourseDetail }) {
  const { course, lessons, questions, assignments } = detail;

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/courses/${course.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5A7247] hover:text-[#3D5030]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to editor
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-3 py-1.5 text-xs font-semibold text-[#E8D48B]">
          <Eye className="h-3.5 w-3.5" /> Member preview
        </span>
      </div>

      {/* Course header */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          {assignments.map((a) => (
            <span
              key={a.id}
              className="rounded-full border border-[#C9A84C]/40 bg-[#FBF6E9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#A68A2E]"
            >
              {lmsProgramLabel(a.program)}
            </span>
          ))}
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
              course.status === "published"
                ? "bg-[#EFF4EB] text-[#3D5030]"
                : "bg-[#F5F3EF] text-[#888888]"
            }`}
          >
            {course.status}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-[#1A1A1A]">{course.title}</h1>
        {course.summary && <p className="mt-1 text-[#555555]">{course.summary}</p>}
        <div className="mt-2 flex items-center gap-3 text-xs text-[#888888]">
          {course.estimated_minutes ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {course.estimated_minutes} min
            </span>
          ) : null}
          <span className="capitalize">{course.level}</span>
          <span>Pass at {course.pass_threshold}%</span>
        </div>
      </div>

      {course.status !== "published" && (
        <div className="mt-4 rounded-xl border border-[#C9A84C]/40 bg-[#FBF6E9] p-3 text-sm text-[#A68A2E]">
          This course is a <strong>{course.status}</strong> — members can&rsquo;t see it until it&rsquo;s published.
        </div>
      )}

      {/* Lessons */}
      <div className="mt-8 space-y-5">
        {lessons.map((l, i) => (
          <article key={l.id} className="rounded-2xl border border-[#DDDDDD] bg-white p-6 sm:p-7">
            {l.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={l.image_url} alt="" className="mb-5 w-full rounded-xl object-cover max-h-56" />
            )}
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A68A2E]">
              Lesson {i + 1}
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#1A1A1A]">{l.title}</h2>
            <div className="mt-3">
              <Markdown text={l.story_body ?? ""} />
            </div>
            {l.workbook && (
              <div className="mt-5 rounded-xl border border-[#C9A84C]/30 bg-[#FBF6E9] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A68A2E] mb-2">
                  Workbook
                </p>
                <Markdown text={l.workbook} />
              </div>
            )}
          </article>
        ))}
        {lessons.length === 0 && (
          <p className="text-center text-[#888888] py-8">No lessons yet.</p>
        )}
      </div>

      {/* Quiz with answers marked */}
      {questions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-[#1A1A1A]">Quiz ({questions.length})</h2>
          <p className="text-sm text-[#888888]">Correct answers are marked. Members don&rsquo;t see these until they answer.</p>
          <div className="mt-4 space-y-4">
            {questions.map((q, qi) => (
              <div key={q.id} className="rounded-2xl border border-[#DDDDDD] bg-white p-5">
                <p className="font-semibold text-[#1A1A1A]">
                  {qi + 1}. {q.prompt}
                </p>
                <div className="mt-3 space-y-1.5">
                  {q.options.map((opt, oi) => {
                    const correct = oi === q.correct_index;
                    return (
                      <div
                        key={oi}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                          correct
                            ? "border-[#7A9A63]/50 bg-[#EFF4EB] text-[#3D5030] font-medium"
                            : "border-[#EEEEEE] text-[#555555]"
                        }`}
                      >
                        {correct ? (
                          <CheckCircle2 className="h-4 w-4 text-[#3D5030] shrink-0" />
                        ) : (
                          <span className="h-4 w-4 shrink-0" />
                        )}
                        {opt}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <p className="mt-2 text-sm text-[#888888]">Why: {q.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* tiny Markdown renderer (headings, bold, bullets, paragraphs) */
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
