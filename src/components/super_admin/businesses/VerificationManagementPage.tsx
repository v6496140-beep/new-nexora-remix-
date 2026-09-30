import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  AlertCircle, 
  ShieldCheck, 
  FileText,
  MessageSquare,
  History,
  MoreVertical,
  Check
} from 'lucide-react';
import { SEEDED_PUBLIC_BUSINESSES } from '../../../data/seededPublicBusinesses';
import { Business, VerificationStatus } from '../../../types';

export function VerificationManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>('all');
  const [selectedRequest, setSelectedRequest] = useState<Business | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showActionModal, setShowActionModal] = useState<'approve' | 'reject' | 'review' | 'suspend' | null>(null);

  // SESSION STATE (Persistent for the session as per Phase 7.12 style)
  const [localBusinesses, setLocalBusinesses] = useState<Business[]>(Object.values(SEEDED_PUBLIC_BUSINESSES));

  const filteredRequests = localBusinesses.filter(biz => {
    const matchesSearch = biz.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         biz.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || biz.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateVerification = (bizId: string, status: VerificationStatus, notes?: string) => {
    setLocalBusinesses(prev => prev.map(biz => 
      biz.id === bizId ? { ...biz, verificationStatus: status, verificationNotes: notes || biz.verificationNotes } : biz
    ));
    setShowActionModal(null);
    setSelectedRequest(null);
    alert(`Business verification updated to: ${status}`);
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</span>;
      case 'pending':
        return <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'under_review':
        return <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><Eye className="w-3 h-3" /> Under Review</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
      case 'suspended':
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Suspended</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Verification Center</h1>
          <p className="text-slate-500 text-sm font-medium italic">Nexus Trust Engine — Identity & Compliance Management</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border-2 border-slate-100 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</span>
            <span className="text-xl font-black text-amber-600">{localBusinesses.filter(b => b.verificationStatus === 'pending').length}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border-2 border-slate-100 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reviewing</span>
            <span className="text-xl font-black text-indigo-600">{localBusinesses.filter(b => b.verificationStatus === 'under_review').length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search business name or nexus code..." 
              className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              className="border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 focus:border-indigo-500 outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Only</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-[0.1em] border-b-2 border-slate-100">
              <tr>
                <th className="p-4 text-left">Business Entity</th>
                <th className="p-4 text-left">Location / Geo</th>
                <th className="p-4 text-left">Nexus Rank</th>
                <th className="p-4 text-left">Submission</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {filteredRequests.map((biz) => (
                <tr key={biz.id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-lg group-hover:scale-110 transition-transform">
                        {biz.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 tracking-tight">{biz.name}</div>
                        <div className="text-[10px] font-mono text-indigo-500 uppercase font-bold tracking-tighter">{biz.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-bold text-slate-600">{biz.city}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{biz.country}</div>
                  </td>
                  <td className="p-4">
                    <div className="px-2 py-1 bg-slate-100 rounded-lg inline-block">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Tier: Enterprise</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-bold text-slate-600">
                      {biz.verificationSubmittedAt ? new Date(biz.verificationSubmittedAt).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Nexus Time</div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center italic">
                      {getStatusBadge(biz.verificationStatus)}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedRequest(biz)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl border border-transparent hover:border-indigo-100 transition-all shadow-sm group-hover:shadow-indigo-100"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRequests.length === 0 && (
            <div className="p-12 text-center">
              <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No matching verification records</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Side Drawer */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b-2 border-slate-50 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-100 font-black text-lg">
                  {selectedRequest.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedRequest.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-indigo-500 font-bold uppercase">{selectedRequest.code}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedRequest.category}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-all border border-slate-100"
              >
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
              {/* Compliance Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Current Status</span>
                  {getStatusBadge(selectedRequest.verificationStatus)}
                </div>
                <div className="bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Submission Date</span>
                  <span className="text-sm font-black text-slate-700">{selectedRequest.verificationSubmittedAt ? new Date(selectedRequest.verificationSubmittedAt).toLocaleString() : 'Not Submitted'}</span>
                </div>
              </div>

              {/* Owner Info */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> Entity Authentication
                </h3>
                <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 flex items-center gap-4 border-b border-slate-50">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-black text-slate-900 uppercase">GST/VAT Registration</div>
                        <div className="text-[10px] font-medium text-slate-500">Verified against national registry</div>
                    </div>
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-black text-slate-900 uppercase">Owner Identity (KYC)</div>
                        <div className="text-[10px] font-medium text-slate-500">Photo ID & Phone Linked</div>
                    </div>
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <History className="w-3 h-3" /> Internal Audit Log
                </h3>
                <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl shadow-indigo-100">
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3 italic">System Insight</p>
                  <p className="text-sm font-medium leading-relaxed">
                    {selectedRequest.verificationNotes || "No audit notes available for this entity. Submission appears compliant with Nexus Tier-1 standards."}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t-2 border-slate-50 bg-white grid grid-cols-2 gap-4 shrink-0">
              {selectedRequest.verificationStatus === 'verified' ? (
                <button 
                  onClick={() => setShowActionModal('suspend')}
                  className="col-span-2 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
                >
                  Suspend Verification
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setShowActionModal('reject')}
                    className="py-4 border-2 border-rose-100 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all"
                  >
                    Reject Nexus Claim
                  </button>
                  <button 
                    onClick={() => setShowActionModal('approve')}
                    className="py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    Approve Entity
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Dialog */}
      {showActionModal && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center space-y-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-2xl ${
                showActionModal === 'approve' ? 'bg-green-50 text-green-600 shadow-green-100' : 
                showActionModal === 'reject' ? 'bg-rose-50 text-rose-600 shadow-rose-100' :
                'bg-slate-50 text-slate-600 shadow-slate-100'
              }`}>
                {showActionModal === 'approve' ? <CheckCircle className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
              </div>
              
              <div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight capitalize">{showActionModal} Entity?</h4>
                <p className="text-slate-500 text-sm font-medium mt-2">
                  Confirming this action will update the business profile across the entire Nexora discovery network.
                </p>
              </div>

              {(showActionModal === 'reject' || showActionModal === 'suspend') && (
                <div className="text-left space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Official Reason</label>
                  <textarea 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-rose-500 transition-all text-sm font-medium h-32"
                    placeholder="Provide detailed compliance failure reason..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowActionModal(null)}
                  className="py-4 border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const status: VerificationStatus = showActionModal === 'approve' ? 'verified' : (showActionModal === 'reject' ? 'rejected' : 'suspended');
                    updateVerification(selectedRequest.id, status, rejectionReason);
                  }}
                  disabled={(showActionModal === 'reject' || showActionModal === 'suspend') && !rejectionReason.trim()}
                  className={`py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 ${
                    showActionModal === 'approve' ? 'bg-green-600 shadow-green-100 hover:bg-green-700' : 
                    showActionModal === 'reject' ? 'bg-rose-600 shadow-rose-100 hover:bg-rose-700' :
                    'bg-slate-900 shadow-slate-100 hover:bg-black'
                  }`}
                >
                  Confirm Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
