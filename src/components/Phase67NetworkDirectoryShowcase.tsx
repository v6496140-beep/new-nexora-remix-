import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Scissors,
  Sparkles,
  Sparkle,
  Plus,
  RefreshCw,
  Clock,
  AlertCircle,
  Lock,
  ArrowRightLeft,
  Calendar,
  FileText,
  Star,
  Compass,
  Filter,
  Check,
  Users,
  Search,
  CheckSquare
} from 'lucide-react';

import { rewardsRankingService } from '../services/rewardsRankingService';
import { JaipurBusinessShowcase, RewardEntity } from '../types/rewardsRanking';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase67NetworkDirectoryShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [directoryOrder, setDirectoryOrder] = useState<'ALPHABETICAL' | 'RECENTLY_JOINED' | 'RANDOMIZED'>('ALPHABETICAL');

  // Reward generation input
  const [targetBusinessId, setTargetBusinessId] = useState('biz-jpr-01');
  const [rewardType, setRewardType] = useState<'BOOKING_MILESTONE' | 'REVENUE_MILESTONE' | 'CUSTOMER_RETENTION' | 'REVIEW_MILESTONE' | 'PLATFORM_ACTIVITY' | 'REFERRAL'>('BOOKING_MILESTONE');
  const [milestoneValue, setMilestoneValue] = useState('100');
  const [milestoneDesc, setMilestoneDesc] = useState('Superstar booking milestone reached!');

  const [feedback, setFeedback] = useState<string | null>(null);

  // Automated Test State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Fetch unranked members list based on clean discovery ordering (no collection rankings!)
  const list = rewardsRankingService.getJaipurBusinessNetwork(activeCategory, directoryOrder);
  const rewards = rewardsRankingService.listRewards();

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      rewardsRankingService.evaluateAndGrantReward(
        targetBusinessId,
        rewardType,
        parseInt(milestoneValue) || 0,
        milestoneDesc
      );
      showFeedback('Milestone reward evaluated and registered successfully!');
    } catch (err: any) {
      showFeedback(`Reward registration failed: ${err.message}`);
    }
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleRunTests = () => {
    setIsTesting(true);
    setTimeout(() => {
      const res = runFoundationTestSuite();
      setTestResults(res);
      setIsTesting(false);
    }, 400);
  };

  const jaipurCategories = ['All', 'Barber', 'Salon', 'Beauty', 'Spa', 'Nails', 'Tattoo'];

  const businessNames: Record<string, string> = {
    'biz-jpr-01': 'The Royal Heritage Salon & Spa',
    'biz-jpr-02': 'Pink City Hair & Barber Studio',
    'biz-jpr-03': 'Jaipur Shimmer Nails & Beauty Bar',
    'biz-jpr-04': 'Ananda Wellness Ayurvedic Spa',
    'biz-jpr-05': 'Eternal Ink Tattoo Studio',
    'biz-jpr-06': 'Aura Skin Care & Beauty Lounge'
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 6-C.1 — Unranked Network Directory & Milestone Badges</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Nexora Jaipur Network Directory
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Your Salon. Your Brand. Your Success. Build your business with the Nexora Jaipur Network. Everything your salon needs to build, manage, and grow digitally.
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
              <span>Run Suite 34 Tests</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center gap-2 shadow-sm animate-pulse">
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
              <h3 className="font-bold text-base">Suite 34: Phase 6.7 Network & Verification Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 34') || r.suite.includes('Phase 6.7'))
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

      {/* 3. Unbiased Public Discovery Network Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">Nexora Jaipur Network Members</h2>
            <p className="text-xs text-slate-500">
              Discover verified businesses power-managed by Nexora SalonOS.
            </p>
          </div>


          <div className="flex flex-wrap items-center gap-3">
            {/* Discovery order switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-700">
              <span className="px-2 text-slate-400 text-[10px] uppercase font-bold">Sort By</span>
              <button
                onClick={() => setDirectoryOrder('ALPHABETICAL')}
                className={`px-2.5 py-1 rounded-md ${directoryOrder === 'ALPHABETICAL' ? 'bg-white shadow-xs text-indigo-700' : ''}`}
              >
                Alphabetical
              </button>
              <button
                onClick={() => setDirectoryOrder('RECENTLY_JOINED')}
                className={`px-2.5 py-1 rounded-md ${directoryOrder === 'RECENTLY_JOINED' ? 'bg-white shadow-xs text-indigo-700' : ''}`}
              >
                Joined Sequence
              </button>
              <button
                onClick={() => setDirectoryOrder('RANDOMIZED')}
                className={`px-2.5 py-1 rounded-md ${directoryOrder === 'RANDOMIZED' ? 'bg-white shadow-xs text-indigo-700' : ''}`}
              >
                Random Rotation
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-1">
              {jaipurCategories.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic directory network members */}
        {list.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No salons match the selected Category filter inside this network.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((b) => (
              <div
                key={b.businessId}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:shadow-xs transition-all relative"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                      {b.category}
                    </span>
                    {b.isVerified && (
                      <span className="text-[9px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 border border-emerald-100">
                        ✓ Verified Member
                      </span>
                    )}

                    {/* Featured label complying with Phase 6-C.1 guidelines */}
                    {b.badges.some(tag => tag.includes('Featured')) ? (
                      <span className="text-[9px] text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded font-bold border border-indigo-100">
                        ✨ Nexora Featured Business
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded font-semibold">
                        Nexora Certified Member
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm leading-tight pr-4">
                    {b.name}
                  </h3>

                  <div className="text-[11px] text-slate-500 font-medium">
                    📍 {b.location}
                  </div>

                  {/* Rating star render */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{b.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({b.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-slate-400 space-y-0.5 font-mono">
                    <div>Completed Bookings: <span className="font-bold text-slate-700">{b.completedBookings}</span></div>
                    <div>Loyal Customer Retention: <span className="font-bold text-slate-700">{b.retentionRate}%</span></div>
                  </div>

                  {/* Verified milestone credentials */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {b.badges
                      .filter(badge => !badge.includes('Top 5')) // strip rankings
                      .map((badge, bidx) => (
                        <span
                          key={bidx}
                          className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[9px] font-extrabold"
                        >
                          {badge}
                        </span>
                      ))}
                  </div>

                  <a
                    href={b.publicLink}
                    onClick={(e) => { e.preventDefault(); showFeedback(`Navigating to public page for ${b.name}`); }}
                    className="block text-center py-2 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-all"
                  >
                    View Public Booking Portal
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Milestone Admin Tools Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Network Directory Security Guidelines */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
            <span>Anti-Collection-Ranking Security Rules</span>
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Financial transactions and QR collection metrics are strictly separated from user discovery interfaces.
          </p>

          <div className="space-y-3 text-[11px] font-semibold text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Zero-Ranking Principle: No competitive leaderboard exists.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Private Ledgers: Financial collections (QR, Wallet) are privately isolated.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>No competitive score biased visibility ordering.</span>
            </div>
          </div>
        </div>

        {/* Right Col: Admin Milestone Manager & Badges */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Grant Milestones */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-sm">Add Certified Verification Badges</h2>
            <form onSubmit={handleAddReward} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Select Member Business</label>
                  <select
                    value={targetBusinessId}
                    onChange={(e) => setTargetBusinessId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="biz-jpr-01">The Royal Heritage</option>
                    <option value="biz-jpr-02">Pink City Hair</option>
                    <option value="biz-jpr-03">Jaipur Shimmer Nails</option>
                    <option value="biz-jpr-04">Ananda Wellness Ayurvedic</option>
                    <option value="biz-jpr-05">Eternal Ink</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Milestone Category</label>
                  <select
                    value={rewardType}
                    onChange={(e) => setRewardType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="BOOKING_MILESTONE">Booking Milestone</option>
                    <option value="REVENUE_MILESTONE">Revenue Milestone</option>
                    <option value="CUSTOMER_RETENTION">Customer Retention</option>
                    <option value="REVIEW_MILESTONE">Review Milestone</option>
                    <option value="PLATFORM_ACTIVITY">Platform Activity</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Threshold Target count</label>
                  <input
                    type="number"
                    required
                    value={milestoneValue}
                    onChange={(e) => setMilestoneValue(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Badge Criteria Title</label>
                  <input
                    type="text"
                    required
                    value={milestoneDesc}
                    onChange={(e) => setMilestoneDesc(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md"
              >
                Grant Certified Badge
              </button>
            </form>
          </div>

          {/* Active Rewards/Badges */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-sm">Earned Milestones & Badges</h2>
            {rewards.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">No active milestone rewards registered.</div>
            ) : (
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-bold">
                      <th className="py-2 px-1">Business Name</th>
                      <th className="py-2 px-1">Type</th>
                      <th className="py-2 px-1">Milestone Criteria Badge</th>
                      <th className="py-2 px-1">Award Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-800">
                    {rewards.map((r) => (
                      <tr key={r.rewardId}>
                        <td className="py-2 px-1 font-bold text-slate-900">{businessNames[r.businessId] || r.businessId}</td>
                        <td className="py-2 px-1 font-mono text-[10px] text-indigo-600 font-bold">{r.rewardType}</td>
                        <td className="py-2 px-1 text-slate-600">{r.criteria}</td>
                        <td className="py-2 px-1 text-slate-400 font-mono text-[10px]">{r.earnedAt?.substring(0, 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
