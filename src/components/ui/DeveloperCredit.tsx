import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion";
import { Code2, ExternalLink, Github, Globe, Linkedin, Mail } from "lucide-react";
import DeveloperPhoto from "@/assets/developer-photo.jpg";

const ROLES = ["AI/ML Engineer", "Full-Stack Developer", "LLM & Agentic AI Builder"];
const SKILLS = ["LLMs", "Agentic AI", "RAG Pipelines", "React + TypeScript", "Supabase"];
const LINKS = [
  { href: "https://github.com/EmptyEch0", label: "GitHub", icon: Github },
  { href: "https://likhith.online", label: "Portfolio", icon: Globe },
  { href: "https://www.linkedin.com/in/likhithmankala/", label: "LinkedIn", icon: Linkedin },
];

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function DeveloperCredit() {
  const [role, setRole] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRole((r) => (r + 1) % ROLES.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="group relative max-w-4xl mx-auto rounded-2xl p-[1.5px] overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500"
      >
        {/* Rotating gradient border */}
        <div className="absolute inset-[-60%] bg-[conic-gradient(from_0deg,transparent_0deg,hsl(var(--accent))_70deg,transparent_140deg,transparent_360deg)] opacity-50 group-hover:opacity-100 transition-opacity duration-500 motion-safe:animate-[spin_7s_linear_infinite]" />

        <div className="relative rounded-[calc(1rem-1.5px)] bg-gradient-to-br from-card via-card to-accent/5 p-6 sm:p-8 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none motion-safe:animate-pulse" />

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8"
          >
            {/* Photo */}
            <motion.div variants={item} className="relative shrink-0">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute -inset-1.5 rounded-[1.25rem] bg-gradient-to-tr from-accent/60 via-accent/10 to-primary/40 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-accent/50 bg-muted/40">
                  <img
                    src={DeveloperPhoto}
                    alt="M Likhith Kumar - Website Designer & Developer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 flex" title="Platform Developer">
                  <span className="absolute inset-0 rounded-full bg-accent/60 motion-safe:animate-ping" />
                  <span className="relative bg-accent text-accent-foreground p-1.5 rounded-full shadow-md border-2 border-card">
                    <Code2 size={13} />
                  </span>
                </span>
              </motion.div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-center md:text-left space-y-3">
              <motion.p variants={item} className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Designed & Developed by
              </motion.p>

              <motion.div variants={item}>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary to-accent bg-[length:200%_auto] bg-clip-text text-transparent group-hover:bg-right transition-[background-position] duration-700">
                  M Likhith Kumar
                </h3>
                <div className="mt-1 flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 text-sm font-medium">
                  <span className="relative inline-flex h-5 min-w-[11rem] overflow-hidden text-accent">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={ROLES[role]}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-x-0 md:left-0 md:right-auto whitespace-nowrap"
                      >
                        {ROLES[role]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="text-muted-foreground/60 hidden sm:inline">·</span>
                  <span className="text-xs text-muted-foreground">JNTU-GV IT (2023–2027)</span>
                </div>
              </motion.div>

              <motion.p variants={item} className="text-xs sm:text-sm text-foreground/80 leading-relaxed max-w-2xl">
                Architected this digital portfolio, the QLearn interactive platform, course puzzles, and the academic governance systems.
              </motion.p>

              <motion.ul variants={container} className="flex flex-wrap justify-center md:justify-start gap-1.5">
                {SKILLS.map((s) => (
                  <motion.li
                    key={s}
                    variants={item}
                    whileHover={{ y: -2 }}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-accent/10 text-foreground/80 border border-accent/25 hover:border-accent/60 hover:bg-accent/20 transition-colors cursor-default"
                  >
                    {s}
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={item} className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href="mailto:likhithmanakala@gmail.com?subject=Inquiry%20regarding%20Dr.%20G.%20Jaya%20Suma%20Portfolio"
                  className="relative overflow-hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-accent text-accent-foreground shadow-sm hover:shadow-lg hover:shadow-accent/30 transition-shadow before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
                >
                  <Mail size={15} />
                  <span>Contact Developer</span>
                </motion.a>

                {LINKS.map(({ href, label, icon: Icon }) => (
                  <motion.a
                    key={label}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-card border border-border/80 text-foreground/80 hover:text-foreground hover:border-accent/50 shadow-xs hover:shadow-md transition-[color,border-color,box-shadow]"
                  >
                    <Icon size={15} className="group-hover/link:text-accent transition-colors" />
                    <span>{label}</span>
                    <ExternalLink size={12} className="text-muted-foreground group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </MotionConfig>
  );
}
