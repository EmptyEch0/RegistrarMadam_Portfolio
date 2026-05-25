import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, Award, Users, Sparkles, Compass, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Experience & Education", href: "/experience" },
  { label: "QLearn", href: "/qlearn" },
  { label: "Contact", href: "/contact" },
];

const dropdownItems = [
  { label: "Publications", href: "/publications", desc: "Journals and papers", icon: BookOpen },
  { label: "Achievements", href: "/achievements", desc: "National awards & honors", icon: Award },
  { label: "Scholars", href: "/scholars", desc: "Ph.D. guidance and research", icon: Users },
  { label: "Learning Symposium", href: "/learning-symposium", desc: "FDPs & workshops", icon: Sparkles },
  { label: "Contributions", href: "/education", desc: "Administrative duties", icon: Compass },
  { label: "Media", href: "/media", desc: "Press and newspaper coverage", icon: Globe },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
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
  }, [location]);

  /* ---------- Close mobile menu on ESC ---------- */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsMobileDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const isDropdownActive = dropdownItems.some(item => location.pathname === item.href);

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
             DAA&P | Head of Women Empowerment Cell
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Render first three items: Home, About, Experience */}
            {mainNavItems.slice(0, 3).map((item) => {
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
                  "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground",
                  isDropdownActive && "text-accent font-semibold"
                )}
              >
                Contributions
                <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
              </button>
              
              {/* Dropdown Menu Overlay */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-80 bg-card/98 backdrop-blur-md border border-border shadow-xl rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-50">
                <div className="grid grid-cols-1 gap-1.5">
                  {dropdownItems.map((item) => {
                    const ItemIcon = item.icon;
                    const isItemActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-start gap-3 p-2.5 rounded-lg transition-all duration-200 hover:bg-muted/70",
                          isItemActive ? "bg-accent/10 text-accent font-medium" : "text-foreground hover:text-accent"
                        )}
                      >
                        <div className={cn(
                          "p-1.5 rounded-md flex-shrink-0",
                          isItemActive ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                        )}>
                          <ItemIcon size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold">{item.label}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 leading-normal">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Render remaining items: QLearn, Contact */}
            {mainNavItems.slice(3).map((item) => {
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
              {/* First 3 Main Items */}
              {mainNavItems.slice(0, 3).map((item) => {
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

              {/* Remaining Main Items */}
              {mainNavItems.slice(3).map((item) => {
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
