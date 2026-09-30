// Nexora SalonOS — Phase 2.1 Design Foundation Data

export interface TypographyToken {
  level: string;
  element: string;
  sizeRem: string;
  sizePx: string;
  weight: string;
  lineHeight: string;
  letterSpacing: string;
  usage: string;
}

export interface SpacingToken {
  token: string;
  rem: string;
  px: string;
  usage: string;
}

export interface ContainerToken {
  name: string;
  breakpoint: string;
  maxWidth: string;
  gutter: string;
  columns: number;
  gap: string;
}

export interface ComponentStyleRule {
  name: string;
  category: 'Primitives & Inputs' | 'Surfaces & Feedback' | 'Navigation & Layout';
  anatomy: string;
  dimensions: string;
  tokens: {
    background: string;
    border: string;
    text: string;
    radius: string;
    shadow?: string;
  };
  states: {
    default: string;
    hover?: string;
    focus?: string;
    active?: string;
    disabled?: string;
    error?: string;
  };
  accessibilityNote: string;
}

export interface CategoryThemeOverride {
  id: string;
  categoryName: string;
  personality: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  border: string;
  buttonStyle: string;
  typographyPersonality: {
    headingFont: string;
    bodyFont: string;
    scaleRatio: string;
    accentStyle: string;
  };
  cardStyle: string;
  imageTreatment: string;
}

// 1. TYPOGRAPHY SYSTEM
export const TYPOGRAPHY_TOKENS: TypographyToken[] = [
  { level: 'Display Hero (H1)', element: 'h1', sizeRem: '3.0rem (Desktop) / 2.0rem (Mobile)', sizePx: '48px / 32px', weight: '700 (Bold)', lineHeight: '1.15', letterSpacing: '-0.025em (-1.2px)', usage: 'Landing page and salon website hero headlines' },
  { level: 'Page Title (H2)', element: 'h2', sizeRem: '2.0rem (Desktop) / 1.5rem (Mobile)', sizePx: '32px / 24px', weight: '600 (SemiBold)', lineHeight: '1.25', letterSpacing: '-0.02em (-0.64px)', usage: 'Major section titles (Services, Packages, About, Admin pages)' },
  { level: 'Section Title (H3)', element: 'h3', sizeRem: '1.5rem (Desktop) / 1.25rem (Mobile)', sizePx: '24px / 20px', weight: '600 (SemiBold)', lineHeight: '1.30', letterSpacing: '-0.015em (-0.36px)', usage: 'Card group headers, modal titles, drawer headers' },
  { level: 'Card Title (H4)', element: 'h4', sizeRem: '1.125rem', sizePx: '18px', weight: '600 (SemiBold)', lineHeight: '1.40', letterSpacing: '-0.01em (-0.18px)', usage: 'Service card titles, staff specialist names, package headers' },
  { level: 'Body Large', element: 'p.lead', sizeRem: '1.0rem', sizePx: '16px', weight: '400 (Regular) / 500 (Medium)', lineHeight: '1.50', letterSpacing: '0em (0px)', usage: 'Hero intro copy, primary form labels, feature intros' },
  { level: 'Body Regular', element: 'p, span', sizeRem: '0.875rem', sizePx: '14px', weight: '400 (Regular)', lineHeight: '1.50', letterSpacing: '0em (0px)', usage: 'Standard descriptions, data table cell content, input text' },
  { level: 'Body Small / Caption', element: 'span, small', sizeRem: '0.75rem', sizePx: '12px', weight: '500 (Medium)', lineHeight: '1.40', letterSpacing: '+0.01em (+0.12px)', usage: 'Badges, timestamp labels, advance breakdown note, form helper text' },
  { level: 'Micro / Legal', element: 'small, footer', sizeRem: '0.6875rem', sizePx: '11px', weight: '400 (Regular)', lineHeight: '1.30', letterSpacing: '+0.02em (+0.22px)', usage: 'GSTIN disclosure, copyright line, keyboard shortcut tokens' }
];

