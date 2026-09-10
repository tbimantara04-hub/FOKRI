import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AnimatedPage } from './components/motion/AnimatedPage';
import { AppProvider } from './context/AppContext';
import { NavbarPremium as Navbar } from './components/layout/NavbarPremium';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
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
        <Route path="/dashboard-participant" element={<AnimatedPage><ParticipantDashboard /></AnimatedPage>} />
        <Route path="/dashboard-verifier" element={<AnimatedPage><VerifierDashboard /></AnimatedPage>} />
        <Route path="/dashboard-admin" element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <ScrollProgress />
        <Toast />
        <EmergencyBanner />
        <RoleSwitcher />
        <Navbar />

        <main className="main-content">
          <AnimatedRoutes />
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
