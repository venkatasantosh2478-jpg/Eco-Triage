import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Ticker } from './components/Ticker.tsx';
import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { Footer } from './components/Footer.tsx';
import { TriageDrawer } from './components/TriageDrawer.tsx';
import { RoleAuthModal } from './components/RoleAuthModal.tsx';
import { AITriageBot } from './components/AITriageBot.tsx';
import { Toast } from './components/Toast.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { ReportPage } from './pages/ReportPage.tsx';
import { LiveMapPage } from './pages/LiveMapPage.tsx';
import { QueuePage } from './pages/QueuePage.tsx';
import { NearbyHelpPage } from './pages/NearbyHelpPage.tsx';
import { PrecautionsPage } from './pages/PrecautionsPage.tsx';
import { CycloneHistoryPage } from './pages/CycloneHistoryPage.tsx';
import { OurHeroesPage } from './pages/OurHeroesPage.tsx';
import { AlertsPage } from './pages/AlertsPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { EmergencyContactsPage } from './pages/EmergencyContactsPage.tsx';
import { ModeIndicatorHeader } from './components/ModeIndicatorHeader.tsx';

// Role-Specific Views
import { MyReportsView } from './pages/role_views/MyReportsView.tsx';
import { MyAssignmentsView } from './pages/role_views/MyAssignmentsView.tsx';
import { VerifyReportsView } from './pages/role_views/VerifyReportsView.tsx';
import { ContentManagerView } from './pages/role_views/ContentManagerView.tsx';
import { AdminActivityLogView } from './pages/role_views/AdminActivityLogView.tsx';

import { ShieldAlert, ArrowLeft } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activePage, setActivePage, hasPermission, currentRole, setIsAuthModalOpen } = useApp();

  // Role Gate check
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'report':
        return <ReportPage />;
      case 'map':
        return <LiveMapPage />;
      case 'queue':
        return <QueuePage />;
      case 'help':
        return <NearbyHelpPage />;
      case 'precautions':
        return <PrecautionsPage />;
      case 'history':
        return <CycloneHistoryPage />;
      case 'heroes':
        return <OurHeroesPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'about':
        return <AboutPage />;
      case 'contacts':
        return <EmergencyContactsPage />;

      // Role specific operations
      case 'my-reports':
        if (!hasPermission('view_my_reports')) {
          return <PermissionDeniedNotice requiredRole="Field Officer" />;
        }
        return <MyReportsView />;

      case 'my-assignments':
        if (!hasPermission('update_my_assignment')) {
          return <PermissionDeniedNotice requiredRole="Field Officer" />;
        }
        return <MyAssignmentsView />;

      case 'verify-reports':
        if (!hasPermission('verify_report')) {
          return <PermissionDeniedNotice requiredRole="Command Officer" />;
        }
        return <VerifyReportsView />;

      case 'content-manager':
        if (!hasPermission('edit_content')) {
          return <PermissionDeniedNotice requiredRole="Admin" />;
        }
        return <ContentManagerView />;

      case 'activity-log':
        if (!hasPermission('clear_data')) {
          return <PermissionDeniedNotice requiredRole="Admin" />;
        }
        return <AdminActivityLogView />;

      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#182338]">
      {/* 0. Dual Mode Indicator Header & Emergency Banner */}
      <ModeIndicatorHeader />

      {/* 1. Global Alert Ticker (40px) */}
      <Ticker />

      {/* 2. Global Sticky Header (72px) */}
      <Header />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {renderPage()}
      </main>

      {/* 4. Global Footer */}
      <Footer />

      {/* 5. Mobile Navigation & Floating Report Button */}
      <BottomNav />

      {/* 6. Triage Drawer Overlay */}
      <TriageDrawer />

      {/* 7. Role Selection & Sign In Modal */}
      <RoleAuthModal />

      {/* 8. Floating AI Triage Bot */}
      <AITriageBot />

      {/* 9. Toast Feedback notifications */}
      <Toast />
    </div>
  );
};

// Permission message component when unauthorized role accesses screen
const PermissionDeniedNotice: React.FC<{ requiredRole: string }> = ({ requiredRole }) => {
  const { setActivePage, setIsAuthModalOpen } = useApp();
  return (
    <div className="max-w-md mx-auto my-16 bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-lg space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-red-100 text-[#D32F2F] flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-xl font-black text-[#101A3A]">Restricted Operation</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Only {requiredRole}s can perform this action. Please sign in with an authorized municipal profile.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex-1 py-2.5 px-4 bg-[#2457C5] hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow"
        >
          Switch Role Profile
        </button>
        <button
          onClick={() => setActivePage('home')}
          className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
        >
          Return to Home
        </button>
      </div>
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
