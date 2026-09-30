// Nexora SalonOS — Phase 2.3 Public Website Page Design Data

export interface PageSpecification {
  id: string;
  name: string;
  route: string;
  purpose: string;
  primaryUser: string;
  pageHeader: string;
  layoutStructure: string[];
  componentsUsed: string[];
  desktopLayout: string;
  mobileLayout: string;
  dataContract: string[];
  emptyState: string;
  errorState: string;
}

export interface HomeSectionSpec {
  sectionNumber: number;
  name: string;
  purpose: string;
  content: string;
  cta: string;
  componentUsed: string;
  desktopLayout: string;
  mobileLayout: string;
}

export interface CategoryHomePersonalization {
  categoryId: string;
  categoryName: string;
  tagline: string;
  terminology: {
    serviceLabel: string;
    packageLabel: string;
    staffLabel: string;
    bookingAction: string;
  };
  heroHeadline: string;
  heroSubheadline: string;
  featuredServices: Array<{ name: string; duration: string; price: number; advance: number }>;
  featuredPackages: Array<{ name: string; duration: string; price: number; originalPrice: number }>;
  staffRoles: string[];
  galleryThemes: string[];
  themeTokens: {
    accentColor: string;
    borderRadius: string;
    buttonStyle: string;
    heroStyle: string;
  };
}

