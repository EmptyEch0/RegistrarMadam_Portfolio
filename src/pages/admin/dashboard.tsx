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
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

// Section configuration with colors and metadata
const sections = [
  { 
    title: "QLearn Hub", 
    path: "/admin/qlearn", 
    icon: Sparkles, 
    color: "text-amber-500",
    bgGradient: "from-amber-400/20 to-yellow-400/20",
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
        <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
          Admin Dashboard
        </h2>
        <p className="text-white/80 text-sm font-medium">
          Manage your portfolio content sections
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
                y: -4,
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
              className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 p-6 sm:p-5 text-left shadow-lg transition-all duration-300 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {/* Gradient glow background on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${section.bgGradient}`}
              />

              {/* Radial glow effect */}
              <div 
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
                style={{
                  background: "radial-gradient(circle at 30% 20%, rgba(250,204,21,0.25), transparent 60%)"
                }} 
              />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  animate={{
                    rotate: isHovered ? [0, -5, 5, -5, 0] : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon 
                    className={`mb-3 h-6 w-6 sm:h-7 sm:w-7 ${section.color} transition-all duration-300 group-hover:scale-110 drop-shadow-md`} 
                  />
                </motion.div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 transition-transform duration-300 group-hover:translate-x-1 mb-1">
                  {section.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-2">
                  Manage {section.title.toLowerCase()}
                </p>

                {/* Status/Count indicator */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs font-medium text-gray-500">
                    {section.count !== null ? `${section.count} records` : "Ready to manage"}
                  </p>
                </div>
              </div>

              {/* Animated border gradient on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: "linear-gradient(120deg, rgba(253,224,71,0.5), rgba(245,158,11,0.5), rgba(244,114,182,0.5))",
                  padding: "2px",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />
            </motion.button>
          );
        })}
      </motion.div>

      {/* Quick stats section (optional) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 p-5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg"
      >
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          Quick Tips
        </h3>
        <ul className="space-y-2 text-xs text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-0.5">→</span>
            <span>Click any card to manage that section's content</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-0.5">→</span>
            <span>Use keyboard navigation with Tab and Enter for quick access</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-0.5">→</span>
            <span>Changes are automatically synced across all devices</span>
          </li>
        </ul>
      </motion.div>
    </AdminLayout>
  );
}
