"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Users, UserPlus, Shield, Loader2, Trash2, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type UserRole = "admin" | "marketer" | "agent";
interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  mfaEnabled: string | null;
}

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-500/10 text-red-400 border-red-500/20",
  marketer: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  agent: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function UsersManagementPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "agent" as UserRole });
  const [saving, setSaving] = useState(false);
  const [newUserResult, setNewUserResult] = useState<{ tempPassword: string; email: string } | null>(null);

  // @ts-expect-error: accessToken is custom
  const token = session?.accessToken || "";
  const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/users`, { headers: authHeaders });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data.data || []);
    } catch {
      toast.error("Không thể tải danh sách nhân viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateUser = async () => {
    if (!form.name || !form.email) { toast.error("Vui lòng điền đầy đủ thông tin."); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/users`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      const data = await res.json();
      setNewUserResult({ tempPassword: data.data.tempPassword, email: data.data.email });
      setShowModal(false);
      setForm({ name: "", email: "", role: "agent" });
      fetchUsers();
      toast.success("Tạo tài khoản thành công!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Tạo tài khoản thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/users/${userId}/role`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error();
      fetchUsers();
      toast.success("Cập nhật vai trò thành công!");
    } catch {
      toast.error("Cập nhật vai trò thất bại.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bạn có chắc muốn xóa tài khoản này?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/users/${userId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error();
      fetchUsers();
      toast.success("Xóa tài khoản thành công.");
    } catch {
      toast.error("Xóa tài khoản thất bại.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-400" /> Quản lý nhân viên
            </h1>
            <p className="text-slate-400 mt-1">Tạo tài khoản và phân quyền cho nhân viên</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Thêm nhân viên
          </button>
        </div>

        {/* Temp password result */}
        {newUserResult && (
          <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-amber-400">Tài khoản mới đã tạo!</p>
              <p className="text-sm text-slate-400 mt-1">Email: <span className="text-white">{newUserResult.email}</span></p>
              <p className="text-sm text-slate-400">Mật khẩu tạm: <code className="text-amber-300 font-mono bg-slate-800 px-2 py-0.5 rounded">{newUserResult.tempPassword}</code></p>
              <p className="text-xs text-slate-500 mt-1">Gửi thông tin này cho nhân viên qua kênh bảo mật.</p>
            </div>
            <button onClick={() => setNewUserResult(null)}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
          </div>
        )}

        {/* User Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nhân viên</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vai trò</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">MFA</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user.id} className={`${i % 2 === 0 ? "" : "bg-slate-900/30"} hover:bg-slate-800/30 transition-colors`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name || "—"}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={user.role || "agent"}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                          className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg border text-sm font-medium bg-transparent cursor-pointer focus:outline-none ${ROLE_COLORS[user.role || "agent"]}`}
                        >
                          <option value="admin">Admin</option>
                          <option value="marketer">Marketer</option>
                          <option value="agent">Agent</option>
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.mfaEnabled === "true" ? "bg-green-500/10 text-green-400" : "bg-slate-700 text-slate-400"}`}>
                        <Shield className="w-3 h-3" />
                        {user.mfaEnabled === "true" ? "Đã bật" : "Chưa bật"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Create User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Thêm nhân viên mới</h2>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Họ tên</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nguyễn Văn A" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="nhanvien@company.com" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Vai trò</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:outline-none">
                    <option value="admin">Admin - Toàn quyền</option>
                    <option value="marketer">Marketer - Quản lý chiến dịch</option>
                    <option value="agent">Agent - Hỗ trợ khách hàng</option>
                  </select>
                </div>
                <button onClick={handleCreateUser} disabled={saving} className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-70 mt-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  Tạo tài khoản
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
