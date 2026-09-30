import React from 'react';
import { NotificationAutomationSettings, NotificationChannelToggle } from '../../../types/businessSettings';
import { Bell, MessageSquare, Mail, Smartphone, Star, Gift, RefreshCw, CheckCircle2 } from 'lucide-react';

export const NotificationSettingsSection: React.FC<{
  notifications: NotificationAutomationSettings;
  onChange: (updated: NotificationAutomationSettings) => void;
}> = ({ notifications, onChange }) => {
  const updateChannel = (
    section: 'bookingConfirmation' | 'reminder24h' | 'reminder2h',
    channel: keyof NotificationChannelToggle,
    value: boolean
  ) => {
    onChange({
      ...notifications,
      [section]: {
        ...notifications[section],
        [channel]: value
      }
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Transactional Notifications */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Transactional Appointment Alerts</h3>
            <p className="text-xs text-slate-500 font-medium">Automatic alerts dispatched upon booking creation, rescheduling, and upcoming appointment reminders</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Booking Confirmation */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-slate-900">Immediate Booking Confirmation</div>
              <div className="text-[11px] text-slate-500 font-medium">Sent as soon as an appointment slot is reserved or confirmed</div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.bookingConfirmation.whatsapp}
                  onChange={(e) => updateChannel('bookingConfirmation', 'whatsapp', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-emerald-700">WhatsApp</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.bookingConfirmation.sms}
                  onChange={(e) => updateChannel('bookingConfirmation', 'sms', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>SMS</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.bookingConfirmation.email}
                  onChange={(e) => updateChannel('bookingConfirmation', 'email', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Email</span>
              </label>
            </div>
          </div>

          {/* 24h Reminder */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-slate-900">24-Hour Prior Appointment Reminder</div>
              <div className="text-[11px] text-slate-500 font-medium">Gentle reminder with address and cancellation policy link</div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.reminder24h.whatsapp}
                  onChange={(e) => updateChannel('reminder24h', 'whatsapp', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-emerald-700">WhatsApp</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.reminder24h.sms}
                  onChange={(e) => updateChannel('reminder24h', 'sms', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>SMS</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.reminder24h.email}
                  onChange={(e) => updateChannel('reminder24h', 'email', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Email</span>
              </label>
            </div>
          </div>

          {/* 2h Reminder */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-slate-900">2-Hour Urgent Pre-Slot Reminder</div>
              <div className="text-[11px] text-slate-500 font-medium">Quick directional link and specialist arrival alert</div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.reminder2h.whatsapp}
                  onChange={(e) => updateChannel('reminder2h', 'whatsapp', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-emerald-700">WhatsApp</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.reminder2h.sms}
                  onChange={(e) => updateChannel('reminder2h', 'sms', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>SMS</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* CRM Retention & Engagement Automations */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Retention & Loyalty Automations</h3>
            <p className="text-xs text-slate-500 font-medium">Smart automated campaigns powered by the CRM growth engine</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Post-Visit Review Survey */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500" /> Post-Visit Review Request
              </span>
              <input
                type="checkbox"
                checked={notifications.postVisitReviewRequest.enabled}
                onChange={(e) =>
                  onChange({
                    ...notifications,
                    postVisitReviewRequest: {
                      ...notifications.postVisitReviewRequest,
                      enabled: e.target.checked
                    }
                  })
                }
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Collect 5-star customer ratings and feedback automatically post-service.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Delay:</span>
              <select
                value={notifications.postVisitReviewRequest.delayHours}
                onChange={(e) =>
                  onChange({
                    ...notifications,
                    postVisitReviewRequest: {
                      ...notifications.postVisitReviewRequest,
                      delayHours: Number(e.target.value)
                    }
                  })
                }
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold"
              >
                <option value={1}>1 Hour</option>
                <option value={2}>2 Hours (Recommended)</option>
                <option value={4}>4 Hours</option>
                <option value={24}>24 Hours</option>
              </select>
            </div>
          </div>

          {/* Birthday Greetings */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-pink-500" /> Birthday Greeting & Reward
              </span>
              <input
                type="checkbox"
                checked={notifications.birthdayGreetings.enabled}
                onChange={(e) =>
                  onChange({
                    ...notifications,
                    birthdayGreetings: {
                      ...notifications.birthdayGreetings,
                      enabled: e.target.checked
                    }
                  })
                }
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Send personalized birthday wishes with an exclusive celebratory voucher.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Discount:</span>
              <input
                type="number"
                min="5"
                max="50"
                value={notifications.birthdayGreetings.voucherDiscountPercent}
                onChange={(e) =>
                  onChange({
                    ...notifications,
                    birthdayGreetings: {
                      ...notifications.birthdayGreetings,
                      voucherDiscountPercent: Number(e.target.value)
                    }
                  })
                }
                className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
              />
              <span className="text-xs font-bold text-slate-600">%</span>
            </div>
          </div>

          {/* 30-Day Reminder */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-500" /> 30-Day Re-engagement Nudge
              </span>
              <input
                type="checkbox"
                checked={notifications.revisit30DayNudge.enabled}
                onChange={(e) =>
                  onChange({
                    ...notifications,
                    revisit30DayNudge: {
                      ...notifications.revisit30DayNudge,
                      enabled: e.target.checked
                    }
                  })
                }
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Trigger automated friendly check-ins when client hasn't visited for 30+ days.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Growth CRM Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
