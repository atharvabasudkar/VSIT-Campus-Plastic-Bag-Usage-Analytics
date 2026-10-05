import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PledgeModal from './components/PledgeModal';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import UsageAnalysisPage from './pages/UsageAnalysisPage';
import CampusHotspotsPage from './pages/CampusHotspotsPage';
import SurveyPage from './pages/SurveyPage';
import ReportUsagePage from './pages/ReportUsagePage';
import CampaignsPage from './pages/CampaignsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ImpactCalculatorPage from './pages/ImpactCalculatorPage';
import ReportsPage from './pages/ReportsPage';
import MethodologyPage from './pages/MethodologyPage';
import FutureScopePage from './pages/FutureScopePage';
import AboutProjectPage from './pages/AboutProjectPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [showPledgeModal, setShowPledgeModal] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage setCurrentPage={setCurrentPage} onOpenPledge={() => setShowPledgeModal(true)} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'usage-analysis':
        return <UsageAnalysisPage />;
      case 'hotspots':
        return <CampusHotspotsPage />;
      case 'survey':
        return <SurveyPage />;
      case 'report-usage':
        return <ReportUsagePage />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'impact':
        return <ImpactCalculatorPage />;
      case 'reports':
        return <ReportsPage />;
      case 'methodology':
        return <MethodologyPage />;
      case 'future-scope':
        return <FutureScopePage />;
      case 'about':
        return <AboutProjectPage />;
      case 'admin':
        return <AdminDashboardPage setCurrentPage={setCurrentPage} />;
      default:
        return <LandingPage setCurrentPage={setCurrentPage} onOpenPledge={() => setShowPledgeModal(true)} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
        
        {/* Navigation Bar */}
        <Navbar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onOpenPledge={() => setShowPledgeModal(true)}
        />

        {/* Main Page Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {renderPage()}
        </main>

        {/* Footer */}
        <Footer setCurrentPage={setCurrentPage} />

        {/* Global Eco Pledge Modal */}
        <PledgeModal
          isOpen={showPledgeModal}
          onClose={() => setShowPledgeModal(false)}
        />

      </div>
    </AuthProvider>
  );
}
