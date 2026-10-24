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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-4 font-medium"
        >
          <ArrowLeft size={14} /> Back to Public Portfolio
        </Link>

        {/* Card */}
        <div className="rounded-2xl bg-card/95 backdrop-blur-xl border border-border/80 p-7 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-accent/20">
              <ShieldCheck size={28} />
            </div>
            <h1 className="font-serif text-2xl font-bold text-primary">
              Admin Portal
            </h1>
            <p className="text-xs text-muted-foreground">
              Sign in to manage academic records, QLearn content, and research portfolio
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs animate-fade-in">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lock size={13} className="text-accent" /> Administrator Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm pl-3.5 pr-11 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-accent focus:bg-card focus:outline-none transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="default"
              disabled={loading}
              className="w-full font-semibold shadow-md py-2.5 text-sm"
            >
              {loading ? "Authenticating..." : "Sign In to Admin Portal"}
            </Button>
          </form>

          <div className="pt-2 border-t border-border/60 text-center text-[11px] text-muted-foreground">
            Dr. G. Jaya Suma · Professor of Information Technology · JNTU-GV
          </div>
        </div>
      </div>
    </div>
  );
}
