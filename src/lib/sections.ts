import {
  Award, Users, Sparkles, Compass, Globe, GraduationCap, FolderGit2, Mic,
  UserRound, MessagesSquare, type LucideIcon,
} from "lucide-react";

/* ================= AUDIENCE SECTIONS =================
 * Every public URL belongs to one section. The header shows only that
 * section's links, and index.css re-tints --accent per section.
 */
export type SectionId = "profile" | "students" | "connect";

export type NavLinkItem = { label: string; href: string; desc?: string; icon?: LucideIcon; emoji?: string };

export const SECTIONS: Record<SectionId, {
  label: string;
  home: string;
  icon: LucideIcon;
  links: NavLinkItem[];
  moreLabel?: string;
  more?: NavLinkItem[];
}> = {
  profile: {
    label: "Profile",
    home: "/profile",
    icon: UserRound,
    links: [
      { label: "About", href: "/about" },
      { label: "Experience & Education", href: "/experience" },
      { label: "Publications", href: "/publications" },
      { label: "Contributions", href: "/education" },
    ],
    moreLabel: "More",
    more: [
      { label: "Projects & Innovations", href: "/projects", desc: "Student & research prototypes", icon: FolderGit2 },
      { label: "Invited Talks", href: "/education#invited-talks", desc: "Keynote addresses & guest lectures", icon: Mic },
      { label: "Achievements", href: "/achievements", desc: "National awards & honors", icon: Award },
      { label: "Scholars", href: "/scholars", desc: "Ph.D. guidance and research", icon: Users },
      { label: "Learning Symposium", href: "/learning-symposium", desc: "FDPs & workshops", icon: Sparkles },
      { label: "Media", href: "/media", desc: "Press and newspaper coverage", icon: Globe },
      { label: "Full Profile Overview", href: "/profile", desc: "Every profile page in one place", icon: Compass },
    ],
  },
  students: {
    label: "Students",
    home: "/qlearn",
    icon: GraduationCap,
    links: [
      { label: "Courses & Roadmaps", href: "/qlearn" },
      { label: "Puzzles Hub", href: "/qlearn?tab=puzzles" },
    ],
    moreLabel: "Play by Subject",
    more: [
      { label: "Quantum Computing", href: "/qlearn?tab=puzzles&subject=quantum-computing", emoji: "⚛️" },
      { label: "Data Science", href: "/qlearn?tab=puzzles&subject=data-science", emoji: "📊" },
      { label: "Machine Learning", href: "/qlearn?tab=puzzles&subject=machine-learning", emoji: "🤖" },
      { label: "Deep Learning", href: "/qlearn?tab=puzzles&subject=deep-learning", emoji: "🧠" },
      { label: "IoT", href: "/qlearn?tab=puzzles&subject=iot-internet-of-things", emoji: "🌐" },
      { label: "Agentic AI", href: "/qlearn?tab=puzzles&subject=agentic-ai", emoji: "⚡" },
    ],
  },
  connect: {
    label: "Connect",
    home: "/discuss",
    icon: MessagesSquare,
    links: [
      { label: "Discussions", href: "/discuss" },
      { label: "Contact & Requests", href: "/contact" },
    ],
  },
};

export const LAST_SECTION_KEY = "last_section";

/** Which audience section a path belongs to; null for the neutral home page. */
export function sectionFor(pathname: string): SectionId | null {
  if (pathname === "/") return null;
  if (pathname.startsWith("/qlearn")) return "students";
  if (pathname.startsWith("/contact") || pathname.startsWith("/discuss")) return "connect";
  return "profile";
}

/** Forum categories; ids must match the check constraint in supabase/discussions.sql. */
export const DISCUSSION_CATEGORIES = [
  { id: "general", label: "General" },
  { id: "ask-professor", label: "Ask the Professor" },
  { id: "quantum-computing", label: "Quantum Computing" },
  { id: "data-science", label: "Data Science" },
  { id: "machine-learning", label: "Machine Learning" },
  { id: "deep-learning", label: "Deep Learning" },
  { id: "iot-internet-of-things", label: "IoT" },
  { id: "agentic-ai", label: "Agentic AI" },
];

export const categoryLabel = (id: string) => DISCUSSION_CATEGORIES.find((c) => c.id === id)?.label ?? id;
