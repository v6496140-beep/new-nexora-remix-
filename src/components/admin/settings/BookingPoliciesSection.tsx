import React, { useState } from 'react';
import { BookingPolicySettings } from '../../../types/businessSettings';
import { FileText, ShieldAlert, Eye, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

export const BookingPoliciesSection: React.FC<{
  policies: BookingPolicySettings;
  onChange: (updated: BookingPolicySettings) => void;
}> = ({ policies, onChange }) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'cancellation' | 'reschedule' | 'noshow' | 'advance'>('cancellation');

  const updateField = (field: keyof BookingPolicySettings, value: string) => {
    onChange({
      ...policies,
      [field]: value
    });
  };

  const loadStandardTemplates = () => {
    onChange({
      cancellationPolicy: 'Cancellations made 4+ hours prior to slot receive full advance refund or wallet credit. Cancellations within 4 hours forfeit the 25% advance reservation fee.',
      reschedulePolicy: 'Appointments can be rescheduled up to 2 hours before the scheduled slot at no penalty (maximum 2 reschedules per booking).',
      noShowPolicy: 'No-show appointments after 15 minutes past the start time will forfeit advance payment and automatically release the specialist.',
      advancePaymentPolicy: 'A 25% online advance deposit is required to reserve time with our master barbers and stylists.'
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Customer Booking Policies & Terms</h3>
              <p className="text-xs text-slate-500 font-medium">Legally binding terms presented to customers during checkout and reservation confirmation</p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadStandardTemplates}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Nexora Standard Policies</span>
          </button>
        </div>

        <div className="space-y-5">
          {/* Cancellation Policy */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Cancellation Policy *
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {policies.cancellationPolicy.length} characters
              </span>
            </div>
            <textarea
              rows={3}
              value={policies.cancellationPolicy}
              onChange={(e) => updateField('cancellationPolicy', e.target.value)}
              placeholder="State your cancellation notice terms and refund eligibility..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none leading-relaxed"
              required
            />
          </div>

          {/* Reschedule Policy */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Rescheduling Policy *
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {policies.reschedulePolicy.length} characters
              </span>
            </div>
            <textarea
              rows={3}
              value={policies.reschedulePolicy}
              onChange={(e) => updateField('reschedulePolicy', e.target.value)}
              placeholder="State rescheduling window and slot change limits..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none leading-relaxed"
              required
            />
          </div>

          {/* No-Show Policy */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. No-Show & Grace Period Policy *
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {policies.noShowPolicy.length} characters
              </span>
            </div>
            <textarea
              rows={3}
              value={policies.noShowPolicy}
              onChange={(e) => updateField('noShowPolicy', e.target.value)}
              placeholder="Define arrival grace window (e.g. 15 mins) and advance forfeiture rules..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none leading-relaxed"
              required
            />
          </div>

          {/* Advance Payment Policy */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                4. Advance Payment & Collection Policy *
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {policies.advancePaymentPolicy.length} characters
              </span>
            </div>
            <textarea
              rows={3}
              value={policies.advancePaymentPolicy}
              onChange={(e) => updateField('advancePaymentPolicy', e.target.value)}
              placeholder="State upfront booking advance terms and remainder payment at counter..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none leading-relaxed"
              required
            />
          </div>
        </div>
      </div>

      {/* Live Public Policy Preview Box */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              Customer Booking Experience Preview
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Live Checkout Drawer</span>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'cancellation', label: 'Cancellation' },
            { key: 'reschedule', label: 'Rescheduling' },
            { key: 'noshow', label: 'No-Show' },
            { key: 'advance', label: 'Advance Deposit' }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActivePreviewTab(tab.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePreviewTab === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Policy Text Box */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
          {activePreviewTab === 'cancellation' && policies.cancellationPolicy}
          {activePreviewTab === 'reschedule' && policies.reschedulePolicy}
          {activePreviewTab === 'noshow' && policies.noShowPolicy}
          {activePreviewTab === 'advance' && policies.advancePaymentPolicy}
        </div>
      </div>
    </div>
  );
};
