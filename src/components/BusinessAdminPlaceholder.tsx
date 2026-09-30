import React from 'react';
import { AdminShell } from './AdminShell';

export function BusinessAdminPlaceholder() {
  return (
    <AdminShell>
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Module Under Construction</h1>
        <p className="text-slate-500 mt-2">This feature is coming soon in the next phase of Nexora SalonOS.</p>
      </div>
    </AdminShell>
  );
}
