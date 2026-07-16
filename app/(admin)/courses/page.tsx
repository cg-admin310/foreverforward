import Link from "next/link";
import { Sparkles, Plus } from "lucide-react";
import { listCourses } from "@/lib/actions/courses";
import { CoursesTable } from "./courses-table";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const res = await listCourses();
  const courses = res.success && res.data ? res.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Courses</h1>
          <p className="text-[#555555] mt-1">
            Build short, story-driven courses and assign them to programs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/courses/new"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] hover:shadow-[0_0_24px_rgba(201,168,76,0.35)] transition-shadow"
          >
            <Sparkles className="h-4 w-4" />
            New with AI
          </Link>
          <Link
            href="/courses/new?mode=blank"
            className="inline-flex items-center gap-2 rounded-lg border border-[#DDDDDD] bg-white px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] hover:border-[#C9A84C]/60 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Blank
          </Link>
        </div>
      </div>

      <CoursesTable courses={courses} />
    </div>
  );
}
