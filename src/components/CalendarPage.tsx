import React from 'react';
import { AdminShell } from './AdminShell';

export function CalendarPage() {
  return (
    <AdminShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
          Calendar view implementation coming in next iteration.
        </div>
      </div>
    </AdminShell>
  );
}
