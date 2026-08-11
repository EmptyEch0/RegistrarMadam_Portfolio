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
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: Home },
  { label: "QLearn Hub", to: "/admin/qlearn", icon: Sparkles },
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
          background: linear-gradient(135deg, #fde047 0%, #f472b6 35%, #a78bfa 65%, #60a5fa 100%);
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
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          padding: 16px 20px;
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
          color: white;
        }

        .mobile-title {
          font-size: 16px;
          font-weight: 700;
        }

        .mobile-subtitle {
          font-size: 12px;
          opacity: 0.9;
        }

        .mobile-menu-btn {
          background: rgba(255, 255, 255, 0.25);
          border: none;
          color: white;
          padding: 10px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.35);
        }

        /* ========== MOBILE OVERLAY & SIDEBAR ========== */
        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
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
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-right: 1px solid rgba(255, 255, 255, 0.3);
          padding: 80px 20px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 10px 0 40px rgba(0, 0, 0, 0.1);
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* ========== DESKTOP SIDEBAR ========== */
        .desktop-sidebar {
          width: 280px;
          padding: 28px 22px;
          color: white;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-right: 1px solid rgba(255, 255, 255, 0.3);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 5px 0 30px rgba(0, 0, 0, 0.08);
        }

        .sidebar-header {
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 32px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .sparkle-icon {
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
        }

        .sidebar-title {
          font-size: 19px;
          font-weight: 700;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .sidebar-subtitle {
          font-size: 13px;
          opacity: 0.9;
          font-weight: 500;
        }

        .desktop-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        /* ========== NAV ITEMS ========== */
        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-radius: 14px;
          color: white;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.85;
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .nav-item::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          opacity: 1;
          transform: translateX(5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .nav-item:hover::before {
          opacity: 1;
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.4);
          opacity: 1;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transform: translateX(8px);
        }

        /* ========== LOGOUT BUTTON ========== */
        .sidebar-footer {
          margin-top: 24px;
        }

        .logout-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(239, 68, 68, 0.3);
          cursor: pointer;
          background: rgba(239, 68, 68, 0.8);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .logout-btn:hover {
          background: rgba(220, 38, 38, 0.9);
          box-shadow: 0 8px 30px rgba(239, 68, 68, 0.4);
        }

        /* ========== MAIN CONTENT ========== */
        .main-content {
          flex: 1;
          padding: 32px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          overflow-y: auto;
        }

        /* ========== RESPONSIVE STYLES ========== */
        @media (max-width: 1024px) {
          .desktop-sidebar {
            width: 240px;
            padding: 24px 18px;
          }

          .main-content {
            padding: 24px;
          }

          .sidebar-title {
            font-size: 17px;
          }

          .nav-item {
            padding: 12px 16px;
            font-size: 14px;
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
            padding: 20px;
            margin-top: 72px;
          }

          .nav-item:hover {
            transform: translateX(3px);
          }

          .nav-item.active {
            transform: translateX(5px);
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
            padding: 16px;
          }

          .nav-item {
            padding: 12px 14px;
            font-size: 14px;
          }
        }

        /* ========== ANIMATIONS ========== */
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
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
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}