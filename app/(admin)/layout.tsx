import { getStaffUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Requires an authenticated staff user; redirects to /login otherwise.
  const staff = await getStaffUser();

  return (
    <AdminShell
      user={{ email: staff.email, full_name: staff.full_name }}
      role={staff.role}
    >
      {children}
    </AdminShell>
  );
}
