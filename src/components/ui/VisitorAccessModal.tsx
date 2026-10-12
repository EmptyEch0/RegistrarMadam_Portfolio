import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, GraduationCap, Gamepad2, Sparkles, X, ArrowRight, ShieldCheck } from "lucide-react";
import { saveVisitorProfile, logVisitorAccess, VisitorProfile } from "@/lib/visitorTracking";

interface VisitorAccessModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: (profile: VisitorProfile) => void;
  targetItem?: string;
  targetType?: "course" | "puzzle" | "general";
  canDismiss?: boolean;
}

export function VisitorAccessModal({
  isOpen,
  onClose,
  onSuccess,
  targetItem = "Courses & Puzzles",
  targetType = "course",
  canDismiss = true,
}: VisitorAccessModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // 1. Save profile
      const profile = saveVisitorProfile(trimmedName, trimmedEmail);

      // 2. Log access immediately
      await logVisitorAccess(targetItem, targetType);

      // 3. Callback
      onSuccess(profile);
    } catch (err) {
      console.error("Error in visitor submission:", err);
      // Still allow visitor in even if logging had an issue
      const profile = saveVisitorProfile(trimmedName, trimmedEmail);
      onSuccess(profile);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card border border-border/70 shadow-2xl p-6 sm:p-8"
        >
          {/* Subtle decorative gradient top bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500" />

          {/* Dismiss button if allowed */}
          {canDismiss && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/80 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          )}

          {/* Header Icon */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400">
              {targetType === "puzzle" ? (
                <Gamepad2 size={24} />
              ) : (
                <GraduationCap size={24} />
              )}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-1">
                <Sparkles size={11} /> Welcome Visitor
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">
                Access {targetType === "puzzle" ? "Word Puzzles" : "Courses & Hub"}
              </h3>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Enter your name and email to explore the interactive courses, domain roadmaps, and word puzzles. 
            <span className="font-semibold text-foreground/90"> No password required!</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            {/* Name Input */}
            <div>
              <label htmlFor="visitor-name" className="block text-xs font-semibold text-foreground mb-1.5">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <User size={16} />
                </div>
                <input
                  id="visitor-name"
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="visitor-email" className="block text-xs font-semibold text-foreground mb-1.5">
                Your Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Mail size={16} />
                </div>
                <input
                  id="visitor-email"
                  type="email"
                  required
                  placeholder="e.g. ramesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Target Item Pill */}
            {targetItem && (
              <div className="p-2.5 rounded-xl bg-muted/60 border border-border/50 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Accessing:</span>
                <span className="font-semibold text-foreground truncate max-w-[200px]">
                  {targetItem}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Entering...</span>
              ) : (
                <>
                  <span>Continue to Learning Hub</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
            <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
            <span>Recorded in professor's admin portal for learner attendance & ranking.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
