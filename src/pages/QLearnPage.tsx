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
  ChevronRightSquare,
  Presentation
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
  docUrl?: string;
  embedUrl?: string;
}

interface PptItem {
  id: string;
  title: string;
  pptUrl: string;
  embedUrl: string;
  description: string;
  slideCount?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ModuleData {
  id: string;
  name: string;
  description: string;
  videos: VideoItem[];
  notes: NoteSnippet[];
  ppts?: PptItem[];
  quiz: QuizQuestion[];
}

interface DomainData {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  glowColor: string;
  modules: ModuleData[];
}

const DEFAULT_DOMAINS: DomainData[] = [
  {
    "id": "quantum-computing",
    "name": "Quantum Computing",
    "icon": "\u269b\ufe0f",
    "description": "Complete 10-module roadmap for Quantum Computing.",
    "color": "from-blue-600 to-indigo-700",
    "glowColor": "rgba(59, 130, 246, 0.4)",
    "modules": [
      {
        "id": "mod-1",
        "name": "Module 1: Mathematics Foundations",
        "description": "Topics: Linear Algebra, Complex Numbers, Vectors & Matrices, Probability Basics",
        "videos": [
          {
            "id": "vid-1",
            "title": "Mathematics Foundations Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Mathematics Foundations."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Mathematics Foundations Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Mathematics Foundations."
          }
        ],
        "ppts": [
          {
            "id": "ppt-1",
            "title": "Mathematics Foundations & Linear Algebra Slides",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed?start=false&loop=false&delayms=3000",
            "description": "Comprehensive presentation slides covering Linear Algebra, Complex Vectors & Matrices.",
            "slideCount": "15 Slides"
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Mathematics Foundations?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Mathematics Foundations."
          }
        ]
      },
      {
        "id": "mod-2",
        "name": "Module 2: Classical Computing Basics",
        "description": "Topics: Bits vs Qubits, Logic Gates, Binary Systems, Computational Thinking",
        "videos": [
          {
            "id": "vid-1",
            "title": "Classical Computing Basics Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Classical Computing Basics."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Classical Computing Basics Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Classical Computing Basics."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Classical Computing Basics?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Classical Computing Basics."
          }
        ]
      },
      {
        "id": "mod-3",
        "name": "Module 3: Quantum Mechanics Basics",
        "description": "Topics: Superposition, Entanglement, Wave Functions, Measurement Theory",
        "videos": [
          {
            "id": "vid-1",
            "title": "Quantum Mechanics Basics Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Quantum Mechanics Basics."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Quantum Mechanics Basics Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Quantum Mechanics Basics."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Quantum Mechanics Basics?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Quantum Mechanics Basics."
          }
        ]
      },
      {
        "id": "mod-4",
        "name": "Module 4: Qubits & Quantum Gates",
        "description": "Topics: Bloch Sphere, Pauli Gates, Hadamard Gate, Quantum Circuits",
        "videos": [
          {
            "id": "vid-1",
            "title": "Qubits & Quantum Gates Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Qubits & Quantum Gates."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Qubits & Quantum Gates Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Qubits & Quantum Gates."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Qubits & Quantum Gates?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Qubits & Quantum Gates."
          }
        ]
      },
      {
        "id": "mod-5",
        "name": "Module 5: Quantum Algorithms",
        "description": "Topics: Deutsch Algorithm, Grover\u2019s Algorithm, Shor\u2019s Algorithm",
        "videos": [
          {
            "id": "vid-1",
            "title": "Quantum Algorithms Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Quantum Algorithms."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Quantum Algorithms Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Quantum Algorithms."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Quantum Algorithms?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Quantum Algorithms."
          }
        ]
      },
      {
        "id": "mod-6",
        "name": "Module 6: Quantum Programming",
        "description": "Topics: Python for Quantum, Qiskit, Cirq, Quantum Simulators",
        "videos": [
          {
            "id": "vid-1",
            "title": "Quantum Programming Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Quantum Programming."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Quantum Programming Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Quantum Programming."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Quantum Programming?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Quantum Programming."
          }
        ]
      },
      {
        "id": "mod-7",
        "name": "Module 7: Quantum Hardware",
        "description": "Topics: Quantum Processors, Superconducting Qubits, Ion Trap Systems",
        "videos": [
          {
            "id": "vid-1",
            "title": "Quantum Hardware Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Quantum Hardware."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Quantum Hardware Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Quantum Hardware."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Quantum Hardware?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Quantum Hardware."
          }
        ]
      },
      {
        "id": "mod-8",
        "name": "Module 8: Quantum Communication",
        "description": "Topics: Quantum Cryptography, Quantum Key Distribution, Teleportation",
        "videos": [
          {
            "id": "vid-1",
            "title": "Quantum Communication Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Quantum Communication."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Quantum Communication Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Quantum Communication."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Quantum Communication?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Quantum Communication."
          }
        ]
      },
      {
        "id": "mod-9",
        "name": "Module 9: Quantum Machine Learning",
        "description": "Topics: Variational Circuits, Quantum Neural Networks, Hybrid Models",
        "videos": [
          {
            "id": "vid-1",
            "title": "Quantum Machine Learning Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Quantum Machine Learning."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Quantum Machine Learning Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Quantum Machine Learning."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Quantum Machine Learning?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Quantum Machine Learning."
          }
        ]
      },
      {
        "id": "mod-10",
        "name": "Module 10: Real Projects",
        "description": "Topics: Quantum Random Generator, Quantum Encryption App, Quantum AI Mini Project",
        "videos": [
          {
            "id": "vid-1",
            "title": "Real Projects Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Real Projects."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Real Projects Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Real Projects."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Real Projects?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Real Projects."
          }
        ]
      }
    ]
  },
  {
    "id": "data-science",
    "name": "Data Science",
    "icon": "\ud83d\udcca",
    "description": "Complete 10-module roadmap for Data Science.",
    "color": "from-green-600 to-emerald-700",
    "glowColor": "rgba(16, 185, 129, 0.4)",
    "modules": [
      {
        "id": "mod-1",
        "name": "Module 1: Python Foundations",
        "description": "Topics: Variables, Loops, Functions, OOP Basics",
        "videos": [
          {
            "id": "vid-1",
            "title": "Python Foundations Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Python Foundations."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Python Foundations Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Python Foundations."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Python Foundations?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Python Foundations."
          }
        ]
      },
      {
        "id": "mod-2",
        "name": "Module 2: Mathematics for DS",
        "description": "Topics: Statistics, Probability, Linear Algebra, Calculus Basics",
        "videos": [
          {
            "id": "vid-1",
            "title": "Mathematics for DS Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Mathematics for DS."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Mathematics for DS Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Mathematics for DS."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Mathematics for DS?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Mathematics for DS."
          }
        ]
      },
      {
        "id": "mod-3",
        "name": "Module 3: Data Handling",
        "description": "Topics: NumPy, Pandas, CSV/Excel Handling, Data Cleaning",
        "videos": [
          {
            "id": "vid-1",
            "title": "Data Handling Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Data Handling."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Data Handling Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Data Handling."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Data Handling?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Data Handling."
          }
        ]
      },
      {
        "id": "mod-4",
        "name": "Module 4: Data Visualization",
        "description": "Topics: Matplotlib, Plotly, Seaborn, Dashboards",
        "videos": [
          {
            "id": "vid-1",
            "title": "Data Visualization Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Data Visualization."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Data Visualization Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Data Visualization."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Data Visualization?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Data Visualization."
          }
        ]
      },
      {
        "id": "mod-5",
        "name": "Module 5: Exploratory Data Analysis",
        "description": "Topics: Correlation, Feature Analysis, Missing Data, Outlier Detection",
        "videos": [
          {
            "id": "vid-1",
            "title": "Exploratory Data Analysis Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Exploratory Data Analysis."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Exploratory Data Analysis Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Exploratory Data Analysis."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Exploratory Data Analysis?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Exploratory Data Analysis."
          }
        ]
      },
      {
        "id": "mod-6",
        "name": "Module 6: SQL & Databases",
        "description": "Topics: SQL Queries, MySQL/PostgreSQL, Data Warehousing",
        "videos": [
          {
            "id": "vid-1",
            "title": "SQL & Databases Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on SQL & Databases."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "SQL & Databases Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for SQL & Databases."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of SQL & Databases?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for SQL & Databases."
          }
        ]
      },
      {
        "id": "mod-7",
        "name": "Module 7: Machine Learning Basics",
        "description": "Topics: Regression, Classification, Clustering",
        "videos": [
          {
            "id": "vid-1",
            "title": "Machine Learning Basics Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Machine Learning Basics."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Machine Learning Basics Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Machine Learning Basics."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Machine Learning Basics?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Machine Learning Basics."
          }
        ]
      },
      {
        "id": "mod-8",
        "name": "Module 8: Big Data",
        "description": "Topics: Hadoop, Spark, Distributed Systems",
        "videos": [
          {
            "id": "vid-1",
            "title": "Big Data Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Big Data."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Big Data Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Big Data."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Big Data?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Big Data."
          }
        ]
      },
      {
        "id": "mod-9",
        "name": "Module 9: Deployment & Cloud",
        "description": "Topics: Flask APIs, Streamlit, AWS/GCP Basics",
        "videos": [
          {
            "id": "vid-1",
            "title": "Deployment & Cloud Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Deployment & Cloud."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Deployment & Cloud Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Deployment & Cloud."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Deployment & Cloud?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Deployment & Cloud."
          }
        ]
      },
      {
        "id": "mod-10",
        "name": "Module 10: Real Projects",
        "description": "Topics: Sales Prediction, Student Performance Analysis, Dashboard Project",
        "videos": [
          {
            "id": "vid-1",
            "title": "Real Projects Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Real Projects."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Real Projects Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Real Projects."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Real Projects?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Real Projects."
          }
        ]
      }
    ]
  },
  {
    "id": "machine-learning",
    "name": "Machine Learning",
    "icon": "\ud83e\udd16",
    "description": "Complete 10-module roadmap for Machine Learning.",
    "color": "from-purple-600 to-fuchsia-700",
    "glowColor": "rgba(168, 85, 247, 0.4)",
    "modules": [
      {
        "id": "mod-1",
        "name": "Module 1: Python + Math",
        "description": "Topics: NumPy, Statistics, Probability, Linear Algebra",
        "videos": [
          {
            "id": "vid-1",
            "title": "Python + Math Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Python + Math."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Python + Math Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Python + Math."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Python + Math?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Python + Math."
          }
        ]
      },
      {
        "id": "mod-2",
        "name": "Module 2: Data Preprocessing",
        "description": "Topics: Cleaning, Encoding, Scaling, Feature Engineering",
        "videos": [
          {
            "id": "vid-1",
            "title": "Data Preprocessing Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Data Preprocessing."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Data Preprocessing Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Data Preprocessing."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Data Preprocessing?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Data Preprocessing."
          }
        ]
      },
      {
        "id": "mod-3",
        "name": "Module 3: Supervised Learning",
        "description": "Topics: Linear Regression, Logistic Regression, Decision Trees",
        "videos": [
          {
            "id": "vid-1",
            "title": "Supervised Learning Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Supervised Learning."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Supervised Learning Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Supervised Learning."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Supervised Learning?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Supervised Learning."
          }
        ]
      },
      {
        "id": "mod-4",
        "name": "Module 4: Unsupervised Learning",
        "description": "Topics: K-Means, PCA, Clustering",
        "videos": [
          {
            "id": "vid-1",
            "title": "Unsupervised Learning Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Unsupervised Learning."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Unsupervised Learning Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Unsupervised Learning."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Unsupervised Learning?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Unsupervised Learning."
          }
        ]
      },
      {
        "id": "mod-5",
        "name": "Module 5: Model Evaluation",
        "description": "Topics: Accuracy, Precision, Recall, Cross Validation",
        "videos": [
          {
            "id": "vid-1",
            "title": "Model Evaluation Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Model Evaluation."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Model Evaluation Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Model Evaluation."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Model Evaluation?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Model Evaluation."
          }
        ]
      },
      {
        "id": "mod-6",
        "name": "Module 6: Ensemble Learning",
        "description": "Topics: Random Forest, XGBoost, Bagging, Boosting",
        "videos": [
          {
            "id": "vid-1",
            "title": "Ensemble Learning Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Ensemble Learning."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Ensemble Learning Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Ensemble Learning."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Ensemble Learning?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Ensemble Learning."
          }
        ]
      },
      {
        "id": "mod-7",
        "name": "Module 7: Advanced ML",
        "description": "Topics: SVM, Naive Bayes, Recommendation Systems",
        "videos": [
          {
            "id": "vid-1",
            "title": "Advanced ML Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Advanced ML."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Advanced ML Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Advanced ML."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Advanced ML?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Advanced ML."
          }
        ]
      },
      {
        "id": "mod-8",
        "name": "Module 8: ML with Scikit-learn",
        "description": "Topics: Pipelines, Hyperparameter Tuning, GridSearchCV",
        "videos": [
          {
            "id": "vid-1",
            "title": "ML with Scikit-learn Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on ML with Scikit-learn."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "ML with Scikit-learn Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for ML with Scikit-learn."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of ML with Scikit-learn?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for ML with Scikit-learn."
          }
        ]
      },
      {
        "id": "mod-9",
        "name": "Module 9: ML Deployment",
        "description": "Topics: Flask/FastAPI, Docker Basics, APIs",
        "videos": [
          {
            "id": "vid-1",
            "title": "ML Deployment Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on ML Deployment."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "ML Deployment Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for ML Deployment."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of ML Deployment?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for ML Deployment."
          }
        ]
      },
      {
        "id": "mod-10",
        "name": "Module 10: Projects",
        "description": "Topics: Spam Detection, House Price Prediction, Recommendation Engine",
        "videos": [
          {
            "id": "vid-1",
            "title": "Projects Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Projects."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Projects Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Projects."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Projects?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Projects."
          }
        ]
      }
    ]
  },
  {
    "id": "deep-learning",
    "name": "Deep Learning",
    "icon": "\ud83e\udde0",
    "description": "Complete 10-module roadmap for Deep Learning.",
    "color": "from-rose-600 to-red-700",
    "glowColor": "rgba(225, 29, 72, 0.4)",
    "modules": [
      {
        "id": "mod-1",
        "name": "Module 1: Neural Network Basics",
        "description": "Topics: Perceptrons, Activation Functions, Forward Propagation",
        "videos": [
          {
            "id": "vid-1",
            "title": "Neural Network Basics Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Neural Network Basics."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Neural Network Basics Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Neural Network Basics."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Neural Network Basics?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Neural Network Basics."
          }
        ]
      },
      {
        "id": "mod-2",
        "name": "Module 2: TensorFlow & PyTorch",
        "description": "Topics: Tensors, GPU Training, Model Building",
        "videos": [
          {
            "id": "vid-1",
            "title": "TensorFlow & PyTorch Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on TensorFlow & PyTorch."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "TensorFlow & PyTorch Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for TensorFlow & PyTorch."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of TensorFlow & PyTorch?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for TensorFlow & PyTorch."
          }
        ]
      },
      {
        "id": "mod-3",
        "name": "Module 3: ANN Models",
        "description": "Topics: Dense Networks, Loss Functions, Optimizers",
        "videos": [
          {
            "id": "vid-1",
            "title": "ANN Models Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on ANN Models."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "ANN Models Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for ANN Models."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of ANN Models?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for ANN Models."
          }
        ]
      },
      {
        "id": "mod-4",
        "name": "Module 4: CNN",
        "description": "Topics: Image Processing, Feature Extraction, Convolution Layers",
        "videos": [
          {
            "id": "vid-1",
            "title": "CNN Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on CNN."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "CNN Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for CNN."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of CNN?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for CNN."
          }
        ]
      },
      {
        "id": "mod-5",
        "name": "Module 5: Transfer Learning",
        "description": "Topics: EfficientNet, ResNet, MobileNet",
        "videos": [
          {
            "id": "vid-1",
            "title": "Transfer Learning Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Transfer Learning."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Transfer Learning Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Transfer Learning."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Transfer Learning?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Transfer Learning."
          }
        ]
      },
      {
        "id": "mod-6",
        "name": "Module 6: RNN & LSTM",
        "description": "Topics: Sequential Data, Time Series, NLP Basics",
        "videos": [
          {
            "id": "vid-1",
            "title": "RNN & LSTM Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on RNN & LSTM."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "RNN & LSTM Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for RNN & LSTM."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of RNN & LSTM?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for RNN & LSTM."
          }
        ]
      },
      {
        "id": "mod-7",
        "name": "Module 7: NLP with Transformers",
        "description": "Topics: BERT, GPT, Hugging Face",
        "videos": [
          {
            "id": "vid-1",
            "title": "NLP with Transformers Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on NLP with Transformers."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "NLP with Transformers Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for NLP with Transformers."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of NLP with Transformers?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for NLP with Transformers."
          }
        ]
      },
      {
        "id": "mod-8",
        "name": "Module 8: GANs & Diffusion",
        "description": "Topics: Image Generation, Stable Diffusion, Generative AI",
        "videos": [
          {
            "id": "vid-1",
            "title": "GANs & Diffusion Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on GANs & Diffusion."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "GANs & Diffusion Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for GANs & Diffusion."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of GANs & Diffusion?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for GANs & Diffusion."
          }
        ]
      },
      {
        "id": "mod-9",
        "name": "Module 9: Deployment",
        "description": "Topics: ONNX, TensorRT, Edge AI",
        "videos": [
          {
            "id": "vid-1",
            "title": "Deployment Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Deployment."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Deployment Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Deployment."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Deployment?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Deployment."
          }
        ]
      },
      {
        "id": "mod-10",
        "name": "Module 10: Projects",
        "description": "Topics: Face Recognition, Chatbot, AI Image Generator",
        "videos": [
          {
            "id": "vid-1",
            "title": "Projects Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Projects."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Projects Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Projects."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Projects?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Projects."
          }
        ]
      }
    ]
  },
  {
    "id": "iot-internet-of-things",
    "name": "IoT (Internet of Things)",
    "icon": "\ud83c\udf10",
    "description": "Complete 10-module roadmap for IoT (Internet of Things).",
    "color": "from-cyan-600 to-blue-700",
    "glowColor": "rgba(8, 145, 178, 0.4)",
    "modules": [
      {
        "id": "mod-1",
        "name": "Module 1: Unit 1 (4th Year B.Tech)",
        "description": "Topics: Unit 1 4th Year B.Tech IoT Architecture, Voltage, Current, Sensors, Circuits",
        "videos": [
          {
            "id": "vid-1",
            "title": "Electronics Basics Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Electronics Basics."
          }
        ],
        "notes": [
          {
            "id": "note-iot-unit1",
            "title": "Unit 1: 4th Year B.Tech IoT Resource Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Comprehensive resource notes document covering Unit 1 topics for 4th Year B.Tech IoT.",
            "docUrl": "https://docs.google.com/document/d/1ZaMRQws02NVIJ07k-u9rcZyoagAbvO7J/edit?usp=sharing&ouid=116710741773817925660&rtpof=true&sd=true",
            "embedUrl": "https://drive.google.com/file/d/1ZaMRQws02NVIJ07k-u9rcZyoagAbvO7J/preview"
          }
        ],
        "ppts": [
          {
            "id": "ppt-iot-unit1",
            "title": "Unit 1: 4th Year B.Tech IoT Presentation Slides",
            "pptUrl": "https://docs.google.com/presentation/d/1o2oU9JwiQlJHIuvCLhqPq7-u-27D5rUK/edit?usp=sharing&ouid=116710741773817925660&rtpof=true&sd=true",
            "embedUrl": "https://drive.google.com/file/d/1o2oU9JwiQlJHIuvCLhqPq7-u-27D5rUK/preview",
            "description": "Comprehensive Unit 1 presentation slides for 4th Year B.Tech IoT (Internet of Things) course.",
            "slideCount": "Course Slides"
          }
        ],
        "quiz": [
          {
            "question": "What is the primary role of the MQTT protocol in IoT architecture?",
            "options": [
              "Lightweight Publish/Subscribe messaging protocol designed for constrained networks and low-bandwidth devices",
              "Heavyweight Synchronous Remote Procedure Call (RPC) for high-performance computing",
              "Direct P2P Video Streaming and Multi-media distribution protocol",
              "Relational database query protocol for edge servers"
            ],
            "correctAnswer": 0,
            "explanation": "MQTT is a lightweight publish-subscribe messaging protocol ideal for IoT sensors operating in low bandwidth or constrained environments."
          },
          {
            "question": "Which layer of the standard IoT architecture is directly responsible for capturing data from physical sensors and actuators?",
            "options": [
              "Application Layer",
              "Perception / Physical Sensing Layer",
              "Network / Transport Layer",
              "Business & Analytics Layer"
            ],
            "correctAnswer": 1,
            "explanation": "The Perception (or Sensing) Layer consists of sensors, RFID tags, and actuators that physically detect and gather environmental data."
          },
          {
            "question": "In 4th Year B.Tech IoT systems, what is the primary function of an IoT Gateway?",
            "options": [
              "To supply electrical voltage directly to external microcontrollers",
              "To translate communication protocols, aggregate sensor data, and bridge edge devices to the Cloud",
              "To execute complex deep learning model training on raw sensor nodes",
              "To replace physical microprocessors with virtual cloud machines"
            ],
            "correctAnswer": 1,
            "explanation": "An IoT Gateway acts as a bridge between local sensor networks and the internet/cloud, handling protocol conversion, filtering, and data transmission."
          },
          {
            "question": "Which wireless communication technology is specifically optimized for low-power, long-range (LoRaWAN) outdoor IoT deployments?",
            "options": [
              "High-speed Wi-Fi 6 (802.11ax)",
              "LoRa (Long Range RF)",
              "USB 3.1 SuperSpeed",
              "Ethernet CAT6"
            ],
            "correctAnswer": 1,
            "explanation": "LoRa (Long Range) enables long-range transmissions (up to 15+ km) with low power consumption, making it ideal for smart agriculture and remote sensors."
          },
          {
            "question": "What does GPIO stand for on IoT hardware platforms like Raspberry Pi and ESP32?",
            "options": [
              "General Purpose Input/Output",
              "Graphical Processing and Input Operations",
              "Global Positioning and Internet Output",
              "General Protocol for IoT Operations"
            ],
            "correctAnswer": 0,
            "explanation": "GPIO stands for General Purpose Input/Output pins, which allow microcontrollers to interface with digital sensors, switches, LEDs, and relays."
          },
          {
            "question": "Why is Edge/Fog Computing heavily integrated into modern IoT deployments?",
            "options": [
              "To eliminate the need for physical sensors entirely",
              "To process critical sensor data near the source, reducing network latency and bandwidth consumption",
              "To replace cloud data storage with paper logs",
              "To prevent microcontrollers from using electrical power"
            ],
            "correctAnswer": 1,
            "explanation": "Edge and Fog computing perform real-time data processing and analytics locally near IoT devices, reducing latency, cloud bandwidth costs, and network dependence."
          }
        ]
      },
      {
        "id": "mod-2",
        "name": "Module 2: Arduino Programming",
        "description": "Topics: IDE Setup, LEDs, Sensors, Motors",
        "videos": [
          {
            "id": "vid-1",
            "title": "Arduino Programming Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Arduino Programming."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Arduino Programming Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Arduino Programming."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Arduino Programming?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Arduino Programming."
          }
        ]
      },
      {
        "id": "mod-3",
        "name": "Module 3: Raspberry Pi",
        "description": "Topics: Linux Basics, GPIO, Python Programming",
        "videos": [
          {
            "id": "vid-1",
            "title": "Raspberry Pi Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Raspberry Pi."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Raspberry Pi Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Raspberry Pi."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Raspberry Pi?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Raspberry Pi."
          }
        ]
      },
      {
        "id": "mod-4",
        "name": "Module 4: Communication Protocols",
        "description": "Topics: WiFi, Bluetooth, MQTT, Zigbee",
        "videos": [
          {
            "id": "vid-1",
            "title": "Communication Protocols Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Communication Protocols."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Communication Protocols Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Communication Protocols."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Communication Protocols?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Communication Protocols."
          }
        ]
      },
      {
        "id": "mod-5",
        "name": "Module 5: Sensors & Devices",
        "description": "Topics: Temperature, Motion, GPS, Camera Modules",
        "videos": [
          {
            "id": "vid-1",
            "title": "Sensors & Devices Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Sensors & Devices."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Sensors & Devices Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Sensors & Devices."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Sensors & Devices?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Sensors & Devices."
          }
        ]
      },
      {
        "id": "mod-6",
        "name": "Module 6: Cloud IoT",
        "description": "Topics: Firebase, AWS IoT, Azure IoT",
        "videos": [
          {
            "id": "vid-1",
            "title": "Cloud IoT Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Cloud IoT."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Cloud IoT Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Cloud IoT."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Cloud IoT?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Cloud IoT."
          }
        ]
      },
      {
        "id": "mod-7",
        "name": "Module 7: IoT Security",
        "description": "Topics: Encryption, Authentication, Device Security",
        "videos": [
          {
            "id": "vid-1",
            "title": "IoT Security Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on IoT Security."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "IoT Security Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for IoT Security."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of IoT Security?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for IoT Security."
          }
        ]
      },
      {
        "id": "mod-8",
        "name": "Module 8: Edge AI + IoT",
        "description": "Topics: TinyML, AI on Microcontrollers, Edge Computing",
        "videos": [
          {
            "id": "vid-1",
            "title": "Edge AI + IoT Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Edge AI + IoT."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Edge AI + IoT Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Edge AI + IoT."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Edge AI + IoT?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Edge AI + IoT."
          }
        ]
      },
      {
        "id": "mod-9",
        "name": "Module 9: Smart Systems",
        "description": "Topics: Smart Home, Smart Agriculture, Smart Cities",
        "videos": [
          {
            "id": "vid-1",
            "title": "Smart Systems Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Smart Systems."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Smart Systems Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Smart Systems."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Smart Systems?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Smart Systems."
          }
        ]
      },
      {
        "id": "mod-10",
        "name": "Module 10: Projects",
        "description": "Topics: Smart Door Lock, IoT Weather Station, Smart Attendance System",
        "videos": [
          {
            "id": "vid-1",
            "title": "Projects Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Projects."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Projects Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Projects."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Projects?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Projects."
          }
        ]
      }
    ]
  },
  {
    "id": "agentic-ai",
    "name": "Agentic AI",
    "icon": "\ud83e\udde9",
    "description": "Complete 10-module roadmap for Agentic AI.",
    "color": "from-amber-500 to-orange-600",
    "glowColor": "rgba(245, 158, 11, 0.4)",
    "modules": [
      {
        "id": "mod-1",
        "name": "Module 1: AI Foundations",
        "description": "Topics: LLM Basics, Prompt Engineering, Transformers",
        "videos": [
          {
            "id": "vid-1",
            "title": "AI Foundations Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on AI Foundations."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "AI Foundations Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for AI Foundations."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of AI Foundations?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for AI Foundations."
          }
        ]
      },
      {
        "id": "mod-2",
        "name": "Module 2: Python for AI Agents",
        "description": "Topics: APIs, Async Programming, JSON Handling",
        "videos": [
          {
            "id": "vid-1",
            "title": "Python for AI Agents Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Python for AI Agents."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Python for AI Agents Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Python for AI Agents."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Python for AI Agents?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Python for AI Agents."
          }
        ]
      },
      {
        "id": "mod-3",
        "name": "Module 3: LangChain Basics",
        "description": "Topics: Chains, Memory, Tools, Agents",
        "videos": [
          {
            "id": "vid-1",
            "title": "LangChain Basics Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on LangChain Basics."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "LangChain Basics Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for LangChain Basics."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of LangChain Basics?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for LangChain Basics."
          }
        ]
      },
      {
        "id": "mod-4",
        "name": "Module 4: Retrieval-Augmented Generation",
        "description": "Topics: Vector Databases, Embeddings, RAG Pipelines",
        "videos": [
          {
            "id": "vid-1",
            "title": "Retrieval-Augmented Generation Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Retrieval-Augmented Generation."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Retrieval-Augmented Generation Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Retrieval-Augmented Generation."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Retrieval-Augmented Generation?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Retrieval-Augmented Generation."
          }
        ]
      },
      {
        "id": "mod-5",
        "name": "Module 5: Autonomous Agents",
        "description": "Topics: Planning, Reflection, Multi-step Reasoning",
        "videos": [
          {
            "id": "vid-1",
            "title": "Autonomous Agents Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Autonomous Agents."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Autonomous Agents Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Autonomous Agents."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Autonomous Agents?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Autonomous Agents."
          }
        ]
      },
      {
        "id": "mod-6",
        "name": "Module 6: Multi-Agent Systems",
        "description": "Topics: Agent Collaboration, Communication, Task Delegation",
        "videos": [
          {
            "id": "vid-1",
            "title": "Multi-Agent Systems Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Multi-Agent Systems."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Multi-Agent Systems Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Multi-Agent Systems."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Multi-Agent Systems?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Multi-Agent Systems."
          }
        ]
      },
      {
        "id": "mod-7",
        "name": "Module 7: AI Tool Use",
        "description": "Topics: Web Search, Code Execution, File Handling",
        "videos": [
          {
            "id": "vid-1",
            "title": "AI Tool Use Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on AI Tool Use."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "AI Tool Use Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for AI Tool Use."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of AI Tool Use?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for AI Tool Use."
          }
        ]
      },
      {
        "id": "mod-8",
        "name": "Module 8: AI Workflows",
        "description": "Topics: CrewAI, AutoGen, LangGraph",
        "videos": [
          {
            "id": "vid-1",
            "title": "AI Workflows Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on AI Workflows."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "AI Workflows Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for AI Workflows."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of AI Workflows?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for AI Workflows."
          }
        ]
      },
      {
        "id": "mod-9",
        "name": "Module 9: Production AI Agents",
        "description": "Topics: Deployment, Monitoring, Safety, Memory Systems",
        "videos": [
          {
            "id": "vid-1",
            "title": "Production AI Agents Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Production AI Agents."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Production AI Agents Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Production AI Agents."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Production AI Agents?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Production AI Agents."
          }
        ]
      },
      {
        "id": "mod-10",
        "name": "Module 10: Projects",
        "description": "Topics: AI Research Assistant, AI Coding Agent, AI Campus Assistant Bot",
        "videos": [
          {
            "id": "vid-1",
            "title": "Projects Overview",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "15m",
            "description": "An introductory video on Projects."
          }
        ],
        "notes": [
          {
            "id": "note-1",
            "title": "Projects Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Key concepts and takeaways for Projects."
          }
        ],
        "quiz": [
          {
            "question": "What is the core concept of Projects?",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Option A is correct for Projects."
          }
        ]
      }
    ]
  }
];

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
  const [domains, setDomains] = useState<DomainData[]>([]);
  const [activeDomainIndex, setActiveDomainIndex] = useState<number | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"videos" | "notes" | "ppts" | "quiz">("videos");

