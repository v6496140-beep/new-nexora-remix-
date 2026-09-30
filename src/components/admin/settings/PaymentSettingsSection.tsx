import React from 'react';
import { PaymentGatewaySettings } from '../../../types/businessSettings';
import { CreditCard, QrCode, ShieldCheck, Lock, CheckCircle2, DollarSign, Percent } from 'lucide-react';

export const PaymentSettingsSection: React.FC<{
  payment: PaymentGatewaySettings;
  onChange: (updated: PaymentGatewaySettings) => void;
}> = ({ payment, onChange }) => {
  const updateField = <K extends keyof PaymentGatewaySettings>(field: K, value: PaymentGatewaySettings[K]) => {
    onChange({
      ...payment,
      [field]: value
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Nexora Dynamic QR UPI */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Nexora Dynamic QR & Soundbox</h3>
              <p className="text-xs text-slate-500 font-medium">Instant zero-gateway UPI countertop collection with automated payment split</p>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Salon Merchant VPA / UPI ID
            </label>
            <input
              type="text"
              value={payment.merchantUpiVpa}
              onChange={(e) => updateField('merchantUpiVpa', e.target.value)}
              placeholder="e.g. royalcrown@icici"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Settlement Mode
            </label>
            <select
              value={payment.settlementMode}
              onChange={(e) => updateField('settlementMode', e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            >
              <option value="AUTOMATIC_SPLIT">Automatic Bank Split (T+1 Daily Auto-Transfer)</option>
              <option value="MANUAL_WITHDRAWAL">Manual Wallet Withdrawal (Disburse on Demand)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-900">Enable Nexora QR at Countertop POS</div>
            <div className="text-[11px] text-slate-500">Generates instant dynamic QR on customer checkout and mobile app</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={payment.nexoraQrEnabled}
              onChange={(e) => updateField('nexoraQrEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      {/* Online Gateway Provider & Currency */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Payment Gateway & Operating Currency</h3>
            <p className="text-xs text-slate-500 font-medium">Merchant gateway integration for credit/debit cards, NetBanking, and wallets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Active Payment Gateway Provider
            </label>
            <select
              value={payment.paymentProvider}
              onChange={(e) => updateField('paymentProvider', e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            >
              <option value="RAZORPAY">Razorpay India (Cards, UPI, NetBanking, EMI)</option>
              <option value="STRIPE">Stripe Global (International Cards & Apple Pay)</option>
              <option value="NEXORA_SPLIT">Nexora Direct Split Core Gateway</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Operating Currency
            </label>
            <select
              value={payment.currency}
              onChange={(e) => {
                const cur = e.target.value;
                const sym = cur === 'INR' ? '₹' : cur === 'USD' ? '$' : cur === 'AED' ? 'د.إ' : '€';
                onChange({
                  ...payment,
                  currency: cur,
                  currencySymbol: sym
                });
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            >
              <option value="INR">INR (₹) — Indian Rupee</option>
              <option value="USD">USD ($) — United States Dollar</option>
              <option value="AED">AED (د.إ) — UAE Dirham</option>
              <option value="EUR">EUR (€) — Euro</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Goods & Services Tax (GST %)
            </label>
            <input
              type="number"
              min="0"
              max="28"
              value={payment.taxGstRate}
              onChange={(e) => updateField('taxGstRate', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              TDS Withholding Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={payment.taxTdsRate}
              onChange={(e) => updateField('taxTdsRate', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Security / Secret Isolation Notice */}
        <div className="p-4 bg-slate-900 text-slate-300 rounded-xl border border-slate-800 text-xs flex items-start gap-3">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-white">PCI-DSS Compliant Secret Storage</div>
            <div className="text-[11px] text-slate-400">
              API keys and merchant secrets are securely isolated in encrypted environment vaults and proxy servers. Client applications never expose or transmit sensitive gateway credentials.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
