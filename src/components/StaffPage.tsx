import React, { useState } from 'react';
import { StaffManagementService } from '../services/staffManagementService';
import { UserPlus, Search, Edit2, CheckCircle, XCircle, X, Shield, Phone, Mail } from 'lucide-react';
import { auditLogService } from '../services/auditLogService';
import { useAuth } from '../services/authContext';

const service = new StaffManagementService();

export function StaffPage({ onNavigate }: { onNavigate: (id: string, params?: any) => void }) {
  const { session } = useAuth();
  const tenantId = session?.businessId || 'biz-barber-01';
  const [staff, setStaff] = useState(() => service.listStaffForBusiness(tenantId));
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Senior Barber');
  const [newPhone, setNewPhone] = useState('');

  const refreshList = () => {
    setStaff(service.listStaffForBusiness(tenantId));
  };

  const filteredStaff = staff.filter((m: any) => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const created = service.createStaff({
        businessId: tenantId,
        name: newName.trim(),
        role: newRole,
        phone: newPhone.trim() || '+91 98000 00000',
        email: `${newName.toLowerCase().replace(/\s+/g, '.')}@royalcrown.com`,
        active: true
      }, tenantId);

      // Audit log event
      auditLogService.recordAuditLog({
        user: { id: 'usr-owner-1', name: 'Vikram Singhania', email: 'owner@royalcrown.in' },
        role: 'BUSINESS_OWNER',
        businessId: tenantId,
        businessName: 'The Royal Crown Barber & Lounge',
        action: 'STAFF_CHANGE',
        entity: 'Staff',
        entityId: created.id,
        metadata: { action: 'STAFF_CREATED', name: created.name, role: created.role }
      });

      refreshList();
      setIsAddModalOpen(false);
      setNewName('');
      setNewPhone('');
    } catch (err: any) {
      alert(`Error creating staff member: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Staff & Specialists</h1>
          <p className="text-slate-500 text-sm">Rosters, assigned chair capacity, and team permissions</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input 
          type="text"
          placeholder="Search staff by name or role title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none transition-all shadow-xs"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Operational Role</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((member: any) => (
                <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 text-xs">{member.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{member.email || member.phone}</div>
                  </td>
                  <td className="p-4 text-xs font-semibold text-slate-700">{member.role}</td>
                  <td className="p-4 text-center">
                    {member.active ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
                        <XCircle className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onNavigate('staff-profile', { staffId: member.id })}
                      className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all"
                      aria-label={`Edit ${member.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStaff.length === 0 && (
            <div className="p-12 text-center text-slate-500 text-xs">
              No staff members matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-slate-900">Add Team Member</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Liam Henderson"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Role Title *</label>
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none"
                >
                  <option value="Senior Barber">Senior Barber</option>
                  <option value="Master Stylist">Master Stylist</option>
                  <option value="Color Specialist">Color Specialist</option>
                  <option value="Beard Artist">Beard Artist</option>
                  <option value="Apprentice">Apprentice</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone</label>
                <input 
                  type="text" 
                  placeholder="+91 98200 11223"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                >
                  Save Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
