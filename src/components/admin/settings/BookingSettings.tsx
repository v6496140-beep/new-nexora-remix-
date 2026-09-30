import React from 'react';
import { Save } from 'lucide-react';

export function BookingSettings() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
      <h2 className="text-lg font-bold">Booking Settings</h2>
      <div>
        <label className="block text-sm font-medium">Default Advance Payment %</label>
        <input type="number" className="w-full p-2 border rounded-lg" defaultValue={25} />
      </div>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
        <Save className="w-4 h-4" /> Save
      </button>
    </div>
  );
}
