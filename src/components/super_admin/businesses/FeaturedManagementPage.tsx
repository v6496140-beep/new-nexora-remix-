import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  DollarSign, 
  Search, 
  Trash2, 
  Layout, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { SEEDED_PUBLIC_BUSINESSES } from '../../../data/seededPublicBusinesses';
import { Business } from '../../../types';

export function FeaturedManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // SESSION STATE
  const [localBusinesses, setLocalBusinesses] = useState<Business[]>(Object.values(SEEDED_PUBLIC_BUSINESSES));

  const featured = localBusinesses.filter(b => b.isFeatured);
  const nonFeatured = localBusinesses.filter(b => !b.isFeatured);

  const toggleFeatured = (bizId: string, value: boolean) => {
    setLocalBusinesses(prev => prev.map(biz => 
      biz.id === bizId ? { ...biz, isFeatured: value, featuredUntil: value ? '2027-01-01' : undefined } : biz
    ));
    alert(`Business ${value ? 'promoted to Featured' : 'removed from Featured'}`);
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Featured Inventory</h1>
          <p className="text-slate-500 text-sm font-medium italic">Nexus Promotion Engine — High-Visibility Slot Management</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-amber-50 px-6 py-2 rounded-2xl border-2 border-amber-100 flex items-center gap-3 shadow-sm shadow-amber-50">
                <Sparkles className="w-5 h-5 text-amber-500 fill-current" />
                <div>
                    <span className="text-[10px] font-black text-amber-400 uppercase block leading-none">Active Slots</span>
                    <span className="text-xl font-black text-amber-700">{featured.length} / 10</span>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Featured List */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Live on Marketplace</h2>
            <div className="grid grid-cols-1 gap-4">
                {featured.map(biz => (
                    <div key={biz.id} className="bg-slate-900 rounded-[2rem] p-6 text-white flex items-center justify-between group shadow-2xl shadow-indigo-100">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl">
                                {biz.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-tight">{biz.name}</h3>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                    <span>{biz.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                    <span className="text-amber-400">Featured until Jan 2027</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="text-right hidden sm:block mr-4">
                                 <span className="text-[10px] font-black text-slate-500 uppercase block tracking-widest">Revenue Impact</span>
                                 <span className="text-sm font-black text-green-400">+240% Impressions</span>
                             </div>
                             <button 
                                onClick={() => toggleFeatured(biz.id, false)}
                                className="p-3 bg-white/10 hover:bg-rose-500 text-white rounded-xl transition-all border border-white/5"
                             >
                                 <Trash2 className="w-5 h-5" />
                             </button>
                        </div>
                    </div>
                ))}
                {featured.length === 0 && (
                    <div className="p-12 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
                         <Layout className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                         <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No active promotions</p>
                    </div>
                )}
            </div>
        </div>

        {/* Inventory Selection */}
        <div className="space-y-6">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Available for Promotion</h2>
            <div className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                <div className="p-4 border-b bg-slate-50/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search salon registry..." 
                            className="w-full pl-10 pr-4 py-2 bg-white border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-500 transition-all text-xs font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {nonFeatured.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())).map(biz => (
                        <div key={biz.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all flex items-center justify-between">
                            <div>
                                <h4 className="text-xs font-black text-slate-900 tracking-tight">{biz.name}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{biz.city}</p>
                            </div>
                            <button 
                                onClick={() => toggleFeatured(biz.id, true)}
                                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
