import React, { useState } from 'react';
import { AuthProvider } from './services/authContext';
import { AdminShell } from './components/AdminShell';
import { BookingsPage } from './components/BookingsPage';
import { CustomersPage } from './components/CustomersPage';
import { StaffPage } from './components/StaffPage';
import { StaffProfilePage } from './components/StaffProfilePage';
import { ServicesPage } from './components/ServicesPage';
import { PackagesPage } from './components/PackagesPage';
import { GalleryPage } from './components/admin/GalleryPage';
import { ReviewsPage } from './components/admin/ReviewsPage';
import { BusinessSettingsPage } from './components/admin/BusinessSettingsPage';
import { WebsiteOverviewPage } from './components/admin/website/WebsiteOverviewPage';
import { WebsiteEditorPage } from './components/admin/website/WebsiteEditorPage';
import { DiscoveryPage } from './components/public/DiscoveryPage';
import { SettingsPage } from './components/admin/settings/SettingsPage';
import { BusinessAdminPlaceholder } from './components/BusinessAdminPlaceholder';

import { SuperAdminShell } from './components/super_admin/SuperAdminShell';
import { SuperAdminDashboard } from './components/super_admin/overview/SuperAdminDashboard';
import { BusinessManagementPage } from './components/super_admin/businesses/BusinessManagementPage';
import { CategoryManagementPage } from './components/super_admin/catalog/CategoryManagementPage';
import { TemplateManagementPage } from './components/super_admin/catalog/TemplateManagementPage';
import { ThemeManagementPage } from './components/super_admin/catalog/ThemeManagementPage';
import { NetworkMembersPage } from './components/super_admin/businesses/NetworkMembersPage';
import { VerificationManagementPage } from './components/super_admin/businesses/VerificationManagementPage';
import { FeaturedManagementPage } from './components/super_admin/businesses/FeaturedManagementPage';
import { AdsManagementPage } from './components/super_admin/platform/AdsManagementPage';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [pageParams, setPageParams] = useState<any>({});

  const handleNavigate = (page: string, params: any = {}) => {
    setActivePage(page);
    setPageParams(params);
  };

  const isSuperAdmin = activePage.startsWith('sa-');

  const renderContent = () => {
    if (isSuperAdmin) {
      switch (activePage) {
        case 'sa-dashboard': return <SuperAdminDashboard />;
        case 'sa-businesses': return <BusinessManagementPage />;
        case 'sa-network': return <NetworkMembersPage />;
        case 'sa-verification': return <VerificationManagementPage />;
        case 'sa-featured': return <FeaturedManagementPage />;
        case 'sa-ads': return <AdsManagementPage />;
        case 'sa-categories': return <CategoryManagementPage />;
        case 'sa-templates': return <TemplateManagementPage />;
        case 'sa-themes': return <ThemeManagementPage />;
        default: return <div className="p-4">Page not found: {activePage}</div>;
      }
    }
    
    switch (activePage) {
      case 'dashboard': return <DiscoveryPage onNavigate={handleNavigate} />;
      case 'discovery': return <DiscoveryPage onNavigate={handleNavigate} />;
      case 'bookings': return <BookingsPage />;
      case 'customers': return <CustomersPage />;
      case 'staff': return <StaffPage onNavigate={handleNavigate} />;
      case 'staff-profile': return <StaffProfilePage staffId={pageParams.staffId} onNavigate={(id) => handleNavigate(id)} />;
      case 'services': return <ServicesPage />;
      case 'packages': return <PackagesPage />;
      case 'gallery': return <GalleryPage />;
      case 'reviews': return <ReviewsPage />;
      case 'business': return <BusinessSettingsPage />;
      case 'website-overview': return <WebsiteOverviewPage onNavigate={handleNavigate} />;
      case 'website-editor': return <WebsiteEditorPage />;
      case 'business_settings': return <SettingsPage />;
      default: return <BusinessAdminPlaceholder />;
    }
  };

  return (
    <AuthProvider>
      {isSuperAdmin ? (
        <SuperAdminShell activeId={activePage} onNavigate={handleNavigate}>
          {renderContent()}
        </SuperAdminShell>
      ) : (
        <AdminShell activeId={activePage} onNavigate={handleNavigate}>
          {renderContent()}
        </AdminShell>
      )}
    </AuthProvider>
  );
}
