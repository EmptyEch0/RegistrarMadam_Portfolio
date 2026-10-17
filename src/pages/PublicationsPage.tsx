import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { PublicationCard } from "@/components/ui/publication-card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  Award,
  Search,
  ArrowUpDown,
  ChevronDown,
  Clock,
  Filter,
  Layers,
  Sparkles
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// JSON fallback imports
import journalsJSON from "@/data/journals.json";
import internationalConferencesJSON from "@/data/international_conferences.json";
import invitedTalksJSON from "@/data/invited_talks.json";

const PublicationsPage = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [isLoading, setIsLoading] = useState(true);
  
  // State for Supabase data
  const [journals, setJournals] = useState<any[]>([]);
  const [internationalConferences, setInternationalConferences] = useState<any[]>([]);
  const [invitedTalks, setInvitedTalks] = useState<any[]>([]);

  // Check if Supabase is available (production-safe)
  const isSupabaseEnabled =
    !!import.meta.env.VITE_SUPABASE_URL &&
    !!import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !!supabase;

  // Fetch data from Supabase with JSON fallback
  useEffect(() => {
    const fetchPublicationsData = async () => {
      setIsLoading(true);

      try {
        if (!isSupabaseEnabled) {
          throw new Error("Supabase not configured");
        }

        // Fetch journals - WITH year FIELD
        const { data: journalsData, error: journalsError } = await supabase
          .from("journals")
          .select("title, journal, authors, year, link")
          .order("year", { ascending: false, nullsFirst: false });
        if (journalsError) throw journalsError;

        // Fetch international conferences - SORTED BY YEAR
        const { data: conferencesData, error: conferencesError } = await supabase
          .from("international_conferences")
          .select("title, authors, venue, year, link")
          .order("year", { ascending: false });
        if (conferencesError) throw conferencesError;

        // Fetch invited talks
        const { data: talksData, error: talksError } = await supabase
          .from("invited_talks")
          .select("title, event, date, speaker, created_at")
          .order("created_at", { ascending: false });

        if (talksError) throw talksError;

        setJournals(journalsData || []);
        setInternationalConferences(conferencesData || []);
        setInvitedTalks(talksData || []);
      } catch (error) {
        console.warn("Supabase failed → loading publications from JSON");
        setJournals(journalsJSON || []);
        setInternationalConferences(internationalConferencesJSON || []);
        setInvitedTalks(invitedTalksJSON || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicationsData();
  }, [isSupabaseEnabled]);

  // Helper to extract 4-digit numeric year
  const parsePublicationYear = (yearStr: string): number => {
    if (!yearStr) return 0;
    const match = yearStr.match(/\b(19\d\d|20\d\d)\b/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Transform raw data into normalized cards
  const rawPublications = useMemo(() => [
    ...journals.map(j => ({
      title: j.title || "",
      journal: j.journal || "",
      year: j.year?.toString() || "",
      type: "journal" as const,
      authors: j.authors || "",
      link: j.link || "",
    })),
    ...internationalConferences.map(c => ({
      title: c.title || "",
      journal: c.venue || "",
      year: c.year?.toString() || "",
      type: "conference" as const,
      authors: c.authors || "",
      link: c.link || "",
    })),
    ...invitedTalks.map(t => ({
      title: t.title || "",
      journal: t.event || "",
      year: t.sort_year?.toString() || t.year?.toString() || t.date || "",
      type: "talk" as const,
      authors: t.speaker || "Jaya G. Suma",
    })),
  ], [journals, internationalConferences, invitedTalks]);

  // Filter and sort publications
  const filteredAndSortedPublications = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filtered = rawPublications.filter((pub) => {
      const matchesType = activeFilter === "all" || pub.type === activeFilter;
      const matchesSearch =
        !q ||
        pub.title.toLowerCase().includes(q) ||
        pub.journal.toLowerCase().includes(q) ||
        pub.authors.toLowerCase().includes(q) ||
        pub.year.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "latest") {
        const yA = parsePublicationYear(a.year);
        const yB = parsePublicationYear(b.year);
        if (yB !== yA) return yB - yA;
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "oldest") {
        const yA = parsePublicationYear(a.year);
        const yB = parsePublicationYear(b.year);
        if (yA !== yB) return yA - yB;
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  }, [rawPublications, activeFilter, searchQuery, sortBy]);

  const counts = useMemo(() => ({
    all: rawPublications.length,
    journal: rawPublications.filter(p => p.type === "journal").length,
    conference: rawPublications.filter(p => p.type === "conference").length,
    talk: rawPublications.filter(p => p.type === "talk").length,
  }), [rawPublications]);

  const filters = [
    { id: "all", label: "All Publications", count: counts.all },
    { id: "journal", label: "Journals", count: counts.journal },
    { id: "conference", label: "Conferences", count: counts.conference },
    { id: "talk", label: "Invited Talks", count: counts.talk },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
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
            Research & Publications
          </h1>

          {/* Gold Accent Underline */}
          <div className="mx-auto h-1 w-24 bg-accent rounded-full mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150" />

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            Academic contributions in Machine Learning, IoT, and Computer Science
          </p>
        </div>
      </section>

      {/* Publication Stats */}
      <section className="py-12 bg-primary">
        <div className="container-wide px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { number: journals.length.toString(), label: "Journal Articles", icon: BookOpen },
              { number: internationalConferences.length.toString(), label: "Conference Papers", icon: Users },
              { number: invitedTalks.length.toString(), label: "Invited Talks", icon: Award },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className="text-center transform transition-all duration-500 hover:scale-110 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="w-8 h-8 text-primary-foreground/70 mx-auto mb-3" />
                  <p className="font-serif text-3xl font-bold text-primary-foreground mb-1">
                    {isLoading ? "..." : item.number}
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

      {/* Publications List */}
      <section className="section-padding">
        <div className="container-wide px-6 lg:px-12">
          <SectionHeading
            title="Publications"
            subtitle="Research papers in SCOPUS-indexed journals and international conferences"
          />

          {/* Filter & Sort Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
            {/* Category Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
              <Filter size={16} className="text-muted-foreground shrink-0 hidden sm:block mr-1" />
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "institutional" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                  className="transition-all duration-200 text-xs md:text-sm whitespace-nowrap"
                >
                  <span>{filter.label}</span>
                  {!isLoading && (
                    <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[11px] ${
                      activeFilter === filter.id
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {filter.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>

            {/* Right Controls: Search + Sort By */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search papers, venue, author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 text-foreground placeholder:text-muted-foreground/70 shadow-xs"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="relative w-full sm:w-56">
                <ArrowUpDown size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-xs md:text-sm bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 text-foreground shadow-xs appearance-none cursor-pointer font-medium hover:border-accent/40 transition-colors"
                  aria-label="Sort research papers"
                >
                  <option value="latest">Sort: Latest First (Newest Year)</option>
                  <option value="oldest">Sort: Oldest First (Earliest Year)</option>
                  <option value="title-asc">Sort: Title (A - Z)</option>
                  <option value="title-desc">Sort: Title (Z - A)</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Status & Active Summary Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground mb-8 gap-2">
            <div>
              Showing <strong className="text-foreground">{filteredAndSortedPublications.length}</strong> of {rawPublications.length} publications
              {searchQuery && (
                <span> matching &ldquo;<span className="text-accent">{searchQuery}</span>&rdquo;</span>
              )}
            </div>
            <div className="inline-flex items-center gap-1.5 font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
              <Clock size={12} />
              <span>
                {sortBy === "latest" && "Sorted: Latest First"}
                {sortBy === "oldest" && "Sorted: Oldest First"}
                {sortBy === "title-asc" && "Sorted: Title (A-Z)"}
                {sortBy === "title-desc" && "Sorted: Title (Z-A)"}
              </span>
            </div>
          </div>

          {/* Publications Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading publications...
            </div>
          ) : filteredAndSortedPublications.length === 0 ? (
            <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border my-6">
              <Layers size={44} className="mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="text-base font-semibold text-primary mb-1">No publications match your criteria</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Try adjusting your search terms or filter selection.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveFilter("all");
                  setSearchQuery("");
                  setSortBy("latest");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedPublications.map((publication, index) => (
                <PublicationCard key={index} {...publication} />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Research Interests - HARDCODED */}
      <section className="section-padding">
        <div className="container-narrow px-6 lg:px-12">
          <SectionHeading
            title="Research Interests"
            subtitle="Areas of scholarly focus and ongoing research"
          />

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Machine Learning & Deep Learning", emoji: "🤖" },
              { name: "Internet of Things (IoT)", emoji: "🌐" },
              { name: "Data Mining & Big Data Analytics", emoji: "📊" },
              { name: "Vehicular Ad-hoc Networks (VANETs)", emoji: "🚗" },
              { name: "Pattern Recognition & Image Processing", emoji: "🖼️" },
              { name: "Artificial Intelligence Applications", emoji: "🧠" },
              { name: "Disaster Management Systems", emoji: "🆘" },
              { name: "Healthcare Informatics", emoji: "🏥" },
            ].map((interest, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-accent hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                  {interest.emoji}
                </span>
                <span className="text-foreground/80 group-hover:text-foreground transition-colors font-medium">
                  {interest.name}
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

export default PublicationsPage;