// 2. SPACING SCALE (4px/8px Geometric Grid)
export const SPACING_TOKENS: SpacingToken[] = [
  { token: 'space.0', rem: '0rem', px: '0px', usage: 'Reset margin and padding' },
  { token: 'space.1', rem: '0.25rem', px: '4px', usage: 'Status badge internal vertical padding, icon-text tight gap' },
  { token: 'space.2', rem: '0.50rem', px: '8px', usage: 'Button horizontal inner icon gap, chip padding, tight list gap' },
  { token: 'space.3', rem: '0.75rem', px: '12px', usage: 'Input field vertical padding, compact table cell padding' },
  { token: 'space.4', rem: '1.00rem', px: '16px', usage: 'Default mobile page gutter, card inner padding, standard form gap' },
  { token: 'space.5', rem: '1.25rem', px: '20px', usage: 'Input horizontal padding, medium card gutter' },
  { token: 'space.6', rem: '1.50rem', px: '24px', usage: 'Desktop card internal padding, table header padding, sub-block vertical gap' },
  { token: 'space.8', rem: '2.00rem', px: '32px', usage: 'Tablet screen gutter, modal window margin, section sub-headers' },
  { token: 'space.10', rem: '2.50rem', px: '40px', usage: 'Desktop page header separation, major widget gap' },
  { token: 'space.12', rem: '3.00rem', px: '48px', usage: 'Public website mobile section vertical spacing' },
  { token: 'space.16', rem: '4.00rem', px: '64px', usage: 'Tablet section vertical spacing, large hero padding' },
  { token: 'space.20', rem: '5.00rem', px: '80px', usage: 'Public website desktop section vertical spacing' },
  { token: 'space.24', rem: '6.00rem', px: '96px', usage: 'Widescreen hero top & bottom padding' }
];

// 3. CONTAINER WIDTHS & GRID SYSTEM
export const CONTAINER_TOKENS: ContainerToken[] = [
  { name: 'Mobile Viewport', breakpoint: '360px+', maxWidth: '100% (fluid)', gutter: '16px (1.0rem)', columns: 4, gap: '12px' },
  { name: 'Tablet Viewport', breakpoint: '768px+', maxWidth: '720px', gutter: '24px (1.5rem)', columns: 8, gap: '16px' },
  { name: 'Desktop Standard', breakpoint: '1024px+', maxWidth: '980px / 1200px', gutter: '32px (2.0rem)', columns: 12, gap: '24px' },
  { name: 'Large Desktop / Widescreen', breakpoint: '1440px+', maxWidth: '1280px / 1400px (locked)', gutter: '40px (2.5rem)', columns: 12, gap: '32px' }
];

