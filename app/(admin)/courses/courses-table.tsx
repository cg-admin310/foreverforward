"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, HelpCircle, GraduationCap, Bot } from "lucide-react";
import type { CourseListRow } from "@/lib/actions/courses";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-[#F5F3EF] text-[#888888] border-[#DDDDDD]",
  published: "bg-[#EFF4EB] text-[#3D5030] border-[#7A9A63]/40",
  archived: "bg-[#FBF6E9] text-[#A68A2E] border-[#C9A84C]/40",
};

export function CoursesTable({ courses }: { courses: CourseListRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = courses.filter((c) => {
    const matchesQuery =
      !query ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      (c.summary ?? "").toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || c.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="rounded-2xl border border-[#DDDDDD] bg-white overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-[#DDDDDD]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses..."
          className="flex-1 min-w-[200px] rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center text-[#888888]">
          <BookOpen className="mx-auto h-8 w-8 text-[#C9A84C]/50" />
          <p className="mt-3">No courses yet. Create your first one with AI.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#EEEEEE]">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/courses/${c.id}`}
              className="flex items-center gap-4 p-4 hover:bg-[#FBF6E9]/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1A1A1A] truncate">{c.title}</span>
                  {c.ai_generated && (
                    <span title="AI-generated">
                      <Bot className="h-3.5 w-3.5 text-[#A68A2E]" />
                    </span>
                  )}
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      STATUS_STYLES[c.status] ?? STATUS_STYLES.draft
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                {c.summary && (
                  <p className="mt-0.5 text-sm text-[#888888] truncate">{c.summary}</p>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-5 text-xs text-[#888888] shrink-0">
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" /> {c.lesson_count}
                </span>
                <span className="inline-flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5" /> {c.question_count}
                </span>
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" /> {c.program_count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
