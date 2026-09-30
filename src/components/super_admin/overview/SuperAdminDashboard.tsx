import React from 'react';

export function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Platform Overview</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border">Businesses: No data available</div>
        <div className="p-6 bg-white rounded-xl border">Bookings: No data available</div>
        <div className="p-6 bg-white rounded-xl border">GMV: No data available</div>
      </div>
    </div>
  );
}
