import React, { useState } from 'react';
import { StaffManagementService } from '../services/staffManagementService';
import { UserPlus, Search, Edit2, CheckCircle, XCircle } from 'lucide-react';

const service = new StaffManagementService();

export function StaffPage({ onNavigate }: { onNavigate: (id: string, params?: any) => void }) {
  const tenantId = 'biz-barber-001';
  const staff = service.listStaffForBusiness(tenantId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map((member: any) => (
              <tr key={member.id} className="hover:bg-slate-50">
                <td className="p-4 font-semibold">{member.name}</td>
                <td className="p-4 text-slate-600">{member.role}</td>
                <td className="p-4">
                  {member.active ? (
                    <span className="flex items-center gap-1 text-emerald-600"><CheckCircle className="w-4 h-4" /> Active</span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-500"><XCircle className="w-4 h-4" /> Inactive</span>
                  )}
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => onNavigate('staff-profile', { staffId: member.id })}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
