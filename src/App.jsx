import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/competitions/:slug" element={<CompetitionDetail />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/faq" element={<FaqContact />} />
            <Route path="/legal-privacy" element={<LegalPrivacy />} />
            <Route path="/legal-terms" element={<LegalTerms />} />
            <Route path="/dashboard-participant" element={<ParticipantDashboard />} />
            <Route path="/dashboard-verifier" element={<VerifierDashboard />} />
            <Route path="/dashboard-admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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