// 1. ALL 9 PUBLIC PAGES SPECIFICATIONS
export const PUBLIC_PAGES_9: PageSpecification[] = [
  // Page 1: Home
  {
    id: 'page-home',
    name: '1. Home Page',
    route: '/',
    purpose: 'Primary storefront and conversion funnel introducing the salon vibe, trust markers, featured treatments, specialist master team, lookbook gallery, and booking CTA.',
    primaryUser: 'First-time visitors & recurring salon clients',
    pageHeader: 'Persistent Navbar with announcement banner',
    layoutStructure: [
      '1. AnnouncementBar',
      '2. Navbar',
      '3. Hero',
      '4. Featured Services',
      '5. Featured Packages',
      '6. About & Story',
      '7. Staff Specialists',
      '8. Gallery Lookbook',
      '9. Testimonials',
      '10. Booking CTA Banner',
      '11. Contact & Map',
      '12. Footer'
    ],
    componentsUsed: ['AnnouncementBar', 'Navbar', 'Hero', 'SectionHeader', 'ServiceCard', 'PackageCard', 'StaffCard', 'GalleryGrid', 'TestimonialCard', 'BookingCTA', 'ContactSection', 'Footer'],
    desktopLayout: 'Structured 12-column vertical narrative with 80px section padding, alternating white and soft neutral-50 backgrounds, and max-width 1280px containers.',
    mobileLayout: 'Single-column progressive disclosure flow with 48px vertical section spacing, horizontal scroll snap galleries, and persistent sticky bottom "Book Appointment" CTA bar.',
    dataContract: ['Salon profile', 'Operating hours', 'Featured services array', 'Package bundles array', 'Active staff array', 'Lookbook media', 'Verified reviews', 'Location pin'],
    emptyState: 'Fallbacks to category default seed data when merchant has not uploaded custom images.',
    errorState: 'Offline toast alert with cached salon contact telephone and address.'
  },

  // Page 2: Services
  {
    id: 'page-services',
    name: '2. Services Menu Page',
    route: '/services',
    purpose: 'Complete searchable catalog of treatments and grooming offerings categorized with price, duration, advance deposit rules, and direct book action.',
    primaryUser: 'Clients looking to browse full menu or specific treatment',
    pageHeader: 'SectionHeader: "Our Treatment & Service Menu" + Breadcrumbs',
    layoutStructure: [
      '1. AnnouncementBar',
      '2. Navbar',
      '3. Breadcrumb (Home > Services)',
      '4. Category Filter Tabs (e.g. Cuts, Shaves, Color, Treatments)',
      '5. Search & Filter Bar',
      '6. ServiceGrid (3-column responsive grid)',
      '7. BookingCTA Banner',
      '8. Footer'
    ],
    componentsUsed: ['Navbar', 'Breadcrumb', 'SectionHeader', 'GalleryFilter', 'ServiceCard', 'ServiceGrid', 'PriceDisplay', 'BookNowButton', 'BookingCTA', 'Footer'],
    desktopLayout: 'Sticky left category anchor sidebar or top pill filter; 3-column ServiceGrid with 24px gap.',
    mobileLayout: 'Horizontal sticky category filter chip strip with search bar; 1-column full-width ServiceCard list.',
    dataContract: ['All services grouped by category', 'Duration minutes', 'Total price', 'Advance deposit percentage', 'Treatment notes'],
    emptyState: 'Empty state illustration: "No treatments match your search filter" + Reset Filters button.',
    errorState: 'Inline banner: "Unable to refresh service catalog. Please call salon directly."'
  },

  // Page 3: Packages
  {
    id: 'page-packages',
    name: '3. Packages & Rituals Page',
    route: '/packages',
    purpose: 'Showcases curated multi-service rituals, bridal bundles, and seasonal rejuvenation packages with bundled savings transparency.',
    primaryUser: 'Clients seeking comprehensive transformations or value bundles',
    pageHeader: 'SectionHeader: "Curated Rituals & Bundles" + Breadcrumbs',
    layoutStructure: [
      '1. Navbar',
      '2. Breadcrumb (Home > Packages)',
      '3. SectionHeader',
      '4. PackageGrid (2 or 3-column arrangement)',
      '5. Value Proposition Infographic (Why Book a Bundle?)',
      '6. BookingCTA Banner',
      '7. Footer'
    ],
    componentsUsed: ['Navbar', 'Breadcrumb', 'SectionHeader', 'PackageCard', 'PackageGrid', 'PriceDisplay', 'BookNowButton', 'BookingCTA', 'Footer'],
    desktopLayout: '3-column grid for packages with highlighted "Most Popular" center card; savings badges emphasized.',
    mobileLayout: '1-column stacked cards with collapsible checklist of included treatments.',
    dataContract: ['Package ID, name, list of included services, combined duration, bundle price, original price, advance percent'],
    emptyState: 'Card: "Custom seasonal packages coming soon. Explore our individual services."',
    errorState: 'Error alert with retry button.'
  },

  // Page 4: Gallery
  {
    id: 'page-gallery',
    name: '4. Gallery / Lookbook Page',
    route: '/gallery',
    purpose: 'High-resolution visual showcase of client transformations, nail art collections, tattoo pieces, and interior salon atmosphere with category filters.',
    primaryUser: 'Visual-first clients exploring styles, inspiration, and craft quality',
    pageHeader: 'SectionHeader: "Lookbook & Portfolio" + Breadcrumbs',
    layoutStructure: [
      '1. Navbar',
      '2. Breadcrumb (Home > Gallery)',
      '3. SectionHeader',
      '4. GalleryFilter Chips (Hair, Beard, Nails, Color, Interior)',
      '5. GalleryGrid (Masonry or 1:1 Square Grid)',
      '6. Lightbox Modal Preview (on photo click)',
      '7. BookingCTA Banner',
      '8. Footer'
    ],
    componentsUsed: ['Navbar', 'Breadcrumb', 'SectionHeader', 'GalleryFilter', 'GalleryGrid', 'BookingCTA', 'Footer'],
    desktopLayout: '4-column editorial masonry grid with smooth zoom hover effect and caption overlay.',
    mobileLayout: '2-column compact grid with 8px gap; single-tap expands to full-screen lightbox modal.',
    dataContract: ['Image media URLs, high-res previews, caption description, tag category, staff artist credit'],
    emptyState: 'Skeleton loading boxes; fallback placeholder grid.',
    errorState: 'Failed image tile with retry reload icon.'
  },

  // Page 5: About
  {
    id: 'page-about',
    name: '5. About & Philosophy Page',
    route: '/about',
    purpose: 'Communicates the salon brand history, hygiene standards, master craft philosophy, certified products used, and team culture.',
    primaryUser: 'Quality-conscious customers vetting the business credibility',
    pageHeader: 'SectionHeader: "Our Story & Craft" + Breadcrumbs',
    layoutStructure: [
      '1. Navbar',
      '2. Breadcrumb (Home > About)',
      '3. Brand Story Hero Banner',
      '4. 3 Core Pillars (Hygiene, Craftsmanship, Organic Products)',
      '5. StaffGrid (Full team directory with certifications)',
      '6. Hygiene & Safety Protocol Disclosures',
      '7. BookingCTA Banner',
      '8. Footer'
    ],
    componentsUsed: ['Navbar', 'Breadcrumb', 'SectionHeader', 'StaffCard', 'StaffGrid', 'BookingCTA', 'Footer'],
    desktopLayout: '2-column split story layout (Founder portrait left, narrative right); 4-column team grid; 3-column trust badge row.',
    mobileLayout: 'Single-column stacked story with swipeable specialist team cards.',
    dataContract: ['Salon bio text, founded year, founder photo, brand values, safety certifications, staff roster'],
    emptyState: 'Default brand statement seed.',
    errorState: 'Clean fallback layout.'
  },

  // Page 6: Contact
  {
    id: 'page-contact',
    name: '6. Contact & Location Page',
    route: '/contact',
    purpose: 'Physical discovery and communication hub containing interactive map, address, transit directions, telephone, WhatsApp chat, and 7-day schedule.',
    primaryUser: 'Clients booking appointments, finding directions, or calling with questions',
    pageHeader: 'SectionHeader: "Visit Our Salon" + Breadcrumbs',
    layoutStructure: [
      '1. Navbar',
      '2. Breadcrumb (Home > Contact)',
      '3. SectionHeader',
      '4. ContactSection (50/50 Map & Details)',
      '5. OpeningHours Card (7-day schedule with live status)',
      '6. Parking & Landmark Instructions',
      '7. Quick Inquiries Form (Name, Phone, Note)',
      '8. Footer'
    ],
    componentsUsed: ['Navbar', 'Breadcrumb', 'SectionHeader', 'ContactSection', 'OpeningHours', 'BusinessInfo', 'SocialLinks', 'Footer'],
    desktopLayout: '2-column split (Left: Interactive Map + Directions; Right: Contact cards, OpeningHours, and quick message form).',
    mobileLayout: 'Instant one-tap Call and WhatsApp buttons at top; followed by address, hours accordion, and map underneath.',
    dataContract: ['Street address, GPS coordinates, phone number, WhatsApp link, opening hours array, landmark notes'],
    emptyState: 'Static address text with Google Maps search link fallback.',
    errorState: 'Click-to-call phone remains prominently clickable even if map script fails.'
  },

  // Page 7: My Bookings
  {
    id: 'page-my-bookings',
    name: '7. My Bookings Page',
    route: '/my-bookings',
    purpose: 'Customer portal to view active appointments, download digital QR boarding passes, verify advance deposits paid, and reschedule or cancel.',
    primaryUser: 'Returning customer checking appointment details',
    pageHeader: 'Page Title: "My Appointments & Passes" + Filter Tabs',
    layoutStructure: [
      '1. Navbar',
      '2. Breadcrumb (Home > My Bookings)',
      '3. Tabs: "Upcoming Bookings" | "Past History"',
      '4. Active Booking Cards (QR code pass, service, specialist, time, advance paid, balance due)',
      '5. Action Triggers: "Add to Calendar", "Reschedule", "Get Directions"',
      '6. Cancellation Policy Summary Notice',
      '7. Footer'
    ],
    componentsUsed: ['Navbar', 'Breadcrumb', 'SectionHeader', 'PriceDisplay', 'BookNowButton', 'Footer'],
    desktopLayout: '2-column layout: Upcoming pass card on left (with QR code and calendar sync); past booking history table on right.',
    mobileLayout: 'Digital mobile pass card format with one-tap "Add to Apple/Google Wallet" and WhatsApp reminder button.',
    dataContract: ['Booking ID, service name, specialist, date, time slot, advance amount paid, remaining balance, booking status'],
    emptyState: 'Card: "No upcoming bookings found. Ready for your next styling session?" + [Book Appointment Now] CTA.',
    errorState: 'Notice: "Could not retrieve bookings. Please enter your mobile number to receive verification code."'
  },

  // Page 8: Sign In
  {
    id: 'page-sign-in',
    name: '8. Customer Sign In Page',
    route: '/auth/signin',
    purpose: 'Fast, passwordless mobile-first customer authentication via OTP or Google to access bookings and stored preferences.',
    primaryUser: 'Existing client signing into account',
    pageHeader: 'Clean Minimal Top Bar with salon logo',
    layoutStructure: [
      '1. Salon Branding Icon & Title',
      '2. Auth Card: "Welcome Back"',
      '3. Mobile Number Input with Country Code (+91)',
      '4. [Get OTP] Primary Button',
      '5. 6-Digit OTP Verification Field (when triggered)',
      '6. Google One-Tap Sign In shortcut',
      '7. Switcher: "New client? Create account"',
      '8. Minimal Legal Disclaimers (Terms & Privacy)'
    ],
    componentsUsed: ['BookNowButton', 'BusinessInfo'],
    desktopLayout: 'Centered auth card (max-width 420px) on clean neutral-50 canvas with subtle shadow.sm and salon logo.',
    mobileLayout: 'Full viewport mobile screen with numeric keyboard auto-focus on phone input; 48px touch CTA button.',
    dataContract: ['Phone number, OTP token, session status'],
    emptyState: 'Ready state with country code preset to +91.',
    errorState: 'Red inline alert: "Invalid OTP code. Please request a new code."'
  },

  // Page 9: Sign Up
  {
    id: 'page-sign-up',
    name: '9. Customer Sign Up Page',
    route: '/auth/signup',
    purpose: 'Seamless 3-field customer registration creating profile for fast one-tap bookings and digital receipt delivery.',
    primaryUser: 'New salon customer creating profile',
    pageHeader: 'Clean Minimal Top Bar with salon logo',
    layoutStructure: [
      '1. Salon Branding Icon & Title',
      '2. Registration Card: "Create Your Account"',
      '3. Full Name Input',
      '4. Mobile Number Input (+91)',
      '5. Optional Email Address (for calendar invites & tax receipts)',
      '6. [Create Account & Continue] Primary CTA',
      '7. Switcher: "Already have an account? Sign in"',
      '8. Terms of Service & Cancellation Policy acceptance'
    ],
    componentsUsed: ['BookNowButton'],
    desktopLayout: 'Centered card (max-width 440px) with salon branding at top and 1px border neutral-200.',
    mobileLayout: 'Single-column form inputs with 48px minimum height and clear focus rings.',
    dataContract: ['Name, phone, email, policy acceptance boolean'],
    emptyState: 'Fresh registration form.',
    errorState: 'Field validation error: "Please enter your 10-digit mobile number".'
  }
];

