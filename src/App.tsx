import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// ================= PUBLIC PAGES =================
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ExperiencePage from "./pages/ExperiencePage";
import AchievementsPage from "./pages/AchievementsPage";
import PublicationsPage from "./pages/PublicationsPage";
import MediaPage from "./pages/MediaPage";
import EducationPage from "./pages/EducationPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import LearningSymposiumPage from "@/pages/LearningSymposiumPage";
import ScholarsPage from "@/pages/ScholarsPage";
import QLearnPage from "./pages/QLearnPage";

// ================= ADMIN COMPONENTS =================
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AuthCallback from "@/components/auth/AuthCallback";

// ================= ADMIN PAGES =================
import AdminLogin from "./pages/admin/login";
import AdminDashboard from "./pages/admin/dashboard";
import MajorAwardsAdmin from "./pages/admin/major-awards";
import AcademicGovernanceAdmin from "./pages/admin/academic-governance";
import CommitteeRolesAdmin from "./pages/admin/committee-roles";
import JournalsAdmin from "./pages/admin/journals";
import InvitedTalksAdmin from "./pages/admin/invited-talks";
import WorkshopsAttendedAdmin from "./pages/admin/workshops-attended";
import WorkshopsOrganizedAdmin from "./pages/admin/workshops-organized";
import AdminMedia from "./pages/admin/media";
import ScholarsAdmin from "./pages/admin/Scholars";
import DailyActivitiesAdmin from "./pages/admin/daily-activities";

import AdminQLearn from "./pages/admin/qlearn";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/scholars" element={<ScholarsPage />} />
            <Route path="/learning-symposium" element={<LearningSymposiumPage />} />
            <Route path="/qlearn" element={<QLearnPage />} />

            {/* ================= ADMIN AUTH ================= */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/auth/callback" element={<AuthCallback />} />

            {/* ================= ADMIN PROTECTED ROUTES ================= */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route index element={<Navigate to="dashboard" replace />} />

              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="major-awards" element={<MajorAwardsAdmin />} />
              <Route path="academic-governance" element={<AcademicGovernanceAdmin />} />
              <Route path="committee-roles" element={<CommitteeRolesAdmin />} />
              <Route path="journals" element={<JournalsAdmin />} />
              <Route path="invited-talks" element={<InvitedTalksAdmin />} />
              <Route path="workshops-attended" element={<WorkshopsAttendedAdmin />} />
              <Route path="workshops-organized" element={<WorkshopsOrganizedAdmin />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="scholars" element={<ScholarsAdmin />} />
              <Route path="qlearn" element={<AdminQLearn />} />

              {/* ✅ DAILY ACTIVITIES */}
              <Route path="daily-activities" element={<DailyActivitiesAdmin />} />
            </Route>

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
