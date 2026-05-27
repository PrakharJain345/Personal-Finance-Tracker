"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, List, LogOut, TrendingUp } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: List },
];

interface SidebarProps {
  email?: string;
}

export default function Sidebar({ email }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed");
      setLoggingOut(false);
    } else {
      toast.success("Logged out");
      router.push("/login");
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-60 bg-[#0D1117] border-r border-[#1F2A3D] z-40 xl:w-60 lg:w-60 md:w-16">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1F2A3D]">
          <div className="w-9 h-9 rounded-xl bg-[#4C6EF5] flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight hidden lg:block">FinTrack</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-[#4C6EF5] text-white"
                    : "text-[#9CA3AF] hover:bg-[#1A2235] hover:text-white"
                }`}
              >
                {!active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-[#4C6EF5] rounded-r-full transition-all duration-200 group-hover:h-6" />
                )}
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm hidden lg:block">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#1F2A3D] p-4 bg-[#0A0D14]/40 mt-auto">
          <div className="flex items-center gap-3 mb-4 px-1 hidden lg:flex">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4C6EF5] to-[#2DD4BF] flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-md">
              {email ? email[0].toUpperCase() : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate capitalize">{email ? email.split('@')[0] : "User"}</p>
              <p className="text-xs text-[#6B7280] truncate">{email || "user@example.com"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center justify-center lg:justify-start gap-3 px-3.5 py-2.5 w-full rounded-xl text-white bg-[#EF4444]/10 border border-[#EF4444]/25 hover:bg-[#EF4444] hover:border-[#EF4444] transition-all duration-200 text-sm font-semibold cursor-pointer shadow-lg hover:shadow-[#EF4444]/10"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 text-[#EF4444] group-hover:text-white transition-colors" />
            <span className="hidden lg:block">{loggingOut ? "Logging out..." : "Log Out"}</span>
          </button>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0D1117] border-t border-[#1F2A3D] z-40 flex items-center justify-around px-4 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                active ? "text-[#4C6EF5]" : "text-[#9CA3AF]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[#EF4444] hover:bg-[#EF4444]/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-bold">Logout</span>
        </button>
      </nav>
    </>
  );
}
