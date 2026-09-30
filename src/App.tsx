import React, { useState } from 'react';
import { AuthProvider, useAuth } from './services/authContext';
import { AdminShell } from './components/AdminShell';
import { BookingsPage } from './components/BookingsPage';
import { CalendarPage } from './components/CalendarPage';
import { CustomersPage } from './components/CustomersPage';
import { CustomerProfilePage } from './components/CustomerProfilePage';
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
import { AuditLogsPage } from './components/super_admin/platform/AuditLogsPage';

// Financial & Operational Showcases
import { Phase61PaymentShowcase } from './components/Phase61PaymentShowcase';
import { Phase64CommissionLedgerShowcase } from './components/Phase64CommissionLedgerShowcase';
import { Phase65WithdrawalShowcase } from './components/Phase65WithdrawalShowcase';
import { Phase66WalletShowcase } from './components/Phase66WalletShowcase';
import { OffersPage } from './components/admin/offers/OffersPage';
import { Phase69OffersShowcase } from './components/Phase69OffersShowcase';
import { Phase610AutomationsShowcase } from './components/Phase610AutomationsShowcase';
import { Phase58CommunicationShowcase } from './components/Phase58CommunicationShowcase';
import { Phase59OperationalDashboardShowcase } from './components/Phase59OperationalDashboardShowcase';
import { Phase43StaffScheduleShowcase } from './components/Phase43StaffScheduleShowcase';
import { Phase44AvailabilitySlotEngineShowcase } from './components/Phase44AvailabilitySlotEngineShowcase';

