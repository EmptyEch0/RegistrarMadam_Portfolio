import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_authenticated") === "true") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (password === "GJS@1905") {
        localStorage.setItem("admin_authenticated", "true");
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError("Invalid administrator password. Please verify and try again.");
        setLoading(false);
      }
    }, 200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B132B] px-4 py-12 relative overflow-hidden">
      {/* Subtle gold / navy ambient glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#16845B]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-[#C59B27] transition-colors mb-4 font-medium"
        >
          <ArrowLeft size={14} /> Back to Public Portfolio
        </Link>

        {/* Card */}
        <div className="rounded-2xl bg-white border border-[#E7E2D8] p-7 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#0B132B] text-[#C59B27] border border-[#C59B27]/40 flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck size={28} />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#0B132B]">
              Admin Portal
            </h1>
            <p className="text-xs text-[#64748B]">
              Sign in to manage academic records, QLearn content, and research portfolio
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-[#B42318]/10 border border-[#B42318]/30 text-[#B42318] text-xs animate-fade-in font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5">
                <Lock size={13} className="text-[#C59B27]" /> Administrator Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm pl-3.5 pr-11 py-2.5 rounded-xl bg-[#FAF8F5] text-[#334155] border border-[#E7E2D8] focus:border-[#C59B27] focus:bg-white focus:outline-none transition-all placeholder:text-[#64748B]/60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0B132B] transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold shadow-xs py-2.5 px-4 rounded-xl text-sm bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Sign In to Admin Portal"}
            </button>
          </form>

          <div className="pt-2 border-t border-[#E7E2D8] text-center text-[11px] text-[#64748B]">
            Dr. G. Jaya Suma · Professor of Information Technology · JNTU-GV
          </div>
        </div>
      </div>
    </div>
  );
}
