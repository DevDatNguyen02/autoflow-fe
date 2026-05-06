"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  KeyRound, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    image: "",
  });

  // Password state
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
      });
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/v1/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
        // Update session client-side
        await update({
          ...session,
          user: {
            ...session?.user,
            name: profileData.name,
            email: profileData.email,
          },
        });
      } else {
        setMessage({ type: "error", text: data.message || "Có lỗi xảy ra khi cập nhật." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Không thể kết nối đến máy chủ." });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu mới không khớp." });
      return;
    }

    setPassLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/v1/users/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passData.currentPassword,
          newPassword: passData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
        setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: data.message || "Mật khẩu hiện tại không đúng." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Không thể kết nối đến máy chủ." });
    } finally {
      setPassLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "File quá lớn (tối đa 2MB)." });
      return;
    }

    setAvatarLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/v1/users/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const newAvatarUrl = data.data.image;
        setProfileData(prev => ({ ...prev, image: newAvatarUrl }));
        setMessage({ type: "success", text: "Cập nhật ảnh đại diện thành công!" });
        
        // Update session
        await update({
          ...session,
          user: {
            ...session?.user,
            image: newAvatarUrl,
          },
        });
      } else {
        setMessage({ type: "error", text: data.message || "Lỗi khi tải ảnh lên." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Không thể kết nối đến máy chủ." });
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Hồ sơ cá nhân</h1>
          <p className="text-slate-400 mt-1">Quản lý thông tin cá nhân và cài đặt bảo mật của bạn</p>
        </div>

        {message && (
          <div className={cn(
            "p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300",
            message.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
          )}>
            {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-blue-500/20 mb-4 overflow-hidden border-2 border-slate-800">
                  {profileData.image ? (
                    <img 
                      src={profileData.image.startsWith('http') ? profileData.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${profileData.image}`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profileData.name.split(" ").map(n => n[0]).join("").toUpperCase() || "U"
                  )}
                  
                  {avatarLoading && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                
                <label className="absolute bottom-4 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-900 cursor-pointer transition-all hover:scale-110 shadow-lg">
                  <Camera className="w-4 h-4 text-white" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={avatarLoading}
                  />
                </label>
              </div>
              <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
              <p className="text-slate-400 text-sm mt-1">{profileData.email}</p>
              <div className="mt-4 px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-500/20">
                {/* @ts-expect-error: role is custom */}
                {session?.user?.role || "Member"}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Trạng thái bảo mật
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Email xác thực</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Đã xác thực</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Xác thực 2 lớp</span>
                  {/* @ts-expect-error: mfa is custom */}
                  {session?.user?.mfaEnabled === "true" ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Bật</span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded-full">Tắt</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Edit Info Form */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Thông tin cá nhân</h3>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">Họ và tên</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                      <input 
                        type="text" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                        placeholder="Nhập tên của bạn"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">Địa chỉ Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                      <input 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Đổi mật khẩu</h3>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input 
                      type="password" 
                      value={passData.currentPassword}
                      onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">Mật khẩu mới</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                      <input 
                        type="password" 
                        value={passData.newPassword}
                        onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">Xác nhận mật khẩu mới</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                      <input 
                        type="password" 
                        value={passData.confirmPassword}
                        onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={passLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20"
                  >
                    {passLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
