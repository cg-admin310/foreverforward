"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  FileText,
  Mail,
  CreditCard,
  Briefcase,
  Calendar,
  BookOpen,
  Heart,
  BarChart3,
  Settings,
  Bot,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  hidden?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "CRM",
    items: [
      { name: "Leads", href: "/leads", icon: Users },
      { name: "Programs", href: "/program-management", icon: GraduationCap, roles: ["super_admin", "case_worker"] },
      { name: "MSP Clients", href: "/clients", icon: Building2, roles: ["super_admin", "sales_lead"] },
    ],
  },
  {
    title: "Operations",
    items: [
      { name: "Documents", href: "/documents", icon: FileText, hidden: true },
      { name: "Emails", href: "/emails", icon: Mail, hidden: true },
      { name: "Travis AI", href: "/travis", icon: Bot, roles: ["super_admin", "case_worker"], hidden: true },
    ],
  },
  {
    title: "Finance",
    items: [
      { name: "Billing", href: "/billing", icon: CreditCard, roles: ["super_admin", "sales_lead"] },
      { name: "Donations", href: "/donations", icon: Heart, roles: ["super_admin"] },
    ],
  },
  {
    title: "Resources",
    items: [
      { name: "Workforce", href: "/workforce", icon: Briefcase, roles: ["super_admin", "sales_lead"], hidden: true },
      { name: "Events", href: "/events-admin", icon: Calendar, roles: ["super_admin", "event_coordinator"] },
      { name: "Resources", href: "/resources", icon: FolderOpen, hidden: true },
    ],
  },
  {
    title: "Content",
    items: [
      { name: "Blog Manager", href: "/blog-manager", icon: BookOpen, roles: ["super_admin"], hidden: true },
    ],
  },
  {
    title: "Analytics",
    items: [
      { name: "Reports", href: "/reports", icon: BarChart3, roles: ["super_admin", "sales_lead", "case_worker"], hidden: true },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: "/settings", icon: Settings, roles: ["super_admin"] },
    ],
  },
];

interface SidebarProps {
  userRole?: string;
}

export function Sidebar({ userRole = "super_admin" }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNavigation = navigation.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !item.hidden && (!item.roles || item.roles.includes(userRole))
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-[#1A1A1A] border-r border-[#2D2D2D] z-50 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#2D2D2D]">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="text-[#C9A84C]">FF</span>
              <span className="text-white ml-1">Admin</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <span className="text-xl font-bold text-[#C9A84C]">FF</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-[#2D2D2D] transition-colors",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
        {filteredNavigation.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                {group.title}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-[#C9A84C] text-[#1A1A1A]"
                          : "text-white/70 hover:text-white hover:bg-[#2D2D2D]",
                        collapsed && "justify-center px-2"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-[#1A1A1A]")} />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