// 2. THE 12-SECTION HOME PAGE BLUEPRINT
export const HOME_PAGE_12_SECTIONS: HomeSectionSpec[] = [
  {
    sectionNumber: 1,
    name: 'AnnouncementBar',
    purpose: 'Global top notification strip highlighting immediate value, booking policy, or holiday operational notice.',
    content: 'Headline banner text: "Weekend slots fill 48 hours in advance. Reserve online with 25% deposit to secure your chair."',
    cta: 'Text link: "View Available Slots →"',
    componentUsed: 'AnnouncementBar',
    desktopLayout: 'Single centered inline 36px bar with high-contrast text and dismiss cross on right.',
    mobileLayout: '2 wrapped text lines, compact 11px font, sticky at top.'
  },
  {
    sectionNumber: 2,
    name: 'Navbar',
    purpose: 'Primary navigation and persistent brand controller across the entire browsing session.',
    content: 'Salon logo glyph, business name, operating hours badge ("Open Today until 9 PM"), and 7 primary routes.',
    cta: 'Primary action: [Book Now] button (desktop) + [Sign In] text link.',
    componentUsed: 'Navbar',
    desktopLayout: 'Horizontal 68px header bar with logo left, navigation center, auth & Book Now button right.',
    mobileLayout: '60px top bar with logo left, telephone call icon and hamburger menu trigger right.'
  },
  {
    sectionNumber: 3,
    name: 'Hero',
    purpose: 'Above-the-fold brand anchor capturing salon ambiance, rating credibility, and immediate booking intention.',
    content: 'Category badge (e.g. "Bespoke Grooming Lounge"), high-impact H1 title, subheadline, and verified 4.9★ rating badge.',
    cta: 'Dual buttons: Primary [Book Appointment Now] + Secondary [Explore Rituals Menu].',
    componentUsed: 'Hero',
    desktopLayout: 'Side-by-side 50/50 split grid (min-height 520px): Copy left, hero photography with floating rating badge right.',
    mobileLayout: 'Single stacked column: Badge, H1 (28px), subtext, dual full-width buttons, and imagery underneath.'
  },
  {
    sectionNumber: 4,
    name: 'Featured Services',
    purpose: 'Showcases top 3 to 6 high-demand salon treatments with transparent advance deposit pricing.',
    content: 'Section title "Signature Treatments", category filter chips, and 3 to 6 ServiceCards with duration and pricing.',
    cta: 'ServiceCard CTA: [Select Service] + Bottom link [View Full Treatment Menu →].',
    componentUsed: 'SectionHeader + ServiceCard + ServiceGrid',
    desktopLayout: 'SectionHeader centered + 3-column grid with 24px gap between ServiceCards.',
    mobileLayout: 'SectionHeader left-aligned + 1-column stacked list of full-width ServiceCards.'
  },
  {
    sectionNumber: 5,
    name: 'Featured Packages',
    purpose: 'Promotes bundled multi-service rituals offering combined treatment time and bundled savings.',
    content: 'Title "Curated Rituals & Bundles", savings tags (e.g. "Save ₹400"), and checklist of included services.',
    cta: 'PackageCard action: [Book Ritual Bundle].',
    componentUsed: 'SectionHeader + PackageCard + PackageGrid',
    desktopLayout: '3-column grid (or 2-column wide layout) with center package highlighted with theme accent border.',
    mobileLayout: '1-column stacked package cards with horizontal pill chips for included services.'
  },
  {
    sectionNumber: 6,
    name: 'About & Story',
    purpose: 'Establishes craftsmanship credentials, master qualifications, hygiene rigor, and salon philosophy.',
    content: 'Salon narrative, founding year, 3 trust pillars (Certified Stylists, Hospital-Grade Sterilization, Organic Products).',
    cta: 'Secondary link: [Learn More About Our Philosophy →].',
    componentUsed: 'SectionHeader + Custom Layout Blocks',
    desktopLayout: '2-column split (Left: Ambiance & craft photography; Right: Editorial narrative with 3 trust badges).',
    mobileLayout: 'Stacked single column: Narrative text first, followed by trust icon badges, and photo underneath.'
  },
  {
    sectionNumber: 7,
    name: 'Staff Specialists',
    purpose: 'Introduces the master stylists, massage therapists, or tattoo artists to foster client trust.',
    content: 'Portraits of master specialists, role titles (Senior Stylist), specialties, and live "Available Today" green dots.',
    cta: 'StaffCard action: [Book with Specialist].',
    componentUsed: 'SectionHeader + StaffCard + StaffGrid',
    desktopLayout: '4-column balanced specialist grid with hover elevation.',
    mobileLayout: 'Horizontal swipe carousel with scroll snap points (width 260px per card).'
  },
  {
    sectionNumber: 8,
    name: 'Gallery Lookbook',
    purpose: 'Visual proof of transformation quality, creative styles, and salon interior atmosphere.',
    content: 'Curated 6 to 8 photos of recent haircuts, nail art sets, spa treatment suites, or tattoo ink pieces.',
    cta: 'Bottom text link: [Explore Full Lookbook Portfolio →].',
    componentUsed: 'SectionHeader + GalleryGrid',
    desktopLayout: '4-column masonry grid with hover caption slide-up.',
    mobileLayout: '2-column compact square tile grid with 8px gap.'
  },
  {
    sectionNumber: 9,
    name: 'Testimonials',
    purpose: 'Provides social proof from verified clients who completed services at the venue.',
    content: 'Customer names, star rating scores, verified service tags (e.g. "Skin Fade & Beard Trim"), and review quotes.',
    cta: 'Navigation controls: Previous / Next review arrows.',
    componentUsed: 'SectionHeader + TestimonialCard + TestimonialSlider',
    desktopLayout: '3-column balanced testimonial cards with subtle 1px border.',
    mobileLayout: 'Single swipeable card slider with pagination indicator dots.'
  },
  {
    sectionNumber: 10,
    name: 'Booking CTA Banner',
    purpose: 'Final conversion hook positioned above footer ensuring visitors reserve before leaving.',
    content: 'Bold title: "Ready for your transformation?", subtitle highlighting weekend demand and instant 60-second booking.',
    cta: 'Primary high-contrast button: [Book Appointment Now].',
    componentUsed: 'BookingCTA',
    desktopLayout: 'Full-width rounded banner container with headline left and prominent button right (height 48px).',
    mobileLayout: 'Stacked container with full-width action button (height 48px) with safe-area spacing.'
  },
  {
    sectionNumber: 11,
    name: 'Contact & Map',
    purpose: 'Physical navigation assistance providing street address, landmarks, parking notes, and telephone.',
    content: 'Interactive map container, street address, telephone, email, WhatsApp link, and opening schedule.',
    cta: 'Dual actions: [Call Salon Directly] and [Get Directions on Google Maps].',
    componentUsed: 'ContactSection + OpeningHours + BusinessInfo',
    desktopLayout: '50/50 side-by-side grid (Map on left, contact cards and opening hours on right).',
    mobileLayout: 'One-tap Call and Navigate buttons at top, followed by address text and map underneath.'
  },
  {
    sectionNumber: 12,
    name: 'Footer',
    purpose: 'Site-wide closing block with business brand, quick links, category disclaimer, copyright, and platform branding.',
    content: 'Brand summary, quick navigation links, weekly hours summary, GSTIN tax disclosure, and platform branding.',
    cta: 'Social links (Instagram, WhatsApp, Facebook) + [Back to Top] trigger.',
    componentUsed: 'Footer + SocialLinks',
    desktopLayout: '4-column balanced grid with bottom legal disclaimer bar.',
    mobileLayout: 'Single-column stacked list with centered copyright and social icons.'
  }
];

