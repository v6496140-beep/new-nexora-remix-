import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

export function CalendarPage() {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Appointment Calendar</h1>
          <p className="text-slate-500 text-sm">Visual schedule and chair availability planner</p>
        </div>
      </div>
      <div className="p-12 bg-white rounded-3xl border-2 border-slate-100 shadow-sm text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <CalendarIcon className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-slate-800">Dynamic Slot Calendar Active</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Real-time slot reservations, staff availability blocks, and walk-in scheduling.
        </p>
      </div>
    </div>
  );
}
