import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  Linkedin,
  Sparkles,
  Search,
  Code2,
  Users,
  Layers,
  Globe,
  Rocket,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Calendar,
  Share2,
  Check,
  X,
  Copy,
  Info
} from "lucide-react";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import defaultProjectsJSON from "@/data/projects.json";

export interface Developer {
  name: string;
  role: string;
  photo_url?: string;
  linkedin_url?: string;
  github_url?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category: string;
  live_url?: string;
  github_url?: string;
  image_url?: string;
  tags?: string[];
  status?: string;
  featured?: boolean;
  year?: string | number;
  developers?: Developer[];
  created_at?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [isLoading, setIsLoading] = useState(true);

  // Deep linking and share modal states
  const [searchParams, setSearchParams] = useSearchParams();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [spotlightProject, setSpotlightProject] = useState<ProjectItem | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Collapsible dropdown state for project cards (Name & Link shown by default, click to view details)
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  const toggleProjectExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedProjects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Read URL query parameter for shared project (?project=ID or ?id=ID)
  const sharedParam = searchParams.get("project") || searchParams.get("id");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const client = supabaseAdmin || supabase;

      // 1. First query Supabase Cloud so all devices & desktops show identical live projects
      if (client && import.meta.env.VITE_SUPABASE_URL) {
        const { data, error } = await client
          .from("projects")
          .select("*")
          .order("featured", { ascending: false });

        if (!error && data && data.length > 0) {
          const clean = data.filter(
            (p: any) =>
              p.id !== "2" &&
              p.id !== "3" &&
              !p.title?.includes("Smart Campus IoT") &&
              !p.title?.includes("VANETs")
          );
          if (clean.length > 0) {
            setProjects(clean);
            try {
              localStorage.setItem("admin_projects_data", JSON.stringify(clean));
            } catch {}
            setIsLoading(false);
            return;
          }
        }
      }

