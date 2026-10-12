import { useState, useEffect } from "react";
import { UserCheck, Edit3, LogOut, Check } from "lucide-react";
import { getSavedVisitor, saveVisitorProfile, clearVisitorProfile, VisitorProfile } from "@/lib/visitorTracking";

interface VisitorProfileBadgeProps {
  onProfileChanged?: (profile: VisitorProfile | null) => void;
}

export function VisitorProfileBadge({ onProfileChanged }: VisitorProfileBadgeProps) {
  const [visitor, setVisitor] = useState<VisitorProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const refreshVisitor = () => {
    const v = getSavedVisitor();
    setVisitor(v);
    if (v) {
      setName(v.name);
      setEmail(v.email);
    }
  };

  useEffect(() => {
    refreshVisitor();

    // Listen for storage changes across tabs or inside the same window
    const handleStorage = () => refreshVisitor();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (!visitor) return null;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const updated = saveVisitorProfile(name.trim(), email.trim());
    setVisitor(updated);
    setIsEditing(false);
    onProfileChanged?.(updated);
  };

  const handleClear = () => {
    if (confirm("Sign out of this visitor profile? You will be prompted again when accessing courses or puzzles.")) {
      clearVisitorProfile();
      setVisitor(null);
      setIsEditing(false);
      onProfileChanged?.(null);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs text-foreground shadow-xs animate-fade-in">
      <UserCheck size={14} className="text-amber-500 shrink-0" />
      <span className="text-muted-foreground">Learner:</span>
      <span className="font-semibold text-foreground truncate max-w-[130px] sm:max-w-[200px]">
        {visitor.name}
      </span>
      <span className="hidden sm:inline text-muted-foreground/80 text-[11px] truncate max-w-[180px]">
        ({visitor.email})
      </span>

      <div className="flex items-center gap-1 border-l border-amber-500/20 pl-2 ml-1">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="p-1 rounded-md text-amber-600 hover:text-amber-700 hover:bg-amber-500/15 transition-colors"
          title="Edit your visitor details"
        >
          <Edit3 size={12} />
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
          title="Sign out"
        >
          <LogOut size={12} />
        </button>
      </div>

      {/* Quick edit dialog */}
      {isEditing && (
        <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-sm bg-card rounded-2xl border border-border p-5 shadow-2xl space-y-3"
          >
            <h4 className="font-semibold text-sm text-foreground">Update Your Visitor Profile</h4>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 flex items-center gap-1"
              >
                <Check size={12} /> Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
