import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScholarSkeleton } from "@/components/ui/ScholarSkeleton";
import { supabase } from "@/lib/supabase";
import scholarsJSON from "@/data/scholars.json";
import { cn } from "@/lib/utils";

export type ScholarType = "btech" | "mtech" | "mca" | "phd";

export interface Scholar {
  id?: string;
  name: string;
  roll: string;
  title: string;
  dept: string;
  year: string;
  type: ScholarType;
  university?: string;
  guide_name?: string;
}

const FILTER_LABELS: Record<"all" | ScholarType, string> = {
  all: "ALL",
  phd: "PH.D",
  mca: "MCA",
  mtech: "M.TECH",
  btech: "B.TECH",
};

export default function ScholarsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | ScholarType>("all");
  const [search, setSearch] = useState("");
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isSupabaseEnabled =
    !!import.meta.env.VITE_SUPABASE_URL &&
    !!import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !!supabase;

  useEffect(() => {
    const fetchScholars = async () => {
      setIsLoading(true);
      try {
        const jsonByType = (t: ScholarType): Scholar[] =>
          (scholarsJSON as Scholar[]).filter((s) => s.type === t);

        const localSaved = localStorage.getItem("portfolio_scholars_data");
        let localParsed: Scholar[] = [];
        if (localSaved) {
          try {
            localParsed = JSON.parse(localSaved);
          } catch (e) {
            console.warn("Could not parse local scholars data", e);
          }
        }

        if (!isSupabaseEnabled) {
          setScholars(localParsed.length > 0 ? localParsed : (scholarsJSON as Scholar[]));
          return;
        }

        // Fetch from all individual scholar tables in Supabase in parallel
        const [phdRes, mcaRes, mtechRes, btechRes] = await Promise.allSettled([
          supabase.from("phd_scholars_awarded").select("*").order("awarded_year", { ascending: false }),
          supabase.from("mca_scholars").select("*").order("academic_year", { ascending: false }),
          supabase.from("mtech_scholars").select("*").order("academic_year", { ascending: false }),
          supabase.from("btech_scholars").select("*").order("academic_year", { ascending: false }),
        ]);

        // 1. Ph.D Scholars
        let phdList: Scholar[] = [];
        if (phdRes.status === "fulfilled" && !phdRes.value.error && phdRes.value.data && phdRes.value.data.length > 0) {
          phdList = phdRes.value.data.map((item: any) => ({
            id: item.id,
            name: item.scholar_name || item.student_name || item.name || "Ph.D Scholar",
            roll: item.roll_number || item.roll || "-",
            title: item.thesis_title || item.project_title || item.title || "-",
            dept: item.department || item.dept || "CSE",
            year: String(item.awarded_year || item.academic_year || item.year || "-"),
            type: "phd" as ScholarType,
            university: item.university ? item.university.trim() : undefined,
            guide_name: item.guide_name || undefined,
          }));
        } else {
          phdList = jsonByType("phd");
        }

        // 2. MCA Scholars
        let mcaList: Scholar[] = [];
        if (mcaRes.status === "fulfilled" && !mcaRes.value.error && mcaRes.value.data && mcaRes.value.data.length > 0) {
          mcaList = mcaRes.value.data.map((item: any) => ({
            id: item.id,
            name: item.student_name || item.scholar_name || item.name || "MCA Scholar",
            roll: item.roll_number || item.roll || "-",
            title: item.project_title || item.thesis_title || item.title || "-",
            dept: item.department || item.dept || "MCA",
            year: String(item.academic_year || item.awarded_year || item.year || "-"),
            type: "mca" as ScholarType,
            university: item.university ? item.university.trim() : undefined,
            guide_name: item.guide_name || undefined,
          }));
        } else {
          mcaList = jsonByType("mca");
        }

        // 3. M.Tech Scholars
        let mtechList: Scholar[] = [];
        if (mtechRes.status === "fulfilled" && !mtechRes.value.error && mtechRes.value.data && mtechRes.value.data.length > 0) {
          mtechList = mtechRes.value.data.map((item: any) => ({
            id: item.id,
            name: item.student_name || item.scholar_name || item.name || "M.Tech Scholar",
            roll: item.roll_number || item.roll || "-",
            title: item.thesis_title || item.project_title || item.title || "-",
            dept: item.department || item.dept || "CSE",
            year: String(item.academic_year || item.awarded_year || item.year || "-"),
            type: "mtech" as ScholarType,
            university: item.university ? item.university.trim() : undefined,
            guide_name: item.guide_name || undefined,
          }));
        } else {
          mtechList = jsonByType("mtech");
        }

        // 4. B.Tech Scholars
        let btechList: Scholar[] = [];
        if (btechRes.status === "fulfilled" && !btechRes.value.error && btechRes.value.data && btechRes.value.data.length > 0) {
          btechList = btechRes.value.data.map((item: any) => ({
            id: item.id,
            name: item.student_name || item.scholar_name || item.name || "Student Team",
            roll: item.roll_number || item.roll || "-",
            title: item.project_title || item.thesis_title || item.title || "-",
            dept: item.department || item.dept || "Information Technology",
            year: String(item.academic_year || item.awarded_year || item.year || "-"),
            type: "btech" as ScholarType,
            university: item.university ? item.university.trim() : undefined,
            guide_name: item.guide_name || undefined,
          }));
        } else {
          btechList = jsonByType("btech");
        }

        const combined = [...phdList, ...mcaList, ...mtechList, ...btechList];

        // Also merge any locally created items if saved offline with unique ID
        if (localParsed.length > 0) {
          localParsed.forEach((l) => {
            if (
              l.id?.startsWith("scholar-") &&
              !combined.some((c) => c.id === l.id || (c.roll === l.roll && c.roll !== "-"))
            ) {
              combined.push(l);
            }
          });
        }

        setScholars(combined);
      } catch (err) {
        console.warn("Loading scholars from fallback JSON", err);
        setScholars(scholarsJSON as Scholar[]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholars();
  }, [isSupabaseEnabled]);

  // Enhanced filtering with search
  const filtered = scholars.filter((s) => {
    const matchesFilter = activeFilter === "all" || s.type === activeFilter;
    const matchesSearch =
      search === "" ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll.toLowerCase().includes(search.toLowerCase()) ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.dept && s.dept.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-padding">
        <div className="container-wide px-6 lg:px-12">
          <SectionHeading
            title="Scholars & Mentorship"
            subtitle="Ph.D, MCA, M.Tech and B.Tech scholars & student research mentored"
          />

          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <input
              type="text"
              placeholder="Search by scholar name, roll number, project/thesis title, or dept..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-2/3 lg:w-1/2 px-5 py-3 rounded-xl border border-border bg-background 
                         focus:ring-2 focus:ring-primary focus:border-primary outline-none 
                         transition-all duration-300 text-sm placeholder:text-muted-foreground shadow-sm"
            />
          </div>

          {/* Premium Filter Chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {(["all", "phd", "mca", "mtech", "btech"] as const).map((f) => {
              const count =
                f === "all"
                  ? scholars.length
                  : scholars.filter((s) => s.type === f).length;

              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2",
                    "border transition-all duration-300",
                    activeFilter === f
                      ? "bg-primary text-primary-foreground shadow-lg scale-105 border-primary"
                      : "bg-background hover:bg-accent/20 border-border hover:border-accent"
                  )}
                >
                  {FILTER_LABELS[f]}
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Scholar Cards */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ScholarSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              filtered.map((s, i) => (
                <div
                  key={s.id || `${s.roll}-${i}`}
                  className={cn(
                    "relative p-6 bg-card rounded-xl border border-border",
                    "transition-all duration-300",
                    "hover:-translate-y-1 hover:shadow-xl hover:border-primary",
                    "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Left Accent Bar */}
                  <span className="absolute left-0 top-6 h-12 w-1 bg-primary rounded-r" />

                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-primary">
                        {s.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {s.roll && s.roll !== "-" ? `${s.roll} • ` : ""}
                        {s.dept || "CSE"} • {s.year}
                        {s.university && s.university.trim() !== "" ? ` • ${s.university}` : ""}
                      </p>
                    </div>

                    {/* Type Badge */}
                    <span className="text-xs px-3 py-1 rounded-full bg-accent/20 text-accent font-medium whitespace-nowrap">
                      {FILTER_LABELS[s.type] || s.type.toUpperCase()}
                    </span>
                  </div>

                  {/* Thesis / Project Title */}
                  <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                    {s.title}
                  </p>
                </div>
              ))
            ) : (
              // Enhanced Empty State
              <div className="text-center py-20 text-muted-foreground">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                  <svg
                    className="w-8 h-8 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-foreground">
                  No scholars found in this category
                </p>
                <p className="text-sm mt-2">
                  Try adjusting your search keywords or select another filter
                </p>
              </div>
            )}
          </div>

          {/* Results Summary */}
          {!isLoading && filtered.length > 0 && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Showing {filtered.length} of {scholars.length} scholars
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}