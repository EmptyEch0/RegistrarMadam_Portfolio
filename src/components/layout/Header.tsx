import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, GraduationCap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StudentPortalModal } from "@/components/auth/StudentPortalModal";
import { getCurrentStudent, StudentAccount } from "@/lib/academicsStorage";
import { SECTIONS, LAST_SECTION_KEY, sectionFor, type SectionId, type NavLinkItem } from "@/lib/sections";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<StudentAccount | null>(() => getCurrentStudent());
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  const section = sectionFor(location.pathname);
  const nav = SECTIONS[section ?? "profile"]; // home shows profile links by default

  useEffect(() => {
    setCurrentStudent(getCurrentStudent());
    try {
      setIsAdmin(localStorage.getItem("admin_authenticated") === "true");
    } catch {
      setIsAdmin(false);
    }
  }, [location, studentModalOpen]);

  /* ---------- Section tint + remember last section ---------- */
  useEffect(() => {
    const root = document.documentElement;
    if (!section || location.pathname.startsWith("/admin")) {
      delete root.dataset.section;
      return;
    }
    root.dataset.section = section;
    try {
      localStorage.setItem(LAST_SECTION_KEY, section);
    } catch {
      /* storage blocked: nothing to remember */
    }
    return () => {
      delete root.dataset.section;
    };
  }, [section, location.pathname]);

  /* ---------- Scroll detection ---------- */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------- Close mobile menu on route change / ESC ---------- */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Hide the public header completely inside any /admin route
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  /** "/qlearn?tab=puzzles" matches its sub-pages; plain paths match only without tab/hash. */
  const isActive = (href: string) => {
    const [path, rest = ""] = href.split(/(?=[?#])/);
    if (path !== location.pathname) return false;
    if (rest.startsWith("?")) return location.search.startsWith(rest);
    if (rest.startsWith("#")) return location.hash === rest;
    return !location.search.includes("tab=") && !location.hash;
  };
  const isMoreActive = !!nav.more?.some((item) => isActive(item.href));

  const linkClass = (active: boolean) =>
    cn(
      "px-2.5 xl:px-3 py-2 text-[13px] xl:text-[14px] 2xl:text-[15px] font-medium whitespace-nowrap relative transition-colors",
      "after:absolute after:left-2.5 after:right-2.5 after:-bottom-0.5 after:h-0.5 after:bg-accent",
      "after:scale-x-0 after:origin-left after:transition-transform after:duration-300",
      "hover:after:scale-x-100",
      active ? "text-primary after:scale-x-100 font-semibold" : "text-muted-foreground hover:text-foreground"
    );

  const renderItemIcon = (item: NavLinkItem, active: boolean) =>
    item.emoji ? (
      <span className="text-base leading-none w-8 h-8 flex items-center justify-center shrink-0">{item.emoji}</span>
    ) : item.icon ? (
      <div
        className={cn(
          "p-2 rounded-lg flex-shrink-0 transition-colors",
          active ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground group-hover/item:bg-accent/15 group-hover/item:text-accent"
        )}
      >
        <item.icon size={16} />
      </div>
    ) : null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-change-transform no-print bg-card",
          isScrolled ? "shadow-subtle border-b border-border/40" : "border-b border-border/10"
        )}
      >
        {/* Audience switcher strip */}
        <div className="bg-muted/50 border-b border-border/50">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-center sm:justify-end gap-1 py-1">
            <span className="hidden sm:inline text-[11px] font-medium text-muted-foreground mr-1.5">I'm here for:</span>
            {(Object.keys(SECTIONS) as SectionId[]).map((id) => {
              const s = SECTIONS[id];
              const active = section === id;
              return (
                <Link
                  key={id}
                  to={s.home}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold transition-colors",
                    active
                      ? "bg-accent text-accent-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-card"
                  )}
                >
                  <s.icon size={12} />
                  {s.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div
          className={cn(
            "w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 transition-all duration-300",
            isScrolled ? "py-2" : "py-3"
          )}
        >
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex flex-col transition-opacity hover:opacity-80 shrink-0 mr-2 xl:mr-4"
              aria-label="Go to home page"
            >
              <span className="font-serif text-base md:text-lg xl:text-xl font-semibold text-primary tracking-wide whitespace-nowrap">
                Dr. G. Jaya Suma
              </span>
              <span className="text-[10px] md:text-[11px] xl:text-xs text-muted-foreground font-medium tracking-wide whitespace-nowrap">
                Professor of Information Technology · JNTU-GV
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 2xl:gap-2">
              {nav.links.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={linkClass(isActive(item.href))}
                >
                  {item.label}
                </Link>
              ))}

              {nav.more && (
                <div className="relative group py-2">
                  <button
                    className={cn(
                      "flex items-center gap-1 px-2.5 xl:px-3 py-2 text-[13px] xl:text-[14px] 2xl:text-[15px] font-medium whitespace-nowrap transition-colors text-muted-foreground hover:text-foreground",
                      isMoreActive && "text-accent font-semibold"
                    )}
                  >
                    {nav.moreLabel}
                    <ChevronDown size={15} className="transition-transform duration-300 group-hover:rotate-180" />
                  </button>

                  <div className="absolute top-full right-0 w-80 md:w-[350px] bg-card/98 backdrop-blur-md border border-border shadow-xl rounded-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-50">
                    <div className={cn("grid gap-1.5", nav.more.some((i) => i.emoji) ? "grid-cols-2" : "grid-cols-1")}>
                      {nav.more.map((item) => {
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                              "flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-muted/70 group/item",
                              active ? "bg-accent/10 text-accent font-medium" : "text-foreground hover:text-accent"
                            )}
                          >
                            {renderItemIcon(item, active)}
                            <div className="self-center">
                              <div className="text-sm font-semibold group-hover/item:text-accent transition-colors">{item.label}</div>
                              {item.desc && <div className="text-xs text-muted-foreground mt-0.5 leading-normal">{item.desc}</div>}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {section !== "connect" && (
                <Link to="/contact" className={linkClass(false)}>
                  Collaborate
                </Link>
              )}

              {/* Right-most corner: Admin Dashboard OR Student Login */}
              <div className="ml-1 pl-2 border-l border-border/60 flex items-center shrink-0">
                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/20 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/40 text-amber-700 dark:text-amber-400 font-semibold text-xs xl:text-sm transition-all shadow-xs transform hover:scale-105 active:scale-95"
                    title="Open Admin Dashboard"
                  >
                    <ShieldCheck size={15} className="text-amber-600 dark:text-amber-400" />
                    <span>Admin Dashboard</span>
                  </Link>
                ) : currentStudent ? (
                  <button
                    type="button"
                    onClick={() => setStudentModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent font-semibold text-xs transition-all shadow-xs"
                    title="Open Student Portal"
                  >
                    <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                      {currentStudent.fullName.charAt(0)}
                    </span>
                    <span className="max-w-[100px] truncate">{currentStudent.rollNo || currentStudent.fullName}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStudentModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-accent/15 via-accent/10 to-amber-500/15 hover:from-accent/25 hover:to-amber-500/25 border border-accent/40 text-primary hover:text-accent font-semibold text-xs xl:text-sm transition-all shadow-xs transform hover:scale-105 active:scale-95"
                  >
                    <GraduationCap size={15} className="text-accent" />
                    <span>Student Login</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Right Action Area: Admin / Student Login & Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              {isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 font-semibold text-xs"
                >
                  <ShieldCheck size={14} />
                  <span>Admin</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setStudentModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold text-xs"
                >
                  <GraduationCap size={14} />
                  <span>{currentStudent ? (currentStudent.rollNo || "Portal") : "Student Login"}</span>
                </button>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </nav>

          {/* Mobile Navigation: current section's links, flat */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-border animate-fade-in max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col pt-4 space-y-1">
                <Link
                  to="/"
                  className={cn(
                    "px-4 py-3 text-[17px] font-medium rounded-sm transition-colors",
                    location.pathname === "/" ? "text-primary bg-muted font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  Home
                </Link>
                {[...nav.links, ...(nav.more ?? [])].map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "px-4 py-3 text-[17px] font-medium rounded-sm transition-colors flex items-center gap-2",
                      isActive(item.href)
                        ? "text-primary bg-muted font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.emoji && <span>{item.emoji}</span>}
                    {item.label}
                  </Link>
                ))}
                {section !== "connect" && (
                  <Link to="/contact" className="px-4 py-3 text-[17px] font-medium rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50">
                    Collaborate
                  </Link>
                )}

                {/* Mobile Student / Admin Portal Button */}
                <div className="pt-2 px-1">
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-400 font-bold text-sm shadow-sm"
                    >
                      <ShieldCheck size={18} className="text-amber-600" />
                      <span>Admin Dashboard</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setStudentModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-accent/20 to-amber-500/20 border border-accent/40 text-primary font-bold text-sm shadow-sm"
                    >
                      <GraduationCap size={18} className="text-accent" />
                      <span>
                        {currentStudent
                          ? `Student Portal (${currentStudent.rollNo || currentStudent.fullName})`
                          : "Student Login / Academics Portal"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Student Portal Modal */}
      <StudentPortalModal isOpen={studentModalOpen} onClose={() => setStudentModalOpen(false)} />
    </>
  );
}
