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
          Everyone who asked to join a program, from the website enrollment form and
          from portal sign-ups, in one place.{" "}
          {pending > 0
            ? `${pending} waiting on you.`
            : "Approve, waitlist, or deny."}
        </p>
      </div>
      <RequestsTable requests={requests} />
    </div>
  );
}
