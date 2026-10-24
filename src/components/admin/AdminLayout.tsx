import { ReactNode, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { Newspaper } from "lucide-react";
import { GraduationCap } from "lucide-react";
import { ClipboardList } from "lucide-react";
import {
  Home,
  Award,
  BookOpen,
  Users,
  Mic,
  Calendar,
  LogOut,
  Sparkles,
  Menu,
  X,
  FolderGit2,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: Home },
  { label: "Visitor Logs", to: "/admin/visitors", icon: Users },
  { label: "Projects & Labs", to: "/admin/projects", icon: FolderGit2 },
  { label: "QLearn Hub", to: "/admin/qlearn", icon: Sparkles },
  { label: "Academics Portal", to: "/admin/academics", icon: GraduationCap },
  { label: "Major Awards", to: "/admin/major-awards", icon: Award },
  { label: "Academic Governance", to: "/admin/academic-governance", icon: BookOpen },
  { label: "Committee Roles", to: "/admin/committee-roles", icon: Users },
  { label: "Invited Talks", to: "/admin/invited-talks", icon: Mic },
  { label: "Workshops-Attended", to: "/admin/workshops-attended", icon: Calendar },
  { label: "Workshops-organized", to: "/admin/workshops-organized", icon: Calendar },
  { label: "Media", to: "/admin/media", icon: Newspaper },
  { label: "Scholars", to: "/admin/scholars", icon: GraduationCap },
  { label: "Daily Activities", to: "/admin/daily-activities", icon: ClipboardList },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("admin_authenticated");
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout-container">
      {/* Mobile Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mobile-header"
      >
        <div className="mobile-header-content">
          <div className="mobile-logo">
            <Sparkles size={24} className="sparkle-icon" />
            <div>
              <h2 className="mobile-title">Hi Jayasuma 👋</h2>
              <p className="mobile-subtitle">Admin Portfolio</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-btn"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-overlay"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="mobile-sidebar"
            >
              <nav className="mobile-nav">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `nav-item ${isActive ? "active" : ""}`
                      }
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="logout-btn"
              >
                <LogOut size={18} /> Logout
              </motion.button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="desktop-sidebar"
      >
        {/* Header */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="sidebar-header"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={24} className="sparkle-icon" />
          </motion.div>
          <div>
            <h2 className="sidebar-title">Hi Jayasuma 👋</h2>
            <p className="sidebar-subtitle">Admin Portfolio</p>
          </div>
        </motion.div>

        {/* Nav */}
        <nav className="desktop-nav">
          {navItems.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <item.icon size={20} />
                </motion.div>
                <span>{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Footer */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="sidebar-footer"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(239, 68, 68, 0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={logout}
            className="logout-btn"
          >
            <LogOut size={18} /> Logout
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="main-content"
      >
        {children}
      </motion.main>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-layout-container {
          display: flex;
          min-height: 100vh;
          background: #FAF8F5; /* Ivory background */
          color: #334155; /* Slate main text */
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          position: relative;
        }

        /* ========== MOBILE HEADER ========== */
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: #0B132B; /* Midnight navy */
          border-bottom: 1px solid #E7E2D8;
          padding: 16px 20px;
          box-shadow: 0 4px 20px rgba(11, 19, 43, 0.15);
        }

        .mobile-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mobile-logo {
          display: flex;
          gap: 12px;
          align-items: center;
          color: #FFFFFF;
        }

        .mobile-title {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
        }

        .mobile-subtitle {
          font-size: 12px;
          color: #94A3B8;
        }

        .mobile-menu-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(197, 155, 39, 0.4);
          color: #C59B27; /* Gold */
          padding: 10px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(197, 155, 39, 0.15);
        }

        /* ========== MOBILE OVERLAY & SIDEBAR ========== */
        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(11, 19, 43, 0.6);
          backdrop-filter: blur(4px);
          z-index: 150;
        }

        .mobile-sidebar {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          z-index: 200;
          background: #0B132B; /* Midnight navy */
          border-right: 1px solid #162248;
          padding: 80px 20px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 10px 0 40px rgba(0, 0, 0, 0.3);
          overflow-y: auto;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* ========== DESKTOP SIDEBAR ========== */
        .desktop-sidebar {
          width: 280px;
          min-width: 280px;
          padding: 24px 18px;
          color: #FFFFFF;
          background: #0B132B; /* Midnight navy background */
          border-right: 1px solid #162248;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 4px 0 25px rgba(11, 19, 43, 0.15);
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #162248 transparent;
        }

        .desktop-sidebar::-webkit-scrollbar {
          width: 5px;
        }

        .desktop-sidebar::-webkit-scrollbar-thumb {
          background: #162248;
          border-radius: 4px;
        }

        .sidebar-header {
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 24px;
          padding: 16px;
          background: #111C3D;
          border-radius: 14px;
          border: 1px solid rgba(197, 155, 39, 0.25);
        }

        .sparkle-icon {
          color: #C59B27; /* Gold */
          filter: drop-shadow(0 0 8px rgba(197, 155, 39, 0.5));
        }

        .sidebar-title {
          font-size: 17px;
          font-weight: 700;
          color: #FFFFFF; /* White */
        }

        .sidebar-subtitle {
          font-size: 12px;
          color: #94A3B8;
          font-weight: 500;
        }

        .desktop-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        /* ========== NAV ITEMS ========== */
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: 12px;
          color: #FFFFFF; /* White navigation labels */
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.9;
          border: 1px solid transparent;
          position: relative;
        }

        /* Gold icons */
        .nav-item svg {
          color: #C59B27; /* Gold icons */
          flex-shrink: 0;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          opacity: 1;
          transform: translateX(4px);
        }

        .nav-item:hover svg {
          color: #E5A93C;
          transform: scale(1.08);
        }

        /* Gold active-item highlight */
        .nav-item.active {
          background: rgba(197, 155, 39, 0.16);
          border: 1px solid rgba(197, 155, 39, 0.5);
          color: #FFFFFF; /* White navigation labels */
          opacity: 1;
          box-shadow: 0 4px 16px rgba(197, 155, 39, 0.15), inset 3px 0 0 #C59B27;
          transform: translateX(4px);
          font-weight: 600;
        }

        .nav-item.active svg {
          color: #E5A93C; /* Bright gold on active item */
          filter: drop-shadow(0 0 6px rgba(197, 155, 39, 0.6));
        }

        /* ========== LOGOUT BUTTON (White button with navy text and gold outline) ========== */
        .sidebar-footer {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(231, 226, 216, 0.15);
        }

        .logout-btn {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1.5px solid #C59B27; /* Gold outline */
          cursor: pointer;
          background: #FFFFFF; /* White button */
          color: #0B132B; /* Navy text */
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .logout-btn svg {
          color: #B42318; /* Error/delete red icon */
        }

        .logout-btn:hover {
          background: #FAF8F5; /* Ivory hover */
          border-color: #B58C1F;
          box-shadow: 0 4px 15px rgba(197, 155, 39, 0.3);
          transform: translateY(-1px);
        }

        /* ========== MAIN DASHBOARD CONTENT ========== */
        .main-content {
          flex: 1;
          padding: 32px;
          background: #FAF8F5; /* Ivory background */
          overflow-y: auto;
          color: #334155; /* Slate main text */
          min-width: 0;
        }

        /* ========== RESPONSIVE STYLES ========== */
        @media (max-width: 1024px) {
          .desktop-sidebar {
            width: 250px;
            min-width: 250px;
            padding: 20px 14px;
          }

          .main-content {
            padding: 24px;
          }

          .sidebar-title {
            font-size: 16px;
          }

          .nav-item {
            padding: 10px 14px;
            font-size: 13.5px;
          }
        }

        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none;
          }

          .mobile-header {
            display: block;
          }

          .mobile-overlay {
            display: block;
          }

          .mobile-sidebar {
            display: flex;
          }

          .main-content {
            padding: 20px 16px;
            margin-top: 68px;
          }

          .nav-item:hover {
            transform: translateX(3px);
          }

          .nav-item.active {
            transform: translateX(4px);
          }
        }

        @media (max-width: 480px) {
          .mobile-header {
            padding: 12px 16px;
          }

          .mobile-title {
            font-size: 15px;
          }

          .mobile-subtitle {
            font-size: 11px;
          }

          .mobile-sidebar {
            width: 260px;
          }

          .main-content {
            padding: 16px 12px;
          }

          .nav-item {
            padding: 11px 14px;
            font-size: 13.5px;
          }
        }

        .sparkle-icon {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.75;
          }
        }
      `}</style>
    </div>
  );
}