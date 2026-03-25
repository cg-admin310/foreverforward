export const dynamic = "force-dynamic";

// Super minimal dashboard to debug server error
export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1A1A1A]">Dashboard</h1>
      <p className="text-[#555555]">Welcome back!</p>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
          <p className="text-sm text-[#888888]">New Leads</p>
          <p className="text-3xl font-bold text-[#1A1A1A]">6</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
          <p className="text-sm text-[#888888]">Participants</p>
          <p className="text-3xl font-bold text-[#1A1A1A]">0</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
          <p className="text-sm text-[#888888]">MSP Clients</p>
          <p className="text-3xl font-bold text-[#1A1A1A]">2</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
          <p className="text-sm text-[#888888]">Revenue</p>
          <p className="text-3xl font-bold text-[#1A1A1A]">$0</p>
        </div>
      </div>
    </div>
  );
}
