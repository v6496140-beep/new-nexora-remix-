import React, { useState } from 'react';
import { CheckCircle, XCircle, EyeOff } from 'lucide-react';

// Mock Reviews Service
const reviewsService = {
  getReviews: (tenantId: string) => [
    { id: 'r1', customer: 'Rahul S.', rating: 5, review: 'Excellent service!', status: 'PUBLISHED' },
    { id: 'r2', customer: 'Anjali V.', rating: 4, review: 'Good work.', status: 'PENDING' },
    { id: 'r3', customer: 'Vikram K.', rating: 2, review: 'Not satisfied.', status: 'HIDDEN' },
  ],
};

export function ReviewsPage() {
  const tenantId = 'biz-barber-001';
  const [reviews] = useState(reviewsService.getReviews(tenantId));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Reviews Management</h1>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Review</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviews.map((r) => (
              <tr key={r.id}>
                <td className="p-4">{r.customer}</td>
                <td className="p-4">{r.rating}</td>
                <td className="p-4">{r.review}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs">{r.status}</span>
                </td>
                <td className="p-4 flex gap-2">
                  <button className="text-emerald-600"><CheckCircle className="w-4 h-4" /></button>
                  <button className="text-rose-600"><XCircle className="w-4 h-4" /></button>
                  <button className="text-slate-600"><EyeOff className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
