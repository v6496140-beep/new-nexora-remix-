export interface DesignTokenGroup {
  category: string;
  description: string;
  tokens: {
    name: string;
    token: string;
    value: string;
    usage: string;
  }[];
}

export interface CategoryTheme {
  id: string;
  name: string;
  tagline: string;
  accentColor: string;
  accentBg: string;
  accentText: string;
  surfaceBg: string;
  cardBg: string;
  borderStyle: string;
  fontFamilyHeading: string;
  fontFamilyBody: string;
  borderRadius: string;
  heroLayout: 'Split' | 'Center Minimal' | 'Editorial Asymmetric' | 'Bold Poster';
  buttonStyle: 'Solid Pill' | 'Sharp Box' | 'Soft Rounded' | 'Double Border';
  brandVibe: string;
}

export interface ComponentSpec {
  name: string;
  category: 'Public Website' | 'Admin System' | 'Builder';
  purpose: string;
  props: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  variants: {
    name: string;
    description: string;
  }[];
  responsiveBehavior: {
    breakpoint: string;
    behavior: string;
  }[];
  states: {
    state: string;
    visualSpec: string;
  }[];
}

export interface ResponsiveBreakpointRule {
  breakpoint: string;
  range: string;
  mobileNav: string;
  tabletLayout: string;
  desktopSidebar: string;
  tables: string;
  bookingFlow: string;
  forms: string;
  builderBehavior: string;
}

export interface AccessibilityStandard {
  rule: string;
  criterion: string;
  level: 'WCAG 2.2 AA';
  specification: string;
  implementationGuideline: string;
}

export interface WireframeToUIMapping {
  screenId: string;
  screenName: string;
  userType: 'Public Visitor' | 'Customer' | 'Business Admin' | 'Staff' | 'Platform Admin';
  uiComponents: string[];
  dataRequired: string[];
  responsiveBehavior: string;
}

// 1. DESIGN TOKENS
export const DESIGN_TOKENS: DesignTokenGroup[] = [
  {
    category: 'Color System — Semantic Neutrals & Foundations',
    description: 'Neutral background, border, text, and surface hierarchy engineered for high-contrast legible salon UI.',
    tokens: [
      { name: 'Canvas Base', token: 'color.neutral.50', value: '#FAFAFA', usage: 'Global page body background across all templates.' },
      { name: 'Surface Default', token: 'color.neutral.0', value: '#FFFFFF', usage: 'Card surfaces, modals, dropdown menus, sheets.' },
      { name: 'Surface Subdued', token: 'color.neutral.100', value: '#F4F4F5', usage: 'Muted input backgrounds, secondary tab containers.' },
      { name: 'Border Subtle', token: 'color.neutral.200', value: '#E4E4E7', usage: 'Divider rules, card outlines, table borders.' },
      { name: 'Border Strong', token: 'color.neutral.300', value: '#D4D4D8', usage: 'Input borders, active tab outlines, interactive borders.' },
      { name: 'Text Subdued', token: 'color.neutral.500', value: '#71717A', usage: 'Placeholder text, secondary metadata, breadcrumbs.' },
      { name: 'Text Secondary', token: 'color.neutral.700', value: '#3F3F46', usage: 'Body copy, descriptions, secondary buttons.' },
      { name: 'Text Primary', token: 'color.neutral.900', value: '#18181B', usage: 'Headings, primary card titles, price highlights.' }
    ]
  },
  {
    category: 'Color System — System Feedback & Booking States',
    description: 'Feedback and status badges indicating booking progress, payments, and staff shifts.',
    tokens: [
      { name: 'Confirmed / Paid', token: 'color.feedback.success', value: '#15803D (Bg: #DCFCE7)', usage: 'Confirmed appointments, successful settlements, active staff.' },
      { name: 'Pending / Advance Due', token: 'color.feedback.warning', value: '#B45309 (Bg: #FEF3C7)', usage: 'Pending advance payment, tentative booking, qualification in-progress.' },
      { name: 'Cancelled / Failed', token: 'color.feedback.danger', value: '#B91C1C (Bg: #FEE2E2)', usage: 'Cancelled bookings, refund initiated, staff leave.' },
      { name: 'In-Service / Ongoing', token: 'color.feedback.info', value: '#0369A1 (Bg: #E0F2FE)', usage: 'In-chair service active, real-time staff timer running.' },
      { name: 'Brand Primary Dark', token: 'color.brand.slate', value: '#0F172A', usage: 'Admin shell topbar, primary action buttons, dark theme bases.' }
    ]
  },
  {
    category: 'Spacing & Layout Grid Scale',
    description: 'Strict 4px/8px-based spatial system ensuring geometric harmony from compact mobile to widescreen displays.',
    tokens: [
      { name: 'Spacing 1 (4px)', token: 'space.1', value: '4px / 0.25rem', usage: 'Badge internal padding, icon-text gap.' },
      { name: 'Spacing 2 (8px)', token: 'space.2', value: '8px / 0.5rem', usage: 'Button inline gap, tight list items, chip padding.' },
      { name: 'Spacing 3 (12px)', token: 'space.3', value: '12px / 0.75rem', usage: 'Input vertical padding, compact card padding.' },
      { name: 'Spacing 4 (16px)', token: 'space.4', value: '16px / 1.0rem', usage: 'Standard mobile gutter, card inner padding, grid gap.' },
      { name: 'Spacing 6 (24px)', token: 'space.6', value: '24px / 1.5rem', usage: 'Desktop card padding, section sub-block spacing.' },
      { name: 'Spacing 8 (32px)', token: 'space.8', value: '32px / 2.0rem', usage: 'Tablet section gutters, modal margin.' },
      { name: 'Spacing 12 (48px)', token: 'space.12', value: '48px / 3.0rem', usage: 'Public website section vertical padding (Mobile).' },
      { name: 'Spacing 20 (80px)', token: 'space.20', value: '80px / 5.0rem', usage: 'Public website hero & section vertical padding (Desktop).' }
    ]
  },
  {
    category: 'Border Radius System',
    description: 'Configurable token slot allowing category templates to adopt sharp, smooth, or organic forms.',
    tokens: [
      { name: 'Radius None', token: 'radius.none', value: '0px', usage: 'Artistic / Brutalist / Tattoo studio theme cards & buttons.' },
      { name: 'Radius Subtle', token: 'radius.sm', value: '4px', usage: 'Data table rows, badge tags, form inputs.' },
      { name: 'Radius Base', token: 'radius.md', value: '8px', usage: 'Standard admin cards, modal containers, buttons.' },
      { name: 'Radius Smooth', token: 'radius.lg', value: '12px', usage: 'Service cards, package cards, image gallery thumbnails.' },
      { name: 'Radius Pill', token: 'radius.full', value: '9999px', usage: 'Category selector chips, status badges, circular avatars.' }
    ]
  },
  {
    category: 'Elevation & Box Shadows',
    description: 'Clean spatial depth tokens preventing excessive muddy shadows.',
    tokens: [
      { name: 'Flat Outline', token: 'shadow.outline', value: '0 0 0 1px rgba(0,0,0,0.08)', usage: 'Clean modern public cards and admin table borders.' },
      { name: 'Elevation 1', token: 'shadow.sm', value: '0 1px 2px 0 rgba(0,0,0,0.05)', usage: 'Standard interactive cards and input states.' },
      { name: 'Elevation 2', token: 'shadow.md', value: '0 4px 6px -1px rgba(0,0,0,0.07)', usage: 'Dropdown menus, sticky topbars on scroll, active booking cards.' },
      { name: 'Elevation 3', token: 'shadow.lg', value: '0 10px 15px -3px rgba(0,0,0,0.1)', usage: 'Modals, mobile booking drawers, slide-over panels.' }
    ]
  }
];

