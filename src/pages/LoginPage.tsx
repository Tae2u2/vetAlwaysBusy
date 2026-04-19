import React, { useState } from "react";
import { verifyPassword } from "../utils/auth";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff, KeyRound, Lock, Stethoscope } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password || !apiKey) {
      setError("비밀번호와 API 키를 모두 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const ok = await verifyPassword(password);
      console.log("인증 결과", ok);
      if (!ok) {
        setError("비밀번호가 올바르지 않습니다.");
        return;
      }
      login(apiKey);
    } catch {
      setError("인증 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1a3a5c] to-[#2a5298] px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4 overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full" />
            </div>
            <h1 className="text-white font-bold text-xl tracking-tight">
              우리동물메디컬센터
            </h1>
            <p className="text-blue-200 text-sm mt-1">진료 보고서 시스템</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8 space-y-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <Lock size={12} /> 시스템 비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="비밀번호 입력"
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <KeyRound size={12} /> Claude API 키
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="sk-ant-..."
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-sm font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                API 키는 탭을 닫으면 자동으로 삭제됩니다.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1a3a5c] to-[#2a5298] text-white py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  인증 중...
                </>
              ) : (
                <>
                  <Stethoscope size={16} />
                  시스템 접속
                </>
              )}
            </button>
          </div>

          <div className="px-8 pb-6 text-center text-xs text-slate-400">
            우리동물메디컬센터 전용 시스템 · 무단 접근 금지
          </div>
        </div>
      </div>
    </div>
  );
};
