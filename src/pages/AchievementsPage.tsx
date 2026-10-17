import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import MultiYearCard from "@/components/ui/MultiYearCard";
import { Trophy, Star, Shield, Loader2, ArrowUpDown, ChevronDown, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

// JSON Fallback Imports
import academicGovernanceJSON from "@/data/academic_governance.json";
import committeeRolesJSON from "@/data/committee_roles.json";
import majorAwardsJSON from "@/data/major_awards.json";

interface AchievementItem {
  id: string;
  title: string;
  badge: string;
  institution: string;
  description: string;
  years: string[];
  certificate_image_url?: string | null;
  created_at?: string;
}

const AchievementsPage = () => {
  const [awards, setAwards] = useState<AchievementItem[]>([]);
  const [academicGovernance, setAcademicGovernance] = useState<AchievementItem[]>([]);
  const [committees, setCommittees] = useState<AchievementItem[]>([]);
  const [sortBy, setSortBy] = useState<string>("latest");
  
  const [loadingAwards, setLoadingAwards] = useState(true);
  const [loadingAcademic, setLoadingAcademic] = useState(true);
  const [loadingCommittees, setLoadingCommittees] = useState(true);

  // Check if Supabase is available (future-proof)
  const isSupabaseEnabled = !!supabase;

  // Helper function to parse years text into array
  const parseYears = (yearsText: string | null): string[] => {
    if (!yearsText) return [];
    return yearsText
      .split(/[\n,]/)
      .map(year => year.trim())
      .filter(year => year.length > 0);
  };

  // Helper function to format JSON data to UI format (browser-safe ID generation)
  const formatJsonData = (data: any[]): AchievementItem[] => {
    return (data || []).map((item) => ({
      id: item.id ?? `${item.title}-${Math.random()}`,
      title: item.title,
      badge: item.badge || "",
      institution: item.institution,
      description: item.description || "",
      years: parseYears(item.years),
      certificate_image_url: item.certificate_image_url ?? null,
      created_at: item.created_at,
    }));
  };

  // Extract year for sorting
  const getItemYear = (item: AchievementItem, findMax: boolean = true): number => {
    if (item.years && item.years.length > 0) {
      const allYears = item.years.flatMap(y => {
        const matches = y.match(/\b(19\d\d|20\d\d)\b/g);
        return matches ? matches.map(Number) : [];
      });
      if (allYears.length > 0) {
        return findMax ? Math.max(...allYears) : Math.min(...allYears);
      }
    }
    if (item.created_at) {
      const d = new Date(item.created_at).getFullYear();
      if (!isNaN(d)) return d;
    }
    return findMax ? 0 : 9999;
  };

  const sortAchievements = (list: AchievementItem[]): AchievementItem[] => {
    return [...list].sort((a, b) => {
      if (sortBy === "latest") {
        const yA = getItemYear(a, true);
        const yB = getItemYear(b, true);
        if (yB !== yA) return yB - yA;
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "oldest") {
        const yA = getItemYear(a, false);
        const yB = getItemYear(b, false);
        if (yA !== yB) return yA - yB;
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  // Fetch Major Awards
  useEffect(() => {
    const fetchAwards = async () => {
      setLoadingAwards(true);

      try {
        // Check if Supabase is enabled
        if (!isSupabaseEnabled) {
          throw new Error("Supabase not configured");
        }

        const { data, error } = await supabase
          .from("major_awards")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setAwards(formatJsonData(data));
      } catch (error) {
        console.warn("Loading from major_awards.json fallback");
        setAwards(formatJsonData(majorAwardsJSON));
      } finally {
        setLoadingAwards(false);
      }
    };

    fetchAwards();
  }, [isSupabaseEnabled]);

  // Fetch Academic & Governance
  useEffect(() => {
    const fetchAcademic = async () => {
      setLoadingAcademic(true);

      try {
        // Check if Supabase is enabled
        if (!isSupabaseEnabled) {
          throw new Error("Supabase not configured");
        }

        const { data, error } = await supabase
          .from("academic_governance")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setAcademicGovernance(formatJsonData(data));
      } catch (error) {
        console.warn("Loading from academic_governance.json fallback");
        setAcademicGovernance(formatJsonData(academicGovernanceJSON));
      } finally {
        setLoadingAcademic(false);
      }
    };

    fetchAcademic();
  }, [isSupabaseEnabled]);

  // Fetch Committee Roles
  useEffect(() => {
    const fetchCommittees = async () => {
      setLoadingCommittees(true);

      try {
        // Check if Supabase is enabled
        if (!isSupabaseEnabled) {
          throw new Error("Supabase not configured");
        }

        const { data, error } = await supabase
          .from("committee_roles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setCommittees(formatJsonData(data));
      } catch (error) {
        console.warn("Loading from committee_roles.json fallback");
        setCommittees(formatJsonData(committeeRolesJSON));
      } finally {
        setLoadingCommittees(false);
      }
    };

    fetchCommittees();
  }, [isSupabaseEnabled]);

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );

  // Empty state component
  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12 text-muted-foreground">
      <p className="text-lg">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ===========================
          ENHANCED HERO SECTION
          - Parallax depth with subtle patterns
          - Gold accent underline
          - Staggered fade-in animations
          - Decorative blur elements
          =========================== */}
      <section className="relative pt-28 pb-16 bg-gradient-to-b from-cream-dark via-cream/40 to-background overflow-hidden">
        {/* Subtle Grid Pattern Background */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.15) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
        
        {/* Decorative Blur Elements for Depth */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container-wide px-6 lg:px-12 text-center relative z-10">
          {/* Main Title with Fade-In Animation */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Awards & Achievements
          </h1>

          {/* Gold Accent Underline */}
          <div className="mx-auto h-1 w-24 bg-accent rounded-full mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150" />

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            Recognition of academic excellence, leadership, and institutional service
          </p>

          {/* Disclaimer */}
          <p className="text-muted-foreground text-sm mt-3 animate-in fade-in duration-700 delay-500">
            *Selected recognitions highlighting sustained academic and administrative contributions.
          </p>
        </div>
      </section>

      {/* ===========================
          AWARD PHILOSOPHY & SORT TOOLBAR
          =========================== */}
      <section className="pt-10 pb-6 border-b border-border/40">
        <div className="container-wide px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <blockquote className="border-l-4 border-accent pl-6 text-foreground/80 italic text-base md:text-lg leading-relaxed max-w-2xl">
            Awards are not milestones, but reflections of collective effort,
            institutional trust, and sustained commitment to academic excellence.
          </blockquote>

          {/* Sort By Dropdown */}
          <div className="relative w-full sm:w-64 shrink-0">
            <ArrowUpDown size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-xs md:text-sm bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 text-foreground shadow-xs appearance-none cursor-pointer font-medium hover:border-accent/40 transition-colors"
              aria-label="Sort achievements"
            >
              <option value="latest">Sort: Latest First (Newest to Oldest)</option>
              <option value="oldest">Sort: Oldest First (Oldest to Newest)</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ===========================
          MAJOR AWARDS SECTION
          - Enhanced section heading with visual anchor
          - Trophy icon integration
          - Premium card grid
          =========================== */}
      <section className="section-padding">
        <div className="container-wide px-6 lg:px-12">
          {/* Enhanced Section Heading with Visual Anchor Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 relative pl-6">
            <span className="absolute left-0 top-1 h-10 w-1.5 bg-accent rounded-full animate-in fade-in slide-in-from-left-2 duration-500" />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="h-7 w-7 text-accent animate-in fade-in zoom-in-50 duration-500" />
                <h2 className="text-3xl md:text-4xl font-semibold text-primary font-serif animate-in fade-in slide-in-from-bottom-3 duration-700">
                  Major Awards
                </h2>
              </div>
              <p className="text-muted-foreground text-lg animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150">
                National and institutional recognitions
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20 w-fit">
              <Clock size={12} />
              <span>{sortBy === "latest" ? "Sorted: Latest First" : "Sorted: Oldest First"}</span>
            </div>
          </div>

          {loadingAwards ? (
            <LoadingSpinner />
          ) : awards.length === 0 ? (
            <EmptyState message="No major awards data available at this time." />
          ) : (
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {sortAchievements(awards).map((item) => (
                <MultiYearCard key={item.id} {...item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===========================
          ACADEMIC & GOVERNANCE SECTION
          - Subtle gradient background for visual rhythm
          - Star icon integration
          - 3-column grid on large screens
          =========================== */}
      <section className="section-padding bg-gradient-to-br from-muted/40 via-muted/20 to-background">
        <div className="container-wide px-6 lg:px-12">
          {/* Enhanced Section Heading with Visual Anchor Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 relative pl-6">
            <span className="absolute left-0 top-1 h-10 w-1.5 bg-accent rounded-full animate-in fade-in slide-in-from-left-2 duration-500" />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-7 w-7 text-accent animate-in fade-in zoom-in-50 duration-500" />
                <h2 className="text-3xl md:text-4xl font-semibold text-primary font-serif animate-in fade-in slide-in-from-bottom-3 duration-700">
                  Academic & Governance Achievements
                </h2>
              </div>
              <p className="text-muted-foreground text-lg animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150">
                Academic leadership and governance responsibilities
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20 w-fit">
              <Clock size={12} />
              <span>{sortBy === "latest" ? "Sorted: Latest First" : "Sorted: Oldest First"}</span>
            </div>
          </div>

          {loadingAcademic ? (
            <LoadingSpinner />
          ) : academicGovernance.length === 0 ? (
            <EmptyState message="No academic governance data available at this time." />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {sortAchievements(academicGovernance).map((item) => (
                <MultiYearCard key={item.id} {...item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===========================
          ADMINISTRATIVE & COMMITTEE ROLES SECTION
          - Shield icon for institutional service
          - 3-column responsive grid
          =========================== */}
      <section className="section-padding">
        <div className="container-wide px-6 lg:px-12">
          {/* Enhanced Section Heading with Visual Anchor Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 relative pl-6">
            <span className="absolute left-0 top-1 h-10 w-1.5 bg-accent rounded-full animate-in fade-in slide-in-from-left-2 duration-500" />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-7 w-7 text-accent animate-in fade-in zoom-in-50 duration-500" />
                <h2 className="text-3xl md:text-4xl font-semibold text-primary font-serif animate-in fade-in slide-in-from-bottom-3 duration-700">
                  Administrative & Committee Roles
                </h2>
              </div>
              <p className="text-muted-foreground text-lg animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150">
                Institutional service and committee-level contributions
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20 w-fit">
              <Clock size={12} />
              <span>{sortBy === "latest" ? "Sorted: Latest First" : "Sorted: Oldest First"}</span>
            </div>
          </div>

          {loadingCommittees ? (
            <LoadingSpinner />
          ) : committees.length === 0 ? (
            <EmptyState message="No committee roles data available at this time." />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {sortAchievements(committees).map((item) => (
                <MultiYearCard key={item.id} {...item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Separation - Clean visual break */}
      <div className="border-t border-border/60 mt-20" />
      <Footer />
    </div>
  );
};

export default AchievementsPage;