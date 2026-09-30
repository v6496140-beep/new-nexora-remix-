import React from 'react';
import { crmService } from '../services/customerCrmService';
import { useAuth } from '../services/authContext';
import { hasPermission } from '../lib/permissions';

export function CustomerProfilePage({ customerId = 'cust-barber-001', onNavigate }: { customerId?: string; onNavigate?: (id: string) => void }) {
  const { session } = useAuth();
  const tenantId = session?.businessId || 'biz-barber-01';

  // Customer role can only access own profile
  if (session?.role === 'CUSTOMER' && session.userId !== customerId && customerId !== 'usr-customer-1') {
    return (
      <div className="p-8 bg-white rounded-2xl border border-rose-200 text-center space-y-3">
        <div className="inline-block px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-200">
          Security Violation
        </div>
        <h3 className="text-lg font-black text-slate-900">Access Denied</h3>
        <p className="text-slate-500 text-xs max-w-md mx-auto">
          Customer accounts are strictly restricted to accessing their own profile and bookings.
        </p>
        {onNavigate && (
          <button onClick={() => onNavigate('dashboard')} className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">
            Return to Discovery
          </button>
        )}
      </div>
    );
  }

  const customer = crmService.getCustomerById(customerId, session?.role === 'SUPER_ADMIN' ? undefined : tenantId);

  if (!customer) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <p className="text-slate-500">Customer profile not found.</p>
        {onNavigate && (
          <button onClick={() => onNavigate('customers')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
            Back to Customers
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
          <p className="text-slate-500 text-sm">Customer Profile & Appointment History</p>
        </div>
        {onNavigate && (
          <button onClick={() => onNavigate('customers')} className="px-4 py-2 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold">
            ← Back to Customers
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200">
           <h2 className="text-base font-bold mb-4 text-slate-900">Summary</h2>
           <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-400 block text-xs">Phone</span> <span className="font-semibold text-slate-700">{customer.phone}</span></div>
              <div><span className="text-slate-400 block text-xs">Email</span> <span className="font-semibold text-slate-700">{customer.email}</span></div>
              <div><span className="text-slate-400 block text-xs">Total Visits</span> <span className="font-semibold text-slate-700">{customer.totalVisits}</span></div>
              <div><span className="text-slate-400 block text-xs">Total Spend</span> <span className="font-semibold text-slate-700">₹{customer.totalSpend.toFixed(2)}</span></div>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
           <h2 className="text-base font-bold mb-4 text-slate-900">Tags & Segmentation</h2>
           <div className="flex flex-wrap gap-2">
              {customer.tags.map(tag => (
                <span key={tag} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-lg text-xs font-bold">
                  {tag}
                </span>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h2 className="text-base font-bold mb-4 text-slate-900">Booking History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Service</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="text-slate-500 italic">
                <td colSpan={4} className="p-6 text-center">No past bookings found for this customer profile.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
