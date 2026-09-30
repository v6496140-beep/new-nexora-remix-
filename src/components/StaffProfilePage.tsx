import React, { useState } from 'react';
import { StaffManagementService } from '../services/staffManagementService';
import { ArrowLeft, Save, Check } from 'lucide-react';
import { auditLogService } from '../services/auditLogService';
import { useAuth } from '../services/authContext';

const service = new StaffManagementService();

export function StaffProfilePage({ staffId, onNavigate }: { staffId: string; onNavigate: (id: string) => void }) {
  const { session } = useAuth();
  const tenantId = session?.businessId || 'biz-barber-01';
  const staff = service.getStaffById(staffId, tenantId);
  const [name, setName] = useState(staff?.name || '');
  const [role, setRole] = useState(staff?.role || '');
  const [phone, setPhone] = useState(staff?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!staff) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <p className="text-slate-500">Staff member not found.</p>
        <button onClick={() => onNavigate('staff')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          Back to Staff
        </button>
      </div>
    );
  }

  const handleSave = () => {
    service.updateStaff(staffId, {
      name,
      role,
      phone
    }, tenantId);

    auditLogService.recordAuditLog({
      user: { id: 'usr-owner-1', name: 'Vikram Singhania', email: 'owner@royalcrown.in' },
      role: 'BUSINESS_OWNER',
      businessId: tenantId,
      businessName: 'The Royal Crown Barber & Lounge',
      action: 'STAFF_CHANGE',
      entity: 'Staff',
      entityId: staffId,
      metadata: { action: 'STAFF_UPDATED', name, role }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => onNavigate('staff')} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Team Directory
        </button>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <Check className="w-4 h-4" /> Profile updated successfully!
          </span>
        )}
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Profile: {staff.name}</h1>
          <p className="text-slate-500 text-xs mt-1">Manage team permissions, role credentials, and direct contact line</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Role Title</label>
            <input 
              type="text" 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">System Account Email</label>
            <input 
              type="text" 
              disabled 
              value={staff.email || 'marco@royalcrown.in'} 
              className="w-full px-3.5 py-2.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl text-sm font-mono cursor-not-allowed" 
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button 
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </div>
      </div>
    </div>
  );
}
