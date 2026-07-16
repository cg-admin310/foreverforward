import { getMemberUser } from "@/lib/auth";
import { PortalShell } from "@/components/portal/portal-shell";

export const dynamic = "force-dynamic";

export default async function PortalAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await getMemberUser();
  const name = member.full_name || member.email;
  return <PortalShell memberName={name}>{children}</PortalShell>;
}
