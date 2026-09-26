import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Lightbulb, RotateCcw, Timer, CheckCircle2, Puzzle, User, Home, ArrowLeft, Gamepad2 } from "lucide-react";
import { PuzzleLeaderboard, submitPuzzleScore, formatTime, HINT_PENALTY_SECONDS } from "@/components/ui/puzzle-leaderboard";
import { PuzzleCelebration } from "@/components/ui/puzzle-celebration";

const PLAYER_NAME_KEY = "qlearn_puzzle_player_name";

const readSavedName = () => {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY) || "";
  } catch {
    return "";
  }
};

export interface WordPuzzleData {
  id: string;
  title: string;
  words: string[];
}

interface PlacedWord {
  label: string;
  answer: string;
  cells: number[];
  color: string;
}

interface PuzzleLayout {
  size: number;
  letters: string[];
  placed: PlacedWord[];
}

const WORD_COLORS = ["#0891b2", "#7c3aed", "#db2777", "#16a34a", "#ea580c", "#2563eb", "#ca8a04", "#dc2626"];

const randomItem = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const neighbours = (cell: number, size: number) => {
  const r = Math.floor(cell / size);
  const c = cell % size;
  const result: number[] = [];
  if (r > 0) result.push(cell - size);
  if (r < size - 1) result.push(cell + size);
  if (c > 0) result.push(cell - 1);
  if (c < size - 1) result.push(cell + 1);
  return result;
};

const isAdjacent = (a: number, b: number, size: number) => neighbours(a, size).includes(b);

// Random path through every cell of the grid (snake start, scrambled with "backbite" moves)
const randomGridPath = (size: number) => {
  let path: number[] = [];
  for (let r = 0; r < size; r++) {
    for (let i = 0; i < size; i++) {
      path.push(r * size + (r % 2 === 0 ? i : size - 1 - i));
    }
  }
  const moves = size * size * 60;
  for (let k = 0; k < moves; k++) {
    if (Math.random() < 0.5) path.reverse();
    const end = path[path.length - 1];
    const options = neighbours(end, size).filter((n) => n !== path[path.length - 2]);
    const pivot = path.indexOf(randomItem(options));
    path = [...path.slice(0, pivot + 1), ...path.slice(pivot + 1).reverse()];
  }
  return path;
};

// Lay the words end to end along the random path; leftover cells stay empty
const buildPuzzle = (words: string[]): PuzzleLayout => {
  const entries = words
    .map((label) => ({ label, answer: label.toUpperCase().replace(/[^A-Z]/g, "") }))
    .sort(() => Math.random() - 0.5);
  const total = entries.reduce((sum, e) => sum + e.answer.length, 0);
  const size = Math.ceil(Math.sqrt(total));
  const path = randomGridPath(size);
  const letters: string[] = new Array(size * size).fill("");

  let k = 0;
  const placedByLabel = new Map<string, PlacedWord>();
  entries.forEach((entry) => {
    const cells = path.slice(k, k + entry.answer.length);
    cells.forEach((cell, j) => (letters[cell] = entry.answer[j]));
    placedByLabel.set(entry.label, { ...entry, cells, color: "" });
    k += entry.answer.length;
  });

  // Keep the word list (and its colours) in the order it was given
  return {
    size,
    letters,
    placed: words.map((w, idx) => ({
      ...placedByLabel.get(w)!,
      label: w.toUpperCase(),
      color: WORD_COLORS[idx % WORD_COLORS.length],
    })),
  };
};

const sameCells = (a: number[], b: number[]) => a.length === b.length && a.every((cell, i) => cell === b[i]);

