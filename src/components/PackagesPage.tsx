import React, { useState } from 'react';
import { ServicePackageConfigService } from '../services/servicePackageService';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const serviceManager = new ServicePackageConfigService();

export function PackagesPage() {
  const tenantId = 'biz-barber-001';
  const [packages] = useState(serviceManager.listPackagesByTenant(tenantId));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Packages</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-4">Package Name</th>
              <th className="p-4">Services</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {packages.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-4 font-semibold">{p.name}</td>
                <td className="p-4 text-slate-500">{p.serviceIds.length} services</td>
                <td className="p-4 font-semibold">₹{p.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                    {p.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button className="text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                  <button className="text-rose-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
