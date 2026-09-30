import React from 'react';
import { StaffManagementService } from '../services/staffManagementService';
import { ArrowLeft, Save } from 'lucide-react';

const service = new StaffManagementService();

export function StaffProfilePage({ staffId, onNavigate }: { staffId: string, onNavigate: (id: string) => void }) {
  const tenantId = 'biz-barber-001';
  const staff = service.getStaffById(staffId, tenantId);

  if (!staff) return <div>Staff member not found.</div>;

  return (
    <div className="space-y-6">
      <button onClick={() => onNavigate('staff')} className="flex items-center gap-2 text-slate-500 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Staff
      </button>

      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit {staff.name}</h1>
        <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input type="text" defaultValue={staff.name} className="mt-1 w-full p-2 border border-slate-300 rounded-lg" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Role</label>
                <input type="text" defaultValue={staff.role} className="mt-1 w-full p-2 border border-slate-300 rounded-lg" />
            </div>
        </div>
        <button className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>
    </div>
  );
}
