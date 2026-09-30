import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

export function ProfileSettings() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
      <h2 className="text-lg font-bold">Business Profile</h2>
      <input type="text" className="w-full p-2 border rounded-lg" defaultValue="Royal Crown Barber" />
      <input type="email" className="w-full p-2 border rounded-lg" defaultValue="info@royalcrown.com" />
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
        <Save className="w-4 h-4" /> Save
      </button>
    </div>
  );
}