// Security Guard & Persona Components (Phase 7.14 & 7.15 Hardening)
import { PersonaSecurityBar } from './components/common/PersonaSecurityBar';
import { AccessDeniedView } from './components/common/PermissionGuard';

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [pageParams, setPageParams] = useState<any>({});
  const { session } = useAuth();

  const handleNavigate = (page: string, params: any = {}) => {
    setActivePage(page);
    setPageParams(params);
  };

  const isSuperAdmin = activePage.startsWith('sa-');

  const renderContent = () => {
    // 1. Super Admin Clearance Enforcement
    if (isSuperAdmin) {
      if (session?.role !== 'SUPER_ADMIN') {
        return (
          <AccessDeniedView
            resource="Platform Super Admin"
            action="manage"
            reason={`Super Admin portal is strictly restricted to platform administrative accounts. Your current role [${session?.role || 'UNAUTHENTICATED'}] does not have platform-level clearance.`}
            onNavigateHome={() => handleNavigate('dashboard')}
          />
        );
      }

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
        case 'sa-audit': return <AuditLogsPage />;
        case 'sa-bookings': return <BookingsPage />;
        case 'sa-transactions': return <Phase61PaymentShowcase />;
        case 'sa-commission': return <Phase64CommissionLedgerShowcase />;
        case 'sa-withdrawals': return <Phase65WithdrawalShowcase />;
        case 'sa-settlements': return <BusinessAdminPlaceholder title="Settlement Reconciliation" description="Cross-banking automated settlements with split collection routing." />;
        case 'sa-notifications': return <BusinessAdminPlaceholder title="Platform Notifications" description="System-wide dispatch logs and template notification routing." />;
        case 'sa-settings': return <SettingsPage />;
        default: return <SuperAdminDashboard />;
      }
    }

    // 2. Customer Role Boundary Enforcement (Customer cannot access salon admin tools)
    if (session?.role === 'CUSTOMER') {
      if (activePage === 'dashboard' || activePage === 'discovery') {
        return <DiscoveryPage onNavigate={handleNavigate} />;
      }
      return (
        <AccessDeniedView
          resource="Salon Business Administration"
          action="view"
          reason="Customer accounts are restricted to the public discovery portal, catalog browsing, and personal bookings. Access to salon management operations requires Business Owner, Manager, or Staff credentials."
          onNavigateHome={() => handleNavigate('dashboard')}
        />
      );
    }

    // 3. Staff Role Operational Restrictions (Staff cannot execute withdrawals, settlements, or modify admin settings)
    if (session?.role === 'STAFF') {
      if (['withdrawals', 'settlements', 'automations', 'business_settings', 'payment_settings', 'policies'].includes(activePage)) {
        return (
          <AccessDeniedView
            resource="Financial & Salon Governance"
            action="manage"
            reason="Staff accounts are restricted to assigned appointment schedules and customer check-ins. Disbursing payouts or modifying salon business configuration is restricted to Business Owners."
            onNavigateHome={() => handleNavigate('dashboard')}
          />
        );
      }
    }

    // 4. Manager Role Restrictions (Manager cannot disburse payout funds)
    if (session?.role === 'MANAGER' && activePage === 'withdrawals') {
      return (
        <AccessDeniedView
          resource="Bank Withdrawal Engine"
          action="execute"
          reason="Manager accounts can inspect wallet balances and financial records, but fund disbursements to bank accounts require verified Business Owner authorization."
          onNavigateHome={() => handleNavigate('dashboard')}
        />
      );
    }
    
    // 5. Standard Route Rendering for Authorized Business Roles
    switch (activePage) {
      case 'dashboard': return <DiscoveryPage onNavigate={handleNavigate} />;
      case 'discovery': return <DiscoveryPage onNavigate={handleNavigate} />;
      case 'bookings': return <BookingsPage />;
      case 'calendar': return <CalendarPage />;
      case 'customers': return <CustomersPage />;
      case 'segments': return <CustomersPage />;
      case 'customer-profile': return <CustomerProfilePage customerId={pageParams.customerId} onNavigate={handleNavigate} />;
      case 'staff': return <StaffPage onNavigate={handleNavigate} />;
      case 'staff-profile': return <StaffProfilePage staffId={pageParams.staffId} onNavigate={(id) => handleNavigate(id)} />;
      case 'availability': return <Phase44AvailabilitySlotEngineShowcase />;
      case 'leave': return <Phase43StaffScheduleShowcase />;
      case 'services': return <ServicesPage />;
      case 'packages': return <PackagesPage />;
      case 'gallery': return <GalleryPage />;
      case 'reviews': return <ReviewsPage />;
      case 'business': return <BusinessSettingsPage />;
      case 'website-overview': return <WebsiteOverviewPage onNavigate={handleNavigate} />;
      case 'website-editor': return <WebsiteEditorPage />;
      case 'offers': return <OffersPage />;
      case 'automations': return <Phase610AutomationsShowcase />;
      case 'whatsapp': return <Phase58CommunicationShowcase />;
      case 'rewards': return <BusinessAdminPlaceholder title="Customer Loyalty & Rewards" description="Configurable visit points, rewards tier thresholds, and repeat appointment promotions." />;
      case 'analytics': return <Phase59OperationalDashboardShowcase />;
      case 'payments': return <Phase61PaymentShowcase />;
      case 'transactions': return <Phase61PaymentShowcase />;
      case 'commission': return <Phase64CommissionLedgerShowcase />;
      case 'wallet': return <Phase66WalletShowcase />;
      case 'withdrawals': return <Phase65WithdrawalShowcase />;
      case 'settlements': return <BusinessAdminPlaceholder title="Settlement Reconciliation" description="Automated bank deposit reconciliation and collection splits." />;
      case 'business_settings': return <SettingsPage />;
      case 'booking_settings': return <SettingsPage />;
      case 'payment_settings': return <SettingsPage />;
      case 'notifications': return <BusinessAdminPlaceholder title="Alert Policies & Webhooks" description="Configure transactional SMS, WhatsApp reminders, and system notifications." />;
      case 'policies': return <SettingsPage />;
      default: return <DiscoveryPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top QA & Security Bar with 1-Click Role/Tenant Switcher */}
      <PersonaSecurityBar currentActivePage={activePage} onNavigate={handleNavigate} />

      {/* Main Shell Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {isSuperAdmin ? (
          <SuperAdminShell activeId={activePage} onNavigate={handleNavigate}>
            {renderContent()}
          </SuperAdminShell>
        ) : (
          <AdminShell activeId={activePage} onNavigate={handleNavigate}>
            {renderContent()}
          </AdminShell>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
