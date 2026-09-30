import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Layout, 
  Clock, 
  TrendingUp, 
  Trash2, 
  Edit2, 
  Eye, 
  Monitor, 
  Smartphone,
  ExternalLink,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { Badge } from '../../../design-system';

interface AdCampaign {
    id: string;
    title: string;
    description: string;
    targetUrl: string;
    placement: 'homepage_hero' | 'discovery_sidebar' | 'booking_success';
    status: 'Active' | 'Scheduled' | 'Paused' | 'Ended';
    impressions: number;
    clicks: number;
    startDate: string;
    endDate: string;
    imageUrl: string;
}

export function AdsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([
    {
        id: 'ad-01',
        title: 'Premium Hair Care Launch',
        description: 'New L’Oréal Professional range available in all verified salons.',
        targetUrl: '/discovery?category=hair_salon',
        placement: 'homepage_hero',
        status: 'Active',
        impressions: 45200,
        clicks: 1240,
        startDate: '2025-09-01',
        endDate: '2025-10-30',
        imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 'ad-02',
        title: 'Wedding Season Special',
        description: 'Get 15% off on bridal makeup packages at Editor’s Choice spas.',
        targetUrl: '/discovery?featured=true',
        placement: 'discovery_sidebar',
        status: 'Scheduled',
        impressions: 0,
        clicks: 0,
        startDate: '2025-11-01',
        endDate: '2025-12-31',
        imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Ad Inventory</h1>
          <p className="text-slate-500 text-sm font-medium italic">Nexus Ads — Native Placement & Campaign Optimization</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Impressions</span>
            <span className="text-2xl font-black text-slate-900">45.2K</span>
            <div className="mt-2 flex items-center gap-1 text-green-500 font-bold text-[10px]">
                <TrendingUp className="w-3 h-3" /> +12% vs last month
            </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Avg. CTR</span>
            <span className="text-2xl font-black text-slate-900">2.74%</span>
            <div className="mt-2 flex items-center gap-1 text-green-500 font-bold text-[10px]">
                <TrendingUp className="w-3 h-3" /> +0.5% vs last month
            </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Active Banners</span>
            <span className="text-2xl font-black text-indigo-600">8</span>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Platform Revenue</span>
            <span className="text-2xl font-black text-emerald-600">₹84.5K</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50 flex gap-4 items-center">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Filter campaigns by title, tag or placement..." 
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b-2 border-slate-100">
                    <tr>
                        <th className="p-6 text-left">Creative Asset</th>
                        <th className="p-6 text-left">Placement</th>
                        <th className="p-6 text-left">Schedule</th>
                        <th className="p-6 text-left">Performance</th>
                        <th className="p-6 text-center">Status</th>
                        <th className="p-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-50">
                    {campaigns.map(ad => (
                        <tr key={ad.id} className="hover:bg-indigo-50/30 transition-all group">
                            <td className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-12 rounded-xl bg-slate-200 overflow-hidden border-2 border-white shadow-md relative">
                                        <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ImageIcon className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-black text-slate-900 tracking-tight">{ad.title}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 max-w-[200px] truncate">{ad.description}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg inline-flex items-center gap-2">
                                    <Layout className="w-3 h-3 text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{ad.placement.replace('_', ' ')}</span>
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                        <Clock className="w-3 h-3 text-indigo-500" />
                                        <span>{new Date(ad.startDate).toLocaleDateString()}</span>
                                        <ChevronRight className="w-3 h-3 text-slate-300" />
                                        <span>{new Date(ad.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">Flight Duration</div>
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="flex items-center gap-8">
                                    <div>
                                        <div className="text-sm font-black text-slate-900">{(ad.impressions / 1000).toFixed(1)}K</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Impr</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-indigo-600">{ad.clicks}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Clicks</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="flex justify-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        ad.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' :
                                        ad.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                        'bg-slate-100 text-slate-500 border-slate-200'
                                    }`}>
                                        {ad.status}
                                    </span>
                                </div>
                            </td>
                            <td className="p-6 text-right">
                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl border border-transparent hover:border-indigo-100 transition-all shadow-sm">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl border border-transparent hover:border-rose-100 transition-all shadow-sm">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Ad Preview Sandbox */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
              <Monitor className="w-64 h-64 rotate-12" />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                  <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-black">Visual Sandbox</Badge>
                  <h2 className="text-4xl font-black tracking-tight leading-tight">Test Creative Placement in Real-Time</h2>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-md">Nexus Ads use an edge-rendering engine to ensure lightning fast loads without layout shift. Use the previewer to see how your banner looks on Desktop vs Mobile devices.</p>
                  <div className="flex gap-4">
                      <button className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-100 transition-all">
                          <Monitor className="w-4 h-4" /> Desktop
                      </button>
                      <button className="px-6 py-3 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white/20 transition-all border border-white/5">
                          <Smartphone className="w-4 h-4" /> Mobile
                      </button>
                  </div>
              </div>
              <div className="bg-white/5 p-4 rounded-[2.5rem] border border-white/10 aspect-video flex items-center justify-center">
                   <div className="w-full h-full bg-slate-800 rounded-3xl border-4 border-slate-700 flex items-center justify-center text-slate-500 italic text-xs font-bold uppercase tracking-[0.2em]">
                       No Creative Selected
                   </div>
              </div>
          </div>
      </div>
    </div>
  );
}
