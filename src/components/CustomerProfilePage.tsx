import React from 'react';
import { AdminShell } from './AdminShell';
import { crmService } from '../services/customerCrmService';

export function CustomerProfilePage() {
  // Mocking ID for now as we don't have real router
  const customerId = 'cust-barber-001';
  const tenantId = 'biz-barber-001';
  const customer = crmService.getCustomerById(customerId, tenantId);

  if (!customer) return <AdminShell><div>Customer not found.</div></AdminShell>;

  return (
    <AdminShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-6 rounded-2xl border border-slate-200">
             <h2 className="text-lg font-bold mb-4">Summary</h2>
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Phone: {customer.phone}</div>
                <div>Email: {customer.email}</div>
                <div>Total Visits: {customer.totalVisits}</div>
                <div>Total Spend: ₹{customer.totalSpend.toFixed(2)}</div>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
             <h2 className="text-lg font-bold mb-4">Tags</h2>
             <div className="flex gap-2">
                {customer.tags.map(tag => <span key={tag} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">{tag}</span>)}
             </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h2 className="text-lg font-bold mb-4">Booking History</h2>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Service</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* This should be connected to booking service based on customerId */}
              <tr className="text-slate-500 italic"><td colSpan={4} className="p-4 text-center">No bookings found for this customer.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