      // 2. Fallback to local storage cache if offline or on admin's device
      const localCustom = localStorage.getItem("admin_projects_data");
      if (localCustom) {
        const parsed: ProjectItem[] = JSON.parse(localCustom);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(
            (p) =>
              p.id !== "2" &&
              p.id !== "3" &&
              !p.title.includes("Smart Campus IoT") &&
              !p.title.includes("VANETs")
          );
          if (clean.length > 0) {
            setProjects(clean);
            setIsLoading(false);
            return;
          }
        }
      }

      // 3. Fallback to default JSON
      setProjects(defaultProjectsJSON as ProjectItem[]);
    } catch (err) {
      console.warn("Could not load from DB, falling back to JSON projects:", err);
      setProjects(defaultProjectsJSON as ProjectItem[]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle direct link detection once projects are loaded
  useEffect(() => {
    if (sharedParam && projects.length > 0) {
      const match = projects.find(
        (p) =>
          String(p.id).toLowerCase() === String(sharedParam).toLowerCase() ||
          p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === sharedParam.toLowerCase()
      );
      if (match) {
        setSpotlightProject(match);
        setTimeout(() => {
          const el = document.getElementById(`project-${match.id}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 350);
      }
    }
  }, [sharedParam, projects]);

  const openSpotlight = (project: ProjectItem) => {
    setSpotlightProject(project);
    setSearchParams({ project: project.id }, { replace: true });
  };

  const closeSpotlight = () => {
    setSpotlightProject(null);
    if (searchParams.get("project") || searchParams.get("id")) {
      setSearchParams({}, { replace: true });
    }
  };

  const handleShareProject = async (project: ProjectItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/projects?project=${encodeURIComponent(project.id)}`;

    // Try mobile native share
    if (navigator.share && window.innerWidth < 768) {
      try {
        await navigator.share({
          title: `${project.title} | Dr. G. Jaya Suma Portfolio`,
          text: `Explore "${project.title}" - guided by Dr. G. Jaya Suma at JNTU-GV`,
          url: shareUrl,
        });
        return;
      } catch {}
    }

    // Clipboard copy fallback
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedId(project.id);
      setShareToast(`Link for "${project.title}" copied to clipboard! Anyone opening it will view this project.`);
      setTimeout(() => {
        setCopiedId(null);
      }, 2500);
      setTimeout(() => {
        setShareToast(null);
      }, 4500);
    } catch {
      window.prompt("Copy this project link:", shareUrl);
    }
  };

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  // Helper to extract timestamp or comparable year value
  const getProjectTimestamp = (p: ProjectItem): number => {
    if (p.created_at) {
      const ts = new Date(p.created_at).getTime();
      if (!isNaN(ts)) return ts;
    }
    if (p.year) {
      const parsedYear = parseInt(String(p.year), 10);
      if (!isNaN(parsedYear)) return new Date(parsedYear, 0, 1).getTime();
    }
    const numId = parseInt(p.id, 10);
    return !isNaN(numId) ? numId : 0;
  };

  const filteredAndSortedProjects = useMemo(() => {
    const filtered = projects.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (item.developers && item.developers.some((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "latest") {
        return getProjectTimestamp(b) - getProjectTimestamp(a);
      }
      if (sortBy === "oldest") {
        return getProjectTimestamp(a) - getProjectTimestamp(b);
      }
      if (sortBy === "featured") {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return getProjectTimestamp(b) - getProjectTimestamp(a);
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  }, [projects, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 bg-gradient-to-b from-cream-dark via-cream/40 to-background overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.15) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Ambient glow */}
        <div className="absolute top-16 right-12 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-6 left-12 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container-wide px-6 lg:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/15 text-accent rounded-full text-xs font-semibold tracking-wider uppercase mb-5 border border-accent/20">
            <Sparkles size={14} className="text-accent" />
            <span>Academic & Student Innovations</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 tracking-tight">
            Department & Guided Projects
          </h1>

          <div className="mx-auto h-1 w-24 bg-accent rounded-full mb-6" />

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A showcase of state-of-the-art platforms, research prototypes, and student innovations mentored under{" "}
            <strong className="text-primary font-semibold">Dr. G. Jaya Suma</strong> at JNTU-GV, featuring developer credits and live applications.
          </p>

          {/* Special domain highlight banner */}
          <div className="mt-8 inline-flex items-center gap-3 px-5 py-2.5 bg-card border border-border shadow-sm rounded-full text-xs md:text-sm text-foreground">
            <Globe size={16} className="text-accent shrink-0" />
            <span>
              Explore our interactive learning portal at{" "}
              <Link
                to="/qlearn"
                className="font-bold text-accent hover:underline inline-flex items-center gap-1"
              >
                jayasuma.com/qlearn <ArrowUpRight size={14} />
              </Link>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12">
        <div className="container-wide px-6 lg:px-12">
          {/* Controls Bar: Search & Category Pills & Sort By */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
              <Filter size={16} className="text-muted-foreground shrink-0 hidden sm:block mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-accent text-accent-foreground shadow-sm font-semibold"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right Controls: Search Input + Sort By Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects, tech, developers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 text-foreground placeholder:text-muted-foreground/70 shadow-xs"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="relative w-full sm:w-52">
                <ArrowUpDown size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-xs md:text-sm bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 text-foreground shadow-xs appearance-none cursor-pointer font-medium hover:border-accent/40 transition-colors"
                  aria-label="Sort projects"
                >
                  <option value="latest">Sort: Latest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="featured">Sort: Featured First</option>
                  <option value="title-asc">Sort: Title (A-Z)</option>
                  <option value="title-desc">Sort: Title (Z-A)</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Status & Results Summary Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground mb-8 gap-2">
            <div className="flex items-center gap-3">
              <span>
                Showing <strong className="text-foreground">{filteredAndSortedProjects.length}</strong> of {projects.length} projects
                {searchQuery && (
                  <span> matching &ldquo;<span className="text-accent">{searchQuery}</span>&rdquo;</span>
                )}
              </span>
              {filteredAndSortedProjects.length > 0 && (
                <button
                  onClick={() => {
                    const allExpanded = filteredAndSortedProjects.every((p) => expandedProjects[p.id]);
                    if (allExpanded) {
                      setExpandedProjects({});
                    } else {
                      const next: Record<string, boolean> = {};
                      filteredAndSortedProjects.forEach((p) => {
                        next[p.id] = true;
                      });
                      setExpandedProjects(next);
                    }
                  }}
                  className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  {filteredAndSortedProjects.every((p) => expandedProjects[p.id]) ? (
                    <>
                      <ChevronUp size={13} /> Collapse All
                    </>
                  ) : (
                    <>
                      <ChevronDown size={13} /> Expand All Details
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="inline-flex items-center gap-1.5 font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
              <Clock size={12} />
              <span>
                {sortBy === "latest" && "Sorted: Latest First"}
                {sortBy === "oldest" && "Sorted: Oldest First"}
                {sortBy === "featured" && "Sorted: Featured First"}
                {sortBy === "title-asc" && "Sorted: Title (A-Z)"}
                {sortBy === "title-desc" && "Sorted: Title (Z-A)"}
              </span>
            </div>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-muted/40 animate-pulse border border-border/50" />
              ))}
            </div>
          ) : filteredAndSortedProjects.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border my-6">
              <Layers size={48} className="mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-1">No projects found</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Try adjusting your search criteria or filter categories.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                  setSortBy("latest");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProjects.map((project) => {
                const isExpanded =
                  !!expandedProjects[project.id] ||
                  sharedParam === String(project.id) ||
                  spotlightProject?.id === project.id;

                return (
                  <div
                    key={project.id}
                    id={`project-${project.id}`}
                    className={`group bg-card rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden relative ${
                      sharedParam === String(project.id) || spotlightProject?.id === project.id
                        ? "border-accent ring-4 ring-accent/40 shadow-xl"
                        : "border-border shadow-sm hover:shadow-lg hover:border-accent/40"
                    }`}
                  >
                    {/* Card Top Header: Category & Status / Year Badges */}
                    <div className="px-5 pt-4 pb-2.5 flex items-center justify-between gap-2 border-b border-border/40 bg-muted/20">
                      <span className="px-2.5 py-0.5 bg-accent/15 text-accent text-[11px] font-semibold rounded-full border border-accent/25">
                        {project.category || "Educational Platform"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {(project.year || (project.created_at && new Date(project.created_at).getFullYear())) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-card text-muted-foreground border border-border/70">
                            <Calendar size={10} />
                            {project.year || new Date(project.created_at!).getFullYear()}
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            project.status === "Live"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {project.status === "Live" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                          {project.status || "Completed"}
                        </span>
                      </div>
                    </div>

                    {/* Card Primary Content: Project Name & Link Directly Below It */}
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        {/* Project Name */}
                        <h3
                          onClick={() => toggleProjectExpand(project.id)}
                          className="font-serif text-xl font-bold text-primary hover:text-accent transition-colors cursor-pointer mb-2"
                          title="Click to view details"
                        >
                          {project.title}
                        </h3>

                        {/* Project Link Directly Below Name */}
                        <div className="mb-4">
                          {project.live_url ? (
                            project.live_url.startsWith("/") ? (
                              <Link
                                to={project.live_url}
                                className="group/link inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 font-mono font-semibold transition-colors break-all"
                                title="Open Live Platform"
                              >
                                <Globe size={13} className="shrink-0 text-accent group-hover/link:rotate-12 transition-transform" />
                                <span className="hover:underline">
                                  {typeof window !== "undefined" ? window.location.host : "jayasuma.com"}{project.live_url}
                                </span>
                                <ArrowUpRight size={12} className="shrink-0" />
                              </Link>
                            ) : (
                              <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 font-mono font-semibold transition-colors break-all"
                                title="Open External Live Platform"
                              >
                                <Globe size={13} className="shrink-0 text-accent group-hover/link:rotate-12 transition-transform" />
                                <span className="hover:underline">
                                  {project.live_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                                </span>
                                <ArrowUpRight size={12} className="shrink-0" />
                              </a>
                            )
                          ) : project.github_url ? (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/link inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-mono transition-colors break-all"
                              title="Open GitHub Repository"
                            >
                              <Github size={13} className="shrink-0" />
                              <span className="hover:underline">
                                {project.github_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                              </span>
                              <ArrowUpRight size={12} className="shrink-0" />
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground italic flex items-center gap-1">
                              <Sparkles size={11} className="text-accent" />
                              Guided Project &bull; Dr. G. Jaya Suma
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dropdown Action Bar: Click to View Details + Share Button */}
                      <div className="flex items-center gap-2 pt-3 border-t border-border/50 mt-auto">
                        <button
                          onClick={() => toggleProjectExpand(project.id)}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all shadow-xs ${
                            isExpanded
                              ? "bg-accent text-accent-foreground border-accent shadow-sm"
                              : "bg-accent/10 hover:bg-accent/20 text-accent border-accent/30"
                          }`}
                          aria-expanded={isExpanded}
                          title={isExpanded ? "Click to collapse details" : "Click to view description, team, and stack"}
                        >
                          <span>{isExpanded ? "Hide Details" : "Click to View Details"}</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        {/* Direct Project Share Button */}
                        <button
                          onClick={(e) => handleShareProject(project, e)}
                          className={`px-3 py-2 rounded-xl border transition-all inline-flex items-center gap-1.5 text-xs font-semibold ${
                            copiedId === project.id
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted/70 hover:bg-accent/10 text-muted-foreground hover:text-accent border-border"
                          }`}
                          title="Copy direct share link for this project"
                        >
                          {copiedId === project.id ? (
                            <>
                              <Check size={14} className="text-emerald-500" />
                              <span className="text-[11px] font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Share2 size={14} />
                              <span className="text-[11px]">Share</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* ================= COLLAPSIBLE DROPDOWN DETAILS ================= */}
                    {isExpanded && (
                      <div className="border-t border-border/60 bg-muted/10 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Banner Image Preview */}
                        <div
                          onClick={() => openSpotlight(project)}
                          className="relative h-44 w-full bg-muted overflow-hidden cursor-pointer group/img"
                          title="Click to view full spotlight modal"
                        >
                          <img
                            src={
                              project.image_url ||
                              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
                            }
                            alt={project.title}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                          <div className="absolute bottom-2.5 right-3 text-[10px] font-semibold text-white/90 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                            <Sparkles size={10} /> Spotlight View
                          </div>
                        </div>

                        <div className="p-5 space-y-4">
                          {/* Project Description */}
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 flex items-center gap-1">
                              <Info size={12} className="text-accent" />
                              <span>About Project</span>
                            </div>
                            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                              {project.description}
                            </p>
                          </div>

                          {/* Tech Tags */}
                          {project.tags && project.tags.length > 0 && (
                            <div>
                              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2 flex items-center gap-1">
                                <Code2 size={12} className="text-accent" />
                                <span>Technologies & Stack</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {project.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2.5 py-0.5 bg-muted text-muted-foreground text-[11px] font-medium rounded-md border border-border/50"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Developers & Contributors Team */}
                          {project.developers && project.developers.length > 0 && (
                            <div className="pt-3 border-t border-border/50">
                              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2.5 flex items-center gap-1.5">
                                <Users size={12} className="text-accent" />
                                <span>Developers & Contributors ({project.developers.length})</span>
                              </div>

                              <div className="space-y-2">
                                {project.developers.map((dev, dIdx) => (
                                  <div
                                    key={dIdx}
                                    className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/60 hover:border-accent/40 transition-colors shadow-2xs"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <img
                                        src={
                                          dev.photo_url ||
                                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            dev.name
                                          )}&background=f59e0b&color=fff`
                                        }
                                        alt={dev.name}
                                        className="w-8 h-8 rounded-full object-cover border border-border shrink-0 shadow-xs"
                                      />
                                      <div className="min-w-0">
                                        <p className="text-xs font-semibold text-foreground truncate">
                                          {dev.name}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground truncate">
                                          {dev.role || "Developer"}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Developer Social Links */}
                                    <div className="flex items-center gap-1 shrink-0 ml-2">
                                      {dev.linkedin_url && (
                                        <a
                                          href={dev.linkedin_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          title={`${dev.name}'s LinkedIn`}
                                          className="p-1.5 text-muted-foreground hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 rounded-lg transition-colors"
                                        >
                                          <Linkedin size={14} />
                                        </a>
                                      )}
                                      {dev.github_url && (
                                        <a
                                          href={dev.github_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          title={`${dev.name}'s GitHub`}
                                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                        >
                                          <Github size={14} />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quick Launch Actions */}
                          <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                            {project.live_url && (
                              project.live_url.startsWith("/") ? (
                                <Link
                                  to={project.live_url}
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-semibold rounded-xl transition-all shadow-xs"
                                >
                                  <Globe size={13} />
                                  <span>Open Platform</span>
                                  <ArrowUpRight size={13} />
                                </Link>
                              ) : (
                                <a
                                  href={project.live_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-semibold rounded-xl transition-all shadow-xs"
                                >
                                  <Globe size={13} />
                                  <span>Open Platform</span>
                                  <ArrowUpRight size={13} />
                                </a>
                              )
                            )}
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-card hover:bg-muted text-foreground rounded-xl transition-colors border border-border inline-flex items-center gap-1 text-xs font-medium"
                                title="View Code Repository"
                              >
                                <Github size={14} />
                                <span className="text-[11px]">Code</span>
                              </a>
                            )}
                            <button
                              onClick={() => openSpotlight(project)}
                              className="p-2 bg-card hover:bg-accent/10 text-accent rounded-xl transition-colors border border-accent/30 inline-flex items-center gap-1 text-xs font-semibold"
                              title="Open Full Spotlight Modal"
                            >
                              <Sparkles size={13} />
                              <span className="text-[11px]">Spotlight</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA for prospective student projects */}
      <section className="py-16 bg-muted/40 border-t border-border/60 mt-12">
        <div className="container-narrow px-6 lg:px-12 text-center">
          <div className="p-8 md:p-10 rounded-3xl bg-card border border-border shadow-lg">
            <Rocket size={36} className="mx-auto text-accent mb-4" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-3">
              Have an Innovation or Research Project?
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mb-6">
              Students, scholars, and collaborators are encouraged to submit their work for academic guidance, institutional prototyping, and mentorship under Dr. G. Jaya Suma.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="default" asChild>
                <Link to="/contact">Submit for Mentorship</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/qlearn">Visit QLearn Hub</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DEDICATED PROJECT SPOTLIGHT & DIRECT SHARE MODAL ================= */}
      {spotlightProject && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={closeSpotlight}
        >
          <div
            className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/70 bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent/15 text-accent border border-accent/30 flex items-center gap-1.5">
                  <Sparkles size={13} /> Project Showcase
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  Guided by Dr. G. Jaya Suma
                </span>
              </div>
              <button
                onClick={closeSpotlight}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Cover Image & Badges */}
              <div className="relative h-52 sm:h-64 rounded-2xl overflow-hidden bg-muted border border-border/60 shadow-inner">
                <img
                  src={
                    spotlightProject.image_url ||
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
                  }
                  alt={spotlightProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-card/90 backdrop-blur-md text-primary border border-border shadow-xs">
                    {spotlightProject.category || "Educational Platform"}
                  </span>

                  <div className="flex items-center gap-2">
                    {(spotlightProject.year || (spotlightProject.created_at && new Date(spotlightProject.created_at).getFullYear())) && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/30 text-white backdrop-blur-md border border-accent/40 flex items-center gap-1">
                        <Calendar size={12} />
                        {spotlightProject.year || new Date(spotlightProject.created_at!).getFullYear()}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-xs ${
                        spotlightProject.status === "Live"
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {spotlightProject.status === "Live" ? "● Live Platform" : "● In Progress"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Share Button */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-1">
                <div className="flex-1">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                    {spotlightProject.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>JNTU-GV IT Department · Under the supervision of Dr. G. Jaya Suma</span>
                  </p>
                </div>

                <button
                  onClick={(e) => handleShareProject(spotlightProject, e)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 shrink-0 ${
                    copiedId === spotlightProject.id
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm"
                  }`}
                  title="Copy shareable link for this project"
                >
                  {copiedId === spotlightProject.id ? (
                    <>
                      <Check size={14} className="text-emerald-500" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={14} />
                      <span>Share Project</span>
                    </>
                  )}
                </button>
              </div>

              {/* Description Body */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {spotlightProject.description}
              </div>

              {/* Tech Tags */}
              {spotlightProject.tags && spotlightProject.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                    <Code2 size={13} className="text-accent" /> Technologies & Focus Areas
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {spotlightProject.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-muted text-foreground text-xs font-medium rounded-lg border border-border"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Developers List */}
              {spotlightProject.developers && spotlightProject.developers.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Users size={14} className="text-accent" />
                    Student Developers & Contributors
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {spotlightProject.developers.map((dev, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/80 shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={
                              dev.photo_url ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                dev.name
                              )}&background=f59e0b&color=fff`
                            }
                            alt={dev.name}
                            className="w-10 h-10 rounded-full object-cover border border-border shrink-0 shadow-xs"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">
                              {dev.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {dev.role || "Developer"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {dev.linkedin_url && (
                            <a
                              href={dev.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`${dev.name}'s LinkedIn`}
                              className="p-1.5 text-muted-foreground hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 rounded-lg transition-colors"
                            >
                              <Linkedin size={15} />
                            </a>
                          )}
                          {dev.github_url && (
                            <a
                              href={dev.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`${dev.name}'s GitHub`}
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                              <Github size={15} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 sm:p-5 border-t border-border/70 bg-muted/30 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={closeSpotlight}
                className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse All Projects
              </button>

              <div className="flex items-center gap-2">
                {spotlightProject.github_url && (
                  <a
                    href={spotlightProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold transition-colors"
                  >
                    <Github size={15} />
                    <span>Repository</span>
                  </a>
                )}
                {spotlightProject.live_url && (
                  spotlightProject.live_url.startsWith("/") ? (
                    <Link
                      to={spotlightProject.live_url}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-bold shadow-xs transition-colors"
                    >
                      <Globe size={15} />
                      <span>Open Live Platform</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  ) : (
                    <a
                      href={spotlightProject.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-bold shadow-xs transition-colors"
                    >
                      <Globe size={15} />
                      <span>Open Live Platform</span>
                      <ArrowUpRight size={14} />
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Share Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-foreground text-background px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200 border border-border/40">
          <Check size={18} className="text-emerald-400 shrink-0" />
          <p className="text-xs font-medium leading-snug">{shareToast}</p>
        </div>
      )}

      <Footer />
    </div>
  );
}