// 4. BORDER RADIUS, SHADOWS, & BORDERS
export const ELEVATION_TOKENS = {
  radius: [
    { token: 'radius.none', value: '0px', usage: 'Sharp Brutalist / Tattoo Studio cards, buttons, inputs' },
    { token: 'radius.sm', value: '4px', usage: 'Data table rows, status badge chips, small input fields' },
    { token: 'radius.md', value: '8px', usage: 'Standard admin cards, modal containers, buttons, select inputs' },
    { token: 'radius.lg', value: '12px', usage: 'Public website service cards, package cards, image thumbnails' },
    { token: 'radius.xl', value: '16px', usage: 'Spa / Beauty parlour soft luxury containers' },
    { token: 'radius.full', value: '9999px', usage: 'Category selector chips, status indicator dots, circular specialist avatars' }
  ],
  shadows: [
    { token: 'shadow.none', value: 'none', usage: 'Flat outline architecture, zero muddy shadows' },
    { token: 'shadow.outline', value: '0 0 0 1px rgba(0, 0, 0, 0.08)', usage: 'Clean modern public cards, table outer borders' },
    { token: 'shadow.sm', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', usage: 'Standard interactive cards, form inputs' },
    { token: 'shadow.md', value: '0 4px 6px -1px rgba(0, 0, 0, 0.07)', usage: 'Dropdown menus, popovers, sticky topbar on scroll' },
    { token: 'shadow.lg', value: '0 10px 15px -3px rgba(0, 0, 0, 0.10)', usage: 'Modals, mobile slide-over booking drawers' }
  ],
  borders: [
    { token: 'border.subtle', value: '1px solid #E4E4E7 (neutral-200)', usage: 'Internal dividers, table row borders, card outlines' },
    { token: 'border.strong', value: '1px solid #D4D4D8 (neutral-300)', usage: 'Input outlines, active tab borders' },
    { token: 'border.focus', value: '2px solid #18181B (neutral-900) offset 2px', usage: 'Accessible keyboard focus indicators' },
    { token: 'border.error', value: '1px solid #DC2626 (red-600)', usage: 'Form input validation error state' }
  ]
};

// 5. COMPONENT STYLING RULES (25 Tokenized Elements)
export const COMPONENT_RULES: ComponentStyleRule[] = [
  // 12. Buttons
  {
    name: 'Button (Primary, Secondary, Outline, Sticky Bar)',
    category: 'Primitives & Inputs',
    anatomy: 'Container + Leading Icon (optional) + Label + Trailing Icon (optional)',
    dimensions: 'Height: 44px (Desktop) / 48px (Mobile Touch Minimum). Padding: 12px 20px.',
    tokens: {
      background: 'Primary Accent (#18181B or Category Primary)',
      border: 'None (Primary) / 1px solid neutral-300 (Outline)',
      text: '#FFFFFF (High contrast ratio 15.3:1) / #18181B (Outline)',
      radius: 'radius.md (8px) or Category Override',
      shadow: 'shadow.sm'
    },
    states: {
      default: 'Solid fill, clear text label, crisp geometry.',
      hover: 'Brightness 95%, subtle -1px translateY.',
      focus: '2px solid neutral-900 focus ring with 2px white offset (WCAG 2.4.7).',
      active: 'TranslateY 0px, brightness 90%.',
      disabled: 'Opacity 50%, cursor not-allowed, pointer-events none.'
    },
    accessibilityNote: 'Touch target is minimum 48px on mobile viewports; label has contrast ratio > 4.5:1.'
  },
  // 13. Inputs
  {
    name: 'Input (Text, Email, Phone, Number)',
    category: 'Primitives & Inputs',
    anatomy: 'Label (<label>) + Input Box + Icon Prefix (optional) + Helper / Error Text',
    dimensions: 'Height: 44px (Desktop) / 48px (Mobile). Padding: 10px 14px.',
    tokens: {
      background: '#FFFFFF (neutral-0)',
      border: '1px solid #D4D4D8 (neutral-300)',
      text: '#18181B (neutral-900)',
      radius: 'radius.md (8px)'
    },
    states: {
      default: 'Clean neutral border, placeholder in #71717A (neutral-500).',
      hover: 'Border color shifts to #71717A (neutral-500).',
      focus: 'Border shifts to neutral-900, 2px ring offset 0px.',
      disabled: 'Background #F4F4F5 (neutral-100), text #A1A1AA, cursor not-allowed.',
      error: 'Border 1.5px solid #DC2626 (red-600), helper text in red-600.'
    },
    accessibilityNote: 'Always pairs with explicit <label htmlFor="id">. Placeholders never replace labels.'
  },
  // 14. Selects
  {
    name: 'Select (Category, Staff, Service Filters)',
    category: 'Primitives & Inputs',
    anatomy: 'Label + Native or Custom Select Box + Chevron Down Glyph',
    dimensions: 'Height: 44px (Desktop) / 48px (Mobile). Padding: 10px 36px 10px 14px.',
    tokens: {
      background: '#FFFFFF',
      border: '1px solid #D4D4D8',
      text: '#18181B',
      radius: 'radius.md (8px)'
    },
    states: {
      default: 'Standard select box with custom chevron right aligned.',
      hover: 'Border shifts to #71717A.',
      focus: '2px focus ring neutral-900 with 2px offset.',
      disabled: 'Background #F4F4F5, text #A1A1AA.'
    },
    accessibilityNote: 'Standard keyboard navigation (Arrow Up/Down, Enter/Space to select, Esc to close).'
  },
  // 15. Textarea
  {
    name: 'Textarea (Special Instructions, Salon Bio)',
    category: 'Primitives & Inputs',
    anatomy: 'Label + Multi-line Box + Character Counter (optional)',
    dimensions: 'Min-height: 96px. Padding: 12px 14px. Line height: 1.5.',
    tokens: {
      background: '#FFFFFF',
      border: '1px solid #D4D4D8',
      text: '#18181B',
      radius: 'radius.md (8px)'
    },
    states: {
      default: 'Clean neutral border, resize vertical only.',
      hover: 'Border #71717A.',
      focus: '2px solid neutral-900 ring.',
      error: 'Border 1.5px solid #DC2626.'
    },
    accessibilityNote: 'Accessible character counter announced via aria-live="polite".'
  },
  // 16. Badges
  {
    name: 'Badge / Status Tag (Confirmed, Pending, In-Service)',
    category: 'Surfaces & Feedback',
    anatomy: 'Colored Status Dot (6px) + Status Label + Dismiss Cross (optional)',
    dimensions: 'Height: 24px. Padding: 2px 8px. Font size: 12px (0.75rem).',
    tokens: {
      background: 'State-dependent light tint (#DCFCE7, #FEF3C7, #FEE2E2, #E0F2FE)',
      border: '1px solid state-dependent border',
      text: 'State-dependent dark text (#15803D, #B45309, #B91C1C, #0369A1)',
      radius: 'radius.full (9999px)'
    },
    states: {
      default: 'Solid pill badge with high-contrast text (>4.5:1 ratio).',
      hover: 'Slightly darkened background tint if interactive.'
    },
    accessibilityNote: 'Color is never the sole indicator; includes descriptive text label.'
  },
  // 17. Cards
  {
    name: 'Card (Service, Package, Staff, Dashboard KPI)',
    category: 'Surfaces & Feedback',
    anatomy: 'Card Container + Header Area + Body Content + Action Footer',
    dimensions: 'Padding: 16px (Mobile) / 24px (Desktop). Gap: 16px.',
    tokens: {
      background: '#FFFFFF (neutral-0) or Theme CardBg',
      border: '1px solid #E4E4E7 (neutral-200)',
      text: '#18181B (neutral-900)',
      radius: 'radius.lg (12px) or Category Override',
      shadow: 'shadow.outline or shadow.sm'
    },
    states: {
      default: 'Flat clean surface with subtle 1px border.',
      hover: 'Border shifts to category accent or neutral-400; shadow lifts to shadow.md.',
      focus: '2px solid neutral-900 ring on interactive cards.'
    },
    accessibilityNote: 'Interactive cards use role="article" or role="button" with keyboard enter trigger.'
  },
  // 18. Modal
  {
    name: 'Modal Dialog (Confirmations, Booking Step)',
    category: 'Surfaces & Feedback',
    anatomy: 'Backdrop Scrim (50% black blur) + Centered Box + Header + Close (X) + Body + Action Footer',
    dimensions: 'Max-width: 480px / 600px. Margin: 16px. Padding: 24px.',
    tokens: {
      background: '#FFFFFF',
      border: '1px solid #E4E4E7',
      text: '#18181B',
      radius: 'radius.lg (12px)',
      shadow: 'shadow.lg'
    },
    states: {
      default: 'Centered on viewport with focus trap engaged.',
      hover: 'Close button highlights with hover:bg-slate-100.'
    },
    accessibilityNote: 'Focus trapped within modal (WCAG 2.1.2); Esc dismisses; focus returns to opener.'
  },
  // 19. Drawer
  {
    name: 'Drawer / Side Sheet (Booking Inspector, Staff Edit, Mobile Menu)',
    category: 'Surfaces & Feedback',
    anatomy: 'Backdrop + Right / Bottom Slide Container + Header + Scrollable Body + Sticky Footer',
    dimensions: 'Width: 100% (Mobile) / 440px–520px (Desktop). Height: 100vh.',
    tokens: {
      background: '#FFFFFF',
      border: '1px solid #E4E4E7',
      text: '#18181B',
      radius: 'radius.none (Desktop) / radius.xl top (Mobile sheet)',
      shadow: 'shadow.lg'
    },
    states: {
      default: 'Slide-in transition from right (300ms ease-out).',
      hover: 'Close button states.'
    },
    accessibilityNote: 'Traps tab focus; mobile drawer swipe-to-dismiss threshold 30% screen.'
  },
  // 20. Tabs
  {
    name: 'Tabs (Category Tabs, Service Menu Filters, Admin Sections)',
    category: 'Navigation & Layout',
    anatomy: 'Tab List (<div role="tablist">) + Tab Triggers (<button role="tab">) + Active Indicator',
    dimensions: 'Height: 40px. Padding: 8px 16px. Gap: 4px.',
    tokens: {
      background: 'Transparent or #F4F4F5 (neutral-100 container)',
      border: 'Underline 2px solid neutral-900 (Active) or pill bg-white',
      text: '#71717A (Inactive) / #18181B (Active font-semibold)',
      radius: 'radius.md (8px)'
    },
    states: {
      default: 'Clean text button with high contrast active state.',
      hover: 'Text shifts to neutral-900.',
      focus: '2px focus ring neutral-900.'
    },
    accessibilityNote: 'Uses ARIA roles role="tablist", role="tab", aria-selected="true/false", Arrow key navigation.'
  },
  // 21. Alerts
  {
    name: 'Alert (System Messages, Payment Warnings, Policy Notice)',
    category: 'Surfaces & Feedback',
    anatomy: 'Leading Status Icon + Alert Title + Body Description + Optional Action Link',
    dimensions: 'Padding: 14px 16px. Border-radius: 8px.',
    tokens: {
      background: 'Subtle tint matching severity (#DCFCE7, #FEF3C7, #FEE2E2, #EFF6FF)',
      border: '1px solid matching severity border',
      text: 'Dark tone matching severity text',
      radius: 'radius.md (8px)'
    },
    states: {
      default: 'Static notification card with high readability.'
    },
    accessibilityNote: 'Announced immediately to screen readers via role="alert" or role="status".'
  },
  // 22. Toasts
  {
    name: 'Toast Notification (Booking Saved, Link Copied, Slot Updated)',
    category: 'Surfaces & Feedback',
    anatomy: 'Status Icon + Brief Message + Action / Close Trigger',
    dimensions: 'Max-width: 360px. Height: 44px min. Padding: 12px 16px.',
    tokens: {
      background: '#18181B (Dark neutral-900) or #FFFFFF with shadow-lg',
      border: '1px solid #27272A or #E4E4E7',
      text: '#FFFFFF or #18181B',
      radius: 'radius.md (8px)',
      shadow: 'shadow.lg'
    },
    states: {
      default: 'Enters from top-right or bottom-center with smooth opacity & translate.',
      hover: 'Pause auto-dismiss timer on pointer hover.'
    },
    accessibilityNote: 'Uses aria-live="polite", minimum 5000ms display duration, non-blocking.'
  },
  // 23. Tables
  {
    name: 'Table (Bookings, Customers, Payouts, Audit Ledger)',
    category: 'Navigation & Layout',
    anatomy: 'Header Row (<th>) + Alternating Rows (<tr>) + Cell Content (<td>) + Action Cell',
    dimensions: 'Header height: 40px. Row height: 48px–56px. Cell padding: 12px 16px.',
    tokens: {
      background: '#FFFFFF',
      border: '1px solid #E4E4E7 (neutral-200)',
      text: '#18181B',
      radius: 'radius.md'
    },
    states: {
      default: 'Zebra or clean white rows with 1px border dividers.',
      hover: 'Row hover bg-slate-50/80 cursor-pointer.',
      focus: 'Row selection state with left 3px accent line.'
    },
    accessibilityNote: 'Uses <caption> or aria-label, proper <th> scope="col", transforms to card list on mobile.'
  },
  // 24. Pagination
  {
    name: 'Pagination (Page Numbers, Prev/Next, Rows per Page)',
    category: 'Navigation & Layout',
    anatomy: 'Previous Button + Page Number Buttons (1, 2, 3...) + Next Button + Summary Text',
    dimensions: 'Button size: 36px x 36px. Gap: 4px.',
    tokens: {
      background: 'Transparent or #FFFFFF',
      border: '1px solid #E4E4E7',
      text: '#71717A (Inactive) / #18181B (Active)',
      radius: 'radius.md (8px)'
    },
    states: {
      default: 'Clean numeric boxes.',
      hover: 'Bg-slate-100 text-slate-900.',
      focus: '2px solid neutral-900 ring.',
      active: 'Bg-slate-900 text-white font-semibold.'
    },
    accessibilityNote: 'Current page has aria-current="page", prev/next buttons have accessible labels.'
  },
  // 25. Focus States
  {
    name: 'Focus Ring (Global Interactive State Standard)',
    category: 'Primitives & Inputs',
    anatomy: '2px solid outline ring with 2px white offset gap',
    dimensions: 'Outline width: 2px. Outline offset: 2px.',
    tokens: {
      background: 'Transparent',
      border: '2px solid #18181B (neutral-900) or Category Theme Primary',
      text: 'Inherited',
      radius: 'Inherited from focused control'
    },
    states: {
      default: 'Active on keyboard TAB navigation; suppressed on mouse click (:focus-visible only).'
    },
    accessibilityNote: 'Strict WCAG 2.4.7 & 2.4.11 compliance. Never disabled with outline: none.'
  }
];

// 6. CATEGORY THEME ARCHITECTURE (10 Categories with Exact 12 Overrides)
export const CATEGORY_THEME_ARCHITECTURES: CategoryThemeOverride[] = [
  {
    id: 'barber',
    categoryName: 'BARBER SHOP',
    personality: 'Heritage craft, masculine precision, vintage apothecary ambiance.',
    primary: '#1E293B (Deep Slate)',
    secondary: '#D97706 (Warm Amber)',
    accent: '#B45309 (Burnished Gold)',
    background: '#FAFAFA (Canvas Base)',
    surface: '#FFFFFF (Pure White)',
    text: '#0F172A (Midnight Slate)',
    mutedText: '#64748B (Muted Slate)',
    border: '#E2E8F0 (Crisp Slate Border)',
    buttonStyle: 'Sharp Box (radius.sm 4px), solid deep slate fill, high contrast white text, no pill curvature.',
    typographyPersonality: {
      headingFont: 'Cinzel / Playfair Display (Serif Bold)',
      bodyFont: 'Inter (Sans Regular)',
      scaleRatio: '1.25 (Major Third)',
      accentStyle: 'All-caps tracking-widest subtitles with amber bullet dividers'
    },
    cardStyle: 'Clean rectangular cards, 1px dark slate border, subtle amber top border accent on featured offerings.',
    imageTreatment: 'High contrast, rich shadows, warm sepia undertones, vintage matte barber finish.'
  },
  {
    id: 'hair-salon',
    categoryName: 'HAIR SALON',
    personality: 'High-fashion editorial, chic luminous styling, runway glamour.',
    primary: '#BE185D (Deep Rose)',
    secondary: '#F472B6 (Soft Rose Quartz)',
    accent: '#831843 (Wine Accent)',
    background: '#FDF2F8 (Blush Canvas)',
    surface: '#FFFFFF (Pure White)',
    text: '#18181B (Charcoal Noir)',
    mutedText: '#71717A (Soft Gray)',
    border: '#FCE7F3 (Subtle Pink Outline)',
    buttonStyle: 'Soft Rounded (radius.lg 12px), deep rose fill, smooth hover lift, gentle tactile feedback.',
    typographyPersonality: {
      headingFont: 'Playfair Display / Editorial Serif',
      bodyFont: 'Plus Jakarta Sans',
      scaleRatio: '1.333 (Perfect Fourth)',
      accentStyle: 'Italic serif section titles paired with modern crisp sans-serif body'
    },
    cardStyle: 'Elevated soft rounded cards, luminous light reflection border, subtle shadow.sm depth.',
    imageTreatment: 'Luminous light-filled exposure, editorial hair color highlights, crisp clean studio backdrop.'
  },
  {
    id: 'beauty',
    categoryName: 'BEAUTY PARLOUR',
    personality: 'Gentle radiance, warm soft luxury, rejuvenating skin ritual.',
    primary: '#E11D48 (Radiant Rose)',
    secondary: '#FDA4AF (Pastel Petal)',
    accent: '#BE123C (Crimson Berry)',
    background: '#FFF1F2 (Warm Petal Canvas)',
    surface: '#FFFFFF (Pure White)',
    text: '#1C1917 (Warm Charcoal)',
    mutedText: '#78716C (Warm Stone Muted)',
    border: '#FFE4E6 (Soft Rose Border)',
    buttonStyle: 'Solid Pill (radius.full 9999px), gentle gradient accent glow, soft pill geometry.',
    typographyPersonality: {
      headingFont: 'Cormorant Garamond (Bespoke Luxury Serif)',
      bodyFont: 'Inter',
      scaleRatio: '1.25 (Major Third)',
      accentStyle: 'Delicate floral subtitle badges with golden star rating icons'
    },
    cardStyle: 'Curved radius.xl (16px) cards, warm rose border tint, soft interior padding.',
    imageTreatment: 'Soft focus skin radiance, warm golden hour natural light, delicate organic textures.'
  },
  {
    id: 'nail',
    categoryName: 'NAIL STUDIO',
    personality: 'Vibrant pop-editorial, playful chic, creative statement lookbook.',
    primary: '#7C3AED (Electric Violet)',
    secondary: '#C084FC (Lavender Orchid)',
    accent: '#5B21B6 (Deep Plum)',
    background: '#FAF5FF (Lilac Mist Canvas)',
    surface: '#FFFFFF (Pure White)',
    text: '#18181B (Charcoal Noir)',
    mutedText: '#6B7280 (Cool Slate)',
    border: '#F3E8FF (Lavender Tint Border)',
    buttonStyle: 'Solid Pill (radius.full 9999px), electric violet fill, playful bold typography.',
    typographyPersonality: {
      headingFont: 'Syne / Avant-Garde Sans',
      bodyFont: 'DM Sans',
      scaleRatio: '1.333 (Perfect Fourth)',
      accentStyle: 'Geometric modern typography with playful rounded pill chips'
    },
    cardStyle: 'Square 1:1 aspect ratio nail lookbook cards, vibrant border accents, pop color chips.',
    imageTreatment: 'Macro high-definition nail art photography, vibrant color saturation, glossy finish.'
  },
  {
    id: 'spa',
    categoryName: 'LUXURY SPA',
    personality: 'Sanctuary of tranquility, holistic mindfulness, botanical wellness.',
    primary: '#0F766E (Eucalyptus Teal)',
    secondary: '#5EEAD4 (Aquamarine Soft)',
    accent: '#115E59 (Deep Forest Teal)',
    background: '#F0FDFA (Teal Mist Canvas)',
    surface: '#FFFFFF (Pure White)',
    text: '#134E4A (Deep Botanical Teal)',
    mutedText: '#64748B (Zen Gray)',
    border: '#CCFBF1 (Botanical Water Border)',
    buttonStyle: 'Soft Rounded (radius.lg 12px), tranquil eucalyptus fill, calming micro-interactions.',
    typographyPersonality: {
      headingFont: 'Cormorant Upright / Botanical Serif',
      bodyFont: 'Plus Jakarta Sans',
      scaleRatio: '1.20 (Minor Third)',
      accentStyle: 'Spacious letter-spaced titles with tranquil natural leaf badges'
    },
    cardStyle: 'Expansive whitespace cards, radius.xl (16px) curvature, soothing pale teal dividers.',
    imageTreatment: 'Diffused organic light, steamy mineral pools, botanical herbal arrangements, serene quiet.'
  },
  {
    id: 'massage',
    categoryName: 'MASSAGE STUDIO',
    personality: 'Deep restorative therapy, earthy grounding, therapeutic muscle relief.',
    primary: '#9A3412 (Terracotta Clay)',
    secondary: '#FDBA74 (Warm Sand)',
    accent: '#7C2D12 (Deep Mahogany)',
    background: '#FFFBEB (Warm Ochre Canvas)',
    surface: '#FFFFFF (Pure White)',
    text: '#292524 (Warm Hearth Stone)',
    mutedText: '#78716C (Warm Earth Gray)',
    border: '#FEF3C7 (Warm Sand Border)',
    buttonStyle: 'Soft Rounded (radius.md 8px), terracotta clay fill, grounded earthy presence.',
    typographyPersonality: {
      headingFont: 'Marcellus / Warm Contemporary Serif',
      bodyFont: 'Inter',
      scaleRatio: '1.25 (Major Third)',
      accentStyle: 'Earthy centered headings with warm stone descriptive subtext'
    },
    cardStyle: 'Solid comforting cards, radius.md (8px), warm sand outline, organic alignment.',
    imageTreatment: 'Warm clay undertones, bamboo and hot stone imagery, soft candlelit therapy ambiance.'
  },
  {
    id: 'tattoo',
    categoryName: 'TATTOO STUDIO',
    personality: 'Custom ink artistry, sacred geometry, high-contrast dark gothic edge.',
    primary: '#18181B (Zinc Dark)',
    secondary: '#DC2626 (Bloodline Crimson)',
    accent: '#EF4444 (Vibrant Ink Red)',
    background: '#09090B (Void Black Canvas)',
    surface: '#18181B (Zinc Charcoal Surface)',
    text: '#F4F4F5 (High Contrast White)',
    mutedText: '#A1A1AA (Muted Zinc Silver)',
    border: '#27272A (Crisp Dark Border)',
    buttonStyle: 'Sharp Box (radius.none 0px), brutalist solid crimson or white on black, zero rounded corners.',
    typographyPersonality: {
      headingFont: 'Unbounded / Space Grotesk (Gothic Brutalist)',
      bodyFont: 'Space Grotesk',
      scaleRatio: '1.333 (Perfect Fourth)',
      accentStyle: 'Monospace data stamps, stark black-and-white grid lines, bold crimson tags'
    },
    cardStyle: 'Zero border-radius sharp cards (radius.none 0px), 1px solid dark zinc border, dark surface fill.',
    imageTreatment: 'Monochrome black and gray ink emphasis, dramatic chiaroscuro contrast, high sharpness.'
  },
  {
    id: 'unisex',
    categoryName: 'UNISEX SALON',
    personality: 'Modern Scandinavian, universally inclusive, dynamic urban efficiency.',
    primary: '#2563EB (Cobalt Blue)',
    secondary: '#60A5FA (Sky Blue)',
    accent: '#1D4ED8 (Royal Navy)',
    background: '#F8FAFC (Clean Slate Canvas)',
    surface: '#FFFFFF (Pure White)',
    text: '#0F172A (Slate 900)',
    mutedText: '#64748B (Slate 500)',
    border: '#E2E8F0 (Clean Slate Border)',
    buttonStyle: 'Solid Pill (radius.full 9999px), dynamic cobalt fill, modern urban aesthetic.',
    typographyPersonality: {
      headingFont: 'Plus Jakarta Sans Bold (Modern Geometric)',
      bodyFont: 'Inter',
      scaleRatio: '1.25 (Major Third)',
      accentStyle: 'Clean bold headings with vibrant blue notification and status tags'
    },
    cardStyle: 'Clean Scandinavian modern cards, radius.md (8px), flat outline, generous spacing.',
    imageTreatment: 'Bright natural daylight, crisp candid grooming portraits, inclusive diverse styling.'
  },
  {
    id: 'makeup',
    categoryName: 'MAKEUP STUDIO',
    personality: 'Red carpet glamour, bespoke bridal artistry, champagne luxury.',
    primary: '#B45309 (Champagne Gold)',
    secondary: '#FDE68A (Soft Gold Tint)',
    accent: '#78350F (Deep Bronze)',
    background: '#FFFDF9 (Warm Alabaster Canvas)',
    surface: '#FFFFFF (Pure White)',
    text: '#1C1917 (Warm Onyx)',
    mutedText: '#78716C (Warm Sand Muted)',
    border: '#FEF3C7 (Champagne Shimmer Border)',
    buttonStyle: 'Double Border (radius.lg 12px), champagne gold fill with 1px outer accent ring.',
    typographyPersonality: {
      headingFont: 'Bodoni Moda / High Fashion Serif',
      bodyFont: 'Inter',
      scaleRatio: '1.333 (Perfect Fourth)',
      accentStyle: 'Refined editorial serif headlines with delicate gold foil tag lines'
    },
    cardStyle: 'High-fashion editorial cards, radius.xl (16px), warm champagne outline, luxury padding.',
    imageTreatment: 'Cinematic lighting, high-definition cosmetic closeups, golden champagne shimmer highlights.'
  },
  {
    id: 'wellness',
    categoryName: 'WELLNESS STUDIO',
    personality: 'Holistic vitality, balanced aesthetic health, organic longevity.',
    primary: '#166534 (Sage Forest Green)',
    secondary: '#86EFAC (Pale Mint)',
    accent: '#14532D (Deep Moss)',
    background: '#F2FBF5 (Sage Meadow Canvas)',
    surface: '#FFFFFF (Pure White)',
    text: '#14532D (Deep Moss Green)',
    mutedText: '#4B5563 (Balanced Gray)',
    border: '#DCFCE7 (Pale Sage Border)',
    buttonStyle: 'Solid Pill (radius.full 9999px), forest green fill, organic tactile feedback.',
    typographyPersonality: {
      headingFont: 'Fraunces / Warm Contemporary Serif',
      bodyFont: 'Inter',
      scaleRatio: '1.25 (Major Third)',
      accentStyle: 'Warm organic serif titles paired with herbal botanical category icons'
    },
    cardStyle: 'Soft rounded organic cards, radius.xl (16px), gentle sage green borders, tranquil spacing.',
    imageTreatment: 'Natural organic daylight, matcha and botanical plants, mindful posture, restorative calm.'
  }
];

// 7. ACCESSIBILITY RULES & COMPLIANCE TOKENS (WCAG 2.2 AA)
export const ACCESSIBILITY_RULES = {
  contrast: {
    standard: 'WCAG 2.2 AA (Criterion 1.4.3 & 1.4.11)',
    normalText: 'Minimum 4.5:1 contrast ratio against canvas background for all text <= 18px.',
    largeText: 'Minimum 3.0:1 contrast ratio for text >= 24px or bold text >= 18px.',
    uiComponents: 'Minimum 3.0:1 contrast ratio for interactive controls, inputs, borders, and icons.',
    tokenEnforcement: 'Neutral-900 (#18181B) on White (#FFFFFF) delivers 15.3:1. Neutral-700 (#3F3F46) delivers 7.2:1. All 10 Category Primary tokens must verify > 4.5:1 before release.'
  },
  keyboard: {
    standard: 'WCAG 2.2 AA (Criterion 2.1.1 & 2.1.2)',
    rules: [
      'Logical DOM focus progression (Tab forwards, Shift+Tab backwards).',
      'No keyboard traps in any modal, drawer, or dropdown menu.',
      'Space / Enter activates all buttons, category chips, and service select triggers.',
      'Escape immediately dismisses modals, drawers, tooltips, and calendar popups.',
      'Arrow keys navigate inside tab lists (role="tablist"), segmented controls, and radio groups.'
    ]
  },
  visibleFocus: {
    standard: 'WCAG 2.2 AA (Criterion 2.4.7 & 2.4.11 Focus Appearance)',
    specification: 'High-visibility 2px solid ring with 2px white offset gap around all focused interactive elements.',
    tokenClass: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900',
    suppressionRule: 'Never set outline: none without providing an equivalent or superior focus ring indicator.'
  },
  touchTargets: {
    standard: 'WCAG 2.2 AA (Criterion 2.5.8 Target Size Minimum)',
    minimumSize: 'Minimum 44x44 CSS pixels (or 48px height on primary mobile action buttons).',
    spatialMargin: 'Minimum 8px gap between adjacent touch targets (e.g. time slots, specialist chips).',
    mobileStickiness: 'Sticky Book Appointment CTA fixed at bottom of mobile viewport with 48px height.'
  },
  reducedMotion: {
    standard: 'WCAG 2.2 AA (Criterion 2.3.3 Animation from Interactions)',
    specification: 'All CSS transitions, hover transforms, and slide-in animations must respect prefers-reduced-motion: reduce.',
    tokenRule: '@media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }'
  },
  formErrors: {
    standard: 'WCAG 2.2 AA (Criterion 3.3.1, 3.3.2 & 4.1.3 Error Identification & Status Messages)',
    rules: [
      'Error states must never rely on color alone; always pair with a warning icon and explicit text explanation.',
      'Input border shifts to red-600 with 1.5px stroke.',
      'Error message linked to input via aria-describedby="input-error-id".',
      'Live validation announcements delivered via aria-live="polite".'
    ]
  }
};
