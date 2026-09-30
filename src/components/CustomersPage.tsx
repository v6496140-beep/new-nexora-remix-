import React, { useState } from 'react';
import { crmService } from '../services/customerCrmService';
import { CrmCustomer } from '../types/customerCrm';
import { Search, UserPlus, Filter } from 'lucide-react';

export function CustomersPage() {
  const tenantId = 'biz-barber-001'; // Should be dynamic in real app
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  
  const customers = crmService.getCustomersByTenant(tenantId, {
    searchQuery,
    tag: selectedTag
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200">
         <div className="flex-1 relative">
           <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
           <input 
             className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm" 
             placeholder="Search by name, phone, email..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
         </div>
         <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600">
           <Filter className="w-4 h-4" /> Filters
         </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Email</th>
              <th className="p-4">Last Visit</th>
              <th className="p-4">Total Spend</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c: CrmCustomer) => (
              <tr key={c.customerId} className="hover:bg-slate-50 cursor-pointer">
                <td className="p-4 font-semibold">{c.name}</td>
                <td className="p-4 font-mono text-slate-500">{c.phone}</td>
                <td className="p-4 text-slate-500">{c.email}</td>
                <td className="p-4 text-slate-500">{c.lastVisit}</td>
                <td className="p-4 font-semibold">₹{c.totalSpend.toFixed(2)}</td>
                <td className="p-4">
                   <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                     {c.status}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
