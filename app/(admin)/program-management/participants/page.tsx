export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getParticipants, getParticipantStats } from "@/lib/actions/participants";
import { ParticipantsTable } from "./participants-table";

export default async function ParticipantsPage({
  searchParams,
}: {
  searchParams: Promise<{
    program?: string;
    status?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  // Fetch participants and stats in parallel
  const [participantsResult, statsResult] = await Promise.all([
    getParticipants({
      program: params.program as any,
      status: params.status as any,
      search: params.search,
      limit,
      offset,
    }),
    getParticipantStats(),
  ]);

  const participants = participantsResult.data?.participants || [];
  const total = participantsResult.data?.total || 0;
  const stats = statsResult.data;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/program-management"
              className="text-sm text-[#888888] hover:text-[#C9A84C]"
            >
              Programs
            </Link>
            <span className="text-[#888888]">/</span>
            <span className="text-sm text-[#1A1A1A]">Participants</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Participants</h1>
          <p className="text-[#555555]">Manage program participants and track progress</p>
        </div>
        <Button asChild>
          <Link href="/leads/new?type=program">Add Participant</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats?.total || 0, color: "text-[#1A1A1A]" },
          {
            label: "Active",
            value: stats?.byStatus?.active || 0,
            color: "text-green-600",
          },
          {
            label: "Enrolled",
            value: stats?.byStatus?.enrolled || 0,
            color: "text-blue-600",
          },
          {
            label: "Completed",
            value: stats?.completed || 0,
            color: "text-[#5A7247]",
          },
          {
            label: "Applicants",
            value: stats?.byStatus?.applicant || 0,
            color: "text-[#C9A84C]",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-[#DDDDDD]">
            <p className="text-sm text-[#888888]">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Participants Table (Client Component for interactivity) */}
      <ParticipantsTable
        initialParticipants={participants}
        total={total}
        currentPage={page}
        totalPages={totalPages}
        currentProgram={params.program}
        currentStatus={params.status}
        currentSearch={params.search}
      />
    </div>
  );
}
