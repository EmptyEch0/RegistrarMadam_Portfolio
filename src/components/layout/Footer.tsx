import { Link, useLocation } from "react-router-dom";
import { Mail, MapPin, Phone, Github, ExternalLink, Globe, Sparkles, FolderGit2, BookOpen, Award, GraduationCap, Users, MessagesSquare, ArrowRight } from "lucide-react";

/* Cross-links shown above the footer; the current page is skipped and the first 3 left are shown. */
const RECOMMENDATIONS = [
  { href: "/projects", label: "View our Guided Projects", desc: "Live student applications & developer credits", icon: FolderGit2 },
  { href: "/education", label: "View our Contributions", desc: "Textbooks, talks, workshops & governance", icon: BookOpen },
  { href: "/qlearn", label: "Explore QLearn", desc: "10-module courses, videos & puzzle games", icon: GraduationCap },
  { href: "/publications", label: "Read our Publications", desc: "Journals, conferences & research papers", icon: Award },
  { href: "/scholars", label: "Meet our Scholars", desc: "Ph.D. guidance and research", icon: Users },
  { href: "/discuss", label: "Join the Discussions", desc: "Ask questions and share ideas", icon: MessagesSquare },
];

function ExploreMore() {
  const { pathname } = useLocation();
  const picks = RECOMMENDATIONS.filter((r) => !pathname.startsWith(r.href)).slice(0, 3);

  return (
    <section className="no-print bg-muted/40 border-t border-border">
      <div className="container-wide px-6 lg:px-12 py-12">
        <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-6 flex items-center gap-2">
          <Sparkles size={14} />
          <span>Explore More</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {picks.map(({ href, label, desc, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className="group flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-md transition-all duration-300"
            >
              <span className="p-3 rounded-xl bg-accent/15 text-accent shrink-0 group-hover:scale-110 transition-transform">
                <Icon size={20} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-semibold text-foreground">{label}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{desc}</span>
              </span>
              <ArrowRight size={16} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
    <ExploreMore />
    <footer className="bg-primary text-primary-foreground no-print border-t border-primary-foreground/10">
      {/* Top Banner / Bio Section */}
      <div className="container-wide px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-primary-foreground/15">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold uppercase tracking-wider border border-accent/25">
              <GraduationCap size={14} />
              <span>JNTU-GV University Portfolio</span>
            </div>
            <h3 className="font-serif text-3xl font-bold tracking-tight">
              Dr. G. Jaya Suma
            </h3>
            <p className="text-primary-foreground/80 leading-relaxed text-sm max-w-xl">
              Professor of Information Technology, Director of Academic Audit (DAA), and BOS Member at JNTU-GV Gurajada University. Mentoring students, fostering innovation, and advancing academic excellence with over nearly three decades of distinguished leadership.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col sm:flex-row gap-6 lg:justify-end items-start sm:items-center">
            {/* Quick action card 1: QLearn Platform */}
            <Link
              to="/qlearn"
              className="group p-4 rounded-2xl bg-primary-foreground/5 hover:bg-primary-foreground/10 border border-primary-foreground/15 transition-all duration-300 w-full sm:w-64"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-accent/20 text-accent group-hover:scale-110 transition-transform">
                  <Globe size={18} />
                </span>
                <ExternalLink size={14} className="text-primary-foreground/60 group-hover:text-accent transition-colors" />
              </div>
              <p className="text-xs font-bold text-accent uppercase tracking-wider">Interactive Learning</p>
              <p className="font-semibold text-sm text-primary-foreground mt-0.5">jayasuma.com/qlearn</p>
              <p className="text-[11px] text-primary-foreground/70 mt-1">10-Module roadmaps & puzzle games</p>
            </Link>

            {/* Quick action card 2: Student Projects */}
            <Link
              to="/projects"
              className="group p-4 rounded-2xl bg-primary-foreground/5 hover:bg-primary-foreground/10 border border-primary-foreground/15 transition-all duration-300 w-full sm:w-64"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-accent/20 text-accent group-hover:scale-110 transition-transform">
                  <FolderGit2 size={18} />
                </span>
                <ExternalLink size={14} className="text-primary-foreground/60 group-hover:text-accent transition-colors" />
              </div>
              <p className="text-xs font-bold text-accent uppercase tracking-wider">Innovation Lab</p>
              <p className="font-semibold text-sm text-primary-foreground mt-0.5">Guided Projects Hub</p>
              <p className="text-[11px] text-primary-foreground/70 mt-1">Live applications & developer credits</p>
            </Link>
          </div>
        </div>

        {/* Structured Sitemap Grid */}
        <div className="pt-12 pb-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-8 flex items-center gap-2">
            <Sparkles size={14} />
            <span>Complete Website Sitemap & Directory</span>
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
            {/* Column 1: Academic Profile */}
            <div>
              <h5 className="font-serif text-base font-semibold text-primary-foreground mb-4 pb-2 border-b border-primary-foreground/15">
                Academic Profile
              </h5>
              <ul className="space-y-2.5 text-xs md:text-sm">
                <li>
                  <Link to="/" className="text-primary-foreground/75 hover:text-accent transition-colors">
                    Home Page
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-primary-foreground/75 hover:text-accent transition-colors">
                    About & Biography
                  </Link>
                </li>
                <li>
                  <Link to="/experience" className="text-primary-foreground/75 hover:text-accent transition-colors">
                    Professional Experience
                  </Link>
                </li>
                <li>
                  <Link to="/education" className="text-primary-foreground/75 hover:text-accent transition-colors">
                    Academic Qualifications
                  </Link>
                </li>
                <li>
                  <Link to="/scholars" className="text-primary-foreground/75 hover:text-accent transition-colors">
                    Ph.D. Research Scholars
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Contributions & Research */}
            <div>
              <h5 className="font-serif text-base font-semibold text-primary-foreground mb-4 pb-2 border-b border-primary-foreground/15">
                Contributions & Research
              </h5>
              <ul className="space-y-2.5 text-xs md:text-sm">
                <li>
                  <Link to="/publications" className="text-primary-foreground/75 hover:text-accent transition-colors">
                    Research & Publications
                  </Link>
                </li>
                <li>
                  <Link to="/achievements" className="text-primary-foreground/75 hover:text-accent transition-colors">
                    Major Awards & Honors
                  </Link>
                </li>
                <li>
                  <Link to="/learning-symposium" className="text-primary-foreground/75 hover:text-accent transition-colors">
                    Learning Symposium & FDPs
                  </Link>
                </li>
                <li>
                  <Link to="/media" className="text-primary-foreground/75 hover:text-accent transition-colors">
                    Media & Press Coverage
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-primary-foreground/75 hover:text-accent transition-colors">
                    Collaborate
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Platforms & Innovations */}
            <div>
              <h5 className="font-serif text-base font-semibold text-primary-foreground mb-4 pb-2 border-b border-primary-foreground/15">
                Platforms & Innovations
              </h5>
              <ul className="space-y-2.5 text-xs md:text-sm">
                <li>
                  <Link to="/projects" className="text-primary-foreground/75 hover:text-accent transition-colors flex items-center gap-1.5 font-medium text-accent">
                    <FolderGit2 size={13} /> Guided Projects Hub
                  </Link>
                </li>
                <li>
                  <Link to="/qlearn" className="text-primary-foreground/75 hover:text-accent transition-colors">
                    jayasuma.com/qlearn
                  </Link>
                </li>
                <li>
                  <Link to="/qlearn?tab=puzzles" className="text-primary-foreground/75 hover:text-accent transition-colors">
                    Word Connect Puzzles & Rankings
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: University Contact Info */}
            <div>
              <h5 className="font-serif text-base font-semibold text-primary-foreground mb-4 pb-2 border-b border-primary-foreground/15">
                Official Contact
              </h5>
              <ul className="space-y-3 text-xs md:text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-accent mt-0.5 shrink-0" />
                  <span className="text-primary-foreground/80 leading-relaxed">
                    Dept. of Information Technology,
                    <br />
                    JNTU-GV Gurajada University,
                    <br />
                    Vizianagaram, AP – 535003
                  </span>
                </li>

                <li className="flex items-center gap-2.5">
                  <Mail size={16} className="text-accent shrink-0" />
                  <a
                    href="mailto:gjsuma.it@jntugvcev.edu.in"
                    className="text-primary-foreground/80 hover:text-accent transition-colors truncate"
                  >
                    gjsuma.it@jntugvcev.edu.in
                  </a>
                </li>

                <li className="flex items-center gap-2.5">
                  <Phone size={16} className="text-accent shrink-0" />
                  <span className="text-primary-foreground/80">
                    +91 089222 94316
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Credits Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/15">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-primary-foreground/60 text-xs md:text-sm">
              © {currentYear} Dr. G. Jaya Suma · Professor of Information Technology, JNTU-GV. All rights reserved.
            </p>

            <a
              href="https://github.com/EmptyEch0"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-primary-foreground/70 text-xs md:text-sm transition-all duration-300 hover:text-accent"
            >
              <Github
                size={16}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span>
                Designed & Developed by{" "}
                <span className="font-semibold text-primary-foreground group-hover:text-accent transition-colors">
                  M Likhith Kumar
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
