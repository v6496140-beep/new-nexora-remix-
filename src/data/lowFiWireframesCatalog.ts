export interface WireframeBlock {
  type: 'box' | 'text' | 'button' | 'input' | 'table' | 'placeholder' | 'nav' | 'badge' | 'metric';
  label: string;
  sublabel?: string;
  width?: string; // e.g. 'full', '1/2', '1/3', '1/4', '2/3'
  height?: string; // e.g. 'h-8', 'h-16', 'h-24', 'h-40'
}

export interface WireframeSection {
  sectionId: string;
  title: string;
  annotation?: string;
  blocks: WireframeBlock[];
}

export interface WireframeScreenSpec {
  id: number;
  name: string;
  cluster:
    | 'Marketing'
    | 'Business Onboarding'
    | 'Public Business Website'
    | 'Booking'
    | 'Customer'
    | 'Business Admin'
    | 'Staff'
    | 'Super Admin';
  description: string;
  sections: WireframeSection[];
}

export const WIREFRAMES_66: WireframeScreenSpec[] = [
  // ----------------------------------------------------
  // CLUSTER 1: MARKETING (1 - 5)
  // ----------------------------------------------------
  {
    id: 1,
    name: 'Platform Landing Page',
    cluster: 'Marketing',
    description: 'SaaS homepage with value proposition, category showcases, feature highlights, and ROI calculator.',
    sections: [
      {
        sectionId: 'top-nav',
        title: 'Global Platform Navigation',
        blocks: [
          { type: 'nav', label: '[ LOGO: Nexora SalonOS ]', width: '1/4' },
          { type: 'text', label: 'Categories · Features · Templates · Pricing · FAQ', width: '1/2' },
          { type: 'button', label: '[ Sign In ]', width: '1/8' },
          { type: 'button', label: '[ Create My Website ] (Primary CTA)', width: '1/8' },
        ],
      },
      {
        sectionId: 'hero',
        title: 'Hero Section',
        blocks: [
          { type: 'text', label: '[ HEADLINE: The Operating System for Modern Salons & Studios ]', width: 'full' },
          { type: 'text', label: '[ SUBHEADLINE: Launch a ready-made professional website & booking engine in 60 seconds. ]', width: 'full' },
          { type: 'button', label: '[ Select Category & Start Free ]', width: '1/3' },
          { type: 'button', label: '[ View Live Demo ]', width: '1/3' },
          { type: 'placeholder', label: '[ BROWSER MOCKUP: Live Salon Site Preview · 1440x700px ]', width: 'full', height: 'h-48' },
        ],
      },
      {
        sectionId: 'categories-grid',
        title: 'Supported Industry Verticals',
        blocks: [
          { type: 'box', label: '[ 01. Barber ]', width: '1/4' },
          { type: 'box', label: '[ 02. Hair Salon ]', width: '1/4' },
          { type: 'box', label: '[ 03. Beauty Parlour ]', width: '1/4' },
          { type: 'box', label: '[ 04. Nail Studio ]', width: '1/4' },
          { type: 'box', label: '[ 05. Spa ]', width: '1/4' },
          { type: 'box', label: '[ 06. Massage Studio ]', width: '1/4' },
          { type: 'box', label: '[ 07. Tattoo Studio ]', width: '1/4' },
          { type: 'box', label: '[ 08. Unisex Salon ]', width: '1/4' },
          { type: 'box', label: '[ 09. Makeup Studio ]', width: '1/4' },
          { type: 'box', label: '[ 10. Wellness Studio ]', width: '1/4' },
        ],
      },
      {
        sectionId: 'cta-banner',
        title: 'Bottom Conversion Banner',
        blocks: [
          { type: 'box', label: '[ READY TO ELEVATE YOUR SALON? ] · [ Create My Website Today ]', width: 'full', height: 'h-24' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Category Selection',
    cluster: 'Marketing',
    description: 'Onboarding gateway allowing prospective merchant to choose 1 of 10 supported industry verticals.',
    sections: [
      {
        sectionId: 'header',
        title: 'Screen Header',
        blocks: [
          { type: 'text', label: '[ STEP 1 OF 6: SELECT BUSINESS VERTICAL ]', width: 'full' },
          { type: 'input', label: '[ Search 10 categories (e.g., Barber, Spa, Tattoo)... ]', width: '1/2' },
        ],
      },
      {
        sectionId: 'category-cards',
        title: '10 Category Selection Cards',
        blocks: [
          { type: 'box', label: '[ CARD: Barber · Master cuts, shaves & beard care · SELECT ]', width: '1/3' },
          { type: 'box', label: '[ CARD: Hair Salon · Balayage, cuts & color care · SELECT ]', width: '1/3' },
          { type: 'box', label: '[ CARD: Beauty Parlour · Facials, waxing & skin · SELECT ]', width: '1/3' },
          { type: 'box', label: '[ CARD: Nail Studio · Gel extensions & manicures · SELECT ]', width: '1/3' },
          { type: 'box', label: '[ CARD: Spa · Hydrotherapy & holistic wraps · SELECT ]', width: '1/3' },
          { type: 'box', label: '[ CARD: Massage Studio · Deep tissue & bodywork · SELECT ]', width: '1/3' },
          { type: 'box', label: '[ CARD: Tattoo Studio · Custom fine-line & body art · SELECT ]', width: '1/3' },
          { type: 'box', label: '[ CARD: Unisex Salon · Inclusive cuts & styling · SELECT ]', width: '1/3' },
          { type: 'box', label: '[ CARD: Makeup Studio · Bridal glam & masterclasses · SELECT ]', width: '1/3' },
          { type: 'box', label: '[ CARD: Wellness Studio · Sauna & lymphatic sculpt · SELECT ]', width: '1/3' },
        ],
      },
      {
        sectionId: 'footer-actions',
        title: 'Navigation Actions',
        blocks: [
          { type: 'button', label: '[ Continue to Template Selection -> ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Template Selection',
    cluster: 'Marketing',
    description: 'Structural template & theme token gallery tailored to the chosen category.',
    sections: [
      {
        sectionId: 'header',
        title: 'Template Gallery Header',
        blocks: [
          { type: 'text', label: '[ STEP 2 OF 6: CHOOSE TEMPLATE & THEME TOKENS ]', width: 'full' },
        ],
      },
      {
        sectionId: 'templates',
        title: '4 Reusable Layout Variations',
        blocks: [
          { type: 'placeholder', label: '[ WIREFRAME THUMBNAIL: Classic Heritage · Split Media Hero ]', width: '1/4', height: 'h-32' },
          { type: 'placeholder', label: '[ WIREFRAME THUMBNAIL: Modern Minimalist · Centered Hero ]', width: '1/4', height: 'h-32' },
          { type: 'placeholder', label: '[ WIREFRAME THUMBNAIL: Botanical Zen · Organic Travertine ]', width: '1/4', height: 'h-32' },
          { type: 'placeholder', label: '[ WIREFRAME THUMBNAIL: Obsidian Noir · High-Contrast ]', width: '1/4', height: 'h-32' },
        ],
      },
      {
        sectionId: 'palettes',
        title: '60-30-10 Disciplined Palette Swatches',
        blocks: [
          { type: 'box', label: '[ Swatch: Charcoal & Crisp White ]', width: '1/4' },
          { type: 'box', label: '[ Swatch: Warm Taupe & Sandstone ]', width: '1/4' },
          { type: 'box', label: '[ Swatch: Forest Green & Linen ]', width: '1/4' },
          { type: 'box', label: '[ Swatch: Obsidian Monochrome ]', width: '1/4' },
        ],
      },
      {
        sectionId: 'actions',
        title: 'Actions',
        blocks: [
          { type: 'button', label: '[ <- Back to Category ]', width: '1/4' },
          { type: 'button', label: '[ Continue to Business Setup -> ]', width: '1/4' },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'Sign Up',
    cluster: 'Marketing',
    description: 'Merchant registration screen establishing tenant ownership identity.',
    sections: [
      {
        sectionId: 'auth-box',
        title: 'Owner Registration Box',
        blocks: [
          { type: 'text', label: '[ TITLE: Create Your Nexora SalonOS Owner Account ]', width: 'full' },
          { type: 'input', label: '[ Full Name Input: e.g. Alexander Vance ]', width: 'full' },
          { type: 'input', label: '[ Work Email Input: e.g. alex@nobleblade.com ]', width: 'full' },
          { type: 'input', label: '[ Password Input: min 8 chars ]', width: 'full' },
          { type: 'input', label: '[ Phone Number Input: +1 (555) 000-0000 ]', width: 'full' },
          { type: 'button', label: '[ Create Account & Begin Setup ]', width: 'full' },
          { type: 'text', label: 'Already have an account? [ Sign In Link ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'Sign In',
    cluster: 'Marketing',
    description: 'Authentication entry point for returning business owners and managers.',
    sections: [
      {
        sectionId: 'login-box',
        title: 'Authentication Form',
        blocks: [
          { type: 'text', label: '[ TITLE: Sign in to Nexora SalonOS ]', width: 'full' },
          { type: 'input', label: '[ Email Address Input ]', width: 'full' },
          { type: 'input', label: '[ Password Input ]', width: 'full' },
          { type: 'button', label: '[ Sign In to Dashboard ]', width: 'full' },
          { type: 'text', label: '[ Forgot Password Link ] · [ Create New Salon ]', width: 'full' },
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // CLUSTER 2: BUSINESS ONBOARDING (6 - 12)
  // ----------------------------------------------------
  {
    id: 6,
    name: 'Business Details',
    cluster: 'Business Onboarding',
    description: 'Onboarding step for business identity, location address, and custom subdomain.',
    sections: [
      {
        sectionId: 'details-form',
        title: 'Business Profile Intake',
        blocks: [
          { type: 'input', label: '[ Salon / Studio Name Input ]', width: '1/2' },
          { type: 'input', label: '[ Subdomain Input: nobleblade .nexorasalon.com ]', width: '1/2' },
          { type: 'input', label: '[ Street Address Input ]', width: '1/2' },
          { type: 'input', label: '[ City, State, Postal Code Input ]', width: '1/2' },
          { type: 'input', label: '[ Contact Telephone Input ]', width: '1/3' },
          { type: 'input', label: '[ Contact Email Input ]', width: '1/3' },
          { type: 'input', label: '[ Tax ID / GSTIN / EIN Input ]', width: '1/3' },
        ],
      },
    ],
  },
  {
    id: 7,
    name: 'Services Setup',
    cluster: 'Business Onboarding',
    description: 'Review and customize pre-seeded service catalogue items.',
    sections: [
      {
        sectionId: 'service-list',
        title: 'Pre-Seeded Services Table',
        blocks: [
          { type: 'button', label: '[ + Add Custom Service ]', width: '1/4' },
          { type: 'box', label: '[ ROW 1: Signature Cut · 45 mins · $55 · Edit / Delete ]', width: 'full' },
          { type: 'box', label: '[ ROW 2: Royal Shave · 40 mins · $50 · Edit / Delete ]', width: 'full' },
          { type: 'box', label: '[ ROW 3: Beard Sculpt · 30 mins · $40 · Edit / Delete ]', width: 'full' },
          { type: 'box', label: '[ ROW 4: Scalp Treatment · 30 mins · $35 · Edit / Delete ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 8,
    name: 'Staff Setup',
    cluster: 'Business Onboarding',
    description: 'Add initial stylists/specialists, chairs, and roles.',
    sections: [
      {
        sectionId: 'staff-form',
        title: 'Initial Team Roster',
        blocks: [
          { type: 'button', label: '[ + Add Staff Member ]', width: '1/4' },
          { type: 'box', label: '[ STAFF 1: Owner / Master Barber · Station: Chair 1 · Full Service ]', width: 'full' },
          { type: 'box', label: '[ STAFF 2: Senior Specialist · Station: Chair 2 · Color & Cut ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 9,
    name: 'Gallery Setup',
    cluster: 'Business Onboarding',
    description: 'Upload client showcase photos or choose curated domain assets.',
    sections: [
      {
        sectionId: 'gallery-slots',
        title: 'Visual Portfolio Slots',
        blocks: [
          { type: 'placeholder', label: '[ UPLOAD BOX: Drag & drop interior & lookbook photos ]', width: 'full', height: 'h-32' },
          { type: 'box', label: '[ Photo Slot 1: 1:1 Aspect ]', width: '1/4' },
          { type: 'box', label: '[ Photo Slot 2: 1:1 Aspect ]', width: '1/4' },
          { type: 'box', label: '[ Photo Slot 3: 1:1 Aspect ]', width: '1/4' },
          { type: 'box', label: '[ Photo Slot 4: 1:1 Aspect ]', width: '1/4' },
        ],
      },
    ],
  },
  {
    id: 10,
    name: 'Opening Hours',
    cluster: 'Business Onboarding',
    description: 'Weekly schedule and appointment slot calculation parameters.',
    sections: [
      {
        sectionId: 'hours-matrix',
        title: 'Weekly Operating Shift Matrix',
        blocks: [
          { type: 'box', label: '[ Monday: 09:00 AM - 08:00 PM · Open ]', width: 'full' },
          { type: 'box', label: '[ Tuesday: 09:00 AM - 08:00 PM · Open ]', width: 'full' },
          { type: 'box', label: '[ Wednesday: 09:00 AM - 08:00 PM · Open ]', width: 'full' },
          { type: 'box', label: '[ Thursday: 09:00 AM - 08:00 PM · Open ]', width: 'full' },
          { type: 'box', label: '[ Friday: 09:00 AM - 08:00 PM · Open ]', width: 'full' },
          { type: 'box', label: '[ Saturday: 08:30 AM - 07:00 PM · Open ]', width: 'full' },
          { type: 'box', label: '[ Sunday: Closed / Appointments by Request ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 11,
    name: 'Website Preview',
    cluster: 'Business Onboarding',
    description: 'Full interactive preview of the generated tenant website.',
    sections: [
      {
        sectionId: 'viewport-controls',
        title: 'Preview Bar',
        blocks: [
          { type: 'text', label: '[ BROWSER PREVIEW: nobleblade.nexorasalon.com ]', width: '1/2' },
          { type: 'button', label: '[ Desktop (1440px) ]', width: '1/6' },
          { type: 'button', label: '[ Tablet (768px) ]', width: '1/6' },
          { type: 'button', label: '[ Mobile (375px) ]', width: '1/6' },
        ],
      },
      {
        sectionId: 'preview-canvas',
        title: 'Synthesized Website Canvas',
        blocks: [
          { type: 'placeholder', label: '[ SYNTHESIZED PUBLIC WEBSITE DRAFT CANVAS ]', width: 'full', height: 'h-48' },
        ],
      },
    ],
  },
  {
    id: 12,
    name: 'Publish',
    cluster: 'Business Onboarding',
    description: 'Pre-flight launch verification and live subdomain activation.',
    sections: [
      {
        sectionId: 'checklist',
        title: 'Launch Readiness Checklist',
        blocks: [
          { type: 'box', label: '[ [x] Category Architecture Bound: Barber Vertical ]', width: 'full' },
          { type: 'box', label: '[ [x] Services Menu Configured: 4 Services Active ]', width: 'full' },
          { type: 'box', label: '[ [x] Working Shifts Initialized: Mon-Sat ]', width: 'full' },
          { type: 'box', label: '[ [x] Subdomain Reserved: nobleblade.nexorasalon.com ]', width: 'full' },
          { type: 'button', label: '[ *** PUBLISH WEBSITE LIVE *** ]', width: 'full', height: 'h-16' },
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // CLUSTER 3: PUBLIC BUSINESS WEBSITE (13 - 19)
  // ----------------------------------------------------
  {
    id: 13,
    name: 'Home',
    cluster: 'Public Business Website',
    description: 'Primary customer-facing homepage adhering to the 12-section information architecture.',
    sections: [
      {
        sectionId: 'sec-announcement',
        title: '01. Announcement Bar',
        blocks: [{ type: 'box', label: '[ ANNOUNCEMENT: Grand Opening Special · 20% off first cut ]', width: 'full' }],
      },
      {
        sectionId: 'sec-navbar',
        title: '02. Navbar (Top Bar Contract: 3 Zones)',
        blocks: [
          { type: 'nav', label: '[ ZONE 1: Brand Wordmark ]', width: '1/4' },
          { type: 'text', label: '[ ZONE 2: Home · Services · Packages · Gallery · About · Contact · My Bookings ]', width: '1/2' },
          { type: 'button', label: '[ ZONE 3: Sign In | Sign Up | Book Now (Primary CTA) ]', width: '1/4' },
        ],
      },
      {
        sectionId: 'sec-hero',
        title: '03. Hero Section',
        blocks: [
          { type: 'text', label: '[ HERO HEADLINE & VALUE PROPOSITION ]', width: '1/2' },
          { type: 'placeholder', label: '[ HERO MEDIA BACKDROP PLACEHOLDER: 16:9 Aspect ]', width: '1/2', height: 'h-32' },
          { type: 'button', label: '[ Primary CTA: Book Now ]', width: '1/4' },
          { type: 'button', label: '[ Secondary CTA: Explore Services ]', width: '1/4' },
        ],
      },
      {
        sectionId: 'sec-featured',
        title: '04. Featured Services Grid',
        blocks: [
          { type: 'box', label: '[ Featured Service 1: Title · Duration · Price · Book ]', width: '1/3' },
          { type: 'box', label: '[ Featured Service 2: Title · Duration · Price · Book ]', width: '1/3' },
          { type: 'box', label: '[ Featured Service 3: Title · Duration · Price · Book ]', width: '1/3' },
        ],
      },
      {
        sectionId: 'sec-packages',
        title: '05. Packages Showcase',
        blocks: [
          { type: 'box', label: '[ Package Bundle 1: Executive Ritual · Includes 3 services · $110 ]', width: '1/2' },
          { type: 'box', label: '[ Package Bundle 2: Duo Package · Includes 2 services · $85 ]', width: '1/2' },
        ],
      },
      {
        sectionId: 'sec-about',
        title: '06. About Section',
        blocks: [
          { type: 'text', label: '[ Studio Philosophy, Craftsmanship & Sanitation Standards ]', width: '1/2' },
          { type: 'placeholder', label: '[ Studio Interior Photography Placeholder ]', width: '1/2', height: 'h-24' },
        ],
      },
      {
        sectionId: 'sec-staff',
        title: '07. Staff Roster',
        blocks: [
          { type: 'box', label: '[ Staff 1: Photo · Name · Title · Verified License · Book Specialist ]', width: '1/3' },
          { type: 'box', label: '[ Staff 2: Photo · Name · Title · Verified License · Book Specialist ]', width: '1/3' },
          { type: 'box', label: '[ Staff 3: Photo · Name · Title · Verified License · Book Specialist ]', width: '1/3' },
        ],
      },
      {
        sectionId: 'sec-gallery',
        title: '08. Gallery / Lookbook',
        blocks: [
          { type: 'placeholder', label: '[ Photo 1: 1:1 ]', width: '1/4', height: 'h-24' },
          { type: 'placeholder', label: '[ Photo 2: 1:1 ]', width: '1/4', height: 'h-24' },
          { type: 'placeholder', label: '[ Photo 3: 1:1 ]', width: '1/4', height: 'h-24' },
          { type: 'placeholder', label: '[ Photo 4: 1:1 ]', width: '1/4', height: 'h-24' },
        ],
      },
      {
        sectionId: 'sec-testimonials',
        title: '09. Testimonials & Verified Proof',
        blocks: [
          { type: 'box', label: '[ Review 1: 5 Stars · Quote · Client Name · Service Verified ]', width: '1/2' },
          { type: 'box', label: '[ Review 2: 5 Stars · Quote · Client Name · Service Verified ]', width: '1/2' },
        ],
      },
      {
        sectionId: 'sec-booking-cta',
        title: '10. Dedicated Booking CTA Banner',
        blocks: [
          { type: 'box', label: '[ BANNER: Ready to visit? · Select your service & specialist today · [ Book Now ] ]', width: 'full', height: 'h-20' },
        ],
      },
      {
        sectionId: 'sec-contact',
        title: '11. Contact & Location Hours',
        blocks: [
          { type: 'box', label: '[ Address · Operating Hours · Phone · Email ]', width: '1/2' },
          { type: 'placeholder', label: '[ Interactive Google Map Placeholder ]', width: '1/2', height: 'h-24' },
        ],
      },
      {
        sectionId: 'sec-footer',
        title: '12. Footer',
        blocks: [
          { type: 'text', label: '[ Brand Copyright · Cancellation Terms · Privacy Policy · Powered by Nexora ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 14,
    name: 'Services',
    cluster: 'Public Business Website',
    description: 'Complete categorised service menu with duration, pricing, and direct book triggers.',
    sections: [
      {
        sectionId: 'service-catalog',
        title: 'Full Treatment Menu',
        blocks: [
          { type: 'text', label: '[ CATEGORY FILTER TABS: All · Hair · Shaves · Beard · Treatments ]', width: 'full' },
          { type: 'box', label: '[ Service Card 1 · Duration: 45m · Price: $55 · [ Book Service ] ]', width: '1/2' },
          { type: 'box', label: '[ Service Card 2 · Duration: 40m · Price: $50 · [ Book Service ] ]', width: '1/2' },
          { type: 'box', label: '[ Service Card 3 · Duration: 30m · Price: $40 · [ Book Service ] ]', width: '1/2' },
          { type: 'box', label: '[ Service Card 4 · Duration: 35m · Price: $45 · [ Book Service ] ]', width: '1/2' },
        ],
      },
    ],
  },
  {
    id: 15,
    name: 'Packages',
    cluster: 'Public Business Website',
    description: 'Multi-service bundled offerings and experience rituals.',
    sections: [
      {
        sectionId: 'packages-grid',
        title: 'Curated Bundles',
        blocks: [
          { type: 'box', label: '[ Package 1: The Executive Ritual · Cut + Shave + Scalp Massage · $110 ]', width: '1/2' },
          { type: 'box', label: '[ Package 2: Father & Son Grooming Duo · 2x Cuts + Pomade · $85 ]', width: '1/2' },
        ],
      },
    ],
  },
  {
    id: 16,
    name: 'Gallery',
    cluster: 'Public Business Website',
    description: 'Lookbook showcase grid with category filters and lightbox view.',
    sections: [
      {
        sectionId: 'gallery-grid',
        title: 'Lookbook Media Grid',
        blocks: [
          { type: 'text', label: '[ FILTER TABS: All Styles · Modern Fades · Beard Sculpting · Classic ]', width: 'full' },
          { type: 'placeholder', label: '[ Lookbook Photo 1 · 1:1 ]', width: '1/3', height: 'h-32' },
          { type: 'placeholder', label: '[ Lookbook Photo 2 · 1:1 ]', width: '1/3', height: 'h-32' },
          { type: 'placeholder', label: '[ Lookbook Photo 3 · 1:1 ]', width: '1/3', height: 'h-32' },
        ],
      },
    ],
  },
  {
    id: 17,
    name: 'About',
    cluster: 'Public Business Website',
    description: 'Studio background, ethos, hygienic standards, and master practitioner credentials.',
    sections: [
      {
        sectionId: 'about-content',
        title: 'Brand Story & Standards',
        blocks: [
          { type: 'text', label: '[ The Story of The Noble Blade · Established 2021 ]', width: 'full' },
          { type: 'box', label: '[ Verified Hygiene: Barbicide Certified · Hospital Grade Autoclave ]', width: '1/2' },
          { type: 'box', label: '[ Licensed Master Barbers: 25+ Combined Years Experience ]', width: '1/2' },
        ],
      },
    ],
  },
  {
    id: 18,
    name: 'Contact',
    cluster: 'Public Business Website',
    description: 'Physical address, parking instructions, map embed, and direct inquiry form.',
    sections: [
      {
        sectionId: 'contact-layout',
        title: 'Location & Inquiry Form',
        blocks: [
          { type: 'box', label: '[ Address · Working Hours · Telephone · Parking Notes ]', width: '1/2' },
          { type: 'placeholder', label: '[ Interactive Map Canvas ]', width: '1/2', height: 'h-32' },
          { type: 'input', label: '[ Your Name ]', width: '1/2' },
          { type: 'input', label: '[ Your Email / Phone ]', width: '1/2' },
          { type: 'input', label: '[ Message / Special Request ]', width: 'full' },
          { type: 'button', label: '[ Submit Inquiry ]', width: '1/4' },
        ],
      },
    ],
  },
  {
    id: 19,
    name: 'My Bookings',
    cluster: 'Public Business Website',
    description: 'Public customer access point to look up bookings via phone/email or account login.',
    sections: [
      {
        sectionId: 'my-bookings-lookup',
        title: 'Customer Booking Lookup',
        blocks: [
          { type: 'input', label: '[ Enter Booking Ref Code (e.g. NB-94812) or Mobile Phone ]', width: '2/3' },
          { type: 'button', label: '[ Lookup Appointment ]', width: '1/3' },
          { type: 'box', label: '[ UPCOMING APPOINTMENT: Oct 14, 10:45 AM · Julian Vance · [ Reschedule ] [ Cancel ] ]', width: 'full' },
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // CLUSTER 4: BOOKING FLOW (20 - 26)
  // ----------------------------------------------------
  {
    id: 20,
    name: 'Service Selection',
    cluster: 'Booking',
    description: 'Step 1 of the booking funnel: service & add-on picker with durations and pricing.',
    sections: [
      {
        sectionId: 'step-1',
        title: 'Booking Funnel: Step 1 (Services)',
        blocks: [
          { type: 'badge', label: 'STEP 1 OF 5: SERVICES & ENHANCEMENTS', width: 'full' },
          { type: 'box', label: '[ (o) Signature Skin Fade · 45 mins · $55 ]', width: 'full' },
          { type: 'box', label: '[ ( ) Hot Towel Royal Shave · 40 mins · $50 ]', width: 'full' },
          { type: 'box', label: '[ [x] Add-on: Beard Sculpting · +20 mins · +$25 ]', width: 'full' },
          { type: 'button', label: '[ Continue to Specialist Selection -> ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 21,
    name: 'Staff Selection',
    cluster: 'Booking',
    description: 'Step 2: Specialist selection or fastest available option.',
    sections: [
      {
        sectionId: 'step-2',
        title: 'Booking Funnel: Step 2 (Staff)',
        blocks: [
          { type: 'badge', label: 'STEP 2 OF 5: CHOOSE SPECIALIST', width: 'full' },
          { type: 'box', label: '[ (o) Any Available Professional · Maximum time slot options ]', width: '1/3' },
          { type: 'box', label: '[ ( ) Julian Vance · Master Barber · 8 yrs exp ]', width: '1/3' },
          { type: 'box', label: '[ ( ) Elena Rostova · Lead Stylist · 11 yrs exp ]', width: '1/3' },
          { type: 'button', label: '[ Continue to Date & Time -> ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 22,
    name: 'Date / Time Selection',
    cluster: 'Booking',
    description: 'Step 3: Interactive calendar date and available time slot picker.',
    sections: [
      {
        sectionId: 'step-3',
        title: 'Booking Funnel: Step 3 (Calendar & Slots)',
        blocks: [
          { type: 'badge', label: 'STEP 3 OF 5: DATE & TIME (10-min slot hold timer active)', width: 'full' },
          { type: 'placeholder', label: '[ Interactive Monthly Calendar Grid: Select Date ]', width: '1/2', height: 'h-32' },
          { type: 'box', label: '[ Open Slots: 09:30 AM | (o) 10:45 AM | 01:15 PM | 03:00 PM ]', width: '1/2' },
          { type: 'button', label: '[ Continue to Client Details -> ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 23,
    name: 'Customer Details',
    cluster: 'Booking',
    description: 'Step 4: Contact info intake and category medical/health questionnaire.',
    sections: [
      {
        sectionId: 'step-4',
        title: 'Booking Funnel: Step 4 (Intake & Details)',
        blocks: [
          { type: 'badge', label: 'STEP 4 OF 5: CLIENT DETAILS & HEALTH INTAKE', width: 'full' },
          { type: 'input', label: '[ Full Name Input ]', width: '1/2' },
          { type: 'input', label: '[ Mobile Phone Input (SMS reminders) ]', width: '1/2' },
          { type: 'input', label: '[ Email Address Input ]', width: 'full' },
          { type: 'box', label: '[ [x] I confirm no active skin contraindications / agree to policy ]', width: 'full' },
          { type: 'button', label: '[ Continue to Review Summary -> ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 24,
    name: 'Booking Summary',
    cluster: 'Booking',
    description: 'Step 5: Itemized cost calculation, tax breakdown, and cancellation policy review.',
    sections: [
      {
        sectionId: 'step-5-summary',
        title: 'Booking Funnel: Step 5 (Review Summary)',
        blocks: [
          { type: 'badge', label: 'APPOINTMENT SUMMARY (Held for 08:30 mins)', width: 'full' },
          { type: 'box', label: '[ Service: Skin Fade + Beard ($80.00) · Julian Vance · Oct 14, 10:45 AM ]', width: 'full' },
          { type: 'box', label: '[ Estimated Tax: $6.60 · Deposit Required Now: $20.00 · Balance at Salon: $66.60 ]', width: 'full' },
          { type: 'button', label: '[ Proceed to Payment Step -> ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 25,
    name: 'Payment Step',
    cluster: 'Booking',
    description: 'Advance payment deposit interface (flow definition only; no live gateway).',
    sections: [
      {
        sectionId: 'payment-step',
        title: 'Advance Payment Specification',
        blocks: [
          { type: 'badge', label: 'PAYMENT STEP (Flow Definition Only)', width: 'full' },
          { type: 'box', label: '[ Deposit Amount: $20.00 · Balance at appointment: $66.60 ]', width: 'full' },
          { type: 'placeholder', label: '[ PAYMENT METHOD CONTAINER: Card / Apple Pay / UPI / Salon POS ]', width: 'full', height: 'h-24' },
          { type: 'button', label: '[ Authorize Deposit & Confirm Appointment ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 26,
    name: 'Booking Confirmation',
    cluster: 'Booking',
    description: 'Confirmed booking terminal state with reference ID, calendar export, and SMS alert.',
    sections: [
      {
        sectionId: 'confirmation',
        title: 'Reservation Confirmed',
        blocks: [
          { type: 'box', label: '[ (v) APPOINTMENT CONFIRMED! Reference: #NB-94812 ]', width: 'full' },
          { type: 'box', label: '[ Date: Friday, Oct 14 · 10:45 AM (65m) · With: Julian Vance ]', width: 'full' },
          { type: 'button', label: '[ Add to Google Calendar ]', width: '1/3' },
          { type: 'button', label: '[ Add to Apple Calendar (.ics) ]', width: '1/3' },
          { type: 'button', label: '[ View in My Bookings ]', width: '1/3' },
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // CLUSTER 5: CUSTOMER ACCOUNT (27 - 30)
  // ----------------------------------------------------
  {
    id: 27,
    name: 'Customer Dashboard',
    cluster: 'Customer',
    description: 'Client overview showing upcoming visits, past records, and quick rebook.',
    sections: [
      {
        sectionId: 'cust-dash',
        title: 'Client Portal Dashboard',
        blocks: [
          { type: 'text', label: '[ Welcome back, Jane Doe · Member since 2024 ]', width: 'full' },
          { type: 'box', label: '[ NEXT VISIT: In 3 Days · Oct 14, 10:45 AM · Julian Vance · [ Reschedule ] ]', width: 'full' },
          { type: 'metric', label: '[ Total Visits: 12 ]', width: '1/3' },
          { type: 'metric', label: '[ Favorite Specialist: Julian Vance ]', width: '1/3' },
          { type: 'metric', label: '[ Invoices Available: 12 ]', width: '1/3' },
        ],
      },
    ],
  },
  {
    id: 28,
    name: 'Booking Details',
    cluster: 'Customer',
    description: 'Specific appointment deep dive with items, directions, notes, and invoice.',
    sections: [
      {
        sectionId: 'booking-detail',
        title: 'Appointment Deep Dive',
        blocks: [
          { type: 'box', label: '[ Ref: NB-94812 · Status: Confirmed · Chair 1 ]', width: 'full' },
          { type: 'box', label: '[ Breakdown: Haircut ($55) + Beard ($25) + Tax ($6.60) · Deposit Paid: $20 ]', width: 'full' },
          { type: 'button', label: '[ Download PDF Invoice ]', width: '1/3' },
          { type: 'button', label: '[ Request Reschedule ]', width: '1/3' },
          { type: 'button', label: '[ Cancel Appointment ]', width: '1/3' },
        ],
      },
    ],
  },
  {
    id: 29,
    name: 'Booking History',
    cluster: 'Customer',
    description: 'Chronological list of all completed, cancelled, and no-show appointments.',
    sections: [
      {
        sectionId: 'history-list',
        title: 'Past Service Ledger',
        blocks: [
          { type: 'table', label: '[ TABLE: Date | Service | Specialist | Amount | Receipt | Action (Rebook) ]', width: 'full', height: 'h-32' },
        ],
      },
    ],
  },
  {
    id: 30,
    name: 'Profile',
    cluster: 'Customer',
    description: 'Customer contact info, notification preferences, and allergy notes.',
    sections: [
      {
        sectionId: 'profile-form',
        title: 'Personal Info & Preferences',
        blocks: [
          { type: 'input', label: '[ Name: Jane Doe ]', width: '1/2' },
          { type: 'input', label: '[ Phone: +1 555-234-8900 ]', width: '1/2' },
          { type: 'input', label: '[ Email: jane@example.com ]', width: 'full' },
          { type: 'box', label: '[ Allergy Flags: Sensitive to ammonia dye · Patch test verified 2026 ]', width: 'full' },
          { type: 'button', label: '[ Save Changes ]', width: '1/4' },
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // CLUSTER 6: BUSINESS ADMIN (31 - 51)
  // ----------------------------------------------------
  {
    id: 31,
    name: 'Dashboard',
    cluster: 'Business Admin',
    description: 'Master salon overview: daily occupancy, gross bookings, and live queue.',
    sections: [
      {
        sectionId: 'kpi-row',
        title: 'Daily KPI Counters',
        blocks: [
          { type: 'metric', label: '[ Daily Occupancy: 84.2% · 18/22 slots ]', width: '1/4' },
          { type: 'metric', label: '[ Projected Volume: $1,420.00 ]', width: '1/4' },
          { type: 'metric', label: '[ Active Staff: 4 Stylists ]', width: '1/4' },
          { type: 'metric', label: '[ Average Ticket: $78.80 ]', width: '1/4' },
        ],
      },
      {
        sectionId: 'quick-actions',
        title: 'Fast Action Controls',
        blocks: [
          { type: 'button', label: '[ + Book Walk-In Client ]', width: '1/3' },
          { type: 'button', label: '[ Open POS Cash Register ]', width: '1/3' },
          { type: 'button', label: '[ Broadcast Team Notice ]', width: '1/3' },
        ],
      },
    ],
  },
  {
    id: 32,
    name: 'Bookings',
    cluster: 'Business Admin',
    description: 'Searchable master appointment list with filters and status controls.',
    sections: [
      {
        sectionId: 'bookings-table',
        title: 'Master Appointments Register',
        blocks: [
          { type: 'input', label: '[ Search by Client, Phone, or Booking Ref... ]', width: '1/2' },
          { type: 'table', label: '[ TABLE: Ref | Client | Service | Staff | Slot | Status | Total | Actions ]', width: 'full', height: 'h-40' },
        ],
      },
    ],
  },
  {
    id: 33,
    name: 'Calendar',
    cluster: 'Business Admin',
    description: 'Visual multi-chair master calendar with day, week, and room views.',
    sections: [
      {
        sectionId: 'calendar-grid',
        title: 'Multi-Chair Schedule Grid',
        blocks: [
          { type: 'box', label: '[ Chair 1 (Julian) | Chair 2 (Elena) | Chair 3 (Marcus) | Room 1 ]', width: 'full' },
          { type: 'placeholder', label: '[ INTERACTIVE TIME SLOTS GRID (09:00 - 20:00) · Drag to Reschedule ]', width: 'full', height: 'h-48' },
        ],
      },
    ],
  },
  {
    id: 34,
    name: 'Customers',
    cluster: 'Business Admin',
    description: 'Salon CRM client profiles, history, allergy notes, and consent records.',
    sections: [
      {
        sectionId: 'crm-table',
        title: 'Customer Relationship Directory',
        blocks: [
          { type: 'table', label: '[ TABLE: Client Name | Contact | Total Visits | LTV ($) | Last Visit | Notes ]', width: 'full', height: 'h-36' },
        ],
      },
    ],
  },
  {
    id: 35,
    name: 'Services',
    cluster: 'Business Admin',
    description: 'Service catalogue management, duration increments, and category tiers.',
    sections: [
      {
        sectionId: 'services-manager',
        title: 'Catalogue Management',
        blocks: [
          { type: 'button', label: '[ + Create New Service ]', width: '1/4' },
          { type: 'table', label: '[ TABLE: Service Name | Category | Duration | Base Price | Active Toggle ]', width: 'full', height: 'h-36' },
        ],
      },
    ],
  },
  {
    id: 36,
    name: 'Packages',
    cluster: 'Business Admin',
    description: 'Multi-service bundled offerings and promotional package builder.',
    sections: [
      {
        sectionId: 'packages-manager',
        title: 'Package Bundles Builder',
        blocks: [
          { type: 'button', label: '[ + Create Package Bundle ]', width: '1/4' },
          { type: 'box', label: '[ Executive Ritual: 3 Services · $110 · Active on Website ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 37,
    name: 'Staff',
    cluster: 'Business Admin',
    description: 'Staff directory, compensation tiers, assigned stations, and user logins.',
    sections: [
      {
        sectionId: 'staff-roster',
        title: 'Employee Directory & Station Mapping',
        blocks: [
          { type: 'button', label: '[ + Invite Staff Member ]', width: '1/4' },
          { type: 'table', label: '[ TABLE: Staff Name | Role | Station | Commission Tier | Status | Actions ]', width: 'full', height: 'h-36' },
        ],
      },
    ],
  },
  {
    id: 38,
    name: 'Staff Availability',
    cluster: 'Business Admin',
    description: 'Weekly recurring shifts, break buffers, and time-off approval queue.',
    sections: [
      {
        sectionId: 'availability-grid',
        title: 'Shift Management & Time-Off Requests',
        blocks: [
          { type: 'box', label: '[ Pending Time-Off Requests: 1 (Marcus - Nov 2) · [ Approve ] [ Deny ] ]', width: 'full' },
          { type: 'placeholder', label: '[ WEEKLY SHIFT ROSTER MATRIX ACROSS ALL EMPLOYEES ]', width: 'full', height: 'h-36' },
        ],
      },
    ],
  },
  {
    id: 39,
    name: 'Gallery',
    cluster: 'Business Admin',
    description: 'Website photo manager, lookbook tagging, and image uploads.',
    sections: [
      {
        sectionId: 'gallery-cms',
        title: 'Media Asset Management',
        blocks: [
          { type: 'button', label: '[ + Upload High-Res Media ]', width: '1/4' },
          { type: 'placeholder', label: '[ MEDIA ASSETS GRID: 12 photos active on public website ]', width: 'full', height: 'h-32' },
        ],
      },
    ],
  },
  {
    id: 40,
    name: 'Reviews',
    cluster: 'Business Admin',
    description: 'Customer review moderation, public visibility toggles, and feedback metrics.',
    sections: [
      {
        sectionId: 'reviews-list',
        title: 'Testimonial Moderation Board',
        blocks: [
          { type: 'metric', label: '[ Average Rating: 4.9 / 5.0 (142 reviews) ]', width: 'full' },
          { type: 'box', label: '[ Review #142 · 5 Stars · "Best fade in town" · [ Show on Site: ON ] ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 41,
    name: 'Website Builder Structure',
    cluster: 'Business Admin',
    description: 'Visual no-code section reordering, visibility switches, and layout order.',
    sections: [
      {
        sectionId: 'section-organizer',
        title: 'Page Section Reordering',
        blocks: [
          { type: 'box', label: '[ 1. Hero Banner · [ Enabled ] · [ Drag Handle ] ]', width: 'full' },
          { type: 'box', label: '[ 2. Services Grid · [ Enabled ] · [ Drag Handle ] ]', width: 'full' },
          { type: 'box', label: '[ 3. Packages · [ Enabled ] · [ Drag Handle ] ]', width: 'full' },
          { type: 'box', label: '[ 4. About Studio · [ Enabled ] · [ Drag Handle ] ]', width: 'full' },
          { type: 'button', label: '[ Save Layout & Update Live Site ]', width: '1/3' },
        ],
      },
    ],
  },
  {
    id: 42,
    name: 'Theme Settings',
    cluster: 'Business Admin',
    description: 'Brand color tokens, typography scales, corner radii, and component density.',
    sections: [
      {
        sectionId: 'theme-tokens',
        title: 'Design Token Editor',
        blocks: [
          { type: 'box', label: '[ Color Tokens: Canvas #FFFFFF | Surface #F8FAFC | Accent #0F172A ]', width: 'full' },
          { type: 'box', label: '[ Typography Pairing: Satoshi (Body) + Clash Display (Headlines) ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 43,
    name: 'Content Management',
    cluster: 'Business Admin',
    description: 'Copywriting blocks, hero taglines, about story, cancellation policies, and FAQs.',
    sections: [
      {
        sectionId: 'copy-editor',
        title: 'Site Copy Blocks',
        blocks: [
          { type: 'input', label: '[ Hero Headline Input ]', width: 'full' },
          { type: 'input', label: '[ Tagline / Mission Statement Input ]', width: 'full' },
          { type: 'input', label: '[ 24-Hour Cancellation Policy Text ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 44,
    name: 'Payments',
    cluster: 'Business Admin',
    description: 'POS terminal interface, deposit percentage configuration, and accepted methods.',
    sections: [
      {
        sectionId: 'pos-setup',
        title: 'Payment & POS Settings',
        blocks: [
          { type: 'box', label: '[ Online Booking Deposit: [ 25% v ] or Fixed [ $20.00 ] ]', width: '1/2' },
          { type: 'box', label: '[ Terminal Status: Connected to Card Reader #TR-402 ]', width: '1/2' },
        ],
      },
    ],
  },
  {
    id: 45,
    name: 'Transactions',
    cluster: 'Business Admin',
    description: 'Itemized transaction ledger of deposits, POS receipts, tips, and refunds.',
    sections: [
      {
        sectionId: 'tx-ledger',
        title: 'Transactional Ledger',
        blocks: [
          { type: 'table', label: '[ TABLE: Tx ID | Date | Client | Type | Gross | Fee | Net | Status ]', width: 'full', height: 'h-36' },
        ],
      },
    ],
  },
  {
    id: 46,
    name: 'Commission',
    cluster: 'Business Admin',
    description: 'Staff commission rules engine, percentage tiers, retail splits, and tip pool.',
    sections: [
      {
        sectionId: 'commission-engine',
        title: 'Commission Compensation Rules',
        blocks: [
          { type: 'box', label: '[ Tier 1: 45% Service Split + 10% Retail Product Split + 100% Tips ]', width: 'full' },
          { type: 'table', label: '[ TABLE: Staff Member | Gross Sales | Commission Earned | Tips | Payout ]', width: 'full', height: 'h-36' },
        ],
      },
    ],
  },
  {
    id: 47,
    name: 'Qualification',
    cluster: 'Business Admin',
    description: 'Staff licensing, certifications, health board compliance, and expiry alerts.',
    sections: [
      {
        sectionId: 'qual-matrix',
        title: 'Regulatory Credential Verification Board',
        blocks: [
          { type: 'table', label: '[ TABLE: Staff | License Type | License # | Expiry Date | Status | Gate ]', width: 'full', height: 'h-36' },
        ],
      },
    ],
  },
  {
    id: 48,
    name: 'Settlements',
    cluster: 'Business Admin',
    description: 'Automated bank payout batches, bank account configuration, and dispute reserve.',
    sections: [
      {
        sectionId: 'payout-pipeline',
        title: 'Bank Settlement Pipeline',
        blocks: [
          { type: 'box', label: '[ Connected Bank: Chase Business Checking ending in 4102 ]', width: '1/2' },
          { type: 'metric', label: '[ Next Scheduled Payout: $4,820.00 on Monday ]', width: '1/2' },
        ],
      },
    ],
  },
  {
    id: 49,
    name: 'Tax / TDS',
    cluster: 'Business Admin',
    description: 'Sales tax/GST calculation, contractor TDS withholding, and tax summaries.',
    sections: [
      {
        sectionId: 'tax-summary',
        title: 'Tax Compliance & Statutory Withholding',
        blocks: [
          { type: 'box', label: '[ Applicable Sales Tax: 8.25% on Services, 8.25% on Retail ]', width: '1/2' },
          { type: 'box', label: '[ Contractor TDS Withheld This Month: $412.50 ]', width: '1/2' },
        ],
      },
    ],
  },
  {
    id: 50,
    name: 'Reports',
    cluster: 'Business Admin',
    description: 'P&L exports, staff productivity rankings, client retention, and retail sales.',
    sections: [
      {
        sectionId: 'reporting-suite',
        title: 'Analytics & Financial Reporting',
        blocks: [
          { type: 'button', label: '[ Export Monthly P&L (CSV / PDF) ]', width: '1/3' },
          { type: 'placeholder', label: '[ REVENUE BY CATEGORY & STAFF PRODUCTIVITY CHARTS ]', width: 'full', height: 'h-36' },
        ],
      },
    ],
  },
  {
    id: 51,
    name: 'Business Settings',
    cluster: 'Business Admin',
    description: 'Salon operational rules, cancellation window, notifications, and security.',
    sections: [
      {
        sectionId: 'settings-tabs',
        title: 'System Preferences & Security',
        blocks: [
          { type: 'box', label: '[ Cancellation Window: 24 Hours Required ]', width: '1/2' },
          { type: 'box', label: '[ SMS & Email Reminders: 24h & 2h before slot ]', width: '1/2' },
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // CLUSTER 7: STAFF (52 - 56)
  // ----------------------------------------------------
  {
    id: 52,
    name: 'Staff Dashboard',
    cluster: 'Staff',
    description: 'Stylist/therapist personal workspace, today appointments, and tips earned.',
    sections: [
      {
        sectionId: 'staff-home',
        title: 'Personal Staff Workspace',
        blocks: [
          { type: 'text', label: '[ Welcome, Julian · Chair 1 · Today shift: 09:00 - 18:00 ]', width: 'full' },
          { type: 'metric', label: '[ 6 Appointments Today ]', width: '1/3' },
          { type: 'metric', label: '[ Next Client: Jane Doe in 20 mins ]', width: '1/3' },
          { type: 'metric', label: '[ Today Tips: $65.00 ]', width: '1/3' },
        ],
      },
    ],
  },
  {
    id: 53,
    name: 'Staff Calendar',
    cluster: 'Staff',
    description: 'Personal day and week calendar showing client appointments and break buffers.',
    sections: [
      {
        sectionId: 'staff-cal',
        title: 'Personal Appointment Calendar',
        blocks: [
          { type: 'placeholder', label: '[ TIMELINE SCHEDULE: 09:00 - 18:00 with assigned appointments ]', width: 'full', height: 'h-40' },
        ],
      },
    ],
  },
  {
    id: 54,
    name: 'Staff Booking Details',
    cluster: 'Staff',
    description: 'Client consultation drawer with treatment formulas, allergy flags, and status.',
    sections: [
      {
        sectionId: 'consultation-drawer',
        title: 'Client Service Execution Drawer',
        blocks: [
          { type: 'box', label: '[ Client: Jane Doe · Cut & Fade · Formula: Demi-perm 5N (1:1 with 10 vol) ]', width: 'full' },
          { type: 'badge', label: 'ALLERGY WARNING: SENSITIVE SKIN', width: 'full' },
          { type: 'button', label: '[ Mark: In Service ]', width: '1/3' },
          { type: 'button', label: '[ Mark: Completed ]', width: '1/3' },
          { type: 'button', label: '[ Mark: No-Show ]', width: '1/3' },
        ],
      },
    ],
  },
  {
    id: 55,
    name: 'Staff Availability',
    cluster: 'Staff',
    description: 'Weekly preferred shift editor and time-off request submission.',
    sections: [
      {
        sectionId: 'staff-shifts',
        title: 'Working Hours & Leave Requests',
        blocks: [
          { type: 'box', label: '[ Weekly Availability: Mon, Tue, Thu, Fri, Sat (09:00 - 18:00) ]', width: 'full' },
          { type: 'button', label: '[ Request Time-Off / Shift Swap ]', width: '1/3' },
        ],
      },
    ],
  },
  {
    id: 56,
    name: 'Staff Profile',
    cluster: 'Staff',
    description: 'Public bio, specialties, portfolio photo, and license credential uploads.',
    sections: [
      {
        sectionId: 'staff-profile-form',
        title: 'Professional Bio & Certificates',
        blocks: [
          { type: 'input', label: '[ Bio: Master Barber specializing in skin fades and straight razor work ]', width: 'full' },
          { type: 'box', label: '[ Uploaded License: Master Barber #LIC-98421 · Status: Verified ]', width: 'full' },
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // CLUSTER 8: SUPER ADMIN (57 - 66)
  // ----------------------------------------------------
  {
    id: 57,
    name: 'Platform Dashboard',
    cluster: 'Super Admin',
    description: 'Platform operator console: GMV stream, active tenant count, and health telemetry.',
    sections: [
      {
        sectionId: 'platform-kpis',
        title: 'Platform-Wide Telemetry',
        blocks: [
          { type: 'metric', label: '[ Total Active Salons: 1,248 ]', width: '1/4' },
          { type: 'metric', label: '[ Platform GMV (30d): $4.18M ]', width: '1/4' },
          { type: 'metric', label: '[ SaaS MRR: $186,000 ]', width: '1/4' },
          { type: 'metric', label: '[ System Health: 99.98% ]', width: '1/4' },
        ],
      },
    ],
  },
  {
    id: 58,
    name: 'Businesses',
    cluster: 'Super Admin',
    description: 'Global multi-tenant registry of all registered salon accounts.',
    sections: [
      {
        sectionId: 'tenant-registry',
        title: 'Global Tenant Registry',
        blocks: [
          { type: 'table', label: '[ TABLE: Business Name | Category | Subdomain | Tier | GMV | Status | Action ]', width: 'full', height: 'h-36' },
        ],
      },
    ],
  },
  {
    id: 59,
    name: 'Templates',
    cluster: 'Super Admin',
    description: 'Master template library and component code scaffolding repository.',
    sections: [
      {
        sectionId: 'templates-catalog',
        title: 'Platform Master Template Pool',
        blocks: [
          { type: 'table', label: '[ TABLE: Template Name | Compatible Categories | Active Tenants | Version ]', width: 'full', height: 'h-36' },
        ],
      },
    ],
  },
  {
    id: 60,
    name: 'Categories',
    cluster: 'Super Admin',
    description: '10 category engine definitions, default taxonomies, and pre-seeded service menus.',
    sections: [
      {
        sectionId: 'category-engine-admin',
        title: 'Category Engine Control',
        blocks: [
          { type: 'table', label: '[ TABLE: Category Slug | Display Name | Default Template | License Gate | Actions ]', width: 'full', height: 'h-36' },
        ],
      },
    ],
  },
  {
    id: 61,
    name: 'Transactions',
    cluster: 'Super Admin',
    description: 'Cross-tenant transactional volume and payment gateway failover monitoring.',
    sections: [
      {
        sectionId: 'global-tx',
        title: 'Global Payment Stream',
        blocks: [
          { type: 'table', label: '[ TABLE: Global Tx ID | Salon | Gateway | Amount | Platform Take | Status ]', width: 'full', height: 'h-36' },
        ],
      },
    ],
  },
  {
    id: 62,
    name: 'Commission',
    cluster: 'Super Admin',
    description: 'Platform take-rate fee accounting and SaaS subscription revenue streams.',
    sections: [
      {
        sectionId: 'platform-revenue',
        title: 'Platform Revenue & Take-Rate Accounting',
        blocks: [
          { type: 'box', label: '[ Platform Take-Rate: 2.5% on Transactions · SaaS Subscriptions: $99 / $249 mo ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 63,
    name: 'Settlements',
    cluster: 'Super Admin',
    description: 'Global payout escrow ledger, automated merchant clearing, and reserve balances.',
    sections: [
      {
        sectionId: 'global-escrow',
        title: 'Global Merchant Clearing & Escrow',
        blocks: [
          { type: 'box', label: '[ Escrow Balance Held: $340,210.00 · Payout Clearing: Automated Daily ]', width: 'full' },
        ],
      },
    ],
  },
  {
    id: 64,
    name: 'Tax Rules',
    cluster: 'Super Admin',
    description: 'Cross-jurisdiction statutory tax schedules, GST/VAT rules, and TDS rates.',
    sections: [
      {
        sectionId: 'global-tax',
        title: 'Tax Engine Jurisdiction Configuration',
        blocks: [
          { type: 'table', label: '[ TABLE: Jurisdiction | Tax Code | Service Rate | Retail Rate | TDS Withholding ]', width: 'full', height: 'h-36' },
        ],
      },
    ],
  },
  {
    id: 65,
    name: 'Audit Logs',
    cluster: 'Super Admin',
    description: 'Immutable multi-tenant forensic audit logs and security event monitoring.',
    sections: [
      {
        sectionId: 'security-audit',
        title: 'Immutable Security & Forensic Audit Trail',
        blocks: [
          { type: 'table', label: '[ TABLE: Timestamp | Actor | Tenant ID | Action | IP Address | Integrity Hash ]', width: 'full', height: 'h-36' },
        ],
      },
    ],
  },
  {
    id: 66,
    name: 'Platform Settings',
    cluster: 'Super Admin',
    description: 'Global feature flags, API gateway configs, system rate limits, and infrastructure.',
    sections: [
      {
        sectionId: 'infra-settings',
        title: 'Global Platform Configuration',
        blocks: [
          { type: 'box', label: '[ Maintenance Mode: OFF | Dynamic Rate Limiting: 120 req/min | Encryption: AES-256 ]', width: 'full' },
        ],
      },
    ],
  },
];
