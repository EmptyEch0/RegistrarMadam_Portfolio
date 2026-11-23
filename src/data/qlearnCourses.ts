// QLearn 10 Core Curated Courses
// Order:
// Row 1: AI, ML, DS, DL, AGENTIC AI
// Row 2: IOT, AIOT, AI SECURITY, QUANTUM COMP, QUANTUM AI

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  duration: string;
  description: string;
}

export interface NoteSnippet {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  docUrl?: string;
  embedUrl?: string;
  pdfUrl?: string;
  pdfFileName?: string;
}

export interface PptItem {
  id: string;
  title: string;
  pptUrl: string;
  embedUrl: string;
  description: string;
  slideCount?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ModuleData {
  id: string;
  name: string;
  description: string;
  syllabus?: string;
  learningOutcomes?: string;
  referenceMaterials?: string;
  duration?: string;
  videos: VideoItem[];
  notes: NoteSnippet[];
  ppts?: PptItem[];
  quiz: QuizQuestion[];
}

export interface DomainData {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  glowColor: string;
  modules: ModuleData[];
}

export const DEFAULT_DOMAINS: DomainData[] = [
  {
    "id": "ai",
    "name": "Artificial Intelligence",
    "icon": "🤖",
    "description": "Foundations of Artificial Intelligence: intelligent agents, heuristic search, logic, automated planning, and probabilistic reasoning.",
    "color": "from-blue-600 to-indigo-700",
    "glowColor": "rgba(37, 99, 235, 0.4)",
    "modules": [
      {
        "id": "unit-1",
        "name": "Unit I: Introduction to AI & Search Formulation",
        "description": "Topics: Intelligent Agents, Rationality, PEAS Task Environments, State-Space Graphs, BFS, DFS, Uniform Cost Search, Iterative Deepening",
        "syllabus": "1. What is Artificial Intelligence? Turing Test, Rational Agents, and Foundations of AI\n2. Structure of Intelligent Agents: Task Environments (PEAS Framework) & Environment Classification\n3. Problem Formulation & State-Space Graph Representation\n4. Uninformed Search Strategies: Breadth-First Search (BFS) and Depth-First Search (DFS)\n5. Uniform Cost Search & Iterative Deepening Search (IDS)",
        "learningOutcomes": "Differentiate between cognitive, behavioral, and rational agent definitions of AI\nFormulate complex challenges as state-space search problems\nAnalyze time, space, and completeness trade-offs among search algorithms",
        "duration": "8 Hours",
        "referenceMaterials": "Artificial Intelligence: A Modern Approach (Russell & Norvig, 4th Edition) - Chapters 1 to 3",
        "videos": [
          {
            "id": "vid-ai-1",
            "title": "Unit 1: Intelligent Agents & State-Space Search",
            "url": "https://www.youtube.com/embed/J8Eh7RqggsU",
            "duration": "18m",
            "description": "Introduction to rational agents, PEAS environments, and graph search exploration."
          }
        ],
        "notes": [
          {
            "id": "note-ai-1",
            "title": "Unit 1: Foundations of AI & Uninformed Search Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Comprehensive study notes on agent architectures, PEAS classification, and search algorithm complexity."
          }
        ],
        "ppts": [
          {
            "id": "ppt-ai-1",
            "title": "Unit 1: AI Foundations & Search Lecture Slides",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Lecture slides covering rational agents and search graph traversals.",
            "slideCount": "34 Slides"
          }
        ],
        "quiz": [
          {
            "question": "In the PEAS framework for describing an agent task environment, what does PEAS stand for?",
            "options": [
              "Performance, Environment, Actuators, Sensors",
              "Perception, Entity, Action, State",
              "Planning, Execution, Adaptation, Search",
              "Protocol, Edge, Agent, System"
            ],
            "correctAnswer": 0,
            "explanation": "PEAS stands for Performance measure, Environment, Actuators, and Sensors."
          },
          {
            "question": "Which uninformed search algorithm is guaranteed to find the shallowest goal first?",
            "options": [
              "Depth-First Search",
              "Breadth-First Search",
              "Depth-Limited Search",
              "Bidirectional DFS"
            ],
            "correctAnswer": 1,
            "explanation": "Breadth-First Search systematically explores nodes level-by-level."
          }
        ]
      },
      {
        "id": "unit-2",
        "name": "Unit II: Informed Search & Adversarial Games",
        "description": "Topics: Heuristics, Greedy Best-First Search, A* Algorithm, Admissibility, Consistency, Minimax, Alpha-Beta Pruning",
        "syllabus": "1. Informed (Heuristic) Search Strategies & Evaluation Functions\n2. Greedy Best-First Search & Limitations\n3. The A* Search Algorithm: Admissibility and Consistency of Heuristics\n4. Dominance & Constructing Relaxed Problem Heuristics\n5. Games & Adversarial Search: Optimal Decisions in Multi-Player Games\n6. The Minimax Algorithm & Alpha-Beta Pruning Optimization",
        "learningOutcomes": "Design admissible and consistent heuristics for spatial and combinatorial problems\nImplement A* search and evaluate optimal path generation\nAnalyze adversarial search trees using Minimax and Alpha-Beta pruning",
        "duration": "8 Hours",
        "referenceMaterials": "Artificial Intelligence: A Modern Approach (Russell & Norvig) - Chapters 4 & 5",
        "videos": [
          {
            "id": "vid-ai-2",
            "title": "Unit 2: A* Search & Minimax Game Playing",
            "url": "https://www.youtube.com/embed/gGQ-vA944Lg",
            "duration": "22m",
            "description": "Detailed walkthrough of heuristic A* search and game tree pruning."
          }
        ],
        "notes": [
          {
            "id": "note-ai-2",
            "title": "Unit 2: Informed Search & Minimax Notes",
            "imageUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
            "description": "Formulas and proofs for A* heuristic admissibility and Alpha-Beta pruning cutoff conditions."
          }
        ],
        "ppts": [
          {
            "id": "ppt-ai-2",
            "title": "Unit 2: A* Algorithm & Game Theory Slides",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Slide deck on informed search, heuristic design, and adversarial games.",
            "slideCount": "38 Slides"
          }
        ],
        "quiz": [
          {
            "question": "A heuristic function h(n) in A* search is admissible if it:",
            "options": [
              "Always overestimates the true cost to the goal",
              "Never overestimates the true cost to the goal",
              "Is equal to zero everywhere",
              "Equals the path cost from start to n"
            ],
            "correctAnswer": 1,
            "explanation": "An admissible heuristic never overestimates the actual cost to reach the goal, guaranteeing optimality in tree search."
          },
          {
            "question": "Alpha-Beta pruning improves the Minimax algorithm by:",
            "options": [
              "Evaluating more leaf nodes",
              "Pruning branches that cannot influence the final minimax decision",
              "Approximating random moves",
              "Changing the utility function"
            ],
            "correctAnswer": 1,
            "explanation": "Alpha-Beta pruning skips branches that mathematically cannot affect the final minimax decision."
          }
        ]
      },
      {
        "id": "unit-3",
        "name": "Unit III: Knowledge Representation & Logic",
        "description": "Topics: Propositional Logic, Syntax & Semantics, Normal Forms (CNF), Resolution, Forward/Backward Chaining, First-Order Logic (FOL)",
        "syllabus": "1. Knowledge-Based Agents & The Wumpus World Environment\n2. Propositional Logic: Syntax, Semantics, Entailment, and Truth Tables\n3. Equivalence, Validity, Satisfiability, and Conjunctive Normal Form (CNF)\n4. Resolution Inference & Theorem Proving for Propositional Logic\n5. Forward Chaining and Backward Chaining Algorithms\n6. First-Order Logic (FOL): Predicates, Functions, Quantifiers (Universal & Existential), and Unification",
        "learningOutcomes": "Formalize domain knowledge into propositional and first-order logic sentences\nApply resolution refutation to prove theorem validity\nImplement forward and backward chaining for expert knowledge systems",
        "duration": "8 Hours",
        "referenceMaterials": "Artificial Intelligence: A Modern Approach (Russell & Norvig) - Chapters 7 to 9",
        "videos": [
          {
            "id": "vid-ai-3",
            "title": "Unit 3: Knowledge Representation & First-Order Logic",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "20m",
            "description": "Comprehensive lecture on propositional calculus, CNF transformation, resolution, and First-Order Logic."
          }
        ],
        "notes": [
          {
            "id": "note-ai-3",
            "title": "Unit 3: Logic & Inference Notes",
            "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
            "description": "Mathematical rules of inference, resolution refutation steps, and quantifier conversions."
          }
        ],
        "ppts": [
          {
            "id": "ppt-ai-3",
            "title": "Unit 3: Knowledge & Logic Lecture Slides",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Slide deck on knowledge representation, CNF, and logic resolution.",
            "slideCount": "40 Slides"
          }
        ],
        "quiz": [
          {
            "question": "What is the resolution inference rule in propositional logic?",
            "options": [
              "(A or B) and (~B or C) entails (A or C)",
              "(A and B) entails (A or B)",
              "(A implies B) entails (B implies A)",
              "(A or B) entails (A and B)"
            ],
            "correctAnswer": 0,
            "explanation": "Resolution combines two clauses containing complementary literals to produce a new resolvent clause."
          },
          {
            "question": "In First-Order Logic, what does the quantifier ∃ (existential quantifier) assert?",
            "options": [
              "The sentence is true for all objects in the domain",
              "The sentence is true for at least one object in the domain",
              "The sentence is never true",
              "The sentence is true only for numbers"
            ],
            "correctAnswer": 1,
            "explanation": "Existential quantification asserts that there exists at least one object in the domain for which the statement holds."
          }
        ]
      },
      {
        "id": "unit-4",
        "name": "Unit IV: Constraint Satisfaction & Planning",
        "description": "Topics: Constraint Satisfaction Problems (CSP), AC-3 Algorithm, Backtracking Search, MRV & LCV Heuristics, Classical Planning, STRIPS & PDDL",
        "syllabus": "1. Constraint Satisfaction Problems (CSP): Variables, Domains, and Constraints\n2. Constraint Propagation: Arc Consistency and the AC-3 Algorithm\n3. Backtracking Search for CSPs: Minimum Remaining Values (MRV) & Least Constraining Value (LCV)\n4. Forward Checking & Tree-Structured CSPs\n5. Classical Planning: The STRIPS & PDDL Representation Languages\n6. State-Space Planning: Forward (Progression) and Backward (Regression) State Search",
        "learningOutcomes": "Formulate scheduling, coloring, and puzzle constraints into CSP frameworks\nExecute AC-3 arc consistency algorithms and optimize backtracking search\nConstruct automated planning definitions using PDDL actions and preconditions",
        "duration": "8 Hours",
        "referenceMaterials": "Artificial Intelligence: A Modern Approach (Russell & Norvig) - Chapters 6 & 11",
        "videos": [
          {
            "id": "vid-ai-4",
            "title": "Unit 4: CSPs, AC-3 & Automated Planning",
            "url": "https://www.youtube.com/embed/lCrnE_uCgW8",
            "duration": "21m",
            "description": "Detailed analysis of constraint satisfaction problems, arc consistency, and PDDL planning."
          }
        ],
        "notes": [
          {
            "id": "note-ai-4",
            "title": "Unit 4: CSP & Classical Planning Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "AC-3 algorithm pseudocode, CSP variable selection heuristics, and STRIPS action schema."
          }
        ],
        "ppts": [
          {
            "id": "ppt-ai-4",
            "title": "Unit 4: CSP & Planning Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Slides on constraint propagation, backtracking optimization, and planning algorithms.",
            "slideCount": "36 Slides"
          }
        ],
        "quiz": [
          {
            "question": "The AC-3 algorithm enforces which type of consistency on a CSP network?",
            "options": [
              "Node Consistency",
              "Arc Consistency",
              "Path Consistency",
              "K-Consistency only"
            ],
            "correctAnswer": 1,
            "explanation": "AC-3 establishes arc consistency by removing values from variable domains that have no valid counterpart in neighboring variables."
          },
          {
            "question": "In classical planning (STRIPS/PDDL), an action is applicable in a state if:",
            "options": [
              "All effects of the action are already true",
              "All positive preconditions are satisfied in the state",
              "The goal has already been achieved",
              "The action has no negative effects"
            ],
            "correctAnswer": 1,
            "explanation": "An action can only be executed in a state if its preconditions hold in that state."
          }
        ]
      },
      {
        "id": "unit-5",
        "name": "Unit V: Probabilistic Reasoning & Bayesian Networks",
        "description": "Topics: Uncertainty, Axioms of Probability, Bayes Rule, Bayesian Belief Networks (BBN), D-Separation, Inference by Enumeration, AI Ethics",
        "syllabus": "1. Acting Under Uncertainty: Prior and Conditional Probability\n2. Axioms of Probability & Inference Using Full Joint Distributions\n3. Independence, Conditional Independence, and Bayes Rule\n4. Bayesian Belief Networks (BBN): Representation and Semantics\n5. D-Separation & Conditional Independence in DAGs\n6. Exact Inference in Bayesian Networks: Enumeration & Variable Elimination\n7. Modern AI Frontiers: Decision Theory, Markov Decision Processes (MDP), AI Ethics, and Safe Autonomous Systems",
        "learningOutcomes": "Compute posterior probabilities using Bayes theorem and joint distributions\nConstruct and interpret Bayesian Belief Networks for diagnostic reasoning\nAnalyze ethical challenges, fairness, and safety guidelines in modern AI deployment",
        "duration": "8 Hours",
        "referenceMaterials": "Artificial Intelligence: A Modern Approach (Russell & Norvig) - Chapters 12, 13 & 28",
        "videos": [
          {
            "id": "vid-ai-5",
            "title": "Unit 5: Bayesian Networks & Probabilistic Reasoning",
            "url": "https://www.youtube.com/embed/SaHP_wF_VBE",
            "duration": "23m",
            "description": "Masterclass on Bayesian Belief Networks, conditional independence, and probabilistic inference."
          }
        ],
        "notes": [
          {
            "id": "note-ai-5",
            "title": "Unit 5: Probability & Bayesian Networks Notes",
            "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
            "description": "Probability calculations, DAG factorization formulas, and Markov Decision Process basics."
          }
        ],
        "ppts": [
          {
            "id": "ppt-ai-5",
            "title": "Unit 5: Bayesian AI & Ethics Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Lecture slides on Bayesian reasoning, d-separation, and autonomous safety.",
            "slideCount": "38 Slides"
          }
        ],
        "quiz": [
          {
            "question": "In a Bayesian Network with variables X, Y, and Z, the joint probability P(X1, ..., Xn) factorizes as:",
            "options": [
              "The sum of all marginal probabilities",
              "The product of P(Xi | Parents(Xi)) for all i",
              "The maximum of all conditional probabilities",
              "P(X) * P(Y) * P(Z)"
            ],
            "correctAnswer": 1,
            "explanation": "By the chain rule and conditional independence, a Bayesian Network joint probability is the product of each node given its parents."
          },
          {
            "question": "Bayes Theorem computes posterior probability P(Hypothesis | Evidence) using:",
            "options": [
              "P(Evidence | Hypothesis) * P(Hypothesis) / P(Evidence)",
              "P(Evidence) + P(Hypothesis)",
              "P(Evidence) / P(Hypothesis)",
              "P(Hypothesis) * P(Evidence)"
            ],
            "correctAnswer": 0,
            "explanation": "P(H|E) = (P(E|H) * P(H)) / P(E), the cornerstone of probabilistic reasoning."
          }
        ]
      }
    ]
  },
  {
    "id": "machine-learning",
    "icon": "🤖",
    "name": "Machine Learning",
    "color": "from-purple-600 to-fuchsia-700",
    "modules": [
      {
        "id": "mod-1",
        "name": "Module 1: Python + Math",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of Python + Math?",
            "explanation": "Option A is correct for Python + Math.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "Python + Math Overview",
            "duration": "15m",
            "description": "An introductory video on Python + Math."
          }
        ],
        "description": "Topics: NumPy, Statistics, Probability, Linear Algebra"
      },
      {
        "id": "mod-2",
        "name": "Module 2: Data Preprocessing",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of Data Preprocessing?",
            "explanation": "Option A is correct for Data Preprocessing.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "Data Preprocessing Overview",
            "duration": "15m",
            "description": "An introductory video on Data Preprocessing."
          }
        ],
        "description": "Topics: Cleaning, Encoding, Scaling, Feature Engineering"
      },
      {
        "id": "mod-3",
        "name": "Module 3: Supervised Learning",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of Supervised Learning?",
            "explanation": "Option A is correct for Supervised Learning.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "Supervised Learning Overview",
            "duration": "15m",
            "description": "An introductory video on Supervised Learning."
          }
        ],
        "description": "Topics: Linear Regression, Logistic Regression, Decision Trees"
      },
      {
        "id": "mod-4",
        "name": "Module 4: Unsupervised Learning",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of Unsupervised Learning?",
            "explanation": "Option A is correct for Unsupervised Learning.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "Unsupervised Learning Overview",
            "duration": "15m",
            "description": "An introductory video on Unsupervised Learning."
          }
        ],
        "description": "Topics: K-Means, PCA, Clustering"
      },
      {
        "id": "mod-5",
        "name": "Module 5: Model Evaluation",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of Model Evaluation?",
            "explanation": "Option A is correct for Model Evaluation.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "Model Evaluation Overview",
            "duration": "15m",
            "description": "An introductory video on Model Evaluation."
          }
        ],
        "description": "Topics: Accuracy, Precision, Recall, Cross Validation"
      },
      {
        "id": "mod-6",
        "name": "Module 6: Ensemble Learning",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of Ensemble Learning?",
            "explanation": "Option A is correct for Ensemble Learning.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "Ensemble Learning Overview",
            "duration": "15m",
            "description": "An introductory video on Ensemble Learning."
          }
        ],
        "description": "Topics: Random Forest, XGBoost, Bagging, Boosting"
      },
      {
        "id": "mod-7",
        "name": "Module 7: Advanced ML",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of Advanced ML?",
            "explanation": "Option A is correct for Advanced ML.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "Advanced ML Overview",
            "duration": "15m",
            "description": "An introductory video on Advanced ML."
          }
        ],
        "description": "Topics: SVM, Naive Bayes, Recommendation Systems"
      },
      {
        "id": "mod-8",
        "name": "Module 8: ML with Scikit-learn",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of ML with Scikit-learn?",
            "explanation": "Option A is correct for ML with Scikit-learn.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "ML with Scikit-learn Overview",
            "duration": "15m",
            "description": "An introductory video on ML with Scikit-learn."
          }
        ],
        "description": "Topics: Pipelines, Hyperparameter Tuning, GridSearchCV"
      },
      {
        "id": "mod-9",
        "name": "Module 9: ML Deployment",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of ML Deployment?",
            "explanation": "Option A is correct for ML Deployment.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "ML Deployment Overview",
            "duration": "15m",
            "description": "An introductory video on ML Deployment."
          }
        ],
        "description": "Topics: Flask/FastAPI, Docker Basics, APIs"
      },
      {
        "id": "mod-10",
        "name": "Module 10: Projects",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of Projects?",
            "explanation": "Option A is correct for Projects.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "Projects Overview",
            "duration": "15m",
            "description": "An introductory video on Projects."
          }
        ],
        "description": "Topics: Spam Detection, House Price Prediction, Recommendation Engine"
      }
    ],
    "glowColor": "rgba(168, 85, 247, 0.4)",
    "description": "Complete 10-module roadmap for Machine Learning."
  },
  {
    "id": "data-science",
    "icon": "📊",
    "name": "Data Science",
    "color": "from-emerald-500 to-teal-700",
    "modules": [
      {
        "id": "unit-1",
        "name": "Unit I: Python Basics and Programming Concepts",
        "ppts": [
          {
            "id": "data-science-u1-slides",
            "title": "Unit I: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Slides-Unit-1.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Slides-Unit-1.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for Python Basics and Programming Concepts."
          }
        ],
        "quiz": [
          {
            "options": [
              "list",
              "dict",
              "tuple",
              "set"
            ],
            "question": "Which of these Python types is immutable?",
            "explanation": "Tuples cannot be changed after creation; lists, dicts and sets are mutable.",
            "correctAnswer": 2
          },
          {
            "options": [
              "[1, 4, 9]",
              "[0, 1, 4]",
              "[0, 1, 2]",
              "[3, 6, 9]"
            ],
            "question": "What does [x * x for x in range(3)] evaluate to?",
            "explanation": "range(3) yields 0, 1, 2, and the comprehension squares each value.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "data-science-u1-notes",
            "title": "Unit I: Study Notes",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Study-Notes-Unit-1.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Study-Notes-Unit-1.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for Python Basics and Programming Concepts."
          },
          {
            "id": "data-science-u1-worksheet",
            "title": "Unit I: Worksheet",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Worksheet-Unit-1.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Worksheet-Unit-1.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for Python Basics and Programming Concepts."
          },
          {
            "id": "data-science-u1-comics",
            "title": "Unit I: Concept Comics",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Comics-Unit-1.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Comics-Unit-1.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Illustrated comic walkthrough of Python Basics and Programming Concepts."
          },
          {
            "id": "data-science-syllabus",
            "title": "Course Syllabus",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Syllabus.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Syllabus.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Official Data Science with Python course syllabus."
          }
        ],
        "videos": [],
        "duration": "10 Hours",
        "syllabus": "1. Types and Operations: Numbers, Strings, Lists, Tuples, Dictionaries, Files\n2. Dynamic Typing\n3. Statements and Syntax: Assignments, Expressions, Loops, Comprehensions\n4. Functions: Scopes, Arguments, Advanced Functions\n5. Modules and Packages\n6. Classes and OOP: Operator Overloading, Class Design\n7. Exceptions and Parallel System Tools",
        "description": "Topics: Types and Operations: Numbers, Strings, Lists, Tuples, Dictionaries, Files, Dynamic Typing, Statements and Syntax: Assignments, Expressions, Loops, Comprehensions, Functions: Scopes, Arguments, Advanced Functions, Modules and Packages, Classes and OOP: Operator Overloading, Class Design, Exceptions and Parallel System Tools",
        "learningOutcomes": "Explain how data is collected, managed and stored for data science (CO1)\nWrite Python programs using core types, functions, modules and classes\nHandle errors robustly with exceptions",
        "referenceMaterials": "Text Books: Learning Python & Programming Python (Mark Lutz, O'Reilly); Python for Data Analysis (Wes McKinney, O'Reilly); Introduction to Machine Learning with Python (Müller & Guido, O'Reilly)"
      },
      {
        "id": "unit-2",
        "name": "Unit II: Python Tools for Data Handling — GUI, APIs, Web Data and Databases",
        "ppts": [
          {
            "id": "data-science-u2-slides",
            "title": "Unit II: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Slides-Unit-2.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Slides-Unit-2.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for Python Tools for Data Handling — GUI, APIs, Web Data and Databases."
          }
        ],
        "quiz": [
          {
            "options": [
              "Tkinter",
              "requests",
              "Matplotlib",
              "sqlite3"
            ],
            "question": "Which library is used to call REST APIs and receive JSON responses?",
            "explanation": "requests sends HTTP calls; response.json() parses the JSON body.",
            "correctAnswer": 1
          },
          {
            "options": [
              "Training ML models",
              "Parsing HTML to scrape web data",
              "Drawing GUIs",
              "Managing databases"
            ],
            "question": "BeautifulSoup is mainly used for:",
            "explanation": "BeautifulSoup parses HTML/XML so you can extract elements from web pages.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "data-science-u2-notes",
            "title": "Unit II: Study Notes",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Study-Notes-Unit-2.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Study-Notes-Unit-2.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for Python Tools for Data Handling — GUI, APIs, Web Data and Databases."
          },
          {
            "id": "data-science-u2-worksheet",
            "title": "Unit II: Worksheet",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Worksheet-Unit-2.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Worksheet-Unit-2.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for Python Tools for Data Handling — GUI, APIs, Web Data and Databases."
          },
          {
            "id": "data-science-u2-comics",
            "title": "Unit II: Concept Comics",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Comics-Unit-2.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Comics-Unit-2.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Illustrated comic walkthrough of Python Tools for Data Handling — GUI, APIs, Web Data and Databases."
          }
        ],
        "videos": [],
        "duration": "10 Hours",
        "syllabus": "1. GUI Programming with Tkinter\n2. Jupyter Notebook / IPython\n3. Network Scripting Basics\n4. REST APIs with requests (JSON, Authentication)\n5. Web Scraping with BeautifulSoup\n6. SQL Fundamentals with sqlite3 / SQLAlchemy\n7. Text and Language Data Handling",
        "description": "Topics: GUI Programming with Tkinter, Jupyter Notebook / IPython, Network Scripting Basics, REST APIs with requests (JSON, Authentication), Web Scraping with BeautifulSoup, SQL Fundamentals with sqlite3 / SQLAlchemy, Text and Language Data Handling",
        "learningOutcomes": "Understand the data scientist's toolkit and its real-world applications (CO2)\nFetch data from REST APIs and web pages\nStore and query data in SQL databases from Python",
        "referenceMaterials": "Text Books: Learning Python & Programming Python (Mark Lutz, O'Reilly); Python for Data Analysis (Wes McKinney, O'Reilly); Introduction to Machine Learning with Python (Müller & Guido, O'Reilly)"
      },
      {
        "id": "unit-3",
        "name": "Unit III: Pandas and NumPy",
        "ppts": [
          {
            "id": "data-science-u3-slides",
            "title": "Unit III: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Slides-Unit-3.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Slides-Unit-3.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for Pandas and NumPy."
          }
        ],
        "quiz": [
          {
            "options": [
              "df.dropna()",
              "df.isna()",
              "df.fillna()",
              "df.describe()"
            ],
            "question": "Which Pandas method detects missing values?",
            "explanation": "isna() (alias isnull()) returns a boolean mask of missing entries; dropna/fillna then act on them.",
            "correctAnswer": 1
          },
          {
            "options": [
              "They can hold mixed types",
              "Fast vectorised element-wise operations without Python loops",
              "They are always sorted",
              "They use less code to print"
            ],
            "question": "The main advantage of NumPy arrays over Python lists for numeric work is:",
            "explanation": "NumPy executes operations in compiled code over contiguous memory, avoiding slow Python loops.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "data-science-u3-notes",
            "title": "Unit III: Study Notes",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Study-Notes-Unit-3.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Study-Notes-Unit-3.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for Pandas and NumPy."
          },
          {
            "id": "data-science-u3-worksheet",
            "title": "Unit III: Worksheet",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Worksheet-Unit-3.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Worksheet-Unit-3.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for Pandas and NumPy."
          },
          {
            "id": "data-science-u3-comics",
            "title": "Unit III: Concept Comics",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Comics-Unit-3.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Comics-Unit-3.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Illustrated comic walkthrough of Pandas and NumPy."
          }
        ],
        "videos": [],
        "duration": "12 Hours",
        "syllabus": "1. NumPy Basics: Fast Element-wise Array Functions\n2. Multidimensional Arrays\n3. Data Processing Using Arrays\n4. File I/O with Arrays\n5. Pandas Data Structures: Series and DataFrame\n6. Essential Functionality\n7. Descriptive Statistics\n8. Handling Missing Data\n9. Hierarchical Indexing",
        "description": "Topics: NumPy Basics: Fast Element-wise Array Functions, Multidimensional Arrays, Data Processing Using Arrays, File I/O with Arrays, Pandas Data Structures: Series and DataFrame, Essential Functionality, Descriptive Statistics, Handling Missing Data, Hierarchical Indexing",
        "learningOutcomes": "Discuss NumPy, Pandas and Matplotlib and how to use them for data analysis (CO3)\nPerform vectorised computations on arrays\nClean and summarise tabular data with Pandas",
        "referenceMaterials": "Text Books: Learning Python & Programming Python (Mark Lutz, O'Reilly); Python for Data Analysis (Wes McKinney, O'Reilly); Introduction to Machine Learning with Python (Müller & Guido, O'Reilly)"
      },
      {
        "id": "unit-4",
        "name": "Unit IV: Data Preprocessing and Visualization",
        "ppts": [
          {
            "id": "data-science-u4-slides",
            "title": "Unit IV: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Slides-Unit-4.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Slides-Unit-4.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for Data Preprocessing and Visualization."
          }
        ],
        "quiz": [
          {
            "options": [
              "Plot two columns",
              "Combine DataFrames on common keys, like an SQL join",
              "Remove duplicates",
              "Sort a DataFrame"
            ],
            "question": "pd.merge() is used to:",
            "explanation": "merge performs database-style joins (inner, left, right, outer) on key columns.",
            "correctAnswer": 1
          },
          {
            "options": [
              "Map-reduce-filter",
              "Split-apply-combine",
              "Extract-load-transform",
              "Train-test-split"
            ],
            "question": "df.groupby('dept')['salary'].mean() follows which pattern?",
            "explanation": "Rows are split by group, the mean is applied per group, and results are combined.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "data-science-u4-notes",
            "title": "Unit IV: Study Notes",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Study-Notes-Unit-4.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Study-Notes-Unit-4.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for Data Preprocessing and Visualization."
          },
          {
            "id": "data-science-u4-worksheet",
            "title": "Unit IV: Worksheet",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Worksheet-Unit-4.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Worksheet-Unit-4.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for Data Preprocessing and Visualization."
          },
          {
            "id": "data-science-u4-comics",
            "title": "Unit IV: Concept Comics",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Comics-Unit-4.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Comics-Unit-4.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Illustrated comic walkthrough of Data Preprocessing and Visualization."
          }
        ],
        "videos": [],
        "duration": "12 Hours",
        "syllabus": "1. Data Loading, Storage and File Formats\n2. Interacting with HTML, Web APIs and Databases\n3. Data Wrangling: Clean, Transform, Merge, Reshape\n4. Reshaping and Pivoting, String Manipulation\n5. Data Aggregation and GroupBy Operations\n6. Pivot Tables and Cross Tabulation\n7. Matplotlib API Primer\n8. Statistical Visualization with Seaborn\n9. Time Series and Case Studies",
        "description": "Topics: Data Loading, Storage and File Formats, Interacting with HTML, Web APIs and Databases, Data Wrangling: Clean, Transform, Merge, Reshape, Reshaping and Pivoting, String Manipulation, Data Aggregation and GroupBy Operations, Pivot Tables and Cross Tabulation, Matplotlib API Primer, Statistical Visualization with Seaborn, Time Series and Case Studies",
        "learningOutcomes": "Implement data collection, preprocessing and visualization scripts with Pandas and Matplotlib (CO4)\nMerge, reshape and aggregate datasets\nCommunicate insights through effective charts",
        "referenceMaterials": "Text Books: Learning Python & Programming Python (Mark Lutz, O'Reilly); Python for Data Analysis (Wes McKinney, O'Reilly); Introduction to Machine Learning with Python (Müller & Guido, O'Reilly)"
      },
      {
        "id": "unit-5",
        "name": "Unit V: Machine Learning for Data Science",
        "ppts": [
          {
            "id": "data-science-u5-slides",
            "title": "Unit V: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Slides-Unit-5.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Slides-Unit-5.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for Machine Learning for Data Science."
          }
        ],
        "quiz": [
          {
            "options": [
              "Supervised learning",
              "Unsupervised learning",
              "Reinforcement learning",
              "Semi-supervised regression"
            ],
            "question": "k-Means clustering is an example of:",
            "explanation": "k-Means groups unlabeled data into k clusters without target labels.",
            "correctAnswer": 1
          },
          {
            "options": [
              "TP / (TP + FN)",
              "TP / (TP + FP)",
              "(TP + TN) / Total",
              "FP / (FP + TN)"
            ],
            "question": "Precision is defined as:",
            "explanation": "Precision is the fraction of predicted positives that are actually positive.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "data-science-u5-notes",
            "title": "Unit V: Study Notes",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Study-Notes-Unit-5.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Study-Notes-Unit-5.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for Machine Learning for Data Science."
          },
          {
            "id": "data-science-u5-worksheet",
            "title": "Unit V: Worksheet",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Worksheet-Unit-5.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Worksheet-Unit-5.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for Machine Learning for Data Science."
          },
          {
            "id": "data-science-u5-comics",
            "title": "Unit V: Concept Comics",
            "docUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Comics-Unit-5.pdf",
            "embedUrl": "https://gjayasuma.github.io/Data-Science/pdfs/Comics-Unit-5.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Illustrated comic walkthrough of Machine Learning for Data Science."
          }
        ],
        "videos": [],
        "duration": "12 Hours",
        "syllabus": "1. Types of Learning: Supervised, Unsupervised, Reinforcement\n2. The Machine Learning Workflow\n3. Feature Engineering and Scaling\n4. Train-Test Split and Cross-Validation\n5. Linear & Logistic Regression, k-NN, Decision Trees\n6. k-Means, Hierarchical Clustering, PCA\n7. Overfitting/Underfitting and Evaluation Metrics\n8. Building Models with scikit-learn",
        "description": "Topics: Types of Learning: Supervised, Unsupervised, Reinforcement, The Machine Learning Workflow, Feature Engineering and Scaling, Train-Test Split and Cross-Validation, Linear & Logistic Regression, k-NN, Decision Trees, k-Means, Hierarchical Clustering, PCA, Overfitting/Underfitting and Evaluation Metrics, Building Models with scikit-learn",
        "learningOutcomes": "Build and evaluate basic ML models for data science applications in Python (CO5)\nPrepare features and validate models correctly\nInterpret confusion matrix, precision, recall, F1 and ROC",
        "referenceMaterials": "Text Books: Learning Python & Programming Python (Mark Lutz, O'Reilly); Python for Data Analysis (Wes McKinney, O'Reilly); Introduction to Machine Learning with Python (Müller & Guido, O'Reilly)"
      }
    ],
    "glowColor": "rgba(16, 185, 129, 0.4)",
    "description": "Data Science with Python — 5-unit B.Tech course (Dept. of IT, JNTUGV-CEV): Python, data handling, NumPy & Pandas, visualization and machine learning."
  },
  {
    "id": "deep-learning",
    "icon": "🧠",
    "name": "Deep Learning",
    "color": "from-rose-600 to-red-700",
    "modules": [
      {
        "id": "mod-1",
        "name": "Unit 1: Basics",
        "ppts": [
          {
            "id": "ppt-1794994525336",
            "title": "Basics",
            "pptUrl": "https://docs.google.com/presentation/d/1UCDW6l4Rr9xVBzGbGRMr94z0h5JVwC5r/edit?usp=sharing&ouid=118411959849374583906&rtpof=true&sd=true",
            "embedUrl": "https://drive.google.com/file/d/1UCDW6l4Rr9xVBzGbGRMr94z0h5JVwC5r/preview",
            "slideCount": "Slides Deck",
            "description": "Focuses on the foundational concepts, mapping biological neurons to artificial models, and introduces the McCulloch-Pitts unit, linear perceptrons, and the Perceptron Learning Algorithm."
          }
        ],
        "quiz": [
          {
            "options": [
              "Step Function",
              "Rectified Linear Unit (ReLU)",
              "Linear Identity",
              "Binary Threshold"
            ],
            "question": "Which of the following functions solved the vanishing gradient issue of Sigmoid in deep hidden layers?",
            "explanation": "ReLU (f(x) = max(0, x)) maintains a constant gradient of 1 for positive inputs, mitigating vanishing gradients.",
            "correctAnswer": 1
          },
          {
            "options": [
              "Cannot compute linear functions",
              "Cannot solve non-linearly separable problems like XOR",
              "Requires GPU hardware",
              "Cannot use gradient descent"
            ],
            "question": "What is the primary limitation of a single-layer perceptron?",
            "explanation": "As proven by Minsky and Papert, a single perceptron can only separate linearly separable decision boundaries.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "note-1794994194802",
            "title": "Basics",
            "docUrl": "https://zkiqeyhmoipzqawqqrvv.supabase.co/storage/v1/object/public/qlearn/notes/1794994133272_dl_unit1.pdf",
            "pdfUrl": "https://zkiqeyhmoipzqawqqrvv.supabase.co/storage/v1/object/public/qlearn/notes/1794994133272_dl_unit1.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
            "description": "Focuses on the foundational concepts, mapping biological neurons to artificial models, and introduces the McCulloch-Pitts unit, linear perceptrons, and the Perceptron Learning Algorithm.",
            "pdfFileName": "dl unit1.pdf"
          }
        ],
        "videos": [
          {
            "id": "vid-dl-1",
            "url": "https://www.youtube.com/embed/aircAruvnKk",
            "title": "Unit 1: Deep Learning Basics & Neural Foundations",
            "duration": "19m",
            "description": "Comprehensive introduction to artificial neurons, perceptrons, activation functions, and gradient descent."
          }
        ],
        "duration": "8 Hours",
        "syllabus": "1. Biological Neurons vs Artificial Neurons & The McCulloch-Pitts Model\n2. The Perceptron Learning Algorithm & Linear Separability Limits\n3. Sigmoid Neurons & Nonlinear Activation Functions (ReLU, Leaky ReLU, Tanh, ELU)\n4. Loss Functions: Mean Squared Error, Binary & Categorical Cross-Entropy\n5. Gradient Descent, Learning Rates, and Batch vs Stochastic Optimization",
        "description": "Topics: Introduction to Deep Learning, Biological Neurons, Perceptron, Sigmoid Neurons, Activation Functions, Loss Functions, Gradient Descent",
        "learningOutcomes": "Master foundational mathematical models of biological and artificial neurons\nUnderstand the limitations of single-layer perceptrons and the necessity of multilayer architectures\nFormulate and optimize loss surfaces using gradient descent algorithms",
        "referenceMaterials": "Deep Learning by Ian Goodfellow, Yoshua Bengio, and Aaron Courville (MIT Press) - Chapters 1 to 5"
      },
      {
        "id": "mod-2",
        "name": "Unit 2: Feed Forward Networks",
        "ppts": [
          {
            "id": "ppt-dl-2",
            "title": "Unit 2: Feed Forward Networks Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed?start=false&loop=false&delayms=3000",
            "slideCount": "36 Slides",
            "description": "Detailed slides on feed forward topologies, chain rule backpropagation, and Xavier/He initialization."
          },
          {
            "id": "ppt-1794994649020",
            "title": "Feed forward Networks",
            "pptUrl": "https://docs.google.com/presentation/d/1Ryeo36_R6H63XFva0PmwElziR40f-QcM/edit?usp=sharing&ouid=118411959849374583906&rtpof=true&sd=true",
            "embedUrl": "https://drive.google.com/file/d/1Ryeo36_R6H63XFva0PmwElziR40f-QcM/preview",
            "slideCount": "Slides Deck",
            "description": "Explains how to build and train deep networks using multilayer perceptrons, gradient descent, and backpropagation, alongside concepts like empirical risk minimization, regularization, and autoencoders."
          }
        ],
        "quiz": [
          {
            "options": [
              "It causes immediate overflow",
              "All hidden neurons compute identical outputs and gradients (symmetry problem)",
              "It reduces learning rate to zero",
              "It makes activation negative"
            ],
            "question": "Why is initializing all weights to zero problematic in a feed forward neural network?",
            "explanation": "Zero initialization creates total symmetry: every hidden neuron updates identically, preventing feature specialization.",
            "correctAnswer": 1
          },
          {
            "options": [
              "Bayes' Theorem",
              "Multivariate Chain Rule of Calculus",
              "Taylor Series Expansion",
              "Fourier Transform"
            ],
            "question": "What mathematical principle powers the calculation of gradients in the backpropagation algorithm?",
            "explanation": "Backpropagation recursively applies the multivariate calculus chain rule from output back to input.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "note-1794994238335",
            "title": "Feed forward Networks",
            "docUrl": "https://zkiqeyhmoipzqawqqrvv.supabase.co/storage/v1/object/public/qlearn/notes/1794994235626_dl_unit2.pdf",
            "pdfUrl": "https://zkiqeyhmoipzqawqqrvv.supabase.co/storage/v1/object/public/qlearn/notes/1794994235626_dl_unit2.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
            "description": "Explains how to build and train deep networks using multilayer perceptrons, gradient descent, and backpropagation, alongside concepts like empirical risk minimization, regularization, and autoencoders",
            "pdfFileName": "dl unit2.pdf"
          }
        ],
        "videos": [
          {
            "id": "vid-dl-2",
            "url": "https://www.youtube.com/embed/Ilg3gGewQ5U",
            "title": "Unit 2: Feed Forward Networks & Backpropagation",
            "duration": "18m",
            "description": "In-depth derivation of backpropagation using the chain rule and forward tensor flow."
          }
        ],
        "duration": "8 Hours",
        "syllabus": "1. Multilayer Perceptrons & Feed Forward Network Topologies\n2. Forward Propagation Mathematics and Tensor Computation\n3. The Backpropagation Algorithm: Comprehensive Derivation via Multivariate Chain Rule\n4. Weight Initialization Paradigms: Zero, Random, Xavier/Glorot, and He Initialization\n5. Universal Approximation Theorem & Expressive Representation Power of Deep Networks\n6. Output Layers & Softmax Distribution for Multiclass Classification",
        "description": "Topics: Multilayer Perceptrons, Feed Forward Neural Networks (FFNN), Backpropagation Algorithm, Chain Rule, Weight Initialization, Representation Power",
        "learningOutcomes": "Derive and implement the backpropagation gradient computation algorithm from first principles\nSelect and implement effective weight initialization to stabilize training\nDesign and configure multilayer feed forward networks for classification and regression",
        "referenceMaterials": "Neural Networks and Deep Learning by Michael Nielsen - Chapters 1 & 2"
      },
      {
        "id": "mod-3",
        "name": "Unit 3: Better Training for Neural Networks",
        "ppts": [
          {
            "id": "ppt-dl-3",
            "title": "Unit 3: Better Training for Neural Networks Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed?start=false&loop=false&delayms=3000",
            "slideCount": "38 Slides",
            "description": "Techniques for robust deep network training: vanishing gradients, batch norm, dropout, and Adam."
          },
          {
            "id": "ppt-1794994706186",
            "title": "Better Training of Neural Networks",
            "pptUrl": "https://docs.google.com/presentation/d/1JbTn_1ive0Pjqf7qPVS6kj4quPUjiI1v/edit?usp=sharing&ouid=118411959849374583906&rtpof=true&sd=true",
            "embedUrl": "https://drive.google.com/file/d/1JbTn_1ive0Pjqf7qPVS6kj4quPUjiI1v/preview",
            "slideCount": "Slides Deck",
            "description": "Covers advanced optimization algorithms (such as Momentum, RMSprop, and Adam), second-order methods, the saddle point problem, and regularization techniques like Dropout and Batch Normalization."
          }
        ],
        "quiz": [
          {
            "options": [
              "To increase training parameters",
              "To normalize layer inputs per mini-batch, stabilizing internal covariate shift",
              "To encrypt gradients",
              "To double the dataset size"
            ],
            "question": "What is the primary role of Batch Normalization in deep neural networks?",
            "explanation": "Batch Normalization normalizes the activations of each layer across mini-batches, allowing higher learning rates and stabilizing training.",
            "correctAnswer": 1
          },
          {
            "options": [
              "SGD",
              "AdaGrad",
              "Adam (Adaptive Moment Estimation)",
              "Hessian Free"
            ],
            "question": "Which optimizer combines the benefits of both Momentum and RMSProp?",
            "explanation": "Adam maintains both an exponentially decaying average of past gradients (Momentum) and past squared gradients (RMSProp).",
            "correctAnswer": 2
          }
        ],
        "notes": [
          {
            "id": "note-dl-3",
            "title": "Unit 3: Optimization & Regularization Notes",
            "imageUrl": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
            "description": "Formulas for L1/L2 regularization, dropout masks, batch norm mean/variance scaling, and Adam moment vectors."
          },
          {
            "id": "note-1794994266384",
            "title": "Better Training of Neural Networks",
            "docUrl": "https://zkiqeyhmoipzqawqqrvv.supabase.co/storage/v1/object/public/qlearn/notes/1794994264053_dl_unit3.pdf",
            "pdfUrl": "https://zkiqeyhmoipzqawqqrvv.supabase.co/storage/v1/object/public/qlearn/notes/1794994264053_dl_unit3.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
            "description": "Covers advanced optimization algorithms (such as Momentum, RMSprop, and Adam), second-order methods, the saddle point problem, and regularization techniques like Dropout and Batch Normalization.",
            "pdfFileName": "dl unit3.pdf"
          }
        ],
        "videos": [
          {
            "id": "vid-dl-3",
            "url": "https://www.youtube.com/embed/IHq1t7NxS8k",
            "title": "Unit 3: Better Training, Regularization & Optimizers",
            "duration": "22m",
            "description": "Mastering vanishing gradients, Dropout, Batch Normalization, and the Adam optimizer."
          }
        ],
        "duration": "8 Hours",
        "syllabus": "1. Challenges in Deep Neural Network Training: Vanishing and Exploding Gradients\n2. Regularization Strategies: L1/L2 Weight Decay, Dropout, and Data Augmentation\n3. Internal Covariate Shift & Batch Normalization across Mini-batches\n4. Adaptive Optimization Algorithms: Momentum, Nesterov, AdaGrad, RMSProp, and Adam\n5. Learning Rate Scheduling, Early Stopping, and Model Checkpointing\n6. Practical Hyperparameter Optimization (Grid Search, Random Search, Bayesian Optimization)",
        "description": "Topics: Vanishing & Exploding Gradients, Regularization (L1, L2, Dropout), Batch Normalization, Advanced Optimizers (Momentum, RMSProp, Adam), Hyperparameter Tuning, Early Stopping",
        "learningOutcomes": "Diagnose and remediate vanishing and exploding gradients in deep architectures\nApply regularization and batch normalization to prevent overfitting and accelerate convergence\nSelect and fine-tune modern adaptive optimizers for state-of-the-art training performance",
        "referenceMaterials": "Deep Learning by Goodfellow et al. - Chapters 7 & 8 (Optimization for Training Deep Models)"
      },
      {
        "id": "mod-4",
        "name": "Unit 4: RNN, CNN, Boltzmann Machines",
        "ppts": [
          {
            "id": "ppt-dl-4",
            "title": "Unit 4: CNN, RNN & Boltzmann Machines Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed?start=false&loop=false&delayms=3000",
            "slideCount": "42 Slides",
            "description": "Visual slide deck for 2D convolutions, temporal recurrent unfoldings, LSTM memory cells, and Boltzmann thermal distributions."
          },
          {
            "id": "ppt-1794994760232",
            "title": "Recurrent Neural Networks",
            "pptUrl": "https://docs.google.com/presentation/d/1C6O8EF5sfIjVPY14s_-jl6m1et_Ks8M6/edit?usp=sharing&ouid=118411959849374583906&rtpof=true&sd=true",
            "embedUrl": "https://drive.google.com/file/d/1C6O8EF5sfIjVPY14s_-jl6m1et_Ks8M6/preview",
            "slideCount": "Slides Deck",
            "description": "Details architectures with memory for processing sequences (RNNs, LSTMs, GRUs), introduces Convolutional Neural Networks (LeNet, AlexNet) for images, and explores energy-based generative models like Restricted Boltzmann Machines."
          }
        ],
        "quiz": [
          {
            "options": [
              "Input Gate",
              "Forget Gate",
              "Output Gate",
              "Update Gate"
            ],
            "question": "In an LSTM cell, which gate decides how much of the previous cell state should be discarded?",
            "explanation": "The Forget Gate outputs values between 0 and 1 via a sigmoid activation, regulating which past memory state is retained or erased.",
            "correctAnswer": 1
          },
          {
            "options": [
              "No connections between visible and hidden units",
              "No intra-layer connections among visible or among hidden units (bipartite graph)",
              "Only forward connections",
              "Weights must be strictly positive"
            ],
            "question": "What restriction defines a Restricted Boltzmann Machine (RBM)?",
            "explanation": "In an RBM, connections exist strictly between visible and hidden layers, forming a bipartite graph with no connections within the same layer.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "note-dl-4",
            "title": "Unit 4: CNN, RNN & Boltzmann Architecture Notes",
            "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
            "description": "Diagrams and formulas for convolution filters, pooling, LSTM forget/input/output gates, and RBM energy functions."
          },
          {
            "id": "note-1794994293583",
            "title": "Recurrent Neural Networks",
            "docUrl": "https://zkiqeyhmoipzqawqqrvv.supabase.co/storage/v1/object/public/qlearn/notes/1794994284105_dl_unit4.pdf",
            "pdfUrl": "https://zkiqeyhmoipzqawqqrvv.supabase.co/storage/v1/object/public/qlearn/notes/1794994284105_dl_unit4.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
            "description": "Details architectures with memory for processing sequences (RNNs, LSTMs, GRUs), introduces Convolutional Neural Networks (LeNet, AlexNet) for images, and explores energy-based generative models like Restricted Boltzmann Machines.",
            "pdfFileName": "dl unit4.pdf"
          }
        ],
        "videos": [
          {
            "id": "vid-dl-4",
            "url": "https://www.youtube.com/embed/KuXjwB4LzSA",
            "title": "Unit 4: CNNs, RNNs, LSTMs & Boltzmann Machines",
            "duration": "24m",
            "description": "Comprehensive review of spatial convolutions, sequence recurrence, gating mechanisms in LSTM, and Boltzmann energy models."
          }
        ],
        "duration": "10 Hours",
        "syllabus": "1. Convolutional Neural Networks: Convolutions, Strides, Padding, and Receptive Fields\n2. Feature Maps, Pooling Layers, and Classic Architectures (LeNet, AlexNet, ResNet)\n3. Sequence Modeling & Recurrent Neural Networks (RNN) with Backpropagation Through Time\n4. Vanishing Gradients in RNNs & Long Short-Term Memory (LSTM) / Gated Recurrent Units (GRU)\n5. Energy-Based Models and Unsupervised Feature Learning\n6. Boltzmann Machines, Restricted Boltzmann Machines (RBM), and Deep Belief Networks",
        "description": "Topics: Convolutional Neural Networks (CNN), Convolution Layers, Pooling, Recurrent Neural Networks (RNN), Backpropagation Through Time, LSTM, GRU, Boltzmann Machines, RBM",
        "learningOutcomes": "Build, train, and evaluate spatial feature extraction models using Convolutional Neural Networks\nImplement sequence-to-sequence models with LSTMs and GRUs for time-series and natural language\nUnderstand energy-based probabilistic graphical representations including Boltzmann Machines and RBMs",
        "referenceMaterials": "Deep Learning by Goodfellow et al. - Chapters 9, 10, and 20"
      },
      {
        "id": "mod-5",
        "name": "Unit 5: Recent trends",
        "ppts": [
          {
            "id": "ppt-dl-5",
            "title": "Unit 5: VAE & Transformers Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed?start=false&loop=false&delayms=3000",
            "slideCount": "44 Slides",
            "description": "Slides on probabilistic autoencoders, latent sampling, self-attention, multi-head attention, and transformer scaling."
          },
          {
            "id": "ppt-1794994814836",
            "title": "Recent Trends",
            "pptUrl": "https://docs.google.com/presentation/d/1UjpK1IuAmtUn8hSYWdIILBEPlHHtdNg7/edit?usp=sharing&ouid=118411959849374583906&rtpof=true&sd=true",
            "embedUrl": "https://drive.google.com/file/d/1UjpK1IuAmtUn8hSYWdIILBEPlHHtdNg7/preview",
            "slideCount": "Slides Deck",
            "description": "Explores modern state-of-the-art architectures, including Variational Autoencoders, Transformers, and large language models like GPT, highlighting their applications across vision, NLP, and speech."
          }
        ],
        "quiz": [
          {
            "options": [
              "To speed up matrix multiplication",
              "To allow backpropagation gradients to flow through stochastic latent sampling",
              "To compress the model weights",
              "To calculate softmax"
            ],
            "question": "Why is the Reparameterization Trick required during VAE training?",
            "explanation": "Direct sampling z ~ N(mu, sigma^2) is non-differentiable. The reparameterization trick expresses z = mu + sigma * epsilon, allowing gradients to backpropagate through mu and sigma.",
            "correctAnswer": 1
          },
          {
            "options": [
              "softmax(Q * K / sqrt(d_k)) * V",
              "sigmoid(Q * K) + V",
              "tanh(Q * V) * K",
              "relu(Q * K * V)"
            ],
            "question": "What is the formula for Scaled Dot-Product Attention in Transformers?",
            "explanation": "Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V, where sqrt(d_k) scales values to prevent extreme softmax gradient saturation.",
            "correctAnswer": 0
          }
        ],
        "notes": [
          {
            "id": "note-dl-5",
            "title": "Unit 5: VAE & Transformer Architecture Notes",
            "imageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
            "description": "Formulas for VAE loss (Reconstruction + KL divergence), Scaled Dot-Product Attention, and Transformer Encoder/Decoder stacks."
          },
          {
            "id": "note-1794994322699",
            "title": "Recent Trends",
            "docUrl": "https://zkiqeyhmoipzqawqqrvv.supabase.co/storage/v1/object/public/qlearn/notes/1794994313798_dl_unit5.pdf",
            "pdfUrl": "https://zkiqeyhmoipzqawqqrvv.supabase.co/storage/v1/object/public/qlearn/notes/1794994313798_dl_unit5.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
            "description": "Explores modern state-of-the-art architectures, including Variational Autoencoders, Transformers, and large language models like GPT, highlighting their applications across vision, NLP, and speech.",
            "pdfFileName": "dl unit5.pdf"
          }
        ],
        "videos": [
          {
            "id": "vid-dl-5",
            "url": "https://www.youtube.com/embed/wjZofJX0v4U",
            "title": "Unit 5: Variational Autoencoders & Transformers Masterclass",
            "duration": "26m",
            "description": "Deep dive into VAE generative latent spaces, the reparameterization trick, self-attention mechanisms, and Transformer architectures."
          }
        ],
        "duration": "10 Hours",
        "syllabus": "1. Deterministic Autoencoders, Undercomplete Representations, and Latent Spaces\n2. Variational Autoencoders (VAE): Probabilistic Generative Models & Evidence Lower Bound (ELBO)\n3. The Reparameterization Trick, Latent Manifold Sampling, and KL-Divergence\n4. Attention Mechanisms: Sequence-to-Sequence Modeling with Global and Local Attention\n5. The Transformer Architecture: Scaled Dot-Product Attention, Multi-Head Attention, Positional Encoding\n6. Modern Pretrained Foundation Models: Encoder-Only (BERT), Decoder-Only (GPT), and Vision Transformers (ViT)",
        "description": "Topics: Autoencoders, Variational Autoencoders (VAE), Latent Variable Models, Reparameterization Trick, Attention Mechanisms, Scaled Dot-Product Attention, Multi-Head Attention, Transformer Architecture",
        "learningOutcomes": "Formulate and implement Variational Autoencoders for generative modeling and latent representation\nUnderstand the mathematical foundations of scaled dot-product attention and multi-head attention\nImplement transformer architectures and evaluate their application across language, vision, and multimodal AI",
        "referenceMaterials": "Attention Is All You Need (Vaswani et al.), Auto-Encoding Variational Bayes (Kingma & Welling)"
      }
    ],
    "glowColor": "rgba(225, 29, 72, 0.4)",
    "description": "Comprehensive 5-Unit University Curriculum & Advanced Architecture Roadmap for Deep Learning."
  },
  {
    "id": "agentic-ai",
    "icon": "🧩",
    "name": "Agentic AI",
    "color": "from-amber-500 to-orange-600",
    "modules": [
      {
        "id": "mod-1",
        "name": "Module 1: AI Foundations",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of AI Foundations?",
            "explanation": "Option A is correct for AI Foundations.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "AI Foundations Overview",
            "duration": "15m",
            "description": "An introductory video on AI Foundations."
          }
        ],
        "description": "Topics: LLM Basics, Prompt Engineering, Transformers"
      },
      {
        "id": "mod-2",
        "name": "Module 2: Python for AI Agents",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of Python for AI Agents?",
            "explanation": "Option A is correct for Python for AI Agents.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "Python for AI Agents Overview",
            "duration": "15m",
            "description": "An introductory video on Python for AI Agents."
          }
        ],
        "description": "Topics: APIs, Async Programming, JSON Handling"
      },
      {
        "id": "mod-3",
        "name": "Module 3: LangChain Basics",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of LangChain Basics?",
            "explanation": "Option A is correct for LangChain Basics.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "LangChain Basics Overview",
            "duration": "15m",
            "description": "An introductory video on LangChain Basics."
          }
        ],
        "description": "Topics: Chains, Memory, Tools, Agents"
      },
      {
        "id": "mod-4",
        "name": "Module 4: Retrieval-Augmented Generation",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of Retrieval-Augmented Generation?",
            "explanation": "Option A is correct for Retrieval-Augmented Generation.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "Retrieval-Augmented Generation Overview",
            "duration": "15m",
            "description": "An introductory video on Retrieval-Augmented Generation."
          }
        ],
        "description": "Topics: Vector Databases, Embeddings, RAG Pipelines"
      },
      {
        "id": "mod-5",
        "name": "Module 5: Autonomous Agents",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of Autonomous Agents?",
            "explanation": "Option A is correct for Autonomous Agents.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "Autonomous Agents Overview",
            "duration": "15m",
            "description": "An introductory video on Autonomous Agents."
          }
        ],
        "description": "Topics: Planning, Reflection, Multi-step Reasoning"
      },
      {
        "id": "mod-6",
        "name": "Module 6: Multi-Agent Systems",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of Multi-Agent Systems?",
            "explanation": "Option A is correct for Multi-Agent Systems.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "Multi-Agent Systems Overview",
            "duration": "15m",
            "description": "An introductory video on Multi-Agent Systems."
          }
        ],
        "description": "Topics: Agent Collaboration, Communication, Task Delegation"
      },
      {
        "id": "mod-7",
        "name": "Module 7: AI Tool Use",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of AI Tool Use?",
            "explanation": "Option A is correct for AI Tool Use.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "AI Tool Use Overview",
            "duration": "15m",
            "description": "An introductory video on AI Tool Use."
          }
        ],
        "description": "Topics: Web Search, Code Execution, File Handling"
      },
      {
        "id": "mod-8",
        "name": "Module 8: AI Workflows",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of AI Workflows?",
            "explanation": "Option A is correct for AI Workflows.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "AI Workflows Overview",
            "duration": "15m",
            "description": "An introductory video on AI Workflows."
          }
        ],
        "description": "Topics: CrewAI, AutoGen, LangGraph"
      },
      {
        "id": "mod-9",
        "name": "Module 9: Production AI Agents",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of Production AI Agents?",
            "explanation": "Option A is correct for Production AI Agents.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "Production AI Agents Overview",
            "duration": "15m",
            "description": "An introductory video on Production AI Agents."
          }
        ],
        "description": "Topics: Deployment, Monitoring, Safety, Memory Systems"
      },
      {
        "id": "mod-10",
        "name": "Module 10: Projects",
        "ppts": [],
        "quiz": [
          {
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "question": "What is the core concept of Projects?",
            "explanation": "Option A is correct for Projects.",
            "correctAnswer": 0
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
        "videos": [
          {
            "id": "vid-1",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "title": "Projects Overview",
            "duration": "15m",
            "description": "An introductory video on Projects."
          }
        ],
        "description": "Topics: AI Research Assistant, AI Coding Agent, AI Campus Assistant Bot"
      }
    ],
    "glowColor": "rgba(245, 158, 11, 0.4)",
    "description": "Complete 10-module roadmap for Agentic AI."
  },
  {
    "id": "iot-internet-of-things",
    "icon": "🌐",
    "name": "IoT (Internet of Things)",
    "color": "from-cyan-600 to-blue-700",
    "modules": [
      {
        "id": "unit-1",
        "name": "Unit I: Introduction to IoT",
        "ppts": [
          {
            "id": "iot-internet-of-things-u1-slides",
            "title": "Unit I: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/IOT/pdfs/Slides-Units/Slides-Unit-1.pptx",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Slides-PDF/Slides-Unit-1.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for Introduction to IoT."
          },
          {
            "id": "ppt-iot-unit1",
            "title": "Unit 1: 4th Year B.Tech IoT Presentation Slides",
            "pptUrl": "https://docs.google.com/presentation/d/1o2oU9JwiQlJHIuvCLhqPq7-u-27D5rUK/edit?usp=sharing&ouid=116710741773817925660&rtpof=true&sd=true",
            "embedUrl": "https://drive.google.com/file/d/1o2oU9JwiQlJHIuvCLhqPq7-u-27D5rUK/preview",
            "slideCount": "Course Slides",
            "description": "Unit 1 presentation slides for 4th Year B.Tech IoT."
          }
        ],
        "quiz": [
          {
            "options": [
              "Lightweight Publish/Subscribe messaging protocol designed for constrained networks and low-bandwidth devices",
              "Heavyweight Synchronous Remote Procedure Call (RPC) for high-performance computing",
              "Direct P2P Video Streaming and Multi-media distribution protocol",
              "Relational database query protocol for edge servers"
            ],
            "question": "What is the primary role of the MQTT protocol in IoT architecture?",
            "explanation": "MQTT is a lightweight publish-subscribe messaging protocol ideal for IoT sensors operating in low bandwidth or constrained environments.",
            "correctAnswer": 0
          },
          {
            "options": [
              "Application Layer",
              "Perception / Physical Sensing Layer",
              "Network / Transport Layer",
              "Business & Analytics Layer"
            ],
            "question": "Which layer of the standard IoT architecture is directly responsible for capturing data from physical sensors and actuators?",
            "explanation": "The Perception (or Sensing) Layer consists of sensors, RFID tags, and actuators that physically detect and gather environmental data.",
            "correctAnswer": 1
          },
          {
            "options": [
              "To supply electrical voltage directly to external microcontrollers",
              "To translate communication protocols, aggregate sensor data, and bridge edge devices to the Cloud",
              "To execute complex deep learning model training on raw sensor nodes",
              "To replace physical microprocessors with virtual cloud machines"
            ],
            "question": "In 4th Year B.Tech IoT systems, what is the primary function of an IoT Gateway?",
            "explanation": "An IoT Gateway acts as a bridge between local sensor networks and the internet/cloud, handling protocol conversion, filtering, and data transmission.",
            "correctAnswer": 1
          },
          {
            "options": [
              "High-speed Wi-Fi 6 (802.11ax)",
              "LoRa (Long Range RF)",
              "USB 3.1 SuperSpeed",
              "Ethernet CAT6"
            ],
            "question": "Which wireless communication technology is specifically optimized for low-power, long-range (LoRaWAN) outdoor IoT deployments?",
            "explanation": "LoRa (Long Range) enables long-range transmissions (up to 15+ km) with low power consumption, making it ideal for smart agriculture and remote sensors.",
            "correctAnswer": 1
          },
          {
            "options": [
              "General Purpose Input/Output",
              "Graphical Processing and Input Operations",
              "Global Positioning and Internet Output",
              "General Protocol for IoT Operations"
            ],
            "question": "What does GPIO stand for on IoT hardware platforms like Raspberry Pi and ESP32?",
            "explanation": "GPIO stands for General Purpose Input/Output pins, which allow microcontrollers to interface with digital sensors, switches, LEDs, and relays.",
            "correctAnswer": 0
          },
          {
            "options": [
              "To eliminate the need for physical sensors entirely",
              "To process critical sensor data near the source, reducing network latency and bandwidth consumption",
              "To replace cloud data storage with paper logs",
              "To prevent microcontrollers from using electrical power"
            ],
            "question": "Why is Edge/Fog Computing heavily integrated into modern IoT deployments?",
            "explanation": "Edge and Fog computing perform real-time data processing and analytics locally near IoT devices, reducing latency, cloud bandwidth costs, and network dependence.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "iot-internet-of-things-u1-notes",
            "title": "Unit I: Study Notes",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Study-Notes-Units/Study-Notes-Unit-1.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Study-Notes-Units/Study-Notes-Unit-1.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for Introduction to IoT."
          },
          {
            "id": "iot-internet-of-things-u1-worksheet",
            "title": "Unit I: Worksheet",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Worksheets/Worksheet-Unit-1.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Worksheets/Worksheet-Unit-1.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for Introduction to IoT."
          },
          {
            "id": "iot-internet-of-things-u1-comics",
            "title": "Unit I: Concept Comics",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Comic-Images/Comics-Unit-1.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Comic-Images/Comics-Unit-1.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Illustrated comic walkthrough of Introduction to IoT."
          },
          {
            "id": "iot-syllabus",
            "title": "Course Syllabus, Lecture Plan & Lab Manual",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Syllabus.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Syllabus.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Official IoT with Applications syllabus with the 30-lecture plan and 15 lab experiments."
          },
          {
            "id": "iot-question-bank",
            "title": "IoT Question Bank (Units I–V)",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/IoT_Question_Bank.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/IoT_Question_Bank.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Question bank covering all five units."
          },
          {
            "id": "iot-lecture-outline",
            "title": "Video Lecture Series Outline",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/IoT_with_Applications_Lecture_Outline.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/IoT_with_Applications_Lecture_Outline.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Unit-wise headings and timings for the lecture series."
          },
          {
            "id": "note-iot-unit1",
            "title": "Unit 1: 4th Year B.Tech IoT Resource Notes",
            "docUrl": "https://docs.google.com/document/d/1ZaMRQws02NVIJ07k-u9rcZyoagAbvO7J/edit?usp=sharing&ouid=116710741773817925660&rtpof=true&sd=true",
            "embedUrl": "https://drive.google.com/file/d/1ZaMRQws02NVIJ07k-u9rcZyoagAbvO7J/preview",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Resource notes document covering Unit 1 topics for 4th Year B.Tech IoT."
          }
        ],
        "videos": [],
        "duration": "6 Lectures",
        "syllabus": "1. Definition, Characteristics and Evolution of IoT\n2. IoT vs Internet, M2M and Cyber-Physical Systems\n3. Components and Enabling Technologies\n4. Three-layer and Five-layer Architectures\n5. Edge and Fog Computing Overview\n6. IoT Devices: Sensors, Actuators, Microcontrollers, RFID, NFC, GPS\n7. IoT Data: Acquisition, Transmission, Storage, Analytics, Dashboards",
        "description": "Topics: Definition, Characteristics and Evolution of IoT, IoT vs Internet, M2M and Cyber-Physical Systems, Components and Enabling Technologies, Three-layer and Five-layer Architectures, Edge and Fog Computing Overview, IoT Devices: Sensors, Actuators, Microcontrollers, RFID, NFC, GPS, IoT Data: Acquisition, Transmission, Storage, Analytics, Dashboards",
        "learningOutcomes": "Explain IoT architecture, components and enabling technologies (CO1)\nDifferentiate IoT from M2M and cyber-physical systems\nTrace the IoT data journey from sensor to dashboard",
        "referenceMaterials": "Course Study Notes, Slides, Question Bank & Lecture Outline by Prof. G. Jaya Suma (github.com/gjayasuma/IOT)"
      },
      {
        "id": "unit-2",
        "name": "Unit II: IoT Communication and Networking",
        "ppts": [
          {
            "id": "iot-internet-of-things-u2-slides",
            "title": "Unit II: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/IOT/pdfs/Slides-Units/Slides-Unit-2.pptx",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Slides-PDF/Slides-Unit-2.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for IoT Communication and Networking."
          }
        ],
        "quiz": [
          {
            "options": [
              "Request–response over a broker-less mesh",
              "Publish–subscribe through a broker",
              "Peer-to-peer file sharing",
              "Client polling over FTP"
            ],
            "question": "MQTT follows which communication model?",
            "explanation": "Devices publish to topics on a broker, which forwards messages to subscribers.",
            "correctAnswer": 1
          },
          {
            "options": [
              "5G voice calls",
              "IPv6 packets over low-power wireless personal area networks",
              "Bluetooth audio streaming",
              "Wired Ethernet for sensors"
            ],
            "question": "6LoWPAN enables:",
            "explanation": "6LoWPAN compresses IPv6 headers so constrained IEEE 802.15.4 devices can be IP-addressable.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "iot-internet-of-things-u2-notes",
            "title": "Unit II: Study Notes",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Study-Notes-Units/Study-Notes-Unit-2.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Study-Notes-Units/Study-Notes-Unit-2.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for IoT Communication and Networking."
          },
          {
            "id": "iot-internet-of-things-u2-worksheet",
            "title": "Unit II: Worksheet",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Worksheets/Worksheet-Unit-2.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Worksheets/Worksheet-Unit-2.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for IoT Communication and Networking."
          },
          {
            "id": "iot-internet-of-things-u2-comics",
            "title": "Unit II: Concept Comics",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Comic-Images/Comics-Unit-2.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Comic-Images/Comics-Unit-2.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Illustrated comic walkthrough of IoT Communication and Networking."
          }
        ],
        "videos": [],
        "duration": "6 Lectures",
        "syllabus": "1. Short Range: Bluetooth/BLE, Zigbee, RFID, NFC, Wi-Fi\n2. Long Range: LoRaWAN, NB-IoT, LTE-M, 4G/5G\n3. Protocols: MQTT, CoAP, HTTP/HTTPS, AMQP, WebSockets\n4. IPv4 and IPv6, 6LoWPAN\n5. Wireless Sensor Networks\n6. Gateways, Addressing and Routing",
        "description": "Topics: Short Range: Bluetooth/BLE, Zigbee, RFID, NFC, Wi-Fi, Long Range: LoRaWAN, NB-IoT, LTE-M, 4G/5G, Protocols: MQTT, CoAP, HTTP/HTTPS, AMQP, WebSockets, IPv4 and IPv6, 6LoWPAN, Wireless Sensor Networks, Gateways, Addressing and Routing",
        "learningOutcomes": "Select appropriate communication technologies and protocols (CO2)\nCompare short-range and long-range IoT networks by range, power and bandwidth\nExplain publish-subscribe messaging with MQTT",
        "referenceMaterials": "Course Study Notes, Slides, Question Bank & Lecture Outline by Prof. G. Jaya Suma (github.com/gjayasuma/IOT)"
      },
      {
        "id": "unit-3",
        "name": "Unit III: IoT Platforms, Edge and Cloud",
        "ppts": [
          {
            "id": "iot-internet-of-things-u3-slides",
            "title": "Unit III: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/IOT/pdfs/Slides-Units/Slides-Unit-3.pptx",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Slides-PDF/Slides-Unit-3.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for IoT Platforms, Edge and Cloud."
          }
        ],
        "quiz": [
          {
            "options": [
              "Arduino Uno",
              "ESP32",
              "ATmega328P chip alone",
              "555 timer"
            ],
            "question": "Which board has built-in Wi-Fi and Bluetooth?",
            "explanation": "The ESP32 integrates Wi-Fi and Bluetooth/BLE, making it popular for connected IoT nodes.",
            "correctAnswer": 1
          },
          {
            "options": [
              "Unlimited storage",
              "Lower latency and bandwidth by processing data near its source",
              "Removing the need for sensors",
              "Higher cloud bills"
            ],
            "question": "The main benefit of edge computing in IoT is:",
            "explanation": "Processing locally gives real-time responses and sends only useful data to the cloud.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "iot-internet-of-things-u3-notes",
            "title": "Unit III: Study Notes",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Study-Notes-Units/Study-Notes-Unit-3.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Study-Notes-Units/Study-Notes-Unit-3.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for IoT Platforms, Edge and Cloud."
          },
          {
            "id": "iot-internet-of-things-u3-worksheet",
            "title": "Unit III: Worksheet",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Worksheets/Worksheet-Unit-3.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Worksheets/Worksheet-Unit-3.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for IoT Platforms, Edge and Cloud."
          },
          {
            "id": "iot-internet-of-things-u3-comics",
            "title": "Unit III: Concept Comics",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Comic-Images/Comics-Unit-3.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Comic-Images/Comics-Unit-3.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Illustrated comic walkthrough of IoT Platforms, Edge and Cloud."
          }
        ],
        "videos": [],
        "duration": "6 Lectures",
        "syllabus": "1. Hardware Platforms: Arduino, ESP32, Raspberry Pi, NodeMCU\n2. Sensors and Modules\n3. IoT Cloud Architecture, Device Management, Storage and Analytics\n4. Edge Computing: Edge vs Cloud, Real-Time Processing\n5. Edge AI and Fog Computing\n6. IoT + AI: Anomaly Detection, Predictive Maintenance, Computer Vision",
        "description": "Topics: Hardware Platforms: Arduino, ESP32, Raspberry Pi, NodeMCU, Sensors and Modules, IoT Cloud Architecture, Device Management, Storage and Analytics, Edge Computing: Edge vs Cloud, Real-Time Processing, Edge AI and Fog Computing, IoT + AI: Anomaly Detection, Predictive Maintenance, Computer Vision",
        "learningOutcomes": "Develop IoT applications using Arduino/ESP32/Raspberry Pi (CO3)\nApply cloud and edge computing to IoT data (CO4)\nDesign a Sensor → ESP32 → Edge AI → Cloud → Dashboard pipeline",
        "referenceMaterials": "Course Study Notes, Slides, Question Bank & Lecture Outline by Prof. G. Jaya Suma (github.com/gjayasuma/IOT)"
      },
      {
        "id": "unit-4",
        "name": "Unit IV: IoT Security and Data Analytics",
        "ppts": [
          {
            "id": "iot-internet-of-things-u4-slides",
            "title": "Unit IV: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/IOT/pdfs/Slides-Units/Slides-Unit-4.pptx",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Slides-PDF/Slides-Unit-4.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for IoT Security and Data Analytics."
          }
        ],
        "quiz": [
          {
            "options": [
              "Flooding a device with traffic",
              "Impersonating a legitimate device or identity",
              "Physically destroying a sensor",
              "Encrypting sensor data"
            ],
            "question": "A spoofing attack in IoT means:",
            "explanation": "Spoofing fakes an identity (device ID, MAC, IP) to gain trust; strong authentication counters it.",
            "correctAnswer": 1
          },
          {
            "options": [
              "Faster Wi-Fi",
              "Tamper-evident data integrity and decentralised trust",
              "Cheaper sensors",
              "Longer battery life"
            ],
            "question": "Blockchain is used with IoT mainly to provide:",
            "explanation": "A shared, append-only ledger makes sensor records and device identities hard to alter.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "iot-internet-of-things-u4-notes",
            "title": "Unit IV: Study Notes",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Study-Notes-Units/Study-Notes-Unit-4.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Study-Notes-Units/Study-Notes-Unit-4.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for IoT Security and Data Analytics."
          },
          {
            "id": "iot-internet-of-things-u4-worksheet",
            "title": "Unit IV: Worksheet",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Worksheets/Worksheet-Unit-4.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Worksheets/Worksheet-Unit-4.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for IoT Security and Data Analytics."
          },
          {
            "id": "iot-internet-of-things-u4-comics",
            "title": "Unit IV: Concept Comics",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Comic-Images/Comics-Unit-4.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Comic-Images/Comics-Unit-4.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Illustrated comic walkthrough of IoT Security and Data Analytics."
          }
        ],
        "videos": [],
        "duration": "6 Lectures",
        "syllabus": "1. Security Requirements: Authentication, Authorization, Encryption\n2. Device, Network and Cloud Security\n3. Threats: Device Attacks, Eavesdropping, Spoofing, DoS, Malware, Data Leakage\n4. Data Preprocessing and Time-Series Data\n5. Visualization, Anomaly Detection and Predictive Analytics\n6. Blockchain + IoT: Smart Contracts, Data Integrity, Identity Management",
        "description": "Topics: Security Requirements: Authentication, Authorization, Encryption, Device, Network and Cloud Security, Threats: Device Attacks, Eavesdropping, Spoofing, DoS, Malware, Data Leakage, Data Preprocessing and Time-Series Data, Visualization, Anomaly Detection and Predictive Analytics, Blockchain + IoT: Smart Contracts, Data Integrity, Identity Management",
        "learningOutcomes": "Design secure IoT solutions for real-world applications (CO5)\nIdentify common IoT threats and countermeasures\nApply analytics and ML to IoT time-series data",
        "referenceMaterials": "Course Study Notes, Slides, Question Bank & Lecture Outline by Prof. G. Jaya Suma (github.com/gjayasuma/IOT)"
      },
      {
        "id": "unit-5",
        "name": "Unit V: IoT Applications",
        "ppts": [
          {
            "id": "iot-internet-of-things-u5-slides",
            "title": "Unit V: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/IOT/pdfs/Slides-Units/Slides-Unit-5.pptx",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Slides-PDF/Slides-Unit-5.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for IoT Applications."
          }
        ],
        "quiz": [
          {
            "options": [
              "GPS coordinates",
              "Soil moisture sensor readings",
              "RFID tags",
              "Smart meters"
            ],
            "question": "In smart agriculture, automatic irrigation is typically triggered by:",
            "explanation": "When soil moisture drops below a threshold, the controller switches the water pump on.",
            "correctAnswer": 1
          },
          {
            "options": [
              "A backup server",
              "A virtual replica of a physical asset kept in sync with real-time sensor data",
              "A duplicate sensor",
              "A second factory"
            ],
            "question": "A digital twin in Industrial IoT is:",
            "explanation": "Digital twins mirror machines so operators can monitor, simulate and predict failures.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "iot-internet-of-things-u5-notes",
            "title": "Unit V: Study Notes",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Study-Notes-Units/Study-Notes-Unit-5.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Study-Notes-Units/Study-Notes-Unit-5.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for IoT Applications."
          },
          {
            "id": "iot-internet-of-things-u5-worksheet",
            "title": "Unit V: Worksheet",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Worksheets/Worksheet-Unit-5.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Worksheets/Worksheet-Unit-5.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for IoT Applications."
          },
          {
            "id": "iot-internet-of-things-u5-comics",
            "title": "Unit V: Concept Comics",
            "docUrl": "https://gjayasuma.github.io/IOT/pdfs/Comic-Images/Comics-Unit-5.pdf",
            "embedUrl": "https://gjayasuma.github.io/IOT/pdfs/Comic-Images/Comics-Unit-5.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Illustrated comic walkthrough of IoT Applications."
          }
        ],
        "videos": [],
        "duration": "6 Lectures",
        "syllabus": "1. Smart Agriculture\n2. Healthcare IoT\n3. Industrial IoT (IIoT) and Digital Twins\n4. Smart City\n5. Smart Energy\n6. Smart Transportation\n7. Smart Home\n8. Case Studies and Mini-Projects",
        "description": "Topics: Smart Agriculture, Healthcare IoT, Industrial IoT (IIoT) and Digital Twins, Smart City, Smart Energy, Smart Transportation, Smart Home, Case Studies and Mini-Projects",
        "learningOutcomes": "Develop an application-oriented IoT mini-project (CO6)\nMap sensing, networking, computing and security to domain applications\nEvaluate IoT solutions across agriculture, healthcare, industry and cities",
        "referenceMaterials": "Course Study Notes, Slides, Question Bank & Lecture Outline by Prof. G. Jaya Suma (github.com/gjayasuma/IOT)"
      }
    ],
    "glowColor": "rgba(8, 145, 178, 0.4)",
    "description": "IoT with Applications — 5-unit B.Tech course (Dept. of IT, JNTUGV-CEV): architecture, communication, platforms, edge/cloud, security and real-world applications."
  },
  {
    "id": "aiot",
    "name": "AIoT (AI of Things)",
    "icon": "📡",
    "description": "Convergence of Artificial Intelligence & IoT: Edge AI on microcontrollers, TinyML, sensor intelligence, real-time edge inference, and intelligent connected systems.",
    "color": "from-teal-600 to-emerald-700",
    "glowColor": "rgba(13, 148, 136, 0.4)",
    "modules": [
      {
        "id": "unit-1",
        "name": "Unit I: Foundations of AIoT & Edge Intelligence",
        "description": "Topics: IoT to AIoT Evolution, Sensor-to-Cloud Continuum, Microcontrollers (Cortex-M, ESP32), On-Device vs Cloud Inference, Latency, Bandwidth, and Power Constraints",
        "syllabus": "1. Evolution from Connected IoT to Cognitive AIoT\n2. The AIoT Architecture: Sensors, Edge Nodes, Gateways, Fog, and Cloud\n3. Hardware Platforms: ARM Cortex-M, ESP32, Raspberry Pi Pico, RISC-V\n4. Cloud Inference vs On-Device Edge Inference: Latency, Bandwidth, Privacy, and Energy Trade-Offs\n5. Sensor Data Lifecycle: Acquisition, Conditioning, Streaming, and Local Intelligence",
        "learningOutcomes": "Explain architectural differences between Cloud AI and Embedded Edge AI\nSelect suitable low-power microcontroller hardware for TinyML deployment\nEvaluate latency, bandwidth, and battery life constraints in connected edge systems",
        "duration": "8 Hours",
        "referenceMaterials": "TinyML: Machine Learning with TensorFlow Lite on Arduino and Ultra-Low-Power Microcontrollers (Pete Warden & Daniel Situnayake, OReilly)",
        "videos": [
          {
            "id": "vid-aiot-1",
            "title": "Unit 1: Introduction to AIoT & Edge Microcontrollers",
            "url": "https://www.youtube.com/embed/vO_rA7tB0x8",
            "duration": "17m",
            "description": "Introduction to AIoT architectures, edge computing vs cloud inference, and microcontroller hardware."
          }
        ],
        "notes": [
          {
            "id": "note-aiot-1",
            "title": "Unit 1: AIoT Foundations & Microcontroller Notes",
            "imageUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
            "description": "Study notes on the AIoT continuum, memory constraints in microcontrollers, and edge sensor pipelines."
          }
        ],
        "ppts": [
          {
            "id": "ppt-aiot-1",
            "title": "Unit 1: AIoT Architecture & Edge Hardware Slides",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Slide deck on AIoT system architecture, embedded computing nodes, and low-power hardware.",
            "slideCount": "32 Slides"
          }
        ],
        "quiz": [
          {
            "question": "What is the primary motivation for performing AI inference on edge IoT devices rather than in the cloud?",
            "options": [
              "Zero storage capacity in the cloud",
              "Reduced network latency, lower bandwidth consumption, and enhanced data privacy",
              "Cloud servers cannot execute deep learning",
              "Sensors cannot communicate over Wi-Fi"
            ],
            "correctAnswer": 1,
            "explanation": "Edge inference processes data directly on-device, eliminating round-trip network delays and cloud bandwidth costs."
          },
          {
            "question": "Which of the following embedded chips features built-in Wi-Fi and Bluetooth for low-power AIoT prototyping?",
            "options": [
              "ESP32",
              "ATmega328P without shields",
              "555 Timer",
              "LM741 Op-Amp"
            ],
            "correctAnswer": 0,
            "explanation": "The ESP32 is a low-cost, dual-core SoC with integrated Wi-Fi and Bluetooth extensively used in IoT and TinyML."
          }
        ]
      },
      {
        "id": "unit-2",
        "name": "Unit II: TinyML, Quantization & Model Compression",
        "description": "Topics: TinyML Principles, TensorFlow Lite for Microcontrollers (TFLM), Edge Impulse, INT8 Quantization, Weight Pruning, Knowledge Distillation",
        "syllabus": "1. What is TinyML? Ultra-low Power Machine Learning (<1 mW)\n2. Frameworks: TensorFlow Lite for Microcontrollers (TFLM) & Edge Impulse\n3. Model Quantization: FP32 to INT8 Quantization & Scale/Zero-Point Mathematics\n4. Post-Training Quantization (PTQ) vs Quantization-Aware Training (QAT)\n5. Weight Pruning: Structured and Unstructured Sparsity\n6. Knowledge Distillation & Model Size vs Accuracy Pareto Frontiers",
        "learningOutcomes": "Apply post-training quantization to reduce model footprints by 75% with negligible accuracy drop\nUtilize TensorFlow Lite Micro to compile deep learning graphs into C++ byte arrays\nEmploy model pruning and compression to fit models into limited SRAM/Flash",
        "duration": "8 Hours",
        "referenceMaterials": "Embedded Deep Learning: Algorithms, Architectures, and Circuits for Edge AI (Bert Moons, Daniel Bankman, Marian Verhelst)",
        "videos": [
          {
            "id": "vid-aiot-2",
            "title": "Unit 2: TinyML & Model Quantization Masterclass",
            "url": "https://www.youtube.com/embed/p1A79z58U9c",
            "duration": "22m",
            "description": "Hands-on guide to TensorFlow Lite Micro, INT8 quantization, and deploying models to embedded devices."
          }
        ],
        "notes": [
          {
            "id": "note-aiot-2",
            "title": "Unit 2: TinyML & Quantization Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Mathematical derivation of INT8 quantization affine mappings, zero-point scales, and pruning strategies."
          }
        ],
        "ppts": [
          {
            "id": "ppt-aiot-2",
            "title": "Unit 2: Model Compression & TinyML Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Visual slides on INT8 conversion, weight pruning, and memory profiling on microcontrollers.",
            "slideCount": "36 Slides"
          }
        ],
        "quiz": [
          {
            "question": "Converting model weights from 32-bit floating point (FP32) to 8-bit integer (INT8) reduces memory size by approximately:",
            "options": [
              "25%",
              "50%",
              "75%",
              "90%"
            ],
            "correctAnswer": 2,
            "explanation": "Moving from 4 bytes (32 bits) to 1 byte (8 bits) per weight achieves an approximate 75% memory reduction."
          },
          {
            "question": "What is the role of TensorFlow Lite for Microcontrollers (TFLM)?",
            "options": [
              "A full operating system for supercomputers",
              "A lightweight C++ runtime designed to run inferences on bare-metal microcontrollers without OS support",
              "A cloud database service",
              "A python package for distributed cluster training"
            ],
            "correctAnswer": 1,
            "explanation": "TFLM runs inference entirely in C++ on microcontrollers with no operating system or dynamic memory allocation required."
          }
        ]
      },
      {
        "id": "unit-3",
        "name": "Unit III: Sensor Intelligence & Anomaly Detection",
        "description": "Topics: Accelerometers, IMU, Audio Keyword Spotting (KWS), Time-Series Feature Extraction, Autoencoders on Edge, Anomaly Detection",
        "syllabus": "1. Intelligent Sensing: Accelerometer, Gyroscope, Audio, Environmental Sensors\n2. Signal Preprocessing: Filtering, Windowing, and Fast Fourier Transform (FFT)\n3. Time and Frequency Domain Feature Extraction for Embedded ML\n4. Audio Keyword Spotting (KWS): Spectrograms & Convolutional Models on Microcontrollers\n5. Anomaly Detection for Predictive Maintenance using Edge Autoencoders\n6. Real-time Inference Loops and Interrupt-Driven Sampling",
        "learningOutcomes": "Preprocess raw high-frequency sensor streams using windowing and spectral transformations\nTrain and deploy Keyword Spotting audio pipelines on edge microcontrollers\nImplement edge autoencoders to detect machinery anomalies and mechanical vibration defects",
        "duration": "8 Hours",
        "referenceMaterials": "Hands-On Artificial Intelligence for IoT (Amita Kapoor, Packt Publishing)",
        "videos": [
          {
            "id": "vid-aiot-3",
            "title": "Unit 3: Sensor Processing & Edge Anomaly Detection",
            "url": "https://www.youtube.com/embed/5aM2gP939c0",
            "duration": "19m",
            "description": "Tutorial on extracting features from IMU vibration signals and running anomaly detection at the edge."
          }
        ],
        "notes": [
          {
            "id": "note-aiot-3",
            "title": "Unit 3: Sensor Features & Edge Anomaly Detection Notes",
            "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
            "description": "Step-by-step guides for FFT feature extraction, mel-frequency cepstral coefficients (MFCC), and autoencoders."
          }
        ],
        "ppts": [
          {
            "id": "ppt-aiot-3",
            "title": "Unit 3: Sensor Intelligence & Audio KWS Slides",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Slide deck on time-series feature engineering and audio spectrogram classification on microcontrollers.",
            "slideCount": "35 Slides"
          }
        ],
        "quiz": [
          {
            "question": "Which signal processing transformation is standard for converting raw audio into a 2D image-like representation for CNN keyword spotting?",
            "options": [
              "Fast Fourier Transform (FFT) / Mel Spectrogram",
              "Bubble Sort",
              "Principal Component Analysis",
              "K-Means Clustering"
            ],
            "correctAnswer": 0,
            "explanation": "Spectrograms plot frequency intensity over time, creating a 2D image suitable for convolutional neural networks."
          },
          {
            "question": "How does an autoencoder detect anomalies in industrial sensor vibration data?",
            "options": [
              "By memorizing every possible abnormal label",
              "By reconstructing normal patterns; high reconstruction error signals an anomaly",
              "By randomly guessing values",
              "By discarding all sensor inputs"
            ],
            "correctAnswer": 1,
            "explanation": "Autoencoders trained on normal operational data produce high reconstruction error when encountering unusual abnormal inputs."
          }
        ]
      },
      {
        "id": "unit-4",
        "name": "Unit IV: Embedded Vision & Edge AI Accelerators",
        "description": "Topics: ESP32-CAM, Person Detection, MobileNet, Hardware Accelerators (Edge TPU, Kendryte K210, Hailo, Apple Neural Engine), Micro-NPU",
        "syllabus": "1. Embedded Computer Vision Challenges: Pixel Resolution, Memory Buffers, and FPS\n2. Hardware Platforms: ESP32-CAM, OpenMV Cam, Kendryte K210 with Hardware KPU\n3. Dedicated Edge Accelerators: Google Coral Edge TPU, Intel Movidius, and Hailo-8\n4. Optimized Vision Architectures: MobileNet V1/V2, ShuffleNet, and Tiny-YOLO\n5. Edge Object Detection & Person Detection Case Study\n6. Thermal Dissipation, Power Profiling, and Frame Rate Optimization",
        "learningOutcomes": "Interface camera sensors with embedded SoCs and manage DMA frame buffers\nDeploy lightweight vision models (MobileNet, FOMO) on low-power hardware\nCompare dedicated Neural Processing Units (NPUs) with general-purpose CPU edge inference",
        "duration": "8 Hours",
        "referenceMaterials": "Edge Computing: Systems and Algorithms (Mahadev Satyanarayanan & Weisong Shi)",
        "videos": [
          {
            "id": "vid-aiot-4",
            "title": "Unit 4: Embedded Vision & Micro-NPUs",
            "url": "https://www.youtube.com/embed/j13YmZ9uUeQ",
            "duration": "21m",
            "description": "Comprehensive overview of embedded vision architectures and neural hardware acceleration at the edge."
          }
        ],
        "notes": [
          {
            "id": "note-aiot-4",
            "title": "Unit 4: Embedded Vision & Hardware Accelerators Notes",
            "imageUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
            "description": "Depthwise separable convolutions, MobileNet architectures, and hardware accelerator benchmarks."
          }
        ],
        "ppts": [
          {
            "id": "ppt-aiot-4",
            "title": "Unit 4: Embedded Computer Vision Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Slides covering camera sensors, Tiny-YOLO, Edge TPUs, and person detection pipelines.",
            "slideCount": "38 Slides"
          }
        ],
        "quiz": [
          {
            "question": "What architectural innovation in MobileNet drastically cuts computational multiplications for embedded vision?",
            "options": [
              "Fully connected dense layers",
              "Depthwise Separable Convolutions",
              "Recurrent feedback loops",
              "Fourier transform layers"
            ],
            "correctAnswer": 1,
            "explanation": "Depthwise separable convolutions split standard convolutions into depthwise and pointwise stages, saving 8x to 9x computation."
          },
          {
            "question": "A Google Coral Edge TPU accelerator is optimized for executing which operation at high speed and low power?",
            "options": [
              "Complex 64-bit floating point calculations",
              "8-bit quantized matrix multiplications (INT8 tensor operations)",
              "Hard drive defragmentation",
              "SQL relational queries"
            ],
            "correctAnswer": 1,
            "explanation": "The Edge TPU is an ASIC specialized for accelerated INT8 tensor operations (up to 4 TOPS at 2 Watts)."
          }
        ]
      },
      {
        "id": "unit-5",
        "name": "Unit V: AIoT Deployment, MLOps & Industry Applications",
        "description": "Topics: Edge MLOps, Over-the-Air (OTA) Model Updates, Federated Learning, Smart Industry 4.0, Smart Agriculture, AIoT Security",
        "syllabus": "1. End-to-End AIoT Pipelines: Data Collection, Cloud Retraining, and Edge Re-deployment\n2. Over-the-Air (OTA) Model Updating Strategies & Rollback Safety\n3. Federated Learning on Distributed Edge Nodes: Privacy-Preserving Collaborative Training\n4. Industry 4.0 Case Studies: Vibration Analysis, Predictive Maintenance, and Quality Control\n5. Smart Agriculture & Environmental Monitoring Deployments\n6. Security Challenges in AIoT: Physical Attacks, Firmware Tampering, and Model Inversion at the Edge",
        "learningOutcomes": "Architect robust edge MLOps pipelines with over-the-air model updates\nDesign federated learning workflows across distributed edge IoT nodes\nAssess and mitigate hardware security vulnerabilities in intelligent IoT systems",
        "duration": "8 Hours",
        "referenceMaterials": "Internet of Things with Data Science and AI (B. K. Tripathy, CRC Press)",
        "videos": [
          {
            "id": "vid-aiot-5",
            "title": "Unit 5: AIoT Systems, MLOps & Real-World Deployments",
            "url": "https://www.youtube.com/embed/aircAruvnKk",
            "duration": "24m",
            "description": "Detailed analysis of edge MLOps, OTA updates, federated learning, and Industry 4.0 applications."
          }
        ],
        "notes": [
          {
            "id": "note-aiot-5",
            "title": "Unit 5: AIoT Deployment & Security Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Deployment architectures, OTA firmware update protocols, and federated averaging algorithms."
          }
        ],
        "ppts": [
          {
            "id": "ppt-aiot-5",
            "title": "Unit 5: Edge MLOps & Industry Case Studies Slides",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Slide deck on real-world industrial deployments, smart agriculture, and edge security.",
            "slideCount": "40 Slides"
          }
        ],
        "quiz": [
          {
            "question": "How does Federated Learning maintain user privacy across edge IoT devices?",
            "options": [
              "By uploading all raw sensor data to a public server",
              "By training locally on-device and sharing only model gradient updates with a central aggregator",
              "By disabling internet access permanently",
              "By encrypting passwords only"
            ],
            "correctAnswer": 1,
            "explanation": "In Federated Learning, raw device data never leaves the edge; only decentralized model parameter updates are aggregated."
          },
          {
            "question": "Why are Over-The-Air (OTA) update mechanisms critical for AIoT field deployments?",
            "options": [
              "To allow continuous model upgrades and security patches without physical device recall",
              "To change the physical battery remotely",
              "To increase camera hardware resolution",
              "To format the microcontroller memory permanently"
            ],
            "correctAnswer": 0,
            "explanation": "OTA updates allow new model weights and firmware fixes to be deployed wirelessly to deployed edge nodes in the field."
          }
        ]
      }
    ]
  },
  {
    "id": "ai-security",
    "name": "AI Security",
    "icon": "🛡️",
    "description": "Security, Robustness, and Trustworthy AI: adversarial attacks, model inversion, data poisoning, jailbreaking, prompt injection, and defensive alignment.",
    "color": "from-rose-600 to-red-800",
    "glowColor": "rgba(225, 29, 72, 0.4)",
    "modules": [
      {
        "id": "unit-1",
        "name": "Unit I: Foundations of Secure & Trustworthy AI",
        "description": "Topics: Pillars of Trustworthy AI, ML Lifecycle Attack Surfaces, Threat Modeling (STRIDE for AI), White-Box, Gray-Box & Black-Box Attacks",
        "syllabus": "1. Pillars of Trustworthy AI: Security, Privacy, Robustness, Explainability, and Fairness\n2. Attack Surfaces Across the Machine Learning Pipeline: Data Ingestion, Training, Deployment, Inference\n3. Threat Modeling for AI Systems (STRIDE for Machine Learning)\n4. Adversary Capabilities: White-Box, Gray-Box, and Black-Box Threat Models\n5. Regulatory and Safety Frameworks: NIST AI RMF, EU AI Act, and OWASP Top 10 for LLMs",
        "learningOutcomes": "Map the attack surface of modern machine learning and generative AI systems\nFormulate threat models assessing adversary goals, capabilities, and access levels\nApply international safety benchmarks and compliance standards to AI deployments",
        "duration": "8 Hours",
        "referenceMaterials": "Adversarial Machine Learning (Anthony D. Joseph, Blaine Nelson, Benjamin I. P. Rubinstein, J. D. Tygar, Cambridge University Press)",
        "videos": [
          {
            "id": "vid-sec-1",
            "title": "Unit 1: Introduction to AI Security & Threat Modeling",
            "url": "https://www.youtube.com/embed/J8Eh7RqggsU",
            "duration": "18m",
            "description": "Foundations of AI security, ML lifecycle attack surfaces, and adversary threat models."
          }
        ],
        "notes": [
          {
            "id": "note-sec-1",
            "title": "Unit 1: AI Threat Modeling & Foundations Notes",
            "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
            "description": "Taxonomy of machine learning vulnerabilities, adversary capability matrices, and risk assessment guidelines."
          }
        ],
        "ppts": [
          {
            "id": "ppt-sec-1",
            "title": "Unit 1: Foundations of Secure AI Lecture Slides",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Slide deck on trustworthy AI, attack vectors across ML systems, and threat classification.",
            "slideCount": "34 Slides"
          }
        ],
        "quiz": [
          {
            "question": "In a White-Box adversarial attack, what information does the attacker possess about the target model?",
            "options": [
              "No information about the model architecture or weights",
              "Complete knowledge of model architecture, weights, gradients, and loss function",
              "Only access to inputs and final predicted outputs",
              "Only the training dataset labels"
            ],
            "correctAnswer": 1,
            "explanation": "In a white-box setting, the adversary has full visibility into model architecture, parameters, and backpropagation gradients."
          },
          {
            "question": "What is the primary objective of threat modeling in machine learning security?",
            "options": [
              "To speed up training convergence",
              "To systematically identify vulnerabilities, adversary goals, and mitigation mechanisms across the ML lifecycle",
              "To compress model weights into INT8",
              "To replace machine learning with rules"
            ],
            "correctAnswer": 1,
            "explanation": "Threat modeling systematically evaluates security risks, attack surfaces, and defenses across the entire data and model pipeline."
          }
        ]
      },
      {
        "id": "unit-2",
        "name": "Unit II: Adversarial Evasion Attacks & Robust Defenses",
        "description": "Topics: Evasion at Inference Time, Fast Gradient Sign Method (FGSM), Projected Gradient Descent (PGD), C&W Attacks, Adversarial Training, Certified Defenses",
        "syllabus": "1. Evasion Attacks: Perturbing Inputs at Test Time to Cause Misclassification\n2. The Fast Gradient Sign Method (FGSM): Linearized Gradient Perturbations\n3. Iterative Attacks: Projected Gradient Descent (PGD) & Basic Iterative Method (BIM)\n4. Optimization Attacks: Carlini & Wagner (C&W) L2/L-infinity Formulations\n5. Physical Adversarial Patches & Real-World Vision Manipulation\n6. Defensive Strategies: Adversarial Training (Min-Max Optimization) & Certified Robustness via Randomized Smoothing",
        "learningOutcomes": "Generate adversarial perturbations using FGSM, PGD, and optimization methods\nUnderstand how imperceptible noise pushes inputs across model decision boundaries\nImplement adversarial training to harden models against evasion attacks",
        "duration": "8 Hours",
        "referenceMaterials": "Towards Deep Learning Models Resistant to Adversarial Attacks (Madry et al.) & Explaining and Harnessing Adversarial Examples (Goodfellow et al.)",
        "videos": [
          {
            "id": "vid-sec-2",
            "title": "Unit 2: FGSM, PGD Attacks & Adversarial Training",
            "url": "https://www.youtube.com/embed/KuXjwB4LzSA",
            "duration": "23m",
            "description": "Detailed derivation of FGSM, PGD iterative attacks, and robust adversarial training optimization."
          }
        ],
        "notes": [
          {
            "id": "note-sec-2",
            "title": "Unit 2: Adversarial Attacks & Defense Notes",
            "imageUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
            "description": "Mathematical formulations of FGSM, PGD projection, and min-max robust optimization."
          }
        ],
        "ppts": [
          {
            "id": "ppt-sec-2",
            "title": "Unit 2: Adversarial Robustness Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Visual slides on adversarial perturbations, decision boundary manipulation, and defensive training.",
            "slideCount": "38 Slides"
          }
        ],
        "quiz": [
          {
            "question": "What is the formula for generating an adversarial example using the Fast Gradient Sign Method (FGSM)?",
            "options": [
              "x_adv = x + epsilon * sign(gradient_x(Loss(theta, x, y)))",
              "x_adv = x - epsilon * sign(Loss)",
              "x_adv = x * epsilon",
              "x_adv = gradient(theta) / epsilon"
            ],
            "correctAnswer": 0,
            "explanation": "FGSM adds a small step in the direction of the sign of the loss gradient with respect to the input: x + epsilon * sign(grad_x J)."
          },
          {
            "question": "Why is Projected Gradient Descent (PGD) considered a stronger attack than single-step FGSM?",
            "options": [
              "It only requires one calculation",
              "It runs multiple small gradient steps, projecting back onto the epsilon ball at each step",
              "It deletes the target model weights",
              "It requires no gradient information"
            ],
            "correctAnswer": 1,
            "explanation": "PGD is a multi-step iterative attack that finds the most optimal adversarial point inside the allowable perturbation sphere."
          }
        ]
      },
      {
        "id": "unit-3",
        "name": "Unit III: Data Poisoning & Neural Trojan Backdoors",
        "description": "Topics: Training-Time Poisoning, Clean-Label Attacks, Backdoor Triggers, Neural Trojans, Backdoor Detection (Neural Cleanse, STRIP), Dataset Sanitization",
        "syllabus": "1. Data Poisoning: Tampering with Training Datasets to Degrade Accuracy or Control Outputs\n2. Availability Poisoning vs Targeted Integrity Poisoning\n3. Clean-Label Poisoning Attacks: Bypassing Manual Human Inspection\n4. Neural Backdoor / Trojan Attacks: Trigger Patterns in Vision, Audio, and NLP\n5. Backdoor Defense & Detection: Neural Cleanse, Activation Clustering, and STRIP\n6. Dataset Auditing, Sanitization, and Cryptographic Data Provenance",
        "learningOutcomes": "Distinguish between availability poisoning and targeted backdoor injection\nIdentify how imperceptible triggers in training data create latent vulnerabilities\nApply anomaly detection and reverse-engineering techniques to inspect models for hidden trojans",
        "duration": "8 Hours",
        "referenceMaterials": "BadNets: Identifying Vulnerabilities in the Machine Learning Model Supply Chain (Gu et al.)",
        "videos": [
          {
            "id": "vid-sec-3",
            "title": "Unit 3: Data Poisoning & Neural Backdoors",
            "url": "https://www.youtube.com/embed/wjZofJX0v4U",
            "duration": "20m",
            "description": "Lecture on training-time data poisoning, trigger patterns, and backdoor defense mechanisms."
          }
        ],
        "notes": [
          {
            "id": "note-sec-3",
            "title": "Unit 3: Data Poisoning & Backdoor Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Analysis of backdoor trigger types, poisoning mathematics, and model verification tools."
          }
        ],
        "ppts": [
          {
            "id": "ppt-sec-3",
            "title": "Unit 3: Poisoning & Trojan Attacks Slides",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Slide deck on backdoor injection, trigger patterns, and dataset sanitization algorithms.",
            "slideCount": "35 Slides"
          }
        ],
        "quiz": [
          {
            "question": "How does a backdoored (Trojan) neural network behave on normal inputs that lack the trigger?",
            "options": [
              "It crashes immediately",
              "It behaves completely normally with high test accuracy on benign data",
              "It outputs random noise",
              "It refuses to run inference"
            ],
            "correctAnswer": 1,
            "explanation": "Backdoors are designed to be stealthy: the model maintains high accuracy on clean inputs and only misbehaves when the trigger is present."
          },
          {
            "question": "What is the goal of clean-label data poisoning?",
            "options": [
              "Labeling all data as 0",
              "Injecting poisoned samples whose visible labels still match human perception, making detection difficult",
              "Clearing all database entries",
              "Removing all labels entirely"
            ],
            "correctAnswer": 1,
            "explanation": "Clean-label poisoning injects perturbed samples that human annotators would still classify as the original label."
          }
        ]
      },
      {
        "id": "unit-4",
        "name": "Unit IV: Privacy Attacks & Differential Privacy",
        "description": "Topics: Membership Inference Attacks, Model Inversion, Model Stealing, Differential Privacy (DP-SGD), Privacy Budgets (Epsilon, Delta), Federated Privacy",
        "syllabus": "1. Machine Learning Privacy Threats: Memorization in Deep Models\n2. Membership Inference Attacks: Determining if a Specific Record was in the Training Set\n3. Model Inversion & Feature Reconstruction: Reconstructing Sensitive Facial Images from Classifiers\n4. Model Stealing / Extraction: Replicating Proprietary Models via Query Flooding\n5. Differential Privacy (DP) Foundations: Formal Definition, Neighboring Datasets, Epsilon & Delta\n6. Differentially Private SGD (DP-SGD): Gradient Clipping, Gaussian Noise Injection, and Privacy Accounting",
        "learningOutcomes": "Execute membership inference attacks to quantify private training data leakage\nFormulate differential privacy guarantees using privacy budgets (epsilon, delta)\nImplement DP-SGD with gradient clipping and calibrated Gaussian noise injection",
        "duration": "8 Hours",
        "referenceMaterials": "Deep Learning with Differential Privacy (Abadi et al., ACM CCS) & The Algorithmic Foundations of Differential Privacy (Dwork & Roth)",
        "videos": [
          {
            "id": "vid-sec-4",
            "title": "Unit 4: Membership Inference & Differential Privacy",
            "url": "https://www.youtube.com/embed/Ilg3gGewQ5U",
            "duration": "22m",
            "description": "In-depth tutorial on membership inference attacks, model inversion, and DP-SGD privacy preservation."
          }
        ],
        "notes": [
          {
            "id": "note-sec-4",
            "title": "Unit 4: ML Privacy Attacks & DP-SGD Notes",
            "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
            "description": "Formal definitions of differential privacy, privacy budget proofs, and shadow model inference steps."
          }
        ],
        "ppts": [
          {
            "id": "ppt-sec-4",
            "title": "Unit 4: Privacy Attacks & Defenses Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Slides on model extraction, membership leakage, and differentially private optimization.",
            "slideCount": "37 Slides"
          }
        ],
        "quiz": [
          {
            "question": "A Membership Inference Attack allows an adversary to determine:",
            "options": [
              "Whether a specific individuals record was included in the models training dataset",
              "The total number of parameters in the network",
              "The exact GPU clock speed during training",
              "The IP address of the server"
            ],
            "correctAnswer": 0,
            "explanation": "Membership inference exploits differences in model confidence on seen training data versus unseen test data."
          },
          {
            "question": "In Differential Privacy (epsilon, delta), a smaller value of epsilon indicates:",
            "options": [
              "Weaker privacy protection",
              "Stronger privacy protection (lower information leakage)",
              "Faster training speed",
              "Larger model size"
            ],
            "correctAnswer": 1,
            "explanation": "A smaller epsilon restricts how much any single record can influence model output, providing stronger privacy."
          }
        ]
      },
      {
        "id": "unit-5",
        "name": "Unit V: LLM Security, Jailbreaking & AI Alignment",
        "description": "Topics: Prompt Injection (Direct & Indirect), Jailbreaking, System Prompt Exfiltration, Alignment (RLHF, Constitutional AI), Guardrails & Secure Governance",
        "syllabus": "1. Large Language Model (LLM) Attack Surfaces: The OWASP Top 10 for LLMs\n2. Direct & Indirect Prompt Injection Attacks: Overriding System Instructions via Untrusted Content\n3. Jailbreaking Paradigms: Persona Adoption, Hypothetical Scenarios, Base64 Obfuscation, and Adversarial Suffixes\n4. Data Exfiltration via External Tools, Function Calling, and Markdown Image Injections\n5. Defensive Alignment: Reinforcement Learning from Human Feedback (RLHF), DPO, and Constitutional AI\n6. Production LLM Defenses: Input Sanitization, Output Guardrails (Llama Guard, NeMo Guardrails), and AI Governance",
        "learningOutcomes": "Analyze direct and indirect prompt injection vulnerabilities in LLM tool-calling pipelines\nConstruct safe system prompts and test them against automated jailbreak strategies\nDeploy input/output guardrails and evaluate alignment mechanisms for enterprise AI",
        "duration": "8 Hours",
        "referenceMaterials": "OWASP Top 10 for Large Language Model Applications & Universal and Transferable Adversarial Attacks on Aligned Language Models (Zou et al.)",
        "videos": [
          {
            "id": "vid-sec-5",
            "title": "Unit 5: Prompt Injection, Jailbreaking & LLM Guardrails",
            "url": "https://www.youtube.com/embed/aircAruvnKk",
            "duration": "25m",
            "description": "Comprehensive analysis of prompt injection, jailbreaking techniques, LLM safety guardrails, and alignment."
          }
        ],
        "notes": [
          {
            "id": "note-sec-5",
            "title": "Unit 5: LLM Security & Alignment Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Taxonomy of indirect prompt injection, tool poisoning attacks, and guardrail architecture patterns."
          }
        ],
        "ppts": [
          {
            "id": "ppt-sec-5",
            "title": "Unit 5: LLM Safety & Guardrails Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Slides covering OWASP LLM vulnerabilities, jailbreaking defenses, and enterprise alignment.",
            "slideCount": "40 Slides"
          }
        ],
        "quiz": [
          {
            "question": "What is an Indirect Prompt Injection attack in an LLM system?",
            "options": [
              "The user types a jailbreak prompt directly into the chat interface",
              "The LLM processes untrusted third-party content (e.g., a website or email) that contains hidden adversarial instructions",
              "The hardware loses electrical power",
              "A SQL injection targeting the authentication database"
            ],
            "correctAnswer": 1,
            "explanation": "Indirect prompt injection occurs when an LLM reads external data (web pages, PDFs, emails) that embed instructions designed to hijack the models execution."
          },
          {
            "question": "What is the purpose of an AI Guardrail (such as Llama Guard or NeMo Guardrails)?",
            "options": [
              "To re-train the foundational model weights from scratch",
              "To inspect user prompts and LLM outputs in real time, filtering out toxic, unauthorized, or unsafe content",
              "To overclock the GPU hardware",
              "To increase token generation speed"
            ],
            "correctAnswer": 1,
            "explanation": "Guardrails act as a real-time safety layer evaluating inputs and outputs against safety policies."
          }
        ]
      }
    ]
  },
  {
    "id": "quantum-computing",
    "icon": "⚛️",
    "name": "Quantum Computing",
    "color": "from-blue-600 to-indigo-700",
    "modules": [
      {
        "id": "unit-1",
        "name": "Unit I: Foundations of Quantum Mechanics for Computing",
        "ppts": [
          {
            "id": "quantum-computing-u1-slides",
            "title": "Unit I: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/QC/pdfs/Slides-Unit-1.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Slides-Unit-1.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for Foundations of Quantum Mechanics for Computing."
          }
        ],
        "quiz": [
          {
            "options": [
              "α + β = 1",
              "|α|² + |β|² = 1",
              "α = β",
              "α · β = 0"
            ],
            "question": "A qubit state α|0⟩ + β|1⟩ must satisfy which condition?",
            "explanation": "Amplitudes are normalised: the measurement probabilities |α|² and |β|² must sum to 1.",
            "correctAnswer": 1
          },
          {
            "options": [
              "0",
              "1/4",
              "1/2",
              "1"
            ],
            "question": "Measuring the state |+⟩ = (|0⟩ + |1⟩)/√2 in the computational basis gives 0 with probability:",
            "explanation": "Both amplitudes are 1/√2, so each outcome occurs with probability (1/√2)² = 1/2.",
            "correctAnswer": 2
          }
        ],
        "notes": [
          {
            "id": "quantum-computing-u1-notes",
            "title": "Unit I: Study Notes",
            "docUrl": "https://gjayasuma.github.io/QC/pdfs/Study-Notes-Unit-1.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Study-Notes-Unit-1.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for Foundations of Quantum Mechanics for Computing."
          },
          {
            "id": "quantum-computing-u1-worksheet",
            "title": "Unit I: Worksheet",
            "docUrl": "https://gjayasuma.github.io/QC/pdfs/Worksheet-Unit-1.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Worksheet-Unit-1.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for Foundations of Quantum Mechanics for Computing."
          },
          {
            "id": "quantum-computing-syllabus",
            "title": "Course Syllabus",
            "docUrl": "https://docs.google.com/document/d/1W-zkE-9D6FP_vVpaBzZuz0ShoPGKN2gH/edit",
            "embedUrl": "https://docs.google.com/document/d/1W-zkE-9D6FP_vVpaBzZuz0ShoPGKN2gH/preview",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Official Quantum Computing course syllabus."
          }
        ],
        "videos": [],
        "duration": "5 Hours",
        "syllabus": "1. Complex Numbers and Linear Algebra\n2. Dirac Notation\n3. Qubits and Superposition\n4. Phase and Interference\n5. Bloch Sphere\n6. Measurement\n7. Multi-Qubit States\n8. Entanglement",
        "description": "Topics: Complex Numbers and Linear Algebra, Dirac Notation, Qubits and Superposition, Phase and Interference, Bloch Sphere, Measurement, Multi-Qubit States, Entanglement",
        "learningOutcomes": "Represent qubit states using Dirac notation and the Bloch sphere\nCompute measurement probabilities for single- and multi-qubit states\nDistinguish product states from entangled states",
        "referenceMaterials": "Course Study Notes, Slides & Worksheets by Prof. G. Jaya Suma (github.com/gjayasuma/QC)"
      },
      {
        "id": "unit-2",
        "name": "Unit II: Quantum Gates and Circuits",
        "ppts": [
          {
            "id": "quantum-computing-u2-slides",
            "title": "Unit II: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/QC/pdfs/Slides-Unit-2.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Slides-Unit-2.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for Quantum Gates and Circuits."
          }
        ],
        "quiz": [
          {
            "options": [
              "|1⟩",
              "(|0⟩ + |1⟩)/√2",
              "(|0⟩ − |1⟩)/√2",
              "|0⟩"
            ],
            "question": "Applying a Hadamard gate to |0⟩ produces:",
            "explanation": "H|0⟩ = |+⟩ = (|0⟩ + |1⟩)/√2, an equal superposition.",
            "correctAnswer": 1
          },
          {
            "options": [
              "0",
              "1",
              "2",
              "3"
            ],
            "question": "Teleporting one qubit uses a shared Bell pair plus how many classical bits?",
            "explanation": "Alice sends her two measurement results (2 classical bits) so Bob can apply the correcting X/Z gates.",
            "correctAnswer": 2
          }
        ],
        "notes": [
          {
            "id": "quantum-computing-u2-notes",
            "title": "Unit II: Study Notes",
            "docUrl": "https://gjayasuma.github.io/QC/pdfs/Study-Notes-Unit-2.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Study-Notes-Unit-2.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for Quantum Gates and Circuits."
          },
          {
            "id": "quantum-computing-u2-worksheet",
            "title": "Unit II: Worksheet",
            "docUrl": "https://gjayasuma.github.io/QC/pdfs/Worksheet-Unit-2.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Worksheet-Unit-2.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for Quantum Gates and Circuits."
          }
        ],
        "videos": [],
        "duration": "5 Hours",
        "syllabus": "1. Unitary and Reversible Computing\n2. Pauli Gates\n3. Hadamard, S and T Gates\n4. Rotation Gates\n5. Multi-Qubit Gates\n6. Universal Gate Sets\n7. Bell States\n8. Quantum Teleportation\n9. Superdense Coding",
        "description": "Topics: Unitary and Reversible Computing, Pauli Gates, Hadamard, S and T Gates, Rotation Gates, Multi-Qubit Gates, Universal Gate Sets, Bell States, Quantum Teleportation, Superdense Coding",
        "learningOutcomes": "Apply single- and multi-qubit gates to quantum states\nConstruct Bell states and simple quantum circuits\nExplain teleportation and superdense coding protocols",
        "referenceMaterials": "Course Study Notes, Slides & Worksheets by Prof. G. Jaya Suma (github.com/gjayasuma/QC)"
      },
      {
        "id": "unit-3",
        "name": "Unit III: Quantum Algorithms",
        "ppts": [
          {
            "id": "quantum-computing-u3-slides",
            "title": "Unit III: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/QC/pdfs/Slides-Unit-3.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Slides-Unit-3.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for Quantum Algorithms."
          }
        ],
        "quiz": [
          {
            "options": [
              "1",
              "2",
              "n",
              "2ⁿ⁻¹ + 1"
            ],
            "question": "The Deutsch–Jozsa algorithm decides whether f is constant or balanced using how many oracle queries?",
            "explanation": "A single query on a superposition of all inputs suffices, versus up to 2ⁿ⁻¹ + 1 classically.",
            "correctAnswer": 0
          },
          {
            "options": [
              "The oracle measures the input",
              "The function value appears as a phase on the input register",
              "The target qubit is reset",
              "Noise flips the phase"
            ],
            "question": "Phase kickback in oracle-based algorithms means:",
            "explanation": "With the target in |−⟩, the oracle multiplies the input state by (−1)^f(x), kicking the result into the phase.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "quantum-computing-u3-notes",
            "title": "Unit III: Study Notes",
            "docUrl": "https://gjayasuma.github.io/QC/pdfs/Study-Notes-Unit-3.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Study-Notes-Unit-3.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for Quantum Algorithms."
          },
          {
            "id": "quantum-computing-u3-worksheet",
            "title": "Unit III: Worksheet",
            "docUrl": "https://gjayasuma.github.io/QC/pdfs/Worksheet-Unit-3.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Worksheet-Unit-3.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for Quantum Algorithms."
          }
        ],
        "videos": [],
        "duration": "5 Hours",
        "syllabus": "1. Oracles and Phase Kickback\n2. Deutsch Algorithm\n3. Deutsch–Jozsa Algorithm\n4. Bernstein–Vazirani Algorithm\n5. Simon's Algorithm",
        "description": "Topics: Oracles and Phase Kickback, Deutsch Algorithm, Deutsch–Jozsa Algorithm, Bernstein–Vazirani Algorithm, Simon's Algorithm",
        "learningOutcomes": "Explain how oracles and phase kickback encode functions\nTrace the Deutsch–Jozsa and Bernstein–Vazirani algorithms\nCompare quantum and classical query complexity",
        "referenceMaterials": "Course Study Notes, Slides & Worksheets by Prof. G. Jaya Suma (github.com/gjayasuma/QC)"
      },
      {
        "id": "unit-4",
        "name": "Unit IV: Quantum Programming and Simulation Platforms",
        "ppts": [
          {
            "id": "quantum-computing-u4-slides",
            "title": "Unit IV: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/QC/pdfs/Slides-Unit-4.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Slides-Unit-4.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for Quantum Programming and Simulation Platforms."
          }
        ],
        "quiz": [
          {
            "options": [
              "A quantum hardware vendor",
              "An assembly-like language for describing quantum circuits",
              "A classical database",
              "A Python plotting library"
            ],
            "question": "OpenQASM is best described as:",
            "explanation": "OpenQASM is an intermediate representation for quantum circuits, used by Qiskit and IBM hardware.",
            "correctAnswer": 1
          },
          {
            "options": [
              "Adding more qubits",
              "Loss of quantum information through interaction with the environment",
              "Compiling a circuit",
              "Entangling two qubits"
            ],
            "question": "Decoherence refers to:",
            "explanation": "Environmental interaction destroys superposition and entanglement over time, a key source of hardware errors.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "quantum-computing-u4-notes",
            "title": "Unit IV: Study Notes",
            "docUrl": "https://gjayasuma.github.io/QC/pdfs/Study-Notes-Unit-4.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Study-Notes-Unit-4.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for Quantum Programming and Simulation Platforms."
          },
          {
            "id": "quantum-computing-u4-worksheet",
            "title": "Unit IV: Worksheet",
            "docUrl": "https://gjayasuma.github.io/QC/pdfs/Worksheet-Unit-4.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Worksheet-Unit-4.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for Quantum Programming and Simulation Platforms."
          }
        ],
        "videos": [],
        "duration": "5 Hours",
        "syllabus": "1. Qiskit\n2. Cirq\n3. Q#\n4. PennyLane\n5. Amazon Braket\n6. OpenQASM\n7. Simulators vs Real Hardware\n8. Noise and Decoherence\n9. Error Mitigation\n10. Introduction to Quantum Error Correction",
        "description": "Topics: Qiskit, Cirq, Q#, PennyLane, Amazon Braket, OpenQASM, Simulators vs Real Hardware, Noise and Decoherence, Error Mitigation, Introduction to Quantum Error Correction",
        "learningOutcomes": "Build and run quantum circuits in Qiskit and other SDKs\nCompare simulator results with noisy hardware runs\nExplain decoherence, error mitigation and the idea of error correction",
        "referenceMaterials": "Course Study Notes, Slides & Worksheets by Prof. G. Jaya Suma (github.com/gjayasuma/QC)"
      },
      {
        "id": "unit-5",
        "name": "Unit V: Quantum Computing Applications and Emerging Trends",
        "ppts": [
          {
            "id": "quantum-computing-u5-slides",
            "title": "Unit V: Lecture Slides",
            "pptUrl": "https://gjayasuma.github.io/QC/pdfs/Slides-Unit-5.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Slides-Unit-5.pdf",
            "slideCount": "Unit Slides (PDF)",
            "description": "Lecture slides for Quantum Computing Applications and Emerging Trends."
          }
        ],
        "quiz": [
          {
            "options": [
              "Photons travel faster than light",
              "Measuring a qubit in the wrong basis disturbs it, raising the error rate",
              "Keys are encrypted with RSA",
              "The channel is wired"
            ],
            "question": "BB84 detects an eavesdropper because:",
            "explanation": "Eve cannot copy unknown states (no-cloning); her measurements introduce detectable errors.",
            "correctAnswer": 1
          },
          {
            "options": [
              "Cryptography run on quantum computers",
              "Classical algorithms believed secure against quantum attacks",
              "Breaking RSA with Shor's algorithm",
              "Quantum key distribution"
            ],
            "question": "Post-quantum cryptography refers to:",
            "explanation": "PQC schemes (e.g. lattice-based) run on classical hardware but resist known quantum attacks.",
            "correctAnswer": 1
          }
        ],
        "notes": [
          {
            "id": "quantum-computing-u5-notes",
            "title": "Unit V: Study Notes",
            "docUrl": "https://gjayasuma.github.io/QC/pdfs/Study-Notes-Unit-5.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Study-Notes-Unit-5.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Complete study notes for Quantum Computing Applications and Emerging Trends."
          },
          {
            "id": "quantum-computing-u5-worksheet",
            "title": "Unit V: Worksheet",
            "docUrl": "https://gjayasuma.github.io/QC/pdfs/Worksheet-Unit-5.pdf",
            "embedUrl": "https://gjayasuma.github.io/QC/pdfs/Worksheet-Unit-5.pdf",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Practice worksheet for Quantum Computing Applications and Emerging Trends."
          }
        ],
        "videos": [],
        "duration": "5 Hours",
        "syllabus": "1. Quantum Key Distribution (BB84, E91)\n2. Post-Quantum Cryptography\n3. Quantum Machine Learning\n4. Optimization and Quantum Annealing\n5. Quantum Chemistry\n6. Industry and Careers",
        "description": "Topics: Quantum Key Distribution (BB84, E91), Post-Quantum Cryptography, Quantum Machine Learning, Optimization and Quantum Annealing, Quantum Chemistry, Industry and Careers",
        "learningOutcomes": "Explain how QKD detects eavesdropping\nContrast quantum cryptography with post-quantum cryptography\nIdentify application areas and career paths in quantum computing",
        "referenceMaterials": "Course Study Notes, Slides & Worksheets by Prof. G. Jaya Suma (github.com/gjayasuma/QC)"
      }
    ],
    "glowColor": "rgba(59, 130, 246, 0.4)",
    "description": "5-unit B.Tech course (Dept. of IT, JNTUGV-CEV): qubits, gates & circuits, quantum algorithms, Qiskit programming and applications."
  },
  {
    "id": "quantum-ai",
    "name": "Quantum AI",
    "icon": "🔮",
    "description": "Quantum Artificial Intelligence & QML: parameterized quantum circuits (PQC), quantum neural networks (QNN), variational quantum classifiers (VQC), quantum kernels, and hybrid classical-quantum models.",
    "color": "from-purple-600 to-violet-800",
    "glowColor": "rgba(147, 51, 234, 0.4)",
    "modules": [
      {
        "id": "unit-1",
        "name": "Unit I: Quantum AI Foundations & State Encodings",
        "description": "Topics: Intersection of Quantum Computing & AI, Quantum Speedup Paradigms, Data Encoding (Basis, Amplitude, Angle, Hamiltonian), Quantum Feature Maps",
        "syllabus": "1. What is Quantum Artificial Intelligence? The Four Quadrants of QML (CC, CQ, QC, QQ)\n2. Quantum Advantages in Machine Learning: Query Complexity, Optimization, and Sample Complexity\n3. Classical-to-Quantum Data Encoding Strategies\n4. Basis Encoding: Embedding Binary Strings into Computational Basis States\n5. Amplitude Encoding: Exponential Feature Compression in Quantum State Amplitudes\n6. Angle / Qubit Encoding & Quantum Feature Maps in High-Dimensional Hilbert Spaces",
        "learningOutcomes": "Classify quantum machine learning approaches across the classical/quantum data and algorithm spectrum\nCompare basis, amplitude, and angle encodings by qubit overhead and circuit preparation depth\nMap classical multidimensional feature vectors into non-linear quantum Hilbert spaces",
        "duration": "8 Hours",
        "referenceMaterials": "Supervised Learning with Quantum Computers (Maria Schuld & Francesco Petruccione, Springer)",
        "videos": [
          {
            "id": "vid-qai-1",
            "title": "Unit 1: Foundations of Quantum AI & State Encodings",
            "url": "https://www.youtube.com/embed/J8Eh7RqggsU",
            "duration": "19m",
            "description": "Introduction to Quantum Machine Learning, quantum feature maps, and state encoding techniques."
          }
        ],
        "notes": [
          {
            "id": "note-qai-1",
            "title": "Unit 1: Quantum AI & Encodings Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Mathematical formulations of basis encoding, amplitude state normalization, and angle rotational matrices."
          }
        ],
        "ppts": [
          {
            "id": "ppt-qai-1",
            "title": "Unit 1: Quantum State Encodings Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Lecture slides covering quantum speedups, Hilbert space mappings, and feature encoding circuits.",
            "slideCount": "34 Slides"
          }
        ],
        "quiz": [
          {
            "question": "How many classical real-valued features can be encoded into n qubits using Amplitude Encoding?",
            "options": [
              "n features",
              "2 * n features",
              "2^n features",
              "n^2 features"
            ],
            "correctAnswer": 2,
            "explanation": "An n-qubit state vector has 2^n complex amplitudes, allowing exponential compression of up to 2^n normalized features."
          },
          {
            "question": "What is the primary trade-off of Angle Encoding compared to Amplitude Encoding?",
            "options": [
              "Angle encoding requires 1 qubit per feature (linear qubit scaling) but uses shallow depth circuits without complex state preparation",
              "Angle encoding is mathematically impossible",
              "Angle encoding destroys superposition permanently",
              "Angle encoding requires infinite qubits"
            ],
            "correctAnswer": 0,
            "explanation": "Angle encoding encodes one feature per qubit rotational angle, requiring n qubits for n features but with O(1) circuit depth."
          }
        ]
      },
      {
        "id": "unit-2",
        "name": "Unit II: Parameterized Quantum Circuits & VQC",
        "description": "Topics: Parameterized Quantum Circuits (PQC), Variational Ansatz, Cost Functions, Parameter Shift Rule, Hybrid Optimization (COBYLA, Adam)",
        "syllabus": "1. Parameterized Quantum Circuits (PQC) as Trainable Machine Learning Models\n2. Ansatz Design: Hardware-Efficient Ansatz vs Physically-Motivated Ansatz\n3. Variational Quantum Classifiers (VQC): Architecture, Expectation Values, and Loss Functions\n4. Analytic Gradient Computation on Quantum Hardware: The Parameter Shift Rule\n5. Hybrid Classical-Quantum Optimization Loops: Gradient-Free (COBYLA, SPSA) and Gradient-Based (Adam)\n6. Training Variational Classifiers in PennyLane and Qiskit Machine Learning",
        "learningOutcomes": "Construct Parameterized Quantum Circuits using parameterized rotation gates and entangling layers\nDerive and apply the parameter shift rule to calculate analytic quantum gradients\nImplement hybrid classical-quantum optimization loops for classification tasks",
        "duration": "8 Hours",
        "referenceMaterials": "Machine Learning with Quantum Computers (Schuld & Petruccione) & PennyLane QML Documentation",
        "videos": [
          {
            "id": "vid-qai-2",
            "title": "Unit 2: Parameter Shift Rule & Variational Classifiers",
            "url": "https://www.youtube.com/embed/KuXjwB4LzSA",
            "duration": "22m",
            "description": "Walkthrough of variational quantum classifiers, ansatz construction, and the parameter shift rule."
          }
        ],
        "notes": [
          {
            "id": "note-qai-2",
            "title": "Unit 2: PQC & Parameter Shift Rule Notes",
            "imageUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
            "description": "Mathematical derivation of the parameter shift formula, hardware-efficient ansatz layers, and loss gradients."
          }
        ],
        "ppts": [
          {
            "id": "ppt-qai-2",
            "title": "Unit 2: Variational Quantum Classifiers Slides",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Slide deck on parameterized ansatz design, hybrid training loops, and quantum gradient calculation.",
            "slideCount": "38 Slides"
          }
        ],
        "quiz": [
          {
            "question": "The Parameter Shift Rule allows computing exact gradients on real quantum hardware by:",
            "options": [
              "Using numerical finite differences with delta -> 0",
              "Evaluating the quantum circuit at two shifted parameter values (theta + pi/2) and (theta - pi/2)",
              "Measuring the circuit once at theta = 0",
              "Simulating the state on a classical computer"
            ],
            "correctAnswer": 1,
            "explanation": "The parameter shift rule computes exact analytical gradients by taking two evaluations shifted by +/- pi/2 without numerical approximations."
          },
          {
            "question": "What is the role of the classical optimizer in a Hybrid Classical-Quantum workflow (VQC)?",
            "options": [
              "To measure qubits directly",
              "To update the parameterized circuit rotation angles based on calculated cost gradients",
              "To replace the quantum hardware",
              "To assemble the physical cryostat"
            ],
            "correctAnswer": 1,
            "explanation": "The classical computer receives the quantum expectation value, computes the next parameter step, and updates the circuit angles."
          }
        ]
      },
      {
        "id": "unit-3",
        "name": "Unit III: Quantum Neural Networks & Barren Plateaus",
        "description": "Topics: Quantum Neural Networks (QNN), Quantum Convolutional Neural Networks (QCNN), Barren Plateau Phenomenon, Gradient Vanishing, Mitigation Strategies",
        "syllabus": "1. Architectures of Quantum Neural Networks (QNN)\n2. Quantum Convolutional Neural Networks (QCNN): Translation Invariance & Qubit Reduction\n3. The Barren Plateau Phenomenon: Exponentially Vanishing Gradients in Quantum Cost Landscapes\n4. Root Causes: Random Deep Ansatzes, High Entanglement, and Global Measurement Operators\n5. Mitigation Strategies: Local Cost Functions, Identity Initialization, and Shallow Architecture Design\n6. Expressibility, Entangling Capability, and Trainability of Quantum Models",
        "learningOutcomes": "Design Quantum Convolutional Neural Networks for structured spatial and quantum data\nDiagnose the presence and severity of barren plateaus in variational circuits\nImplement local observables and structured initialization to guarantee trainability",
        "duration": "8 Hours",
        "referenceMaterials": "Cost function dependent barren plateaus in shallow quantum neural networks (Cerezo et al., Nature Communications)",
        "videos": [
          {
            "id": "vid-qai-3",
            "title": "Unit 3: Quantum Neural Networks & Barren Plateaus",
            "url": "https://www.youtube.com/embed/wjZofJX0v4U",
            "duration": "24m",
            "description": "In-depth exploration of QCNN architectures, barren plateau hazards, and trainability solutions."
          }
        ],
        "notes": [
          {
            "id": "note-qai-3",
            "title": "Unit 3: QNN & Barren Plateau Mitigation Notes",
            "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
            "description": "Mathematical proofs of Haar-random gradient concentration, local vs global measurement operators, and QCNN layers."
          }
        ],
        "ppts": [
          {
            "id": "ppt-qai-3",
            "title": "Unit 3: Quantum Neural Networks Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Visual slides on QCNN pooling, convolution operations, and barren plateau avoidance.",
            "slideCount": "36 Slides"
          }
        ],
        "quiz": [
          {
            "question": "What is a Barren Plateau in quantum machine learning optimization landscapes?",
            "options": [
              "A region where the loss is always negative",
              "A phenomenon where the variance of the gradient vanishes exponentially with the number of qubits, preventing training",
              "A bug in the simulator software",
              "A circuit with zero entangling gates"
            ],
            "correctAnswer": 1,
            "explanation": "In barren plateaus, gradient variances decay as O(2^-n), rendering classical gradient optimization ineffective for deep random circuits."
          },
          {
            "question": "Which of the following techniques helps mitigate the barren plateau problem?",
            "options": [
              "Using global cost functions measuring all qubits simultaneously",
              "Using local cost functions that measure only single or adjacent qubits",
              "Making the ansatz deeper and more random",
              "Setting learning rate to infinity"
            ],
            "correctAnswer": 1,
            "explanation": "Cerezo et al. demonstrated that local cost functions preserve non-vanishing polynomial gradients in shallow circuits."
          }
        ]
      },
      {
        "id": "unit-4",
        "name": "Unit IV: Quantum Kernels & Quantum SVMs",
        "description": "Topics: Quantum Kernel Methods, Quantum Feature Maps (ZZFeatureMap), Quantum Fidelity Kernels, Quantum Support Vector Machines (QSVM)",
        "syllabus": "1. Introduction to Kernel Methods & The Kernel Trick in Classical Machine Learning\n2. Quantum Kernel Estimation: Inner Products in Exponential Hilbert Spaces\n3. Quantum Feature Maps: Covariant, Pauli, and ZZFeatureMap Architectures\n4. Estimating Gram Matrices via Quantum State Fidelity: K(x, x) = |<phi(x)|phi(x)>|^2\n5. Quantum Support Vector Machines (QSVM) for Classification\n6. Theoretical Quantum Advantage in Kernel Methods & Classical Simulability Limits",
        "learningOutcomes": "Implement quantum feature maps to evaluate non-linear inner products\nCalculate quantum kernel Gram matrices using swap tests and inversion circuits\nTrain Quantum Support Vector Machines and analyze bounds on classical simulability",
        "duration": "8 Hours",
        "referenceMaterials": "Supervised learning with quantum-enhanced feature spaces (Havlicek et al., Nature 2019)",
        "videos": [
          {
            "id": "vid-qai-4",
            "title": "Unit 4: Quantum Kernel Methods & QSVM",
            "url": "https://www.youtube.com/embed/Ilg3gGewQ5U",
            "duration": "21m",
            "description": "Comprehensive analysis of Quantum Feature Maps, Gram matrices, and Quantum Support Vector Machines."
          }
        ],
        "notes": [
          {
            "id": "note-qai-4",
            "title": "Unit 4: Quantum Kernels & QSVM Notes",
            "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
            "description": "Mathematical derivation of fidelity kernels, ZZ-feature mapping, and dual SVM optimization formulas."
          }
        ],
        "ppts": [
          {
            "id": "ppt-qai-4",
            "title": "Unit 4: Quantum Kernel Methods Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Slides on quantum state fidelity, ZZFeatureMap, Gram matrix computation, and QSVM classification.",
            "slideCount": "37 Slides"
          }
        ],
        "quiz": [
          {
            "question": "In a Quantum Kernel Method, how is the kernel value K(x, x) between two classical data points x and x computed?",
            "options": [
              "By counting the total number of gates",
              "As the fidelity |<phi(x)|phi(x)>|^2 between their quantum state representations",
              "By classical Euclidean distance subtraction",
              "By computing the Fourier transform of the weights"
            ],
            "correctAnswer": 1,
            "explanation": "The quantum kernel measures the transition probability or overlap (fidelity) between the two encoded quantum state vectors."
          },
          {
            "question": "What is the main advantage of Quantum Support Vector Machines over Variational Quantum Classifiers?",
            "options": [
              "QSVMs do not require classical optimization",
              "Quantum kernels convexify the optimization landscape, completely avoiding local minima and barren plateaus during training",
              "QSVMs require zero qubits",
              "QSVMs run without quantum measurements"
            ],
            "correctAnswer": 1,
            "explanation": "Once the quantum kernel matrix is evaluated on hardware, the SVM training is a convex quadratic programming problem with a global optimum."
          }
        ]
      },
      {
        "id": "unit-5",
        "name": "Unit V: Quantum Generative Models & Emerging Applications",
        "description": "Topics: Quantum Generative Adversarial Networks (QGAN), Quantum Boltzmann Machines, Quantum Reinforcement Learning, Applications in Drug Discovery & Finance",
        "syllabus": "1. Quantum Generative Modeling: Learning Probability Distributions on Quantum States\n2. Quantum Generative Adversarial Networks (QGAN): Quantum Generator vs Classical/Quantum Discriminator\n3. Quantum Boltzmann Machines (QBM) & Quantum Annealing Sampling\n4. Quantum Reinforcement Learning (QRL): Parameterized Quantum Policies and Value Functions\n5. Domain Applications: Quantum Chemistry, Molecular Discovery, Financial Portfolio Optimization\n6. The NISQ Era vs Fault-Tolerant Quantum AI: Practical Milestones and Future Outlook",
        "learningOutcomes": "Formulate Quantum GANs for probability distribution loading and synthetic data generation\nUnderstand quantum annealing and thermal sampling in Quantum Boltzmann Machines\nEvaluate industrial use cases and current NISQ limitations in practical quantum artificial intelligence",
        "duration": "8 Hours",
        "referenceMaterials": "Quantum Generative Adversarial Networks (Dallaire-Demers & Killoran) & Nature Reviews Physics QML Surveys",
        "videos": [
          {
            "id": "vid-qai-5",
            "title": "Unit 5: Quantum GANs & Emerging Frontiers of Quantum AI",
            "url": "https://www.youtube.com/embed/aircAruvnKk",
            "duration": "25m",
            "description": "Survey of quantum generative models, QGANs, quantum reinforcement learning, and chemical applications."
          }
        ],
        "notes": [
          {
            "id": "note-qai-5",
            "title": "Unit 5: Quantum Generative AI Notes",
            "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
            "description": "Mathematical formulations of QGAN mini-max objectives, thermal quantum states, and portfolio Hamiltonians."
          }
        ],
        "ppts": [
          {
            "id": "ppt-qai-5",
            "title": "Unit 5: Quantum Generative Models Slide Deck",
            "pptUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/edit",
            "embedUrl": "https://docs.google.com/presentation/d/e/2PACX-1vT17xY_m1v9X0k0b2_H0P93P9Q/embed",
            "description": "Slides on QGANs, quantum financial optimization, drug discovery, and fault-tolerant roadmaps.",
            "slideCount": "39 Slides"
          }
        ],
        "quiz": [
          {
            "question": "What is the role of a Quantum Generator in a Quantum Generative Adversarial Network (QGAN)?",
            "options": [
              "To compile Python code to machine binary",
              "To generate a quantum state whose measurement statistics approximate a target probability distribution",
              "To detect classical spam emails",
              "To calculate classical hash functions"
            ],
            "correctAnswer": 1,
            "explanation": "The quantum generator uses parameterized gates to create states matching the statistical distribution of real training data."
          },
          {
            "question": "Which industrial application is considered one of the earliest and most natural domains for Quantum AI advantage?",
            "options": [
              "Simulating quantum molecular chemistry and materials design",
              "Sorting alphabetical text files",
              "Drawing 2D web icons",
              "Managing simple spreadsheets"
            ],
            "correctAnswer": 0,
            "explanation": "Because molecules are inherently governed by quantum mechanics, quantum processors naturally simulate molecular interactions and drug candidate bonds."
          }
        ]
      }
    ]
  }
];

export const QC_COURSE = DEFAULT_DOMAINS.find((c) => c.id === "quantum-computing")!;
export const DS_COURSE = DEFAULT_DOMAINS.find((c) => c.id === "data-science")!;
export const IOT_COURSE = DEFAULT_DOMAINS.find((c) => c.id === "iot-internet-of-things")!;
