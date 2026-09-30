import React, { useState } from 'react';
import { crmService } from '../services/customerCrmService';
import { CrmCustomer } from '../types/customerCrm';
import { Search, UserPlus, Filter, X, User, Phone, Mail, Award, Check } from 'lucide-react';
import { useAuth } from '../services/authContext';

export function CustomersPage() {
  const { session } = useAuth();
  const tenantId = session?.businessId || 'biz-barber-01';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<CrmCustomer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const customers = crmService.getCustomersByTenant(tenantId, {
    searchQuery,
    tag: selectedTag === 'ALL' ? undefined : selectedTag
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    crmService.createCustomer({
      tenantId,
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      tags: ['New Client'],
      notes: 'Added via CRM Client Directory',
      marketingConsent: { email: true, sms: true, whatsapp: true }
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Customer Directory</h1>
          <p className="text-slate-500 text-sm">Guest book, retention metrics, and client profiles</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
        >
          <UserPlus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs items-center">
        <div className="flex-1 relative min-w-[240px]">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none transition-all" 
            placeholder="Search by name, phone, email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:border-indigo-500 outline-none cursor-pointer bg-white"
          >
            <option value="ALL">All Segments</option>
            <option value="VIP">VIP</option>
            <option value="Regular">Regular</option>
            <option value="Corporate">Corporate</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email</th>
                <th className="p-4">Last Visit</th>
                <th className="p-4">Total Spend</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c: CrmCustomer) => (
                <tr 
                  key={c.customerId} 
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  onClick={() => setSelectedCustomer(c)}
                >
                  <td className="p-4">
                    <div className="font-bold text-slate-800 text-xs">{c.name}</div>
                    <div className="flex gap-1 mt-0.5">
                      {c.tags.map(t => (
                        <span key={t} className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-600 text-xs">{c.phone}</td>
                  <td className="p-4 text-slate-500 text-xs">{c.email}</td>
                  <td className="p-4 text-slate-500 text-xs">{c.lastVisit || 'N/A'}</td>
                  <td className="p-4 font-bold text-slate-800 text-xs">₹{c.totalSpend.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {customers.length === 0 && (
            <div className="p-12 text-center space-y-2">
              <User className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-bold text-sm">No customers found.</p>
              <p className="text-slate-400 text-xs">Try clearing the search or adding a new client.</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <div 
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex justify-end"
          onClick={() => setSelectedCustomer(null)}
        >
          <div 
            className="w-full max-w-md bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <span className="text-[10px] font-mono text-indigo-600 uppercase font-bold">Client Card</span>
                  <h2 className="text-xl font-black text-slate-900">{selectedCustomer.name}</h2>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl border border-slate-100"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Information</div>
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedCustomer.phone}
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedCustomer.email}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Visits</span>
                    <span className="text-xl font-black text-slate-900">{selectedCustomer.totalVisits}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Spend</span>
                    <span className="text-xl font-black text-slate-900">₹{selectedCustomer.totalSpend.toFixed(0)}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tags & Loyalty</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCustomer.tags.map(t => (
                      <span key={t} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedCustomer(null)}
              className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-black transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
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
              <h3 className="text-lg font-black text-slate-900">Add New Customer</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Aryan Mehra"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                <input 
                  type="text" 
                  required
                  placeholder="+91 98200 00000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="client@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
