"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@autoflow.ai");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        toast.error("Đăng nhập thất bại!", {
          description: "Vui lòng kiểm tra lại email hoặc mật khẩu.",
        });
      } else {
        toast.success("Đăng nhập thành công!", {
          description: "Đang chuyển hướng đến Dashboard...",
        });
        window.location.href = result?.url || "/dashboard";
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra", {
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617]">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-blue-600/20 blur-[128px]" />
      <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-purple-600/20 blur-[128px]" />
      
      <div className="relative w-full max-w-[440px] px-6">
        {/* Logo Section */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Chào mừng trở lại</h1>
          <p className="mt-2 text-slate-400">Đăng nhập vào hệ thống AutoFlow Enterprise</p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Mật khẩu</label>
                <a href="#" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Đăng nhập ngay
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          Chưa có tài khoản?{" "}
          <a href="#" className="font-medium text-blue-500 hover:text-blue-400">
            Đăng ký doanh nghiệp
          </a>
        </p>
      </div>
    </div>
  );
}
