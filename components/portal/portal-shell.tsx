"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, LayoutGrid, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function PortalShell({
  memberName,
  children,
}: {
  memberName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/portal/login");
    router.refresh();
  };

  const links = [
    { href: "/portal", label: "My Learning", icon: LayoutGrid },
    { href: "/portal/programs", label: "Programs", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="sticky top-0 z-40 bg-[#141413] border-b border-[#2D2D2D]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/portal" className="text-lg font-bold">
              <span className="text-[#C9A84C]">Forever</span>
              <span className="text-white">Forward</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active ? "bg-[#C9A84C] text-[#1A1A1A]" : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <l.icon className="h-4 w-4" />
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-white/60">{memberName}</span>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/80 hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
        {/* mobile nav */}
        <nav className="sm:hidden flex items-center gap-1 px-4 pb-2">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex-1 text-center rounded-lg px-3 py-2 text-sm font-medium",
                  active ? "bg-[#C9A84C] text-[#1A1A1A]" : "text-white/70"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
