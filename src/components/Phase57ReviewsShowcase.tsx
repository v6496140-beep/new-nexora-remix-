import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Scissors,
  Sparkles,
  Sparkle,
  Award,
  MessageSquare,
  Eye,
  Check,
  X,
  Lock,
  ThumbsUp,
  Filter
} from 'lucide-react';

import { reviewsService } from '../services/reviewsService';
import { ReviewEntity, ReviewStatus } from '../types/reviews';
import { BookingEntity } from '../types/bookingEngine';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase57ReviewsShowcase() {
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');
  const [activeTab, setActiveTab] = useState<'customer' | 'admin' | 'public'>('customer');

  // Customer Review Submission Form State
  const [customerName, setCustomerName] = useState('Rahul Dravid');
  const [customerId, setCustomerId] = useState('cust-rahul-01');
  const [bookingId, setBookingId] = useState('bk-completed-sample-1');
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState('Exceptional fade and beard grooming experience!');

  // Success Feedback Message
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Automated Test Suite State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Data
  const businessReviews = reviewsService.listBusinessReviews(currentBusinessId);
  const publicReviews = reviewsService.listPublicReviews(currentBusinessId);
  const ratingSummary = reviewsService.getBusinessRatingSummary(currentBusinessId);

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock completed booking for submission demo
    const mockCompletedBooking: BookingEntity = {
      id: bookingId,
      businessId: currentBusinessId,
      customerId,
      customerName,
      customerPhone: '+91 9999900000',
      customerEmail: 'rahul@test.com',
      items: [],
      bookingDate: '2026-10-18',
      startTime: '10:00',
      endTime: '11:00',
      duration: 60,
      subtotal: 1500,
      discount: 0,
      totalAmount: 1500,
      advancePercentage: 25,
      advanceAmount: 375,
      remainingAmount: 1125,
      currency: 'INR',
      financials: { currency: 'INR', subtotalCents: 150000, discountCents: 0, totalCents: 150000, advancePercentage: 25, advanceAmountCents: 37500, remainingAmountCents: 112500, taxGstCents: 0 },
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-18T11:00:00Z',
      statusHistory: []
    };

    const res = reviewsService.createReview(
      {
        businessId: currentBusinessId,
        customerId,
        customerName,
        bookingId,
        rating,
        reviewText
      },
      mockCompletedBooking
    );

    if (res.success) {
      showTempSuccess('Review submitted successfully! Pending admin moderation.');
    } else {
      alert(res.error || 'Review submission failed');
    }
  };

  const handleModeration = (reviewId: string, status: ReviewStatus) => {
    reviewsService.updateReviewStatus(reviewId, status);
    showTempSuccess(`Review status updated to ${status}`);
  };

  const showTempSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleRunTests = () => {
    setIsTesting(true);
    setTimeout(() => {
      const res = runFoundationTestSuite();
      setTestResults(res);
      setIsTesting(false);
    }, 400);
  };

  const businessNames: Record<string, string> = {
    'biz-barber-001': 'Royal Crown Barber',
    'biz-spa-002': 'Zenith Stone Spa',
    'biz-nail-003': 'Gloss & Chic Nail Bar',
    'biz-tattoo-004': 'Mono Tattoo Studio'
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Phase 5.7 — Reviews & Ratings System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Customer Reviews, Anti-Abuse Eligibility & Admin Moderation
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Verified review system restricted strictly to customers with completed bookings. Features 1–5 star ratings, PENDING/PUBLISHED/HIDDEN/REJECTED moderation lifecycle, anti-abuse duplicate review prevention, and public aggregate rating widgets.
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
              <span>Run Suite 24 Tests</span>
            </button>
          </div>
        </div>

        {/* Tenant Selector Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Business Context:
          </span>

          {[
            { id: 'biz-barber-001', label: 'Royal Crown Barber', icon: Scissors },
            { id: 'biz-spa-002', label: 'Zenith Stone Spa', icon: Sparkles },
            { id: 'biz-nail-003', label: 'Gloss & Chic Nail Bar', icon: Sparkle },
            { id: 'biz-tattoo-004', label: 'Mono Tattoo Studio', icon: Award }
          ].map((biz) => {
            const Icon = biz.icon;
            const isSelected = currentBusinessId === biz.id;
            return (
              <button
                key={biz.id}
                onClick={() => setCurrentBusinessId(biz.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/30'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{biz.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Automated Test Results Runner */}
      {testResults && (
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-base">Suite 24: Phase 5.7 Reviews & Ratings Automated Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 24') || r.suite.includes('Phase 5.7'))
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

      {/* Success Feedback Toast */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex flex-wrap items-center gap-2">
        {[
          { id: 'customer', label: 'Customer Review Portal', icon: MessageSquare },
          { id: 'admin', label: 'Business Admin Moderation', icon: ShieldCheck },
          { id: 'public', label: 'Public Website Widget', icon: Star }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Views */}

      {/* CUSTOMER REVIEW PORTAL */}
      {activeTab === 'customer' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 max-w-2xl">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-bold text-slate-900 text-lg">Submit Verified Review</h2>
            <p className="text-xs text-slate-500">
              Restricted to completed bookings. Enforces anti-abuse rule (one review per booking).
            </p>
          </div>

          <form onSubmit={handleCreateReview} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Customer Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Completed Booking ID</label>
                <input
                  type="text"
                  required
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Rating (1 to 5 Stars)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-slate-900 text-sm">{rating} / 5</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Review Comments</label>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share details of your experience..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BUSINESS ADMIN MODERATION */}
      {activeTab === 'admin' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Review Moderation Queue ({businessNames[currentBusinessId]})</h2>
              <p className="text-xs text-slate-500">Approve, publish, hide, or reject submitted reviews.</p>
            </div>

            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold">
              {businessReviews.length} Total Reviews
            </span>
          </div>

          {businessReviews.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
              No reviews registered for this business.
            </div>
          ) : (
            <div className="space-y-3">
              {businessReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{rev.customerName}</span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rev.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rev.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{rev.reviewText || 'No comment provided'}</p>
                    <span className="text-[10px] text-slate-400 font-mono">Booking ID: {rev.bookingId} · {rev.createdAt.substring(0, 10)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {rev.status !== 'PUBLISHED' && (
                      <button
                        onClick={() => handleModeration(rev.id, 'PUBLISHED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs"
                      >
                        Publish
                      </button>
                    )}
                    {rev.status !== 'HIDDEN' && (
                      <button
                        onClick={() => handleModeration(rev.id, 'HIDDEN')}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-xs"
                      >
                        Hide
                      </button>
                    )}
                    {rev.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleModeration(rev.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-xs"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PUBLIC WEBSITE WIDGET */}
      {activeTab === 'public' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 max-w-3xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Public Published Reviews ({businessNames[currentBusinessId]})</h2>
              <p className="text-xs text-slate-500">Only PUBLISHED reviews are displayed publicly.</p>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="font-extrabold text-slate-900 text-base">{ratingSummary.averageRating}</span>
              <span className="text-xs text-slate-500 font-medium">({ratingSummary.reviewCount} verified reviews)</span>
            </div>
          </div>

          {publicReviews.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
              No published reviews available for this business.
            </div>
          ) : (
            <div className="space-y-4">
              {publicReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{rev.customerName}</span>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{rev.reviewText}</p>
                  <div className="text-[10px] text-slate-400 font-mono">Verified Completed Booking · {rev.createdAt.substring(0, 10)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
