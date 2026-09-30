import React, { useState, useMemo } from 'react';
import { Search, Calendar, User, Phone, CheckCircle, Clock, X, Eye } from 'lucide-react';
import { BookingOrchestratorService } from '../services/bookingOrchestratorService';
import { BookingEntity } from '../types/bookingEngine';

const orchestrator = new BookingOrchestratorService();

export function BookingsPage() {
  const [bookings] = useState<BookingEntity[]>(() => orchestrator.getBookingRepo().listBookingsByTenant('royal-crown-biz-id'));
  const [selectedBooking, setSelectedBooking] = useState<BookingEntity | null>(null);
  const [filter, setFilter] = useState('');

  const filteredBookings = useMemo(() => {
    if (!filter.trim()) return bookings;
    const term = filter.toLowerCase();
    return bookings.filter(b => 
      b.customerName?.toLowerCase().includes(term) ||
      b.id?.toLowerCase().includes(term) ||
      b.serviceId?.toLowerCase().includes(term) ||
      b.customerPhone?.includes(term)
    );
  }, [bookings, filter]);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Appointment Bookings</h1>
          <p className="text-slate-500 text-sm">Real-time scheduling ledger and customer booking requests</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Total:</span>
          <span className="text-lg font-black text-indigo-600">{filteredBookings.length}</span>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input 
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm font-medium transition-all shadow-xs" 
          placeholder="Search by customer name, booking ID, phone, or service..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b: BookingEntity) => (
                <tr 
                  key={b.id} 
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group" 
                  onClick={() => setSelectedBooking(b)}
                >
                  <td className="p-4 font-mono font-bold text-indigo-600 text-xs">{b.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800 text-xs">{b.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{b.customerPhone}</div>
                  </td>
                  <td className="p-4">
                    <span className="capitalize text-xs font-medium text-slate-700">{b.serviceId}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-bold uppercase tracking-tight">
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBooking(b);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all"
                      aria-label="View booking details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="p-12 text-center space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-bold text-sm">No bookings found matching your search.</p>
              <p className="text-slate-400 text-xs">Try clearing the search query.</p>
            </div>
          )}
        </div>
      </div>

      {selectedBooking && (
        <div 
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex justify-end" 
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="w-full max-w-md bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <span className="text-[10px] font-mono text-indigo-600 uppercase font-bold">Booking Details</span>
                  <h2 className="text-xl font-black text-slate-900">{selectedBooking.id}</h2>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)} 
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl border border-slate-100"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Contact</div>
                  <div className="font-bold text-slate-800 text-base">{selectedBooking.customerName}</div>
                  <div className="text-xs text-slate-600 font-mono">{selectedBooking.customerPhone}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Item</div>
                  <div className="font-bold text-slate-800 capitalize">{selectedBooking.serviceId}</div>
                  <div className="text-xs text-slate-500">Status: <span className="font-bold uppercase text-indigo-600">{selectedBooking.status}</span></div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Total Booking Value</span>
                  <span className="text-base font-black text-slate-900">₹{selectedBooking.totalAmount}</span>
                </div>
              </div>
            </div>

            <button 
              className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-black transition-all" 
              onClick={() => setSelectedBooking(null)}
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
