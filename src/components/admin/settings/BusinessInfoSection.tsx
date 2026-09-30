import React from 'react';
import { BusinessInfoSettings } from '../../../types/businessSettings';
import { Building2, Phone, Mail, MessageSquare, MapPin, Globe, Instagram, Facebook, Image as ImageIcon } from 'lucide-react';

export const BusinessInfoSection: React.FC<{
  info: BusinessInfoSettings;
  onChange: (updated: BusinessInfoSettings) => void;
}> = ({ info, onChange }) => {
  const updateField = (field: keyof BusinessInfoSettings, value: string) => {
    onChange({
      ...info,
      [field]: value
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Business Profile & Branding</h3>
            <p className="text-xs text-slate-500 font-medium">Public salon identity, logo artwork, and contact information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Business Name *</label>
            <input
              type="text"
              value={info.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. The Royal Crown Barber & Lounge"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tagline / Subtitle</label>
            <input
              type="text"
              value={info.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
              placeholder="e.g. Artisanal Grooming & Classic Razor Rituals"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Logo URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={info.logoUrl}
                onChange={(e) => updateField('logoUrl', e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
              />
              {info.logoUrl && (
                <div className="w-10 h-10 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                  <img src={info.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cover Image URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={info.coverImageUrl}
                onChange={(e) => updateField('coverImageUrl', e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
              />
              {info.coverImageUrl && (
                <div className="w-10 h-10 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                  <img src={info.coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Direct Contact & Channels</h3>
            <p className="text-xs text-slate-500 font-medium">Customer service hotline, reservation email, and official WhatsApp</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number *
            </label>
            <input
              type="tel"
              value={info.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+91 98200 12345"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Business Email *
            </label>
            <input
              type="email"
              value={info.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="contact@royalcrown.in"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Number
            </label>
            <input
              type="tel"
              value={info.whatsapp}
              onChange={(e) => updateField('whatsapp', e.target.value)}
              placeholder="+91 98200 12345"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Location & Postal Address</h3>
            <p className="text-xs text-slate-500 font-medium">Physical salon address for customer navigation and Google Maps integration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5 md:col-span-2 lg:col-span-4">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Street Address *</label>
            <input
              type="text"
              value={info.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="e.g. Hill Road, Bandra West"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">City *</label>
            <input
              type="text"
              value={info.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder="Mumbai"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">State / Region</label>
            <input
              type="text"
              value={info.state}
              onChange={(e) => updateField('state', e.target.value)}
              placeholder="Maharashtra"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Country *</label>
            <input
              type="text"
              value={info.country}
              onChange={(e) => updateField('country', e.target.value)}
              placeholder="India"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Postal / PIN Code</label>
            <input
              type="text"
              value={info.postalCode}
              onChange={(e) => updateField('postalCode', e.target.value)}
              placeholder="400050"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Social Media & Online Links</h3>
            <p className="text-xs text-slate-500 font-medium">Links displayed on your public booking page and footer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-500" /> Instagram Handle or URL
            </label>
            <input
              type="text"
              value={info.instagram}
              onChange={(e) => updateField('instagram', e.target.value)}
              placeholder="https://instagram.com/royalcrownbarber"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook Page URL
            </label>
            <input
              type="text"
              value={info.facebook}
              onChange={(e) => updateField('facebook', e.target.value)}
              placeholder="https://facebook.com/royalcrownbarber"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
