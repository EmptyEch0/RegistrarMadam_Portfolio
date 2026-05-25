import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
  ChevronRightSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Interfaces
interface VideoItem {
  id: string;
  title: string;
  url: string;
  duration: string;
  description: string;
}

interface NoteSnippet {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface TopicData {
  id: string;
  name: string;
  icon: string;
  shortDesc: string;
  description: string;
  color: string;
  glowColor: string;
  videos: VideoItem[];
  notes: NoteSnippet[];
  quiz: QuizQuestion[];
}

const DEFAULT_TOPICS: TopicData[] = [
  {
    id: "intro-quantum",
    name: "Quantum Computing Basics",
    icon: "⚛️",
    shortDesc: "Fundamentals of qubits, superposition, and Bloch sphere representation.",
    description: "Explore the core physical concepts that distinguish quantum mechanics from classical computation, including representation of qubits, basic mathematical constructs, and Hilbert spaces.",
    color: "from-blue-600 to-indigo-700",
    glowColor: "rgba(59, 130, 246, 0.4)",
    videos: [
      {
        id: "vid-1",
        title: "Quantum Computing for Computer Scientists",
        url: "https://www.youtube.com/embed/F_Riqjdh2oM",
        duration: "1h 28m",
        description: "A comprehensive introductory talk by Microsoft Research translating quantum mechanics into basic matrix math and programming structures for computer scientists."
      },
      {
        id: "vid-2",
        title: "Quantum Computing Explained Simply",
        url: "https://www.youtube.com/embed/j13YmZ9uUeQ",
        duration: "12m",
        description: "A visually engaging summary of quantum physics, qubits, and how superposition enables massive parallel quantum calculations."
      }
    ],
    notes: [
      {
        id: "note-1",
        title: "Classical vs Quantum State Representation",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
        description: "A visual comparison contrasting classical bits (restricted to 0 or 1) with quantum bits (qubits) represented as a linear combination of states |0> and |1> using Dirac Ket notation: |ψ> = α|0> + β|1>."
      },
      {
        id: "note-2",
        title: "Understanding the Bloch Sphere",
        imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
        description: "A geometric mapping representing single-qubit states as points on the surface of a unit sphere. Pure states populate the surface, while mixed states lie within the interior."
      }
    ],
    quiz: [
      {
        question: "What is the fundamental unit of quantum information called?",
        options: ["Classical Bit", "Qubit", "Quantum Byte", "Bloch Particle"],
        correctAnswer: 1,
        explanation: "A Qubit (Quantum Bit) is the fundamental unit of quantum information, capable of representing 0, 1, or both simultaneously."
      },
      {
        question: "Which quantum concept describes a qubit existing in multiple states simultaneously?",
        options: ["Entanglement", "Superposition", "Teleportation", "Coherence"],
        correctAnswer: 1,
        explanation: "Superposition allows a quantum system to exist in a linear combination of multiple states until it is measured and collapses into a definite state."
      },
      {
        question: "Which geometric representation is used to visualize the state of a single qubit?",
        options: ["Hilbert Plane", "Dirac Cylinder", "Bloch Sphere", "Euler Circle"],
        correctAnswer: 2,
        explanation: "The Bloch Sphere is a standard mathematical model mapping the state of a single qubit to coordinates on a three-dimensional unit sphere."
      }
    ]
  },
  {
    id: "superposition-entanglement",
    name: "Superposition & Entanglement",
    icon: "🔗",
    shortDesc: "Spooky action at a distance, Bell states, and quantum correlation.",
    description: "Deep dive into the magic of quantum entanglement, understanding how multiple qubits can experience synchronized correlations that classical physics cannot explain.",
    color: "from-indigo-600 to-purple-700",
    glowColor: "rgba(139, 92, 246, 0.4)",
    videos: [
      {
        id: "vid-3",
        title: "Quantum Entanglement & Spooky Action",
        url: "https://www.youtube.com/embed/ZuvK-ldpTfk",
        duration: "15m",
        description: "An exceptional documentary tracing Einstein's skepticism, Bohr's defenses, and the modern experiments proving quantum entanglement is real."
      },
      {
        id: "vid-4",
        title: "Bell's Inequality & Quantum Reality",
        url: "https://www.youtube.com/embed/lh7p65_P0iU",
        duration: "18m",
        description: "A detailed visual explanation of Bell's Theorem, demonstrating mathematically why local hidden variables cannot replicate quantum statistics."
      }
    ],
    notes: [
      {
        id: "note-3",
        title: "EPR Paradox and Quantum Correlation",
        imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
        description: "The Einstein-Podolsky-Rosen paradox illustrated. Shows how measuring one entangled qubit instantaneously collapses the wave function of its distant partner qubit."
      },
      {
        id: "note-4",
        title: "The Four Bell States",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        description: "Formulas representing the four maximally entangled two-qubit states. These states form a complete basis for quantum communication processes such as teleportation."
      }
    ],
    quiz: [
      {
        question: "What did Albert Einstein famously call quantum entanglement?",
        options: ["Spooky Action at a Distance", "Phantom Wave Correlation", "Telepathic Superposition", "Mysterious Synchronization"],
        correctAnswer: 0,
        explanation: "Einstein was deeply skeptical of non-locality and famously termed quantum entanglement 'Spooky Action at a Distance'."
      },
      {
        question: "How many qubits are involved in a standard Bell State?",
        options: ["1 qubit", "2 qubits", "4 qubits", "Infinite qubits"],
        correctAnswer: 1,
        explanation: "Bell States describe the four maximally entangled quantum states of exactly two qubits."
      },
      {
        question: "If two qubits are entangled in a Bell state, what does measuring the first qubit accomplish?",
        options: ["Nothing about the second qubit", "The exact state of the second qubit is instantaneously determined", "The state of the second qubit changes after a light-speed delay", "We only gain a 50% probability of knowing the second state"],
        correctAnswer: 1,
        explanation: "Entanglement links their fates perfectly; measuring the first qubit instantaneously collapses the quantum state of both qubits, locking the second one's state immediately."
      }
    ]
  },
  {
    id: "algorithms-crypto",
    name: "Quantum Algorithms & Cryptography",
    icon: "🔐",
    shortDesc: "Shor's algorithm, Grover's search, and Quantum Key Distribution (QKD).",
    description: "Analyze the real-world applications of quantum computing including factoring large integers, database search speedups, and secure encryption methods that resist quantum attacks.",
    color: "from-purple-600 to-pink-700",
    glowColor: "rgba(236, 72, 153, 0.4)",
    videos: [
      {
        id: "vid-5",
        title: "Shor's Algorithm: Breaking RSA Encryption",
        url: "https://www.youtube.com/embed/wUkM81okeyM",
        duration: "20m",
        description: "An intuitive explanation of how Shor's algorithm leverages period-finding and quantum Fourier transforms to factor large primes in polynomial time."
      },
      {
        id: "vid-6",
        title: "Grover's Quantum Search Algorithm Explained",
        url: "https://www.youtube.com/embed/g_U955I-n9A",
        duration: "14m",
        description: "A mathematical breakdown of Grover's database search showing how amplitude amplification increases the probability of measuring the correct state."
      }
    ],
    notes: [
      {
        id: "note-5",
        title: "RSA Encryption vs Shor's Algorithm",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
        description: "Comparison diagram showing classical computers taking exponential time to factor primes vs Shor's algorithm completing the factorization in polynomial time, breaking current RSA security."
      },
      {
        id: "note-6",
        title: "BB84 Quantum Key Distribution Protocol",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
        description: "A step-by-step schematic of how polarized photons are transmitted by Alice and measured by Bob, showing how eavesdroppers inevitably introduce measurable error rates."
      }
    ],
    quiz: [
      {
        question: "Shor's algorithm poses a direct mathematical threat to which encryption protocol?",
        options: ["AES-256", "RSA", "SHA-256", "Blowfish"],
        correctAnswer: 1,
        explanation: "RSA relies on the extreme difficulty of prime factorization. Shor's algorithm can solve prime factorization in polynomial time, bypassing RSA."
      },
      {
        question: "Grover's algorithm provides what level of speedup for searching unstructured databases?",
        options: ["Logarithmic", "Linear", "Quadratic", "Exponential"],
        correctAnswer: 2,
        explanation: "Grover's algorithm searches an N-item unstructured database in O(sqrt(N)) evaluations, yielding a quadratic speedup over classical O(N) searches."
      },
      {
        question: "Which of the following is the first-ever proposed Quantum Key Distribution protocol?",
        options: ["BB84", "RSA-77", "Shor-94", "Bell-64"],
        correctAnswer: 0,
        explanation: "BB84 was designed by Charles Bennett and Gilles Brassard in 1984 as the first protocol for secure quantum key distribution."
      }
    ]
  }
];

export default function QLearnPage() {
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"videos" | "notes" | "quiz">("videos");
  
  // Carousel states for the active notes tab
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Upload modals states
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  // Upload forms inputs
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [videoDesc, setVideoDesc] = useState("");

  const [noteTitle, setNoteTitle] = useState("");
  const [noteImage, setNoteImage] = useState("");
  const [noteDesc, setNoteDesc] = useState("");

  // Video lecture player modal
  const [activePlayVideoUrl, setActivePlayVideoUrl] = useState<string | null>(null);
  const [activePlayVideoTitle, setActivePlayVideoTitle] = useState("");

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("qlearn_topics");
    if (saved) {
      try {
        setTopics(JSON.parse(saved));
      } catch (e) {
        console.error("Failed parsing QLearn topics data, resetting to defaults", e);
        setTopics(DEFAULT_TOPICS);
        localStorage.setItem("qlearn_topics", JSON.stringify(DEFAULT_TOPICS));
      }
    } else {
      setTopics(DEFAULT_TOPICS);
      localStorage.setItem("qlearn_topics", JSON.stringify(DEFAULT_TOPICS));
    }
  }, []);

  // Update localStorage when topics change
  const saveTopics = (updatedTopics: TopicData[]) => {
    setTopics(updatedTopics);
    localStorage.setItem("qlearn_topics", JSON.stringify(updatedTopics));
  };

  const activeTopic = topics[activeTopicIndex] || DEFAULT_TOPICS[0];

  // Carousel actions
  const handleNextNote = () => {
    if (!activeTopic.notes.length) return;
    setActiveNoteIndex((prev) => (prev + 1) % activeTopic.notes.length);
  };

  const handlePrevNote = () => {
    if (!activeTopic.notes.length) return;
    setActiveNoteIndex((prev) => (prev - 1 + activeTopic.notes.length) % activeTopic.notes.length);
  };

  // Video Upload submit handler
  const handleVideoUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoUrl || !videoDesc) {
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

    const updatedTopics = topics.map((t, idx) => {
      if (idx === activeTopicIndex) {
        return {
          ...t,
          videos: [...t.videos, newVideo]
        };
      }
      return t;
    });

    saveTopics(updatedTopics);
    setVideoTitle("");
    setVideoUrl("");
    setVideoDuration("");
    setVideoDesc("");
    setVideoModalOpen(false);
  };

  // Note Snippet Upload submit handler
  const handleNoteUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteDesc) {
      alert("Please fill in all required fields.");
      return;
    }

    // Default note diagram image if blank
    const fallbackImage = noteImage || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800";

    const newNote: NoteSnippet = {
      id: `note-${Date.now()}`,
      title: noteTitle,
      imageUrl: fallbackImage,
      description: noteDesc
    };

    const updatedTopics = topics.map((t, idx) => {
      if (idx === activeTopicIndex) {
        return {
          ...t,
          notes: [...t.notes, newNote]
        };
      }
      return t;
    });

    saveTopics(updatedTopics);
    setNoteTitle("");
    setNoteImage("");
    setNoteDesc("");
    setNoteModalOpen(false);
    setActiveNoteIndex(activeTopic.notes.length); // jump to the newly added note
  };

  // Quiz interactive triggers
  const startQuiz = () => {
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
    if (selectedOption === null || answerSubmitted) return;
    setAnswerSubmitted(true);
    if (selectedOption === activeTopic.quiz[currentQuestionIndex].correctAnswer) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setAnswerSubmitted(false);
    if (currentQuestionIndex + 1 < activeTopic.quiz.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // Switch topic handler
  const handleTopicSwitch = (idx: number) => {
    setActiveTopicIndex(idx);
    setActiveNoteIndex(0);
    setActiveTab("videos");
    setQuizStarted(false);
    setQuizFinished(false);
  };

  // Quiz score badging logic
  const getBadge = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct >= 90) return { title: "Quantum Master 🏆", desc: "Astounding! You have a profound command of quantum physics." };
    if (pct >= 60) return { title: "Quantum Scholar 🎓", desc: "Excellent work! You possess high-level scientific intuition." };
    return { title: "Quantum Explorer ⚛️", desc: "Keep exploring! You are beginning an amazing journey into the subatomic world." };
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-[#080d21] via-background to-background overflow-hidden border-b border-border/40">
        {/* Glow Effects */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Particle Grid Effect */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />

        <div className="container-wide px-6 lg:px-12 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <Link 
              to="/education" 
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/15 border border-accent/30 rounded-full text-accent text-sm font-medium hover:bg-accent/20 transition-all duration-300 mb-6"
            >
              <ArrowLeft size={14} /> Back to Contributions
            </Link>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight leading-tight">
              QLearn
              <span className="text-accent block text-2xl md:text-3xl font-sans mt-2 font-medium tracking-normal">
                Quantum Computing & Physics Learning Center
              </span>
            </h1>
            
            <div className="w-24 h-1 bg-accent rounded-full my-6" />

            <p className="text-lg text-muted-foreground max-w-2xl">
              An interactive visual laboratory curated by <strong className="text-foreground">Dr. G. Jaya Suma</strong>. 
              Explore video seminars, download conceptual notes snippets, and test your understanding with custom physics quizzes.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN TOPIC & TABS SECTION */}
      <section className="flex-1 py-12 bg-background relative z-10">
        <div className="container-wide px-6 lg:px-12">
          
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* LEFT COLUMN: TOPICS INDEX */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="font-serif text-lg font-semibold text-primary px-1 mb-2">
                Quantum Syllabus Modules
              </h3>
              <div className="space-y-3">
                {topics.map((topic, index) => {
                  const isActive = index === activeTopicIndex;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSwitch(index)}
                      className={`w-full text-left p-5 rounded-lg border transition-all duration-300 transform hover:-translate-y-0.5 ${
                        isActive
                          ? "bg-card border-accent shadow-lg shadow-accent/5 ring-1 ring-accent/30"
                          : "bg-card/40 border-border hover:border-accent/40 hover:bg-card"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{topic.icon}</span>
                        <h4 className="font-serif font-semibold text-primary leading-tight">
                          {topic.name}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {topic.shortDesc}
                      </p>
                      
                      {/* Interactive indicator */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] tracking-wider uppercase text-accent font-semibold flex items-center gap-1">
                          Active Module <ChevronRightSquare size={10} className={isActive ? "translate-x-1 transition-transform" : ""} />
                        </span>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono">
                          {topic.videos.length} vids · {topic.notes.length} slides
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Informational Widget */}
              <div className="p-5 rounded-lg border border-border bg-gradient-to-br from-accent/5 to-transparent">
                <h4 className="font-semibold text-sm mb-2 text-primary flex items-center gap-1.5">
                  <Award size={16} className="text-accent" /> Professional Notice
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  These materials correspond to the PG Syllabus in advanced computer science, quantum modeling, and cryptographic systems.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: ACTIVE TOPIC CONTENT */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Active Topic Banner Card */}
              <div className={`p-8 rounded-xl bg-gradient-to-r ${activeTopic.color} text-white shadow-xl relative overflow-hidden`}>
                {/* Decorative glowing sphere */}
                <div 
                  className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-2xl opacity-60"
                  style={{ backgroundColor: activeTopic.glowColor }}
                />
                
                <div className="relative z-10 space-y-3 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl bg-white/10 p-2 rounded-lg backdrop-blur-md">
                      {activeTopic.icon}
                    </span>
                    <div>
                      <span className="text-xs tracking-widest uppercase font-semibold text-white/70">
                        Selected Course Module
                      </span>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold">
                        {activeTopic.name}
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed pt-2">
                    {activeTopic.description}
                  </p>
                </div>
              </div>

              {/* ACTION MENU TABS & UPLOAD BUTTONS */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border gap-4 pb-1">
                {/* Tab switchers */}
                <div className="flex gap-2">
                  {[
                    { id: "videos", label: "Video Seminars", icon: Video },
                    { id: "notes", label: "Lecture Notes", icon: BookOpen },
                    { id: "quiz", label: "Take Quiz", icon: Award }
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all duration-300 ${
                          isActive
                            ? "border-accent text-accent bg-accent/5"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        }`}
                      >
                        <TabIcon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Upload action hooks (contextual) */}
                <div className="flex gap-2">
                  {activeTab === "videos" && (
                    <Button 
                      variant="hero" 
                      size="sm"
                      onClick={() => setVideoModalOpen(true)}
                      className="flex items-center gap-2 text-xs"
                    >
                      <Plus size={14} /> Upload Video
                    </Button>
                  )}
                  {activeTab === "notes" && (
                    <Button 
                      variant="hero" 
                      size="sm"
                      onClick={() => setNoteModalOpen(true)}
                      className="flex items-center gap-2 text-xs"
                    >
                      <Plus size={14} /> Add Notes Slide
                    </Button>
                  )}
                </div>
              </div>

              {/* CONTENT PANEL */}
              <div className="min-h-[400px]">
                
                {/* 1. VIDEOS TAB */}
                {activeTab === "videos" && (
                  <div className="space-y-6">
                    {activeTopic.videos.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-border rounded-xl">
                        <Video size={48} className="mx-auto text-muted-foreground opacity-40 mb-3" />
                        <p className="text-muted-foreground font-medium">No videos found for this topic.</p>
                        <p className="text-xs text-muted-foreground/75 mt-1">Be the first to upload a video lecture above!</p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        {activeTopic.videos.map((vid) => (
                          <div 
                            key={vid.id}
                            className="card-institutional p-5 flex flex-col justify-between group hover:border-accent/40 hover:shadow-xl transition-all duration-300"
                          >
                            <div>
                              {/* Dummy thumbnail container */}
                              <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-border/80 mb-4 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-indigo-900/20 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                
                                {/* Abstract graphics */}
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

                            <div className="border-t border-border/40 pt-4 flex items-center justify-between">
                              <span className="text-xs text-muted-foreground font-mono">
                                Seminar Lecture Video
                              </span>
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
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. NOTES CAROUSEL TAB */}
                {activeTab === "notes" && (
                  <div className="space-y-6">
                    {activeTopic.notes.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-border rounded-xl">
                        <BookOpen size={48} className="mx-auto text-muted-foreground opacity-40 mb-3" />
                        <p className="text-muted-foreground font-medium">No notes snippets found for this topic.</p>
                        <p className="text-xs text-muted-foreground/75 mt-1">Upload note sheets or slides to start the deck!</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Custom visual carousel */}
                        <div className="relative bg-card border border-border rounded-xl p-6 md:p-10 shadow-lg">
                          
                          <div className="grid md:grid-cols-12 gap-8 items-center">
                            
                            {/* Slide image block */}
                            <div className="md:col-span-5 relative group">
                              <div className="relative aspect-square bg-slate-900 rounded-lg overflow-hidden border border-border shadow-inner flex items-center justify-center">
                                <img 
                                  src={activeTopic.notes[activeNoteIndex].imageUrl} 
                                  alt={activeTopic.notes[activeNoteIndex].title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                {/* Zoom Lightbox button */}
                                <button 
                                  onClick={() => setLightboxOpen(true)}
                                  className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-accent rounded text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                                  title="View Fullscreen"
                                >
                                  <Maximize2 size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Slide description details */}
                            <div className="md:col-span-7 space-y-4">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/15 border border-accent/30 rounded text-accent text-xs font-semibold">
                                Note Sheet {activeNoteIndex + 1} of {activeTopic.notes.length}
                              </div>

                              <h3 className="font-serif text-2xl font-bold text-primary">
                                {activeTopic.notes[activeNoteIndex].title}
                              </h3>
                              <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                                {activeTopic.notes[activeNoteIndex].description}
                              </p>
                              
                              {/* Conceptual Warning Info */}
                              <div className="p-4 bg-muted/50 rounded-lg border border-border text-xs text-muted-foreground leading-relaxed">
                                <strong className="text-foreground font-semibold block mb-1">Study Advice:</strong>
                                Review the mathematical equations in detail. Dirac matrix symbols, superposition amplitudes, and vector space dimensions represent vital topics in PG evaluation.
                              </div>
                            </div>

                          </div>

                          {/* Navigation buttons */}
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

                        {/* Thumbnail indicator strip below carousel */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          {activeTopic.notes.map((note, index) => {
                            const isActive = index === activeNoteIndex;
                            return (
                              <button
                                key={note.id}
                                onClick={() => setActiveNoteIndex(index)}
                                className={`w-16 h-16 rounded overflow-hidden border-2 transition-all duration-300 ${
                                  isActive
                                    ? "border-accent scale-110 shadow-md shadow-accent/20"
                                    : "border-border opacity-65 hover:opacity-100 hover:scale-105"
                                }`}
                              >
                                <img src={note.imageUrl} alt={note.title} className="w-full h-full object-cover" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. INTERACTIVE QUIZ TAB */}
                {activeTab === "quiz" && (
                  <div className="max-w-2xl mx-auto">
                    {!quizStarted ? (
                      /* Start Panel */
                      <div className="card-institutional p-8 text-center space-y-6 animate-fade-in">
                        <div className="w-16 h-16 bg-accent/15 border border-accent/30 rounded-full flex items-center justify-center mx-auto text-accent text-3xl">
                          🏆
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-serif text-2xl font-bold text-primary">
                            Test Your Quantum Intuition
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                            A curated {activeTopic.quiz.length}-question multiple-choice quiz designed by Dr. G. Jaya Suma to validate your core comprehension of <strong>{activeTopic.name}</strong>.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-muted rounded-lg text-left max-w-sm mx-auto space-y-2 text-xs">
                          <div className="flex items-center gap-2 text-primary font-semibold">
                            <HelpCircle size={14} className="text-accent" /> Quiz Standards:
                          </div>
                          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                            <li>Instant scoring feedback on selection.</li>
                            <li>Detailed scientific explanations included.</li>
                            <li>Earn special badges of achievement.</li>
                          </ul>
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
                      /* Final Score Panel */
                      <div className="card-institutional p-8 text-center space-y-6 animate-fade-in">
                        <div className="w-20 h-20 bg-accent/10 border-2 border-accent/20 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-4xl">👑</span>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                            Quiz Completion
                          </span>
                          <h3 className="font-serif text-3xl font-bold text-primary">
                            Excellent! Module Completed
                          </h3>
                        </div>

                        {/* Circular Score Badge */}
                        <div className="w-32 h-32 rounded-full border-4 border-accent flex flex-col items-center justify-center mx-auto bg-accent/5 shadow-lg shadow-accent/5">
                          <span className="text-3xl font-extrabold text-primary">
                            {quizScore} / {activeTopic.quiz.length}
                          </span>
                          <span className="text-[10px] tracking-wider uppercase text-accent font-semibold mt-1">
                            Correct
                          </span>
                        </div>

                        {/* Achievement Badge */}
                        <div className="p-5 bg-muted/60 rounded-lg max-w-md mx-auto border border-border">
                          <h4 className="font-semibold text-accent text-lg mb-1">
                            {getBadge(quizScore, activeTopic.quiz.length).title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {getBadge(quizScore, activeTopic.quiz.length).desc}
                          </p>
                        </div>

                        <div className="flex justify-center gap-3 pt-2">
                          <Button 
                            variant="hero-outline" 
                            size="sm" 
                            onClick={startQuiz}
                            className="flex items-center gap-2"
                          >
                            <RotateCcw size={14} /> Retake Quiz
                          </Button>
                          <Button 
                            variant="hero" 
                            size="sm" 
                            onClick={() => {
                              // go to next topic, or reset
                              const nextIdx = (activeTopicIndex + 1) % topics.length;
                              handleTopicSwitch(nextIdx);
                            }}
                          >
                            Next Course Module
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Active Question Panel */
                      <div className="card-institutional p-6 md:p-8 space-y-6 animate-fade-in">
                        
                        {/* Progress Header */}
                        <div className="flex items-center justify-between border-b border-border pb-4">
                          <div>
                            <span className="text-xs text-accent uppercase font-bold tracking-wider">
                              Assessment Mode
                            </span>
                            <h4 className="font-serif text-lg font-semibold text-primary">
                              Question {currentQuestionIndex + 1} of {activeTopic.quiz.length}
                            </h4>
                          </div>
                          <span className="text-sm font-mono bg-muted px-2.5 py-1 rounded text-muted-foreground font-semibold">
                            Score: {quizScore}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div 
                            className="bg-accent h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${((currentQuestionIndex + 1) / activeTopic.quiz.length) * 100}%` }}
                          />
                        </div>

                        {/* Question Text */}
                        <div className="space-y-4">
                          <h3 className="font-serif text-xl md:text-2xl font-bold text-primary leading-snug">
                            {activeTopic.quiz[currentQuestionIndex].question}
                          </h3>
                          
                          {/* Options Choice Grid */}
                          <div className="grid gap-3 pt-2">
                            {activeTopic.quiz[currentQuestionIndex].options.map((option, idx) => {
                              const isSelected = selectedOption === idx;
                              const isCorrect = idx === activeTopic.quiz[currentQuestionIndex].correctAnswer;
                              
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
                                  
                                  {/* Answer Submitted Feedback Icons */}
                                  {answerSubmitted && isCorrect && <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />}
                                  {answerSubmitted && isSelected && !isCorrect && <XCircle size={18} className="text-red-500 flex-shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Explanation Box */}
                        {answerSubmitted && (
                          <div className={`p-5 rounded-lg border animate-slide-up ${
                            selectedOption === activeTopic.quiz[currentQuestionIndex].correctAnswer
                              ? "bg-green-500/5 border-green-500/20"
                              : "bg-red-500/5 border-red-500/20"
                          }`}>
                            <h5 className="font-semibold text-sm mb-1 text-primary flex items-center gap-1.5">
                              {selectedOption === activeTopic.quiz[currentQuestionIndex].correctAnswer ? (
                                <span className="text-green-500">Correct Explanation 💡</span>
                              ) : (
                                <span className="text-red-500">Concept Clarification 💡</span>
                              )}
                            </h5>
                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                              {activeTopic.quiz[currentQuestionIndex].explanation}
                            </p>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex justify-end gap-3 border-t border-border/40 pt-5">
                          {!answerSubmitted ? (
                            <Button
                              variant="hero"
                              size="sm"
                              onClick={submitAnswer}
                              disabled={selectedOption === null}
                              className="px-6 font-semibold"
                            >
                              Submit Answer
                            </Button>
                          ) : (
                            <Button
                              variant="hero"
                              size="sm"
                              onClick={nextQuestion}
                              className="px-6 font-semibold flex items-center gap-1"
                            >
                              {currentQuestionIndex + 1 === activeTopic.quiz.length ? "Finish Quiz" : "Next Question"}
                            </Button>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* LIGHTBOX NOTE IMAGE MODAL */}
      {lightboxOpen && activeTopic.notes[activeNoteIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 animate-fade-in">
          <button 
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center">
            <img 
              src={activeTopic.notes[activeNoteIndex].imageUrl} 
              alt={activeTopic.notes[activeNoteIndex].title} 
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="text-center text-white mt-4 max-w-2xl px-4">
              <h3 className="font-serif text-xl font-bold">{activeTopic.notes[activeNoteIndex].title}</h3>
              <p className="text-xs text-gray-300 mt-1">{activeTopic.notes[activeNoteIndex].description}</p>
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
                >
                  Add Slide
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
