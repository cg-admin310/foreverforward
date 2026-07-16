"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, X, UserCheck } from "lucide-react";
import { decideProgramRequest, type ProgramRequestRow } from "@/lib/actions/program-requests";
import { programLabel } from "@/lib/lms";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#FBF6E9] text-[#A68A2E] border-[#C9A84C]/40",
  approved: "bg-[#EFF4EB] text-[#3D5030] border-[#7A9A63]/40",
  waitlisted: "bg-[#F0F4F8] text-[#3B5B78] border-[#93b0c8]/40",
  denied: "bg-[#FBEBEB] text-[#9B3B3B] border-[#d99]/40",
};

export function RequestsTable({ requests }: { requests: ProgramRequestRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("pending");
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = requests.filter((r) => filter === "all" || r.status === filter);

  const decide = async (
    id: string,
    decision: "approved" | "waitlisted" | "denied"
  ) => {
    setBusyId(id);
    await decideProgramRequest(id, decision);
    setBusyId(null);
    startTransition(() => router.refresh());
  };

  return (
    <div className="rounded-2xl border border-[#DDDDDD] bg-white overflow-hidden">
      <div className="flex flex-wrap gap-2 p-4 border-b border-[#DDDDDD]">
        {["pending", "approved", "waitlisted", "denied", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filter === f
                ? "bg-[#1A1A1A] text-white"
                : "bg-[#F5F3EF] text-[#555555] hover:bg-[#EEEEEE]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center text-[#888888]">
          <UserCheck className="mx-auto h-8 w-8 text-[#C9A84C]/50" />
          <p className="mt-3">Nothing here.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#EEEEEE]">
          {filtered.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1A1A1A]">
                    {r.member_name || r.member_email}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      STATUS_STYLES[r.status]
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="text-sm text-[#888888]">
                  {programLabel(r.program)} · {r.member_kind} · {r.member_email}
                </p>
                {r.message && (
                  <p className="mt-1 text-sm text-[#555555] italic">&ldquo;{r.message}&rdquo;</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={busyId === r.id || r.status === "approved"}
                  onClick={() => decide(r.id, "approved")}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#EFF4EB] px-3 py-2 text-sm font-semibold text-[#3D5030] border border-[#7A9A63]/40 disabled:opacity-40 hover:bg-[#e2ecd9]"
                >
                  <Check className="h-4 w-4" /> Approve
                </button>
                <button
                  disabled={busyId === r.id || r.status === "waitlisted"}
                  onClick={() => decide(r.id, "waitlisted")}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#F0F4F8] px-3 py-2 text-sm font-semibold text-[#3B5B78] border border-[#93b0c8]/40 disabled:opacity-40 hover:bg-[#e4edf4]"
                >
                  <Clock className="h-4 w-4" /> Waitlist
                </button>
                <button
                  disabled={busyId === r.id || r.status === "denied"}
                  onClick={() => decide(r.id, "denied")}
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#9B3B3B] border border-[#d99]/40 disabled:opacity-40 hover:bg-[#FBEBEB]"
                >
                  <X className="h-4 w-4" /> Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {pending && <div className="p-2 text-center text-xs text-[#888888]">Updating…</div>}
    </div>
  );
}
