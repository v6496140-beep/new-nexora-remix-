// Nexora SalonOS — Phase 3.2 Design System Tokens & Category Themes

export interface ThemeTokens {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  ring: string;
  radius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  fontHeading: string;
  fontBody: string;
}

// 10 Approved Category Themes
export type CategoryThemeKey =
  | 'barber'
  | 'hair_salon'
  | 'beauty'
  | 'nail'
  | 'spa'
  | 'massage'
  | 'tattoo'
  | 'unisex'
  | 'makeup'
  | 'wellness';

export const CATEGORY_THEMES: Record<CategoryThemeKey, { name: string; tokens: ThemeTokens }> = {
  barber: {
    name: 'Barber & Men Grooming',
    tokens: {
      primary: '#1a1917',
      primaryHover: '#2b2927',
      secondary: '#2e2b26',
      accent: '#c5a880',
      background: '#faf9f6',
      surface: '#ffffff',
      surfaceMuted: '#f3f1ec',
      text: '#1a1917',
      textMuted: '#6d685e',
      border: '#e6e2da',
      ring: '#c5a880',
      radius: 'none',
      fontHeading: 'Playfair Display, Georgia, serif',
      fontBody: 'Inter, sans-serif'
    }
  },
  hair_salon: {
    name: 'Hair Salon & Color Atelier',
    tokens: {
      primary: '#4f46e5',
      primaryHover: '#4338ca',
      secondary: '#3730a3',
      accent: '#06b6d4',
      background: '#f8fafc',
      surface: '#ffffff',
      surfaceMuted: '#f1f5f9',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#e2e8f0',
      ring: '#6366f1',
      radius: 'md',
      fontHeading: 'Plus Jakarta Sans, sans-serif',
      fontBody: 'Inter, sans-serif'
    }
  },
  beauty: {
    name: 'Beauty & Skin Aesthetics',
    tokens: {
      primary: '#be185d',
      primaryHover: '#9d174d',
      secondary: '#831843',
      accent: '#f472b6',
      background: '#fff1f2',
      surface: '#ffffff',
      surfaceMuted: '#fce7f3',
      text: '#4c0519',
      textMuted: '#9f1239',
      border: '#fbcfe8',
      ring: '#f43f5e',
      radius: 'lg',
      fontHeading: 'Cinzel, serif',
      fontBody: 'Montserrat, sans-serif'
    }
  },
  nail: {
    name: 'Nail & Lash Studio',
    tokens: {
      primary: '#db2777',
      primaryHover: '#be185d',
      secondary: '#9d174d',
      accent: '#fb7185',
      background: '#fff5f7',
      surface: '#ffffff',
      surfaceMuted: '#ffe4e6',
      text: '#500724',
      textMuted: '#831843',
      border: '#fecdd3',
      ring: '#f43f5e',
      radius: 'full',
      fontHeading: 'Outfit, sans-serif',
      fontBody: 'Inter, sans-serif'
    }
  },
  spa: {
    name: 'Spa & Retreat',
    tokens: {
      primary: '#047857',
      primaryHover: '#065f46',
      secondary: '#064e3b',
      accent: '#34d399',
      background: '#f0fdf4',
      surface: '#ffffff',
      surfaceMuted: '#dcfce7',
      text: '#022c22',
      textMuted: '#065f46',
      border: '#bbf7d0',
      ring: '#10b981',
      radius: 'lg',
      fontHeading: 'Cinzel, serif',
      fontBody: 'Inter, sans-serif'
    }
  },
  massage: {
    name: 'Massage & Bodywork',
    tokens: {
      primary: '#3f2e1e',
      primaryHover: '#2a1f14',
      secondary: '#451a03',
      accent: '#d97706',
      background: '#fdf8f4',
      surface: '#ffffff',
      surfaceMuted: '#fbf0e4',
      text: '#291b0f',
      textMuted: '#785536',
      border: '#f1dec9',
      ring: '#d97706',
      radius: 'sm',
      fontHeading: 'Plus Jakarta Sans, sans-serif',
      fontBody: 'Inter, sans-serif'
    }
  },
  tattoo: {
    name: 'Tattoo & Body Art',
    tokens: {
      primary: '#09090b',
      primaryHover: '#18181b',
      secondary: '#27272a',
      accent: '#f59e0b',
      background: '#09090b',
      surface: '#18181b',
      surfaceMuted: '#27272a',
      text: '#f4f4f5',
      textMuted: '#a1a1aa',
      border: '#3f3f46',
      ring: '#f59e0b',
      radius: 'none',
      fontHeading: 'Syne, sans-serif',
      fontBody: 'Outfit, sans-serif'
    }
  },
  unisex: {
    name: 'Unisex Hair & Lounge',
    tokens: {
      primary: '#0f172a',
      primaryHover: '#1e293b',
      secondary: '#334155',
      accent: '#38bdf8',
      background: '#f8fafc',
      surface: '#ffffff',
      surfaceMuted: '#f1f5f9',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#e2e8f0',
      ring: '#0284c7',
      radius: 'md',
      fontHeading: 'Inter, sans-serif',
      fontBody: 'Inter, sans-serif'
    }
  },
  makeup: {
    name: 'Bridal & Editorial Makeup',
    tokens: {
      primary: '#881337',
      primaryHover: '#701a35',
      secondary: '#4c0519',
      accent: '#e11d48',
      background: '#fff1f2',
      surface: '#ffffff',
      surfaceMuted: '#ffe4e6',
      text: '#4c0519',
      textMuted: '#9f1239',
      border: '#fecdd3',
      ring: '#f43f5e',
      radius: 'lg',
      fontHeading: 'Playfair Display, serif',
      fontBody: 'Montserrat, sans-serif'
    }
  },
  wellness: {
    name: 'Holistic Wellness & Naturopathy',
    tokens: {
      primary: '#115e59',
      primaryHover: '#0f766e',
      secondary: '#134e4a',
      accent: '#14b8a6',
      background: '#f0fdfa',
      surface: '#ffffff',
      surfaceMuted: '#ccfbf1',
      text: '#042f2e',
      textMuted: '#115e59',
      border: '#99f6e4',
      ring: '#0d9488',
      radius: 'md',
      fontHeading: 'Plus Jakarta Sans, sans-serif',
      fontBody: 'Inter, sans-serif'
    }
  }
};

// Approved Spacing Scale
export const SPACING_SCALE = {
  xs: '0.25rem', // 4px
  sm: '0.5rem',  // 8px
  md: '1rem',    // 16px
  lg: '1.5rem',  // 24px
  xl: '2rem',    // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem'  // 64px
} as const;
