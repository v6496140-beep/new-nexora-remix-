import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Scissors,
  Award,
  DollarSign,
  Plus,
  RefreshCw,
  Clock,
  Settings,
  AlertCircle,
  Lock,
  ArrowRightLeft,
  Calendar,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  Bookmark,
  ChevronRight,
  TrendingUp,
  User,
  Star,
  Users,
  Eye,
  Check,
  Copy,
  PenTool,
  Globe
} from 'lucide-react';

import { analyticsService } from '../services/analyticsService';
import { aiGrowthService, GeneratedGrowthAsset } from '../services/aiGrowthService';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

type ToolType = 'OFFER_IDEAS' | 'CAMPAIGN_COPY' | 'WHATSAPP_DRAFT' | 'SOCIAL_POST' | 'GOOGLE_BUSINESS' | 'REVIEW_RESPONSE' | 'DESCRIPTION';

export function Phase611AiGrowthShowcase() {
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');

  // Input States
  const [targetSegment, setTargetSegment] = useState<string>('VIP');
  const [customTopic, setCustomTopic] = useState('Festive Autumn Renewal Package');
  const [offerValue, setOfferValue] = useState('Flat ₹250 Off');
  
  // Active Generated Copy States
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>('OFFER_IDEAS');
  const [editableHeadline, setEditableHeadline] = useState('🎁 Tailored Offer Draft Ready');
  const [editableBody, setEditableBody] = useState('Click any AI generator button to write custom growth assets instantly...');
  const [editableCta, setEditableCta] = useState('Confirm & Claim');
  const [editableTags, setEditableTags] = useState<string[]>(['AI', 'Growth']);
  
  // Guardrail state
  const [userAuthorized, setUserAuthorized] = useState(false);

  // General feedback
  const [feedback, setFeedback] = useState<string | null>(null);

  // Test suite states
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Dynamic values
  const stats = analyticsService.getBusinessAnalytics(currentBusinessId);

  const handleGenerate = async (tool: ToolType) => {
    setIsGenerating(true);
    setActiveTool(tool);
    try {
      // Simulate typical AI thinking latency
      await new Promise((r) => setTimeout(r, 350));
      const asset = await aiGrowthService.generateGrowthAsset(tool, {
        businessName: currentBusinessId === 'biz-barber-001' ? 'Royal Crown Barber' : 'Zenith Stone Spa',
        targetSegment,
        customTopic,
        offerValue
      });

      setEditableHeadline(asset.headline);
      setEditableBody(asset.body);
      setEditableCta(asset.callToAction);
      setEditableTags(asset.suggestedTags);
      showFeedback(`AI generated draft for ${tool} ready for review & edits!`);
    } catch (err: any) {
      showFeedback(`Generation failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRunTests = () => {
    setIsTesting(true);
    setTimeout(() => {
      const res = runFoundationTestSuite();
      setTestResults(res);
      setIsTesting(false);
    }, 400);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 6.11 — AI Growth & Marketing Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI-Powered Local Visibility & Analytics Cockpit
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Analyze precise bookings, conversions, retention curves, and top-performer rankings. Co-pilot campaigns using highly controlled, sandbox AI generators for Instagram posts, WhatsApp campaign copy, Google Business updates, and review responses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunTests}
              disabled={isTesting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg transition-all disabled:opacity-50"
            >
              {isTesting ? (
                <RotateCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              <span>Run Suite 38 Tests</span>
            </button>
          </div>
        </div>

        {/* Workspace Tenant Selector */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Active Business Workspace:
          </span>

          {[
            { id: 'biz-barber-001', label: 'Royal Crown Barber' },
            { id: 'biz-spa-002', label: 'Zenith Stone Spa' }
          ].map((biz) => {
            const isSelected = currentBusinessId === biz.id;
            return (
              <button
                key={biz.id}
                onClick={() => {
                  setCurrentBusinessId(biz.id);
                  setEditableBody('Click any AI generator button to write custom growth assets instantly...');
                  setEditableHeadline('🎁 Tailored Offer Draft Ready');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/30'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{biz.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 2. Automated Test Results Runner */}
      {testResults && (
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-base">Suite 38: Phase 6.11 AI Growth & Analytics Tests</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                {testResults.passed} / {testResults.total} PASSED
              </span>
              {testResults.failed > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-400 font-mono text-xs font-bold border border-rose-500/30">
                  {testResults.failed} FAILED
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {testResults.results
              .filter((r) => r.suite.includes('Suite 38') || r.suite.includes('Phase 6.11'))
              .map((res, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    res.passed
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                      : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                  }`}
                >
                  {res.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-100">{res.name}</div>
                    <div className="text-[11px] opacity-80 mt-0.5">{res.message}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. Analytics Dashboard Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Bookings Funnel</span>
          <div className="text-xl font-black text-slate-950">{stats.totalBookings} Total</div>
          <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>{stats.completedBookings} Completed</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Estimated Revenue</span>
          <div className="text-xl font-black text-slate-950">₹{stats.revenue}</div>
          <div className="text-[10px] text-slate-500 font-semibold block">Avg Ticket: ₹{stats.avgBookingValue.toFixed(1)}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Active Customers</span>
          <div className="text-xl font-black text-slate-950">{stats.newCustomersCount + stats.returningCustomersCount}</div>
          <div className="text-[10px] text-indigo-600 font-semibold block">Retention Rate: {stats.customerRetentionRate}%</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Booking Conversion</span>
          <div className="text-xl font-black text-emerald-600">{stats.bookingConversionRate}%</div>
          <span className="text-[10px] text-slate-500 font-semibold block">Offer Redemptions: {stats.offerRedemptionCount}</span>
        </div>

        {/* Local Ranking Insights Panel (Anti-SEO Guarantee compliance wording) */}
        <div className="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-100 space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-1 text-[10px] text-indigo-800 font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>Improve Local Visibility</span>
          </div>
          <div className="text-xs font-extrabold text-slate-800">Visibility Tier: {stats.publicProfileVisibility}</div>
          <div className="text-[10px] text-slate-500 font-medium">
            Completeness: {stats.profileCompleteness}% · {stats.reviewCount} Reviews ({stats.avgRating}⭐)
          </div>
        </div>

      </div>

      {/* 4. AI Generator workspace split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Controlled Parameters & Generator tools */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <PenTool className="w-4.5 h-4.5 text-indigo-600" />
              <span>Controlled AI Growth Co-Pilot</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Grooming Category</label>
                  <select
                    value={targetSegment}
                    onChange={(e) => setTargetSegment(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="VIP Clients">VIP Luxury</option>
                    <option value="Birthday Customers">Birthday Specials</option>
                    <option value="Inactive Clients">Re-Engagement</option>
                    <option value="First-time Walkins">First Time Walk-ins</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Promo Discount Value</label>
                  <input
                    type="text"
                    value={offerValue}
                    onChange={(e) => setOfferValue(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Custom Campaign Topic or Festival Name</label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              {/* Specific Trigger Buttons grid */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Outbound Channel Drafts</span>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleGenerate('OFFER_IDEAS')}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-bold text-slate-800 transition-all flex items-center justify-between"
                  >
                    <span>💡 Offer Ideas</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleGenerate('CAMPAIGN_COPY')}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-bold text-slate-800 transition-all flex items-center justify-between"
                  >
                    <span>📣 Campaign Copy</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleGenerate('WHATSAPP_DRAFT')}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-bold text-slate-800 transition-all flex items-center justify-between"
                  >
                    <span>📲 WhatsApp Blast</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleGenerate('SOCIAL_POST')}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-bold text-slate-800 transition-all flex items-center justify-between"
                  >
                    <span>📸 Instagram Draft</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleGenerate('GOOGLE_BUSINESS')}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-bold text-slate-800 transition-all flex items-center justify-between"
                  >
                    <span>🔵 Google Profile</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleGenerate('REVIEW_RESPONSE')}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-bold text-slate-800 transition-all flex items-center justify-between"
                  >
                    <span>⭐ Review Response</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: Copy Sandbox Output & User Authorization Guardrail */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
                <span>AI Copywriter Sandbox (Fully Editable)</span>
              </h3>
              {isGenerating && (
                <span className="text-[11px] font-bold text-indigo-600 animate-pulse">Gemini thinking...</span>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Generated Header</span>
                <input
                  type="text"
                  value={editableHeadline}
                  onChange={(e) => setEditableHeadline(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Draft Content (Make your edits here)</span>
                <textarea
                  rows={6}
                  value={editableBody}
                  onChange={(e) => setEditableBody(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">CTA Action Link</span>
                  <input
                    type="text"
                    value={editableCta}
                    onChange={(e) => setEditableCta(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Topic Tags</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {editableTags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-800 font-bold text-[9px]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strict Security Guardrail: Explicit business authorization */}
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-2.5 text-xs">
                <input
                  id="auth-check"
                  type="checkbox"
                  checked={userAuthorized}
                  onChange={(e) => setUserAuthorized(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer"
                />
                <label htmlFor="auth-check" className="font-semibold text-slate-800 leading-relaxed cursor-pointer select-none">
                  <strong className="text-indigo-950">Explicit Human Authorization Requirement</strong>: I have reviewed this AI draft, performed necessary corrections, and authorize SalonOS to queue this for client dispatch.
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={!userAuthorized}
                  onClick={() => {
                    showFeedback('Campaign approved and successfully scheduled!');
                    setUserAuthorized(false);
                  }}
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all disabled:opacity-40"
                >
                  Approve & Launch Outbound
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${editableHeadline}\n\n${editableBody}\n\nAction: ${editableCta}`);
                    showFeedback('Copy successfully copied to clipboard!');
                  }}
                  className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy to Clipboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 5. Top staff and service performance metrics table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-semibold">
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <h4 className="font-bold text-slate-900 text-sm">Top Performing Services</h4>
          
          <div className="space-y-2">
            {stats.topServices.map((srv, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{srv.serviceName}</span>
                  <span className="text-[10px] text-slate-400 block">{srv.bookings} Bookings completed</span>
                </div>
                <div className="font-mono text-slate-900 font-extrabold text-sm">₹{srv.revenue}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <h4 className="font-bold text-slate-900 text-sm">Staff Performance Rankings</h4>
          
          <div className="space-y-2">
            {stats.topStaff.map((st, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{st.staffName}</span>
                  <span className="text-[10px] text-slate-400 block">{st.bookings} Checkout completed</span>
                </div>
                <div className="font-mono text-slate-900 font-extrabold text-sm">₹{st.revenue}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
