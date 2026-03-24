"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface TopbarProps {
  user?: {
    email: string;
    full_name?: string | null;
  };
  onMenuClick?: () => void;
}

export function Topbar({ user, onMenuClick }: TopbarProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const notifications = [
    { id: 1, message: "New lead from website", time: "5m ago", unread: true },
    { id: 2, message: "Travis AI escalation: John D.", time: "1h ago", unread: true },
    { id: 3, message: "Invoice #1234 paid", time: "2h ago", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-[#DDDDDD] flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
        >
          <Menu className="h-5 w-5 text-[#555555]" />
        </button>

        {/* Search */}
        <div className="hidden sm:block relative w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
          <Input
            type="search"
            placeholder="Search leads, participants, clients..."
            className="pl-10 bg-[#FAFAF8] border-[#DDDDDD]"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
          >
            <Bell className="h-5 w-5 text-[#555555]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A84C] text-[#1A1A1A] text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#DDDDDD] overflow-hidden z-50">
              <div className="p-4 border-b border-[#DDDDDD]">
                <h3 className="font-semibold text-[#1A1A1A]">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-[#DDDDDD] hover:bg-[#FAFAF8] cursor-pointer ${
                      notification.unread ? "bg-[#FBF6E9]" : ""
                    }`}
                  >
                    <p className="text-sm text-[#1A1A1A]">{notification.message}</p>
                    <p className="text-xs text-[#888888] mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-[#DDDDDD]">
                <Link
                  href="/notifications"
                  className="text-sm text-[#C9A84C] hover:underline"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] font-semibold text-sm">
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            <span className="hidden sm:block text-sm font-medium text-[#1A1A1A]">
              {user?.full_name || user?.email?.split("@")[0] || "User"}
            </span>
            <ChevronDown className="h-4 w-4 text-[#888888]" />
          </button>

          {/* User dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#DDDDDD] overflow-hidden z-50">
              <div className="p-4 border-b border-[#DDDDDD]">
                <p className="font-medium text-[#1A1A1A]">
                  {user?.full_name || "User"}
                </p>
                <p className="text-sm text-[#888888]">{user?.email}</p>
              </div>
              <div className="p-2">
                <Link
                  href="/settings/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
