// Nexora SalonOS — Phase 2.2 Public Website Component System Data

export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
}

export interface PublicComponentDetail {
  id: string;
  name: string;
  category: 'Primitives' | 'Content Cards' | 'Grids & Sliders' | 'Navigation & Layout' | 'Sections & CTAs';
  hierarchyLevel: 'Atom' | 'Molecule' | 'Organism' | 'Template Slot';
  purpose: string;
  props: PropDefinition[];
  variants: {
    name: string;
    description: string;
  }[];
  states: {
    name: string;
    visualSpec: string;
  }[];
  desktopBehavior: string;
  tabletBehavior: string;
  mobileBehavior: string;
  accessibilityRequirements: string[];
  categoryCustomization: string;
}

export interface CategoryCardAdaptation {
  category: string;
  serviceTitle: string;
  categoryBadge: string;
  duration: string;
  price: number;
  advancePercentage: number;
  advanceAmount: number;
  remainingAmount: number;
  accentColor: string;
  borderRadius: string;
  buttonStyle: string;
  specialMetadataTag: string;
  description: string;
}

// 1. ALL 25 PUBLIC WEBSITE COMPONENTS SPECIFICATIONS
export const PUBLIC_COMPONENTS_25: PublicComponentDetail[] = [
  // 1. AnnouncementBar
  {
    id: 'announcement-bar',
    name: 'AnnouncementBar',
    category: 'Navigation & Layout',
    hierarchyLevel: 'Molecule',
    purpose: 'Global top strip communicating critical salon notices, seasonal festival offers, holiday schedules, or advance booking alerts.',
    props: [
      { name: 'message', type: 'string', required: true, description: 'Announcement text message.' },
      { name: 'actionLink', type: '{ label: string; href: string }', required: false, description: 'Optional CTA link e.g. "Claim 20% Off".' },
      { name: 'isDismissible', type: 'boolean', required: false, defaultValue: 'false', description: 'Whether users can close the banner.' },
      { name: 'categoryTheme', type: 'string', required: false, description: 'Inherits category theme tone.' }
    ],
    variants: [
      { name: 'Subtle Dark', description: 'Deep slate or void black background with crisp white text for high contrast.' },
      { name: 'Theme Accent Tint', description: 'Light category-specific tint (e.g. blush rose for Hair Salon, pale teal for Spa).' }
    ],
    states: [
      { name: 'Default', visualSpec: 'Fixed height 36px, centered text, flex align.' },
      { name: 'Dismissed', visualSpec: 'Smooth height 0px collapse with opacity fade.' }
    ],
    desktopBehavior: 'Single centered inline row with message, right-aligned link, and close trigger.',
    tabletBehavior: 'Single inline row, compact 12px text size, centered alignment.',
    mobileBehavior: 'Text wraps into 2 compact lines; close icon right aligned; 32px height.',
    accessibilityRequirements: [
      'Rendered inside role="region" aria-label="Announcement".',
      'Dismiss button has aria-label="Dismiss announcement".',
      'Contrast ratio > 4.5:1 against banner background.'
    ],
    categoryCustomization: 'Tattoo Studio uses dark monochrome with bloodline red link; Luxury Spa uses soothing eucalyptus teal with botanical icon.'
  },

  // 2. Navbar
  {
    id: 'navbar',
    name: 'Navbar',
    category: 'Navigation & Layout',
    hierarchyLevel: 'Organism',
    purpose: 'Master global header controller containing salon branding, navigation links, opening hours status, authentication shortcuts, and instant "Book Now" CTA.',
    props: [
      { name: 'salonName', type: 'string', required: true, description: 'Business display name.' },
      { name: 'logoUrl', type: 'string', required: false, description: 'Salon logo image or glyph.' },
      { name: 'navLinks', type: 'Array<{ label: string; href: string }>', required: true, description: 'Home, Services, Packages, Gallery, About, Contact, My Bookings.' },
      { name: 'hoursSummary', type: 'string', required: false, description: 'e.g. "Open Today: 9 AM – 9 PM".' },
      { name: 'onBookClick', type: '() => void', required: true, description: 'Launches booking flow.' },
      { name: 'authLinks', type: '{ onSignIn: () => void; onSignUp: () => void }', required: true, description: 'User login shortcuts.' }
    ],
    variants: [
      { name: 'Sticky Light Glass', description: 'Backdrop-blur-md with white 90% opacity and subtle neutral-200 border.' },
      { name: 'Transparent Dark Overlay', description: 'Overlays hero banner for Tattoo Studio or dark Barber Shop themes.' }
    ],
    states: [
      { name: 'Initial Top', visualSpec: 'Clean transparent or white surface with no shadow.' },
      { name: 'Scrolled', visualSpec: 'Backdrop blur, shadow.sm, 1px bottom border.' },
      { name: 'Mobile Drawer Active', visualSpec: 'Hamburger icon transforms into X close glyph.' }
    ],
    desktopBehavior: 'Full horizontal bar (height 68px): Logo left, 7 navigation links center, Sign In/Up + "Book Now" CTA right.',
    tabletBehavior: 'Logo left, condensed links (or overflow menu), Book Now button right; height 60px.',
    mobileBehavior: 'Logo left, telephone icon, hamburger menu button right; sticky bottom Book Now bar handles mobile conversion.',
    accessibilityRequirements: [
      'Uses <nav aria-label="Primary Navigation">.',
      'Active page link indicated via aria-current="page".',
      'Hamburger button has aria-expanded="true/false" and aria-controls="mobile-menu-drawer".'
    ],
    categoryCustomization: 'Barber Shop applies Cinzel serif logo with deep slate button; Spa applies Cormorant Garamond with tranquil soft pill CTA.'
  },

  // 3. MobileMenu
  {
    id: 'mobile-menu',
    name: 'MobileMenu',
    category: 'Navigation & Layout',
    hierarchyLevel: 'Organism',
    purpose: 'Full-viewport slide-over drawer navigation for mobile devices housing all links, operating hours, direct salon phone call, customer auth, and booking trigger.',
    props: [
      { name: 'isOpen', type: 'boolean', required: true, description: 'Visibility state.' },
      { name: 'onClose', type: '() => void', required: true, description: 'Close handler.' },
      { name: 'navLinks', type: 'Array<{ label: string; href: string }>', required: true, description: 'Navigation items.' },
      { name: 'salonPhone', type: 'string', required: true, description: 'Direct click-to-call phone.' },
      { name: 'onBookClick', type: '() => void', required: true, description: 'Launches booking.' }
    ],
    variants: [
      { name: 'Slide-Over Sheet', description: 'Smooth slide-in from right edge with backdrop blur.' }
    ],
    states: [
      { name: 'Open', visualSpec: 'Z-index 50, backdrop blur, smooth slide-in 300ms ease-out.' },
      { name: 'Closed', visualSpec: 'Off-screen translate-x-full.' }
    ],
    desktopBehavior: 'Hidden completely (display: none via md:hidden).',
    tabletBehavior: 'Active on viewports <1024px if links exceed horizontal space.',
    mobileBehavior: 'Full-screen overlay covering 100% viewport width with large 48px tap targets.',
    accessibilityRequirements: [
      'Focus trap engaged when open (Tab cannot exit drawer).',
      'Escape key immediately closes drawer and returns focus to hamburger button.',
      'role="dialog" aria-modal="true" aria-label="Site Navigation".'
    ],
    categoryCustomization: 'Drawers inherit category background (e.g. void black for Tattoo, petal blush for Beauty Parlour).'
  },

  // 4. Hero
  {
    id: 'hero',
    name: 'Hero',
    category: 'Sections & CTAs',
    hierarchyLevel: 'Organism',
    purpose: 'Primary above-the-fold value statement establishing salon atmosphere, category identity, customer trust rating, and immediate booking CTA.',
    props: [
      { name: 'headline', type: 'string', required: true, description: 'Major salon proposition (e.g. Master Cuts & Beard Craft).' },
      { name: 'subheadline', type: 'string', required: true, description: 'Supporting descriptor highlighting craftsmanship.' },
      { name: 'categoryBadge', type: 'string', required: true, description: 'Category pill label e.g. "Bespoke Grooming Lounge".' },
      { name: 'rating', type: '{ score: number; reviewCount: number }', required: false, description: 'Google / salon rating score.' },
      { name: 'primaryCtaText', type: 'string', required: true, defaultValue: 'Book Appointment', description: 'Primary button label.' },
      { name: 'secondaryCtaText', type: 'string', required: false, description: 'Secondary button e.g. "Explore Rituals".' },
      { name: 'imageSlot', type: 'string', required: true, description: 'Image URL or hero visual container.' }
    ],
    variants: [
      { name: 'Split 50/50', description: 'Content left, photography right with floating rating badge (Barber / Unisex).' },
      { name: 'Center Minimal', description: 'Centered typography with background imagery or soft aura (Spa / Beauty).' },
      { name: 'Bold Poster', description: 'Full-width edge-to-edge typography with dark contrast (Tattoo Studio).' }
    ],
    states: [
      { name: 'Loaded', visualSpec: 'High vertical rhythm, high-contrast headline, crisp CTA.' }
    ],
    desktopBehavior: 'Side-by-side split grid (min-height 540px) or centered luxury container.',
    tabletBehavior: 'Stacked grid with 32px gap, 28px headline, full-width button group.',
    mobileBehavior: 'Single stacked column: Badge, H1 (24px/32px), intro copy, dual full-width buttons, image underneath.',
    accessibilityRequirements: [
      'Single H1 element per page.',
      'Images have descriptive alt tags (e.g. "Barber trimming client beard with precision shears").',
      'Contrast ratio > 4.5:1 on all text.'
    ],
    categoryCustomization: 'Typography personality directly injected: Cinzel for Barber, Cormorant for Spa, Unbounded for Tattoo.'
  },

  // 5. SectionHeader
  {
    id: 'section-header',
    name: 'SectionHeader',
    category: 'Navigation & Layout',
    hierarchyLevel: 'Molecule',
    purpose: 'Standardized section title block with micro-badge, major title, and explanatory subtitle.',
    props: [
      { name: 'badge', type: 'string', required: false, description: 'Category tag e.g. "Our Menu" or "The Masters".' },
      { name: 'title', type: 'string', required: true, description: 'Section H2 title.' },
      { name: 'subtitle', type: 'string', required: false, description: 'Contextual sentence explaining offerings.' },
      { name: 'align', type: "'center' | 'left'", required: false, defaultValue: 'center', description: 'Text alignment.' }
    ],
    variants: [
      { name: 'Centered Pill', description: 'Category pill badge above centered H2 title (Spa / Beauty / Unisex).' },
      { name: 'Left Accent Rule', description: 'Left aligned H2 with category accent color border line (Barber / Tattoo).' }
    ],
    states: [
      { name: 'Default', visualSpec: 'Margin-bottom 32px (mobile) to 48px (desktop).' }
    ],
    desktopBehavior: 'Desktop font size 32px (2.0rem), max-width 640px for subtitle.',
    tabletBehavior: 'Tablet font size 28px (1.75rem), margin-bottom 32px.',
    mobileBehavior: 'Mobile font size 24px (1.5rem), margin-bottom 24px.',
    accessibilityRequirements: [
      'Emits proper semantic <h2> heading tag.',
      'Maintains sequential heading level hierarchy.'
    ],
    categoryCustomization: 'Barber uses amber accent line; Spa uses tranquil teal pill badge with soft botanical glyph.'
  },

  // 6. ServiceCard
  {
    id: 'service-card',
    name: 'ServiceCard',
    category: 'Content Cards',
    hierarchyLevel: 'Molecule',
    purpose: 'Polymorphic card presenting a salon service with duration, price, advance payment deposit breakdown, and direct "Book" action.',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Unique service identifier.' },
      { name: 'title', type: 'string', required: true, description: 'Service name (e.g. Skin Fade or Swedish Massage).' },
      { name: 'description', type: 'string', required: true, description: 'Treatment details.' },
      { name: 'durationMinutes', type: 'number', required: true, description: 'Service duration in minutes.' },
      { name: 'price', type: 'number', required: true, description: 'Total service fee in INR.' },
      { name: 'advancePercent', type: 'number', required: true, description: 'e.g. 25% advance rule.' },
      { name: 'categoryBadge', type: 'string', required: false, description: 'Optional subcategory tag.' },
      { name: 'isPopular', type: 'boolean', required: false, description: 'Highlights popular service.' },
      { name: 'onSelect', type: '(id: string) => void', required: true, description: 'Selects service.' }
    ],
    variants: [
      { name: 'Boxed Grid Card', description: 'Elevated card surface with price highlight and duration tag.' },
      { name: 'Dense Menu Row', description: 'Horizontal row with title/description left and price/CTA right.' }
    ],
    states: [
      { name: 'Default', visualSpec: '1px border neutral-200, clean white surface.' },
      { name: 'Hover', visualSpec: 'Border shifts to category primary accent, subtle translateY(-2px).' },
      { name: 'Focus', visualSpec: '2px solid neutral-900 focus ring with 2px offset.' },
      { name: 'Selected', visualSpec: 'Ring-2 ring-primary, checkmark badge displayed.' }
    ],
    desktopBehavior: 'Contained inside 3-column grid; hover lift effect.',
    tabletBehavior: 'Contained inside 2-column grid; touch-friendly select button.',
    mobileBehavior: 'Full-width card with quick select button; 48px touch target.',
    accessibilityRequirements: [
      'Accessible price readout: "Price: 1000 rupees, 250 rupees advance payable now".',
      'Action button has descriptive label: "Book Haircut for 1000 rupees".'
    ],
    categoryCustomization: 'Single component polymorphically adapts across Barber (Beard Trim), Spa (Swedish Massage), Nail (Gel Extension), and Tattoo (Custom Ink).'
  },

  // 7. ServiceGrid
  {
    id: 'service-grid',
    name: 'ServiceGrid',
    category: 'Grids & Sliders',
    hierarchyLevel: 'Organism',
    purpose: 'Responsive layout container organizing ServiceCard elements with category filtering and empty state handling.',
    props: [
      { name: 'services', type: 'Service[]', required: true, description: 'Array of service data objects.' },
      { name: 'selectedCategory', type: 'string', required: false, description: 'Active filter category.' },
      { name: 'onSelectService', type: '(id: string) => void', required: true, description: 'Selection handler.' }
    ],
    variants: [
      { name: '3-Column Grid', description: 'Standard responsive layout (1 col mobile, 2 col tablet, 3 col desktop).' }
    ],
    states: [
      { name: 'Loaded', visualSpec: 'Balanced 24px gap grid.' },
      { name: 'Empty', visualSpec: 'Centered message: "No services found in this category".' }
    ],
    desktopBehavior: '3-column grid with 24px gap.',
    tabletBehavior: '2-column grid with 16px gap.',
    mobileBehavior: '1-column stacked list with 12px gap.',
    accessibilityRequirements: [
      'Uses role="list" and role="listitem" for screen reader navigation.',
      'Grid status announced if filter changes.'
    ],
    categoryCustomization: 'Spacing and card radius adapt to category theme.'
  },

  // 8. PackageCard
  {
    id: 'package-card',
    name: 'PackageCard',
    category: 'Content Cards',
    hierarchyLevel: 'Molecule',
    purpose: 'Showcase bundled multi-service rituals with combined treatment time, savings badge, and checklist of included services.',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Package ID.' },
      { name: 'name', type: 'string', required: true, description: 'Package name e.g. Executive Grooming Ritual.' },
      { name: 'includedServices', type: 'string[]', required: true, description: 'List of services included.' },
      { name: 'totalDurationMinutes', type: 'number', required: true, description: 'Sum duration.' },
      { name: 'bundlePrice', type: 'number', required: true, description: 'Discounted bundle price in INR.' },
      { name: 'originalPrice', type: 'number', required: true, description: 'Original sum of services.' },
      { name: 'advancePercent', type: 'number', required: true, description: 'Advance deposit percentage.' },
      { name: 'onSelect', type: '(id: string) => void', required: true, description: 'Selects bundle.' }
    ],
    variants: [
      { name: 'Standard Ritual Card', description: 'White card with checkmark list of services and savings badge.' },
      { name: 'Featured Package', description: 'Top accent border and "Most Popular Ritual" highlight badge.' }
    ],
    states: [
      { name: 'Default', visualSpec: '1px border neutral-200, clean white background.' },
      { name: 'Hover', visualSpec: 'Shadow-md, border color shifts to theme accent.' }
    ],
    desktopBehavior: 'Fits 2 or 3-column package layout.',
    tabletBehavior: '2-column card layout.',
    mobileBehavior: 'Single-column card with scrollable checklist.',
    accessibilityRequirements: [
      'Checklist uses <ul> and <li> with aria-label="Services included in this bundle".',
      'Clear savings announcement: "Save 400 rupees".'
    ],
    categoryCustomization: 'Barber features Shave + Cut bundle; Spa features Sauna + Deep Tissue + Facial ritual.'
  },

  // 9. PackageGrid
  {
    id: 'package-grid',
    name: 'PackageGrid',
    category: 'Grids & Sliders',
    hierarchyLevel: 'Organism',
    purpose: 'Responsive grid container for salon packages and rituals.',
    props: [
      { name: 'packages', type: 'Package[]', required: true, description: 'List of package bundles.' },
      { name: 'onSelectPackage', type: '(id: string) => void', required: true, description: 'Selection handler.' }
    ],
    variants: [
      { name: 'Standard Grid', description: '2 to 3 column responsive arrangement.' }
    ],
    states: [
      { name: 'Default', visualSpec: 'Structured grid.' }
    ],
    desktopBehavior: '3-column grid (or 2-column if 2 items).',
    tabletBehavior: '2-column grid.',
    mobileBehavior: '1-column stacked list.',
    accessibilityRequirements: [
      'Grouped inside section with aria-labelledby="packages-title".'
    ],
    categoryCustomization: 'Applies category container max-width.'
  },

  // 10. StaffCard
  {
    id: 'staff-card',
    name: 'StaffCard',
    category: 'Content Cards',
    hierarchyLevel: 'Molecule',
    purpose: 'Display salon stylist, therapist, or tattoo artist profile with photo, specialty badges, rating, and direct "Book with Stylist" button.',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Staff member ID.' },
      { name: 'name', type: 'string', required: true, description: 'Specialist name.' },
      { name: 'role', type: 'string', required: true, description: 'Senior Stylist, Master Barber, etc.' },
      { name: 'specialties', type: 'string[]', required: true, description: 'Specialization chips.' },
      { name: 'rating', type: 'number', required: false, description: 'Average customer rating score.' },
      { name: 'avatarUrl', type: 'string', required: false, description: 'Portrait thumbnail.' },
      { name: 'isAvailableToday', type: 'boolean', required: false, description: 'Live availability indicator dot.' },
      { name: 'onBookDirect', type: '(id: string) => void', required: true, description: 'Prefilters booking calendar to this staff member.' }
    ],
    variants: [
      { name: 'Full Profile Card', description: 'Square portrait with bio, specialties, and book button.' },
      { name: 'Minimal Booking Chip', description: 'Circular avatar and name used inside booking step.' }
    ],
    states: [
      { name: 'Available Today', visualSpec: 'Green active status dot.' },
      { name: 'Off Duty', visualSpec: 'Muted avatar with "Next Available Tomorrow" badge.' }
    ],
    desktopBehavior: 'Contained in 4-column specialist team grid.',
    tabletBehavior: '2-column grid or horizontal scroll snap.',
    mobileBehavior: 'Horizontal swipe snap card (width 260px) or 2-column compact grid.',
    accessibilityRequirements: [
      'Specialist avatar has descriptive alt: "Portrait of Senior Stylist Marco Silva".',
      'Availability dot announced via aria-label="Available for booking today".'
    ],
    categoryCustomization: 'Barber highlights "Beard Sculpting Specialist"; Tattoo highlights "Blackwork & Sacred Geometry Artist".'
  },

  // 11. StaffGrid
  {
    id: 'staff-grid',
    name: 'StaffGrid',
    category: 'Grids & Sliders',
    hierarchyLevel: 'Organism',
    purpose: 'Responsive container organizing salon specialists.',
    props: [
      { name: 'staffMembers', type: 'Staff[]', required: true, description: 'Specialists list.' },
      { name: 'onSelectStaff', type: '(id: string) => void', required: true, description: 'Selection handler.' }
    ],
    variants: [
      { name: '4-Column Grid', description: 'Balanced 4-column team view.' }
    ],
    states: [
      { name: 'Default', visualSpec: '24px gap grid.' }
    ],
    desktopBehavior: '4 columns on desktop viewports.',
    tabletBehavior: '2 columns on tablet viewports.',
    mobileBehavior: 'Horizontal swipe carousel with scroll snap points.',
    accessibilityRequirements: [
      'Navigation keys allow jumping between team cards.'
    ],
    categoryCustomization: 'Adopts category image treatment (vintage matte, high key luminous, or monochrome).'
  },

  // 12. GalleryGrid
  {
    id: 'gallery-grid',
    name: 'GalleryGrid',
    category: 'Grids & Sliders',
    hierarchyLevel: 'Organism',
    purpose: 'Visual portfolio showcase of haircut transformations, nail art sets, spa treatment rooms, and tattoo masterpieces.',
    props: [
      { name: 'images', type: 'Array<{ url: string; caption: string; category?: string }>', required: true, description: 'Media list.' },
      { name: 'onImageClick', type: '(index: number) => void', required: false, description: 'Lightbox modal trigger.' }
    ],
    variants: [
      { name: 'Masonry Asymmetric', description: 'Staggered height editorial layout (Hair Salon / Tattoo Studio).' },
      { name: 'Uniform 1:1 Square Grid', description: 'Clean square tiles (Nail Studio / Spa).' }
    ],
    states: [
      { name: 'Loading', visualSpec: 'Pulsing skeleton aspect-ratio boxes.' },
      { name: 'Hover Tile', visualSpec: 'Zoom 105% with caption slide-up overlay.' }
    ],
    desktopBehavior: '3 or 4-column masonry grid with hover caption.',
    tabletBehavior: '2 or 3-column grid with 12px gap.',
    mobileBehavior: '2-column compact grid with 8px gap.',
    accessibilityRequirements: [
      'All gallery images must have descriptive alt text.',
      'Keyboard Enter opens full-resolution modal preview.'
    ],
    categoryCustomization: 'Nail Studio displays 1:1 macro closeups; Barber displays classic haircut before/after transformations.'
  },

  // 13. GalleryFilter
  {
    id: 'gallery-filter',
    name: 'GalleryFilter',
    category: 'Navigation & Layout',
    hierarchyLevel: 'Molecule',
    purpose: 'Category filter tab strip for sorting portfolio images (e.g. All, Beard Fades, Hair Color, Bridal, Nail Art).',
    props: [
      { name: 'categories', type: 'string[]', required: true, description: 'Filter options.' },
      { name: 'activeCategory', type: 'string', required: true, description: 'Current selection.' },
      { name: 'onSelectCategory', type: '(cat: string) => void', required: true, description: 'Filter change callback.' }
    ],
    variants: [
      { name: 'Horizontal Pill Strip', description: 'Scrollable row of rounded chips.' }
    ],
    states: [
      { name: 'Active', visualSpec: 'Bg-slate-900 text-white font-semibold.' },
      { name: 'Inactive', visualSpec: 'Bg-slate-100 text-slate-700 hover:bg-slate-200.' }
    ],
    desktopBehavior: 'Centered row of chips with 8px gap.',
    tabletBehavior: 'Horizontal scrolling strip.',
    mobileBehavior: 'Horizontal scroll with scroll snap; touch target height 40px.',
    accessibilityRequirements: [
      'role="radiogroup" or role="tablist" with aria-checked="true" on active chip.'
    ],
    categoryCustomization: 'Pills inherit category border radius token (sharp box for Tattoo, full pill for Nail).'
  },

  // 14. TestimonialCard
  {
    id: 'testimonial-card',
    name: 'TestimonialCard',
    category: 'Content Cards',
    hierarchyLevel: 'Molecule',
    purpose: 'Verified customer review card displaying star rating, quote text, customer name, date, and service availed.',
    props: [
      { name: 'customerName', type: 'string', required: true, description: 'Customer name e.g. Arjun M.' },
      { name: 'rating', type: 'number', required: true, description: 'Star score (1–5).' },
      { name: 'reviewText', type: 'string', required: true, description: 'Customer review comment.' },
      { name: 'serviceName', type: 'string', required: false, description: 'Service reviewed e.g. Skin Fade.' },
      { name: 'date', type: 'string', required: false, description: 'Review date.' }
    ],
    variants: [
      { name: 'Clean Quote Card', description: 'Quotation mark icon with stars and verified customer badge.' }
    ],
    states: [
      { name: 'Default', visualSpec: '1px border neutral-200, clean white background, 20px padding.' }
    ],
    desktopBehavior: 'Fits 3-column review grid.',
    tabletBehavior: '2-column layout or slider card.',
    mobileBehavior: 'Full-width card inside swipeable carousel.',
    accessibilityRequirements: [
      'Star rating announced: "Rated 5 out of 5 stars".',
      'Verified booking tag announced via aria-label="Verified booking customer".'
    ],
    categoryCustomization: 'Barber reviews highlight precision cuts; Spa reviews emphasize deep relaxation and therapeutic atmosphere.'
  },

  // 15. TestimonialSlider
  {
    id: 'testimonial-slider',
    name: 'TestimonialSlider',
    category: 'Grids & Sliders',
    hierarchyLevel: 'Organism',
    purpose: 'Interactive carousel displaying customer testimonials with prev/next navigation and pagination dots.',
    props: [
      { name: 'testimonials', type: 'Testimonial[]', required: true, description: 'Reviews data.' },
      { name: 'autoPlay', type: 'boolean', required: false, defaultValue: 'false', description: 'Auto advance timer.' }
    ],
    variants: [
      { name: 'Standard Slider', description: 'Cards slide horizontally with touch swipe and navigation buttons.' }
    ],
    states: [
      { name: 'Default', visualSpec: 'Smooth translation.' }
    ],
    desktopBehavior: 'Displays 3 cards simultaneously with arrow controls.',
    tabletBehavior: 'Displays 2 cards simultaneously.',
    mobileBehavior: 'Displays 1 card with swipe gestures and indicator dots.',
    accessibilityRequirements: [
      'Accessible next/prev buttons with aria-label="Next review".',
      'AutoPlay pauses on hover and focus.'
    ],
    categoryCustomization: 'Styling matches category tokens.'
  },

  // 16. BookingCTA
  {
    id: 'booking-cta',
    name: 'BookingCTA',
    category: 'Sections & CTAs',
    hierarchyLevel: 'Organism',
    purpose: 'High-conversion banner positioned before footer reminding visitors that chair slots fill quickly and prompting advance reservation.',
    props: [
      { name: 'title', type: 'string', required: true, description: 'e.g. Ready for Your Master Cut?' },
      { name: 'subtitle', type: 'string', required: true, description: 'Slots fill rapidly on weekends. Reserve yours online.' },
      { name: 'buttonText', type: 'string', required: true, defaultValue: 'Book Appointment Now', description: 'CTA button label.' },
      { name: 'onAction', type: '() => void', required: true, description: 'Triggers booking drawer.' }
    ],
    variants: [
      { name: 'Category Theme Contrast', description: 'Filled with category primary accent color and white text.' },
      { name: 'Deep Slate Dark', description: 'Dark background with vibrant accent button.' }
    ],
    states: [
      { name: 'Default', visualSpec: 'Rounded container with high visual contrast.' }
    ],
    desktopBehavior: 'Horizontal banner: Text left, Book Now CTA button right (height 48px).',
    tabletBehavior: 'Horizontal banner with compact margins.',
    mobileBehavior: 'Full-width stacked container with full-width button (height 48px).',
    accessibilityRequirements: [
      'High contrast ratio > 4.5:1 on title and button label.',
      'Button is keyboard focusable with 2px ring.'
    ],
    categoryCustomization: 'Theme color dynamically applied: Deep Rose for Hair Salon, Eucalyptus Teal for Spa, Void Black for Tattoo.'
  },

  // 17. ContactSection
  {
    id: 'contact-section',
    name: 'ContactSection',
    category: 'Sections & CTAs',
    hierarchyLevel: 'Organism',
    purpose: 'Physical discovery section combining map pin, street address, telephone, email, WhatsApp chat trigger, and transit directions.',
    props: [
      { name: 'address', type: 'string', required: true, description: 'Street address.' },
      { name: 'phone', type: 'string', required: true, description: 'Contact phone.' },
      { name: 'email', type: 'string', required: false, description: 'Support email.' },
      { name: 'whatsappNumber', type: 'string', required: false, description: 'WhatsApp click-to-chat.' },
      { name: 'landmarks', type: 'string', required: false, description: 'Nearby parking or metro instructions.' }
    ],
    variants: [
      { name: 'Split Map & Info', description: 'Map container left, contact details and action buttons right.' }
    ],
    states: [
      { name: 'Default', visualSpec: 'Clean grid with Lucide icons (MapPin, Phone, Mail).' }
    ],
    desktopBehavior: '50/50 side-by-side grid.',
    tabletBehavior: 'Stacked grid: Contact cards top, map underneath.',
    mobileBehavior: 'One-tap Call and WhatsApp buttons at top; address and map beneath.',
    accessibilityRequirements: [
      'Phone numbers have tel: protocol link.',
      'Address links to Google Maps with external link indicator.'
    ],
    categoryCustomization: 'Barber displays walk-in availability policy; Spa highlights quiet arrival guidelines.'
  },

  // 18. OpeningHours
  {
    id: 'opening-hours',
    name: 'OpeningHours',
    category: 'Content Cards',
    hierarchyLevel: 'Molecule',
    purpose: '7-day operating schedule card indicating live "Open Now / Closes 9 PM" badge and daily operating windows.',
    props: [
      { name: 'schedule', type: 'Array<{ day: string; open: string; close: string; isClosed?: boolean }>', required: true, description: 'Weekly hours.' },
      { name: 'todayHighlight', type: 'boolean', required: false, defaultValue: 'true', description: 'Highlights current day row.' }
    ],
    variants: [
      { name: 'Structured 7-Day Table', description: 'Clean rows with day name left and time window right.' }
    ],
    states: [
      { name: 'Open Now', visualSpec: 'Green status dot + "Open Today until 9:00 PM".' },
      { name: 'Closed', visualSpec: 'Muted rose badge + "Closed · Opens Tomorrow at 10:00 AM".' }
    ],
    desktopBehavior: 'Contained card inside contact section.',
    tabletBehavior: 'Full width card.',
    mobileBehavior: 'Today shown expanded by default with "View full week" collapsible accordion.',
    accessibilityRequirements: [
      'Weekly hours structured in a clean definition list (<dl>) or table with proper <th> scope.',
      'Live open/closed status announced via aria-live="polite".'
    ],
    categoryCustomization: 'Barber displays late evening slots (until 9 PM); Spa highlights Sunday retreat hours.'
  },

  // 19. BusinessInfo
  {
    id: 'business-info',
    name: 'BusinessInfo',
    category: 'Content Cards',
    hierarchyLevel: 'Molecule',
    purpose: 'Compact metadata block summarizing salon telephone, street address, operating status, and quick WhatsApp link.',
    props: [
      { name: 'name', type: 'string', required: true, description: 'Business name.' },
      { name: 'category', type: 'string', required: true, description: 'Category label.' },
      { name: 'address', type: 'string', required: true, description: 'Physical address.' },
      { name: 'phone', type: 'string', required: true, description: 'Telephone number.' }
    ],
    variants: [
      { name: 'Compact Block', description: 'Icon + text metadata rows.' }
    ],
    states: [
      { name: 'Default', visualSpec: 'Structured metadata list.' }
    ],
    desktopBehavior: 'Fits sidebar or footer column.',
    tabletBehavior: 'Compact horizontal row.',
    mobileBehavior: 'Stacked block with tap-to-call buttons.',
    accessibilityRequirements: [
      'Accessible telephone links with aria-label="Call salon at [phone number]".'
    ],
    categoryCustomization: 'Category badge matches theme.'
  },

  // 20. SocialLinks
  {
    id: 'social-links',
    name: 'SocialLinks',
    category: 'Primitives',
    hierarchyLevel: 'Atom',
    purpose: 'Row of social media links (Instagram portfolio, WhatsApp chat, Facebook, YouTube).',
    props: [
      { name: 'links', type: 'Array<{ platform: string; url: string }>', required: true, description: 'Social profiles.' }
    ],
    variants: [
      { name: 'Icon Circles', description: 'Circular 36px icon buttons with subtle hover lift.' }
    ],
    states: [
      { name: 'Default', visualSpec: 'Bg-slate-100 text-slate-700.' },
      { name: 'Hover', visualSpec: 'Bg-slate-900 text-white.' }
    ],
    desktopBehavior: 'Horizontal row with 8px gap.',
    tabletBehavior: 'Horizontal row.',
    mobileBehavior: 'Centered row with minimum 44px tap targets.',
    accessibilityRequirements: [
      'Each link has explicit aria-label="Follow [Salon Name] on [Platform] (opens in new tab)".',
      'Uses rel="noopener noreferrer".'
    ],
    categoryCustomization: 'Tattoo Studio prioritizes Instagram portfolio link; Hair Salon prioritizes WhatsApp bookings.'
  },

  // 21. Footer
  {
    id: 'footer',
    name: 'Footer',
    category: 'Navigation & Layout',
    hierarchyLevel: 'Organism',
    purpose: 'Site-wide closing block with business brand, quick navigation links, opening hours, GSTIN disclosure, and platform branding.',
    props: [
      { name: 'salonName', type: 'string', required: true, description: 'Business display name.' },
      { name: 'category', type: 'string', required: true, description: 'Salon niche.' },
      { name: 'copyrightYear', type: 'number', required: true, description: 'Current year.' },
      { name: 'gstin', type: 'string', required: false, description: 'Merchant tax ID.' },
      { name: 'socialLinks', type: 'Array<{ platform: string; url: string }>', required: false, description: 'Social links.' }
    ],
    variants: [
      { name: 'Standard 4-Column', description: 'Brand summary, Quick Links, Hours, and Legal notes.' }
    ],
    states: [
      { name: 'Default', visualSpec: 'Dark slate background (neutral-900), text-neutral-400, border-t border-slate-800.' }
    ],
    desktopBehavior: '4-column balanced grid with bottom legal disclaimer bar.',
    tabletBehavior: '2-column grid.',
    mobileBehavior: 'Single-column stacked list with centered copyright and social icons.',
    accessibilityRequirements: [
      'Uses semantic <footer> tag.',
      'Navigation links grouped inside <nav aria-label="Footer Navigation">.'
    ],
    categoryCustomization: 'Footer displays category-specific disclaimers (e.g. Tattoo Studio: "Must be 18+ with government ID").'
  },

  // 22. BookNowButton
  {
    id: 'book-now-button',
    name: 'BookNowButton',
    category: 'Primitives',
    hierarchyLevel: 'Atom',
    purpose: 'Primary conversion button engineered with WCAG 2.2 AA compliant focus ring, touch target, and mobile sticky capabilities.',
    props: [
      { name: 'label', type: 'string', required: false, defaultValue: 'Book Appointment', description: 'Button text.' },
      { name: 'variant', type: "'primary' | 'secondary' | 'sticky-bottom-bar'", required: false, defaultValue: 'primary', description: 'Style variant.' },
      { name: 'onClick', type: '() => void', required: true, description: 'Click trigger.' },
      { name: 'categoryTheme', type: 'string', required: false, description: 'Theme override.' }
    ],
    variants: [
      { name: 'Primary Accent', description: 'Filled with category theme primary color.' },
      { name: 'Sticky Bottom Bar', description: 'Full mobile screen width fixed at bottom of viewport (z-index 40).' }
    ],
    states: [
      { name: 'Default', visualSpec: 'Solid high-contrast button.' },
      { name: 'Hover', visualSpec: 'Brightness 95%, subtle -1px translateY.' },
      { name: 'Focus', visualSpec: '2px solid theme ring with 2px white offset.' }
    ],
    desktopBehavior: 'Height 44px, horizontal padding 24px, hover elevation.',
    tabletBehavior: 'Height 44px, full width or auto width.',
    mobileBehavior: 'Height 48px (Touch Target Rule), sticky bottom bar anchored at viewport bottom with safe-area padding.',
    accessibilityRequirements: [
      'Minimum touch target 48px on mobile.',
      'Contrast ratio > 4.5:1 on button text.'
    ],
    categoryCustomization: 'Button curvature dynamically inherits category token (Sharp Box for Barber/Tattoo, Solid Pill for Nail/Beauty).'
  },

  // 23. PriceDisplay
  {
    id: 'price-display',
    name: 'PriceDisplay',
    category: 'Primitives',
    hierarchyLevel: 'Atom',
    purpose: 'Standardized currency display rendering full service price, advance deposit percentage, and remaining in-salon balance.',
    props: [
      { name: 'totalAmount', type: 'number', required: true, description: 'Total price in INR.' },
      { name: 'advancePercent', type: 'number', required: true, description: 'Advance deposit percentage e.g. 25%.' },
      { name: 'showBreakdown', type: 'boolean', required: false, defaultValue: 'true', description: 'Shows advance vs salon split.' },
      { name: 'currencySymbol', type: 'string', required: false, defaultValue: '₹', description: 'Currency symbol.' }
    ],
    variants: [
      { name: 'Compact', description: '₹1,000 with small caption "(₹250 advance)".' },
      { name: 'Detailed Ledger', description: '3-line breakdown: Total Fee, Advance Deposit, Balance at Salon.' }
    ],
    states: [
      { name: 'Default', visualSpec: 'Tabular numerals for vertical digit alignment.' }
    ],
    desktopBehavior: 'Tabular numerals aligned horizontally.',
    tabletBehavior: 'Tabular numerals.',
    mobileBehavior: 'Stacked tabular figures with clear advance deposit highlight in emerald/amber.',
    accessibilityRequirements: [
      'Accessible label: "Total price: 1,000 rupees. Advance deposit payable now: 250 rupees. Remaining balance: 750 rupees payable at salon".'
    ],
    categoryCustomization: 'Advance percentage rule applies uniformly across all 10 categories.'
  },

  // 24. RatingDisplay
  {
    id: 'rating-display',
    name: 'RatingDisplay',
    category: 'Primitives',
    hierarchyLevel: 'Atom',
    purpose: 'Standardized star rating and review count badge.',
    props: [
      { name: 'score', type: 'number', required: true, description: 'Rating score (e.g. 4.9).' },
      { name: 'reviewCount', type: 'number', required: false, description: 'Total reviews count (e.g. 340).' },
      { name: 'size', type: "'sm' | 'md'", required: false, defaultValue: 'sm', description: 'Glyph size.' }
    ],
    variants: [
      { name: 'Star Pill Badge', description: 'Single gold star icon with numeric score and review count in parentheses.' }
    ],
    states: [
      { name: 'Default', visualSpec: 'Amber star icon + bold score number.' }
    ],
    desktopBehavior: 'Inline pill badge.',
    tabletBehavior: 'Inline pill badge.',
    mobileBehavior: 'Inline compact badge.',
    accessibilityRequirements: [
      'Screen reader announced: "Rated 4.9 stars out of 5 based on 340 verified customer reviews".'
    ],
    categoryCustomization: 'Golden star icon is universal across all categories.'
  },

  // 25. Breadcrumb
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    category: 'Navigation & Layout',
    hierarchyLevel: 'Molecule',
    purpose: 'Secondary hierarchical path indicator for subpages (e.g. Home > Services > Haircuts & Fades).',
    props: [
      { name: 'items', type: 'Array<{ label: string; href?: string }>', required: true, description: 'Path steps.' }
    ],
    variants: [
      { name: 'Slash Separator', description: 'Clean text links with "/" divider rules.' }
    ],
    states: [
      { name: 'Default', visualSpec: 'text-neutral-500, active item text-neutral-900 font-medium.' }
    ],
    desktopBehavior: 'Full path visible.',
    tabletBehavior: 'Full path visible.',
    mobileBehavior: 'Truncates intermediate steps or displays back link: "← Services".',
    accessibilityRequirements: [
      'Uses <nav aria-label="Breadcrumb"> with <ol> and <li> items.',
      'Current page item has aria-current="page".'
    ],
    categoryCustomization: 'Matches category typography.'
  }
];

