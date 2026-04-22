"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ScrollText, Search, Loader2, RefreshCw, User, Shield, Workflow, FileText, Users, LogIn, AlertTriangle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  resource: string | null;
  resourceId: string | null;
  metadata: Record<string, unknown> | null;
  timestamp: string;
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  login: <LogIn className="w-4 h-4 text-green-400" />,
  login_failed: <AlertTriangle className="w-4 h-4 text-red-400" />,
  logout: <LogIn className="w-4 h-4 text-slate-400" />,
  user_created: <Users className="w-4 h-4 text-blue-400" />,
  user_deleted: <Users className="w-4 h-4 text-red-400" />,
  role_changed: <Shield className="w-4 h-4 text-purple-400" />,
  mfa_enabled: <Shield className="w-4 h-4 text-green-400" />,
  mfa_disabled: <Shield className="w-4 h-4 text-amber-400" />,
  workflow_created: <Workflow className="w-4 h-4 text-blue-400" />,
  document_uploaded: <FileText className="w-4 h-4 text-teal-400" />,
  customer_viewed: <User className="w-4 h-4 text-slate-400" />,
};

const ACTION_LABELS: Record<string, string> = {
  login: "Đăng nhập",
  login_failed: "Đăng nhập thất bại",
  logout: "Đăng xuất",
  user_created: "Tạo tài khoản",
  user_updated: "Cập nhật người dùng",
  user_deleted: "Xóa tài khoản",
  role_changed: "Thay đổi vai trò",
  mfa_enabled: "Bật MFA",
  mfa_disabled: "Tắt MFA",
  mfa_verified: "Xác thực MFA",
  password_changed: "Đổi mật khẩu",
  document_uploaded: "Tải lên tài liệu",
  document_deleted: "Xóa tài liệu",
  workflow_created: "Tạo workflow",
  workflow_updated: "Cập nhật workflow",
  workflow_deleted: "Xóa workflow",
  segment_created: "Tạo phân khúc",
  customer_viewed: "Xem hồ sơ KH",
  profile_deleted: "Xóa hồ sơ KH",
};

function formatTime(ts: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(ts));
}

export default function AuditLogsPage() {
  const { data: session } = useSession();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // @ts-expect-error: accessToken is custom
  const token = session?.accessToken || "";
  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      const res = await fetch(`${API_BASE}/api/v1/audit-logs?${params}`, { headers: authHeaders });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLogs(data.data || []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filtered = logs.filter(
    (l) =>
      !search ||
      l.action.includes(search) ||
      l.userId?.includes(search) ||
      l.resource?.includes(search),
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ScrollText className="w-8 h-8 text-green-400" /> Nhật ký kiểm toán
            </h1>
            <p className="text-slate-400 mt-1">Toàn bộ lịch sử hoạt động trong hệ thống</p>
          </div>
          <button onClick={fetchLogs} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo hành động, user ID, tài nguyên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Log Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <ScrollText className="w-12 h-12 mb-3 opacity-30" />
              <p>Chưa có nhật ký nào.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider w-44">Thời gian</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Hành động</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tài nguyên</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User ID</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log, i) => (
                    <tr key={log.id} className={`${i % 2 === 0 ? "" : "bg-slate-900/30"} hover:bg-slate-800/20 transition-colors`}>
                      <td className="px-5 py-3 text-xs text-slate-400 font-mono whitespace-nowrap">{formatTime(log.timestamp)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {ACTION_ICONS[log.action] || <Shield className="w-4 h-4 text-slate-500" />}
                          <span className="text-sm text-white">{ACTION_LABELS[log.action] || log.action}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {log.resource && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-xs text-slate-300 font-mono">
                            {log.resource}{log.resourceId && `/${log.resourceId.slice(0, 8)}…`}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-400 font-mono">
                        {log.userId ? log.userId.slice(0, 12) + "…" : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-500 max-w-xs truncate">
                        {log.metadata ? JSON.stringify(log.metadata) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-400">{filtered.length} mục</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-700 hover:border-slate-500 disabled:opacity-40 transition-colors"
            >
              Trước
            </button>
            <span className="px-3 py-1.5 text-sm text-slate-400">Trang {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={logs.length < 50}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-700 hover:border-slate-500 disabled:opacity-40 transition-colors"
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
