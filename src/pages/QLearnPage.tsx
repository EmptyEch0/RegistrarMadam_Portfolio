import { useState, useEffect, lazy, Suspense } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Play,
  Plus,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Video,
  Award,
  HelpCircle,
  CheckCircle2,
  XCircle,
  X,
  Maximize2,
  RotateCcw,
  Upload,
  ExternalLink,
  ChevronRightSquare,
  Presentation,
  Puzzle,
  Gamepad2,
  Trophy,
  Sparkles,
  Home,
  Trash2,
  RefreshCw,
  GraduationCap,
  FileText,
  FileDown,
  Edit3,
  ListChecks,
  BookmarkCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WordPuzzle, WordPuzzleData } from "@/components/ui/word-puzzle";
import { VisitorAccessModal } from "@/components/ui/VisitorAccessModal";
import { PdfPreviewModal } from "@/components/ui/PdfPreviewModal";
import { VisitorProfileBadge } from "@/components/ui/VisitorProfileBadge";
import { getSavedVisitor, logVisitorAccess, VisitorProfile } from "@/lib/visitorTracking";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import {
  DEFAULT_DOMAINS,
  QC_COURSE,
  DS_COURSE,
  IOT_COURSE,
  DomainData,
  ModuleData,
  VideoItem,
  NoteSnippet,
  PptItem,
  QuizQuestion,
} from "@/data/qlearnCourses";
const WorksheetViewer = lazy(() =>
  import("@/components/ui/worksheet-viewer").then((m) => ({ default: m.WorksheetViewer }))
);

const getModuleTopics = (mod: ModuleData): string[] => {
  if (mod.syllabus) {
    const lines = mod.syllabus
      .split("\n")
      .map((s) => s.trim().replace(/^[-*•\d.]+\s*/, ""))
      .filter(Boolean);
    if (lines.length > 0) return lines;
  }
  const desc = mod.description || "";
  const cleaned = desc.replace(/^Topics:\s*/i, "");
  return cleaned.split(",").map((s) => s.trim()).filter(Boolean);
};

const getModuleOutcomes = (mod: ModuleData): string[] => {
  if (mod.learningOutcomes) {
    const lines = mod.learningOutcomes
      .split("\n")
      .map((s) => s.trim().replace(/^[-*•\d.]+\s*/, ""))
      .filter(Boolean);
    if (lines.length > 0) return lines;
  }
  const cleanName = mod.name.replace(/^Module \d+:\s*/i, "");
  return [
    `Master foundational principles, architectures, and theoretical models of ${cleanName}.`,
    `Analyze real-world problem scenarios and formulate structured, reproducible solutions.`,
    `Demonstrate competency through interactive quiz evaluations, coding worksheets, and domain word puzzles.`
  ];
};

// Puzzles per domain (shown in the Puzzles tab of every module in that domain)
const DOMAIN_PUZZLES: Record<string, WordPuzzleData[]> = {
  "ai": [
    {
      id: "ai-key-words",
      title: "Figure out the Key Words in Artificial Intelligence",
      words: ["Heuristics", "Knowledge Base", "Inference", "Search", "Perception", "Robotics", "Turing Test"],
    },
  ],
  "machine-learning": [
    {
      id: "machine-learning-key-words",
      title: "Figure out the Key Words in Machine Learning",
      words: ["Supervised", "Clustering", "Overfitting", "Gradient Descent", "Classification", "Validation"],
    },
  ],
  "data-science": [
    {
      id: "data-science-unit-1",
      title: "Unit 1: Python Basics & Programming Concepts",
      words: ["PYTHON", "STRINGS", "TUPLES", "LOOPS", "FUNCTIONS", "CLASSES", "MODULES", "SCOPES"],
    },
    {
      id: "data-science-unit-2",
      title: "Unit 2: Python Tools for Data Handling (GUI, APIs, DB)",
      words: ["TKINTER", "JUPYTER", "REQUESTS", "SCRAPING", "SQL", "DATABASES", "SQLITE", "JSON"],
    },
    {
      id: "data-science-unit-3",
      title: "Unit 3: Pandas and NumPy Data Structures",
      words: ["NUMPY", "ARRAYS", "PANDAS", "INDEXING", "STATISTICS", "MISSINGDATA", "FILEIO", "ELEMENTWISE"],
    },
    {
      id: "data-science-unit-4",
      title: "Unit 4: Data Preprocessing & Visualization",
      words: ["DATALOADING", "WRANGLING", "MERGING", "RESHAPING", "GROUPBY", "AGGREGATION", "MATPLOTLIB", "SEABORN"],
    },
    {
      id: "data-science-unit-5",
      title: "Unit 5: Machine Learning for Data Science",
      words: ["SUPERVISED", "UNSUPERVISED", "REGRESSION", "CLUSTERING", "DECISIONTREES", "KMEANS", "PCA", "OVERFITTING"],
    },
    {
      id: "data-science-key-words",
      title: "Data Science Core Essentials",
      words: ["Analytics", "Regression", "Wrangling", "Visualization", "Statistics", "Hypothesis", "Pipeline"],
    },
  ],
  "deep-learning": [
    {
      id: "deep-learning-key-words",
      title: "Figure out the Key Words in Deep Learning",
      words: ["Neural Network", "Backpropagation", "Convolution", "Transformer", "Activation", "Tensor"],
    },
  ],
  "agentic-ai": [
    {
      id: "agentic-ai-key-words",
      title: "Figure out the Key Words in Agentic AI",
      words: ["Autonomous", "Reasoning", "Planning", "Memory", "Multi Agent", "Tool Use", "Reflection"],
    },
  ],
  "iot-internet-of-things": [
    {
      id: "iot-key-words",
      title: "Figure out the Key words related to IoT",
      words: ["Connectivity", "Sensing", "Data Processing", "Automation", "Control", "Intelligence"],
    },
  ],
  "aiot": [
    {
      id: "aiot-key-words",
      title: "Figure out the Key Words in AIoT (AI of Things)",
      words: ["Edge Computing", "Sensors", "Microcontrollers", "Embedded ML", "Telemetry", "Actuators", "Real Time"],
    },
  ],
  "ai-security": [
    {
      id: "ai-security-key-words",
      title: "Figure out the Key Words in AI Security",
      words: ["Adversarial", "Poisoning", "Evasion", "Model Inversion", "Differential Privacy", "Watermarking", "Robustness"],
    },
  ],
  "quantum-computing": [
    {
      id: "quantum-computing-key-words",
      title: "Figure out the Key Words in Quantum Computing",
      words: ["Qubit", "Superposition", "Entanglement", "Hadamard", "Teleportation", "Interference", "Decoherence"],
    },
  ],
  "quantum-ai": [
    {
      id: "quantum-ai-key-words",
      title: "Figure out the Key Words in Quantum AI",
      words: ["Quantum Circuit", "Variational", "QNN", "Quantum Kernel", "Superposition", "Hamiltonian", "Entanglement"],
    },
  ],
};

