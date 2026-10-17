import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Award,
  BookOpen,
  Users,
  Trophy,
  Briefcase,
  GraduationCap,
  FolderGit2,
  ArrowRight,
  Globe,
  ArrowUpDown,
  ChevronDown,
  Clock,
  Search,
  Filter,
  Calendar
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// 1️⃣ ADD JSON IMPORTS (TOP OF FILE)
import facultyDevelopmentProgramsJSON from "@/data/faculty_development_programs.json";
import publicationsRecognitionJSON from "@/data/publications_recognition.json";

const EducationPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [facultyDevelopmentPrograms, setFacultyDevelopmentPrograms] = useState<
    {
      title: string;
      organizer: string;
      duration: string;
      description: string;
      year: number;
    }[]
  >([]);
  const [publicationsRecognition, setPublicationsRecognition] = useState<
    {
      title: string;
      description?: string;
      year?: number;
      issued_by?: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("latest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 2️⃣ ADD SUPABASE SAFETY CHECK
  const isSupabaseEnabled =
    !!import.meta.env.VITE_SUPABASE_URL &&
    !!import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !!supabase;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 3️⃣ REPLACE useEffect(fetchEducationData) with DB + JSON FALLBACK
  useEffect(() => {
    const fetchEducationData = async () => {
      setIsLoading(true);

      try {
        if (!isSupabaseEnabled) {
          throw new Error("Supabase not available");
        }

        const { data: fdps, error: fdpError } = await supabase
          .from("faculty_development_programs")
          .select("title, organizer, duration, description, year")
          .order("year", { ascending: false });

        if (fdpError) throw fdpError;

        const { data: pubsRec, error: pubsRecError } = await supabase
          .from("publications_recognition")
          .select("title, description, year, issued_by")
          .order("year", { ascending: false });

        if (pubsRecError) throw pubsRecError;

        setFacultyDevelopmentPrograms(fdps || []);
        setPublicationsRecognition(pubsRec || []);

      } catch (error) {
        console.warn("Supabase connection issue → loading Education data from JSON fallback", error);

        // ✅ JSON fallback
        setFacultyDevelopmentPrograms(facultyDevelopmentProgramsJSON || []);
        setPublicationsRecognition(publicationsRecognitionJSON || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducationData();
  }, [isSupabaseEnabled]);

  // Hardcoded Session Chairs
  const sessionChairs = [
    "Awarded Certificate of Appreciation for instrumental role as Active SPOC for NPTEL Online Course, IIT Madras during Jul-Dec 2017 semester.",
    "Contributed as Chaired a Technical Sessions for International Conference 'Computational Intelligence and Soft Computing' December 19th-20th 2015.",
    "Contributed as Reviewer to International Conference on Computational Intelligence and Soft Computing, December 19th-20th 2015.",
    "Contributed as Session Chair for International conference on Smart Technologies in Data Science and Communication (SmartDSC-2017) held at Vignan's Institute of Information Technology, Vizag-India from 30th November to 2nd December 2017.",
    "Contributed as Judge for the event Code chef for Digital India Week July 20th-25th 2015.",
  ];

  const academicContributions = [
    {
      category: "Specialization",
      items: [
        "Artificial Intelligence",
        "Data Mining",
        "Machine Learning",
        "Deep Learning",
        "Soft Computing",
        "Internet of Things",
      ],
    },
    {
      category: "Publications & Recognition",
      items: [], // Populated via useEffect
    },
    {
      category: "Board Positions",
      items: [
        "Chairperson BOS, Dept. of Information Technology (2017-2022)",
        "Member of Board of Studies for 3 years (2007-2010) in the Dept of CSE, GIT, GITAM University",
        "Chairperson for Board of Studies for PG Courses from June 2017 JNTUK, University College of Engineering (A), Department of Information Technology",
        "Chairperson for Board of Studies for UG Courses from June 2017 JNTUK, University College of Engineering (A), Department of Information Technology",
        "Board of Studies (BOS) Member of Swarnandhra College of Engineering & Technology (SCET) for the Department of Information Technology, from 4-01-2018",
      ],
    },
    {
      category: "Research Guidance (Ph.D. Awarded)",
      items: [
        "Guided 6 PhDs & Eight Scholars are currently working for PhD",
        "RVS Lalitha (Roll No. 09022P0544) – Ph.D. thesis titled “Vehicular Ad Hoc Networks: Pile-ups in Data Dissemination”, awarded in March 2017 under the Department of CSE, JNTUK, Kakinada.",
        "Mrs. P. Aruna Kumari (Roll No. 3022P0506) – Ph.D. thesis titled “Design and Development of Efficient Feature Selection Mechanisms at Feature Level in Multimodal Biometric System for Person Identification”, awarded in November 2020 under the Department of CSE, JNTUK, Kakinada.",
        "Ms. S. Sureka (Roll No. 13022P0507) – Ph.D. thesis titled “A Machine Learning Framework for Early Risk Prediction of Diabetes Comorbidity in Thyroid Patients”, awarded in July 2021 under the Department of CSE, JNTUK, Kakinada.",
        "Ms. N. Jayalakshmi (Roll No. 13022P0604) – Awarded Ph.D. in Computer Science for the thesis titled “An Interesting Subgraph Mining Approach to Design a Web Page Recommendation System using Web Log Data”, on 18th October 2021 under the Department of CSE, JNTUK, Kakinada.",
        "Mrs. Kovvuri N. Bhargavi (Roll No. 15022P0516) – Awarded Ph.D. in Computer Science and Engineering for the thesis titled “A Framework for Decision Making in Weather Prediction Using Artificial Intelligence”, on 17th July 2023 under the Department of CSE, JNTUK, Kakinada.",
        "Mrs. Gorli L. Aruna Kumari (Roll No. 13022P0605) – Awarded Ph.D. in Computer Science for the thesis titled “Design and Analysis of an Improved Diabetes Mellitus Prediction Using Deep Neural Network”, on 26th July 2023 under the Department of CSE, JNTUK, Kakinada."
      ],
    },
  ];

  const administrationContributions = [
    {
      category: "Leadership Roles",
      items: [
        "Professor, Department of Information Technology, JNTU-GV, from March 2026 to till date",
        "Registrar, JNTU-GV, from 03-08-2023 to March 2026",
        "Head, Department of Information Technology, JNTUK, University College of Engineering (A), from 25th September 2014 to till date",
        "Member of College Academic Council JNTUK, University College of Engineering (A), 13-07-2017 to till date",
      ],
    },
    {
      category: "Committee Positions",
      items: [
        "Nominated as Single Point of Contact (SPOC) for NPTEL Local Chapter in JNTUK, University College of Engineering (A), VZM from July 2017 to till date",
        "Convener for Women Empowerment & Grievance Cell, JNTUK, University College of Engineering (A) from September 2017 to Till Date",
        "Secretary & Member for Women Empowerment & Grievance Cell from January 2014-August 2017",
        "Coordinator for SC/ST cell from January 2014-April 2017",
        "Convener for Fact finding Committee every year provisional affiliation of private college under JNTUK",
        "Member for Research Centre Committee for every year inspection for research centers in departments of affiliated colleges of JNTUK",
        "Member for permanent affiliation (FFC) for affiliated colleges of JNTUK",
        "Coordinator for MOOCs (Massive Online Courses) from 2015-till date",
        "Committee Member for Research Centre Inspection to affiliated college of JNTUK and nominated by JNTUK",
        "Expert Member of the Interview Committee for Selection of Faculty (Ratification) in the CSSE for the Affiliated Colleges in JNTUK",
        "Committee member for Tenders opening related University College of Engineering-VZM",
        "Anti-Ragging committee member - Girls Hostel - Every year - University College of Engineering",
        "Governing Body Member & Nominee of JNTUK to DADI Institute of Engineering & Technology",
        "Appointed as Coordinating Officer's for NAAC work related to University College Of Engineering, VZM",
        "Appointed as Convener for Selection Committee of Adhoc Lecturer, University college of Engineering-VZM",
        "Appointed as Projects Coordinator for PG Courses (M.Tech (IT) & MCA) - till date",
      ],
    },
    {
      category: "Previous Institutional Roles (GITAM University)",
      items: [
        "Departmental Library committee member in the Department of CS&E, GIT, GITAM University",
        "Member of Proctorial Board (2008-Dec 2012) in the Dept of CSE, GIT, GITAM University",
        "One of project Nodal Officer for Equity Assurance Unit (finishing school) TEQIP-II Programme, 2012",
        "Academic Course Coordinator for II/IV B.Tech CSE (2008-2009) in the Dept of CSE, GIT, GITAM University",
        "Project Coordinator for IV/IV B.Tech CSE (2008-2009) in the Dept of CSE, GIT, GITAM University",
        "Academic Course Coordinator for IV/IV B.Tech (CSE) (2011-2012) Dept of CSE, GIT, GITAM University",
        "Girls Hostel Coordinator for Department of Computer Science and Engineering, GITAM Institute of Technology, GITAM University from 2011-2012",
        "Consultancy, Projects & Collaborations (CPC) Coordinator for Department of Computer Science and Engineering, GITAM Institute of Technology, GITAM University from 2011-Jan 2013",
        "Time Table In-Charge for Department of Computer Science and Engineering, GITAM Institute of Technology, GITAM University from 2011-2013",
        "Member of Vigilance Committee from July 2008 to 2012",
      ],
    },
    {
      category: "Examination & Election Duties",
      items: [
        "Appointed as Special Observer for EAMCET & ECET Examination",
        "Appointed as Observer for EAMCET",
        "Appointed as Chief Superintendent CENTRE-D FOR APSLPRB-2016 Examination at University College of Engineering, JNTUK-VZM",
        "Flying Squad Members to make Ragging Free Campus",
        "Appointed as a Presiding Officer in Parvathipuram on 23/7/2013 for Andhra Pradesh Panchayat Raj Election",
      ],
    },
  ];

  const professionalContributions = [
    {
      category: "Professional Memberships",
      items: [
        "Member of Computer Society of India (CSI) – ID: 01170956",
        "Senior Fellow of IEEE – Membership ID: 92245858",
        "Life Member of Indian Society for Technical Education (ISTE) – ID: LM44520",
        "Faculty Sponsor of IEEE Women in Engineering (WIE)",
        "Faculty Sponsor of ACM Chapter",
        "Fellow Member of The Institution of Engineers (India)",
      ],
    },
    {
      category: "International Engagement",
      items: [
        "Visited USA twice (2009, 2019) to present research papers and chair technical sessions",
        "Visited Malaysia (2016) to present research papers and chair technical sessions",
      ],
    },
    {
      category: "Book Publications",
      items: [
        "Author of a book titled 'Artificial Intelligence & Machine Learning' – Published by GCS Publishers India, 2022",
        "FGANN: A Hybrid Approach for Medical Diagnosing – International Conference on Computational Intelligence and Big Data Analytics, Springer, December 2018",
        "Swarm Intelligence and Variable Precision Rough Set Model: A Hybrid Approach for Classification – Computational Intelligence Techniques in Health Care, Springer Briefs in Applied Sciences and Technology, 2016",
        "A Comparative Study of Various Minutiae Extraction Methods for Fingerprint Recognition Based on Score Level Fusion – Application of Computational Intelligence to Biology, Springer Briefs in Applied Sciences and Technology, 2016",
        "Vehicular Ad Hoc Networks: Trimming Pile-Ups in Data Dissemination Using HTPVANET Algorithm – Springer India, 2016"
      ],
    },
  ];

  // Helper functions for parsing years from contribution texts and objects
  const extractYearsFromString = (text: string): number[] => {
    if (!text) return [];
    const matches = text.match(/\b(19\d\d|20\d\d)\b/g);
    return matches ? matches.map(Number) : [];
  };

  const getItemLatestYear = (item: any): number => {
    if (!item) return 0;
    if (typeof item === "number") return item;
    if (typeof item === "string") {
      if (/till date|present/i.test(item)) return 2026;
      const years = extractYearsFromString(item);
      return years.length > 0 ? Math.max(...years) : 0;
    }
    if (typeof item === "object") {
      if (typeof item.year === "number") return item.year;
      if (item.year) {
        const p = parseInt(String(item.year), 10);
        if (!isNaN(p)) return p;
      }
      const combined = `${item.title || ""} ${item.description || ""} ${item.duration || ""}`;
      const years = extractYearsFromString(combined);
      return years.length > 0 ? Math.max(...years) : 0;
    }
    return 0;
  };

  const getItemEarliestYear = (item: any): number => {
    if (!item) return 9999;
    if (typeof item === "number") return item;
    if (typeof item === "string") {
      const years = extractYearsFromString(item);
      return years.length > 0 ? Math.min(...years) : 9999;
    }
    if (typeof item === "object") {
      if (typeof item.year === "number") return item.year;
      if (item.year) {
        const p = parseInt(String(item.year), 10);
        if (!isNaN(p)) return p;
      }
      const combined = `${item.title || ""} ${item.description || ""} ${item.duration || ""}`;
      const years = extractYearsFromString(combined);
      return years.length > 0 ? Math.min(...years) : 9999;
    }
    return 9999;
  };

  const sortContributionItems = <T,>(items: T[], order: string): T[] => {
    if (order === "default") return items;
    return [...items].sort((a, b) => {
      if (order === "latest") {
        const yearA = getItemLatestYear(a);
        const yearB = getItemLatestYear(b);
        if (yearA > 0 && yearB > 0) return yearB - yearA;
        if (yearA > 0) return -1;
        if (yearB > 0) return 1;
        return 0;
      }
      if (order === "oldest") {
        const yearA = getItemEarliestYear(a);
        const yearB = getItemEarliestYear(b);
        if (yearA < 9999 && yearB < 9999) return yearA - yearB;
        if (yearA < 9999) return -1;
        if (yearB < 9999) return 1;
        return 0;
      }
      return 0;
    });
  };

  const extractDisplayYearBadge = (item: any): string | null => {
    if (typeof item === "object") {
      if (item.year) return String(item.year);
    }
    if (typeof item === "string") {
      if (/till date|present/i.test(item)) {
        const match = item.match(/\b(19\d\d|20\d\d)\b/);
        return match ? `${match[0]}–Present` : "Present";
      }
      const rangeMatch = item.match(/\b(19\d\d|20\d\d)\s*[-–]\s*(19\d\d|20\d\d)\b/);
      if (rangeMatch) return rangeMatch[0];
      const singleMatch = item.match(/\b(19\d\d|20\d\d)\b/);
      if (singleMatch) return singleMatch[0];
    }
    return null;
  };

  // Filter items matching search
  const matchesSearch = (item: any): boolean => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    if (typeof item === "string") return item.toLowerCase().includes(q);
    if (typeof item === "object") {
      return (
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.organizer && item.organizer.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.issued_by && item.issued_by.toLowerCase().includes(q)) ||
        (item.year && String(item.year).includes(q))
      );
    }
    return true;
  };

  // Memoized sorted lists
  const sortedFDPs = useMemo(() => {
    const filtered = facultyDevelopmentPrograms.filter(matchesSearch);
    return sortContributionItems(filtered, sortBy);
  }, [facultyDevelopmentPrograms, sortBy, searchQuery]);

  const sortedSessionChairs = useMemo(() => {
    const filtered = sessionChairs.filter(matchesSearch);
    return sortContributionItems(filtered, sortBy);
  }, [sessionChairs, sortBy, searchQuery]);

  const sortedPubsRecognition = useMemo(() => {
    const filtered = publicationsRecognition.filter(matchesSearch);
    return sortContributionItems(filtered, sortBy);
  }, [publicationsRecognition, sortBy, searchQuery]);

  const sortedAcademicContributions = useMemo(() => {
    return academicContributions.map((section) => ({
      ...section,
      items: sortContributionItems(section.items.filter(matchesSearch), sortBy),
    }));
  }, [academicContributions, sortBy, searchQuery]);

  const sortedAdministrationContributions = useMemo(() => {
    return administrationContributions.map((section) => ({
      ...section,
      items: sortContributionItems(section.items.filter(matchesSearch), sortBy),
    }));
  }, [administrationContributions, sortBy, searchQuery]);

  const sortedProfessionalContributions = useMemo(() => {
    return professionalContributions.map((section) => ({
      ...section,
      items: sortContributionItems(section.items.filter(matchesSearch), sortBy),
    }));
  }, [professionalContributions, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-cream-dark to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container-wide px-6 lg:px-12 relative z-10">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 animate-fade-in">
              Learning & Contributions
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in-delay">
              Professional development and academic service excellence
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary"></div>
        <div className="container-wide px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: "30+", label: "Workshops Organized", icon: Users, delay: "0" },
              { number: "50+", label: "Workshops Attended", icon: BookOpen, delay: "100" },
              { number: "5+", label: "PhDs Guided", icon: GraduationCap, delay: "200" },
              { number: "50+", label: "Journal Publications", icon: Award, delay: "300" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className="text-center transform transition-all duration-500 hover:scale-110 animate-fade-in"
                  style={{ animationDelay: `${item.delay}ms` }}
                >
                  <Icon className="w-8 h-8 text-primary-foreground/70 mx-auto mb-3" />
                  <p className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-1 animate-count-up">
                    {item.number}
                  </p>
                  <p className="text-primary-foreground/70 text-sm">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guided Projects & Innovation Showcase Section */}
      <section className="py-12 bg-accent/5 border-b border-border/40">
        <div className="container-wide px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Projects Hub Card */}
            <div className="p-7 rounded-2xl bg-card border border-border/80 shadow-md flex flex-col justify-between group hover:border-accent/50 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-accent/15 text-accent">
                    <FolderGit2 size={24} />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent">
                    Live Prototypes
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                  Department & Guided Projects
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Explore academic, student, and research projects mentored under Dr. G. Jaya Suma with full developer profiles, GitHub repositories, and live links.
                </p>
              </div>
              <Link
                to="/projects"
                className="inline-flex items-center justify-between px-5 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all"
              >
                <span>Browse Guided Projects</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* QLearn Platform Card */}
            <div className="p-7 rounded-2xl bg-card border border-border/80 shadow-md flex flex-col justify-between group hover:border-amber-500/50 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <Globe size={24} />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    jayasuma.com/qlearn
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-primary mb-2 group-hover:text-amber-600 transition-colors">
                  QLearn AI & Quantum Platform
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Interactive domain roadmaps, lecture modules, word connect puzzles, and real-time live rank leaderboards for learners and research scholars.
                </p>
              </div>
              <Link
                to="/qlearn"
                className="inline-flex items-center justify-between px-5 py-3 rounded-xl bg-accent text-accent-foreground text-xs font-bold hover:bg-accent/90 transition-all"
              >
                <span>Visit QLearn Interactive Platform</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sort & Filter Controls Bar */}
      <section className="py-6 bg-card/70 border-y border-border/80 sticky top-16 z-30 backdrop-blur-md shadow-xs">
        <div className="container-wide px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <span className="p-2 rounded-lg bg-accent/15 text-accent">
              <Filter size={18} />
            </span>
            <div>
              <span className="font-serif text-base md:text-lg font-bold text-primary block">
                Contributions & Service Portfolio
              </span>
              <span className="text-xs text-muted-foreground">
                Chronological Academic, Administrative, and Research Records
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search contributions, BOS, IEEE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 text-foreground placeholder:text-muted-foreground/70 shadow-xs"
              />
            </div>

            {/* Sort By Dropdown */}
            <div className="relative w-full sm:w-60">
              <ArrowUpDown size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-xs md:text-sm bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 text-foreground shadow-xs appearance-none cursor-pointer font-medium hover:border-accent/40 transition-colors"
                aria-label="Sort contributions"
              >
                <option value="latest">Sort: Latest First (Chronological)</option>
                <option value="oldest">Sort: Oldest First (Chronological)</option>
                <option value="default">Sort: Default Curated Order</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Learning & Professional Development */}
      <section className="section-padding">
        <div className="container-wide px-6 lg:px-12">
          <SectionHeading
            title="Learning & Professional Development"
            subtitle="Continuous learning and skill enhancement initiatives"
          />

          <div className="space-y-12">
            {/* Faculty Development Programs */}
            <div className="animate-slide-in-left">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-accent" />
                  <h3 className="font-serif text-2xl font-bold text-primary">
                    Faculty Development Programs
                  </h3>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                  <Clock size={12} />
                  <span>
                    {sortBy === "latest" ? "Sorted: Latest First" : sortBy === "oldest" ? "Sorted: Oldest First" : "Default Order"}
                  </span>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : sortedFDPs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No programs found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {sortedFDPs.map((program, index) => (
                    <div
                      key={index}
                      className="group flex items-start justify-between gap-3 p-5 bg-card rounded-lg border border-border hover:border-accent hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2 group-hover:scale-150 transition-transform duration-300" />
                        <div className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                          <p>
                            Participated in faculty development programme on{" "}
                            <strong className="text-foreground">{program.title}</strong>
                            {program.organizer && (
                              <> conducted by <strong className="text-foreground">{program.organizer}</strong></>
                            )}
                            {program.duration && <> ({program.duration})</>}
                          </p>
                          {program.description && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              {program.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {program.year && (
                        <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/25">
                          {program.year}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Session Chairs & Recognition */}
            <div className="animate-slide-in-right">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-accent" />
                  <h3 className="font-serif text-2xl font-bold text-primary">
                    Session Chairs & Recognition
                  </h3>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                  <Clock size={12} />
                  <span>
                    {sortBy === "latest" ? "Sorted: Latest First" : sortBy === "oldest" ? "Sorted: Oldest First" : "Default Order"}
                  </span>
                </div>
              </div>

              {sortedSessionChairs.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No session chair records match your search.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {sortedSessionChairs.map((chair, index) => {
                    const badge = extractDisplayYearBadge(chair);
                    return (
                      <div
                        key={index}
                        className="group flex items-start justify-between gap-3 p-5 bg-gradient-to-r from-card to-card/50 rounded-lg border border-border hover:border-accent hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <Award className="w-5 h-5 text-accent flex-shrink-0 mt-1 group-hover:rotate-12 transition-transform duration-300" />
                          <p className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                            {chair}
                          </p>
                        </div>
                        {badge && (
                          <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/25">
                            {badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contributions Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-6 lg:px-12">
          <SectionHeading
            title="Contributions"
            subtitle="Academic, administrative, and professional service"
          />

          <div className="space-y-12">
            {/* Academic Contributions */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-10 h-10 text-accent" />
                  <h3 className="font-serif text-3xl font-bold text-primary">
                    Academic Contributions
                  </h3>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                  <Clock size={12} />
                  <span>
                    {sortBy === "latest" ? "Sorted: Latest First" : sortBy === "oldest" ? "Sorted: Oldest First" : "Default Order"}
                  </span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {sortedAcademicContributions.map((section, index) => (
                  <div 
                    key={index} 
                    className="space-y-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                      <h4 className="font-serif text-xl font-semibold text-primary">
                        {section.category}
                      </h4>
                      <span className="text-xs font-medium text-accent">
                        {section.category === "Publications & Recognition" ? sortedPubsRecognition.length : section.items.length} items
                      </span>
                    </div>

                    <div className="space-y-3">
                      {section.category === "Publications & Recognition" ? (
                        isLoading ? (
                          <div className="text-center py-4 text-muted-foreground text-sm">Loading...</div>
                        ) : sortedPubsRecognition.length === 0 ? (
                          <div className="text-center py-4 text-muted-foreground text-sm">No records match criteria.</div>
                        ) : (
                          sortedPubsRecognition.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="group flex items-start justify-between gap-3 p-4 bg-card rounded-lg border border-border hover:border-accent hover:shadow-md transition-all duration-300 transform hover:-translate-x-1"
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2 group-hover:scale-150 transition-transform duration-300" />
                                <div className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                                  <p>
                                    {item.title}
                                    {item.issued_by && ` - ${item.issued_by}`}
                                  </p>
                                  {item.description && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {item.year && (
                                <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                                  {item.year}
                                </span>
                              )}
                            </div>
                          ))
                        )
                      ) : section.items.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground text-sm">No items match your search.</div>
                      ) : (
                        section.items.map((item, itemIndex) => {
                          const badge = extractDisplayYearBadge(item);
                          return (
                            <div
                              key={itemIndex}
                              className="group flex items-start justify-between gap-3 p-4 bg-card rounded-lg border border-border hover:border-accent hover:shadow-md transition-all duration-300 transform hover:-translate-x-1"
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2 group-hover:scale-150 transition-transform duration-300" />
                                <p className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                                  {item}
                                </p>
                              </div>
                              {badge && (
                                <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25 whitespace-nowrap">
                                  {badge}
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Administration Contributions */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-10 h-10 text-accent" />
                  <h3 className="font-serif text-3xl font-bold text-primary">
                    Administration Contributions
                  </h3>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                  <Clock size={12} />
                  <span>
                    {sortBy === "latest" ? "Sorted: Latest First" : sortBy === "oldest" ? "Sorted: Oldest First" : "Default Order"}
                  </span>
                </div>
              </div>
              
              {/* Leadership Roles (Top Category) */}
              {sortedAdministrationContributions[0] && (
                <div className="mb-8 animate-fade-in-up">
                  <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg border-l-4 border-accent mb-4">
                    <h4 className="font-serif text-xl font-semibold text-primary">
                      {sortedAdministrationContributions[0].category}
                    </h4>
                    <span className="text-xs font-medium text-accent">
                      {sortedAdministrationContributions[0].items.length} positions
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sortedAdministrationContributions[0].items.map((item, itemIndex) => {
                      const badge = extractDisplayYearBadge(item);
                      return (
                        <div
                          key={itemIndex}
                          className="group flex flex-col justify-between p-5 bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg border border-accent/30 hover:border-accent hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <Briefcase className="w-5 h-5 text-accent flex-shrink-0 mt-1 group-hover:rotate-12 transition-transform duration-300" />
                            <p className="text-sm text-foreground/90 leading-relaxed font-medium group-hover:text-foreground transition-colors">
                              {item}
                            </p>
                          </div>
                          {badge && (
                            <div className="mt-auto pt-2 border-t border-accent/20 flex justify-end">
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                                {badge}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Other Administration Categories (Committees, Roles, Duties) */}
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {sortedAdministrationContributions.slice(1).map((section, index) => (
                  <div key={index} className="space-y-4 animate-fade-in-up">
                    <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                      <h4 className="font-serif text-xl font-semibold text-primary">
                        {section.category}
                      </h4>
                      <span className="text-xs font-medium text-accent">
                        {section.items.length} items
                      </span>
                    </div>
                    <div className="space-y-3">
                      {section.items.map((item, itemIndex) => {
                        const badge = extractDisplayYearBadge(item);
                        return (
                          <div
                            key={itemIndex}
                            className="group flex items-start justify-between gap-3 p-4 bg-card rounded-lg border border-border hover:border-accent hover:shadow-md transition-all duration-300 transform hover:-translate-x-1"
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2 group-hover:scale-150 transition-transform duration-300" />
                              <p className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                                {item}
                              </p>
                            </div>
                            {badge && (
                              <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25 whitespace-nowrap">
                                {badge}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Contributions */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Users className="w-10 h-10 text-accent" />
                  <h3 className="font-serif text-3xl font-bold text-primary">
                    Professional Contributions
                  </h3>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                  <Clock size={12} />
                  <span>
                    {sortBy === "latest" ? "Sorted: Latest First" : sortBy === "oldest" ? "Sorted: Oldest First" : "Default Order"}
                  </span>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {sortedProfessionalContributions.map((section, index) => (
                  <div key={index} className="space-y-4 animate-fade-in-up">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border-l-4 border-accent">
                      <h4 className="font-serif text-xl font-semibold text-primary">
                        {section.category}
                      </h4>
                      <span className="text-xs font-medium text-accent">
                        {section.items.length} items
                      </span>
                    </div>
                    <div className="space-y-3">
                      {section.items.map((item, itemIndex) => {
                        const badge = extractDisplayYearBadge(item);
                        return (
                          <div
                            key={itemIndex}
                            className="group flex items-start justify-between gap-3 p-4 bg-card rounded-lg border border-border hover:border-accent hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <Trophy className="w-4 h-4 text-accent flex-shrink-0 mt-1 group-hover:rotate-12 transition-transform duration-300" />
                              <p className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                                {item}
                              </p>
                            </div>
                            {badge && (
                              <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25 whitespace-nowrap">
                                {badge}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Expertise */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        <div className="container-narrow px-6 lg:px-12 relative z-10">
          <SectionHeading
            title="Areas of Expertise"
            subtitle="Specialized knowledge and research domains"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Artificial Intelligence", icon: "🤖" },
              { name: "Machine Learning", icon: "🧠" },
              { name: "Deep Learning", icon: "🔬" },
              { name: "Data Mining", icon: "⛏️" },
              { name: "Soft Computing", icon: "💻" },
              { name: "Internet of Things", icon: "🌐" },
              { name: "Block Chain Technology", icon: "⛓️" },
              { name: "Cyber Security", icon: "🔒" },
              { name: "Cloud Computing", icon: "☁️" },
              { name: "Python Programming", icon: "🐍" },
              { name: "GIS & Remote Sensing", icon: "🛰️" },
              { name: "Data Science", icon: "📊" },
            ].map((expertise, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 p-5 bg-card rounded-lg border border-border hover:border-accent hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up cursor-pointer"
              >
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">
                  {expertise.icon}
                </span>
                <span className="text-foreground/80 font-medium group-hover:text-foreground transition-colors">
                  {expertise.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EducationPage;
