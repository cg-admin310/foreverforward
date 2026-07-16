import { getPortalDashboard } from "@/lib/actions/portal";
import { ProgramsList } from "./programs-list";

export const dynamic = "force-dynamic";

export default async function PortalProgramsPage() {
  const res = await getPortalDashboard();
  const memberships = res.success && res.data ? res.data.memberships : [];
  const statusByProgram: Record<string, string> = {};
  memberships.forEach((m) => (statusByProgram[m.program] = m.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Programs</h1>
        <p className="text-[#555555] mt-1">
          Ask to join a program. A Forever Forward case worker reviews every request.
        </p>
      </div>
      <ProgramsList statusByProgram={statusByProgram} />
    </div>
  );
}
