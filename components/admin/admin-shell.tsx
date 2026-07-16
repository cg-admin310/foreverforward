"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";

export function AdminShell({
  user,
  role,
  children,
}: {
  user: { email: string; full_name?: string | null };
  role: string;
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar userRole={role} />
      </div>

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar userRole={role} />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="lg:pl-64 transition-all duration-300">
        <Topbar user={user} onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
