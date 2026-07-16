import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Clock, CheckCircle2 } from "lucide-react";
import { getMemberUser } from "@/lib/auth";
import { getPortalDashboard } from "@/lib/actions/portal";

export const dynamic = "force-dynamic";

const MEMBERSHIP_STYLES: Record<string, string> = {
  approved: "bg-[#EFF4EB] text-[#3D5030] border-[#7A9A63]/40",
  pending: "bg-[#FBF6E9] text-[#A68A2E] border-[#C9A84C]/40",
  waitlisted: "bg-[#F0F4F8] text-[#3B5B78] border-[#93b0c8]/40",
  denied: "bg-[#FBEBEB] text-[#9B3B3B] border-[#d99]/40",
};

export default async function PortalHome() {
  const member = await getMemberUser();
  const res = await getPortalDashboard();
  const data = res.success && res.data ? res.data : { memberships: [], courses: [] };
  const firstName = (member.full_name || "there").split(" ")[0];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Welcome back, {firstName}.</h1>
        <p className="text-[#555555] mt-1">Pick up where you left off, or explore something new.</p>
      </div>

      {/* Memberships */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A68A2E]">
            Your Programs
          </h2>
          <Link
            href="/portal/programs"
            className="text-sm font-semibold text-[#5A7247] hover:text-[#3D5030] inline-flex items-center gap-1"
          >
            Join a program <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {data.memberships.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[#C9A84C]/40 bg-white p-8 text-center">
            <GraduationCap className="mx-auto h-8 w-8 text-[#C9A84C]/60" />
            <p className="mt-3 text-[#555555]">
              You&rsquo;re not in any programs yet.
            </p>
            <Link
              href="/portal/programs"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] px-4 py-2.5 text-sm font-semibold text-[#1A1A1A]"
            >
              Browse programs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {data.memberships.map((m) => (
              <span
                key={m.program}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                  MEMBERSHIP_STYLES[m.status]
                }`}
              >
                {m.label} · {m.status}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Courses */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A68A2E]">
          Your Courses
        </h2>
        {data.courses.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[#DDDDDD] bg-white p-8 text-center text-[#888888]">
            <BookOpen className="mx-auto h-8 w-8 text-[#C9A84C]/50" />
            <p className="mt-3">
              Courses show up here once you&rsquo;re approved in a program that has them.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            {data.courses.map((c) => (
              <Link
                key={c.assignmentId}
                href={`/portal/learn/${c.assignmentId}`}
                className="group rounded-2xl border border-[#DDDDDD] bg-white overflow-hidden hover:border-[#C9A84C]/60 hover:shadow-[0_10px_30px_rgba(201,168,76,0.12)] transition-all"
              >
                <div className="relative h-32 bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] overflow-hidden">
                  {c.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.coverImageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-starfield opacity-70" />
                  )}
                  <span className="absolute top-3 left-3 rounded-full bg-[#1A1A1A]/70 backdrop-blur px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#E8D48B] border border-white/10">
                    {c.programLabel}
                  </span>
                  {c.progressStatus === "completed" && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-[#7A9A63] px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                      <CheckCircle2 className="h-3 w-3" /> Done
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#1A1A1A] group-hover:text-[#A68A2E] transition-colors">
                    {c.title}
                  </h3>
                  {c.summary && (
                    <p className="mt-1 text-sm text-[#888888] line-clamp-2">{c.summary}</p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-xs text-[#888888]">
                    {c.estimatedMinutes ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {c.estimatedMinutes} min
                      </span>
                    ) : null}
                    <span className="capitalize">{c.level}</span>
                  </div>
                  <div className="mt-3">
                    <div className="h-1.5 w-full rounded-full bg-[#EEEEEE] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]"
                        style={{ width: `${c.percent}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-[#888888]">
                      {c.percent === 0
                        ? "Not started"
                        : c.percent >= 100
                        ? "Completed"
                        : `${c.percent}% complete`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
