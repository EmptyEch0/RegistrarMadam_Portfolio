import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trophy } from "lucide-react";

export const HINT_PENALTY_SECONDS = 30;

export interface PuzzleScore {
  id: string;
  player_name: string;
  seconds: number;
  hints: number;
  total_seconds: number;
  created_at: string;
}

export const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export const submitPuzzleScore = async (puzzleId: string, playerName: string, seconds: number, hints: number) => {
  const { data, error } = await supabase
    .from("puzzle_scores")
    .insert({ puzzle_id: puzzleId, player_name: playerName, seconds, hints })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
};

const MEDALS = ["🥇", "🥈", "🥉"];

export function PuzzleLeaderboard({
  puzzleId,
  refreshKey,
  highlightId,
}: {
  puzzleId: string;
  refreshKey: number;
  highlightId: string | null;
}) {
  const [scores, setScores] = useState<PuzzleScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("puzzle_scores")
        .select("id, player_name, seconds, hints, total_seconds, created_at")
        .eq("puzzle_id", puzzleId)
        .order("total_seconds", { ascending: true })
        .order("created_at", { ascending: true })
        .limit(10);
      if (cancelled) return;
      if (error) {
        console.error("Failed loading puzzle leaderboard", error);
        setUnavailable(true);
      } else {
        setUnavailable(false);
        setScores(data || []);
      }
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [puzzleId, refreshKey]);

  return (
    <div className="card-institutional p-6 md:p-8 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h4 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
          <Trophy size={20} className="text-accent" /> Leaderboard: Top 10
        </h4>
        <span className="text-[11px] text-muted-foreground">
          Score = time + {HINT_PENALTY_SECONDS}s per hint · lower is better
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-6">Loading scores…</p>
      ) : unavailable ? (
        <p className="text-sm text-muted-foreground text-center py-6">The leaderboard is not available right now.</p>
      ) : scores.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">No scores yet. Solve the puzzle and be the first!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pr-2 w-12">Rank</th>
                <th className="py-2 pr-2">Name</th>
                <th className="py-2 pr-2 text-right">Time</th>
                <th className="py-2 pr-2 text-right">Hints</th>
                <th className="py-2 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, i) => (
                <tr
                  key={s.id}
                  className={`border-b border-border/50 last:border-0 ${
                    s.id === highlightId ? "bg-accent/15 font-semibold" : ""
                  }`}
                >
                  <td className="py-2.5 pr-2 font-bold">{MEDALS[i] ?? i + 1}</td>
                  <td className="py-2.5 pr-2 break-all">
                    {s.player_name}
                    {s.id === highlightId && <span className="ml-2 text-[10px] text-accent uppercase">You</span>}
                  </td>
                  <td className="py-2.5 pr-2 text-right font-mono">{formatTime(s.seconds)}</td>
                  <td className="py-2.5 pr-2 text-right">{s.hints}</td>
                  <td className="py-2.5 text-right font-mono font-bold text-primary">{formatTime(s.total_seconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
