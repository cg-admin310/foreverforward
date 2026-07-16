import { listProgramRequests } from "@/lib/actions/program-requests";
import { RequestsTable } from "./requests-table";

export const dynamic = "force-dynamic";

export default async function ProgramRequestsPage() {
  const res = await listProgramRequests();
  const requests = res.success && res.data ? res.data : [];
  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Program Requests</h1>
        <p className="text-[#555555] mt-1">
          {pending > 0
            ? `${pending} request${pending === 1 ? "" : "s"} waiting on you.`
            : "People who asked to join a program. Approve, waitlist, or deny."}
        </p>
      </div>
      <RequestsTable requests={requests} />
    </div>
  );
}
