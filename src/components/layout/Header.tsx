import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, Award, Users, Sparkles, Compass, Globe, ChevronDown, Gamepad2, GraduationCap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Experience & Education", href: "/experience" },
];

const dropdownItems = [
  { label: "Publications", href: "/publications", desc: "Journals and papers", icon: BookOpen },
  { label: "Achievements", href: "/achievements", desc: "National awards & honors", icon: Award },
  { label: "Scholars", href: "/scholars", desc: "Ph.D. guidance and research", icon: Users },
  { label: "Learning Symposium", href: "/learning-symposium", desc: "FDPs & workshops", icon: Sparkles },
  { label: "Contributions", href: "/education", desc: "Administrative duties", icon: Compass },
  { label: "Media", href: "/media", desc: "Press and newspaper coverage", icon: Globe },
];

const qlearnDropdownItems = [
  { label: "Courses", href: "/qlearn", desc: "10-module domains & lecture roadmaps", icon: GraduationCap },
  { label: "All Puzzles & Hub", href: "/qlearn?tab=puzzles", desc: "Select subject, play word connect & rankings", icon: Gamepad2 },
];

const PUZZLE_SUBJECTS = [
  { id: "quantum-computing", label: "Quantum Computing", icon: "⚛️" },
  { id: "data-science", label: "Data Science", icon: "📊" },
  { id: "machine-learning", label: "Machine Learning", icon: "🤖" },
  { id: "deep-learning", label: "Deep Learning", icon: "🧠" },
  { id: "iot-internet-of-things", label: "IoT", icon: "🌐" },
  { id: "agentic-ai", label: "Agentic AI", icon: "⚡" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isMobileQLearnOpen, setIsMobileQLearnOpen] = useState(false);
  const location = useLocation();

  /* ---------- Scroll detection ---------- */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------- Close mobile menu on route change ---------- */
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileDropdownOpen(false);
    setIsMobileQLearnOpen(false);
  }, [location]);

  /* ---------- Close mobile menu on ESC ---------- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsMobileDropdownOpen(false);
        setIsMobileQLearnOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const isDropdownActive = dropdownItems.some(item => location.pathname === item.href);
  const isQLearnActive = location.pathname === "/qlearn";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-change-transform no-print",
        isScrolled
          ? "bg-card shadow-subtle py-3 border-b border-border/40"
          : "bg-card py-4 border-b border-border/10"
      )}
    >
      <div className="container-wide px-6 lg:px-12">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex flex-col transition-opacity hover:opacity-80"
            aria-label="Go to home page"
          >
            <span className="font-serif text-lg md:text-xl font-semibold text-primary tracking-wide">
              Dr. G. Jaya Suma
            </span>
            <span className="text-xs md:text-sm text-muted-foreground tracking-wider uppercase">
             Professor
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Render first three items: Home, About, Experience */}
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "px-3 py-2 text-sm font-medium relative transition-colors",
                    "after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:bg-accent",
                    "after:scale-x-0 after:origin-left after:transition-transform after:duration-300",
                    "hover:after:scale-x-100",
                    isActive
                      ? "text-primary after:scale-x-100"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Academic & Contributions Dropdown */}
            <div className="relative group py-2">
              <button
                className={cn(
                  "flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground",
                  isDropdownActive && "text-accent font-semibold"
                )}
              >
                Contributions
                <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
              </button>
              
              {/* Contributions Dropdown Menu Overlay */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-80 md:w-[350px] bg-card/98 backdrop-blur-md border border-border shadow-xl rounded-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-50">
                <div className="grid grid-cols-1 gap-1.5">
                  {dropdownItems.map((item) => {
                    const ItemIcon = item.icon;
                    const isItemActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-muted/70 group/item",
                          isItemActive ? "bg-accent/10 text-accent font-medium" : "text-foreground hover:text-accent"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg flex-shrink-0 transition-colors",
                          isItemActive ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground group-hover/item:bg-accent/15 group-hover/item:text-accent"
                        )}>
                          <ItemIcon size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold group-hover/item:text-accent transition-colors">{item.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 leading-normal">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* QLearn Dropdown (Courses & Puzzles) */}
            <div className="relative group py-2">
              <button
                className={cn(
                  "flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground",
                  isQLearnActive && "text-accent font-semibold"
                )}
              >
                QLearn
                <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
              </button>
              
              {/* QLearn Dropdown Menu Overlay */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[380px] bg-card/98 backdrop-blur-md border border-border shadow-xl rounded-2xl p-3.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-50">
                <div className="grid grid-cols-1 gap-2">
                  {qlearnDropdownItems.map((item) => {
                    const ItemIcon = item.icon;
                    const isItemActive = location.pathname === "/qlearn" && (
                      (item.href === "/qlearn" && !location.search.includes("tab=puzzles")) ||
                      (item.href.includes("tab=puzzles") && location.search.includes("tab=puzzles") && !location.search.includes("subject="))
                    );
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-muted/70 group/item",
                          isItemActive ? "bg-accent/10 text-accent font-medium" : "text-foreground hover:text-accent"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg flex-shrink-0 transition-colors",
                          isItemActive ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground group-hover/item:bg-accent/15 group-hover/item:text-accent"
                        )}>
                          <ItemIcon size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold group-hover/item:text-accent transition-colors">{item.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 leading-normal">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Quick Subject Selectors */}
                <div className="mt-3 pt-3 border-t border-border/70">
                  <div className="flex items-center justify-between px-1 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <span>Play Puzzle by Subject</span>
                    <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-1">
                      <Trophy size={11} /> Live Ranks
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PUZZLE_SUBJECTS.map((subj) => {
                      const isSubjActive = location.pathname === "/qlearn" && location.search.includes(`subject=${subj.id}`);
                      return (
                        <Link
                          key={subj.id}
                          to={`/qlearn?tab=puzzles&subject=${subj.id}`}
                          className={cn(
                            "flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-150",
                            isSubjActive 
                              ? "bg-amber-500/15 text-amber-600 font-bold dark:text-amber-400 border border-amber-500/30 shadow-xs" 
                              : "text-foreground bg-muted/30 hover:bg-amber-500/10 hover:text-amber-600 border border-transparent hover:border-amber-500/20"
                          )}
                        >
                          <span className="text-sm shrink-0">{subj.icon}</span>
                          <span className="truncate text-[11px]">{subj.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <Link
              to="/contact"
              aria-current={location.pathname === "/contact" ? "page" : undefined}
              className={cn(
                "px-3 py-2 text-sm font-medium relative transition-colors",
                "after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:bg-accent",
                "after:scale-x-0 after:origin-left after:transition-transform after:duration-300",
                "hover:after:scale-x-100",
                location.pathname === "/contact"
                  ? "text-primary after:scale-x-100"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border animate-fade-in max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col pt-4 space-y-1">
              {/* Main Items: Home, About, Experience */}
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "px-4 py-2.5 text-base font-medium rounded-sm transition-colors",
                      isActive
                        ? "text-primary bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile Contributions Dropdown Selector */}
              <div className="flex flex-col">
                <button
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 text-base font-medium rounded-sm text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                    isDropdownActive && "text-accent bg-accent/5 font-semibold"
                  )}
                >
                  <span>Contributions</span>
                  <ChevronDown size={18} className={cn("transition-transform duration-300", isMobileDropdownOpen && "rotate-180")} />
                </button>

                {/* Collapsible items */}
                {isMobileDropdownOpen && (
                  <div className="flex flex-col pl-6 mt-1 border-l-2 border-accent/20 space-y-0.5 animate-slide-up">
                    {dropdownItems.map((item) => {
                      const isItemActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={cn(
                            "px-4 py-2 text-sm font-medium rounded-sm transition-colors",
                            isItemActive
                              ? "text-accent bg-accent/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                          )}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile QLearn Dropdown Selector */}
              <div className="flex flex-col">
                <button
                  onClick={() => setIsMobileQLearnOpen(!isMobileQLearnOpen)}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 text-base font-medium rounded-sm text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                    isQLearnActive && "text-accent bg-accent/5 font-semibold"
                  )}
                >
                  <span>QLearn</span>
                  <ChevronDown size={18} className={cn("transition-transform duration-300", isMobileQLearnOpen && "rotate-180")} />
                </button>

                {/* Collapsible QLearn items */}
                {isMobileQLearnOpen && (
                  <div className="flex flex-col pl-6 mt-1 border-l-2 border-accent/20 space-y-1 animate-slide-up">
                    {qlearnDropdownItems.map((item) => {
                      const isItemActive = location.pathname === "/qlearn" && (
                        (item.href === "/qlearn" && !location.search.includes("tab=puzzles")) ||
                        (item.href.includes("tab=puzzles") && location.search.includes("tab=puzzles") && !location.search.includes("subject="))
                      );
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={cn(
                            "px-4 py-2 text-sm font-medium rounded-sm transition-colors",
                            isItemActive
                              ? "text-accent bg-accent/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                          )}
                        >
                          {item.label}
                        </Link>
                      );
                    })}

                    <div className="pt-2 pl-2 border-t border-border/50">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center justify-between pr-2">
                        <span>Puzzle Subjects</span>
                        <span className="text-amber-500 font-bold text-[9px]">Live Games</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 pr-2">
                        {PUZZLE_SUBJECTS.map((subj) => {
                          const isSubjActive = location.pathname === "/qlearn" && location.search.includes(`subject=${subj.id}`);
                          return (
                            <Link
                              key={subj.id}
                              to={`/qlearn?tab=puzzles&subject=${subj.id}`}
                              className={cn(
                                "flex items-center gap-1.5 px-2 py-1.5 text-xs rounded transition-colors",
                                isSubjActive
                                  ? "bg-amber-500/15 text-amber-600 font-bold dark:text-amber-400"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                              )}
                            >
                              <span>{subj.icon}</span>
                              <span className="truncate">{subj.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact */}
              <Link
                to="/contact"
                aria-current={location.pathname === "/contact" ? "page" : undefined}
                className={cn(
                  "px-4 py-2.5 text-base font-medium rounded-sm transition-colors",
                  location.pathname === "/contact"
                    ? "text-primary bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
