import React from 'react';
import { MarketingConsentSettings } from '../../../types/businessSettings';
import { ShieldCheck, UserCheck, AlertTriangle, FileCheck, CheckCircle2 } from 'lucide-react';

export const MarketingConsentSection: React.FC<{
  marketing: MarketingConsentSettings;
  onChange: (updated: MarketingConsentSettings) => void;
}> = ({ marketing, onChange }) => {
  const updateField = <K extends keyof MarketingConsentSettings>(field: K, value: MarketingConsentSettings[K]) => {
    onChange({
      ...marketing,
      [field]: value
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Customer Privacy & Marketing Consent Governance</h3>
            <p className="text-xs text-slate-500 font-medium">Anti-spam compliance, explicit opt-in enforcement, and regulatory communication governance</p>
          </div>
        </div>

        {/* Fundamental Principle Banner */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-black">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Zero-Override Privacy Rule</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Business broadcast campaigns and automated promotional nudges will <strong>only</strong> be dispatched to customers who have explicitly opted in. Business settings cannot override individual customer marketing preferences or national DND registries.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <div className="text-xs font-black text-slate-900">Enforce Explicit Customer Opt-In</div>
              <div className="text-[11px] text-slate-500">Require affirmative checkbox during online checkout or counter registration</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={marketing.enforceExplicitConsent}
                onChange={(e) => updateField('enforceExplicitConsent', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <div className="text-xs font-black text-slate-900">Filter National Do-Not-Disturb (DND) Registry</div>
              <div className="text-[11px] text-slate-500">Automatically suppresses promotional SMS/WhatsApp to registered numbers</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={marketing.respectDndRegistry}
                onChange={(e) => updateField('respectDndRegistry', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <div className="text-xs font-black text-slate-900">Enable Promotional WhatsApp Broadcasts</div>
              <div className="text-[11px] text-slate-500">Permits sending verified Meta-approved marketing templates to opted-in clients</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={marketing.allowPromotionalBroadcasts}
                onChange={(e) => updateField('allowPromotionalBroadcasts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-black text-slate-900">Consent Audit Trail Retention</div>
              <div className="text-[11px] text-slate-500">Period to retain timestamped customer opt-in/opt-out records</div>
            </div>
            <select
              value={marketing.consentAuditLogRetentionDays}
              onChange={(e) => updateField('consentAuditLogRetentionDays', Number(e.target.value))}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
            >
              <option value={180}>180 Days (6 Months)</option>
              <option value={365}>365 Days (1 Year - Standard)</option>
              <option value={730}>730 Days (2 Years)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