// 2. POLYMORPHIC CATEGORY BEHAVIOR (Same ServiceCard, 4 Distinct Niches)
export const POLYMORPHIC_SERVICE_CARDS: CategoryCardAdaptation[] = [
  {
    category: 'Barber Shop',
    serviceTitle: 'Executive Beard Sculpt & Hot Towel Finish',
    categoryBadge: 'Heritage Grooming',
    duration: '45 mins',
    price: 900,
    advancePercentage: 25,
    advanceAmount: 225,
    remainingAmount: 675,
    accentColor: '#1E293B',
    borderRadius: 'rounded-md',
    buttonStyle: 'Sharp Box (radius.sm 4px)',
    specialMetadataTag: 'Includes Straight Razor Lineup & Organic Beard Balm',
    description: 'Precision clipper fade, hot lather straight-edge contouring, finished with eucalyptus steam towel.'
  },
  {
    category: 'Luxury Spa',
    serviceTitle: 'Swedish Aromatherapy & Hot Herbal Compress',
    categoryBadge: 'Holistic Bodywork',
    duration: '75 mins',
    price: 2400,
    advancePercentage: 25,
    advanceAmount: 600,
    remainingAmount: 1800,
    accentColor: '#0F766E',
    borderRadius: 'rounded-2xl',
    buttonStyle: 'Soft Rounded (radius.lg 12px)',
    specialMetadataTag: 'Organic Eucalyptus & Lavender Botanical Oils',
    description: 'Rhythmic long strokes relieving chronic tension, enhanced with steamed mineral herbal poultices.'
  },
  {
    category: 'Nail Studio',
    serviceTitle: 'Sculpted Gel Extensions & Chrome Statement Art',
    categoryBadge: 'Signature Nail Art',
    duration: '60 mins',
    price: 1600,
    advancePercentage: 25,
    advanceAmount: 400,
    remainingAmount: 1200,
    accentColor: '#7C3AED',
    borderRadius: 'rounded-xl',
    buttonStyle: 'Solid Pill (radius.full 9999px)',
    specialMetadataTag: 'Includes Cuticle Care & Diamond High-Gloss Topcoat',
    description: 'Custom hard-gel extension sculpting with bespoke chrome pigment powder and hand-painted nail accents.'
  },
  {
    category: 'Tattoo Studio',
    serviceTitle: 'Custom Fine-Line & Sacred Geometry Piece',
    categoryBadge: 'Custom Ink Session',
    duration: '120 mins',
    price: 5000,
    advancePercentage: 25,
    advanceAmount: 1250,
    remainingAmount: 3750,
    accentColor: '#18181B',
    borderRadius: 'rounded-none',
    buttonStyle: 'Sharp Box (radius.none 0px)',
    specialMetadataTag: 'Single-Use Needle Cartridge & Vegan Carbon Black Ink',
    description: 'Bespoke fine-line tattoo illustration crafted to client anatomy with single-needle stippling.'
  }
];

// 3. PUBLIC WEBSITE NAVIGATION SYSTEM
export const PUBLIC_NAV_SPEC = {
  links: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Packages', href: '/packages' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'My Bookings', href: '/my-bookings' }
  ],
  auth: {
    signIn: { label: 'Sign In', href: '/auth/signin' },
    signUp: { label: 'Sign Up', href: '/auth/signup' }
  },
  cta: {
    label: 'Book Now',
    action: 'Opens Mobile Booking Drawer or navigates to /book'
  },
  desktopBehavior: 'Horizontal 68px header: Logo left -> 7 nav links center -> Sign In / Sign Up + Book Now CTA right.',
  mobileBehavior: 'Header (60px): Logo left -> Phone call icon -> Hamburger trigger. Clicking opens full-viewport MobileMenu drawer containing all 7 links, auth buttons, and contact links. A persistent sticky bottom Book Now bar anchors conversion.'
};