// 2. CATEGORY THEME SYSTEM (10 Categories)
export const CATEGORY_THEMES: CategoryTheme[] = [
  {
    id: 'barber',
    name: 'Barber Shop',
    tagline: 'Timeless Grooming & Precision Cuts',
    accentColor: '#1E293B',
    accentBg: 'bg-slate-900',
    accentText: 'text-amber-500',
    surfaceBg: '#F8FAFC',
    cardBg: '#FFFFFF',
    borderStyle: 'border-slate-800',
    fontFamilyHeading: 'Cinzel / Playfair Display / Serif Bold',
    fontFamilyBody: 'Inter / Sans Regular',
    borderRadius: 'rounded-md',
    heroLayout: 'Split',
    buttonStyle: 'Sharp Box',
    brandVibe: 'Classic vintage masculine grooming, dark slate, deep amber accents, crisp clean borders.'
  },
  {
    id: 'hair-salon',
    name: 'Hair Salon',
    tagline: 'Artistry in Color, Cuts & Styling',
    accentColor: '#BE185D',
    accentBg: 'bg-pink-700',
    accentText: 'text-pink-600',
    surfaceBg: '#FDF2F8',
    cardBg: '#FFFFFF',
    borderStyle: 'border-pink-200',
    fontFamilyHeading: 'Playfair Display / Editorial Serif',
    fontFamilyBody: 'Plus Jakarta Sans',
    borderRadius: 'rounded-xl',
    heroLayout: 'Editorial Asymmetric',
    buttonStyle: 'Soft Rounded',
    brandVibe: 'High-fashion editorial, chic rose quartz accents, luminous light backgrounds.'
  },
  {
    id: 'beauty-parlour',
    name: 'Beauty Parlour',
    tagline: 'Glow, Rejuvenate & Radiate',
    accentColor: '#E11D48',
    accentBg: 'bg-rose-600',
    accentText: 'text-rose-600',
    surfaceBg: '#FFF1F2',
    cardBg: '#FFFFFF',
    borderStyle: 'border-rose-200',
    fontFamilyHeading: 'Cormorant Garamond',
    fontFamilyBody: 'Inter',
    borderRadius: 'rounded-2xl',
    heroLayout: 'Center Minimal',
    buttonStyle: 'Solid Pill',
    brandVibe: 'Warm soft pastels, golden shimmer hints, gentle beauty care aura.'
  },
  {
    id: 'nail-studio',
    name: 'Nail Studio',
    tagline: 'Statement Nail Art & Luxury Manicures',
    accentColor: '#7C3AED',
    accentBg: 'bg-violet-600',
    accentText: 'text-violet-600',
    surfaceBg: '#FAF5FF',
    cardBg: '#FFFFFF',
    borderStyle: 'border-purple-200',
    fontFamilyHeading: 'Syne / Avant-Garde Sans',
    fontFamilyBody: 'DM Sans',
    borderRadius: 'rounded-xl',
    heroLayout: 'Split',
    buttonStyle: 'Solid Pill',
    brandVibe: 'Vibrant pop-editorial, playful lilac/lavender palette, bold lookbook grids.'
  },
  {
    id: 'spa',
    name: 'Luxury Spa',
    tagline: 'Sanctuary of Tranquility & Holistic Wellness',
    accentColor: '#0F766E',
    accentBg: 'bg-teal-700',
    accentText: 'text-teal-700',
    surfaceBg: '#F0FDFA',
    cardBg: '#FFFFFF',
    borderStyle: 'border-teal-200',
    fontFamilyHeading: 'Cormorant Upright / Botanical Serif',
    fontFamilyBody: 'Plus Jakarta Sans',
    borderRadius: 'rounded-2xl',
    heroLayout: 'Center Minimal',
    buttonStyle: 'Soft Rounded',
    brandVibe: 'Serene herbal green, soft eucalyptus hues, expansive calming whitespace.'
  },
  {
    id: 'massage-studio',
    name: 'Massage & Bodywork',
    tagline: 'Deep Restorative Therapy & Muscle Relief',
    accentColor: '#9A3412',
    accentBg: 'bg-orange-800',
    accentText: 'text-orange-700',
    surfaceBg: '#FFFBEB',
    cardBg: '#FFFFFF',
    borderStyle: 'border-amber-200',
    fontFamilyHeading: 'Marcellus / Warm Serif',
    fontFamilyBody: 'Inter',
    borderRadius: 'rounded-lg',
    heroLayout: 'Split',
    buttonStyle: 'Soft Rounded',
    brandVibe: 'Earthy terracotta, warm clay tones, grounded therapeutic ambiance.'
  },
  {
    id: 'tattoo-studio',
    name: 'Tattoo & Body Art',
    tagline: 'Custom Ink, Sacred Geometry & Piercing',
    accentColor: '#18181B',
    accentBg: 'bg-zinc-950',
    accentText: 'text-red-500',
    surfaceBg: '#121214',
    cardBg: '#1C1C1F',
    borderStyle: 'border-zinc-700',
    fontFamilyHeading: 'Unbounded / Brutalist Gothic Sans',
    fontFamilyBody: 'Space Grotesk',
    borderRadius: 'rounded-none',
    heroLayout: 'Bold Poster',
    buttonStyle: 'Sharp Box',
    brandVibe: 'High-contrast dark monochrome, crimson bloodline accents, sharp geometric edges.'
  },
  {
    id: 'unisex-salon',
    name: 'Unisex Modern Salon',
    tagline: 'Inclusive Grooming for Everyone',
    accentColor: '#2563EB',
    accentBg: 'bg-blue-600',
    accentText: 'text-blue-600',
    surfaceBg: '#F8FAFC',
    cardBg: '#FFFFFF',
    borderStyle: 'border-slate-200',
    fontFamilyHeading: 'Plus Jakarta Sans Bold',
    fontFamilyBody: 'Inter',
    borderRadius: 'rounded-lg',
    heroLayout: 'Split',
    buttonStyle: 'Solid Pill',
    brandVibe: 'Clean Scandinavian modern, cobalt blue dynamic accents, ultra-approachable.'
  },
  {
    id: 'makeup-studio',
    name: 'Bridal & Makeup Studio',
    tagline: 'Red Carpet Glamour & Bespoke Bridal Art',
    accentColor: '#B45309',
    accentBg: 'bg-amber-700',
    accentText: 'text-amber-600',
    surfaceBg: '#FFFDF9',
    cardBg: '#FFFFFF',
    borderStyle: 'border-amber-200',
    fontFamilyHeading: 'Bodoni Moda / High Fashion Serif',
    fontFamilyBody: 'Inter',
    borderRadius: 'rounded-xl',
    heroLayout: 'Editorial Asymmetric',
    buttonStyle: 'Double Border',
    brandVibe: 'Champagne gold foil aesthetic, bridal luxury, cinematic portfolio photography.'
  },
  {
    id: 'wellness-studio',
    name: 'Holistic Wellness Studio',
    tagline: 'Mind, Body & Aesthetic Harmony',
    accentColor: '#166534',
    accentBg: 'bg-emerald-800',
    accentText: 'text-emerald-700',
    surfaceBg: '#F2FBF5',
    cardBg: '#FFFFFF',
    borderStyle: 'border-emerald-200',
    fontFamilyHeading: 'Fraunces / Warm Contemporary Serif',
    fontFamilyBody: 'Inter',
    borderRadius: 'rounded-2xl',
    heroLayout: 'Center Minimal',
    buttonStyle: 'Solid Pill',
    brandVibe: 'Botanical sage green, organic wellness typography, balanced conscious health.'
  }
];

// 3. TYPOGRAPHY SYSTEM
export const TYPOGRAPHY_SYSTEM = {
  scale: [
    { level: 'Display Hero (H1)', size: '48px / 3rem (Desktop), 32px / 2rem (Mobile)', lineHeight: '1.15', weight: '700 / Bold', usage: 'Hero headlines on public websites and landing page.' },
    { level: 'Page Title (H2)', size: '32px / 2rem (Desktop), 24px / 1.5rem (Mobile)', lineHeight: '1.25', weight: '600 / SemiBold', usage: 'Section headings (Services, Packages, About), Admin page headers.' },
    { level: 'Section Title (H3)', size: '24px / 1.5rem (Desktop), 20px / 1.25rem (Mobile)', lineHeight: '1.3', weight: '600 / SemiBold', usage: 'Category headers, card group titles, modal headlines.' },
    { level: 'Card Title (H4)', size: '18px / 1.125rem', lineHeight: '1.4', weight: '600 / SemiBold', usage: 'Service card titles, staff names, package titles.' },
    { level: 'Body Large', size: '16px / 1.0rem', lineHeight: '1.5', weight: '400 / 500', usage: 'Hero intro paragraphs, primary descriptions, prominent labels.' },
    { level: 'Body Regular', size: '14px / 0.875rem', lineHeight: '1.5', weight: '400 / Regular', usage: 'Card descriptions, table rows, form inputs, booking specs.' },
    { level: 'Body Small / Caption', size: '12px / 0.75rem', lineHeight: '1.4', weight: '500 / Medium', usage: 'Badges, timestamp labels, tax/advance notes, helper text.' },
    { level: 'Micro / Legal', size: '11px / 0.6875rem', lineHeight: '1.3', weight: '400 / Regular', usage: 'Footer copyright, GSTIN disclosures, token labels.' }
  ],
  pairings: [
    { vibe: 'Classic & Barber', heading: 'Cinzel / Playfair Display', body: 'Inter', tone: 'Distinguished, heritage, authoritative' },
    { vibe: 'Luxury & Spa / Parlour', heading: 'Cormorant Garamond', body: 'Plus Jakarta Sans', tone: 'Tranquil, bespoke, refined' },
    { vibe: 'Modern & Unisex', heading: 'Plus Jakarta Sans Bold', body: 'Inter', tone: 'Contemporary, efficient, crisp' },
    { vibe: 'Artistic & Tattoo', heading: 'Unbounded / Space Grotesk', body: 'Space Grotesk', tone: 'Edgy, bold, unapologetic' }
  ]
};

