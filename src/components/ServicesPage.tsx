import React, { useState } from 'react';
import { ServicePackageConfigService } from '../services/servicePackageService';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const serviceManager = new ServicePackageConfigService();

export function ServicesPage() {
  const tenantId = 'biz-barber-001';
  const [services] = useState(serviceManager.listServicesByTenant(tenantId));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Services</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="p-4 font-semibold">{s.name}</td>
                <td className="p-4">{s.categoryId}</td>
                <td className="p-4">{s.duration} min</td>
                <td className="p-4">₹{s.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${s.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                    {s.active ? 'ACTIVE' : 'INACTIVE'}
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
