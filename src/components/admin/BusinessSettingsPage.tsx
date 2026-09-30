import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck, Clock, XCircle, AlertCircle, CheckCircle, Info, FileText, Send, History } from 'lucide-react';
import { SEEDED_PUBLIC_BUSINESSES } from '../../data/seededPublicBusinesses';
import { supabase } from '../../lib/supabase';
import { verificationService } from '../../services/verificationService';
import { Business, BusinessVerificationHistory } from '../../types';

export function BusinessSettingsPage() {
  const initialBiz = SEEDED_PUBLIC_BUSINESSES['royal-crown']; // Simulated current business
  const [business, setBusiness] = useState<Business>(initialBiz);
  const [isSubmitting, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<BusinessVerificationHistory[]>([]);

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = () => {
    const current = verificationService.getBusiness(initialBiz.id) || initialBiz;
    setBusiness(current);
    try {
      // Business owner fetching their own history (allowed by RLS)
      const history = verificationService.getVerificationHistory(current.id, current.ownerId, 'BUSINESS_OWNER');
      setHistoryRecords(history);
    } catch {
      setHistoryRecords([]);
    }
  };

  const handleDocumentSubmit = async () => {
    setLoading(true);
    try {
      // 1. Submit through verificationService (which maintains the audit history and RLS guard)
      await verificationService.submitForReview(
        business.id, 
        business.ownerId, 
        'Owner uploaded GST tax certificate and verified KYC ID document.'
      );

      // 2. Also try Supabase directly if credentials present
      try {
        await supabase
          .from('businesses')
          .update({ 
            verification_status: 'under_review',
            verification_submitted_at: new Date().toISOString()
          })
          .eq('id', business.id);
      } catch (dbError) {
        // Fallback for demo environment
      }
      
      loadBusinessData();
      alert('Submission successful! Your compliance documents are now under review by the platform trust team.');
      setIsCreating(false);
    } catch (error: any) {
      console.error('Error submitting verification:', error.message);
      alert(`Submission error: ${error.message}`);
      setIsCreating(false);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = () => {
    switch (business.verificationStatus) {
      case 'verified':
        return (
          <div className="p-6 bg-green-50 border-2 border-green-100 rounded-3xl space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-lg shadow-green-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-green-900 uppercase text-sm tracking-tight">Entity Verified</h3>
                <p className="text-xs text-green-700 font-medium">Your business is fully authenticated. The trust badge is visible to customers.</p>
              </div>
            </div>
            {business.verifiedAt && (
              <div className="text-[10px] font-mono text-green-800 bg-green-100/50 p-2 rounded-xl">
                Authenticated On: {new Date(business.verifiedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        );
      case 'pending':
      case 'under_review':
        return (
          <div className="p-6 bg-indigo-50 border-2 border-indigo-100 rounded-3xl space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 animate-pulse">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-indigo-900 uppercase text-sm tracking-tight">Trust Review in Progress</h3>
                <p className="text-xs text-indigo-700 font-medium">Our compliance team is auditing your credentials. Estimated turnaround: 24-48 hours.</p>
              </div>
            </div>
            {business.verificationSubmittedAt && (
              <div className="text-[10px] text-indigo-800 bg-indigo-100/50 p-2 rounded-xl font-medium">
                Submitted At: {new Date(business.verificationSubmittedAt).toLocaleString()}
              </div>
            )}
          </div>
        );
      case 'rejected':
        return (
          <div className="p-6 bg-rose-50 border-2 border-rose-100 rounded-3xl space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-rose-900 uppercase text-sm tracking-tight">Compliance Review Update</h3>
                <p className="text-xs text-rose-700 font-medium">Your submission was not approved. Please review the reason below and resubmit.</p>
              </div>
            </div>
            <div className="p-4 bg-white/70 rounded-2xl border border-rose-200">
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Official Feedback</p>
              <p className="text-xs font-bold text-slate-800">
                {business.rejectionReason || "Identity or business licensing documentation was incomplete or unclear."}
              </p>
            </div>
            <button 
              onClick={() => setIsCreating(true)}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-rose-100 transition-all"
            >
              Resubmit for Review
            </button>
          </div>
        );
      case 'suspended':
        return (
          <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-3xl space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-amber-950 uppercase text-sm tracking-tight">Verification Suspended</h3>
                <p className="text-xs text-amber-800 font-medium">Compliance status is currently on hold. Contact platform support.</p>
              </div>
            </div>
            {business.suspensionReason && (
              <div className="p-3 bg-white/70 rounded-xl border border-amber-200 text-xs text-slate-800">
                <span className="font-bold">Reason:</span> {business.suspensionReason}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-6 shadow-2xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="w-32 h-32 rotate-12" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black tracking-tight mb-2">Get the Nexus Trust Badge</h3>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">Verify your business to unlock premium discovery features, lower commission rates, and higher customer trust.</p>
            </div>
            <button 
              onClick={() => setIsCreating(true)}
              className="relative z-10 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg"
            >
              Start Verification Process
            </button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl space-y-8 font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Profile</h1>
          <p className="text-slate-500 font-medium">Manage your identity and public appearance on Nexora</p>
        </div>
        <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <Save className="w-4 h-4" /> Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-indigo-500" />
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Public Identity</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Salon Tagline</label>
                <input type="text" className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-slate-700" defaultValue={business.tagline} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                <textarea className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-600 h-32 leading-relaxed" defaultValue="The Royal Crown is Mumbai's premier destination for classic grooming. Our master barbers combine traditional techniques with modern precision to ensure you leave looking and feeling your absolute best." />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-indigo-500" />
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Contact & Geo</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Public Phone</label>
                <input type="text" className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-slate-700" defaultValue={business.phone} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Public Email</label>
                <input type="text" className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-slate-700" defaultValue={business.email} />
              </div>
            </div>
          </div>

          {/* Owner's Own Verification History */}
          {historyRecords.length > 0 && (
            <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-500" />
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Your Verification Audit Log</h2>
              </div>
              <div className="space-y-2">
                {historyRecords.map(item => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold uppercase text-slate-700">{item.newStatus}</span>
                      {item.reason && <p className="text-[11px] text-slate-500 mt-0.5">{item.reason}</p>}
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Verification Card */}
          {getStatusDisplay()}

          {/* Tips Card */}
          <div className="p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100 space-y-4">
            <h4 className="font-black text-sm uppercase tracking-wide">Verification Checklist</h4>
            <ul className="text-xs space-y-2 text-indigo-100 list-disc list-inside">
              <li>Valid Government Business Registration</li>
              <li>Authorized Signatory KYC Photo ID</li>
              <li>Proof of Operating Premise (Lease or Utility)</li>
              <li>Bank Account Ownership Proof</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Verification Submission Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 space-y-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Trust Verification</h2>
                <p className="text-slate-500 text-sm font-medium">Please provide your official business documentation.</p>
              </div>

              <div className="space-y-4">
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group text-center">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-indigo-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Upload GST/Tax Certificate</span>
                  <span className="text-[8px] text-slate-400 font-bold mt-1 block">PDF, JPG or PNG (Max 5MB)</span>
                </div>
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group text-center">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-indigo-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Upload Identity Proof (Owner)</span>
                  <span className="text-[8px] text-slate-400 font-bold mt-1 block">Aadhar, PAN or Passport</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setIsCreating(false)}
                  className="py-4 border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDocumentSubmit}
                  disabled={loading}
                  className="py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Docs'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
