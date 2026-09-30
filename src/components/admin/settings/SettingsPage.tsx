import React, { useState } from 'react';
import { ProfileSettings } from './ProfileSettings';
import { BookingSettings } from './BookingSettings';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Business Settings</h1>
      <div className="flex border-b border-slate-200">
        {['profile', 'hours', 'booking', 'payment', 'notifications', 'policies'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize border-b-2 ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'booking' && <BookingSettings />}
        {/* Other sections would go here */}
      </div>
    </div>
  );
}
