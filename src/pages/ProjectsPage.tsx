import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  ArrowUpRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
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
  developers?: Developer[];
  created_at?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      // 1. Try local storage cache from Admin if exists
      const localCustom = localStorage.getItem("admin_projects_data");
      if (localCustom) {
        const parsed = JSON.parse(localCustom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
          setIsLoading(false);
          return;
        }
      }

      // 2. Try Supabase
      if (supabase && import.meta.env.VITE_SUPABASE_URL) {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("featured", { ascending: false });

        if (!error && data && data.length > 0) {
          setProjects(data);
          setIsLoading(false);
          return;
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

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  const filteredProjects = projects.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (item.developers && item.developers.some((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

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
          {/* Controls Bar: Search & Category Pills */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-border/60">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
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

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects, tech, developers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 text-foreground placeholder:text-muted-foreground/70 shadow-xs"
              />
            </div>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-muted/40 animate-pulse border border-border/50" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
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
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-accent/40 transition-all duration-300 flex flex-col overflow-hidden relative"
                >
                  {/* Banner Image */}
                  <div className="relative h-48 sm:h-52 w-full bg-muted overflow-hidden">
                    <img
                      src={
                        project.image_url ||
                        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
                      }
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-card/90 backdrop-blur-md text-primary text-xs font-semibold rounded-full border border-border/80 shadow-xs">
                        {project.category || "Project"}
                      </span>
                    </div>

                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-xs ${
                          project.status === "Live"
                            ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {project.status === "Live" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {project.status || "Completed"}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="font-serif text-xl font-bold text-primary mb-2.5 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                      {project.description}
                    </p>

                    {/* Tech Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 bg-muted/60 text-muted-foreground text-[11px] font-medium rounded-md border border-border/40"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Developers Team Section */}
                    {project.developers && project.developers.length > 0 && (
                      <div className="pt-4 border-t border-border/60 mb-5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-3 flex items-center gap-1.5">
                          <Users size={12} className="text-accent" />
                          <span>Developers & Contributors</span>
                        </div>

                        <div className="space-y-2.5">
                          {project.developers.map((dev, dIdx) => (
                            <div
                              key={dIdx}
                              className="flex items-center justify-between p-2 rounded-xl bg-muted/30 hover:bg-muted/70 transition-colors border border-border/30"
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

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      {project.live_url ? (
                        project.live_url.startsWith("/") ? (
                          <Link
                            to={project.live_url}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <Globe size={14} />
                            <span>Open Platform</span>
                            <ArrowUpRight size={14} />
                          </Link>
                        ) : (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <Globe size={14} />
                            <span>Live Platform</span>
                            <ArrowUpRight size={14} />
                          </a>
                        )
                      ) : (
                        <span className="flex-1 text-center py-2 text-xs text-muted-foreground bg-muted/40 rounded-xl">
                          Internal Showcase
                        </span>
                      )}

                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl transition-colors border border-border"
                          title="View Repository"
                        >
                          <Github size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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

      <Footer />
    </div>
  );
}
