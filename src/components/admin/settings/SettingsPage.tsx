import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../services/authContext';
import { businessSettingsService } from '../../../services/businessSettingsService';
import { ComprehensiveBusinessSettings } from '../../../types/businessSettings';
import { AccessDeniedView } from '../../common/PermissionGuard';
import { BusinessInfoSection } from './BusinessInfoSection';
import { BusinessHoursSection } from './BusinessHoursSection';
import { BookingRulesSection } from './BookingRulesSection';
import { BookingPoliciesSection } from './BookingPoliciesSection';
import { PaymentSettingsSection } from './PaymentSettingsSection';
import { NotificationSettingsSection } from './NotificationSettingsSection';
import { MarketingConsentSection } from './MarketingConsentSection';
import { 
  Building2, 
  Clock, 
  Sliders, 
  FileText, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  Save, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Building,
  Sparkles
} from 'lucide-react';

export type SettingsTabId = 'info' | 'hours' | 'booking' | 'policies' | 'payment' | 'notifications' | 'marketing';

interface TabItem {
  id: SettingsTabId;
  label: string;
  icon: React.ElementType;
  description: string;
}

const TABS: TabItem[] = [
  { id: 'info', label: 'Business Profile', icon: Building2, description: 'Branding, contact info & address' },
  { id: 'hours', label: 'Hours & Schedule', icon: Clock, description: 'Weekly operating times & daily breaks' },
  { id: 'booking', label: 'Booking Rules', icon: Sliders, description: 'Advance deposit, intervals & buffer time' },
  { id: 'policies', label: 'Policies & Terms', icon: FileText, description: 'Cancellation, reschedule & deposit terms' },
  { id: 'payment', label: 'Payment & POS', icon: CreditCard, description: 'Nexora QR, gateway & currency' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'SMS, WhatsApp & CRM automations' },
  { id: 'marketing', label: 'Privacy & Consent', icon: ShieldCheck, description: 'Anti-spam & customer opt-in governance' }
];

export function SettingsPage() {
  const { session } = useAuth();
  const tenantId = session?.businessId || 'biz-barber-01';

  // RBAC Security Check
  const isAuthorized = session?.role === 'BUSINESS_OWNER' || session?.role === 'MANAGER' || session?.role === 'SUPER_ADMIN';

  const [activeTab, setActiveTab] = useState<SettingsTabId>('info');
  const [savedSettings, setSavedSettings] = useState<ComprehensiveBusinessSettings>(() =>
    businessSettingsService.getSettings(tenantId)
  );
  const [formState, setFormState] = useState<ComprehensiveBusinessSettings>(() =>
    businessSettingsService.getSettings(tenantId)
  );

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reload when active tenant changes
  useEffect(() => {
    const s = businessSettingsService.getSettings(tenantId);
    setSavedSettings(s);
    setFormState(s);
    setSaveStatus('idle');
  }, [tenantId]);

  // Dirty check: whether current formState differs from savedSettings
  const isDirty = useMemo(() => {
    return JSON.stringify(formState) !== JSON.stringify(savedSettings);
  }, [formState, savedSettings]);

  if (!isAuthorized) {
    return (
      <AccessDeniedView
        resource="Salon Business Settings"
        action="edit"
        reason="Staff and Customer accounts are restricted from modifying salon operational configuration. Only the verified Business Owner and authorized Managers can adjust salon settings."
      />
    );
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaveStatus('saving');
    setErrorMessage(null);

    try {
      // Simulate asynchronous persistence
      await new Promise((r) => setTimeout(r, 400));
      const updated = businessSettingsService.updateSettings(tenantId, formState, session);
      setSavedSettings(updated);
      setFormState(updated);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      setSaveStatus('error');
      setErrorMessage(err?.message || 'Failed to save settings. Please try again.');
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (!window.confirm('Discard all unsaved changes and reset to last saved state?')) {
        return;
      }
    }
    setFormState(JSON.parse(JSON.stringify(savedSettings)));
    setSaveStatus('idle');
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Reset all business settings and schedules back to factory presets?')) {
      return;
    }
    try {
      const reset = businessSettingsService.resetToDefaults(tenantId, session);
      setSavedSettings(reset);
      setFormState(reset);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      setSaveStatus('error');
      setErrorMessage(err?.message || 'Failed to reset settings.');
    }
  };

  return (
    <div className="space-y-6 font-sans pb-24 max-w-6xl mx-auto">
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              Salon Administration
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> Tenant: {tenantId}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Business Settings & Configuration</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage branding, operating hours, booking rules, cancellation terms, and notification automations
          </p>
        </div>

        {/* Quick Save / Status Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {isDirty && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" /> Unsaved Changes
            </span>
          )}

          <button
            type="button"
            onClick={handleCancel}
            disabled={!isDirty || saveStatus === 'saving'}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saveStatus === 'saving' || !isDirty}
            className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            {saveStatus === 'saving' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {saveStatus === 'error' && errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800 font-semibold animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Notification Banner */}
      {saveStatus === 'saved' && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Business settings and schedule configurations successfully updated and synchronized!</span>
        </div>
      )}

      {/* Responsive Horizontal Tabs Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-1.5 overflow-x-auto scrollbar-none flex gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Section Form Container */}
      <div className="space-y-6">
        {activeTab === 'info' && (
          <BusinessInfoSection
            info={formState.info}
            onChange={(updatedInfo) => setFormState({ ...formState, info: updatedInfo })}
          />
        )}

        {activeTab === 'hours' && (
          <BusinessHoursSection
            hours={formState.hours}
            onChange={(updatedHours) => setFormState({ ...formState, hours: updatedHours })}
          />
        )}

        {activeTab === 'booking' && (
          <BookingRulesSection
            booking={formState.booking}
            onChange={(updatedBooking) => setFormState({ ...formState, booking: updatedBooking })}
          />
        )}

        {activeTab === 'policies' && (
          <BookingPoliciesSection
            policies={formState.policies}
            onChange={(updatedPolicies) => setFormState({ ...formState, policies: updatedPolicies })}
          />
        )}

        {activeTab === 'payment' && (
          <PaymentSettingsSection
            payment={formState.payment}
            onChange={(updatedPayment) => setFormState({ ...formState, payment: updatedPayment })}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationSettingsSection
            notifications={formState.notifications}
            onChange={(updatedNotifs) => setFormState({ ...formState, notifications: updatedNotifs })}
          />
        )}

        {activeTab === 'marketing' && (
          <MarketingConsentSection
            marketing={formState.marketing}
            onChange={(updatedMarketing) => setFormState({ ...formState, marketing: updatedMarketing })}
          />
        )}
      </div>

      {/* Reset Defaults Action at bottom */}
      <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
        <span>Settings last saved on {new Date(savedSettings.updatedAt).toLocaleString()}</span>
        <button
          type="button"
          onClick={handleResetDefaults}
          className="text-slate-400 hover:text-rose-600 font-bold underline transition-colors"
        >
          Reset All to Factory Defaults
        </button>
      </div>

      {/* Sticky Bottom Save Action Bar for Mobile & Quick Actions */}
      {isDirty && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-40 shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              <span className="text-xs font-bold text-slate-800">You have unsaved changes in {TABS.find(t => t.id === activeTab)?.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={saveStatus === 'saving'}
                className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save All Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
