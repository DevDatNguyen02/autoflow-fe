"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { KeyRound, QrCode, CheckCircle, AlertTriangle, Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function MfaSettingsPage() {
  const { data: session } = useSession();
  const [step, setStep] = useState<"idle" | "setup" | "confirm" | "done">("idle");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [otp, setOtp] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // @ts-expect-error: accessToken is custom field
  const token = session?.accessToken || "";

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleSetupMfa = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/mfa/setup`, {
        method: "POST",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Không thể khởi tạo MFA.");
      const data = await res.json();
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep("setup");
    } catch {
      toast.error("Lỗi khởi tạo MFA.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmMfa = async () => {
    if (otp.length !== 6) {
      toast.error("Vui lòng nhập đúng 6 số.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/mfa/confirm`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ otp }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Xác nhận MFA thất bại.");
      }
      const data = await res.json();
      setRecoveryCodes(data.recoveryCodes);
      setStep("done");
      toast.success("MFA đã được kích hoạt thành công!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Xác nhận thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <KeyRound className="w-8 h-8 text-blue-400" />
            Xác thực 2 lớp (MFA)
          </h1>
          <p className="text-slate-400 mt-2">
            Tăng cường bảo mật tài khoản bằng ứng dụng Google Authenticator
          </p>
        </div>

        {/* Step 0: Idle */}
        {step === "idle" && (
          <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/50 text-center">
            <ShieldOff className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">MFA chưa được bật</h2>
            <p className="text-slate-400 mb-6">
              Kích hoạt MFA để bảo vệ tài khoản khỏi đăng nhập trái phép.
            </p>
            <button
              onClick={handleSetupMfa}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
              Bắt đầu thiết lập MFA
            </button>
          </div>
        )}

        {/* Step 1: Show QR Code */}
        {step === "setup" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-400" />
                Bước 1: Quét mã QR
              </h2>
              <div className="flex flex-col items-center gap-4">
                {qrCode && (
                  <img src={qrCode} alt="MFA QR Code" className="w-48 h-48 rounded-xl border-2 border-slate-700 bg-white p-2" />
                )}
                <div className="text-center">
                  <p className="text-sm text-slate-400">Mã secret (nhập thủ công nếu cần):</p>
                  <code className="text-sm text-blue-300 font-mono bg-slate-800 px-3 py-1 rounded-lg mt-1 block">{secret}</code>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Bước 2: Xác nhận mã OTP
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Nhập 6 số từ ứng dụng Authenticator..."
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-center text-xl tracking-widest placeholder:text-sm placeholder:tracking-normal placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  onClick={handleConfirmMfa}
                  disabled={loading || otp.length !== 6}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Xác nhận và kích hoạt MFA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Done - Show Recovery Codes */}
        {step === "done" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-green-500/30 bg-green-500/5">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-8 h-8 text-green-400" />
                <div>
                  <h2 className="text-xl font-bold text-green-400">MFA đã được kích hoạt!</h2>
                  <p className="text-sm text-slate-400">Tài khoản của bạn giờ được bảo vệ 2 lớp.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-amber-400">Mã khôi phục — Lưu ngay!</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Dùng các mã này khi bạn mất điện thoại. Mỗi mã chỉ dùng được 1 lần.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {recoveryCodes.map((code, i) => (
                  <code key={i} className="text-sm font-mono bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-green-300">
                    {code}
                  </code>
                ))}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(recoveryCodes.join("\n"));
                  toast.success("Đã sao chép mã khôi phục!");
                }}
                className="mt-4 w-full py-2 border border-slate-700 hover:border-slate-500 rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
              >
                Sao chép tất cả mã
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
