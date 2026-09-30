import React from 'react';
import { BookingRuleSettings } from '../../../types/businessSettings';
import { CalendarCheck, Percent, Clock, Hourglass, Sliders, CheckCircle2 } from 'lucide-react';

export const BookingRulesSection: React.FC<{
  booking: BookingRuleSettings;
  onChange: (updated: BookingRuleSettings) => void;
}> = ({ booking, onChange }) => {
  const updateField = <K extends keyof BookingRuleSettings>(field: K, value: BookingRuleSettings[K]) => {
    onChange({
      ...booking,
      [field]: value
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Advance Payment Configuration */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Advance Payment & Deposit Rate</h3>
            <p className="text-xs text-slate-500 font-medium">Configure upfront commitment fee required from customers to guarantee appointments</p>
          </div>
        </div>

        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-indigo-900 uppercase tracking-wider">
              Required Advance Deposit Percentage
            </label>
            <span className="text-xl font-black text-indigo-600 font-mono">
              {booking.advancePaymentPercentage}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={booking.advancePaymentPercentage}
            onChange={(e) => updateField('advancePaymentPercentage', Number(e.target.value))}
            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />

          <div className="flex justify-between text-[10px] font-bold text-slate-500 font-mono">
            <span>0% (No Advance)</span>
            <span className="text-indigo-700 font-black">25% (Standard Default)</span>
            <span>50% (High Commitment)</span>
            <span>100% (Full Upfront)</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-xs font-bold text-slate-900">Enforce Online Advance Deposit</div>
            <div className="text-[11px] text-slate-500">Require immediate UPI/card payment during customer booking flow</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={booking.enableOnlineAdvance}
              onChange={(e) => updateField('enableOnlineAdvance', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      {/* Slot Intervals & Scheduling Rules */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Scheduling Intervals & Buffer Timing</h3>
            <p className="text-xs text-slate-500 font-medium">Slot granularities and gap padding between consecutive client treatments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Booking Slot Interval
            </label>
            <select
              value={booking.slotIntervalMinutes}
              onChange={(e) => updateField('slotIntervalMinutes', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            >
              <option value={15}>15 Minutes (High Turnover)</option>
              <option value={30}>30 Minutes (Recommended)</option>
              <option value={45}>45 Minutes (Extended Salon)</option>
              <option value={60}>60 Minutes (Spa & Wellness)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Buffer Time (Post-Service Gap)
            </label>
            <select
              value={booking.bufferTimeMinutes}
              onChange={(e) => updateField('bufferTimeMinutes', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            >
              <option value={0}>0 Minutes (No buffer)</option>
              <option value={5}>5 Minutes (Quick Clean)</option>
              <option value={10}>10 Minutes (Standard Prep)</option>
              <option value={15}>15 Minutes (Thorough Sanitization)</option>
              <option value={20}>20 Minutes (Deep Cleaning)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Minimum Advance Notice
            </label>
            <select
              value={booking.minAdvanceBookingHours}
              onChange={(e) => updateField('minAdvanceBookingHours', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            >
              <option value={1}>1 Hour in advance</option>
              <option value={2}>2 Hours in advance (Recommended)</option>
              <option value={4}>4 Hours in advance</option>
              <option value={12}>12 Hours in advance</option>
              <option value={24}>24 Hours (Next Day Only)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Max Advance Booking Horizon
            </label>
            <select
              value={booking.maxAdvanceBookingDays}
              onChange={(e) => updateField('maxAdvanceBookingDays', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            >
              <option value={15}>15 Days ahead</option>
              <option value={30}>30 Days ahead (Standard)</option>
              <option value={60}>60 Days ahead</option>
              <option value={90}>90 Days ahead (Quarterly)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Cancellation Cutoff Window
            </label>
            <select
              value={booking.cancellationWindowHours}
              onChange={(e) => updateField('cancellationWindowHours', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            >
              <option value={2}>Up to 2 Hours before slot</option>
              <option value={4}>Up to 4 Hours before slot (Default)</option>
              <option value={12}>Up to 12 Hours before slot</option>
              <option value={24}>Up to 24 Hours before slot</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Reschedule Cutoff Window
            </label>
            <select
              value={booking.rescheduleWindowHours}
              onChange={(e) => updateField('rescheduleWindowHours', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            >
              <option value={1}>Up to 1 Hour before slot</option>
              <option value={2}>Up to 2 Hours before slot (Default)</option>
              <option value={4}>Up to 4 Hours before slot</option>
              <option value={12}>Up to 12 Hours before slot</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
