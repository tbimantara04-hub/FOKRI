import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCompSlug, setSelectedCompSlug] = useState('mktia-2026');
  const [startRegCompId, setStartRegCompId] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} setSelectedCompSlug={setSelectedCompSlug} />;
      case 'competitions':
        return <Competitions setActiveTab={setActiveTab} setSelectedCompSlug={setSelectedCompSlug} />;
      case 'competition-detail':
        return <CompetitionDetail selectedCompSlug={selectedCompSlug} setActiveTab={setActiveTab} setStartRegCompId={setStartRegCompId} />;
      case 'schedule':
        return <SchedulePage />;
      case 'announcements':
        return <AnnouncementsPage />;
      case 'results':
        return <ResultsPage />;
      case 'faq':
        return <FaqContact />;
      case 'legal-privacy':
        return <LegalPrivacy />;
      case 'legal-terms':
        return <LegalTerms />;
      case 'dashboard-participant':
        return <ParticipantDashboard startRegCompId={startRegCompId} setStartRegCompId={setStartRegCompId} setActiveTab={setActiveTab} setSelectedCompSlug={setSelectedCompSlug} />;
      case 'dashboard-verifier':
        return <VerifierDashboard />;
      case 'dashboard-admin':
        return <AdminDashboard />;
      default:
        return <Home setActiveTab={setActiveTab} setSelectedCompSlug={setSelectedCompSlug} />;
    }
  };

  return (
    <div className="app-container">
      <ScrollProgress />
      <Toast />
      <EmergencyBanner setActiveTab={setActiveTab} />
      <RoleSwitcher setActiveTab={setActiveTab} />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {renderContent()}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