// Helper to convert PPT / Google Drive URLs into embeddable view links
const getEmbeddablePptUrl = (url: string): string => {
  if (!url) return "";
  const trimmed = url.trim();

  // Extract Google Doc/Drive File ID
  const docIdMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const docId = docIdMatch ? docIdMatch[1] : null;

  if (docId) {
    return `https://drive.google.com/file/d/${docId}/preview`;
  }

  // Direct PPT or PDF files via Office viewer
  if (trimmed.endsWith(".ppt") || trimmed.endsWith(".pptx") || trimmed.endsWith(".pdf")) {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
};

export default function QLearnPage({ isAdminPortal = false }: { isAdminPortal?: boolean } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [domains, setDomains] = useState<DomainData[]>([]);
  const [activeDomainIndex, setActiveDomainIndex] = useState<number | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"syllabus" | "videos" | "notes" | "ppts" | "quiz" | "worksheets" | "puzzles">("syllabus");
  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState(0);

  // Visitor Access & Tracking states
  const [visitorModalOpen, setVisitorModalOpen] = useState(false);
  const [targetItemPrompt, setTargetItemPrompt] = useState<string>("Courses & Puzzles");
  const [targetTypePrompt, setTargetTypePrompt] = useState<"course" | "puzzle">("course");
  const [currentVisitor, setCurrentVisitor] = useState<VisitorProfile | null>(() => getSavedVisitor());
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Carousel states for the active notes tab
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // PPT Presentation states
  const [activePptIndex, setActivePptIndex] = useState(0);
  const [pptModalOpen, setPptModalOpen] = useState(false);
  const [fullscreenPpt, setFullscreenPpt] = useState<PptItem | null>(null);

  // Module and Syllabus edit & add modals states (Admin)
  const [editModuleModalOpen, setEditModuleModalOpen] = useState(false);
  const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(null);
  const [editModuleName, setEditModuleName] = useState("");
  const [editModuleDesc, setEditModuleDesc] = useState("");
  const [editModuleSyllabus, setEditModuleSyllabus] = useState("");
  const [editModuleOutcomes, setEditModuleOutcomes] = useState("");
  const [editModuleReferences, setEditModuleReferences] = useState("");
  const [editModuleDuration, setEditModuleDuration] = useState("");

  const [addModuleModalOpen, setAddModuleModalOpen] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleDesc, setNewModuleDesc] = useState("");
  const [newModuleSyllabus, setNewModuleSyllabus] = useState("");
  const [newModuleOutcomes, setNewModuleOutcomes] = useState("");
  const [newModuleReferences, setNewModuleReferences] = useState("");
  const [newModuleDuration, setNewModuleDuration] = useState("");

  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizPlayerName, setQuizPlayerName] = useState<string>(() => {
    try {
      const savedStudent = localStorage.getItem("qlearn_current_student_session");
      if (savedStudent) {
        const parsed = JSON.parse(savedStudent);
        return parsed.fullName || parsed.rollNo || "";
      }
      return (
        localStorage.getItem("qlearn_quiz_player_name") ||
        localStorage.getItem("qlearn_puzzle_player_name") ||
        ""
      );
    } catch {
      return "";
    }
  });

  // Upload modals states
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [puzzleModalOpen, setPuzzleModalOpen] = useState(false);

  // Upload forms inputs
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [videoDesc, setVideoDesc] = useState("");

  // PDF support for Lecture Notes
  const [notePdfUrl, setNotePdfUrl] = useState("");
  const [notePdfFileName, setNotePdfFileName] = useState("");
  const [notePdfSize, setNotePdfSize] = useState<number | null>(null);
  const [notePdfUploading, setNotePdfUploading] = useState(false);
  const [previewPdfModalOpen, setPreviewPdfModalOpen] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewPdfTitle, setPreviewPdfTitle] = useState("");

  const [noteTitle, setNoteTitle] = useState("");
  const [noteImage, setNoteImage] = useState("");
  const [noteDesc, setNoteDesc] = useState("");

  const [pptTitle, setPptTitle] = useState("");
  const [pptUrl, setPptUrl] = useState("");
  const [pptSlideCount, setPptSlideCount] = useState("");
  const [pptDesc, setPptDesc] = useState("");

  // Video lecture player modal
  const [activePlayVideoUrl, setActivePlayVideoUrl] = useState<string | null>(null);
  const [activePlayVideoTitle, setActivePlayVideoTitle] = useState("");

  // Derived active domain and module (declared before useEffect hooks to avoid TDZ)
  const activeDomain = activeDomainIndex !== null ? domains[activeDomainIndex] : null;
  const activeModule = activeDomain ? activeDomain.modules[activeModuleIndex] : null;

  // Supabase (qlearn_content row "domains") is the source of truth so every visitor sees
  // admin edits; localStorage is only an offline cache.
  const cacheDomainsLocally = (data: DomainData[]) => {
    try {
      localStorage.setItem("qlearn_domains", JSON.stringify(data));
    } catch (e) {
      console.warn("QLearn local cache skipped (storage full):", e);
    }
  };

  const pushDomainsToCloud = async (data: DomainData[]) => {
    const { error } = await supabase
      .from("qlearn_content")
      .upsert({ id: "domains", data, updated_at: new Date().toISOString() });
    if (error) {
      console.error("Failed to publish QLearn content:", error);
      alert(`Changes were NOT published to the portal: ${error.message}`);
    }
  };

  const saveDomains = (updatedDomains: DomainData[]) => {
    setDomains(updatedDomains);
    cacheDomainsLocally(updatedDomains);
    if (isAdminPortal) pushDomainsToCloud(updatedDomains);
  };

  // Load from Supabase on mount (fallback: local cache, then defaults) and sync default PPTs
  useEffect(() => {
    let cancelled = false;
    (async () => {
    const { data: row, error: fetchErr } = await supabase
      .from("qlearn_content")
      .select("data")
      .eq("id", "domains")
      .maybeSingle();
    if (cancelled) return;
    if (fetchErr) console.warn("QLearn cloud load failed, using local cache:", fetchErr.message);
    const remote = row?.data as DomainData[] | undefined;
    const saved = remote ? JSON.stringify(remote) : localStorage.getItem("qlearn_domains");
    // First admin visit after this change: publish the admin's existing local edits.
    const seedCloud = !remote && !fetchErr && isAdminPortal;
    if (saved) {
      try {
        const parsed: DomainData[] = JSON.parse(saved);
        // Preserve existing user courses while ensuring all 10 curated courses appear in canonical order
        const updated = DEFAULT_DOMAINS.map((defaultDomain) => {
          const userDomain = parsed.find((d) => d.id === defaultDomain.id);
          if (!userDomain) return defaultDomain;
          // Upgrade stale 4-unit caches only; never wipe modules the admin added.
          if (userDomain.id === "deep-learning" && userDomain.modules.length < 5) {
            return defaultDomain;
          }
          // Course was rebuilt with new module ids (e.g. old 10-module roadmap → real 5-unit course).
          if (!userDomain.modules.some((m) => defaultDomain.modules.some((dm) => dm.id === m.id))) {
            return defaultDomain;
          }
          return {
            ...defaultDomain,
            ...userDomain,
            modules: userDomain.modules.map((mod) => {
              const defaultMod = defaultDomain.modules.find((m) => m.id === mod.id);
              if (defaultMod) return { ...defaultMod, ...mod };
              return mod;
            })
          };
        });
        // Retain any user-created custom courses that are not in DEFAULT_DOMAINS
        const extraDomains = parsed.filter((d) => !DEFAULT_DOMAINS.some((dd) => dd.id === d.id));
        const finalDomains = [...updated, ...extraDomains];
        setDomains(finalDomains);
        cacheDomainsLocally(finalDomains);
        if (seedCloud) pushDomainsToCloud(finalDomains);
      } catch (e) {
        console.error("Failed parsing QLearn domains data, resetting to defaults", e);
        setDomains(DEFAULT_DOMAINS);
        cacheDomainsLocally(DEFAULT_DOMAINS);
      }
    } else {
      setDomains(DEFAULT_DOMAINS);
      cacheDomainsLocally(DEFAULT_DOMAINS);
    }
    })();
    return () => { cancelled = true; };
  }, []);

  // Synchronize with URL search parameters (tab=puzzles, tab=courses, and subject)
  useEffect(() => {
    const tab = searchParams.get("tab");
    const subjectParam = searchParams.get("subject");

    if (tab === "puzzles") {
      setActiveTab("puzzles");
      if (subjectParam) {
        const domainList = domains.length > 0 ? domains : DEFAULT_DOMAINS;
        const foundIdx = domainList.findIndex(
          (d) => d.id.toLowerCase() === subjectParam.toLowerCase() || d.name.toLowerCase().includes(subjectParam.toLowerCase())
        );
        if (foundIdx !== -1) {
          setActiveDomainIndex(foundIdx);
          setPuzzleModalOpen(false);
        } else {
          setActiveDomainIndex(null);
        }
      } else {
        // Tab is puzzles with no specific subject: display subject selection screen
        setActiveDomainIndex(null);
      }
    } else if (tab === "syllabus") {
      setActiveTab("syllabus");
    } else if (tab === "courses") {
      setActiveDomainIndex(null);
      setActiveTab("syllabus");
    }

    // Silent access logging if visitor exists; courses open freely without blocking
    if (!isAdminPortal) {
      const v = getSavedVisitor();
      const isPuzzle = tab === "puzzles";
      const targetDesc = isPuzzle
        ? (subjectParam ? `Puzzle: ${subjectParam}` : "All Puzzles Hub")
        : (subjectParam ? `Course: ${subjectParam}` : "Courses & Roadmaps");

      if (v) {
        logVisitorAccess(targetDesc, isPuzzle ? "puzzle" : "course");
      }
    }
  }, [searchParams, domains, isAdminPortal]);

  // Dynamic SEO Title & Meta update for QLearn
  useEffect(() => {
    const defaultTitle = "QLearn Platform | AI, Quantum Computing & Word Connect Puzzles | Dr. G. Jaya Suma";
    if (activeDomain) {
      document.title = `${activeDomain.name} Course & Modules | QLearn Platform · Dr. G. Jaya Suma`;
    } else if (activeTab === "puzzles") {
      document.title = "Interactive Word Connect Puzzles & Live Ranks | QLearn Platform";
    } else {
      document.title = defaultTitle;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeDomainIndex, activeDomain, activeTab]);

  // Delete Video handler (admin)
  const handleDeleteVideo = (videoId: string) => {
    if (!window.confirm("Are you sure you want to delete this video lecture?")) return;
    if (activeDomainIndex === null || !activeModule) return;

    const updatedDomains = domains.map((d, dIdx) => {
      if (dIdx === activeDomainIndex) {
        return {
          ...d,
          modules: d.modules.map((m, mIdx) => {
            if (mIdx === activeModuleIndex) {
              return {
                ...m,
                videos: m.videos.filter((v) => v.id !== videoId)
              };
            }
            return m;
          })
        };
      }
      return d;
    });
    saveDomains(updatedDomains);
  };

  // Delete Note handler (admin)
  const handleDeleteNote = (noteId: string) => {
    if (!window.confirm("Are you sure you want to delete this lecture note slide?")) return;
    if (activeDomainIndex === null || !activeModule) return;

    const updatedDomains = domains.map((d, dIdx) => {
      if (dIdx === activeDomainIndex) {
        return {
          ...d,
          modules: d.modules.map((m, mIdx) => {
            if (mIdx === activeModuleIndex) {
              return {
                ...m,
                notes: m.notes.filter((n) => n.id !== noteId)
              };
            }
            return m;
          })
        };
      }
      return d;
    });
    saveDomains(updatedDomains);
    setActiveNoteIndex(0);
  };

  // Delete PPT handler (admin)
  const handleDeletePpt = (pptId: string) => {
    if (!window.confirm("Are you sure you want to delete this presentation slide deck?")) return;
    if (activeDomainIndex === null || !activeModule) return;

    const updatedDomains = domains.map((d, dIdx) => {
      if (dIdx === activeDomainIndex) {
        return {
          ...d,
          modules: d.modules.map((m, mIdx) => {
            if (mIdx === activeModuleIndex) {
              return {
                ...m,
                ppts: (m.ppts || []).filter((p) => p.id !== pptId)
              };
            }
            return m;
          })
        };
      }
      return d;
    });
    saveDomains(updatedDomains);
    setActivePptIndex(0);
  };

  // Reset to Defaults (admin)
  const handleResetToDefaults = () => {
    if (window.confirm("Reset all QLearn courses and learning modules to original default roadmap? Any custom uploaded items will be cleared.")) {
      saveDomains(DEFAULT_DOMAINS);
      setActiveDomainIndex(null);
      alert("QLearn content reset to default successfully.");
    }
  };

  // Open Edit Module Modal
  const openEditModuleModal = (index: number) => {
    if (activeDomainIndex === null) return;
    const targetDomain = domains[activeDomainIndex];
    if (!targetDomain) return;
    const mod = targetDomain.modules[index];
    if (!mod) return;

    setEditingModuleIndex(index);
    setEditModuleName(mod.name);
    setEditModuleDesc(mod.description || "");
    setEditModuleSyllabus(mod.syllabus || "");
    setEditModuleOutcomes(mod.learningOutcomes || "");
    setEditModuleReferences(mod.referenceMaterials || "");
    setEditModuleDuration(mod.duration || "");
    setEditModuleModalOpen(true);
  };

  // Submit Edit Module & Syllabus
  const handleEditModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModuleName.trim() || activeDomainIndex === null || editingModuleIndex === null) {
      alert("Please enter a valid module title.");
      return;
    }

    const updatedDomains = domains.map((d, dIdx) => {
      if (dIdx === activeDomainIndex) {
        return {
          ...d,
          modules: d.modules.map((m, mIdx) => {
            if (mIdx === editingModuleIndex) {
              return {
                ...m,
                name: editModuleName.trim(),
                description: editModuleDesc.trim() || `Topics: ${editModuleName.trim()}`,
                syllabus: editModuleSyllabus.trim(),
                learningOutcomes: editModuleOutcomes.trim(),
                referenceMaterials: editModuleReferences.trim(),
                duration: editModuleDuration.trim(),
              };
            }
            return m;
          })
        };
      }
      return d;
    });

    saveDomains(updatedDomains);
    setEditModuleModalOpen(false);
    setEditingModuleIndex(null);
  };

  // Open Add Module Modal
  const openAddModuleModal = () => {
    if (activeDomainIndex === null) return;
    const modNum = (domains[activeDomainIndex]?.modules.length || 0) + 1;
    setNewModuleName(`Module ${modNum}: `);
    setNewModuleDesc("Topics: ");
    setNewModuleSyllabus("");
    setNewModuleOutcomes("");
    setNewModuleReferences("");
    setNewModuleDuration("6-8 Hours");
    setAddModuleModalOpen(true);
  };

  // Submit Add Module & Syllabus Option
  const handleAddModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleName.trim() || activeDomainIndex === null) {
      alert("Please provide a module title.");
      return;
    }

    const newModuleId = `mod-${Date.now()}`;
    const newModule: ModuleData = {
      id: newModuleId,
      name: newModuleName.trim(),
      description: newModuleDesc.trim() || `Topics: ${newModuleName.trim()}`,
      syllabus: newModuleSyllabus.trim(),
      learningOutcomes: newModuleOutcomes.trim(),
      referenceMaterials: newModuleReferences.trim(),
      duration: newModuleDuration.trim() || "8 Hours",
      videos: [],
      notes: [],
      ppts: [],
      quiz: []
    };

    const currentLen = domains[activeDomainIndex]?.modules.length || 0;
    const updatedDomains = domains.map((d, dIdx) => {
      if (dIdx === activeDomainIndex) {
        return {
          ...d,
          modules: [...d.modules, newModule]
        };
      }
      return d;
    });

    saveDomains(updatedDomains);
    setActiveModuleIndex(currentLen);
    setAddModuleModalOpen(false);
    setNewModuleName("");
    setNewModuleDesc("");
    setNewModuleSyllabus("");
    setNewModuleOutcomes("");
    setNewModuleReferences("");
    setNewModuleDuration("");
  };

  // Delete Module handler (admin)
  const handleDeleteModule = (moduleIdx: number) => {
    if (activeDomainIndex === null) return;
    const targetDomain = domains[activeDomainIndex];
    if (!targetDomain) return;
    const targetMod = targetDomain.modules[moduleIdx];
    if (!targetMod) return;

    if (targetDomain.modules.length <= 1) {
      alert("A course must retain at least one module in its syllabus.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${targetMod.name}" and its syllabus? This action cannot be undone.`)) {
      return;
    }

    const updatedDomains = domains.map((d, dIdx) => {
      if (dIdx === activeDomainIndex) {
        return {
          ...d,
          modules: d.modules.filter((_, idx) => idx !== moduleIdx)
        };
      }
      return d;
    });

    saveDomains(updatedDomains);
    if (activeModuleIndex >= updatedDomains[activeDomainIndex].modules.length) {
      setActiveModuleIndex(Math.max(0, updatedDomains[activeDomainIndex].modules.length - 1));
    }
  };

  // Active PPT Decks for the current module (provides fallback deck so every module has interactive slides)
  const activeModulePpts: PptItem[] = (activeModule?.ppts && activeModule.ppts.length > 0)
    ? activeModule.ppts
    : [
        {
          id: `ppt-default-${activeModule?.id || 'mod'}`,
          title: `${activeModule?.name || 'Topic'} Presentation Slides`,
          pptUrl: "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
          embedUrl: "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed?start=false&loop=false&delayms=3000",
          description: `Comprehensive presentation slide deck covering key concepts and principles of ${activeModule?.name || 'this topic'}.`,
          slideCount: "Presentation Deck"
        }
      ];

  // Carousel actions
  const handleNextNote = () => {
    if (!activeModule || !activeModule.notes.length) return;
    setActiveNoteIndex((prev) => (prev + 1) % activeModule.notes.length);
  };

  const handlePrevNote = () => {
    if (!activeModule || !activeModule.notes.length) return;
    setActiveNoteIndex((prev) => (prev - 1 + activeModule.notes.length) % activeModule.notes.length);
  };

  // Video Upload submit handler
  const handleVideoUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoUrl || !videoDesc || activeDomainIndex === null || !activeModule) {
      alert("Please fill in all required fields.");
      return;
    }

    // Standardize YouTube URLs to embed URLs if applicable
    let finalUrl = videoUrl;
    if (videoUrl.includes("watch?v=")) {
      const vidId = videoUrl.split("watch?v=")[1]?.split("&")[0];
      if (vidId) finalUrl = `https://www.youtube.com/embed/${vidId}`;
    } else if (videoUrl.includes("youtu.be/")) {
      const vidId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
      if (vidId) finalUrl = `https://www.youtube.com/embed/${vidId}`;
    }

    const newVideo: VideoItem = {
      id: `vid-${Date.now()}`,
      title: videoTitle,
      url: finalUrl,
      duration: videoDuration || "8m",
      description: videoDesc
    };

    const updatedDomains = domains.map((d, dIdx) => {
      if (dIdx === activeDomainIndex) {
        return {
          ...d,
          modules: d.modules.map((m, mIdx) => {
            if (mIdx === activeModuleIndex) {
              return {
                ...m,
                videos: [...m.videos, newVideo]
              };
            }
            return m;
          })
        };
      }
      return d;
    });

    saveDomains(updatedDomains);
    setVideoTitle("");
    setVideoUrl("");
    setVideoDuration("");
    setVideoDesc("");
    setVideoModalOpen(false);
  };

  // PDF file picker handler
  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a valid PDF document (.pdf).");
      return;
    }
    setNotePdfFileName(file.name);
    setNotePdfSize(file.size);
    if (!noteTitle) {
      setNoteTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
    // Upload to the public "qlearn" bucket; base64 data URLs only lived in the admin's browser.
    setNotePdfUploading(true);
    const client = supabaseAdmin || supabase;
    const path = `notes/${Date.now()}_${file.name.replace(/[^\w.-]/g, "_")}`;
    client.storage
      .from("qlearn")
      .upload(path, file, { contentType: "application/pdf", upsert: true })
      .then(({ error }) => {
        if (error) throw error;
        setNotePdfUrl(client.storage.from("qlearn").getPublicUrl(path).data.publicUrl);
      })
      .catch((err) => {
        alert(`PDF upload failed: ${err.message || err}`);
        setNotePdfUrl("");
        setNotePdfFileName("");
      })
      .finally(() => setNotePdfUploading(false));
  };

  // Note Snippet Upload submit handler
  const handleNoteUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteDesc || activeDomainIndex === null || !activeModule) {
      alert("Please fill in all required fields.");
      return;
    }

    const fallbackImage = noteImage || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800";

    const newNote: NoteSnippet = {
      id: `note-${Date.now()}`,
      title: noteTitle,
      imageUrl: fallbackImage,
      description: noteDesc,
      pdfUrl: notePdfUrl || undefined,
      pdfFileName: notePdfFileName || undefined,
      docUrl: notePdfUrl || undefined
    };

    const updatedDomains = domains.map((d, dIdx) => {
      if (dIdx === activeDomainIndex) {
        return {
          ...d,
          modules: d.modules.map((m, mIdx) => {
            if (mIdx === activeModuleIndex) {
              return {
                ...m,
                notes: [...m.notes, newNote]
              };
            }
            return m;
          })
        };
      }
      return d;
    });

    saveDomains(updatedDomains);
    setNoteTitle("");
    setNoteImage("");
    setNoteDesc("");
    setNotePdfUrl("");
    setNotePdfFileName("");
    setNotePdfSize(null);
    setNoteModalOpen(false);
    setActiveNoteIndex(activeModule.notes.length); 
  };

  // PPT Upload submit handler
  const handlePptUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pptTitle || !pptUrl || !pptDesc || activeDomainIndex === null || !activeModule) {
      alert("Please fill in all required fields.");
      return;
    }

    const embedUrl = getEmbeddablePptUrl(pptUrl);

    const newPpt: PptItem = {
      id: `ppt-${Date.now()}`,
      title: pptTitle,
      pptUrl: pptUrl,
      embedUrl: embedUrl,
      description: pptDesc,
      slideCount: pptSlideCount || "Slides Deck"
    };

    const updatedDomains = domains.map((d, dIdx) => {
      if (dIdx === activeDomainIndex) {
        return {
          ...d,
          modules: d.modules.map((m, mIdx) => {
            if (mIdx === activeModuleIndex) {
              return {
                ...m,
                ppts: [...(m.ppts || []), newPpt]
              };
            }
            return m;
          })
        };
      }
      return d;
    });

    saveDomains(updatedDomains);
    setPptTitle("");
    setPptUrl("");
    setPptSlideCount("");
    setPptDesc("");
    setPptModalOpen(false);
    setActivePptIndex((activeModule.ppts || []).length);
  };

  // Quiz interactive triggers
  const startQuiz = () => {
    const finalPlayer = quizPlayerName.trim() || "Student Learner";
    try {
      localStorage.setItem("qlearn_quiz_player_name", finalPlayer);
    } catch {}
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswerSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (answerSubmitted) return;
    setSelectedOption(optionIdx);
  };

  const submitAnswer = () => {
    if (selectedOption === null || answerSubmitted || !activeModule) return;
    setAnswerSubmitted(true);
    if (selectedOption === activeModule.quiz[currentQuestionIndex].correctAnswer) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (!activeModule) return;
    setSelectedOption(null);
    setAnswerSubmitted(false);
    if (currentQuestionIndex + 1 < activeModule.quiz.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // Visitor submission handler
  const handleVisitorSuccess = (profile: VisitorProfile) => {
    setCurrentVisitor(profile);
    setVisitorModalOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // Switch domain handler - courses open freely without login prompt
  const handleDomainSelect = (idx: number) => {
    const domainList = domains.length > 0 ? domains : DEFAULT_DOMAINS;
    const domain = domainList[idx];
    const targetLabel = domain ? `Course: ${domain.name}` : "Course Module";

    if (!isAdminPortal) {
      const visitor = getSavedVisitor();
      if (visitor) {
        logVisitorAccess(targetLabel, "course");
      }
    }

    setActiveDomainIndex(idx);
    setActiveModuleIndex(0);
    setActiveNoteIndex(0);
    setActivePptIndex(0);
    setActiveTab("syllabus");
    setQuizStarted(false);
    setQuizFinished(false);
  };

  // Switch straight to puzzles of a domain
  const handlePlayPuzzle = (domainIdx: number) => {
    const domainList = domains.length > 0 ? domains : DEFAULT_DOMAINS;
    const domain = domainList[domainIdx];
    const targetLabel = domain ? `Puzzle: ${domain.name}` : "Word Connect Puzzle";

    if (!isAdminPortal) {
      const visitor = getSavedVisitor();
      if (visitor) {
        logVisitorAccess(targetLabel, "puzzle");
      }
    }

    setActiveDomainIndex(domainIdx);
    setActiveModuleIndex(0);
    setActiveNoteIndex(0);
    setActivePptIndex(0);
    setActiveTab("puzzles");
    setQuizStarted(false);
    setQuizFinished(false);
    setPuzzleModalOpen(false);
    if (domain) {
      setSearchParams({ tab: "puzzles", subject: domain.id });
    }
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  // Tab switch handler with access logging
  const handleTabSwitch = (tabId: "syllabus" | "videos" | "notes" | "ppts" | "quiz" | "worksheets" | "puzzles") => {
    setActiveTab(tabId);
    if (!isAdminPortal) {
      const visitor = getSavedVisitor();
      const domainName = activeDomain?.name || "General";
      const targetLabel = tabId === "puzzles" ? `Puzzle: ${domainName}` : `Course ${tabId.toUpperCase()}: ${domainName}`;
      if (visitor) {
        logVisitorAccess(targetLabel, tabId === "puzzles" ? "puzzle" : "course");
      }
    }
  };
  
  // Back to domains / courses roadmap
  const handleBackToDomains = () => {
    setActiveDomainIndex(null);
    setActiveModuleIndex(0);
    setActiveNoteIndex(0);
    setActivePptIndex(0);
    setActiveTab("syllabus");
    setSearchParams({});
  };

  // Back to puzzle subject selection (stays in puzzles tab)
  const handleBackToPuzzleSubjects = () => {
    setActiveDomainIndex(null);
    setActiveModuleIndex(0);
    setActiveNoteIndex(0);
    setActivePptIndex(0);
    setActiveTab("puzzles");
    setSearchParams({ tab: "puzzles" });
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  // Switch module handler
  const handleModuleSwitch = (idx: number) => {
    setActiveModuleIndex(idx);
    setActiveNoteIndex(0);
    setActivePptIndex(0);
    setActiveTab("videos");
    setQuizStarted(false);
    setQuizFinished(false);
  };

  // Quiz score badging logic
  const getBadge = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct >= 90) return { title: "Domain Master 🏆", desc: "Astounding! You have a profound command of this domain." };
    if (pct >= 60) return { title: "Scholar 🎓", desc: "Excellent work! You possess high-level scientific intuition." };
    return { title: "Explorer ⚛️", desc: "Keep exploring! You are beginning an amazing journey." };
  };

  return (
    <div className={cn("bg-background text-foreground flex flex-col", isAdminPortal ? "w-full" : "min-h-screen")}>
      {!isAdminPortal && <Header />}

      {/* HERO SECTION (Public Only) */}
      {!isAdminPortal && (
        <section className="relative pt-32 pb-16 bg-gradient-to-b from-cream-dark via-cream/40 to-background overflow-hidden border-b border-border/40">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-10 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none" 
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.15) 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}
          />

          <div className="container-wide px-6 lg:px-12 relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <Link 
                  to="/education" 
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/15 border border-accent/30 rounded-full text-accent text-sm font-medium hover:bg-accent/20 transition-all duration-300"
                >
                  <ArrowLeft size={14} /> Back to Contributions
                </Link>
                <button
                  type="button"
                  onClick={() => setPuzzleModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-full text-sm font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 border border-white/25"
                >
                  <Gamepad2 size={16} /> <span>Course Puzzles & Leaderboards</span>
                  <span className="bg-white/30 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider">6 Courses</span>
                </button>
                <VisitorProfileBadge onProfileChanged={setCurrentVisitor} />
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight leading-tight">
                QLearn
                <span className="text-accent block text-2xl md:text-3xl font-sans mt-2 font-medium tracking-normal">
                  Advanced Technology Learning Center
                </span>
              </h1>
              
              <div className="w-24 h-1 bg-accent rounded-full my-6" />

              <p className="text-lg text-muted-foreground max-w-2xl">
                An interactive visual laboratory. Explore domains like Quantum Computing, Data Science, AI, and test your skills with word puzzles & live leaderboards.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* MAIN TOPIC & TABS SECTION */}
      <section className={cn("flex-1 bg-background relative z-10", isAdminPortal ? "py-4 px-3 sm:px-6" : "py-12")}>
        <div className={isAdminPortal ? "w-full" : "container-wide px-6 lg:px-12"}>
          
          {activeDomainIndex === null ? (
            activeTab === "puzzles" ? (
              // PUZZLES SUBJECT SELECTOR HUB
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3">
                      <Gamepad2 size={14} /> Interactive Subject Word Puzzles
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-primary">Which subject would you like to play?</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Select any subject below to connect key terminology, beat the clock, and claim your spot on the live leaderboard!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBackToDomains}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted font-semibold text-xs transition-colors self-start md:self-auto shadow-xs"
                  >
                    <GraduationCap size={16} className="text-accent" /> View Course Roadmaps
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
                  {domains.map((domain, idx) => {
                    const puzzle = DOMAIN_PUZZLES[domain.id]?.[0];
                    return (
                      <div
                        key={domain.id}
                        onClick={() => handlePlayPuzzle(idx)}
                        className="cursor-pointer card-institutional overflow-hidden group hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
                      >
                        <div className={`h-2 bg-gradient-to-r ${domain.color}`} />
                        <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                {domain.icon}
                              </div>
                              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                                <Trophy size={12} className="text-amber-500" /> Live Leaderboard
                              </span>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-primary group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                              {domain.name}
                            </h3>
                            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                              {puzzle ? puzzle.title : domain.description}
                            </p>
                            {puzzle && (
                              <div className="pt-2 flex flex-wrap gap-1">
                                {puzzle.words.slice(0, 4).map((w, wIdx) => (
                                  <span key={wIdx} className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono">
                                    {w}
                                  </span>
                                ))}
                                {puzzle.words.length > 4 && (
                                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                                    +{puzzle.words.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-muted-foreground">
                              {puzzle ? `${puzzle.words.length} Key Words` : "Interactive Game"}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-md shadow-amber-500/20 group-hover:bg-amber-600 transition-colors">
                              <Puzzle size={13} /> Play Puzzle <ChevronRight size={14} />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // DOMAINS GRID VIEW (Courses)
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl font-bold text-primary">Select a Domain to Explore</h2>
                    <p className="text-muted-foreground mt-2">Each domain includes a structured course roadmap with notes, slides, quizzes and an interactive puzzle game.</p>
                  </div>
                  <button
                          type="button"
                          onClick={() => {
                            setActiveTab("videos");
                            window.scrollTo({ top: 460, behavior: "smooth" });
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs sm:text-sm font-bold transition-all duration-200 border border-white/30 shadow-lg hover:scale-[1.02] whitespace-nowrap active:scale-95"
                        >
                          <Video size={16} /> <span>Watch Videos</span>
                        </button>
                        <button
                    type="button"
                    onClick={() => {
                      setActiveTab("puzzles");
                      setActiveDomainIndex(null);
                      setSearchParams({ tab: "puzzles" });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white font-bold text-sm transition-all duration-200 self-start md:self-auto shadow-sm"
                  >
                    <Gamepad2 size={18} /> <span>All Puzzles & Games</span>
                    <Trophy size={16} className="text-amber-500" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
                  {domains.map((domain, idx) => (
                    <div
                      key={domain.id}
                      onClick={() => handleDomainSelect(idx)}
                      className="cursor-pointer card-institutional overflow-hidden group hover:shadow-2xl hover:border-accent/40 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className={`h-2 bg-gradient-to-r ${domain.color}`} />
                      <div className="p-6 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                          {domain.icon}
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-primary group-hover:text-accent transition-colors">
                          {domain.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {domain.description}
                        </p>
                        <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                            {domain.modules.length} {domain.modules.every((m) => m.id.startsWith("unit-") || m.name.startsWith("Unit")) ? "Units" : "Modules"}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDomainSelect(idx);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all duration-200 border border-accent/30 shadow-sm"
                          >
                            <BookOpen size={13} /> QLearn Hub
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            // MODULES VIEW
            <div className="grid lg:grid-cols-4 gap-8">
              
              {/* LEFT COLUMN: MODULES INDEX */}
              <div className="lg:col-span-1 space-y-4">
                <button 
                  onClick={handleBackToDomains}
                  className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent transition-colors mb-2"
                >
                  <ArrowLeft size={16} /> Back to Domains
                </button>
                <div className="flex items-center justify-between px-1 mb-2">
                  <h3 className="font-serif text-lg font-semibold text-primary">
                    {activeDomain?.name} Modules
                  </h3>
                  {isAdminPortal && (
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={openAddModuleModal}
                      className="h-7 px-2 text-[11px] font-bold flex items-center gap-1 shadow-xs"
                      title="Add a new module to this syllabus"
                    >
                      <Plus size={12} /> Add
                    </Button>
                  )}
                </div>
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  {activeDomain?.modules.map((module, index) => {
                    const isActive = index === activeModuleIndex;
                    return (
                      <div
                        key={module.id}
                        className={`group/mod relative rounded-lg border transition-all duration-300 ${
                          isActive
                            ? "bg-card border-accent shadow-md shadow-accent/5 ring-1 ring-accent/30 scale-100"
                            : "bg-card/40 border-border hover:border-accent/40 hover:bg-card"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleModuleSwitch(index)}
                          className={`w-full text-left p-4 ${isAdminPortal ? "pr-16" : ""}`}
                        >
                          <h4 className={`font-serif font-semibold leading-tight ${isActive ? "text-accent" : "text-primary"}`}>
                            {module.name}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                            {module.description}
                          </p>
                        </button>
                        {isAdminPortal && (
                          <div className="absolute top-3 right-2 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModuleModal(index);
                              }}
                              className="p-1.5 rounded-md hover:bg-accent/15 text-muted-foreground hover:text-accent transition-colors"
                              title="Edit Module & Syllabus"
                            >
                              <Edit3 size={13} />
                            </button>
                            {activeDomain && activeDomain.modules.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteModule(index);
                                }}
                                className="p-1.5 rounded-md hover:bg-red-500/15 text-muted-foreground hover:text-red-500 transition-colors"
                                title="Delete Module"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: ACTIVE MODULE CONTENT */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Active Module Banner */}
                {activeModule && (
                  <div className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-r ${activeDomain?.color} text-white shadow-xl relative overflow-hidden`}>
                    <div 
                      className="absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-50 pointer-events-none"
                      style={{ backgroundColor: activeDomain?.glowColor }}
                    />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="flex items-start gap-4 sm:gap-5 max-w-2xl">
                        <div className="text-3xl bg-white/15 p-3 rounded-xl backdrop-blur-md shrink-0 flex items-center justify-center shadow-inner border border-white/20 mt-0.5">
                          {activeDomain?.icon}
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs tracking-widest uppercase font-bold text-white/80 block">
                            {activeDomain?.name}
                          </span>
                          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-tight">
                            {activeModule.name}
                          </h2>
                          <p className="text-xs sm:text-sm text-white/90 leading-relaxed pt-1">
                            {activeModule.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 md:self-center flex-wrap">
                        {isAdminPortal && (
                          <button
                            type="button"
                            onClick={() => openEditModuleModal(activeModuleIndex)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs sm:text-sm font-bold transition-all duration-200 border border-white/30 shadow-md hover:scale-[1.02] active:scale-95"
                            title="Edit Module Name &amp; Syllabus"
                          >
                            <Edit3 size={15} /> <span>Edit Syllabus</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("puzzles");
                            window.scrollTo({ top: 460, behavior: "smooth" });
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs sm:text-sm font-bold transition-all duration-200 border border-white/30 shadow-lg hover:scale-[1.02] whitespace-nowrap active:scale-95"
                        >
                          <Gamepad2 size={16} /> <span>Play {activeDomain?.name} Puzzle</span>
                          <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 leading-none">Top 10</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TABS */}
                {activeModule && (
                  <>
                    {/* TABS CONTAINER */}
                    <div className="w-full space-y-3 border-b border-border/80 pb-4">
                      {/* The 7 module tabs */}
                      <div className="w-full flex items-center gap-1.5 sm:gap-2 p-1.5 bg-muted/60 backdrop-blur-md rounded-2xl border border-border/80 shadow-xs overflow-x-auto scrollbar-none">
                        {[
                          { id: "syllabus", label: "Syllabus & Topics", icon: ListChecks },
                          { id: "videos", label: "Video Seminars", icon: Video },
                          { id: "notes", label: "Lecture Notes", icon: BookOpen },
                          { id: "ppts", label: "PPT & Slides", icon: Presentation },
                          { id: "quiz", label: "Take Quiz", icon: Award },
                          { id: "worksheets", label: "Worksheets", icon: FileText, badge: "DOCX" },
                          { id: "puzzles", label: "Puzzles & Games", icon: Puzzle, badge: "TOP 10" }
                        ].map((tab) => {
                          const TabIcon = tab.icon;
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => handleTabSwitch(tab.id as any)}
                              className={`flex-1 min-w-fit h-11 sm:h-12 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap shrink-0 border ${
                                isActive
                                   ? "bg-card text-accent border-accent/40 shadow-xs font-bold ring-1 ring-accent/25"
                                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-card/60"
                              }`}
                            >
                              <TabIcon size={16} className={`shrink-0 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                              <span className="whitespace-nowrap shrink-0">{tab.label}</span>
                              {tab.badge && (
                                <span className={`whitespace-nowrap shrink-0 inline-flex items-center gap-0.5 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full leading-none transition-colors ${
                                  isActive
                                    ? "bg-accent/20 text-accent"
                                    : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                }`}>
                                  {tab.id === "puzzles" && <Gamepad2 size={10} className="shrink-0" />}
                                  <span>{tab.badge}</span>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Admin upload & maintenance toolbar (ONLY rendered in Admin Portal) */}
                      {isAdminPortal && (
                        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card border border-border/80 rounded-xl shadow-xs">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active Section: <strong className="text-foreground capitalize">{activeTab}</strong></span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Direct Module & Syllabus edit options always accessible in Admin Portal */}
                            <Button 
                              variant="hero" 
                              size="sm"
                              onClick={() => openEditModuleModal(activeModuleIndex)}
                              className="flex items-center gap-1.5 text-xs font-semibold shadow-xs hover:shadow-md transition-all"
                              title="Edit current module title, topics, and syllabus outline"
                            >
                              <Edit3 size={14} /> Edit Module Syllabus
                            </Button>

                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={openAddModuleModal}
                              className="flex items-center gap-1.5 text-xs font-semibold shadow-xs hover:shadow-md transition-all"
                              title="Add a new module and syllabus unit to this course"
                            >
                              <Plus size={14} /> Add Syllabus Option
                            </Button>

                            {activeTab === "videos" && (
                              <Button 
                                variant="hero" 
                                size="sm"
                                onClick={() => setVideoModalOpen(true)}
                                className="flex items-center gap-1.5 text-xs font-semibold shadow-xs hover:shadow-md transition-all"
                              >
                                <Plus size={14} /> Upload Video
                              </Button>
                            )}
                            {activeTab === "notes" && (
                              <Button 
                                variant="hero" 
                                size="sm"
                                onClick={() => setNoteModalOpen(true)}
                                className="flex items-center gap-1.5 text-xs font-semibold shadow-xs hover:shadow-md transition-all"
                              >
                                <Plus size={14} /> Add Notes Slide
                              </Button>
                            )}
                            {activeTab === "ppts" && (
                              <Button 
                                variant="hero" 
                                size="sm"
                                onClick={() => setPptModalOpen(true)}
                                className="flex items-center gap-1.5 text-xs font-semibold shadow-xs hover:shadow-md transition-all"
                              >
                                <Plus size={14} /> Upload PPT / Drive Link
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleResetToDefaults}
                              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-all"
                              title="Reset all content to original defaults"
                            >
                              <RefreshCw size={12} /> Reset to Defaults
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CONTENT PANEL */}
                    <div className="min-h-[400px]">
                      
                      {/* SYLLABUS & TOPICS TAB */}
                      {activeTab === "syllabus" && (
                        <div className="space-y-8 animate-fade-in">
                          {/* Module Header Card */}
                          <div className="card-institutional p-6 sm:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/80 pb-6">
                              <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-bold">
                                  <ListChecks size={14} /> Curriculum &amp; Syllabus Breakdown
                                </div>
                                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                                  {activeModule.name}
                                </h3>
                                <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
                                  {activeModule.description}
                                </p>
                              </div>

                              {isAdminPortal && (
                                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                  <Button
                                    variant="hero"
                                    size="sm"
                                    onClick={() => openEditModuleModal(activeModuleIndex)}
                                    className="flex items-center gap-1.5 text-xs font-semibold shadow-xs"
                                  >
                                    <Edit3 size={14} /> Edit Syllabus
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={openAddModuleModal}
                                    className="flex items-center gap-1.5 text-xs font-semibold"
                                  >
                                    <Plus size={14} /> Add Syllabus Option
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Grid: Topics / Key Terminology & Outcomes */}
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Core Topics Covered */}
                              <div className="p-5 rounded-xl bg-muted/30 border border-border/70 space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                                  <BookmarkCheck size={14} /> Core Topics &amp; Terminology
                                </h4>
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {getModuleTopics(activeModule).map((topic, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="px-3 py-1.5 rounded-lg bg-card border border-border/80 text-foreground text-xs font-medium shadow-2xs flex items-center gap-1.5"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                                {activeModule.duration && (
                                  <div className="pt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                                    <Clock size={13} className="text-accent" />
                                    <span>Recommended Study Pace: <strong className="text-foreground">{activeModule.duration}</strong></span>
                                  </div>
                                )}
                              </div>

                              {/* Expected Learning Outcomes */}
                              <div className="p-5 rounded-xl bg-muted/30 border border-border/70 space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                  <Award size={14} /> Expected Learning Outcomes
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                                  {getModuleOutcomes(activeModule).map((outcome, oIdx) => (
                                    <li key={oIdx} className="flex items-start gap-2">
                                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                                      <span>{outcome}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Detailed Syllabus / Unit Content */}
                            <div className="p-6 rounded-xl bg-card border border-border/80 space-y-4">
                              <h4 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                                <FileText size={18} className="text-accent" /> Detailed Unit Outline &amp; Curriculum
                              </h4>
                              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line space-y-3">
                                {activeModule.syllabus ? (
                                  <div className="space-y-3">
                                    {activeModule.syllabus.split("\n").filter(Boolean).map((line, lIdx) => (
                                      <div key={lIdx} className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/20 border border-border/50">
                                        <span className="w-5 h-5 rounded-full bg-accent/15 text-accent text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                          {lIdx + 1}
                                        </span>
                                        <span className="text-foreground/90 font-medium">{line}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="grid sm:grid-cols-2 gap-3">
                                    {getModuleTopics(activeModule).map((topic, uIdx) => (
                                      <div key={uIdx} className="p-3.5 rounded-lg bg-muted/20 border border-border/50 space-y-1">
                                        <div className="text-[11px] font-bold text-accent uppercase tracking-wider">
                                          Unit {uIdx + 1}
                                        </div>
                                        <div className="text-sm font-semibold text-foreground">
                                          {topic}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          Core theoretical principles, mathematical formulations, and engineering implementations.
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Recommended Textbooks & Reference Materials */}
                            <div className="p-5 rounded-xl bg-muted/30 border border-border/70 space-y-2">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <BookOpen size={14} className="text-accent" /> Recommended Textbooks &amp; Reference Material
                              </h4>
                              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                                {activeModule.referenceMaterials || `Authoritative university textbooks, research papers, and laboratory coursework supervised by Dr. G. Jaya Suma at JNTU-GV.`}
                              </p>
                            </div>

                            {/* Quick Jump Buttons to Module Resources */}
                            <div className="pt-2 border-t border-border/60">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                                Explore Learning Materials for this Module
                              </h4>
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleTabSwitch("videos")}
                                  className="p-3 rounded-xl bg-card border border-border hover:border-accent/50 text-left transition-all hover:-translate-y-0.5 group shadow-2xs"
                                >
                                  <Video size={16} className="text-accent mb-2 group-hover:scale-110 transition-transform" />
                                  <div className="text-xs font-bold text-foreground">Video Seminars</div>
                                  <div className="text-[10px] text-muted-foreground">{activeModule.videos.length} Lectures</div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleTabSwitch("notes")}
                                  className="p-3 rounded-xl bg-card border border-border hover:border-accent/50 text-left transition-all hover:-translate-y-0.5 group shadow-2xs"
                                >
                                  <BookOpen size={16} className="text-accent mb-2 group-hover:scale-110 transition-transform" />
                                  <div className="text-xs font-bold text-foreground">Lecture Notes</div>
                                  <div className="text-[10px] text-muted-foreground">{activeModule.notes.length} Slides</div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleTabSwitch("ppts")}
                                  className="p-3 rounded-xl bg-card border border-border hover:border-accent/50 text-left transition-all hover:-translate-y-0.5 group shadow-2xs"
                                >
                                  <Presentation size={16} className="text-accent mb-2 group-hover:scale-110 transition-transform" />
                                  <div className="text-xs font-bold text-foreground">Slide Decks</div>
                                  <div className="text-[10px] text-muted-foreground">Drive &amp; Embeds</div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleTabSwitch("quiz")}
                                  className="p-3 rounded-xl bg-card border border-border hover:border-accent/50 text-left transition-all hover:-translate-y-0.5 group shadow-2xs"
                                >
                                  <Award size={16} className="text-accent mb-2 group-hover:scale-110 transition-transform" />
                                  <div className="text-xs font-bold text-foreground">Assessment Quiz</div>
                                  <div className="text-[10px] text-muted-foreground">{activeModule.quiz.length} Questions</div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleTabSwitch("puzzles")}
                                  className="p-3 rounded-xl bg-card border border-border hover:border-amber-500/50 text-left transition-all hover:-translate-y-0.5 group shadow-2xs col-span-2 sm:col-span-1"
                                >
                                  <Gamepad2 size={16} className="text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                                  <div className="text-xs font-bold text-foreground">Word Puzzle</div>
                                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Live Leaderboard</div>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Complete Course Roadmap / All Modules Syllabus */}
                          <div className="card-institutional p-6 sm:p-8 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
                              <div>
                                <h4 className="font-serif text-xl font-bold text-primary">
                                  {activeDomain?.name} &bull; Full Syllabus Roadmap
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Complete curriculum structure across all {activeDomain?.modules.length} modules.
                                </p>
                              </div>
                              {isAdminPortal && (
                                <Button
                                  variant="hero"
                                  size="sm"
                                  onClick={openAddModuleModal}
                                  className="flex items-center gap-1.5 text-xs font-semibold shadow-xs"
                                >
                                  <Plus size={14} /> Add Module to Syllabus
                                </Button>
                              )}
                            </div>

                            <div className="space-y-3 pt-2">
                              {activeDomain?.modules.map((mod, mIndex) => {
                                const isCurrent = mIndex === activeModuleIndex;
                                const topics = getModuleTopics(mod);
                                return (
                                  <div
                                    key={mod.id}
                                    className={`p-4 rounded-xl border transition-all ${
                                      isCurrent
                                        ? "bg-accent/5 border-accent shadow-xs ring-1 ring-accent/25"
                                        : "bg-card border-border/70 hover:border-accent/40"
                                    }`}
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded">
                                            Module {mIndex + 1}
                                          </span>
                                          <h5 className="font-serif text-sm sm:text-base font-bold text-foreground">
                                            {mod.name}
                                          </h5>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                          {topics.map((t, idx) => (
                                            <span key={idx} className="text-[11px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono">
                                              {t}
                                            </span>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <Button
                                          variant={isCurrent ? "hero" : "outline"}
                                          size="sm"
                                          onClick={() => handleModuleSwitch(mIndex)}
                                          className="text-xs h-8"
                                        >
                                          {isCurrent ? "Active Module" : "View Module"}
                                        </Button>
                                        {isAdminPortal && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditModuleModal(mIndex)}
                                            className="h-8 px-2 text-muted-foreground hover:text-accent"
                                            title="Edit this module and syllabus"
                                          >
                                            <Edit3 size={14} />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* VIDEOS TAB */}
                      {activeTab === "videos" && (
                        <div className="space-y-6">
                          {activeModule.videos.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-border rounded-xl">
                              <Video size={48} className="mx-auto text-muted-foreground opacity-40 mb-3" />
                              <p className="text-muted-foreground font-medium">No videos found for this topic.</p>
                            </div>
                          ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                              {activeModule.videos.map((vid) => (
                                <div 
                                  key={vid.id}
                                  className="card-institutional p-5 flex flex-col justify-between group hover:border-accent/40 hover:shadow-xl transition-all duration-300"
                                >
                                  <div>
                                    <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-border/80 mb-4 flex items-center justify-center">
                                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-indigo-900/20 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                      <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center border border-accent/40 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                        <Play className="w-6 h-6 text-accent fill-accent ml-0.5" />
                                      </div>
                                      <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-white font-mono font-semibold">
                                        {vid.duration}
                                      </span>
                                    </div>
                                    <h3 className="font-serif text-lg font-bold text-primary group-hover:text-accent transition-colors leading-snug mb-2">
                                      {vid.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                                      {vid.description}
                                    </p>
                                  </div>
                                  <div className="border-t border-border/40 pt-4 flex items-center justify-between gap-2">
                                    <span className="text-xs text-muted-foreground font-mono">
                                      Seminar Lecture Video
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      {isAdminPortal && (
                                        <Button
                                          variant="ghost"
                                          size="xs"
                                          onClick={() => handleDeleteVideo(vid.id)}
                                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 text-xs py-1.5 px-2"
                                          title="Delete video lecture"
                                        >
                                          <Trash2 size={13} />
                                        </Button>
                                      )}
                                      <Button 
                                        variant="hero-outline" 
                                        size="xs"
                                        onClick={() => {
                                          setActivePlayVideoUrl(vid.url);
                                          setActivePlayVideoTitle(vid.title);
                                        }}
                                        className="flex items-center gap-1.5 text-xs py-1.5"
                                      >
                                        Play Lecture <ExternalLink size={12} />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* NOTES TAB */}
                      {activeTab === "notes" && (
                        <div className="space-y-6">
                          {activeModule.notes.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-border rounded-xl">
                              <BookOpen size={48} className="mx-auto text-muted-foreground opacity-40 mb-3" />
                              <p className="text-muted-foreground font-medium">No notes snippets found for this topic.</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="relative bg-card border border-border rounded-xl p-6 md:p-10 shadow-lg">
                                <div className="grid md:grid-cols-12 gap-8 items-center">
                                  <div className="md:col-span-5 relative group">
                                    <div className="relative aspect-square bg-slate-900 rounded-lg overflow-hidden border border-border shadow-inner flex items-center justify-center">
                                      <img 
                                        src={activeModule.notes[activeNoteIndex].imageUrl} 
                                        alt={activeModule.notes[activeNoteIndex].title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                      <button 
                                        onClick={() => setLightboxOpen(true)}
                                        className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-accent rounded text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                                        title="View Fullscreen"
                                      >
                                        <Maximize2 size={16} />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="md:col-span-7 space-y-4">
                                     <div className="flex items-center justify-between gap-2">
                                       <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/15 border border-accent/30 rounded text-accent text-xs font-semibold">
                                         Note Sheet {activeNoteIndex + 1} of {activeModule.notes.length}
                                       </div>
                                       {isAdminPortal && (
                                         <Button
                                           variant="ghost"
                                           size="xs"
                                           onClick={() => handleDeleteNote(activeModule.notes[activeNoteIndex].id)}
                                           className="text-red-500 hover:text-red-600 hover:bg-red-500/10 text-xs py-1 px-2.5"
                                           title="Delete this note slide"
                                         >
                                           <Trash2 size={13} className="mr-1" /> Delete Slide
                                         </Button>
                                       )}
                                     </div>
                                     <h3 className="font-serif text-2xl font-bold text-primary">
                                       {activeModule.notes[activeNoteIndex].title}
                                     </h3>
                                     <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                                       {activeModule.notes[activeNoteIndex].description}
                                     </p>

                                     {activeModule.notes[activeNoteIndex].docUrl && (
                                       <div className="pt-2 flex flex-wrap gap-2">
                                         <a
                                           href={activeModule.notes[activeNoteIndex].docUrl}
                                           target="_blank"
                                           rel="noopener noreferrer"
                                           className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-all font-semibold shadow-sm"
                                         >
                                           Open Resource Document Notes <ExternalLink size={12} />
                                         </a>
                                         {(activeModule.notes[activeNoteIndex].embedUrl || activeModule.notes[activeNoteIndex].pdfUrl) && (
                                           <Button
                                             variant="hero-outline"
                                             size="sm"
                                             onClick={() => setFullscreenPpt({
                                               id: activeModule.notes[activeNoteIndex].id,
                                               title: activeModule.notes[activeNoteIndex].title,
                                               pptUrl: activeModule.notes[activeNoteIndex].docUrl || "",
                                               embedUrl: (activeModule.notes[activeNoteIndex].embedUrl || activeModule.notes[activeNoteIndex].pdfUrl) || "",
                                               description: activeModule.notes[activeNoteIndex].description
                                             })}
                                             className="flex items-center gap-1.5 text-xs py-2"
                                           >
                                             <Maximize2 size={13} /> Fullscreen Notes
                                           </Button>
                                         )}
                                       </div>
                                     )}
                                   </div>
                                 </div>

                                 <div className="absolute top-1/2 -left-4 -translate-y-1/2">
                                   <button
                                     onClick={handlePrevNote}
                                     className="w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-primary hover:border-accent hover:text-accent hover:scale-110 active:scale-95 transition-all duration-200"
                                   >
                                     <ChevronLeft size={24} />
                                   </button>
                                 </div>
                                 <div className="absolute top-1/2 -right-4 -translate-y-1/2">
                                   <button
                                     onClick={handleNextNote}
                                     className="w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-primary hover:border-accent hover:text-accent hover:scale-110 active:scale-95 transition-all duration-200"
                                   >
                                     <ChevronRight size={24} />
                                   </button>
                                 </div>
                               </div>

                               {/* Embedded Document Viewer for Resource Notes if docUrl exists */}
                               {(activeModule.notes[activeNoteIndex].embedUrl || activeModule.notes[activeNoteIndex].pdfUrl) && (
                                 <div className="bg-card border border-border/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
                                   <div className="p-4 bg-muted/60 border-b border-border flex items-center justify-between">
                                     <div className="flex items-center gap-2">
                                       <BookOpen className="w-5 h-5 text-accent" />
                                       <h4 className="font-serif font-bold text-sm text-primary">
                                         {activeModule.notes[activeNoteIndex].title} - Interactive Document Viewer
                                       </h4>
                                     </div>
                                     <a
                                       href={activeModule.notes[activeNoteIndex].docUrl}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
                                     >
                                       Open Document <ExternalLink size={12} />
                                     </a>
                                   </div>
                                   <div className="relative w-full aspect-[16/9] min-h-[440px] md:min-h-[500px] bg-slate-950">
                                     <iframe
                                       src={(activeModule.notes[activeNoteIndex].embedUrl || activeModule.notes[activeNoteIndex].pdfUrl)}
                                       title={activeModule.notes[activeNoteIndex].title}
                                       className="w-full h-full border-0"
                                       allowFullScreen
                                     />
                                   </div>
                                 </div>
                               )}
                             </div>
                          )}
                        </div>
                      )}

                      {/* PPTS & DRIVE SLIDES TAB */}
                      {activeTab === "ppts" && (
                        <div className="space-y-6">
                          <div className="space-y-6">
                            {/* Presentation Interactive Viewer Card */}
                            <div className="bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
                              
                              {/* Glassmorphic Viewer Header */}
                              <div className="p-4 md:p-5 bg-gradient-to-r from-card via-card/95 to-accent/5 border-b border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <span className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent font-bold shadow-sm border border-accent/20">
                                    <Presentation size={22} />
                                  </span>
                                  <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-accent/10 text-accent border border-accent/20">
                                        Interactive Presentation
                                      </span>
                                    </div>
                                    <h3 className="font-serif text-lg md:text-xl font-bold text-primary leading-snug">
                                      {activeModulePpts[activePptIndex]?.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                      {activeModulePpts[activePptIndex]?.description || "Drive Slide Presentation"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                  {isAdminPortal && activeModule?.ppts && activeModule.ppts.length > 0 && (
                                    <Button
                                      variant="ghost"
                                      size="xs"
                                      onClick={() => handleDeletePpt(activeModulePpts[activePptIndex].id)}
                                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 text-xs py-1.5 px-2.5"
                                      title="Delete this PPT deck"
                                    >
                                      <Trash2 size={13} className="mr-1" /> Delete Deck
                                    </Button>
                                  )}
                                  {activeModulePpts[activePptIndex]?.slideCount && (
                                    <span className="text-xs font-semibold px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent shadow-xs">
                                      {activeModulePpts[activePptIndex].slideCount}
                                    </span>
                                  )}
                                  <a
                                    href={activeModulePpts[activePptIndex]?.pptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-muted/80 hover:bg-muted text-foreground transition-all duration-200 border border-border font-medium shadow-xs"
                                  >
                                    Open Drive <ExternalLink size={12} />
                                  </a>
                                  <Button
                                    variant="hero"
                                    size="sm"
                                    onClick={() => setFullscreenPpt(activeModulePpts[activePptIndex])}
                                    className="flex items-center gap-2 text-xs py-2 px-4 font-semibold shadow-md hover:shadow-accent/25 hover:scale-[1.03] transition-all duration-300"
                                  >
                                    <Maximize2 size={15} /> Maximize Presentation
                                  </Button>
                                </div>
                              </div>

                              {/* Responsive Full HD Frame Container */}
                              <div className="relative w-full aspect-[16/9] min-h-[440px] md:min-h-[520px] bg-slate-950 flex items-center justify-center border-y border-border/40">
                                <iframe
                                  src={activeModulePpts[activePptIndex]?.embedUrl}
                                  title={activeModulePpts[activePptIndex]?.title}
                                  className="w-full h-full border-0"
                                  allowFullScreen
                                />
                              </div>

                              {/* Controls & Slide Switcher Footer */}
                              <div className="p-4 bg-card border-t border-border flex flex-wrap items-center justify-between gap-3 shadow-inner">
                                <div className="flex items-center gap-2.5">
                                  <button
                                    disabled={activePptIndex === 0}
                                    onClick={() => setActivePptIndex((prev) => Math.max(0, prev - 1))}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-muted/80 hover:bg-accent hover:text-accent-foreground text-foreground text-xs font-semibold disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs"
                                  >
                                    <ChevronLeft size={14} /> Prev Deck
                                  </button>
                                  <span className="text-xs text-primary font-bold px-3.5 py-2 rounded-lg bg-accent/10 border border-accent/20 font-mono shadow-xs">
                                    Deck {activePptIndex + 1} of {activeModulePpts.length}
                                  </span>
                                  <button
                                    disabled={activePptIndex >= activeModulePpts.length - 1}
                                    onClick={() => setActivePptIndex((prev) => Math.min(activeModulePpts.length - 1, prev + 1))}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-muted/80 hover:bg-accent hover:text-accent-foreground text-foreground text-xs font-semibold disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs"
                                  >
                                    Next Deck <ChevronRight size={14} />
                                  </button>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                  <span className="text-accent font-bold">💡 Tip:</span> Use slide arrows inside window to change pages, or click Maximize for full screen.
                                </div>
                              </div>

                            </div>

                            {/* Multiple PPT Decks Selector Grid */}
                            {activeModulePpts.length > 1 && (
                              <div className="space-y-3 pt-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                                  Available Slide Decks ({activeModulePpts.length})
                                </h4>
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                  {activeModulePpts.map((ppt, pIdx) => (
                                    <div
                                      key={ppt.id}
                                      onClick={() => setActivePptIndex(pIdx)}
                                      className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 flex items-start gap-3 transform hover:-translate-y-0.5 ${
                                        pIdx === activePptIndex
                                          ? "bg-accent/10 border-accent shadow-md ring-1 ring-accent/30"
                                          : "bg-card border-border hover:border-accent/40 hover:shadow-md"
                                      }`}
                                    >
                                      <div className={`p-2 rounded-lg ${pIdx === activePptIndex ? "bg-accent text-white" : "bg-muted text-muted-foreground"}`}>
                                        <Presentation className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <h4 className="font-semibold text-sm line-clamp-1">{ppt.title}</h4>
                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{ppt.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* QUIZ TAB */}
                      {activeTab === "quiz" && (
                        <div className="max-w-2xl mx-auto">
                          {!quizStarted ? (
                            <div className="card-institutional p-8 text-center space-y-6 animate-fade-in">
                              <div className="w-16 h-16 bg-accent/15 border border-accent/30 rounded-full flex items-center justify-center mx-auto text-accent text-3xl">
                                🏆
                              </div>
                              <div className="space-y-2">
                                <h3 className="font-serif text-2xl font-bold text-primary">
                                  Test Your Intuition
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                                  A curated {activeModule.quiz.length}-question multiple-choice quiz designed to validate your core comprehension of <strong>{activeModule.name}</strong>.
                                </p>
                              </div>

                              {/* Student / Player Name Input Field */}
                              <div className="max-w-xs mx-auto text-left space-y-1.5 p-4 rounded-xl bg-muted/40 border border-border">
                                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                  <GraduationCap size={14} className="text-accent" />
                                  Enter Your Name / Roll Number
                                </label>
                                <input
                                  type="text"
                                  value={quizPlayerName}
                                  onChange={(e) => setQuizPlayerName(e.target.value)}
                                  placeholder="e.g. 23VV1A1232 or Your Name"
                                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-lg bg-card border border-border focus:border-accent focus:outline-none"
                                />
                                <span className="text-[10px] text-muted-foreground block">
                                  Your name will be displayed on the assessment summary.
                                </span>
                              </div>
                              
                              <Button 
                                variant="hero" 
                                size="lg" 
                                onClick={startQuiz}
                                className="px-8 font-semibold text-sm transform hover:scale-105 transition-all duration-300"
                              >
                                Start Topic Quiz
                              </Button>
                            </div>
                          ) : quizFinished ? (
                            <div className="card-institutional p-8 text-center space-y-6 animate-fade-in">
                              <div className="w-20 h-20 bg-accent/10 border-2 border-accent/20 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-4xl">👑</span>
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-serif text-3xl font-bold text-primary">
                                  Module Assessment Completed
                                </h3>
                                <p className="text-sm text-accent font-semibold">
                                  Participant: {quizPlayerName.trim() || "Student Learner"}
                                </p>
                              </div>
                              <div className="w-32 h-32 rounded-full border-4 border-accent flex flex-col items-center justify-center mx-auto bg-accent/5 shadow-lg shadow-accent/5">
                                <span className="text-3xl font-extrabold text-primary">
                                  {quizScore} / {activeModule.quiz.length}
                                </span>
                              </div>
                              <div className="p-5 bg-muted/60 rounded-lg max-w-md mx-auto border border-border">
                                <h4 className="font-semibold text-accent text-lg mb-1">
                                  {getBadge(quizScore, activeModule.quiz.length).title}
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {getBadge(quizScore, activeModule.quiz.length).desc}
                                </p>
                              </div>
                              <div className="flex justify-center gap-3 pt-2">
                                <Button 
                                  variant="hero-outline" 
                                  size="sm" 
                                  onClick={startQuiz}
                                >
                                  <RotateCcw size={14} className="mr-2"/> Retake Quiz
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="card-institutional p-6 md:p-8 space-y-6 animate-fade-in">
                              <div className="flex items-center justify-between border-b border-border pb-4">
                                <div>
                                  <span className="text-xs text-accent uppercase font-bold tracking-wider">
                                    Assessment Mode · {quizPlayerName.trim() || "Student"}
                                  </span>
                                  <h4 className="font-serif text-lg font-semibold text-primary">
                                    Question {currentQuestionIndex + 1} of {activeModule.quiz.length}
                                  </h4>
                                </div>
                                <span className="text-sm font-mono bg-muted px-2.5 py-1 rounded text-muted-foreground font-semibold">
                                  Score: {quizScore}
                                </span>
                              </div>
                              <div className="space-y-4">
                                <h3 className="font-serif text-xl md:text-2xl font-bold text-primary leading-snug">
                                  {activeModule.quiz[currentQuestionIndex].question}
                                </h3>
                                <div className="grid gap-3 pt-2">
                                  {activeModule.quiz[currentQuestionIndex].options.map((option, idx) => {
                                    const isSelected = selectedOption === idx;
                                    const isCorrect = idx === activeModule.quiz[currentQuestionIndex].correctAnswer;
                                    
                                    let buttonStyles = "border-border bg-card/50 hover:bg-card hover:border-accent/40";
                                    if (isSelected && !answerSubmitted) {
                                      buttonStyles = "border-accent bg-accent/5 ring-1 ring-accent/30";
                                    } else if (answerSubmitted) {
                                      if (isCorrect) {
                                        buttonStyles = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
                                      } else if (isSelected) {
                                        buttonStyles = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
                                      } else {
                                        buttonStyles = "border-border opacity-50";
                                      }
                                    }

                                    return (
                                      <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(idx)}
                                        disabled={answerSubmitted}
                                        className={`w-full text-left p-4 rounded-lg border flex items-center justify-between transition-all duration-200 ${buttonStyles}`}
                                      >
                                        <span className="text-sm md:text-base font-semibold flex items-center gap-3">
                                          <span className="w-6 h-6 rounded-full bg-muted/80 flex items-center justify-center text-xs font-mono border border-border">
                                            {String.fromCharCode(65 + idx)}
                                          </span>
                                          {option}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              {answerSubmitted && (
                                <div className={`p-5 rounded-lg border animate-slide-up ${
                                  selectedOption === activeModule.quiz[currentQuestionIndex].correctAnswer
                                    ? "bg-green-500/5 border-green-500/20"
                                    : "bg-red-500/5 border-red-500/20"
                                }`}>
                                  <h5 className="font-semibold text-sm mb-1 text-primary flex items-center gap-1.5">
                                    {selectedOption === activeModule.quiz[currentQuestionIndex].correctAnswer ? (
                                      <span className="text-green-500">Correct Explanation 💡</span>
                                    ) : (
                                      <span className="text-red-500">Concept Clarification 💡</span>
                                    )}
                                  </h5>
                                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                    {activeModule.quiz[currentQuestionIndex].explanation}
                                  </p>
                                </div>
                              )}
                              <div className="flex justify-end gap-3 border-t border-border/40 pt-5">
                                {!answerSubmitted ? (
                                  <Button
                                    variant="hero"
                                    size="sm"
                                    onClick={submitAnswer}
                                    disabled={selectedOption === null}
                                  >
                                    Submit Answer
                                  </Button>
                                ) : (
                                  <Button
                                    variant="hero"
                                    size="sm"
                                    onClick={nextQuestion}
                                  >
                                    {currentQuestionIndex + 1 === activeModule.quiz.length ? "Finish Quiz" : "Next Question"}
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* WORKSHEETS TAB */}
                      {activeTab === "worksheets" && (
                        <div className="max-w-5xl mx-auto space-y-6">
                          <Suspense fallback={
                            <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
                              <svg className="animate-spin h-6 w-6 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                              </svg>
                              <span className="text-sm font-medium">Loading worksheets…</span>
                            </div>
                          }>
                            <WorksheetViewer
                              initialUnitNumber={
                                activeModuleIndex < 5 ? activeModuleIndex + 1 : 2
                              }
                            />
                          </Suspense>
                        </div>
                      )}

                      {/* PUZZLES TAB */}
                      {activeTab === "puzzles" && (
                        <div className="max-w-4xl mx-auto space-y-6">
                          {/* Dedicated Puzzle Navigation Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 bg-card/90 backdrop-blur-md rounded-2xl border border-border shadow-sm">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link
                                to="/"
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/80 hover:bg-muted text-foreground text-xs font-semibold transition-all hover:scale-105 border border-border/80 shadow-xs"
                              >
                                <Home size={14} className="text-accent" /> Home
                              </Link>
                              <button
                                type="button"
                                onClick={handleBackToPuzzleSubjects}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all hover:scale-105 shadow-xs"
                              >
                                <Gamepad2 size={14} className="text-amber-500" /> Choose Subject
                              </button>
                              <button
                                type="button"
                                onClick={handleBackToDomains}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent text-xs font-semibold border border-accent/30 transition-all hover:scale-105 shadow-xs"
                              >
                                <ArrowLeft size={14} /> Course Roadmap
                              </button>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {activeDomain?.id === "data-science" && (
                                <a
                                  href="/puzzles/data-science-word-search.html"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all hover:scale-105 shadow-xs"
                                >
                                  <Sparkles size={14} /> Fullscreen Word Search App <ExternalLink size={12} />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => setPuzzleModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-105"
                              >
                                <Gamepad2 size={15} /> All Course Puzzles <Trophy size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Quick Course Switcher Pills */}
                          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                            <span className="text-xs font-bold text-muted-foreground whitespace-nowrap pl-1 pr-1">Subject:</span>
                            {domains.map((d, dIdx) => {
                              const isCurrentDomain = activeDomainIndex === dIdx;
                              return (
                                <button
                                  key={d.id}
                                  type="button"
                                  onClick={() => handlePlayPuzzle(dIdx)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                                    isCurrentDomain
                                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-105"
                                      : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:border-accent/50"
                                  }`}
                                >
                                  <span>{d.icon}</span>
                                  <span>{d.name}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Unit Puzzle Selector (if active domain has multiple puzzles) */}
                          {activeDomain && DOMAIN_PUZZLES[activeDomain.id] && DOMAIN_PUZZLES[activeDomain.id].length > 1 && (
                            <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                <span>Select Unit Puzzle:</span>
                                <span className="text-accent font-semibold lowercase">
                                  {selectedPuzzleIndex + 1} of {DOMAIN_PUZZLES[activeDomain.id].length} puzzles
                                </span>
                              </div>
                              <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                                {DOMAIN_PUZZLES[activeDomain.id].map((puz, pIdx) => {
                                  const isSelected = selectedPuzzleIndex === pIdx;
                                  return (
                                    <button
                                      key={puz.id}
                                      type="button"
                                      onClick={() => setSelectedPuzzleIndex(pIdx)}
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                        isSelected
                                          ? "bg-primary text-primary-foreground shadow-sm font-bold scale-105 ring-1 ring-accent/40"
                                          : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70"
                                      }`}
                                    >
                                      <Puzzle size={13} />
                                      <span>{puz.title.split(":")[0]}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {activeDomain && DOMAIN_PUZZLES[activeDomain.id] ? (
                            <div className="space-y-8">
                              {DOMAIN_PUZZLES[activeDomain.id].length > 1 ? (
                                <WordPuzzle
                                  key={`${activeDomain.id}-${DOMAIN_PUZZLES[activeDomain.id][Math.min(selectedPuzzleIndex, DOMAIN_PUZZLES[activeDomain.id].length - 1)].id}`}
                                  puzzle={DOMAIN_PUZZLES[activeDomain.id][Math.min(selectedPuzzleIndex, DOMAIN_PUZZLES[activeDomain.id].length - 1)]}
                                  onBack={handleBackToDomains}
                                  onBackToSubjects={handleBackToPuzzleSubjects}
                                  domains={domains.map((d) => ({ id: d.id, name: d.name, icon: d.icon }))}
                                  activeDomainIndex={activeDomainIndex}
                                  onSelectDomain={handlePlayPuzzle}
                                />
                              ) : (
                                DOMAIN_PUZZLES[activeDomain.id].map((puzzle) => (
                                  <WordPuzzle 
                                    key={`${activeDomain.id}-${puzzle.id}`} 
                                    puzzle={puzzle} 
                                    onBack={handleBackToDomains}
                                    onBackToSubjects={handleBackToPuzzleSubjects}
                                    domains={domains.map((d) => ({ id: d.id, name: d.name, icon: d.icon }))}
                                    activeDomainIndex={activeDomainIndex}
                                    onSelectDomain={handlePlayPuzzle}
                                  />
                                ))
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-16 border border-dashed border-border rounded-xl">
                              <Puzzle size={48} className="mx-auto text-muted-foreground opacity-40 mb-3" />
                              <p className="text-muted-foreground font-medium">Puzzles for this topic are coming soon.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX NOTE IMAGE MODAL */}
      {lightboxOpen && activeModule && activeModule.notes[activeNoteIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 animate-fade-in">
          <button 
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={24} />
          </button>
          <div className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center">
            <img 
              src={activeModule.notes[activeNoteIndex].imageUrl} 
              alt={activeModule.notes[activeNoteIndex].title} 
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="text-center text-white mt-4 max-w-2xl px-4">
              <h3 className="font-serif text-xl font-bold">{activeModule.notes[activeNoteIndex].title}</h3>
              <p className="text-xs text-gray-300 mt-1">{activeModule.notes[activeNoteIndex].description}</p>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC VIDEO PLAYER LIGHTBOX */}
      {activePlayVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6 animate-fade-in">
          <div className="relative bg-card border border-border w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-muted border-b border-border flex items-center justify-between">
              <h3 className="font-serif font-bold text-primary line-clamp-1">{activePlayVideoTitle}</h3>
              <button 
                onClick={() => {
                  setActivePlayVideoUrl(null);
                  setActivePlayVideoTitle("");
                }}
                className="p-1 rounded bg-muted-foreground/10 hover:bg-muted-foreground/20 text-muted-foreground transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="relative w-full aspect-video bg-black">
              <iframe 
                src={activePlayVideoUrl} 
                title={activePlayVideoTitle}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL DIALOG: DYNAMIC VIDEO UPLOAD */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-card border border-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-up">
            
            <div className="p-5 border-b border-border/80 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-primary flex items-center gap-2">
                <Upload size={18} className="text-accent" /> Upload Seminar Lecture Video
              </h3>
              <button 
                onClick={() => setVideoModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleVideoUploadSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Lecture Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Intro to Bloch Spheres"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Lecture Embed URL (YouTube or Vimeo) *
                </label>
                <input 
                  type="url" 
                  required
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Duration (Optional)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. 15m or 1h 10m"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Short Description *
                </label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Write a brief overview of topics discussed in the video..."
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="hero-outline" 
                  size="sm" 
                  onClick={() => setVideoModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="sm"
                >
                  Upload Lecture
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL DIALOG: DYNAMIC NOTE SNIPPET UPLOAD */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-card border border-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-up">
            
            <div className="p-5 border-b border-border/80 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-primary flex items-center gap-2">
                <Upload size={18} className="text-accent" /> Add Lecture Notes Slide
              </h3>
              <button 
                onClick={() => setNoteModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleNoteUploadSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Slide / Note Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Quantum Gate Calculations Matrix"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Slide Diagram / Cover Image URL (Optional)
                </label>
                <input 
                  type="url" 
                  placeholder="Paste direct image link, or leave blank for default graphic"
                  value={noteImage}
                  onChange={(e) => setNoteImage(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                />
                <span className="text-[10px] text-muted-foreground leading-normal block">
                  You can copy and paste any valid image URL. If left empty, a beautiful default illustration will be chosen.
                </span>
              </div>

              {/* PDF Document Upload Option */}
              <div className="space-y-2 p-3.5 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <FileText size={14} className="text-red-500" />
                    <span>Attach PDF Lecture Document (Optional)</span>
                  </label>
                  <span className="text-[10px] bg-red-500/15 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full">
                    PDF Document
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border hover:border-accent text-xs font-semibold text-foreground transition-all shadow-2xs hover:scale-[1.02] active:scale-95">
                    <Upload size={14} className="text-accent" />
                    <span>{notePdfFileName ? "Change PDF File" : "Choose PDF File"}</span>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handlePdfFileChange}
                      className="hidden"
                    />
                  </label>
                  {notePdfFileName && (
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-foreground font-medium truncate max-w-[200px]" title={notePdfFileName}>
                        {notePdfFileName}
                      </span>
                      {notePdfSize && (
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
                          {(notePdfSize / 1024).toFixed(1)} KB
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setNotePdfUrl("");
                          setNotePdfFileName("");
                          setNotePdfSize(null);
                        }}
                        className="text-xs text-muted-foreground hover:text-red-500 p-0.5"
                        title="Remove PDF"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-1">
                  <input
                    type="url"
                    placeholder="Or paste external PDF URL (Google Drive, Dropbox, etc.)"
                    value={notePdfUrl.startsWith("data:") ? "" : notePdfUrl}
                    onChange={(e) => {
                      setNotePdfUrl(e.target.value);
                      if (e.target.value) {
                        setNotePdfFileName("Online_Document.pdf");
                      }
                    }}
                    className="w-full text-xs px-3 py-2 rounded bg-background border border-border focus:border-accent focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Upload textbook chapters, reference PDFs, formula sheets, or lab handouts.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Concept Detail / Explanation text *
                </label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Provide a detailed explanation of the formulas, equations, or scientific principles illustrated on this note slide..."
                  value={noteDesc}
                  onChange={(e) => setNoteDesc(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="hero-outline" 
                  size="sm" 
                  onClick={() => setNoteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  variant="hero"
                  size="sm"
                  disabled={notePdfUploading}
                >
                  {notePdfUploading ? "Uploading PDF..." : "Add Slide"}
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* FULLSCREEN PPT / PRESENTATION LIGHTBOX MODAL */}
      {fullscreenPpt && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-fade-in">
          {/* Fullscreen Header */}
          <div className="p-4 bg-black/80 border-b border-white/10 flex items-center justify-between text-white backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded bg-accent/20 text-accent font-bold">
                <Presentation size={20} />
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-white leading-snug">
                  {fullscreenPpt.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-1">
                  Presentation Fullscreen View • {fullscreenPpt.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={fullscreenPpt.pptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
              >
                Open Drive <ExternalLink size={12} />
              </a>
              <button
                onClick={() => setFullscreenPpt(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Exit Fullscreen View"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Fullscreen Iframe */}
          <div className="flex-1 w-full bg-black flex items-center justify-center p-2 md:p-6">
            <iframe
              src={fullscreenPpt.embedUrl}
              title={fullscreenPpt.title}
              className="w-full h-full rounded-lg border border-white/10 shadow-2xl"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* MODAL DIALOG: DYNAMIC PPT UPLOAD */}
      {pptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-card border border-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-up">
            
            <div className="p-5 border-b border-border/80 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-primary flex items-center gap-2">
                <Upload size={18} className="text-accent" /> Upload PPT / Drive Presentation Link
              </h3>
              <button 
                onClick={() => setPptModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePptUploadSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Presentation Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Quantum Gates & Linear Algebra PPT"
                  value={pptTitle}
                  onChange={(e) => setPptTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  PPT / Drive Link * (Google Slides, Drive PDF/PPT, OneDrive)
                </label>
                <input 
                  type="url" 
                  required
                  placeholder="e.g. https://docs.google.com/presentation/d/.../edit"
                  value={pptUrl}
                  onChange={(e) => setPptUrl(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                />
                <span className="text-[10px] text-muted-foreground leading-normal block">
                  Paste Google Drive presentation share link or view link. It will automatically be converted to an interactive embed.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Slide Count / Pages (Optional)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. 12 Slides or 24 Pages"
                  value={pptSlideCount}
                  onChange={(e) => setPptSlideCount(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Short Description *
                </label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Brief description of topics covered in this presentation slide deck..."
                  value={pptDesc}
                  onChange={(e) => setPptDesc(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="hero-outline" 
                  size="sm" 
                  onClick={() => setPptModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="sm"
                >
                  Upload Presentation
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}
      {/* MODAL DIALOG: EDIT MODULE & SYLLABUS */}
      {editModuleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
            
            <div className="p-5 border-b border-border/80 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-primary flex items-center gap-2">
                  <Edit3 size={18} className="text-accent" /> Edit Module &amp; Syllabus
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update syllabus topics, curriculum outline, and learning objectives for {activeDomain?.name}.
                </p>
              </div>
              <button 
                onClick={() => setEditModuleModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditModuleSubmit} className="p-5 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Module Name / Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Module 1: Classical Computing Basics"
                  value={editModuleName}
                  onChange={(e) => setEditModuleName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Topics / Short Summary *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Topics: Bits vs Qubits, Logic Gates, Binary Systems, Computational Thinking"
                  value={editModuleDesc}
                  onChange={(e) => setEditModuleDesc(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                />
                <p className="text-[11px] text-muted-foreground">
                  Comma-separated key terminology or concise topic summary.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Detailed Syllabus Outline &amp; Units
                </label>
                <textarea 
                  rows={4}
                  placeholder={`Unit 1: Fundamental Principles and Mathematical Formulation\nUnit 2: Logic Gates and Circuit Transformations\nUnit 3: Algorithmic Paradigms and Case Studies\nUnit 4: Practical Laboratory Synthesis`}
                  value={editModuleSyllabus}
                  onChange={(e) => setEditModuleSyllabus(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none resize-none font-mono text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Enter each unit or curriculum topic on a new line.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Expected Learning Outcomes (Optional)
                </label>
                <textarea 
                  rows={3}
                  placeholder={`Understand foundational paradigms and theoretical formulations\nAnalyze and verify circuit and algorithm complexity\nImplement practical solutions using industry standard tools`}
                  value={editModuleOutcomes}
                  onChange={(e) => setEditModuleOutcomes(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none resize-none text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  One learning objective / competency per line.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">
                    Recommended Study Duration
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 8 Hours / 2 Weeks"
                    value={editModuleDuration}
                    onChange={(e) => setEditModuleDuration(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">
                    Textbooks / Reference Materials
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Author, Title, Publisher"
                    value={editModuleReferences}
                    onChange={(e) => setEditModuleReferences(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-border/80">
                <Button 
                  type="button" 
                  variant="hero-outline" 
                  size="sm" 
                  onClick={() => setEditModuleModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="sm"
                >
                  Save Syllabus Changes
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL DIALOG: ADD MODULE / SYLLABUS OPTION */}
      {addModuleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
            
            <div className="p-5 border-b border-border/80 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-primary flex items-center gap-2">
                  <Plus size={18} className="text-accent" /> Add Module &amp; Syllabus Option
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Expand the curriculum of {activeDomain?.name} with a new syllabus unit.
                </p>
              </div>
              <button 
                onClick={() => setAddModuleModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddModuleSubmit} className="p-5 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Module Name / Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={`e.g. Module ${(activeDomain?.modules.length || 0) + 1}: Advanced Architectures`}
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Topics / Short Summary *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Topics: Hybrid Computing, Quantum Annealing, Fault Tolerance"
                  value={newModuleDesc}
                  onChange={(e) => setNewModuleDesc(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Detailed Syllabus Outline &amp; Units
                </label>
                <textarea 
                  rows={4}
                  placeholder={`Unit 1: Overview and Core Concepts\nUnit 2: Architecture and Algorithmic Design\nUnit 3: Case Studies and Hands-on Applications`}
                  value={newModuleSyllabus}
                  onChange={(e) => setNewModuleSyllabus(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none resize-none font-mono text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Enter each unit or curriculum topic on a new line.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Expected Learning Outcomes (Optional)
                </label>
                <textarea 
                  rows={3}
                  placeholder={`Master core techniques and architectures\nSolve practical computational engineering challenges`}
                  value={newModuleOutcomes}
                  onChange={(e) => setNewModuleOutcomes(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none resize-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">
                    Recommended Study Duration
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 8 Hours"
                    value={newModuleDuration}
                    onChange={(e) => setNewModuleDuration(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">
                    Textbooks / Reference Materials
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Recommended Textbooks"
                    value={newModuleReferences}
                    onChange={(e) => setNewModuleReferences(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded bg-muted/50 border border-border focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-border/80">
                <Button 
                  type="button" 
                  variant="hero-outline" 
                  size="sm" 
                  onClick={() => setAddModuleModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="sm"
                >
                  Add Module to Syllabus
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* FLOATING QUICK ACCESS PUZZLES & GAMES BUTTON ON THE RIGHT */}
      <div className="fixed right-4 sm:right-6 bottom-6 sm:bottom-8 z-40 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => setPuzzleModalOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-full font-bold shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-white/30 dark:ring-white/10"
          title="Play Course Puzzles & Games"
        >
          <Gamepad2 size={22} className="group-hover:rotate-12 transition-transform animate-bounce" />
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-bold tracking-tight leading-none">Puzzles & Games</span>
            <span className="text-[10px] text-white/80 font-medium leading-none mt-0.5">Top 10 Leaderboards</span>
          </div>
          <span className="bg-white/25 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider ml-1">
            Play
          </span>
        </button>
      </div>

      {/* PUZZLE & GAMES HUB MODAL */}
      {puzzleModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPuzzleModalOpen(false)}
        >
          <div 
            className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl overflow-hidden p-6 space-y-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <Gamepad2 size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
                    Course Puzzles & Games <Trophy size={18} className="text-amber-500" />
                  </h3>
                  <p className="text-xs text-muted-foreground">Select any course to solve its interactive word connect puzzle and claim your rank on the live leaderboard!</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPuzzleModalOpen(false)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto pr-1">
              {domains.map((d, idx) => {
                const puzzle = DOMAIN_PUZZLES[d.id]?.[0];
                return (
                  <div
                    key={d.id}
                    onClick={() => handlePlayPuzzle(idx)}
                    className="group cursor-pointer p-4 rounded-xl border border-border hover:border-amber-500/60 bg-muted/30 hover:bg-amber-500/5 transition-all duration-200 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl p-2 rounded-lg bg-card border border-border group-hover:scale-110 transition-transform">
                        {d.icon}
                      </span>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-primary group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {d.name}
                        </h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {puzzle ? puzzle.title : "Interactive puzzle game"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                      <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                        <Trophy size={13} className="text-amber-500" /> Live Leaderboard
                      </span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Play Now <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
              <Link
                to="/"
                onClick={() => setPuzzleModalOpen(false)}
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent font-semibold transition-colors"
              >
                <Home size={14} /> Home Page
              </Link>
              <button
                type="button"
                onClick={() => {
                  setPuzzleModalOpen(false);
                  handleBackToDomains();
                }}
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent font-semibold transition-colors"
              >
                <ArrowLeft size={14} /> All Courses Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated PDF Notes Document Viewer Modal */}
      <PdfPreviewModal
        isOpen={previewPdfModalOpen}
        onClose={() => setPreviewPdfModalOpen(false)}
        pdfUrl={previewPdfUrl || undefined}
        fileName={previewPdfTitle ? `${previewPdfTitle.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf` : "Lecture_Notes.pdf"}
        studentName="QLearn Student"
      />

      {/* Visitor Access Identification Modal ("Login not like a login") */}
      {!isAdminPortal && (
        <VisitorAccessModal
          isOpen={visitorModalOpen}
          onClose={() => setVisitorModalOpen(false)}
          onSuccess={handleVisitorSuccess}
          targetItem={targetItemPrompt}
          targetType={targetTypePrompt}
          canDismiss={true}
        />
      )}

      {!isAdminPortal && <Footer />}
    </div>
  );
}
