import { useState } from "react";
import {
  FileDown,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  Code2,
  Lightbulb,
  Award,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  Printer,
  FileText,
  RotateCcw,
  Target,
  Key,
  Layers,
  Building2,
  CheckSquare,
  MessageSquareQuote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorksheetData, WORKSHEETS_DATA } from "@/data/worksheetsData";

interface WorksheetViewerProps {
  initialUnitNumber?: number;
  onSelectUnit?: (unitNum: number) => void;
  className?: string;
}

export function WorksheetViewer({
  initialUnitNumber = 2,
  onSelectUnit,
  className = "",
}: WorksheetViewerProps) {
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<number>(initialUnitNumber);
  const [activeSectionTab, setActiveSectionTab] = useState<
    "practice" | "concepts" | "theory" | "practical" | "casestudy" | "assessment" | "answers"
  >("practice");

  // Interactive state for MCQs
  const [mcqSelections, setMcqSelections] = useState<Record<number, number>>({});
  const [revealedMcqExplanations, setRevealedMcqExplanations] = useState<Record<number, boolean>>({});

  // Interactive state for True/False
  const [tfSelections, setTfSelections] = useState<Record<number, boolean>>({});

  // Interactive state for Fill in the Blanks
  const [fillInputs, setFillInputs] = useState<Record<number, string>>({});
  const [revealedFills, setRevealedFills] = useState<Record<number, boolean>>({});

  // Match the Following state
  const [matchSelections, setMatchSelections] = useState<Record<number, string>>({});

  // Theory reveal toggles
  const [revealedShort, setRevealedShort] = useState<Record<number, boolean>>({});
  const [revealedDesc, setRevealedDesc] = useState<Record<number, boolean>>({});

  // Self assessment state
  const [selfRatings, setSelfRatings] = useState<Record<number, "yes" | "partly" | "no">>({});

  // Reflection inputs
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<number, string>>({});

  // Instructor Answer Key master toggle
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  // Terminology search
  const [searchTerm, setSearchTerm] = useState("");

  const currentWorksheet =
    WORKSHEETS_DATA.find((w) => w.unitNumber === selectedUnitNumber) || WORKSHEETS_DATA[0];

  const handleUnitChange = (num: number) => {
    setSelectedUnitNumber(num);
    setMcqSelections({});
    setRevealedMcqExplanations({});
    setTfSelections({});
    setFillInputs({});
    setRevealedFills({});
    setMatchSelections({});
    setRevealedShort({});
    setRevealedDesc({});
    setSelfRatings({});
    setSearchTerm("");
    if (onSelectUnit) onSelectUnit(num);
  };

  const handleResetPractice = () => {
    setMcqSelections({});
    setRevealedMcqExplanations({});
    setTfSelections({});
    setFillInputs({});
    setRevealedFills({});
    setMatchSelections({});
  };

  // MCQ stats
  const totalMcqs = currentWorksheet.mcqs.length;
  const answeredMcqs = Object.keys(mcqSelections).length;
  const correctMcqs = currentWorksheet.mcqs.filter(
    (m) => mcqSelections[m.id] === m.correctIndex
  ).length;

  // True/False stats
  const totalTf = currentWorksheet.trueFalse.length;
  const correctTf = currentWorksheet.trueFalse.filter(
    (tf) => tfSelections[tf.id] === tf.isTrue
  ).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Unit Selector Pills Header */}
      <div className="card-institutional p-5 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Official Curriculum Worksheets
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {currentWorksheet.course}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-primary">
              {currentWorksheet.title} — {currentWorksheet.unitName}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl line-clamp-2">
              <strong className="text-foreground">Topics:</strong> {currentWorksheet.topics}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {currentWorksheet.docxFileName && (
              <a
                href={`/worksheets/${encodeURIComponent(currentWorksheet.docxFileName)}`}
                download={currentWorksheet.docxFileName}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold hover:bg-accent/90 transition-all shadow-sm hover:scale-105"
              >
                <FileDown size={15} /> Download .DOCX
              </a>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs py-2 px-3 rounded-xl border-border"
            >
              <Printer size={14} /> Print Worksheet
            </Button>
          </div>
        </div>

        {/* Unit Selector Tabs */}
        <div className="mt-5 pt-4 border-t border-border/80 flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0 pr-1">
            Select Unit:
          </span>
          {WORKSHEETS_DATA.map((w) => {
            const isSelected = selectedUnitNumber === w.unitNumber;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => handleUnitChange(w.unitNumber)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md scale-105 ring-2 ring-accent/40"
                    : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70"
                }`}
              >
                <span>Unit {w.unitNumber}</span>
                <span className="hidden sm:inline font-normal opacity-85">
                  ({w.unitName.split(":")[0].slice(0, 20)}...)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Worksheet Content Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-1.5 bg-muted/60 backdrop-blur-md rounded-2xl border border-border shadow-inner">
        {[
          { id: "practice", label: "MCQ & Blanks", icon: CheckCircle2 },
          { id: "concepts", label: "Key Concepts", icon: BookOpen },
          { id: "theory", label: "Short & Long", icon: FileText },
          { id: "practical", label: "Practical Lab", icon: Code2 },
          { id: "casestudy", label: "Case Study & Map", icon: Building2 },
          { id: "assessment", label: "Self-Review", icon: CheckSquare },
          { id: "answers", label: "Answer Key", icon: Key },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeSectionTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSectionTab(tab.id as any)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-card text-accent shadow-md shadow-accent/10 ring-1 ring-accent/30 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
            >
              <TabIcon size={16} className={isActive ? "text-accent" : "text-muted-foreground"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= SECTION TAB: PRACTICE (MCQ, BLANKS, TRUE/FALSE, MATCHING) ================= */}
      {activeSectionTab === "practice" && (
        <div className="space-y-8 animate-fade-in">
          {/* Progress Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-accent/10 border border-accent/20 text-accent text-xs md:text-sm font-semibold">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} /> MCQs: {answeredMcqs}/{totalMcqs} answered (Score: {correctMcqs}/{answeredMcqs || 1})
              </span>
              <span className="hidden sm:inline opacity-40">•</span>
              <span>True/False: {Object.keys(tfSelections).length}/{totalTf} answered</span>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={handleResetPractice}
              className="flex items-center gap-1 text-xs py-1 px-2.5 bg-card/80 border-accent/30 hover:bg-card"
            >
              <RotateCcw size={12} /> Reset Answers
            </Button>
          </div>

          {/* SECTION D: Multiple Choice Questions */}
          <div className="card-institutional p-6 md:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Section D</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Easy–Medium</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                Multiple-Choice Questions (10 Questions)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select the correct option for instant grading and detailed explanation.
              </p>
            </div>

            <div className="space-y-6">
              {currentWorksheet.mcqs.map((mcq, qIdx) => {
                const selected = mcqSelections[mcq.id];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === mcq.correctIndex;
                const isExplRevealed = revealedMcqExplanations[mcq.id];

                return (
                  <div
                    key={mcq.id}
                    className={`p-5 rounded-2xl border transition-all duration-200 ${
                      isAnswered
                        ? isCorrect
                          ? "bg-emerald-500/5 border-emerald-500/30"
                          : "bg-red-500/5 border-red-500/30"
                        : "bg-card border-border/80 hover:border-accent/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted font-bold text-xs flex items-center justify-center text-primary mt-0.5">
                        {qIdx + 1}
                      </span>
                      <div className="flex-grow space-y-3">
                        <p className="text-sm md:text-base font-semibold text-foreground leading-snug">
                          {mcq.question}
                        </p>

                        {/* Options Grid */}
                        <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
                          {mcq.options.map((opt, optIdx) => {
                            const optLetter = ["A", "B", "C", "D"][optIdx];
                            const isChosen = selected === optIdx;
                            const isCorrectOpt = optIdx === mcq.correctIndex;

                            let btnStyle = "bg-muted/50 border-border hover:bg-muted/80 text-foreground";
                            if (isAnswered) {
                              if (isCorrectOpt) {
                                btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold ring-1 ring-emerald-500";
                              } else if (isChosen && !isCorrect) {
                                btnStyle = "bg-red-500/20 border-red-500 text-red-700 dark:text-red-300 font-semibold ring-1 ring-red-500";
                              } else {
                                btnStyle = "bg-muted/30 border-border/50 text-muted-foreground opacity-60";
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => {
                                  setMcqSelections((prev) => ({ ...prev, [mcq.id]: optIdx }));
                                }}
                                className={`flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs md:text-sm transition-all ${btnStyle}`}
                              >
                                <span className="w-5 h-5 rounded-md bg-card/80 border border-border/70 flex-shrink-0 flex items-center justify-center font-bold text-[11px]">
                                  {optLetter}
                                </span>
                                <span className="flex-grow leading-tight mt-0.5">{opt}</span>
                                {isAnswered && isCorrectOpt && (
                                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                )}
                                {isAnswered && isChosen && !isCorrect && (
                                  <XCircle size={16} className="text-red-500 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation & Reveal */}
                        {isAnswered && (
                          <div className="pt-2 flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-xs font-bold ${
                                  isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {isCorrect ? "✓ Correct Answer!" : `✗ Incorrect (Correct Answer: ${mcq.correctOption})`}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setRevealedMcqExplanations((prev) => ({
                                    ...prev,
                                    [mcq.id]: !prev[mcq.id],
                                  }))
                                }
                                className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
                              >
                                {isExplRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                                {isExplRevealed ? "Hide Explanation" : "View Explanation"}
                              </button>
                            </div>

                            {isExplRevealed && mcq.explanation && (
                              <div className="p-3 rounded-xl bg-muted/80 border border-border text-xs text-muted-foreground leading-relaxed animate-fade-in">
                                <strong className="text-foreground">Explanation:</strong> {mcq.explanation}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION E: Fill in the Blanks */}
          <div className="card-institutional p-6 md:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Section E</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Easy</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                Fill in the Blanks (5 Questions)
              </h3>
            </div>

            <div className="space-y-4">
              {currentWorksheet.fillInBlanks.map((fill, idx) => {
                const isRevealed = revealedFills[fill.id];
                const userVal = fillInputs[fill.id] || "";
                const isMatch =
                  userVal.trim().toLowerCase() === fill.answer.trim().toLowerCase();

                return (
                  <div key={fill.id} className="p-4 rounded-xl bg-card border border-border/80 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="font-bold text-xs text-accent mt-0.5">{idx + 1}.</span>
                      <p className="text-sm font-medium text-foreground leading-relaxed flex-grow">
                        {fill.question}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <input
                        type="text"
                        placeholder="Type your answer..."
                        value={userVal}
                        onChange={(e) =>
                          setFillInputs((prev) => ({ ...prev, [fill.id]: e.target.value }))
                        }
                        className="px-3.5 py-1.5 text-xs md:text-sm rounded-lg border border-border bg-background max-w-xs flex-grow focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() =>
                          setRevealedFills((prev) => ({ ...prev, [fill.id]: !prev[fill.id] }))
                        }
                        className="text-xs py-1.5 px-3 rounded-lg"
                      >
                        {isRevealed ? <EyeOff size={13} className="mr-1" /> : <Eye size={13} className="mr-1" />}
                        {isRevealed ? "Hide Answer" : "Show Answer"}
                      </Button>
                      {userVal && (
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            isMatch
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {isMatch ? "✓ Matches" : "Review spelling"}
                        </span>
                      )}
                    </div>

                    {isRevealed && (
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 font-semibold animate-fade-in">
                        Correct Answer: <span className="font-mono">{fill.answer}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION F: True or False */}
          <div className="card-institutional p-6 md:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Section F</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Easy</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                True or False (5 Questions)
              </h3>
            </div>

            <div className="space-y-3">
              {currentWorksheet.trueFalse.map((tf, idx) => {
                const userChoice = tfSelections[tf.id];
                const isAnswered = userChoice !== undefined;
                const isCorrect = userChoice === tf.isTrue;

                return (
                  <div
                    key={tf.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                      isAnswered
                        ? isCorrect
                          ? "bg-emerald-500/5 border-emerald-500/30"
                          : "bg-red-500/5 border-red-500/30"
                        : "bg-card border-border/80"
                    }`}
                  >
                    <div className="flex items-start gap-2.5 flex-grow">
                      <span className="font-bold text-xs text-accent mt-0.5">{idx + 1}.</span>
                      <p className="text-sm text-foreground font-medium">{tf.statement}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {[true, false].map((val) => {
                        const isChosen = userChoice === val;
                        let btnColor = "bg-muted/60 border-border text-foreground hover:bg-muted";
                        if (isAnswered) {
                          if (val === tf.isTrue) {
                            btnColor = "bg-emerald-500 text-white font-bold";
                          } else if (isChosen && !isCorrect) {
                            btnColor = "bg-red-500 text-white font-bold";
                          } else {
                            btnColor = "bg-muted/30 border-border/40 text-muted-foreground opacity-50";
                          }
                        }

                        return (
                          <button
                            key={String(val)}
                            type="button"
                            onClick={() => setTfSelections((prev) => ({ ...prev, [tf.id]: val }))}
                            className={`px-4 py-1.5 rounded-lg border text-xs font-semibold transition-all ${btnColor}`}
                          >
                            {val ? "True" : "False"}
                          </button>
                        );
                      })}
                      {isAnswered && (
                        <span className="ml-1">
                          {isCorrect ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : (
                            <XCircle size={16} className="text-red-500" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION G: Match the Following */}
          <div className="card-institutional p-6 md:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Section G</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Medium</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                Match the Following
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Match each concept in Column A with its definition in Column B.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Column A</h4>
                {currentWorksheet.matchTheFollowing.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-card border border-border/80 text-xs md:text-sm font-semibold text-foreground flex items-center justify-between shadow-xs"
                  >
                    <span>{item.left}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Column B (Shuffled)</h4>
                {currentWorksheet.matchTheFollowing.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-muted/40 border border-border/80 text-xs md:text-sm text-muted-foreground shadow-xs"
                  >
                    <span>{item.right}</span>
                  </div>
                ))}
              </div>
            </div>

            {currentWorksheet.answerKey.matchKey && (
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2 text-xs font-bold text-accent mb-1">
                  <Key size={14} /> Matching Solution Key:
                </div>
                <div className="text-xs sm:text-sm font-mono font-bold text-foreground">
                  {currentWorksheet.answerKey.matchKey}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= SECTION TAB: KEY CONCEPTS & TERMINOLOGY ================= */}
      {activeSectionTab === "concepts" && (
        <div className="space-y-8 animate-fade-in">
          {/* SECTION A: Learning Objectives */}
          <div className="card-institutional p-6 md:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Section A</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Curriculum Standards</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                🎯 Learning Objectives
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Core competencies and skills students master in this unit.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              {currentWorksheet.learningObjectives.map((obj, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/80 shadow-xs"
                >
                  <span className="w-6 h-6 rounded-full bg-accent/10 text-accent font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-xs md:text-sm text-foreground font-medium leading-relaxed">
                    {obj}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION B: Key Concepts */}
          <div className="card-institutional p-6 md:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Section B</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Core Theory</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                🔑 Key Concepts Overview
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentWorksheet.keyConcepts.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-card border border-border/80 hover:border-accent/50 transition-all shadow-xs flex flex-col justify-between space-y-2"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/10 text-accent">
                        #{item.id}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm md:text-base text-primary">
                      {item.concept}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION C: Terminology */}
          <div className="card-institutional p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">Section C</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Glossary</span>
                </div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                  📘 Important Terminology ({currentWorksheet.terminology.length} Terms)
                </h3>
              </div>
              <input
                type="text"
                placeholder="Search terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-border bg-background w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentWorksheet.terminology
                .filter(
                  (t) =>
                    !searchTerm ||
                    t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.definition.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-xl bg-muted/40 border border-border/80 space-y-1.5 shadow-xs"
                  >
                    <div className="font-bold text-xs md:text-sm text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      <span>{t.term}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-4">
                      {t.definition}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION TAB: THEORY & DISCUSSION ================= */}
      {activeSectionTab === "theory" && (
        <div className="space-y-8 animate-fade-in">
          {/* SECTION H: Short-Answer Questions */}
          <div className="card-institutional p-6 md:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Section H</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Medium</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                📝 Short-Answer Questions
              </h3>
            </div>

            <div className="space-y-4">
              {currentWorksheet.shortAnswerQuestions.map((q, idx) => {
                const isRevealed = revealedShort[q.id];
                return (
                  <div key={q.id} className="p-5 rounded-xl bg-card border border-border/80 space-y-3 shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-accent/10 text-accent font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm md:text-base font-semibold text-foreground leading-snug">
                          {q.question}
                        </h4>
                      </div>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() =>
                          setRevealedShort((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                        }
                        className="text-xs py-1.5 px-3 shrink-0 rounded-lg"
                      >
                        {isRevealed ? <EyeOff size={13} className="mr-1" /> : <Eye size={13} className="mr-1" />}
                        {isRevealed ? "Hide Points" : "Model Key Points"}
                      </Button>
                    </div>

                    {isRevealed && (
                      <div className="p-3.5 rounded-xl bg-muted/80 border border-border text-xs md:text-sm text-foreground leading-relaxed animate-fade-in pl-4 border-l-4 border-l-accent">
                        <strong className="text-primary block mb-1">Key Points / Model Answer:</strong>
                        {q.keyPoint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION I: Descriptive Questions */}
          <div className="card-institutional p-6 md:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Section I</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Medium–Advanced</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                📄 Descriptive Questions
              </h3>
            </div>

            <div className="space-y-4">
              {currentWorksheet.descriptiveQuestions.map((q, idx) => {
                const isRevealed = revealedDesc[q.id];
                return (
                  <div key={q.id} className="p-5 rounded-xl bg-card border border-border/80 space-y-3 shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm md:text-base font-semibold text-foreground leading-snug">
                          {q.question}
                        </h4>
                      </div>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() =>
                          setRevealedDesc((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                        }
                        className="text-xs py-1.5 px-3 shrink-0 rounded-lg"
                      >
                        {isRevealed ? <EyeOff size={13} className="mr-1" /> : <Eye size={13} className="mr-1" />}
                        {isRevealed ? "Hide Solution" : "Scoring Scheme"}
                      </Button>
                    </div>

                    {isRevealed && (
                      <div className="p-3.5 rounded-xl bg-muted/80 border border-border text-xs md:text-sm text-foreground leading-relaxed animate-fade-in pl-4 border-l-4 border-l-primary">
                        <strong className="text-primary block mb-1">Comprehensive Discussion Scheme:</strong>
                        {q.keyPoint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION TAB: PRACTICAL LAB ================= */}
      {activeSectionTab === "practical" && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-institutional p-6 md:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Section J</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Advanced Coding</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                💻 Practical / Application-Based Lab Tasks
              </h3>
            </div>

            <div className="space-y-6">
              {currentWorksheet.practicals.map((p, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
                    <span className="px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold">
                      {p.title}
                    </span>
                    <span className="text-xs text-muted-foreground">Hands-on Implementation</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Problem Statement
                    </h4>
                    <p className="text-sm md:text-base font-semibold text-foreground">
                      {p.problem}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Implementation Steps
                    </h4>
                    <ul className="space-y-2">
                      {p.tasks.map((task, tIdx) => (
                        <li
                          key={tIdx}
                          className="flex items-start gap-2.5 text-xs md:text-sm text-foreground bg-muted/40 p-2.5 rounded-lg"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {p.expectedOutput && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> Expected Verification Output:
                      </h5>
                      <p className="text-xs md:text-sm text-foreground font-mono">
                        {p.expectedOutput}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION TAB: CASE STUDY & CONCEPT MAP ================= */}
      {activeSectionTab === "casestudy" && (
        <div className="space-y-8 animate-fade-in">
          {/* SECTION K: Concept Mapping */}
          <div className="card-institutional p-6 md:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Section K</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Visual Architecture</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                🗺️ {currentWorksheet.conceptMap.title}
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentWorksheet.conceptMap.branches.map((br, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-card border-2 border-accent/30 text-center space-y-2 shadow-sm"
                >
                  <span className="px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider">
                    {br.branch}
                  </span>
                  <h4 className="font-serif font-bold text-sm md:text-base text-primary">
                    {br.topic || "Core Topic"}
                  </h4>
                  {br.example && (
                    <p className="text-xs text-muted-foreground bg-muted/60 p-2 rounded-lg">
                      <strong>Components:</strong> {br.example}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION L: Case Study */}
          <div className="card-institutional p-6 md:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Section L</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Real-World Application</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                🏢 Case Study / Real-World Activity
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-muted/60 border border-border space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                  Industry Scenario
                </h4>
                <p className="text-sm md:text-base text-foreground leading-relaxed">
                  {currentWorksheet.caseStudy.scenario}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Critical Analytical Questions
                </h4>
                <div className="space-y-3">
                  {currentWorksheet.caseStudy.questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-card border border-border/80 flex items-start gap-3 shadow-xs"
                    >
                      <span className="w-6 h-6 rounded-full bg-accent/10 text-accent font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs md:text-sm font-semibold text-foreground leading-relaxed">
                        {q}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {currentWorksheet.caseStudy.expectedOutcome && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs md:text-sm text-foreground">
                  <strong className="text-emerald-700 dark:text-emerald-300 block mb-1">
                    Expected Learning Outcome:
                  </strong>
                  {currentWorksheet.caseStudy.expectedOutcome}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION TAB: SELF-ASSESSMENT & REFLECTION ================= */}
      {activeSectionTab === "assessment" && (
        <div className="space-y-8 animate-fade-in">
          {/* SECTION M: Self-Assessment */}
          <div className="card-institutional p-6 md:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Section M</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Self-Audit</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                📊 Self-Assessment Checklist
              </h3>
            </div>

            <div className="space-y-3">
              {currentWorksheet.selfAssessment.map((criteria, idx) => {
                const curVal = selfRatings[idx];
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-card border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <p className="text-xs md:text-sm font-medium text-foreground">{criteria}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      {(["yes", "partly", "no"] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelfRatings((prev) => ({ ...prev, [idx]: opt }))}
                          className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold capitalize transition-all ${
                            curVal === opt
                              ? opt === "yes"
                                ? "bg-emerald-500 text-white font-bold"
                                : opt === "partly"
                                ? "bg-amber-500 text-white font-bold"
                                : "bg-red-500 text-white font-bold"
                              : "bg-muted/60 border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION N: Student Reflection */}
          <div className="card-institutional p-6 md:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Section N</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Learning Log</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                💭 Student Reflection Journal
              </h3>
            </div>

            <div className="space-y-4">
              {currentWorksheet.reflection.map((prompt, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="text-xs md:text-sm font-semibold text-foreground flex items-center gap-2">
                    <MessageSquareQuote size={15} className="text-accent" />
                    <span>{prompt}</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Write your reflection notes here..."
                    value={reflectionAnswers[idx] || ""}
                    onChange={(e) =>
                      setReflectionAnswers((prev) => ({ ...prev, [idx]: e.target.value }))
                    }
                    className="w-full p-3 text-xs md:text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION TAB: INSTRUCTOR ANSWER KEY ================= */}
      {activeSectionTab === "answers" && (
        <div className="card-institutional p-6 md:p-8 space-y-6 animate-fade-in">
          <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Section O</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Instructor Solution Manual</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                🗝️ Instructor Master Answer Key
              </h3>
            </div>

            <Button
              variant="hero"
              size="sm"
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              className="flex items-center gap-2 text-xs py-2 px-4 font-semibold"
            >
              {showAnswerKey ? <EyeOff size={14} /> : <Eye size={14} />}
              {showAnswerKey ? "Lock Answer Key" : "Unlock Answer Key"}
            </Button>
          </div>

          {showAnswerKey ? (
            <div className="space-y-6 animate-slide-up">
              {/* MCQ Solutions */}
              <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                <h4 className="font-serif font-bold text-sm md:text-base text-primary">
                  1. MCQ Complete Solutions & Explanations
                </h4>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {currentWorksheet.answerKey.mcqs.map((ans, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-muted/60 text-xs text-foreground font-mono">
                      {ans}
                    </div>
                  ))}
                </div>
              </div>

              {/* Blanks & TF */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                  <h4 className="font-serif font-bold text-sm md:text-base text-primary">
                    2. Fill in the Blanks Answers
                  </h4>
                  <ul className="space-y-1 text-xs font-mono text-foreground">
                    {currentWorksheet.answerKey.fillInBlanks.map((ans, i) => (
                      <li key={i} className="p-2 bg-muted/40 rounded">
                        {i + 1}. {ans}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                  <h4 className="font-serif font-bold text-sm md:text-base text-primary">
                    3. True / False Answers
                  </h4>
                  <ul className="space-y-1 text-xs font-mono text-foreground">
                    {currentWorksheet.answerKey.trueFalse.map((ans, i) => (
                      <li key={i} className="p-2 bg-muted/40 rounded">
                        {i + 1}. {ans}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Match Key */}
              {currentWorksheet.answerKey.matchKey && (
                <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
                  <h4 className="font-serif font-bold text-sm md:text-base text-primary">
                    4. Match the Following Key
                  </h4>
                  <div className="p-3 bg-muted/50 rounded-xl font-mono text-xs sm:text-sm font-bold text-foreground">
                    {currentWorksheet.answerKey.matchKey}
                  </div>
                </div>
              )}

              {/* Short & Descriptive Key Points */}
              <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                <h4 className="font-serif font-bold text-sm md:text-base text-primary">
                  5. Short-Answer Scoring Highlights
                </h4>
                <div className="space-y-2">
                  {currentWorksheet.answerKey.shortAnswer.map((ans, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Q{i + 1}:</strong> {ans}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl space-y-3">
              <Key size={40} className="mx-auto text-accent opacity-60 animate-bounce" />
              <h4 className="font-serif font-bold text-base text-primary">
                Answer Key is Locked
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Attempt the questions first, then click Unlock to verify your solutions with the instructor master copy.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
