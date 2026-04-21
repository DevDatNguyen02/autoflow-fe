"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Workflow, 
  Users, 
  BrainCircuit, 
  Settings, 
  LogOut,
  ChevronRight,
  Sparkles,
  Layers,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    name: "Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    name: "Automation",
    icon: Workflow,
    href: "/dashboard/automation/builder",
  },
  {
    name: "Customers",
    icon: UserCircle,
    href: "/dashboard/tracking", // Redirect to existing tracking/profiles list
  },
  {
    name: "Segments",
    icon: Layers,
    href: "/dashboard/segments",
  },
  {
    name: "AI Hub",
    icon: BrainCircuit,
    href: "/dashboard/knowledge",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user;
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#020617] border-r border-slate-800 flex flex-col z-50">
        {/* Brand */}
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">AutoFlow</h2>
              <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Enterprise</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-blue-600/10 text-white shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-blue-500" : "group-hover:text-blue-400"
                  )} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {isActive && (
                  <div className="w-1 h-5 bg-blue-500 rounded-full absolute right-0 mr-1" />
                )}
                {!isActive && (
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner group-hover:scale-105 transition-transform">
              {userInitials}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name || "Guest"}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || "anonymous@autoflow.ai"}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#0f172a]">
        {children}
      </main>
    </div>
  );
}
