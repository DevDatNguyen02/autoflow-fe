"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Shield, Users, ScrollText, KeyRound, ArrowRight } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  // @ts-expect-error: role is custom field
  const role = session?.user?.role || "agent";
  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Cài đặt hệ thống</h1>
          <p className="text-slate-400 mt-1">Quản lý bảo mật, người dùng và cấu hình</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* MFA Settings */}
          <Link
            href="/dashboard/settings/mfa"
            className="group flex items-start gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
              <KeyRound className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white flex items-center gap-2">
                Xác thực 2 lớp (MFA)
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Bảo vệ tài khoản bằng Google Authenticator (TOTP)
              </p>
            </div>
          </Link>

          {/* User Management - Admin only */}
          {isAdmin && (
            <Link
              href="/dashboard/settings/users"
              className="group flex items-start gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  Quản lý nhân viên
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Tạo tài khoản, gán vai trò và quản lý quyền truy cập
                </p>
              </div>
            </Link>
          )}

          {/* Audit Logs - Admin only */}
          {isAdmin && (
            <Link
              href="/dashboard/settings/audit"
              className="group flex items-start gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-green-500/50 hover:bg-green-500/5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                <ScrollText className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  Nhật ký kiểm toán
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-green-400" />
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Xem toàn bộ lịch sử hoạt động và thay đổi trong hệ thống
                </p>
              </div>
            </Link>
          )}

          {/* Security Overview */}
          <div className="flex items-start gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Vai trò của bạn</h3>
              <p className="text-sm text-slate-400 mt-1">
                Vai trò hiện tại:{" "}
                <span className="capitalize font-semibold text-white">{role}</span>
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {role === "admin" && "Bạn có toàn quyền quản trị hệ thống."}
                {role === "marketer" && "Bạn có thể quản lý khách hàng, chiến dịch và AI Hub."}
                {role === "agent" && "Bạn có thể xem hồ sơ khách hàng và hỗ trợ chat."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
