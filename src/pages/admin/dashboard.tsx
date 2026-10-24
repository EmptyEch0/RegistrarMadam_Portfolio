import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { ClipboardList } from "lucide-react";

import {
  Award,
  BookOpen,
  Users,
  Mic,
  GraduationCap,
  Calendar,
  Settings,
  Sparkles,
  FolderGit2,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

// Section configuration with colors and metadata
const sections = [
  { 
    title: "Visitor Logs & Logins", 
    path: "/admin/visitors", 
    icon: Users, 
    color: "text-emerald-600",
    bgGradient: "from-emerald-400/20 to-teal-400/20",
    count: null
  },
  { 
    title: "Projects & Innovations", 
    path: "/admin/projects", 
    icon: FolderGit2, 
    color: "text-amber-600",
    bgGradient: "from-amber-500/20 to-orange-400/20",
    count: null
  },
  { 
    title: "QLearn Hub", 
    path: "/admin/qlearn", 
    icon: Sparkles, 
    color: "text-amber-500",
    bgGradient: "from-amber-400/20 to-yellow-400/20",
    count: null
  },
  { 
    title: "Academics & Batches", 
    path: "/admin/academics", 
    icon: GraduationCap, 
    color: "text-blue-600",
    bgGradient: "from-blue-500/20 to-indigo-400/20",
    count: null
  },
  { 
    title: "Major Awards", 
    path: "/admin/major-awards", 
    icon: Award, 
    color: "text-yellow-600",
    bgGradient: "from-yellow-400/20 to-orange-400/20",
    count: null // Will be populated from Supabase later
  },
  { 
    title: "Academic Governance", 
    path: "/admin/academic-governance", 
    icon: BookOpen, 
    color: "text-purple-600",
    bgGradient: "from-purple-400/20 to-indigo-400/20",
    count: null
  },
  { 
    title: "Committee Roles", 
    path: "/admin/committee-roles", 
    icon: Users, 
    color: "text-pink-600",
    bgGradient: "from-pink-400/20 to-rose-400/20",
    count: null
  },
  {
  title: "Media",
  path: "/admin/media",
  icon: Newspaper,
  color: "text-blue-600",
  bgGradient: "from-blue-400/20 to-sky-400/20",
  count: null
},
  { 
    title: "Journals", 
    path: "/admin/journals", 
    icon: GraduationCap, 
    color: "text-indigo-600",
    bgGradient: "from-indigo-400/20 to-blue-400/20",
    count: null
  },
  { 
    title: "Invited Talks", 
    path: "/admin/invited-talks", 
    icon: Mic, 
    color: "text-red-500",
    bgGradient: "from-red-400/20 to-orange-400/20",
    count: null
  },
  { 
    title: "Workshops Attended", 
    path: "/admin/workshops-attended", 
    icon: Calendar, 
    color: "text-green-600",
    bgGradient: "from-green-400/20 to-emerald-400/20",
    count: null
  },
  { 
    title: "Workshops Organized", 
    path: "/admin/workshops-organized", 
    icon: Settings, 
    color: "text-orange-600",
    bgGradient: "from-orange-400/20 to-yellow-400/20",
    count: null
  },
  {
  title: "Scholars",
  path: "/admin/scholars",
  icon: GraduationCap,
  color: "text-emerald-600",
  bgGradient: "from-emerald-400/20 to-teal-400/20",
  count: null,
}, {
  title: "Daily Activities",
  path: "/admin/daily-activities",
  icon: ClipboardList,
  color: "text-cyan-600",
  bgGradient: "from-cyan-400/20 to-blue-400/20",
  count: null,
}
];

// Animation variants (moved outside for performance)
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-[#0B132B] font-serif mb-1.5">
          Admin Dashboard
        </h2>
        <p className="text-[#64748B] text-sm font-medium">
          Manage your portfolio content sections, academic records, and student access
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {sections.map((section) => {
          const Icon = section.icon;
          const isHovered = hoveredCard === section.path;
          
          return (
            <motion.button
              key={section.path}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                y: -3,
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(section.path)}
              onMouseEnter={() => setHoveredCard(section.path)}
              onMouseLeave={() => setHoveredCard(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(section.path);
                }
              }}
              tabIndex={0}
              aria-label={`Go to ${section.title} management`}
              className="group relative overflow-hidden rounded-2xl bg-white border border-[#E7E2D8] p-6 sm:p-5 text-left shadow-xs transition-all duration-200 hover:shadow-lg hover:border-[#C59B27] focus:outline-none focus:ring-2 focus:ring-[#C59B27] focus:ring-offset-2"
            >
              {/* Subtle gold tint on hover */}
              <div 
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
                style={{
                  background: "radial-gradient(circle at 20% 20%, rgba(197, 155, 39, 0.08), transparent 70%)"
                }} 
              />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon in Gold */}
                <motion.div
                  animate={{
                    rotate: isHovered ? [0, -4, 4, -4, 0] : 0,
                  }}
                  transition={{ duration: 0.4 }}
                  className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] flex items-center justify-center mb-3.5 group-hover:border-[#C59B27] group-hover:bg-[#FAF8F5] transition-colors"
                >
                  <Icon 
                    className="h-5 w-5 text-[#C59B27] transition-all duration-300 group-hover:scale-110" 
                  />
                </motion.div>

                {/* Title in Navy */}
                <h3 className="text-base font-bold text-[#0B132B] transition-colors duration-200 group-hover:text-[#C59B27] mb-1">
                  {section.title}
                </h3>

                {/* Description in Muted Slate */}
                <p className="text-xs text-[#64748B] mb-3">
                  Manage {section.title.toLowerCase()}
                </p>

                {/* Status/Count indicator */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#E7E2D8]">
                  <div className="h-2 w-2 rounded-full bg-[#16845B]" />
                  <p className="text-[11px] font-semibold text-[#64748B]">
                    {section.count !== null ? `${section.count} records` : "Active & Ready"}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Quick tips section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 p-5 rounded-2xl bg-white border border-[#E7E2D8] shadow-xs"
      >
        <h3 className="text-sm font-bold text-[#0B132B] mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#C59B27]" />
          Quick Navigation & Management Tips
        </h3>
        <ul className="space-y-2 text-xs text-[#64748B]">
          <li className="flex items-start gap-2">
            <span className="text-[#C59B27] font-bold mt-0.5">→</span>
            <span className="text-[#334155]">Click any module card above or use the midnight navy sidebar to access specific administration portals.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#C59B27] font-bold mt-0.5">→</span>
            <span className="text-[#334155]">All form submissions automatically update across both local storage cache and live Supabase Cloud records.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#C59B27] font-bold mt-0.5">→</span>
            <span className="text-[#334155]">Use primary gold action buttons to save new entries, and secondary white buttons with gold outline for edits and cancellations.</span>
          </li>
        </ul>
      </motion.div>
    </AdminLayout>
  );
}