// 4. PUBLIC WEBSITE COMPONENT SYSTEM (15 Reusable Components)
export const PUBLIC_COMPONENT_SYSTEM: ComponentSpec[] = [
  {
    name: 'Navbar',
    category: 'Public Website',
    purpose: 'Top persistent branding and navigation controller with mobile drawer, opening hours summary, and instant booking trigger.',
    props: [
      { name: 'businessName', type: 'string', required: true, description: 'Tenant salon name.' },
      { name: 'logoUrl', type: 'string', required: false, description: 'Salon logo image or vector glyph.' },
      { name: 'navLinks', type: 'Array<{ label: string; href: string }>', required: true, description: 'Links to sections: Services, Packages, Gallery, About, Contact.' },
      { name: 'openingHoursSummary', type: 'string', required: false, description: 'e.g. Open Today: 9 AM – 9 PM' },
      { name: 'onBookClick', type: '() => void', required: true, description: 'Handler to open mobile booking drawer or anchor to services.' }
    ],
    variants: [
      { name: 'Sticky Light', description: 'Translucent blur background adhering to top on scroll.' },
      { name: 'Transparent Overlay', description: 'Overlays hero banner on dark aesthetic templates (Tattoo / Barber).' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile (<768px)', behavior: 'Hamburger icon triggers slide-over drawer; sticky bottom Book Now bar remains visible.' },
      { breakpoint: 'Desktop (>=1024px)', behavior: 'Full horizontal inline navigation with telephone link and primary Book Appointment CTA.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Subtle bottom border, clean white surface or dark slate depending on category.' },
      { state: 'Scrolled', visualSpec: 'Backdrop-blur-md with elevated shadow-sm.' },
      { state: 'Mobile Open', visualSpec: 'Full-screen high-contrast overlay with animated link list.' }
    ]
  },
  {
    name: 'Hero',
    category: 'Public Website',
    purpose: 'Primary above-the-fold value proposition introducing salon vibe, category badge, key offerings, and primary booking button.',
    props: [
      { name: 'headline', type: 'string', required: true, description: 'Catchy salon headline (e.g. Master Cuts & Classic Shaves).' },
      { name: 'subheadline', type: 'string', required: true, description: 'Supporting descriptor highlighting experience.' },
      { name: 'categoryBadge', type: 'string', required: true, description: 'e.g. Premium Barber Shop or Luxury Spa.' },
      { name: 'rating', type: '{ score: number; count: number }', required: false, description: 'Star rating summary badge.' },
      { name: 'primaryCtaText', type: 'string', required: true, description: 'Defaults to Book Appointment.' },
      { name: 'secondaryCtaText', type: 'string', required: false, description: 'Defaults to View Services & Packages.' },
      { name: 'heroImageSlot', type: 'string | Slot', required: true, description: 'Visual banner or layout container.' }
    ],
    variants: [
      { name: 'Split 50/50', description: 'Text on left, high-res visual on right with floating rating badge.' },
      { name: 'Center Minimal', description: 'Centrally aligned editorial typography suited for Spa & Beauty Parlour.' },
      { name: 'Bold Poster', description: 'Full-width edge-to-edge typography with dark moody backdrop for Tattoo Studio.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile (<768px)', behavior: 'Single stacked column with text first, image beneath, dual CTAs full width.' },
      { breakpoint: 'Desktop (>=1024px)', behavior: 'Side-by-side split grid with min-height 520px.' }
    ],
    states: [
      { state: 'Ready', visualSpec: 'Smooth typographic hierarchy with primary CTA in focus state.' },
      { state: 'Hover CTAs', visualSpec: 'Scale 102% subtle lift on primary CTA with active focus ring.' }
    ]
  },
  {
    name: 'SectionHeader',
    category: 'Public Website',
    purpose: 'Consistent section title, category subtitle badge, and contextual subtitle explaining what customers will find.',
    props: [
      { name: 'badge', type: 'string', required: false, description: 'Micro-badge e.g. Our Offerings or Meet the Masters.' },
      { name: 'title', type: 'string', required: true, description: 'Major section heading.' },
      { name: 'subtitle', type: 'string', required: false, description: 'Helpful explanatory sentence.' },
      { name: 'align', type: "'center' | 'left'", required: false, description: 'Layout alignment.' }
    ],
    variants: [
      { name: 'Centered Badge', description: 'Pill badge over centered title, ideal for Spa & Beauty.' },
      { name: 'Left Bold Rule', description: 'Left aligned with category accent border accent line for Barber/Tattoo.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'All', behavior: 'Maintains minimum 32px bottom margin; adjusts font size from 24px (mobile) to 32px (desktop).' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Static typographical anchor.' }
    ]
  },
  {
    name: 'ServiceCard',
    category: 'Public Website',
    purpose: 'Modular card displaying a single salon service with price, duration, advance payment flag, and instant select button.',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Unique service identifier.' },
      { name: 'title', type: 'string', required: true, description: 'e.g. Deluxe Beard Sculpting or Balayage Masterclass.' },
      { name: 'description', type: 'string', required: true, description: 'What is included in this treatment.' },
      { name: 'durationMinutes', type: 'number', required: true, description: 'Duration in minutes (e.g. 45 mins).' },
      { name: 'price', type: 'number', required: true, description: 'Total service price in INR (e.g. 1000).' },
      { name: 'advancePercent', type: 'number', required: true, description: 'e.g. 25% (advance = 250).' },
      { name: 'isPopular', type: 'boolean', required: false, description: 'Highlights with badge.' },
      { name: 'onSelect', type: '(id: string) => void', required: true, description: 'Selects service to initiate booking step.' }
    ],
    variants: [
      { name: 'Horizontal Row', description: 'Compact list row suited for dense service menus on mobile.' },
      { name: 'Boxed Grid Card', description: 'Elevated surface card with visual duration chip and price highlight.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile (<768px)', behavior: '1 column full width with quick Book button aligned to right.' },
      { breakpoint: 'Desktop (>=1024px)', behavior: '3-column grid with clear price breakdown and hover highlight.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Border subtle (neutral-200), clean white card background.' },
      { state: 'Hover', visualSpec: 'Shadow-md, border color shifts to theme accent token.' },
      { state: 'Selected', visualSpec: 'Ring-2 ring-primary, checkmark icon indicated.' }
    ]
  },
  {
    name: 'PackageCard',
    category: 'Public Website',
    purpose: 'Showcase bundled multi-service rituals with combined duration, bundle savings, and single-click booking.',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Package ID.' },
      { name: 'packageName', type: 'string', required: true, description: 'e.g. The Executive Grooming Ritual.' },
      { name: 'servicesIncluded', type: 'string[]', required: true, description: 'List of services included.' },
      { name: 'totalDuration', type: 'number', required: true, description: 'Sum of treatment times.' },
      { name: 'bundlePrice', type: 'number', required: true, description: 'Discounted bundle price.' },
      { name: 'originalPrice', type: 'number', required: true, description: 'Strikethrough original sum.' },
      { name: 'onSelect', type: '(id: string) => void', required: true, description: 'Selects package.' }
    ],
    variants: [
      { name: 'Standard Bundle', description: 'Clean checklist card with badge showing "Save ₹400".' },
      { name: 'Featured Ritual', description: 'Emphasized with category accent border and badge.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: '1 column stacked with horizontal scrolling pills for included services.' },
      { breakpoint: 'Desktop', behavior: '2 or 3 column grid depending on inventory count.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Border with subtle badge.' },
      { state: 'Selected', visualSpec: 'Active state highlight with advance calculation displayed.' }
    ]
  },
  {
    name: 'StaffCard',
    category: 'Public Website',
    purpose: 'Introduce stylists, therapists, and artists with their specialization, experience years, rating, and direct booking.',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Staff member ID.' },
      { name: 'name', type: 'string', required: true, description: 'e.g. Marco Silva.' },
      { name: 'role', type: 'string', required: true, description: 'e.g. Senior Master Stylist.' },
      { name: 'specialties', type: 'string[]', required: true, description: 'e.g. ["Beard Fade", "Hot Towel"].' },
      { name: 'experienceYears', type: 'number', required: false, description: 'Years in practice.' },
      { name: 'avatarUrl', type: 'string', required: false, description: 'Portrait thumbnail.' },
      { name: 'onBookWithStaff', type: '(id: string) => void', required: true, description: 'Prefilters booking calendar to this specialist.' }
    ],
    variants: [
      { name: 'Grid Specialist Card', description: 'Portrait on top, bio and tags below, "Book with [Name]" button.' },
      { name: 'Minimal Chip', description: 'Used inside the booking step for fast staff selection.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Horizontal scroll snap row or 2-column grid.' },
      { breakpoint: 'Desktop', behavior: '4-column balanced grid.' }
    ],
    states: [
      { state: 'Available Today', visualSpec: 'Green active dot next to name.' },
      { state: 'Off Duty', visualSpec: 'Muted grayscale with "Next available tomorrow" badge.' }
    ]
  },
  {
    name: 'GalleryGrid',
    category: 'Public Website',
    purpose: 'High-impact visual showcase of haircut transformations, nail art portfolios, tattoo pieces, and interior ambiance.',
    props: [
      { name: 'images', type: 'Array<{ url: string; caption: string; category?: string }>', required: true, description: 'Gallery media.' },
      { name: 'filterTags', type: 'string[]', required: false, description: 'Interactive category filter tags (Hair, Beard, Colors).' },
      { name: 'onImageClick', type: '(index: number) => void', required: false, description: 'Opens lightbox modal preview.' }
    ],
    variants: [
      { name: 'Masonry Asymmetric', description: 'Editorial staggered height layout suited for Hair & Tattoo studios.' },
      { name: 'Uniform Square Grid', description: 'Clean 1:1 aspect ratio tiles for Nail Studio & Spa.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: '2-column tight grid with 8px gap.' },
      { breakpoint: 'Desktop', behavior: '3 or 4-column masonry layout.' }
    ],
    states: [
      { state: 'Loading', visualSpec: 'Pulsing skeleton aspect-ratio boxes.' },
      { state: 'Hover Tile', visualSpec: 'Subtle zoom 105% with caption overlay slide-up.' }
    ]
  },
  {
    name: 'TestimonialCard',
    category: 'Public Website',
    purpose: 'Customer social proof showing verified service review, star rating, customer name, and service availed.',
    props: [
      { name: 'customerName', type: 'string', required: true, description: 'e.g. Arjun M.' },
      { name: 'rating', type: 'number', required: true, description: '1 to 5 star rating.' },
      { name: 'reviewText', type: 'string', required: true, description: 'Verified customer feedback.' },
      { name: 'serviceName', type: 'string', required: false, description: 'Service reviewed e.g. Skin Fade & Beard Trim.' },
      { name: 'date', type: 'string', required: false, description: 'Review date.' }
    ],
    variants: [
      { name: 'Quote Card', description: 'Large quotation glyph with quote and author signature.' },
      { name: 'Compact Review', description: 'Star row at top with compact text for carousel.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Horizontal swipeable cards.' },
      { breakpoint: 'Desktop', behavior: '3-column grid.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'White card with subtle border and star icon row.' }
    ]
  },
  {
    name: 'BookingCTA',
    category: 'Public Website',
    purpose: 'High-contrast conversion banner placed before footer reminding visitor to reserve their chair/slot in advance.',
    props: [
      { name: 'title', type: 'string', required: true, description: 'e.g. Ready for your transformation?' },
      { name: 'subtitle', type: 'string', required: true, description: 'Slots fill quickly on weekends. Reserve yours in 60 seconds.' },
      { name: 'buttonText', type: 'string', required: true, description: 'Defaults to "Book Appointment Now".' },
      { name: 'onAction', type: '() => void', required: true, description: 'Launches booking flow.' }
    ],
    variants: [
      { name: 'Theme Banner', description: 'Category accent colored background with contrast text.' },
      { name: 'Dark Contrast', description: 'Deep slate background with illuminated accent button.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Full width container with stacked button.' },
      { breakpoint: 'Desktop', behavior: 'Wide rounded banner with inline action button on right.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Vibrant theme contrast container.' }
    ]
  },
  {
    name: 'ContactBlock',
    category: 'Public Website',
    purpose: 'Physical salon discovery block with map placeholder, street address, telephone, email, and transit directions.',
    props: [
      { name: 'address', type: 'string', required: true, description: 'Physical salon street address.' },
      { name: 'phone', type: 'string', required: true, description: 'Direct contact phone number.' },
      { name: 'email', type: 'string', required: false, description: 'Support / concierge email.' },
      { name: 'landmarks', type: 'string', required: false, description: 'Nearby metro or parking instructions.' },
      { name: 'mapCoordinates', type: '{ lat: number; lng: number }', required: false, description: 'Map pinpoint.' }
    ],
    variants: [
      { name: 'Split Map & Info', description: 'Map on left/right, contact cards with clickable links on counterpart.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Contact actions (Call, Navigate) as full width one-tap buttons above map.' },
      { breakpoint: 'Desktop', behavior: 'Side-by-side 50/50 container.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Well-spaced list with Lucide MapPin, Phone, Mail icons.' }
    ]
  },
  {
    name: 'Footer',
    category: 'Public Website',
    purpose: 'Site-wide closing block with business brand, quick links, category disclaimer, copyright, and platform branding.',
    props: [
      { name: 'businessName', type: 'string', required: true, description: 'Tenant name.' },
      { name: 'copyrightYear', type: 'number', required: true, description: 'Current year.' },
      { name: 'socialLinks', type: 'Array<{ platform: string; url: string }>', required: false, description: 'Instagram, WhatsApp, Facebook.' },
      { name: 'gstin', type: 'string', required: false, description: 'Merchant tax identification.' }
    ],
    variants: [
      { name: 'Standard 4-Column', description: 'Brand summary, quick navigation, hours, and legal notes.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Single column stacked, social links centered.' },
      { breakpoint: 'Desktop', behavior: '4-column balanced grid with bottom legal bar.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Dark neutral-900 background with neutral-400 text.' }
    ]
  },
  {
    name: 'BookingButton',
    category: 'Public Website',
    purpose: 'Universal interactive CTA button engineered with WCAG 2.2 AA compliant focus ring and touch target.',
    props: [
      { name: 'label', type: 'string', required: true, description: 'Button text.' },
      { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'sticky-bar'", required: false, description: 'Style variant.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, description: 'Button height.' },
      { name: 'icon', type: 'React.ReactNode', required: false, description: 'Optional leading/trailing icon.' },
      { name: 'onClick', type: '() => void', required: true, description: 'Click handler.' }
    ],
    variants: [
      { name: 'Primary Accent', description: 'Filled with category theme primary token.' },
      { name: 'Sticky Bottom Bar', description: 'Full mobile screen width fixed at bottom of viewport (z-index 40).' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Minimum height 48px to satisfy touch target rule.' },
      { breakpoint: 'Desktop', behavior: 'Standard 40px or 44px with hover state.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Solid fill, high contrast text.' },
      { state: 'Hover', visualSpec: 'Brightness 95%, subtle upward translate.' },
      { state: 'Focus', visualSpec: '2px solid theme ring with 2px offset.' },
      { state: 'Disabled', visualSpec: 'Opacity 50%, cursor not-allowed.' }
    ]
  },
  {
    name: 'PriceDisplay',
    category: 'Public Website',
    purpose: 'Standardized currency display rendering full service price, advance deposit percentage, and remaining in-salon balance.',
    props: [
      { name: 'totalAmount', type: 'number', required: true, description: 'Total service fee in INR.' },
      { name: 'advancePercent', type: 'number', required: true, description: 'Advance percentage e.g. 25%.' },
      { name: 'showBreakdown', type: 'boolean', required: false, description: 'Whether to show advance vs at-venue split.' },
      { name: 'currencySymbol', type: 'string', required: false, description: 'Defaults to ₹.' }
    ],
    variants: [
      { name: 'Compact', description: 'Shows "₹1,000" with small note "₹250 advance".' },
      { name: 'Detailed Ledger', description: 'Full 3-line card: Total, Advance Payable Now, Balance at Salon.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'All', behavior: 'Auto-adapts tabular figures (font-variant-numeric: tabular-nums) for perfect column alignment.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Primary price in bold neutral-900, advance deposit highlighted in emerald or amber.' }
    ]
  },
  {
    name: 'BusinessInfo',
    category: 'Public Website',
    purpose: 'Compact metadata block summarizing salon telephone, street address, operating status, and quick WhatsApp link.',
    props: [
      { name: 'name', type: 'string', required: true, description: 'Business title.' },
      { name: 'category', type: 'string', required: true, description: 'Niche category label.' },
      { name: 'address', type: 'string', required: true, description: 'Street address.' },
      { name: 'phone', type: 'string', required: true, description: 'Contact phone.' }
    ],
    variants: [
      { name: 'Sidebar Widget', description: 'Vertical stack for contact drawer.' },
      { name: 'Horizontal Header Bar', description: 'Inline compact header info bar.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'All', behavior: 'Wrap on narrow screens, maintains icon alignment.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Icon + text rows with clickable phone/WhatsApp links.' }
    ]
  },
  {
    name: 'OpeningHours',
    category: 'Public Website',
    purpose: 'Interactive 7-day schedule card indicating live "Open Now / Closes 9 PM" badge and daily time windows.',
    props: [
      { name: 'schedule', type: 'Array<{ day: string; open: string; close: string; isClosed?: boolean }>', required: true, description: 'Weekly hours.' },
      { name: 'currentDay', type: 'string', required: false, description: 'Highlights today row.' }
    ],
    variants: [
      { name: 'Table Card', description: '7-row list with today highlighted in subtle theme accent.' },
      { name: 'Compact Pill', description: 'Shows today only with dropdown toggle.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Today highlighted with prominent status pill; full week collapsible.' },
      { breakpoint: 'Desktop', behavior: 'Full table visible in Contact section.' }
    ],
    states: [
      { state: 'Open Now', visualSpec: 'Emerald dot and badge with countdown to close.' },
      { state: 'Closed', visualSpec: 'Rose muted pill indicating opening time tomorrow.' }
    ]
  }
];

// 5. ADMIN COMPONENT SYSTEM (18 Reusable Components)
export const ADMIN_COMPONENT_SYSTEM: ComponentSpec[] = [
  {
    name: 'AppShell',
    category: 'Admin System',
    purpose: 'Master multi-tenant SaaS layout frame unifying persistent sidebar, collapsible topbar, notification channel, and content canvas.',
    props: [
      { name: 'sidebar', type: 'React.ReactNode', required: true, description: 'Admin navigation component.' },
      { name: 'topbar', type: 'React.ReactNode', required: true, description: 'Admin topbar with search, tenant switcher, and profile.' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Page contents.' },
      { name: 'isMobileMenuOpen', type: 'boolean', required: true, description: 'Mobile drawer trigger.' }
    ],
    variants: [
      { name: 'Desktop Fixed Nav', description: 'Sidebar locked at 260px width, content scrolls independently.' },
      { name: 'Mobile Sheet Nav', description: 'Sidebar collapses into slide-over backdrop sheet.' }
    ],
    responsiveBehavior: [
      { breakpoint: '<1024px', behavior: 'Sidebar hidden by default; hamburger opens left drawer overlay.' },
      { breakpoint: '>=1024px', behavior: 'Sidebar permanently mounted on left (260px fixed).' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Background neutral-100, zero layout shifts.' }
    ]
  },
  {
    name: 'Sidebar',
    category: 'Admin System',
    purpose: 'Hierarchical navigation grouping salon admin modules: Operations, Website Builder, Finances, and Settings.',
    props: [
      { name: 'navGroups', type: 'Array<{ groupName: string; items: Array<{ id: string; label: string; icon: string; count?: number }> }>', required: true, description: 'Navigation items.' },
      { name: 'activeId', type: 'string', required: true, description: 'Current active page route.' },
      { name: 'onSelect', type: '(id: string) => void', required: true, description: 'Route switcher handler.' },
      { name: 'tenantName', type: 'string', required: true, description: 'Salon name display.' }
    ],
    variants: [
      { name: 'Full Expanded', description: 'Labels with icons, group headers, and counter badges.' },
      { name: 'Compact Icon Only', description: 'Collapsed 64px width for dense widescreen dashboards.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Slide-in drawer with backdrop blur.' },
      { breakpoint: 'Desktop', behavior: 'Fixed left 260px column with smooth scroll.' }
    ],
    states: [
      { state: 'Item Active', visualSpec: 'Bg-slate-900 text-white font-medium shadow-sm.' },
      { state: 'Item Inactive', visualSpec: 'Text-slate-600 hover:bg-slate-100 hover:text-slate-900.' }
    ]
  },
  {
    name: 'Topbar',
    category: 'Admin System',
    purpose: 'Global header containing search shortcut (Cmd+K), date filter, notification drawer trigger, and user account avatar.',
    props: [
      { name: 'salonName', type: 'string', required: true, description: 'Active salon branch.' },
      { name: 'userRole', type: 'string', required: true, description: 'Owner, Manager, Staff, or Super Admin.' },
      { name: 'notificationCount', type: 'number', required: false, description: 'Unread booking alerts.' },
      { name: 'onSearchClick', type: '() => void', required: false, description: 'Global command palette.' }
    ],
    variants: [
      { name: 'Sticky Light Bar', description: 'Border-bottom neutral-200 with 60px height.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Shows hamburger, salon name, and user profile avatar.' },
      { breakpoint: 'Desktop', behavior: 'Full search bar, quick stats preview, and direct "View Live Website" shortcut.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'White surface, border-b border-slate-200.' }
    ]
  },
  {
    name: 'DashboardCard',
    category: 'Admin System',
    purpose: 'Standard container card for analytics, recent booking feeds, staff schedules, and financial breakdowns.',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Card title.' },
      { name: 'subtitle', type: 'string', required: false, description: 'Contextual label.' },
      { name: 'headerAction', type: 'React.ReactNode', required: false, description: 'Optional button or filter select.' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Inner card content.' }
    ],
    variants: [
      { name: 'Standard Card', description: 'White background, 1px border, 16px padding.' },
      { name: 'Metric Highlight', description: 'Card with colored accent top border for KPI focus.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'All', behavior: 'Flexible box wrapping smoothly to grid column spans.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Rounded-lg border border-slate-200 bg-white shadow-sm.' }
    ]
  },
  {
    name: 'DataTable',
    category: 'Admin System',
    purpose: 'High-density tabular data viewer for Bookings, Staff, Customers, and Settlements with column sorting and row actions.',
    props: [
      { name: 'columns', type: 'Array<{ key: string; label: string; width?: string; sortable?: boolean }>', required: true, description: 'Column configuration.' },
      { name: 'rows', type: 'Array<Record<string, any>>', required: true, description: 'Row data.' },
      { name: 'isLoading', type: 'boolean', required: false, description: 'Loading skeleton state.' },
      { name: 'onRowClick', type: '(row: any) => void', required: false, description: 'Row selection handler.' }
    ],
    variants: [
      { name: 'Full Desktop Grid', description: 'Multi-column with fixed headers and zebra hover.' },
      { name: 'Mobile Card Stack', description: 'Transforms each row into a compact 3-line card on mobile viewports.' }
    ],
    responsiveBehavior: [
      { breakpoint: '<768px', behavior: 'Converts table rows into responsive mobile list cards with key data badges.' },
      { breakpoint: '>=768px', behavior: 'Traditional horizontal table with overflow-x-auto scrolling.' }
    ],
    states: [
      { state: 'Empty', visualSpec: 'Clean empty illustration with "No bookings found" helper and create CTA.' },
      { state: 'Row Hover', visualSpec: 'Bg-slate-50 cursor-pointer.' }
    ]
  },
  {
    name: 'FilterBar',
    category: 'Admin System',
    purpose: 'Interactive control bar housing search input, status dropdowns, date picker shortcuts, and export actions.',
    props: [
      { name: 'searchPlaceholder', type: 'string', required: true, description: 'e.g. Search by customer, phone or ID...' },
      { name: 'filterOptions', type: 'Array<{ key: string; label: string; values: string[] }>', required: true, description: 'Available filters.' },
      { name: 'onSearchChange', type: '(q: string) => void', required: true, description: 'Search query handler.' },
      { name: 'onFilterChange', type: '(key: string, val: string) => void', required: true, description: 'Filter change callback.' }
    ],
    variants: [
      { name: 'Inline Bar', description: 'Horizontal row with search, chips, and right-aligned action buttons.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Search bar top; filter chips scroll horizontally beneath.' },
      { breakpoint: 'Desktop', behavior: 'All controls fit inline in a single 44px height container.' }
    ],
    states: [
      { state: 'Active Filter', visualSpec: 'Badge indicating active filter count with "Reset All" button.' }
    ]
  },
  {
    name: 'StatusBadge',
    category: 'Admin System',
    purpose: 'Standard visual indicator for appointment statuses, payment settlements, and staff availability.',
    props: [
      { name: 'status', type: "'CONFIRMED' | 'PENDING' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED' | 'SETTLED'", required: true, description: 'Status token.' },
      { name: 'label', type: 'string', required: false, description: 'Custom display label override.' },
      { name: 'size', type: "'sm' | 'md'", required: false, description: 'Size variant.' }
    ],
    variants: [
      { name: 'Pill Dot', description: 'Small colored indicator dot alongside text label in rounded-full pill.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'All', behavior: 'Maintains fixed height and whitespace-nowrap.' }
    ],
    states: [
      { state: 'CONFIRMED', visualSpec: 'Bg-emerald-100 text-emerald-800 border-emerald-200.' },
      { state: 'PENDING', visualSpec: 'Bg-amber-100 text-amber-800 border-amber-200.' },
      { state: 'CANCELLED', visualSpec: 'Bg-rose-100 text-rose-800 border-rose-200.' },
      { state: 'IN_SERVICE', visualSpec: 'Bg-sky-100 text-sky-800 border-sky-200 animate-pulse.' }
    ]
  },
  {
    name: 'Calendar',
    category: 'Admin System',
    purpose: 'Staff and booking schedule grid supporting Day, Week, and Staff resource column views.',
    props: [
      { name: 'viewMode', type: "'day' | 'week' | 'staff-lanes'", required: true, description: 'Calendar perspective.' },
      { name: 'selectedDate', type: 'string', required: true, description: 'ISO date string.' },
      { name: 'events', type: 'Array<{ id: string; staffId: string; start: string; end: string; title: string; status: string }>', required: true, description: 'Bookings list.' },
      { name: 'onSlotClick', type: '(time: string, staffId?: string) => void', required: true, description: 'New booking on slot click.' }
    ],
    variants: [
      { name: 'Staff Resource Lanes', description: 'Columns represent salon specialists with time rows.' },
      { name: 'Weekly Overview', description: '7-column view showing salon volume.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Day view only with quick date switcher swipe.' },
      { breakpoint: 'Desktop', behavior: 'Multi-staff resource view with drag-and-drop capability.' }
    ],
    states: [
      { state: 'Available Slot', visualSpec: 'Border-b border-dashed border-slate-100 hover:bg-slate-50.' },
      { state: 'Booked Slot', visualSpec: 'Card inside slot with customer name and service duration.' }
    ]
  },
  {
    name: 'BookingCard',
    category: 'Admin System',
    purpose: 'Compact appointment block showing customer name, phone, service, specialist, start time, and payment state.',
    props: [
      { name: 'bookingId', type: 'string', required: true, description: 'Unique booking code.' },
      { name: 'customerName', type: 'string', required: true, description: 'Customer full name.' },
      { name: 'serviceName', type: 'string', required: true, description: 'Booked service.' },
      { name: 'staffName', type: 'string', required: true, description: 'Assigned stylist.' },
      { name: 'timeSlot', type: 'string', required: true, description: 'e.g. 11:00 AM – 11:45 AM.' },
      { name: 'totalAmount', type: 'number', required: true, description: 'Total price in INR.' },
      { name: 'advancePaid', type: 'number', required: true, description: 'Advance collected.' },
      { name: 'status', type: 'string', required: true, description: 'CONFIRMED, PENDING, etc.' },
      { name: 'onOpenDrawer', type: '() => void', required: true, description: 'Opens full appointment inspector drawer.' }
    ],
    variants: [
      { name: 'Timeline Block', description: 'Positioned inside calendar grid.' },
      { name: 'Feed Card', description: 'Stacked card in Today\'s Queue.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'All', behavior: 'Interactive card with immediate visual status indicator.' }
    ],
    states: [
      { state: 'Confirmed', visualSpec: 'Left border 4px emerald-500.' },
      { state: 'Pending Payment', visualSpec: 'Left border 4px amber-500.' }
    ]
  },
  {
    name: 'StatsCard',
    category: 'Admin System',
    purpose: 'Executive KPI metric summary card displaying figure, trend delta, and qualifying progress.',
    props: [
      { name: 'title', type: 'string', required: true, description: 'e.g. Today\'s Bookings or 15-Day Cycle Total.' },
      { name: 'value', type: 'string', required: true, description: 'e.g. ₹18,450 or 24.' },
      { name: 'trend', type: '{ delta: string; isPositive: boolean }', required: false, description: 'e.g. +14% vs last week.' },
      { name: 'caption', type: 'string', required: false, description: 'Contextual note.' }
    ],
    variants: [
      { name: 'Simple KPI', description: 'Large numerical display with subtle trend chip.' },
      { name: 'Progress Gauge KPI', description: 'Includes progress bar for 15-day QR qualification threshold.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: '2-column grid.' },
      { breakpoint: 'Desktop', behavior: '4-column grid.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'White card, border border-slate-200, padding 16px.' }
    ]
  },
  {
    name: 'ChartCard',
    category: 'Admin System',
    purpose: 'Visualization container for Booking volume, Revenue trends, Category breakdown, and Commission graphs.',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Chart title.' },
      { name: 'timeRange', type: "'7d' | '30d' | '15-cycle'", required: true, description: 'Time filter.' },
      { name: 'chartType', type: "'bar' | 'line' | 'donut'", required: true, description: 'Visual style.' },
      { name: 'summaryFigure', type: 'string', required: false, description: 'Aggregate total.' }
    ],
    variants: [
      { name: 'Revenue Breakdown', description: '90% Salon / 10% Platform stacked bar chart.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Full width card with simplified trend bars.' },
      { breakpoint: 'Desktop', behavior: 'Spans 2 columns in dashboard grid.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Card with clean coordinate axis and tooltip support.' }
    ]
  },
  {
    name: 'Drawer',
    category: 'Admin System',
    purpose: 'Slide-over side sheet for deep inspection (Booking Details, Customer History, Add Staff Member).',
    props: [
      { name: 'isOpen', type: 'boolean', required: true, description: 'Drawer visibility.' },
      { name: 'title', type: 'string', required: true, description: 'Drawer header title.' },
      { name: 'onClose', type: '() => void', required: true, description: 'Close handler.' },
      { name: 'footerActions', type: 'React.ReactNode', required: false, description: 'Action buttons at drawer bottom.' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Drawer body.' }
    ],
    variants: [
      { name: 'Right Slide-Over', description: 'Slides in from right side (width 400px–520px).' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Takes 100% full screen width.' },
      { breakpoint: 'Desktop', behavior: 'Fixed 440px width sheet with dark backdrop overlay.' }
    ],
    states: [
      { state: 'Open', visualSpec: 'Z-index 50, smooth slide-in animation, backdrop blur-sm.' }
    ]
  },
  {
    name: 'Modal',
    category: 'Admin System',
    purpose: 'Centered dialog for critical confirmations (Cancel Booking, Process Settlement, Publish Website).',
    props: [
      { name: 'isOpen', type: 'boolean', required: true, description: 'Visibility.' },
      { name: 'title', type: 'string', required: true, description: 'Dialog title.' },
      { name: 'description', type: 'string', required: false, description: 'Explanation text.' },
      { name: 'onConfirm', type: '() => void', required: true, description: 'Primary action handler.' },
      { name: 'onCancel', type: '() => void', required: true, description: 'Dismissal handler.' },
      { name: 'isDestructive', type: 'boolean', required: false, description: 'Red button styling for cancellations.' }
    ],
    variants: [
      { name: 'Confirmation Box', description: 'Compact dialog with Cancel / Confirm buttons.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Bottom-sheet attached to viewport bottom.' },
      { breakpoint: 'Desktop', behavior: 'Centered modal with max-width 480px.' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Shadow-2xl, border border-slate-200, keyboard ESC dismiss.' }
    ]
  },
  {
    name: 'Form',
    category: 'Admin System',
    purpose: 'Accessible form wrapper handling field validation, error summary, submit locks, and dirty state.',
    props: [
      { name: 'onSubmit', type: '() => void', required: true, description: 'Submit handler.' },
      { name: 'isSubmitting', type: 'boolean', required: false, description: 'Disables submit button with spinner.' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Form fields.' }
    ],
    variants: [
      { name: 'Card Form', description: 'Contained inside admin card with clear action footer.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'All', behavior: 'Fields stack into single column or 2-column grid.' }
    ],
    states: [
      { state: 'Submitting', visualSpec: 'Buttons show loader, inputs locked.' }
    ]
  },
  {
    name: 'FormSection',
    category: 'Admin System',
    purpose: 'Logical visual grouping of related form inputs (e.g. "Pricing & Advance Rules" or "Opening Hours").',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Section headline.' },
      { name: 'description', type: 'string', required: false, description: 'Subtext explaining section fields.' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Form controls.' }
    ],
    variants: [
      { name: 'Divided Section', description: 'Top border with title on left and inputs on right.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'Mobile', behavior: 'Title stacks above inputs.' },
      { breakpoint: 'Desktop', behavior: '2-column layout (title left 1/3, inputs right 2/3).' }
    ],
    states: [
      { state: 'Default', visualSpec: 'Border-b border-slate-200 pb-6 mb-6.' }
    ]
  },
  {
    name: 'FileUploader',
    category: 'Admin System',
    purpose: 'Drag-and-drop image and logo asset uploader with dimension guidance, preview chips, and delete action.',
    props: [
      { name: 'acceptedTypes', type: 'string', required: true, description: 'e.g. image/jpeg, image/png, image/webp.' },
      { name: 'maxSizeMb', type: 'number', required: true, description: 'File size limit.' },
      { name: 'currentImageUrl', type: 'string', required: false, description: 'Existing image preview.' },
      { name: 'label', type: 'string', required: true, description: 'Upload instructions.' }
    ],
    variants: [
      { name: 'Dropzone Box', description: 'Dashed border drop area with upload icon.' },
      { name: 'Compact Avatar Uploader', description: 'Circular image preview with camera overlay.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'All', behavior: 'Responsive touch target with mobile camera file picker support.' }
    ],
    states: [
      { state: 'Drag Over', visualSpec: 'Border-primary bg-primary/5.' },
      { state: 'Uploaded', visualSpec: 'Thumbnail preview with remove trash icon.' }
    ]
  },
  {
    name: 'EditorPanel',
    category: 'Admin System',
    purpose: 'Side property inspector in the Website Builder allowing merchants to edit section text, images, and CTAs.',
    props: [
      { name: 'selectedSection', type: 'string', required: true, description: 'e.g. Hero, Services, Gallery, About.' },
      { name: 'fields', type: 'Array<{ key: string; label: string; type: string; value: any }>', required: true, description: 'Configurable properties.' },
      { name: 'onFieldChange', type: '(key: string, val: any) => void', required: true, description: 'Instant update callback.' }
    ],
    variants: [
      { name: 'Right Property Inspector', description: 'Vertical pane on the right side of the builder canvas.' }
    ],
    responsiveBehavior: [
      { breakpoint: '<1024px', behavior: 'Replaced with bottom sheet modal property editor on small screens.' },
      { breakpoint: '>=1024px', behavior: 'Fixed 320px right column.' }
    ],
    states: [
      { state: 'Active Section', visualSpec: 'Renders dedicated form controls matching active section schema.' }
    ]
  },
  {
    name: 'PreviewPanel',
    category: 'Admin System',
    purpose: 'Center live iframe canvas in the Website Builder providing realistic desktop/mobile preview of the generated salon website.',
    props: [
      { name: 'deviceViewport', type: "'desktop' | 'tablet' | 'mobile'", required: true, description: 'Simulated viewport size.' },
      { name: 'previewUrl', type: 'string', required: false, description: 'Preview stream.' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Simulated website output.' }
    ],
    variants: [
      { name: 'Window Frame', description: 'Bezel frame with simulated browser navigation bar and reload icon.' }
    ],
    responsiveBehavior: [
      { breakpoint: 'All', behavior: 'Scales smoothly inside available center viewport width.' }
    ],
    states: [
      { state: 'Desktop Mode', visualSpec: 'Width 100% max-w-5xl shadow-xl rounded-lg.' },
      { state: 'Mobile Mode', visualSpec: 'Width 375px centered with realistic mobile smartphone bezel.' }
    ]
  }
];

// 6. WEBSITE BUILDER UI SPECIFICATION
export const WEBSITE_BUILDER_SPEC = {
  architecture: 'Clean 4-Zone Studio Layout (Anti-Figma, Merchant-Friendly)',
  zones: {
    top: {
      name: 'Studio Top Bar',
      height: '56px',
      elements: [
        'Back to Admin Dashboard button',
        'Active Template Name & Category Pill (e.g. "Executive Barber — Dark Slate")',
        'Viewport Device Switcher: Mobile (375px) | Tablet (768px) | Desktop (1280px)',
        'Status Indicator: "All changes saved"',
        'Preview in New Tab button',
        'Publish Website CTA button (Prominent primary accent)'
      ]
    },
    left: {
      name: 'Left Pane — Page & Section List (280px Fixed)',
      elements: [
        'Page Switcher dropdown: Home, Services, Packages, Gallery, About, Contact',
        'Section Tree List with drag-handles: Announcement, Navbar, Hero, Featured Services, Packages, About, Staff, Gallery, Testimonials, Booking CTA, Contact, Footer',
        'Visibility toggle (Eye icon) to hide/show sections with 1 click',
        'Reorder up/down triggers for instant section reordering',
        'Add Section button (+ Add Section: FAQ, Video Tour, Specials Banner)'
      ]
    },
    center: {
      name: 'Center Pane — Live Website Preview Canvas (Flexible Auto-Width)',
      elements: [
        'Centered interactive simulated viewport frame',
        'Real-time hot-reloading preview showing exact fonts, colors, and content',
        'Click-to-select: Clicking any section on preview highlights its properties in the right inspector',
        'Floating quick-add toolbar between sections'
      ]
    },
    right: {
      name: 'Right Pane — Property Inspector (320px Fixed)',
      elements: [
        'Inspector Header: "Editing: [Section Name]"',
        'Content Tab: Headline, Subheadline, Body copy, CTA button text, CTA target',
        'Media Tab: Image uploaders for hero banners, gallery items, or logo swap',
        'Style Tab: Background style (Clean White / Subdued Neutral / Dark Accent), Card radius token, Padding controls',
        'Reset to Category Defaults button'
      ]
    }
  }
};

// 7. RESPONSIVE RULES (360px+, 768px+, 1024px+, 1440px+)
export const RESPONSIVE_RULES: ResponsiveBreakpointRule[] = [
  {
    breakpoint: 'Mobile Phone',
    range: '360px – 767px',
    mobileNav: 'Full-screen slide-over drawer triggered by header hamburger. Bottom sticky "Book Appointment" bar fixed at z-index 40.',
    tabletLayout: 'N/A',
    desktopSidebar: 'Sidebar hidden completely; accessible via off-canvas hamburger drawer.',
    tables: 'Data tables convert into stacked vertical summary cards. Only key columns shown (Customer Name, Service, Time, Status).',
    bookingFlow: 'Full-width single-column stepper with sticky bottom action button. Step indicator as 1 of 5 dots or compact progress bar.',
    forms: 'Single column fields. Full width 48px touch inputs. Keyboards configured for numeric input (tel, pincode).',
    builderBehavior: 'Builder falls back to focused Property Form mode or prompts to edit on tablet/desktop for optimal preview.'
  },
  {
    breakpoint: 'Tablet Portrait & Landscape',
    range: '768px – 1023px',
    mobileNav: 'Simplified horizontal nav with primary booking CTA button in header. Mobile drawer preserved if links exceed 5.',
    tabletLayout: '2-column service and package grids. Content max-width constrained to 720px for comfortable reading.',
    desktopSidebar: 'Sidebar collapses to 64px icon-only rail or remains off-canvas with permanent topbar toggle.',
    tables: 'Standard table displays with horizontal scroll for overflow columns (UTR, Commission, Tax).',
    bookingFlow: '2-column split: Left 40% shows Sticky Booking Summary; Right 60% contains interactive step selection.',
    forms: '2-column grid for paired fields (e.g. First Name / Last Name, Phone / Email).',
    builderBehavior: 'Left section list and Center preview visible; Right property inspector opens as overlay sheet.'
  },
  {
    breakpoint: 'Desktop Standard',
    range: '1024px – 1439px',
    mobileNav: 'Full horizontal desktop navigation with opening hours badge and primary booking CTA.',
    tabletLayout: 'N/A',
    desktopSidebar: 'Permanent 260px left sidebar in Admin Shell; content canvas occupies remaining width with 24px padding.',
    tables: 'Full multi-column data table with sortable column headers, inline status chips, and row action triggers.',
    bookingFlow: 'Wide modal or dedicated page with fixed summary sidebar on right and step content on left.',
    forms: '2-column layout (Section info on left 1/3, input fields on right 2/3).',
    builderBehavior: 'Full 3-pane layout active: Left Section Tree (280px) + Center Live Preview + Right Inspector (320px).'
  },
  {
    breakpoint: 'Desktop Widescreen / Ultra',
    range: '1440px+',
    mobileNav: 'Centered contained max-width 1280px navigation with complete contact details and social icons.',
    tabletLayout: 'N/A',
    desktopSidebar: 'Permanent 280px sidebar; content canvas max-width locked at 1400px to prevent awkward wide stretching.',
    tables: 'Spacious table layout with comprehensive audit details visible without horizontal scrolling.',
    bookingFlow: 'Contained comfortable 1040px width container with luxury spatial breathing room.',
    forms: 'Contained max-width 900px form card.',
    builderBehavior: 'Studio canvas with generous preview margin and high-resolution simulated previews.'
  }
];

// 8. ACCESSIBILITY SPECIFICATION (WCAG 2.2 AA)
export const ACCESSIBILITY_SPECIFICATIONS: AccessibilityStandard[] = [
  {
    rule: 'Contrast Ratio (Text & Elements)',
    criterion: 'WCAG 1.4.3 & 1.4.11',
    level: 'WCAG 2.2 AA',
    specification: 'Minimum 4.5:1 contrast ratio for all standard body copy (14px/16px) against backgrounds. Minimum 3:1 for large display titles (24px+) and interactive boundaries.',
    implementationGuideline: 'Use semantic neutral-900 (#18181B) on white (#FFFFFF) yields 15.3:1 contrast. Subdued text neutral-700 yields 7.2:1. Category accents must meet 4.5:1 before being approved for text.'
  },
  {
    rule: 'Keyboard Navigation & Tab Flow',
    criterion: 'WCAG 2.1.1 & 2.1.2',
    level: 'WCAG 2.2 AA',
    specification: 'Every interactive element (Buttons, Links, Inputs, Calendar Slots, Category Chips) must be fully reachable and operable via TAB, ENTER, SPACE, and ARROW keys without keyboard traps.',
    implementationGuideline: 'Maintain natural DOM reading order. Esc key dismisses drawers, modals, and date pickers. Focus returns to the triggering button upon drawer close.'
  },
  {
    rule: 'Visible Focus States',
    criterion: 'WCAG 2.4.7 & 2.4.11',
    level: 'WCAG 2.2 AA',
    specification: 'Interactive controls must display a high-visibility 2px focus ring with minimum 2px offset on keyboard focus. Never use outline: none without replacement.',
    implementationGuideline: 'Tailwind standard: focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 (or category theme accent).'
  },
  {
    rule: 'Touch Target Sizing',
    criterion: 'WCAG 2.5.8 (Target Size Minimum)',
    level: 'WCAG 2.2 AA',
    specification: 'All mobile touch targets must be at least 44x44px (or 24x24 CSS pixels with sufficient spatial margin) to prevent accidental taps.',
    implementationGuideline: 'Buttons have min-h-[48px] on mobile. Calendar time slots and service select buttons have 8px minimum gap.'
  },
  {
    rule: 'Form Labels & Input Semantics',
    criterion: 'WCAG 3.3.2',
    level: 'WCAG 2.2 AA',
    specification: 'Every input must have an explicit <label> element linked via htmlFor/id. Placeholders must never be used as the sole label.',
    implementationGuideline: 'Visible label above field; aria-describedby linked to helper text or field-level validation errors.'
  },
  {
    rule: 'Error Identification & Announcements',
    criterion: 'WCAG 3.3.1 & 4.1.3',
    level: 'WCAG 2.2 AA',
    specification: 'Validation errors must identify the specific field in error, describe the problem in plain text, and announce it via aria-live="polite".',
    implementationGuideline: 'Input border shifts to danger token (red-600) with leading warning icon and text: "Please enter a valid 10-digit mobile number".'
  },
  {
    rule: 'Screen Reader Semantics & ARIA',
    criterion: 'WCAG 4.1.2',
    level: 'WCAG 2.2 AA',
    specification: 'Use landmark regions (<header>, <nav>, <main>, <aside>, <footer>) and semantic heading hierarchy (H1 -> H2 -> H3) with zero skips.',
    implementationGuideline: 'Dynamic states use aria-expanded for dropdowns/drawers, aria-selected for tabs, and aria-busy="true" during booking generation.'
  }
];

// 9. WIREFRAME TO UI MAPPING (All Approved Wireframes)
export const WIREFRAME_UI_MAPPINGS: WireframeToUIMapping[] = [
  // Marketing & Onboarding
  {
    screenId: 'WF-01',
    screenName: 'Platform Landing Page',
    userType: 'Public Visitor',
    uiComponents: ['Navbar', 'Hero', 'SectionHeader', 'GalleryGrid', 'BookingCTA', 'Footer'],
    dataRequired: ['Platform headline, category preview list, pricing tiers, customer testimonial highlights.'],
    responsiveBehavior: 'Single-column stack on mobile with instant "Start 14-Day Free Trial" sticky button; 3-column features on desktop.'
  },
  {
    screenId: 'WF-02',
    screenName: 'Category Selection Gateway',
    userType: 'Business Admin',
    uiComponents: ['AppShell', 'SectionHeader', 'DashboardCard', 'BookingButton'],
    dataRequired: ['10 Salon categories (Barber, Spa, Tattoo, etc.) with icons, taglines, and recommended feature list.'],
    responsiveBehavior: '2-column cards on mobile (360px); 5-column balanced category grid on desktop.'
  },
  {
    screenId: 'WF-03',
    screenName: 'Template & Theme Selector',
    userType: 'Business Admin',
    uiComponents: ['AppShell', 'PreviewPanel', 'DashboardCard', 'StatusBadge', 'BookingButton'],
    dataRequired: ['Recommended templates for selected category, color palette tokens, font pairing tags.'],
    responsiveBehavior: 'Carousel swipe on mobile; 3-column live template card preview on desktop.'
  },
  {
    screenId: 'WF-06',
    screenName: 'Business Information Setup',
    userType: 'Business Admin',
    uiComponents: ['AppShell', 'Form', 'FormSection', 'FileUploader', 'BookingButton'],
    dataRequired: ['Business name, category, phone, street address, GSTIN, primary currency.'],
    responsiveBehavior: 'Single-column form inputs on mobile with keyboard auto-type; 2-column divided form on desktop.'
  },
  {
    screenId: 'WF-07',
    screenName: 'Services & Advance Pricing Setup',
    userType: 'Business Admin',
    uiComponents: ['AppShell', 'DataTable', 'Drawer', 'Form', 'PriceDisplay', 'BookingButton'],
    dataRequired: ['Default category services, prices, durations, advance deposit percentage rules.'],
    responsiveBehavior: 'Card list on mobile with quick inline price edit; dense table with drawer on desktop.'
  },
  {
    screenId: 'WF-11',
    screenName: 'Live Website Preview & Verification',
    userType: 'Business Admin',
    uiComponents: ['AppShell', 'PreviewPanel', 'Topbar', 'BookingButton'],
    dataRequired: ['Generated salon website data, mock booking engine preview, viewport simulator.'],
    responsiveBehavior: 'Full screen preview toggle; center iframe canvas with simulated device bezels.'
  },
  {
    screenId: 'WF-12',
    screenName: 'Publish & Handover Confirmation',
    userType: 'Business Admin',
    uiComponents: ['AppShell', 'DashboardCard', 'BookingButton', 'StatusBadge'],
    dataRequired: ['Subdomain URL, salon QR code generator data, link to Merchant Admin Dashboard.'],
    responsiveBehavior: 'Centered celebratory card with prominent one-tap "Copy Link" and "Enter Dashboard" CTAs.'
  },

  // Public Business Website
  {
    screenId: 'WF-13',
    screenName: 'Public Business Home',
    userType: 'Public Visitor',
    uiComponents: ['Navbar', 'Hero', 'SectionHeader', 'ServiceCard', 'PackageCard', 'StaffCard', 'GalleryGrid', 'TestimonialCard', 'BookingCTA', 'ContactBlock', 'Footer'],
    dataRequired: ['Salon profile, opening hours, featured services, specialist list, photos, reviews, location.'],
    responsiveBehavior: 'Single-column mobile flow with sticky Book Now bar; multi-column structured sections on desktop.'
  },
  {
    screenId: 'WF-14',
    screenName: 'Public Services Page',
    userType: 'Public Visitor',
    uiComponents: ['Navbar', 'SectionHeader', 'FilterBar', 'ServiceCard', 'PriceDisplay', 'BookingButton', 'Footer'],
    dataRequired: ['All service categories, service items, pricing, durations, advance deposit requirements.'],
    responsiveBehavior: 'Horizontal sticky category pill bar on mobile; sidebar category anchor menu on desktop.'
  },
  {
    screenId: 'WF-15',
    screenName: 'Public Packages & Rituals',
    userType: 'Public Visitor',
    uiComponents: ['Navbar', 'SectionHeader', 'PackageCard', 'PriceDisplay', 'BookingButton', 'Footer'],
    dataRequired: ['Multi-service package bundles, savings badges, included service checklists.'],
    responsiveBehavior: '1 column stacked cards on mobile; 3-column bundle cards on desktop.'
  },

  // Booking Engine Flow
  {
    screenId: 'WF-20',
    screenName: 'Booking Step 1: Select Service',
    userType: 'Customer',
    uiComponents: ['FilterBar', 'ServiceCard', 'PriceDisplay', 'BookingButton'],
    dataRequired: ['Category filter list, active services, price and duration metadata.'],
    responsiveBehavior: 'Full screen mobile drawer; 2-column service browser on desktop.'
  },
  {
    screenId: 'WF-21',
    screenName: 'Booking Step 2: Select Specialist',
    userType: 'Customer',
    uiComponents: ['StaffCard', 'StatusBadge', 'BookingButton'],
    dataRequired: ['Qualified staff for selected service, "Any Available Specialist" option, today availability dots.'],
    responsiveBehavior: '2-column avatar grid on mobile; 4-column specialist list on desktop.'
  },
  {
    screenId: 'WF-22',
    screenName: 'Booking Step 3: Date & Time Slot',
    userType: 'Customer',
    uiComponents: ['Calendar', 'BookingButton'],
    dataRequired: ['7-day date strip, available morning/afternoon/evening 15-minute slot intervals.'],
    responsiveBehavior: 'Horizontal swipe date pills with 3-column slot grid on mobile; side-by-side calendar on desktop.'
  },
  {
    screenId: 'WF-24',
    screenName: 'Booking Step 4 & 5: Summary & Advance Deposit',
    userType: 'Customer',
    uiComponents: ['DashboardCard', 'PriceDisplay', 'StatusBadge', 'BookingButton'],
    dataRequired: ['Service name, specialist, date, time, total fee, 25% advance payable, remaining salon balance.'],
    responsiveBehavior: 'Compact mobile ledger with prominent "Pay ₹250 Advance" CTA.'
  },
  {
    screenId: 'WF-26',
    screenName: 'Booking Step 6: Confirmation & Pass',
    userType: 'Customer',
    uiComponents: ['DashboardCard', 'StatusBadge', 'BookingButton'],
    dataRequired: ['Booking confirmation ID, QR code check-in pass, calendar sync buttons (.ics/Google), directions.'],
    responsiveBehavior: 'Mobile-first digital boarding pass style with instant WhatsApp confirmation badge.'
  },

  // Admin & Financial Dashboards
  {
    screenId: 'WF-31',
    screenName: 'Business Admin Dashboard (Overview)',
    userType: 'Business Admin',
    uiComponents: ['AppShell', 'Sidebar', 'Topbar', 'StatsCard', 'ChartCard', 'DataTable', 'BookingCard'],
    dataRequired: ['Today revenue, appointments count, 15-day qualification progress, active queue, staff shifts.'],
    responsiveBehavior: '2-column stats and stacked cards on mobile; 4-column KPI grid with 2-column charts on desktop.'
  },
  {
    screenId: 'WF-32',
    screenName: 'Bookings Management & Queue',
    userType: 'Business Admin',
    uiComponents: ['AppShell', 'Sidebar', 'Topbar', 'FilterBar', 'DataTable', 'StatusBadge', 'Drawer'],
    dataRequired: ['Filterable booking log (Status, Date, Staff, Advance status), customer phone, drawer details.'],
    responsiveBehavior: 'Card list on mobile; dense sortable data table on desktop.'
  },
  {
    screenId: 'WF-38',
    screenName: 'Website Builder Studio',
    userType: 'Business Admin',
    uiComponents: ['AppShell', 'Topbar', 'EditorPanel', 'PreviewPanel', 'BookingButton'],
    dataRequired: ['Page sections, draft theme tokens, preview viewport mode, section schema.'],
    responsiveBehavior: 'Full 3-zone editor on desktop (>=1024px); focused property drawer on tablet.'
  },
  {
    screenId: 'WF-40',
    screenName: 'Financial Settlements & Commission Ledger',
    userType: 'Business Admin',
    uiComponents: ['AppShell', 'Sidebar', 'Topbar', 'StatsCard', 'DataTable', 'StatusBadge', 'PriceDisplay'],
    dataRequired: ['15-day rolling qualification cycle progress, 10% platform commission, 90% merchant share, UTR tracking.'],
    responsiveBehavior: 'Cycle progress card on mobile; comprehensive financial audit table with export on desktop.'
  },
  {
    screenId: 'WF-47',
    screenName: 'Platform Super Admin Dashboard',
    userType: 'Platform Admin',
    uiComponents: ['AppShell', 'Sidebar', 'Topbar', 'StatsCard', 'ChartCard', 'DataTable', 'StatusBadge'],
    dataRequired: ['Total active salons, platform GMV, commission aggregate, category distribution, payout batches.'],
    responsiveBehavior: 'Adaptive responsive dashboard grid across all breakpoints.'
  }
];
