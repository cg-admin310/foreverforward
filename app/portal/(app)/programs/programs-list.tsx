"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, Loader2 } from "lucide-react";
import { MEMBER_PROGRAMS } from "@/lib/lms";
import { requestMembership } from "@/lib/actions/portal";
import type { ProgramType } from "@/types/database";

export function ProgramsList({
  statusByProgram,
}: {
  statusByProgram: Record<string, string>;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState<ProgramType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = async (program: ProgramType) => {
    setError(null);
    setBusy(program);
    const res = await requestMembership(program);
    setBusy(null);
    if (!res.success) {
      setError(res.error ?? "Something went wrong");
      return;
    }
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {MEMBER_PROGRAMS.map((p) => {
        const status = statusByProgram[p.program];
        return (
          <div
            key={p.program}
            className="rounded-2xl border border-[#DDDDDD] bg-white p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A68A2E]">
                {p.audience}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[#1A1A1A]">{p.label}</h3>
              <p className="mt-1 text-sm text-[#555555] max-w-xl">{p.description}</p>
            </div>
            <div className="shrink-0">
              {status === "approved" ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#EFF4EB] px-4 py-2.5 text-sm font-semibold text-[#3D5030] border border-[#7A9A63]/40">
                  <Check className="h-4 w-4" /> You&rsquo;re in
                </span>
              ) : status === "pending" ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FBF6E9] px-4 py-2.5 text-sm font-semibold text-[#A68A2E] border border-[#C9A84C]/40">
                  <Clock className="h-4 w-4" /> Requested
                </span>
              ) : status === "waitlisted" ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F0F4F8] px-4 py-2.5 text-sm font-semibold text-[#3B5B78] border border-[#93b0c8]/40">
                  <Clock className="h-4 w-4" /> Waitlisted
                </span>
              ) : (
                <button
                  onClick={() => request(p.program)}
                  disabled={busy === p.program}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] disabled:opacity-60"
                >
                  {busy === p.program ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Requesting…
                    </>
                  ) : status === "denied" ? (
                    "Request again"
                  ) : (
                    "Request to join"
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
