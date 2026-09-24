import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./puzzle-celebration.css";

// Flowers and party props that shower down the screen
const PIECES = ["🌸", "🌺", "🌼", "🌷", "🌹", "💐", "🎉", "🎊", "🎈", "✨", "⭐", "🎀"];
const PIECE_COUNT = 70;
const SHOWER_MS = 7000;

interface PuzzleCelebrationProps {
  playerName: string;
  puzzleTitle: string;
  wordCount: number;
  time: string;
  hints: number;
  score: string;
  saveStatus: string | null;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
  onClose: () => void;
}

export function PuzzleCelebration({
  playerName,
  puzzleTitle,
  wordCount,
  time,
  hints,
  score,
  saveStatus,
  onPlayAgain,
  onViewLeaderboard,
  onClose,
}: PuzzleCelebrationProps) {
  const [showering, setShowering] = useState(true);

  const pieces = useMemo(
    () =>
      Array.from({ length: PIECE_COUNT }, (_, i) => ({
        id: i,
        emoji: PIECES[Math.floor(Math.random() * PIECES.length)],
        left: Math.random() * 100,
        size: 18 + Math.random() * 22,
        delay: Math.random() * 3.5,
        duration: 3.5 + Math.random() * 3,
        spin: `${(Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 540)}deg`,
      })),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowering(false), SHOWER_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="puzzle-celebration-title"
          onClick={(e) => e.stopPropagation()}
          className="celebration-card relative w-full max-w-sm bg-card rounded-3xl border border-accent/30 shadow-2xl p-7 text-center space-y-4"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>

          <div className="text-5xl">💐</div>
          <div className="space-y-1">
            <h3 id="puzzle-celebration-title" className="font-serif text-2xl font-bold text-primary">
              Congratulations{playerName ? `, ${playerName}` : ""}!
            </h3>
            <p className="text-sm text-muted-foreground">
              You found all {wordCount} key words in <strong>{puzzleTitle}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Time", value: time },
              { label: "Hints", value: String(hints) },
              { label: "Score", value: score },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-muted/70 border border-border py-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{stat.label}</div>
                <div className="font-mono font-bold text-primary">{stat.value}</div>
              </div>
            ))}
          </div>

          {saveStatus && <p className="text-xs text-muted-foreground">{saveStatus}</p>}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onViewLeaderboard}>
              View Leaderboard
            </Button>
            <Button variant="hero" size="sm" className="flex-1" onClick={onPlayAgain}>
              Play Again
            </Button>
          </div>
        </div>
      </div>

      {showering && (
        <div className="celebration-shower" aria-hidden="true">
          {pieces.map((p) => (
            <span
              key={p.id}
              className="celebration-piece"
              style={
                {
                  left: `${p.left}%`,
                  fontSize: `${p.size}px`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  "--spin": p.spin,
                } as React.CSSProperties
              }
            >
              <span>{p.emoji}</span>
            </span>
          ))}
        </div>
      )}
    </>,
    document.body
  );
}