export function WordPuzzle({
  puzzle,
  onBack,
  showNav = true,
  domains,
  activeDomainIndex,
  onSelectDomain,
  onBackToSubjects,
}: {
  puzzle: WordPuzzleData;
  onBack?: () => void;
  showNav?: boolean;
  domains?: Array<{ id: string; name: string; icon: string }>;
  activeDomainIndex?: number;
  onSelectDomain?: (domainIdx: number) => void;
  onBackToSubjects?: () => void;
}) {
  const [layout, setLayout] = useState<PuzzleLayout>(() => buildPuzzle(puzzle.words));
  const [found, setFound] = useState<string[]>([]);
  const [selection, setSelection] = useState<number[]>([]);
  const [hints, setHints] = useState<number[]>([]);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [lastFound, setLastFound] = useState<PlacedWord | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);

  // Reset layout and state whenever the puzzle changes
  useEffect(() => {
    setLayout(buildPuzzle(puzzle.words));
    setFound([]);
    setSelection([]);
    setHints([]);
    setMessage(null);
    setLastFound(null);
    setSeconds(0);
    setStarted(false);
    setSaveState("idle");
    setSavedScoreId(null);
    setCelebrationOpen(false);
  }, [puzzle.id, puzzle.words]);

  // Player name (asked in a pop-up before each game) and leaderboard submission
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState(readSavedName);
  const [namePromptOpen, setNamePromptOpen] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [savedScoreId, setSavedScoreId] = useState<string | null>(null);
  const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const leaderboardRef = useRef<HTMLDivElement>(null);

  const draggingRef = useRef(false);
  const selectionRef = useRef<number[]>([]);

  const { size, letters, placed } = layout;
  const isComplete = found.length === placed.length;
  const foundWords = placed.filter((p) => found.includes(p.answer));
  const foundCellColor = new Map<number, string>();
  foundWords.forEach((p) => p.cells.forEach((cell) => foundCellColor.set(cell, p.color)));
  // The first letter of each word is shown in that word's colour
  const startCellColor = new Map(placed.map((p) => [p.cells[0], p.color]));

  useEffect(() => {
    if (!started || isComplete) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [started, isComplete]);

  const updateSelection = (next: number[]) => {
    selectionRef.current = next;
    setSelection(next);
  };

  const cellAt = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    const attr = el?.closest("[data-cell]")?.getAttribute("data-cell");
    return attr == null ? null : Number(attr);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const cell = cellAt(e.clientX, e.clientY);
    if (!playerName) {
      setNamePromptOpen(true);
      return;
    }
    if (cell === null || !letters[cell] || isComplete || foundCellColor.has(cell)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    setStarted(true);
    setMessage(null);
    setLastFound(null);
    updateSelection([cell]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const cell = cellAt(e.clientX, e.clientY);
    const current = selectionRef.current;
    const last = current[current.length - 1];
    if (cell === null || cell === last) return;

    // Dragging back onto the previous letter undoes the last step
    if (current.length > 1 && cell === current[current.length - 2]) {
      updateSelection(current.slice(0, -1));
      return;
    }
    if (!letters[cell] || current.includes(cell) || foundCellColor.has(cell) || !isAdjacent(last, cell, size)) return;
    updateSelection([...current, cell]);
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const current = selectionRef.current;
    updateSelection([]);
    if (current.length < 2) return;

    const reversed = [...current].reverse();
    const match = placed.find(
      (p) => !found.includes(p.answer) && (sameCells(p.cells, current) || sameCells(p.cells, reversed))
    );
    if (match) {
      setFound((prev) => [...prev, match.answer]);
      setLastFound(match);
      setMessage({ ok: true, text: `Well done! You found "${match.label}".` });
    } else {
      setMessage({ ok: false, text: `"${current.map((c) => letters[c]).join("")}" is not one of the key words. Try again!` });
    }
  };

  const giveHint = () => {
    // Start letters are always coloured, so a hint lights up a word's second letter
    const candidates = placed.filter((p) => !found.includes(p.answer) && !hints.includes(p.cells[1]));
    if (candidates.length === 0 || !playerName) return;
    setStarted(true);
    setHints((prev) => [...prev, randomItem(candidates).cells[1]]);
    setMessage({ ok: true, text: "A glowing letter shows the second letter of a hidden word." });
  };

  const newPuzzle = () => {
    setLayout(buildPuzzle(puzzle.words));
    setFound([]);
    setHints([]);
    setMessage(null);
    setLastFound(null);
    setSeconds(0);
    setStarted(false);
    setSaveState("idle");
    setCelebrationOpen(false);
    updateSelection([]);
    setNameInput(playerName || readSavedName());
    setPlayerName("");
    setNamePromptOpen(true);
  };

  const confirmName = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim().slice(0, 30);
    if (!name) return;
    setPlayerName(name);
    setNameInput(name);
    setNamePromptOpen(false);
    try {
      localStorage.setItem(PLAYER_NAME_KEY, name);
    } catch {
      // Remembering the name is only a convenience
    }
  };

  const saveScore = async () => {
    setSaveState("saving");
    try {
      const id = await submitPuzzleScore(puzzle.id, playerName, seconds, hints.length);
      setSavedScoreId(id);
      setSaveState("saved");
      setLeaderboardRefresh((n) => n + 1);
    } catch (err) {
      console.error("Failed saving puzzle score", err);
      setSaveState("error");
    }
  };

  // Save the score automatically as soon as the puzzle is solved
  useEffect(() => {
    if (isComplete && playerName && saveState === "idle") saveScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, playerName, saveState]);

  // Celebrate with a flower shower the moment the last word is found
  useEffect(() => {
    if (isComplete) setCelebrationOpen(true);
  }, [isComplete]);

  const viewLeaderboard = () => {
    setCelebrationOpen(false);
    leaderboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const saveStatusText =
    saveState === "saving"
      ? "Saving your score to the leaderboard…"
      : saveState === "saved"
      ? "Your score is on the leaderboard!"
      : saveState === "error"
      ? "Couldn't save your score right now."
      : null;

  const centre = (cell: number) => `${(cell % size) + 0.5},${Math.floor(cell / size) + 0.5}`;
  const hintsLeft = placed.some((p) => !found.includes(p.answer) && !hints.includes(p.cells[1]));

  return (
    <div className="space-y-8">
      <div className="card-institutional p-6 md:p-8 space-y-6 animate-fade-in">
        {/* Navigation Bar inside Puzzle */}
        {showNav && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-muted/60 hover:bg-muted text-foreground text-xs font-semibold transition-all hover:scale-105 shadow-xs"
              >
                <Home size={14} className="text-accent" /> Home
              </Link>
              {onBackToSubjects && (
                <button
                  type="button"
                  onClick={onBackToSubjects}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold transition-all hover:scale-105 shadow-xs"
                >
                  <Gamepad2 size={14} /> Change Subject
                </button>
              )}
              {onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-semibold transition-all hover:scale-105 shadow-xs"
                >
                  <ArrowLeft size={14} /> Back to Courses
                </button>
              ) : (
                <Link
                  to="/qlearn"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-semibold transition-all hover:scale-105 shadow-xs"
                >
                  <ArrowLeft size={14} /> Back to Courses
                </Link>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Interactive Word Connect</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-accent/15 border border-accent/30 rounded-full flex items-center justify-center mx-auto text-accent">
            <Puzzle size={26} />
          </div>
          <h3 className="font-serif text-2xl font-bold text-primary">{puzzle.title}</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Drag across connected letters (up, down, left or right) to find all {placed.length} hidden words.
            Each word starts on the letter shown in its colour.
          </p>
        </div>

        {/* Status bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm font-semibold">
          {playerName && (
            <button
              type="button"
              onClick={() => setNamePromptOpen(true)}
              disabled={isComplete}
              title="Change name"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-primary hover:bg-accent/20 transition-colors disabled:hover:bg-accent/10"
            >
              <User size={15} className="text-accent" /> Playing as <span className="max-w-[10rem] truncate">{playerName}</span>
            </button>
          )}
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border">
            <CheckCircle2 size={15} className="text-accent" /> {found.length} / {placed.length} found
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border font-mono">
            <Timer size={15} className="text-accent" /> {formatTime(seconds)}
          </span>
          <Button variant="outline" size="sm" onClick={giveHint} disabled={isComplete || !hintsLeft || !playerName} className="flex items-center gap-1.5">
            <Lightbulb size={15} /> Hint
          </Button>
          <Button variant="outline" size="sm" onClick={newPuzzle} className="flex items-center gap-1.5">
            <RotateCcw size={15} /> New Puzzle
          </Button>
        </div>

        <div className="grid md:grid-cols-[1fr_220px] gap-8 items-start">
          {/* Letter grid */}
          <div className="w-full max-w-md mx-auto">
            {/* Preview of the word being traced (or the word just found, in its colour) */}
            <div className="min-h-[3.25rem] mb-3 px-2 py-2 rounded-xl border border-dashed border-border bg-card/60 flex flex-wrap items-center justify-center gap-1">
              {selection.length > 0 ? (
                selection.map((c, i) => (
                  <span
                    key={i}
                    className="w-7 h-8 rounded-md bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold shadow-sm animate-fade-in"
                  >
                    {letters[c]}
                  </span>
                ))
              ) : lastFound ? (
                lastFound.answer.split("").map((letter, i) => (
                  <span
                    key={i}
                    className="w-7 h-8 rounded-md text-white flex items-center justify-center text-sm font-bold shadow-sm"
                    style={{ backgroundColor: lastFound.color }}
                  >
                    {letter}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">Drag across the letters: your word appears here</span>
              )}
            </div>
            <div
              className="relative aspect-square select-none touch-none rounded-2xl bg-muted/60 border border-border/80 shadow-inner"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              role="application"
              aria-label={`${puzzle.title} letter grid`}
            >
              {!playerName && !namePromptOpen && (
                <div className="absolute inset-0 z-10 rounded-2xl bg-background/70 backdrop-blur-[2px] flex items-center justify-center">
                  <Button variant="hero" size="sm" onClick={() => setNamePromptOpen(true)} className="flex items-center gap-1.5">
                    <User size={15} /> Enter your name to start
                  </Button>
                </div>
              )}
              {/* Lines joining the letters of found words and the current drag */}
              <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 w-full h-full pointer-events-none">
                {foundWords.map((p) => (
                  <polyline
                    key={p.answer}
                    points={p.cells.map(centre).join(" ")}
                    fill="none"
                    stroke={p.color}
                    strokeOpacity={0.45}
                    strokeWidth={0.3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {selection.length > 1 && (
                  <polyline
                    points={selection.map(centre).join(" ")}
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeOpacity={0.5}
                    strokeWidth={0.3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>

              <div className="relative grid w-full h-full" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
                {letters.map((letter, cell) => {
                  const colour = foundCellColor.get(cell);
                  const isSelected = selection.includes(cell);
                  const isHint = hints.includes(cell) && !colour;
                  const startColour = !colour && !isSelected ? startCellColor.get(cell) : undefined;
                  if (!letter) return <div key={cell} />;
                  return (
                    <div key={cell} data-cell={cell} className="flex items-center justify-center cursor-pointer">
                      <span
                        className={`w-[76%] h-[76%] rounded-full flex items-center justify-center text-sm sm:text-lg font-bold transition-all duration-150 ${
                          colour
                            ? "text-white shadow-sm"
                            : isSelected
                            ? "bg-accent text-accent-foreground scale-110 shadow-md"
                            : startColour
                            ? "bg-card border-2"
                            : "bg-card text-foreground border border-border/70 hover:border-accent/60"
                        } ${isHint ? "ring-2 ring-amber-400 ring-offset-1 animate-pulse" : ""}`}
                        style={
                          colour
                            ? { backgroundColor: colour }
                            : startColour
                            ? {
                                // Light tint of the word colour laid over the card background
                                backgroundImage: `linear-gradient(${startColour}26, ${startColour}26)`,
                                borderColor: startColour,
                                color: startColour,
                              }
                            : undefined
                        }
                      >
                        {letter}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="min-h-[2.5rem] mt-3 text-center text-sm font-medium">
              {message && <span className={message.ok ? "text-green-600" : "text-red-500"}>{message.text}</span>}
            </div>
          </div>

          {/* Word list */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Key Words</h4>
            {placed.map((p) => {
              const isFound = found.includes(p.answer);
              return (
                <div
                  key={p.answer}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-l-4 text-sm transition-colors ${
                    isFound ? "text-white font-semibold" : "bg-card text-muted-foreground"
                  }`}
                  style={isFound ? { backgroundColor: p.color, borderColor: p.color } : { borderLeftColor: p.color }}
                >
                  <span className="flex items-center gap-2">
                    {!isFound && <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />}
                    <span className={isFound ? "" : "font-mono tracking-widest"}>
                      {isFound ? p.label : p.label.replace(/[A-Za-z]/g, "_")}
                    </span>
                  </span>
                  <span className="text-[11px] opacity-80">{p.answer.length}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion */}
        {isComplete && (
          <div className="text-center p-6 rounded-xl bg-accent/10 border border-accent/30 space-y-3 animate-slide-up">
            <div className="text-4xl">🎉</div>
            <h4 className="font-serif text-xl font-bold text-primary">Puzzle solved!</h4>
            <p className="text-sm text-muted-foreground">
              You found all {placed.length} key words in {formatTime(seconds)}
              {hints.length > 0 ? ` using ${hints.length} hint${hints.length > 1 ? "s" : ""}` : " without any hints"}.
            </p>

            {saveState === "saved" && (
              <p className="text-sm font-semibold text-green-600">Your score is on the leaderboard below!</p>
            )}
            {saveState === "saving" && <p className="text-sm text-muted-foreground">Saving your score…</p>}
            {saveState === "error" && (
              <p className="text-xs text-red-500">
                Couldn't save your score right now.{" "}
                <button type="button" onClick={saveScore} className="underline font-semibold">
                  Try again
                </button>
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Button variant="hero" size="sm" onClick={newPuzzle}>
                Play Again
              </Button>
              {onBackToSubjects && (
                <Button variant="outline" size="sm" onClick={onBackToSubjects} className="flex items-center gap-1.5 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10">
                  <Gamepad2 size={14} /> Change Subject
                </Button>
              )}
              {onBack ? (
                <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-1.5">
                  <ArrowLeft size={14} /> Back to Courses
                </Button>
              ) : (
                <Link to="/qlearn">
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                    <ArrowLeft size={14} /> Back to Courses
                  </Button>
                </Link>
              )}
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                  <Home size={14} className="text-accent" /> Home
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div ref={leaderboardRef} className="scroll-mt-24">
        <PuzzleLeaderboard puzzleId={puzzle.id} refreshKey={leaderboardRefresh} highlightId={savedScoreId} />
      </div>

      {celebrationOpen && (
        <PuzzleCelebration
          playerName={playerName}
          puzzleTitle={puzzle.title}
          wordCount={placed.length}
          time={formatTime(seconds)}
          hints={hints.length}
          score={formatTime(seconds + hints.length * HINT_PENALTY_SECONDS)}
          saveStatus={saveStatusText}
          onPlayAgain={newPuzzle}
          onViewLeaderboard={viewLeaderboard}
          onClose={() => setCelebrationOpen(false)}
        />
      )}

      {/* Name and Subject pop-up shown before each game */}
      {namePromptOpen && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onKeyDown={(e) => e.key === "Escape" && setNamePromptOpen(false)}
        >
          <form
            onSubmit={confirmName}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${puzzle.id}-name-title`}
            className="w-full max-w-sm bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-4 text-center animate-slide-up"
          >
            <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-500">
              <Gamepad2 size={22} />
            </div>
            <div className="space-y-1">
              <h4 id={`${puzzle.id}-name-title`} className="font-serif text-lg font-bold text-primary">
                Word Puzzle Challenge
              </h4>
              <p className="text-xs text-muted-foreground">Select your subject and enter your name to start!</p>
            </div>

            {/* Subject Selector inside the dialog */}
            {domains && domains.length > 0 && (
              <div className="bg-muted/50 p-2.5 rounded-xl border border-border text-left space-y-1.5">
                <label htmlFor="puzzle-subject-select" className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Puzzle Subject:
                </label>
                <select
                  id="puzzle-subject-select"
                  value={activeDomainIndex ?? 0}
                  onChange={(e) => {
                    const newIdx = Number(e.target.value);
                    if (onSelectDomain) {
                      onSelectDomain(newIdx);
                    }
                  }}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer"
                >
                  {domains.map((d, i) => (
                    <option key={d.id} value={i}>
                      {d.icon} {d.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5 text-left">
              <label htmlFor="puzzle-player-name-input" className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Your Name (for Leaderboard):
              </label>
              <input
                id="puzzle-player-name-input"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={30}
                autoFocus
                placeholder="Enter your name"
                aria-label="Your name"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setNamePromptOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="hero" size="sm" className="flex-1" disabled={!nameInput.trim()}>
                {playerName ? "Save & Play" : "Start Game"}
              </Button>
            </div>
          </form>
        </div>,
        document.body
      )}
    </div>
  );
}
