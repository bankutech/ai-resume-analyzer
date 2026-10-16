import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ResumeListPage } from './pages/resumes/ResumeListPage';
import { NewResumePage } from './pages/resumes/NewResumePage';
import { ResumeImportPage } from './pages/resumes/ResumeImportPage';
import { ResumeEditorPage } from './pages/editor/ResumeEditorPage';
import { ResumePrintPage } from './pages/print/ResumePrintPage';
import { PublicResumeViewPage } from './pages/resumes/PublicResumeViewPage';
import { AtsCheckerPage } from './pages/ats/AtsCheckerPage';
import { JobMatcherPage } from './pages/jobs/JobMatcherPage';
import { AiStudioPage } from './pages/ai/AiStudioPage';
import { ApplicationsPage } from './pages/applications/ApplicationsPage';
import { ProfileSettingsPage } from './pages/profile/ProfileSettingsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { CoverLettersPage } from './pages/cover-letters/CoverLettersPage';
import { SavedJobsPage } from './pages/jobs/SavedJobsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { Loader2 } from 'lucide-react';

import { ToastProvider } from './context/ToastContext';
import { NoiseOverlay } from './components/ui/NoiseOverlay';
import { useLenis } from './hooks/useLenis';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-carbon-950 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        <span>Authenticating session with Neon Cloud...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const AppContent: React.FC = () => {
  useLenis();

  return (
    <>
      <NoiseOverlay />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Public Shareable Resume & QR View */}
        <Route path="/r/:id" element={<PublicResumeViewPage />} />
        <Route path="/share/:id" element={<PublicResumeViewPage />} />

        {/* Dedicated Print Route for Puppeteer Headless PDF Export */}
        <Route path="/print/resumes/:id" element={<ResumePrintPage />} />

        {/* Protected Application Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Standalone Full-Screen 3-Pane Studio */}
          <Route path="/app/resumes/:id/edit" element={<ResumeEditorPage />} />

          {/* Standard App Shell with Sidebar */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="resumes" element={<ResumeListPage />} />
            <Route path="resumes/new" element={<NewResumePage />} />
            <Route path="resumes/import" element={<ResumeImportPage />} />
            <Route path="ats-checker" element={<AtsCheckerPage />} />
            <Route path="job-matcher" element={<JobMatcherPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="tailor" element={<AiStudioPage />} />
            <Route path="cover-letters" element={<CoverLettersPage />} />
            <Route path="saved-jobs" element={<SavedJobsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfileSettingsPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppContent />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
