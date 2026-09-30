import React, { useState } from 'react';
import { BookingOrchestratorService } from '../services/bookingOrchestratorService';
import { BookingEntity } from '../types/bookingEngine';

const orchestrator = new BookingOrchestratorService();

export function BookingsPage() {
  const [bookings] = useState<BookingEntity[]>(orchestrator.getBookingRepo().listBookingsByTenant('royal-crown-biz-id'));
  const [selectedBooking, setSelectedBooking] = useState<BookingEntity | null>(null);
  const [filter, setFilter] = useState('');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
      
      <div className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200">
         <input 
           className="border p-2 rounded w-full" 
           placeholder="Search bookings..." 
           value={filter}
           onChange={(e) => setFilter(e.target.value)}
         />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Service</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((b: BookingEntity) => (
              <tr key={b.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedBooking(b)}>
                <td className="p-4 font-mono text-indigo-600">{b.id}</td>
                <td className="p-4">{b.customerName}</td>
                <td className="p-4">{b.serviceId}</td>
                <td className="p-4">
                   <span className="px-2 py-1 bg-slate-100 rounded text-xs">
                     {b.status}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex justify-end" onClick={() => setSelectedBooking(null)}>
          <div className="w-96 bg-white h-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Booking Details: {selectedBooking.id}</h2>
            <div className="space-y-3 text-sm">
              <p><strong>Customer:</strong> {selectedBooking.customerName}</p>
              <p><strong>Phone:</strong> {selectedBooking.customerPhone}</p>
              <p><strong>Service:</strong> {selectedBooking.serviceId}</p>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
              <p><strong>Total:</strong> ₹{selectedBooking.totalAmount}</p>
            </div>
            <button className="mt-6 w-full p-2 bg-slate-200 rounded" onClick={() => setSelectedBooking(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
