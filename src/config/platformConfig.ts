// Nexora SalonOS — Centralized Platform Configuration (Phase 3.1)
// All business logic numbers, percentages, thresholds, and defaults live here.
// DO NOT hardcode these values across UI components.

import { BusinessCategory, ThemePreset, ThemeTokens } from '../types';

export interface PlatformConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
    currency: string;
    currencySymbol: string;
  };
  bookingDefaults: {
    advancePercentage: number; // Configurable standard advance % (25%)
    commissionPercentage: number; // Configurable platform fee % (10% or 5% net)
    dailyQualificationThreshold: number; // Target volume for specialist qualification (₹1000 daily or ₹150000 monthly)
    qualificationCycleDays: number; // 15 days review cycle
    defaultSlotIntervalMinutes: number; // 15 mins
    cancellationWindowHours: number; // 4 hours free cancellation
    autoHoldExpirationMinutes: number; // 15 minutes before unconfirmed booking release
  };
  taxRules: {
    gstStandardRate: number; // 18% (9% CGST + 9% SGST)
    cgstRate: number; // 9%
    sgstRate: number; // 9%
    tdsSection194JRate: number; // 10% on contractor commission
  };
  categories: {
    id: BusinessCategory;
    displayName: string;
    defaultTheme: ThemePreset;
    description: string;
    icon: string;
  }[];
  themes: Record<ThemePreset, ThemeTokens>;
}

export const PLATFORM_CONFIG: PlatformConfig = {
  app: {
    name: 'Nexora SalonOS',
    version: '3.1.0-alpha',
    environment: (import.meta.env.MODE as any) || 'development',
    currency: 'INR',
    currencySymbol: '₹',
  },
  bookingDefaults: {
    advancePercentage: 25,
    commissionPercentage: 10,
    dailyQualificationThreshold: 1000,
    qualificationCycleDays: 15,
    defaultSlotIntervalMinutes: 15,
    cancellationWindowHours: 4,
    autoHoldExpirationMinutes: 15,
  },
  taxRules: {
    gstStandardRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    tdsSection194JRate: 10,
  },
  categories: [
    {
      id: 'barber',
      displayName: 'Barber & Men Grooming',
      defaultTheme: 'luxury',
      description: 'Precision fades, hot towel lather shaves, and beard sculpting.',
      icon: 'Scissors',
    },
    {
      id: 'hair_salon',
      displayName: 'Hair Salon & Color Atelier',
      defaultTheme: 'modern',
      description: 'Balayage, dimensional coloring, keratin treatments, and styling.',
      icon: 'Sparkles',
    },
    {
      id: 'beauty',
      displayName: 'Beauty & Skin Aesthetics',
      defaultTheme: 'elegant',
      description: 'Hydrafacial MD, clinical peels, and bridal skin preparation.',
      icon: 'Smile',
    },
    {
      id: 'nail',
      displayName: 'Nail & Lash Boutique',
      defaultTheme: 'elegant',
      description: 'Sculpted gel extensions, Russian manicures, and bespoke nail art.',
      icon: 'Palette',
    },
    {
      id: 'spa',
      displayName: 'Spa & Wellness Sanctuary',
      defaultTheme: 'minimal',
      description: 'Hydrotherapy baths, stone body rituals, and aromatherapy.',
      icon: 'Sun',
    },
    {
      id: 'massage',
      displayName: 'Massage & Muscle Recovery',
      defaultTheme: 'dark',
      description: 'Deep tissue therapy, Thai stretching, and sports rehabilitation.',
      icon: 'Activity',
    },
    {
      id: 'tattoo',
      displayName: 'Tattoo & Body Art Studio',
      defaultTheme: 'bold',
      description: 'Fine line illustration, blackwork flash, and custom artistry.',
      icon: 'PenTool',
    },
  ],
  themes: {
    luxury: {
      preset: 'luxury',
      primaryColor: '#1a1917',
      secondaryColor: '#2b2927',
      accentColor: '#c5a880',
      backgroundColor: '#fbfbfb',
      surfaceColor: '#ffffff',
      textColor: '#1a1917',
      fontFamilyHeading: 'Playfair Display, serif',
      fontFamilyBody: 'Inter, sans-serif',
      borderRadius: 'none',
      buttonStyle: 'sharp',
      spacingDensity: 'spacious',
    },
    minimal: {
      preset: 'minimal',
      primaryColor: '#0f172a',
      secondaryColor: '#334155',
      accentColor: '#64748b',
      backgroundColor: '#ffffff',
      surfaceColor: '#f8fafc',
      textColor: '#0f172a',
      fontFamilyHeading: 'Inter, sans-serif',
      fontFamilyBody: 'Inter, sans-serif',
      borderRadius: 'sm',
      buttonStyle: 'rounded',
      spacingDensity: 'comfortable',
    },
    modern: {
      preset: 'modern',
      primaryColor: '#4f46e5',
      secondaryColor: '#3730a3',
      accentColor: '#06b6d4',
      backgroundColor: '#f8fafc',
      surfaceColor: '#ffffff',
      textColor: '#0f172a',
      fontFamilyHeading: 'Plus Jakarta Sans, sans-serif',
      fontFamilyBody: 'Inter, sans-serif',
      borderRadius: 'md',
      buttonStyle: 'rounded',
      spacingDensity: 'comfortable',
    },
    bold: {
      preset: 'bold',
      primaryColor: '#000000',
      secondaryColor: '#18181b',
      accentColor: '#f59e0b',
      backgroundColor: '#fafafa',
      surfaceColor: '#ffffff',
      textColor: '#09090b',
      fontFamilyHeading: 'Syne, sans-serif',
      fontFamilyBody: 'Outfit, sans-serif',
      borderRadius: 'none',
      buttonStyle: 'sharp',
      spacingDensity: 'comfortable',
    },
    elegant: {
      preset: 'elegant',
      primaryColor: '#3b2f2f',
      secondaryColor: '#4a3b32',
      accentColor: '#e0a96d',
      backgroundColor: '#fdfbf9',
      surfaceColor: '#ffffff',
      textColor: '#2d2424',
      fontFamilyHeading: 'Cinzel, serif',
      fontFamilyBody: 'Montserrat, sans-serif',
      borderRadius: 'lg',
      buttonStyle: 'pill',
      spacingDensity: 'spacious',
    },
    dark: {
      preset: 'dark',
      primaryColor: '#09090b',
      secondaryColor: '#18181b',
      accentColor: '#38bdf8',
      backgroundColor: '#09090b',
      surfaceColor: '#18181b',
      textColor: '#f8fafc',
      fontFamilyHeading: 'Plus Jakarta Sans, sans-serif',
      fontFamilyBody: 'Inter, sans-serif',
      borderRadius: 'md',
      buttonStyle: 'rounded',
      spacingDensity: 'comfortable',
    },
  },
};
