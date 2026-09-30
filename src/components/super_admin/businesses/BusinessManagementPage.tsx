import React, { useState } from 'react';
import { Search, Filter, Eye, Power, MapPin, Calendar, CreditCard, ExternalLink, Mail, Phone } from 'lucide-react';
import { SEEDED_PUBLIC_BUSINESSES } from '../../../data/seededPublicBusinesses';
import { Business } from '../../../types';

export function BusinessManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const businesses = Object.values(SEEDED_PUBLIC_BUSINESSES);
  
  const filteredBusinesses = businesses.filter(biz => {
    const matchesSearch = biz.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         biz.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         biz.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || biz.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(businesses.map(b => b.category)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Business Registry</h1>
          <p className="text-slate-500 text-sm">Manage all tenant salon instances and their platform status</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
                <span className="text-[10px] font-bold text-indigo-400 uppercase block">Total Tenants</span>
                <span className="text-xl font-black text-indigo-700">{businesses.length}</span>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email or slug..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-600"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="capitalize">{cat.replace('-', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
              <tr className="text-left border-b">
                <th className="p-4">Business & Identity</th>
                <th className="p-4">Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBusinesses.map((biz) => (
                <tr key={biz.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{biz.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{biz.code}</div>
                  </td>
                  <td className="p-4">
                    <span className="capitalize px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-tight border border-indigo-100">
                      {biz.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="text-xs">{biz.city}, {biz.country}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                        <Mail className="w-3 h-3" /> {biz.email}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Phone className="w-3 h-3" /> {biz.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      biz.status === 'active' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    } uppercase`}>
                      {biz.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => setSelectedBusiness(biz)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a 
                        href={`https://${biz.slug}.nexora.salon`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                        title="Visit Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button 
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                        title="Suspend Tenant"
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 p-8 text-white relative">
              <button 
                onClick={() => setSelectedBusiness(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Power className="w-6 h-6 rotate-45" />
              </button>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-black">
                  {selectedBusiness.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black">{selectedBusiness.name}</h3>
                  <p className="text-indigo-300 font-mono text-sm tracking-widest">{selectedBusiness.code}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">{selectedBusiness.category}</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30">Active Tenant</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 grid grid-cols-2 gap-8 bg-slate-50/50">
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Location Details
                  </label>
                  <p className="text-sm font-semibold text-slate-700">{selectedBusiness.address}</p>
                  <p className="text-xs text-slate-500">{selectedBusiness.city}, {selectedBusiness.postalCode}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Registration
                  </label>
                  <p className="text-sm font-semibold text-slate-700">Member Since Jan 2025</p>
                  <p className="text-xs text-slate-500 italic">Last Activity: 2 hours ago</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <CreditCard className="w-3 h-3" /> Financial Config
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-white p-2 border rounded-xl text-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase block">Advance</span>
                        <span className="text-xs font-bold text-indigo-600">{selectedBusiness.config.advancePaymentPercentage}%</span>
                    </div>
                    <div className="bg-white p-2 border rounded-xl text-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase block">Tax/GST</span>
                        <span className="text-xs font-bold text-indigo-600">{selectedBusiness.config.taxGstRate}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Tier</label>
                    <div className="p-3 bg-indigo-600 rounded-xl text-white flex justify-between items-center shadow-lg shadow-indigo-100">
                        <span className="text-xs font-black uppercase">Enterprise Pro</span>
                        <button className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded">Upgrade</button>
                    </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t flex gap-3">
                <button className="flex-1 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">Go to Business Dashboard</button>
                <button 
                  onClick={() => setSelectedBusiness(null)}
                  className="px-6 py-3 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Close
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
