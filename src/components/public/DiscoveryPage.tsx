import React, { useState } from 'react';
import { Search, MapPin, Star, ShieldCheck, Filter, ArrowRight, Sparkles } from 'lucide-react';
import { SEEDED_PUBLIC_BUSINESSES } from '../../data/seededPublicBusinesses';
import { Card, Badge, Typography, Button } from '../../design-system';

export function DiscoveryPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const businesses = Object.values(SEEDED_PUBLIC_BUSINESSES);
  
  const filtered = businesses.filter(biz => {
    const matchesSearch = biz.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         biz.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || biz.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(businesses.map(b => b.category)));

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search salons, spas or cities..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${categoryFilter === 'all' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
            >
              All Services
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${categoryFilter === cat ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Strip */}
        <div className="mb-10 space-y-4">
            <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 fill-current" />
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Featured Selections</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {businesses.filter(b => b.isFeatured).map(biz => (
                    <div 
                        key={biz.id}
                        onClick={() => onNavigate(`/b/${biz.slug}`)}
                        className="group relative bg-slate-900 rounded-[2.5rem] p-8 text-white overflow-hidden cursor-pointer shadow-2xl shadow-indigo-100/50 hover:-translate-y-1 transition-all"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform duration-500">
                             <ShieldCheck className="w-40 h-40" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="success" size="sm" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Editor's Choice</Badge>
                                {biz.verificationStatus === 'verified' && (
                                    <div className="flex items-center gap-1 text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>Verified</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight">{biz.name}</h3>
                                <p className="text-slate-400 text-sm font-medium mt-1">{biz.tagline}</p>
                            </div>
                            <div className="flex items-center gap-4 pt-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold">
                                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                                    <span>4.9 (420+ Reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                    <MapPin className="w-4 h-4" />
                                    <span>{biz.city}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* List */}
        <div className="space-y-6">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nearby Establishments</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(biz => (
                    <div 
                        key={biz.id}
                        onClick={() => onNavigate(`/b/${biz.slug}`)}
                        className="bg-white rounded-[2rem] border-2 border-slate-100 overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-100 transition-all"
                    >
                        <div className="aspect-video bg-slate-100 relative">
                             {/* Placeholder for real business logo/cover */}
                             <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                 <Sparkles className="w-12 h-12" />
                             </div>
                             <div className="absolute top-4 right-4">
                                {biz.verificationStatus === 'verified' && (
                                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-emerald-100 text-emerald-600">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                )}
                             </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-black text-slate-900 tracking-tight text-lg group-hover:text-indigo-600 transition-colors">{biz.name}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{biz.category.replace('-', ' ')}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                                    <span className="text-[10px] font-black text-amber-700">4.9</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span>{biz.address}, {biz.city}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Book from ₹299</span>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filtered.length === 0 && (
                <div className="py-20 text-center">
                    <Typography variant="h3" className="text-slate-300 uppercase tracking-widest italic">No Salons Discovered in this sector</Typography>
                    <p className="text-slate-400 text-sm font-medium mt-2">Try adjusting your filters or search radius.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