// 3. CATEGORY PERSONALIZATION MATRIX (7 Categories Across Identical 12 Sections)
export const CATEGORY_HOME_PERSONALIZATIONS: CategoryHomePersonalization[] = [
  // 1. Barber
  {
    categoryId: 'barber',
    categoryName: 'Barber Shop',
    tagline: 'Timeless Grooming & Precision Cuts',
    terminology: {
      serviceLabel: 'Haircuts & Shaves',
      packageLabel: 'Grooming Rituals',
      staffLabel: 'Master Barbers',
      bookingAction: 'Reserve Chair'
    },
    heroHeadline: 'Master Cuts, Hot Lather & Timeless Precision',
    heroSubheadline: 'Experience classic craftsmanship with modern barbering. Hot towel finish and razor fade included with every haircut.',
    featuredServices: [
      { name: 'Signature Skin Fade & Scissor Cut', duration: '35 mins', price: 650, advance: 162 },
      { name: 'Traditional Hot Towel Straight Razor Shave', duration: '30 mins', price: 450, advance: 112 },
      { name: 'Beard Sculpting & Lather Contour', duration: '25 mins', price: 400, advance: 100 }
    ],
    featuredPackages: [
      { name: 'The Executive Ritual (Cut + Shave + Scalp Massage)', duration: '75 mins', price: 1200, originalPrice: 1500 },
      { name: 'Father & Son Grooming Session', duration: '60 mins', price: 1100, originalPrice: 1300 }
    ],
    staffRoles: ['Master Barber', 'Senior Fade Specialist', 'Traditional Shave Artisan'],
    galleryThemes: ['Skin Fades', 'Beard Styling', 'Vintage Chair Ambiance'],
    themeTokens: {
      accentColor: '#1E293B',
      borderRadius: 'rounded-md',
      buttonStyle: 'Sharp Box (radius.sm 4px)',
      heroStyle: 'Split 50/50'
    }
  },

  // 2. Hair Salon
  {
    categoryId: 'hair-salon',
    categoryName: 'Hair Salon',
    tagline: 'Artistry in Color, Cuts & Styling',
    terminology: {
      serviceLabel: 'Hair & Styling Services',
      packageLabel: 'Couture Packages',
      staffLabel: 'Senior Stylists & Colorists',
      bookingAction: 'Book Appointment'
    },
    heroHeadline: 'Couture Hair Color, Precision Balayage & Bespoke Styling',
    heroSubheadline: 'Tailored hair transformations designed for your lifestyle. High-definition color artistry with luxury Olaplex bond repair.',
    featuredServices: [
      { name: 'Custom Balayage & Tonal Gloss', duration: '120 mins', price: 3800, advance: 950 },
      { name: 'Precision Cut & Blowout Sculpture', duration: '45 mins', price: 1200, advance: 300 },
      { name: 'Keratin Deep Moisture Rebuilding', duration: '90 mins', price: 2900, advance: 725 }
    ],
    featuredPackages: [
      { name: 'The Total Glow (Balayage + Treatment + Cut)', duration: '180 mins', price: 5400, originalPrice: 6500 },
      { name: 'Bridal Trial & Styling Masterclass', duration: '90 mins', price: 3200, originalPrice: 4000 }
    ],
    staffRoles: ['Creative Hair Director', 'Senior Master Colorist', 'Texture & Extension Specialist'],
    galleryThemes: ['Balayage Transformations', 'Editorial Blowouts', 'Vibrant Vivids'],
    themeTokens: {
      accentColor: '#BE185D',
      borderRadius: 'rounded-xl',
      buttonStyle: 'Soft Rounded (radius.lg 12px)',
      heroStyle: 'Editorial Asymmetric'
    }
  },

  // 3. Beauty Parlour
  {
    categoryId: 'beauty',
    categoryName: 'Beauty Parlour',
    tagline: 'Glow, Rejuvenate & Radiate',
    terminology: {
      serviceLabel: 'Skin & Beauty Treatments',
      packageLabel: 'Bridal & Glow Rituals',
      staffLabel: 'Beauty Therapists',
      bookingAction: 'Reserve Session'
    },
    heroHeadline: 'Radiant Skin Rituals, Hydrafacial & Bespoke Beauty Care',
    heroSubheadline: 'Nurture your natural glow with organic botanical facials and gentle restorative skin treatments.',
    featuredServices: [
      { name: 'Deep Hydra-Infusion Facial', duration: '60 mins', price: 1800, advance: 450 },
      { name: 'Full Arms & Legs Organic Waxing', duration: '45 mins', price: 900, advance: 225 },
      { name: 'Gold Radiance Skin Polish', duration: '45 mins', price: 1400, advance: 350 }
    ],
    featuredPackages: [
      { name: 'Pre-Bridal Golden Glow Package', duration: '150 mins', price: 4200, originalPrice: 5200 },
      { name: 'Complete Monthly Care Ritual', duration: '90 mins', price: 2400, originalPrice: 3000 }
    ],
    staffRoles: ['Lead Aesthetician', 'Senior Beauty Therapist', 'Skin Rejuvenation Specialist'],
    galleryThemes: ['Facial Glows', 'Bridal Makeovers', 'Luminous Skin Results'],
    themeTokens: {
      accentColor: '#E11D48',
      borderRadius: 'rounded-2xl',
      buttonStyle: 'Solid Pill (radius.full 9999px)',
      heroStyle: 'Center Minimal'
    }
  },

  // 4. Nail Studio
  {
    categoryId: 'nail',
    categoryName: 'Nail Studio',
    tagline: 'Statement Nail Art & Luxury Manicures',
    terminology: {
      serviceLabel: 'Nail Treatments & Extensions',
      packageLabel: 'Mani-Pedi Combos',
      staffLabel: 'Nail Artists',
      bookingAction: 'Book Nail Slot'
    },
    heroHeadline: 'Bespoke Nail Art, Hard Gel Extensions & Russian Manicures',
    heroSubheadline: 'Hand-painted designs, chrome finishes, and flawless cuticle care using premium non-toxic builder gels.',
    featuredServices: [
      { name: 'Hard Gel Extension Sculpting (Set)', duration: '75 mins', price: 1800, advance: 450 },
      { name: 'Russian Dry Manicure & BIAB Overlay', duration: '60 mins', price: 1200, advance: 300 },
      { name: 'Chrome & 3D Metallic Nail Art (10 Nails)', duration: '30 mins', price: 800, advance: 200 }
    ],
    featuredPackages: [
      { name: 'The VIP Mani-Pedi Chrome Ritual', duration: '120 mins', price: 2600, originalPrice: 3200 },
      { name: 'Bridal Nail Couture Package', duration: '90 mins', price: 2200, originalPrice: 2800 }
    ],
    staffRoles: ['Master Nail Sculptor', 'Senior Russian Manicurist', 'Freehand Nail Illustrator'],
    galleryThemes: ['Chrome Nails', 'Hand-Painted Art', 'French Variations'],
    themeTokens: {
      accentColor: '#7C3AED',
      borderRadius: 'rounded-xl',
      buttonStyle: 'Solid Pill (radius.full 9999px)',
      heroStyle: 'Split 50/50'
    }
  },

  // 5. Luxury Spa
  {
    categoryId: 'spa',
    categoryName: 'Luxury Spa',
    tagline: 'Sanctuary of Tranquility & Holistic Wellness',
    terminology: {
      serviceLabel: 'Spa Therapies & Bodywork',
      packageLabel: 'Rejuvenation Journeys',
      staffLabel: 'Spa Therapists',
      bookingAction: 'Reserve Sanctuary'
    },
    heroHeadline: 'A Sanctuary of Silence, Deep Bodywork & Botanical Healing',
    heroSubheadline: 'Escape the city in our heated eucalyptus suites. Hot stone therapies, hydro-mineral soaks, and organic herbal poultices.',
    featuredServices: [
      { name: 'Swedish Aromatherapy Body Massage', duration: '60 mins', price: 2200, advance: 550 },
      { name: 'Volcanic Hot Stone Therapy', duration: '75 mins', price: 2800, advance: 700 },
      { name: 'Dead Sea Salt & Citrus Body Scrub', duration: '45 mins', price: 1600, advance: 400 }
    ],
    featuredPackages: [
      { name: 'The Half-Day Rejuvenation Escape', duration: '180 mins', price: 5500, originalPrice: 6800 },
      { name: 'Couples Holistic Sanctuary Experience', duration: '120 mins', price: 4800, originalPrice: 6000 }
    ],
    staffRoles: ['Lead Spa Therapist', 'Aromatherapist', 'Holistic Bodywork Healer'],
    galleryThemes: ['Heated Stone Suites', 'Aromatherapy Oils', 'Relaxation Lounge'],
    themeTokens: {
      accentColor: '#0F766E',
      borderRadius: 'rounded-2xl',
      buttonStyle: 'Soft Rounded (radius.lg 12px)',
      heroStyle: 'Center Minimal'
    }
  },

  // 6. Massage Studio
  {
    categoryId: 'massage',
    categoryName: 'Massage Studio',
    tagline: 'Deep Restorative Therapy & Muscle Relief',
    terminology: {
      serviceLabel: 'Therapeutic Massages',
      packageLabel: 'Recovery Programs',
      staffLabel: 'Licensed Therapists',
      bookingAction: 'Book Session'
    },
    heroHeadline: 'Targeted Deep Tissue, Sports Recovery & Chronic Pain Relief',
    heroSubheadline: 'Clinical muscle restoration focused on posture correction, athletic recovery, and tension trigger points.',
    featuredServices: [
      { name: 'Deep Tissue & Trigger Point Release', duration: '60 mins', price: 1900, advance: 475 },
      { name: 'Athletic Sports Recovery Massage', duration: '75 mins', price: 2400, advance: 600 },
      { name: 'Thai Acupressure Stretching Session', duration: '60 mins', price: 1800, advance: 450 }
    ],
    featuredPackages: [
      { name: '3-Session Posture Recovery Pass', duration: '180 mins total', price: 5000, originalPrice: 6000 },
      { name: 'Stress & Upper Back Reset Combo', duration: '90 mins', price: 2600, originalPrice: 3200 }
    ],
    staffRoles: ['Licensed Massage Therapist (LMT)', 'Sports Kinesiologist', 'Deep Tissue Specialist'],
    galleryThemes: ['Therapy Rooms', 'Trigger Point Equipment', 'Therapeutic Stretch'],
    themeTokens: {
      accentColor: '#9A3412',
      borderRadius: 'rounded-lg',
      buttonStyle: 'Soft Rounded (radius.md 8px)',
      heroStyle: 'Split 50/50'
    }
  },

  // 7. Tattoo Studio
  {
    categoryId: 'tattoo',
    categoryName: 'Tattoo Studio',
    tagline: 'Custom Ink, Sacred Geometry & Piercing',
    terminology: {
      serviceLabel: 'Custom Tattoo Sessions',
      packageLabel: 'Full Day / Sleeve Projects',
      staffLabel: 'Resident Tattoo Artists',
      bookingAction: 'Book Consultation'
    },
    heroHeadline: 'Custom Fine-Line Ink, Sacred Geometry & Blackwork Realism',
    heroSubheadline: 'One-of-a-kind custom body art crafted by specialized resident artists. Hospital-grade sterile environment with vegan pigments.',
    featuredServices: [
      { name: 'Custom Fine-Line Illustration (Hourly)', duration: '60 mins', price: 2500, advance: 625 },
      { name: 'Half-Day Tattoo Session (Up to 4 Hours)', duration: '240 mins', price: 9000, advance: 2250 },
      { name: 'Precision Titanium Piercing (Per Site)', duration: '20 mins', price: 800, advance: 200 }
    ],
    featuredPackages: [
      { name: 'Full Sleeve Concept & 3-Session Pass', duration: '12 hours total', price: 24000, originalPrice: 28000 },
      { name: 'Custom Cover-Up & Re-Inking Masterclass', duration: '300 mins', price: 11000, originalPrice: 13000 }
    ],
    staffRoles: ['Resident Blackwork Artist', 'Fine-Line Specialist', 'Master Piercer'],
    galleryThemes: ['Fine-Line Healed', 'Sacred Geometry', 'Sleeve Projects'],
    themeTokens: {
      accentColor: '#18181B',
      borderRadius: 'rounded-none',
      buttonStyle: 'Sharp Box (radius.none 0px)',
      heroStyle: 'Bold Poster'
    }
  }
];