  // Carousel states for the active notes tab
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // PPT Presentation states
  const [activePptIndex, setActivePptIndex] = useState(0);
  const [pptModalOpen, setPptModalOpen] = useState(false);
  const [fullscreenPpt, setFullscreenPpt] = useState<PptItem | null>(null);

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

  const [pptTitle, setPptTitle] = useState("");
  const [pptUrl, setPptUrl] = useState("");
  const [pptSlideCount, setPptSlideCount] = useState("");
  const [pptDesc, setPptDesc] = useState("");

  // Video lecture player modal
  const [activePlayVideoUrl, setActivePlayVideoUrl] = useState<string | null>(null);
  const [activePlayVideoTitle, setActivePlayVideoTitle] = useState("");

  // Load from local storage on mount and sync default PPTs
  useEffect(() => {
    const saved = localStorage.getItem("qlearn_domains");
    if (saved) {
      try {
        const parsed: DomainData[] = JSON.parse(saved);
        const updated = parsed.map((domain) => {
          const defaultDomain = DEFAULT_DOMAINS.find((d) => d.id === domain.id);
          if (!defaultDomain) return domain;
          return {
            ...domain,
            modules: domain.modules.map((mod) => {
              const defaultMod = defaultDomain.modules.find((m) => m.id === mod.id);
              if (defaultMod && defaultMod.ppts && defaultMod.ppts.length > 0) {
                const userCustomPpts = (mod.ppts || []).filter(
                  (p) => !defaultMod.ppts!.some((defP) => defP.id === p.id)
                );
                return {
                  ...mod,
                  name: defaultMod.id === "mod-1" && domain.id === "iot-internet-of-things" ? defaultMod.name : mod.name,
                  description: defaultMod.id === "mod-1" && domain.id === "iot-internet-of-things" ? defaultMod.description : mod.description,
                  notes: defaultMod.id === "mod-1" && domain.id === "iot-internet-of-things" ? defaultMod.notes : mod.notes,
                  quiz: defaultMod.id === "mod-1" && domain.id === "iot-internet-of-things" ? defaultMod.quiz : mod.quiz,
                  ppts: [...defaultMod.ppts, ...userCustomPpts]
                };
              }
              return mod;
            })
          };
        });
        setDomains(updated);
        localStorage.setItem("qlearn_domains", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed parsing QLearn domains data, resetting to defaults", e);
        setDomains(DEFAULT_DOMAINS);
        localStorage.setItem("qlearn_domains", JSON.stringify(DEFAULT_DOMAINS));
      }
    } else {
      setDomains(DEFAULT_DOMAINS);
      localStorage.setItem("qlearn_domains", JSON.stringify(DEFAULT_DOMAINS));
    }
  }, []);

  // Update localStorage when domains change
  const saveDomains = (updatedDomains: DomainData[]) => {
    setDomains(updatedDomains);
    localStorage.setItem("qlearn_domains", JSON.stringify(updatedDomains));
  };

  const activeDomain = activeDomainIndex !== null ? domains[activeDomainIndex] : null;
  const activeModule = activeDomain ? activeDomain.modules[activeModuleIndex] : null;

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
      description: noteDesc
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

  // Switch domain handler
  const handleDomainSelect = (idx: number) => {
    setActiveDomainIndex(idx);
    setActiveModuleIndex(0);
    setActiveNoteIndex(0);
    setActivePptIndex(0);
    setActiveTab("videos");
    setQuizStarted(false);
    setQuizFinished(false);
  };
  
  // Back to domains
  const handleBackToDomains = () => {
    setActiveDomainIndex(null);
    setActiveModuleIndex(0);
    setActiveNoteIndex(0);
    setActivePptIndex(0);
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      {/* HERO SECTION */}
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
            <Link 
              to="/education" 
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/15 border border-accent/30 rounded-full text-accent text-sm font-medium hover:bg-accent/20 transition-all duration-300 mb-6"
            >
              <ArrowLeft size={14} /> Back to Contributions
            </Link>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight leading-tight">
              QLearn
              <span className="text-accent block text-2xl md:text-3xl font-sans mt-2 font-medium tracking-normal">
                Advanced Technology Learning Center
              </span>
            </h1>
            
            <div className="w-24 h-1 bg-accent rounded-full my-6" />

            <p className="text-lg text-muted-foreground max-w-2xl">
              An interactive visual laboratory. Explore domains like Quantum Computing, Data Science, AI, and more.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN TOPIC & TABS SECTION */}
      <section className="flex-1 py-12 bg-background relative z-10">
        <div className="container-wide px-6 lg:px-12">
          
          {activeDomainIndex === null ? (
            // DOMAINS GRID VIEW
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="font-serif text-3xl font-bold text-primary">Select a Domain to Explore</h2>
                <p className="text-muted-foreground mt-2">Each domain includes a comprehensive 10-module roadmap.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <div className="pt-4 border-t border-border flex items-center justify-between">
                        <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                          10 Modules
                        </span>
                        <ChevronRight className="text-accent group-hover:translate-x-1 transition-transform" size={18} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                <h3 className="font-serif text-lg font-semibold text-primary px-1 mb-2">
                  {activeDomain?.name} Modules
                </h3>
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  {activeDomain?.modules.map((module, index) => {
                    const isActive = index === activeModuleIndex;
                    return (
                      <button
                        key={module.id}
                        onClick={() => handleModuleSwitch(index)}
                        className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                          isActive
                            ? "bg-card border-accent shadow-md shadow-accent/5 ring-1 ring-accent/30 scale-100"
                            : "bg-card/40 border-border hover:border-accent/40 hover:bg-card"
                        }`}
                      >
                        <h4 className={`font-serif font-semibold leading-tight ${isActive ? "text-accent" : "text-primary"}`}>
                          {module.name}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                          {module.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: ACTIVE MODULE CONTENT */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Active Module Banner */}
                {activeModule && (
                  <div className={`p-8 rounded-xl bg-gradient-to-r ${activeDomain?.color} text-white shadow-xl relative overflow-hidden`}>
                    <div 
                      className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-2xl opacity-60"
                      style={{ backgroundColor: activeDomain?.glowColor }}
                    />
                    
                    <div className="relative z-10 space-y-3 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl bg-white/10 p-2 rounded-lg backdrop-blur-md">
                          {activeDomain?.icon}
                        </span>
                        <div>
                          <span className="text-xs tracking-widest uppercase font-semibold text-white/70">
                            {activeDomain?.name}
                          </span>
                          <h2 className="text-2xl md:text-3xl font-serif font-bold">
                            {activeModule.name}
                          </h2>
                        </div>
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed pt-2">
                        {activeModule.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* TABS */}
                {activeModule && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/80 gap-4 pb-3">
                      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 p-2 bg-muted/60 backdrop-blur-md rounded-2xl border border-border/80 shadow-inner">
                        {[
                          { id: "videos", label: "Video Seminars", icon: Video },
                          { id: "notes", label: "Lecture Notes", icon: BookOpen },
                          { id: "ppts", label: "PPT & Drive Slides", icon: Presentation },
                          { id: "quiz", label: "Take Quiz", icon: Award }
                        ].map((tab) => {
                          const TabIcon = tab.icon;
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id as any)}
                              className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 w-full ${
                                isActive
                                  ? "bg-card text-accent shadow-md shadow-accent/10 ring-1 ring-accent/30 font-bold transform scale-[1.01]"
                                  : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                              }`}
                            >
                              <TabIcon size={18} className={isActive ? "text-accent" : "text-muted-foreground"} />
                              <span className="whitespace-nowrap">{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Admin upload controls (ONLY rendered when accessed inside protected Admin Portal) */}
                      {isAdminPortal && (
                        <div className="flex gap-2">
                          {activeTab === "videos" && (
                            <Button 
                              variant="hero" 
                              size="sm"
                              onClick={() => setVideoModalOpen(true)}
                              className="flex items-center gap-2 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                            >
                              <Plus size={14} /> Upload Video
                            </Button>
                          )}
                          {activeTab === "notes" && (
                            <Button 
                              variant="hero" 
                              size="sm"
                              onClick={() => setNoteModalOpen(true)}
                              className="flex items-center gap-2 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                            >
                              <Plus size={14} /> Add Notes Slide
                            </Button>
                          )}
                          {activeTab === "ppts" && (
                            <Button 
                              variant="hero" 
                              size="sm"
                              onClick={() => setPptModalOpen(true)}
                              className="flex items-center gap-2 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                            >
                              <Plus size={14} /> Upload PPT / Drive Link
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CONTENT PANEL */}
                    <div className="min-h-[400px]">
                      
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
                                     <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/15 border border-accent/30 rounded text-accent text-xs font-semibold">
                                       Note Sheet {activeNoteIndex + 1} of {activeModule.notes.length}
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
                                         {activeModule.notes[activeNoteIndex].embedUrl && (
                                           <Button
                                             variant="hero-outline"
                                             size="sm"
                                             onClick={() => setFullscreenPpt({
                                               id: activeModule.notes[activeNoteIndex].id,
                                               title: activeModule.notes[activeNoteIndex].title,
                                               pptUrl: activeModule.notes[activeNoteIndex].docUrl || "",
                                               embedUrl: activeModule.notes[activeNoteIndex].embedUrl || "",
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
                               {activeModule.notes[activeNoteIndex].embedUrl && (
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
                                       src={activeModule.notes[activeNoteIndex].embedUrl}
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
                                  Module Completed
                                </h3>
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
                                    Assessment Mode
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
      <Footer />
    </div>
  );
}
