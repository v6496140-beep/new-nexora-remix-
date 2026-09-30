export const BUSINESS_SETTINGS = {
  profile: { name: 'Royal Crown Barber', slug: 'royal-crown-barber', email: 'info@royalcrown.com' },
  hours: { mon: { open: true, start: '09:00', end: '20:00' } },
  booking: { advanceDays: 30, slotInterval: 30, advancePercentage: 25 },
  notifications: { email: true, whatsapp: true },
  policies: { cancellation: '24 hours notice required.' }
};

export const getSettings = (businessId: string) => BUSINESS_SETTINGS;
export const updateSettings = (businessId: string, section: string, data: any) => ({ ...BUSINESS_SETTINGS, [section]: data });
