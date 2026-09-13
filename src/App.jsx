import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AnimatedPage } from './components/motion/AnimatedPage';
import { AppProvider } from './context/AppContext';
import { NavbarPremium as Navbar } from './components/layout/NavbarPremium';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/ui/Toast';
import { EmergencyBanner } from './components/common/EmergencyBanner';

import { HomeEditorial as Home } from './pages/public/HomeEditorial';
import { ScrollProgress } from './components/motion/ScrollProgress';
import { Competitions } from './pages/public/Competitions';
import { CompetitionDetail } from './pages/public/CompetitionDetail';
import { SchedulePage } from './pages/public/SchedulePage';
import { AnnouncementsPage } from './pages/public/AnnouncementsPage';
import { ResultsPage } from './pages/public/ResultsPage';
import { FaqContact } from './pages/public/FaqContact';
import { LegalPrivacy, LegalTerms } from './pages/public/LegalPages';
import { AuthPage } from './pages/public/AuthPage';
import { AccessDenied } from './pages/public/AccessDenied';
import { ProtectedRoute, AdminLoginRoute } from './components/auth/RouteGuards';

import { ParticipantDashboard } from './pages/participant/ParticipantDashboard';
import { VerifierDashboard } from './pages/committee/VerifierDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

import './styles/index.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
        <Route path="/competitions" element={<AnimatedPage><Competitions /></AnimatedPage>} />
        <Route path="/competitions/:slug" element={<AnimatedPage><CompetitionDetail /></AnimatedPage>} />
        <Route path="/schedule" element={<AnimatedPage><SchedulePage /></AnimatedPage>} />
        <Route path="/announcements" element={<AnimatedPage><AnnouncementsPage /></AnimatedPage>} />
        <Route path="/results" element={<AnimatedPage><ResultsPage /></AnimatedPage>} />
        <Route path="/faq" element={<AnimatedPage><FaqContact /></AnimatedPage>} />
        <Route path="/legal-privacy" element={<AnimatedPage><LegalPrivacy /></AnimatedPage>} />
        <Route path="/legal-terms" element={<AnimatedPage><LegalTerms /></AnimatedPage>} />
        <Route path="/auth" element={<AnimatedPage><AuthPage /></AnimatedPage>} />
        <Route path="/admin/login" element={<AdminLoginRoute><AnimatedPage><AuthPage adminOnly /></AnimatedPage></AdminLoginRoute>} />
        <Route path="/403" element={<AnimatedPage><AccessDenied /></AnimatedPage>} />
        <Route path="/access-denied" element={<Navigate to="/403" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute area="participant"><AnimatedPage><ParticipantDashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/dashboard-participant" element={<ProtectedRoute area="participant"><AnimatedPage><ParticipantDashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute area="admin"><AnimatedPage><AdminDashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/dashboard-admin" element={<ProtectedRoute area="admin"><AnimatedPage><AdminDashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/dashboard-verifier" element={<ProtectedRoute area="admin"><AnimatedPage><VerifierDashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/admin/login';

  return (
    <div className="app-container">
        <ScrollProgress />
        <Toast />
        <EmergencyBanner />
        {!isAuthPage && <Navbar />}

        <main className="main-content">
          <AnimatedRoutes />
        </main>

        {!isAuthPage && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
