import React, { useState } from 'react';
import { Search, Filter, Mail, Shield, User, MapPin, CheckCircle, Clock, MoreVertical, Star } from 'lucide-react';

interface Member {
    id: string;
    name: string;
    email: string;
    role: 'Super Admin' | 'Business Owner' | 'Manager' | 'Staff' | 'Customer';
    status: 'Active' | 'Pending' | 'Suspended';
    location: string;
    joinedDate: string;
    businesses: number;
}

export function NetworkMembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [members] = useState<Member[]>([
    { id: 'usr-1', name: 'Vijay Tiwari', email: 'vijaytiwari28912@gmail.com', role: 'Business Owner', status: 'Active', location: 'Mumbai, IN', joinedDate: '2025-01-12', businesses: 1 },
    { id: 'usr-2', name: 'Elena Rostova', email: 'elena@glosschic.in', role: 'Staff', status: 'Active', location: 'Delhi, IN', joinedDate: '2025-06-10', businesses: 1 },
    { id: 'usr-3', name: 'Marco Silva', email: 'marco@royalcrown.in', role: 'Manager', status: 'Active', location: 'Mumbai, IN', joinedDate: '2025-02-15', businesses: 1 },
    { id: 'usr-4', name: 'System Auditor', email: 'audit@nexora.salon', role: 'Super Admin', status: 'Active', location: 'Global', joinedDate: '2024-12-01', businesses: 0 },
    { id: 'usr-5', name: 'Rahul Sharma', email: 'rahul.s@gmail.com', role: 'Customer', status: 'Active', location: 'Bangalore, IN', joinedDate: '2026-01-20', businesses: 0 },
  ]);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Network Members</h1>
          <p className="text-slate-500 text-sm">Registry of all registered users across the Nexora ecosystem</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">Export CSV</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">+ Invite Member</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
              <tr className="text-left border-b">
                <th className="p-4">Member Identity</th>
                <th className="p-4">Global Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Location</th>
                <th className="p-4">Affiliations</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold text-xs border-2 border-white shadow-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">{member.name}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{member.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                        {member.role === 'Super Admin' ? <Shield className="w-3 h-3 text-rose-500" /> : <User className="w-3 h-3 text-indigo-400" />}
                        <span className={`text-xs font-bold ${member.role === 'Super Admin' ? 'text-rose-600' : 'text-slate-600'}`}>{member.role}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border ${
                      member.status === 'Active' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[11px] font-medium">{member.location}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">
                        {member.businesses} {member.businesses === 1 ? 'Salon' : 'Salons'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all">
                            <Star className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-slate-50/30 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Showing {filteredMembers.length} Members</span>
            <div className="flex gap-4">
                <button className="hover:text-indigo-600">Previous</button>
                <button className="hover:text-indigo-600">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}
