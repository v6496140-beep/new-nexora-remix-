// Nexora SalonOS — Phase 2.4 Booking Experience UI Specification Data

export interface BookingStepSpec {
  stepNumber: number;
  id: string;
  name: string;
  title: string;
  subtitle: string;
  purpose: string;
  componentsUsed: string[];
  dataRequired: string[];
  desktopLayout: string;
  mobileLayout: string;
  states: {
    stateName: string;
    description: string;
  }[];
  errorState: string;
  emptyState: string;
  loadingState: string;
}

export interface TimeSlotItem {
  id: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  status: 'Available' | 'Selected' | 'Unavailable' | 'Booked' | 'Past';
}

export interface MockBookingStaff {
  id: string;
  name: string;
  role: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  avatarUrl: string;
  isAvailableToday: boolean;
  nextSlotTime: string;
}

export interface BookingFinancialModel {
  currency: string;
  subtotal: number;
  tenantAdvancePercentage: number; // Configurable: 25% by default, 0% to 100%
  advancePayable: number;
  balancePayableAtVenue: number;
  taxIncluded: boolean;
}

// 1. ALL 9 BOOKING STEPS SPECIFICATIONS
export const BOOKING_STEPS_9: BookingStepSpec[] = [
  // Step 1: Select Service
  {
    stepNumber: 1,
    id: 'step-service',
    name: '1. Select Service',
    title: 'Choose Your Treatment or Cut',
    subtitle: 'Browse our signature treatments with transparent duration and advance deposit pricing.',
    purpose: 'Allows customer to select primary haircut, skin treatment, nail set, or tattoo consultation.',
    componentsUsed: ['GalleryFilter', 'ServiceCard', 'PriceDisplay', 'BookNowButton'],
    dataRequired: ['Service list categorized by tags', 'Service ID, name, description, duration, price, discount, staff availability'],
    desktopLayout: '2-column browser: Left side shows category filter pills and search; Right side shows 2-column ServiceCards with live price breakdown.',
    mobileLayout: 'Single-column full width stacked cards with sticky top category horizontal chip bar and instant "Select" buttons (min-height 48px).',
    states: [
      { stateName: 'Default', description: 'Clean white card, 1px neutral-200 border, visible duration badge.' },
      { stateName: 'Selected', description: '2px solid primary ring, checkmark badge, advance deposit highlight.' },
      { stateName: 'Discounted', description: 'Strikethrough original price with green savings tag.' }
    ],
    errorState: 'Banner: "Unable to load service catalog for this branch. Please tap to retry."',
    emptyState: 'Illustration: "No treatments found matching your keyword" + [Clear Filter] button.',
    loadingState: 'Pulsing skeleton service card placeholders with shimmering duration and price chips.'
  },

  // Step 2: Select Package (Optional)
  {
    stepNumber: 2,
    id: 'step-package',
    name: '2. Select Package (Optional)',
    title: 'Add a Bundled Ritual or Skip',
    subtitle: 'Upgrade your appointment to a multi-service package to save up to 25%.',
    purpose: 'Offers bundled transformations before specialist selection, with a prominent "Skip to Stylist" action.',
    componentsUsed: ['PackageCard', 'PriceDisplay', 'BookNowButton'],
    dataRequired: ['Package list with included treatments checklist, duration, bundle price, savings badge'],
    desktopLayout: 'Centered 3-column bundle cards with top banner: [Skip this step -> Continue with single service].',
    mobileLayout: 'Single-column stacked bundle cards with sticky bottom action row: [Skip Package] and [Select Bundle].',
    states: [
      { stateName: 'Default', description: 'Card displaying bundle savings tag (e.g. "Save ₹400").' },
      { stateName: 'Selected', description: 'Border shifts to primary accent color; replaces single service in summary ledger.' },
      { stateName: 'Skipped', description: 'Customer taps "Skip to Stylist" to proceed without adding a package.' }
    ],
    errorState: 'Inline notice: "Packages could not be loaded. Continuing with selected service."',
    emptyState: 'Clean notice: "No bundled packages currently available for this category." Auto-skips to Step 3.',
    loadingState: 'Skeleton bundle cards with animated lines.'
  },

  // Step 3: Select Staff
  {
    stepNumber: 3,
    id: 'step-staff',
    name: '3. Select Specialist',
    title: 'Choose Your Specialist or Stylist',
    subtitle: 'Select a dedicated artist or choose "Any Available Staff" for the quickest available appointment.',
    purpose: 'Allows client to pick their favorite stylist or opt for automatic availability assignment.',
    componentsUsed: ['StaffCard', 'RatingDisplay', 'BookNowButton'],
    dataRequired: ['Staff roster with avatar, name, role title, specialization tags, rating score, today availability dot, next slot'],
    desktopLayout: 'Prominent top card: "⚡ Any Available Specialist (Fastest appointment)"; followed by 3-column specialist team grid.',
    mobileLayout: 'Top full-width card for "Any Available Specialist"; followed by 2-column avatar grid or vertical cards with 48px tap targets.',
    states: [
      { stateName: 'Any Available (Active)', description: 'Selected by default with lightning bolt badge for maximum flexibility.' },
      { stateName: 'Specific Specialist Selected', description: '2px solid primary ring around card with green checkmark.' },
      { stateName: 'Off Duty Today', description: 'Muted grayscale card with badge "Available on Thursday".' }
    ],
    errorState: 'Banner: "Specialist schedule could not be refreshed. Defaulting to Any Available Staff."',
    emptyState: 'Card: "All specialists are fully booked today. Checking next available dates."',
    loadingState: 'Circular avatar skeletons with shimmer blocks.'
  },

  // Step 4: Select Date
  {
    stepNumber: 4,
    id: 'step-date',
    name: '4. Select Date',
    title: 'Select Appointment Date',
    subtitle: 'Choose a date from the interactive booking calendar. Available dates are highlighted.',
    purpose: 'Renders accessible month/day picker showing available and fully booked dates.',
    componentsUsed: ['Calendar', 'BookNowButton'],
    dataRequired: ['Current month calendar matrix, available days array, holiday/closed days array, today date'],
    desktopLayout: 'Side-by-side: Month calendar view (320px width) on left with available date highlight dots.',
    mobileLayout: 'Top 7-day horizontal scrollable date strip with quick month picker toggle; today date highlighted.',
    states: [
      { stateName: 'Available Date', description: 'Black or dark slate text on white; clickable; hover bg-slate-100.' },
      { stateName: 'Selected Date', description: 'Solid deep slate / primary accent circle with white bold text.' },
      { stateName: 'Unavailable / Closed', description: 'Light gray text (neutral-300), non-interactive, diagonal strike.' },
      { stateName: 'Past Date', description: 'Disabled, pointer-events none.' }
    ],
    errorState: 'Alert: "Unable to retrieve calendar availability. Please check internet connection."',
    emptyState: 'Notice: "No slots remaining for this month. Tap to view next month."',
    loadingState: 'Calendar grid with pulsing date cells.'
  },

  // Step 5: Select Time
  {
    stepNumber: 5,
    id: 'step-time',
    name: '5. Select Time Slot',
    title: 'Choose Your Start Time',
    subtitle: 'Time slots are filtered by Morning, Afternoon, and Evening windows based on specialist availability.',
    purpose: 'Allows customer to reserve precise 15-minute start window for their appointment.',
    componentsUsed: ['GalleryFilter', 'BookNowButton'],
    dataRequired: ['Time slots array for selected date and specialist with status: Available, Booked, Past'],
    desktopLayout: 'Organized into 3 period sections: Morning (9 AM–12 PM), Afternoon (12 PM–5 PM), Evening (5 PM–9 PM). 4-column slot buttons.',
    mobileLayout: 'Segmented tabs for Morning / Afternoon / Evening; 3-column touch slot buttons (min-height 44px).',
    states: [
      { stateName: 'Available Slot', description: 'White background, 1px border neutral-300, dark text, hover:bg-slate-50.' },
      { stateName: 'Selected Slot', description: 'Bg-slate-900 text-white font-semibold shadow-xs.' },
      { stateName: 'Booked Slot', description: 'Bg-neutral-100 text-neutral-400 line-through cursor-not-allowed.' },
      { stateName: 'Past Slot', description: 'Disabled if time has already passed today.' }
    ],
    errorState: 'Notice: "This time slot was just booked by another customer. Please choose an adjacent slot."',
    emptyState: 'Card: "All slots taken on this day. Would you like to check tomorrow?" + [Check Tomorrow] CTA.',
    loadingState: 'Pulsing rectangular pill slots.'
  },

  // Step 6: Customer Details
  {
    stepNumber: 6,
    id: 'step-details',
    name: '6. Customer Details',
    title: 'Your Contact Information',
    subtitle: 'Mobile-first and minimal. We only request essential contact information for appointment confirmation.',
    purpose: 'Captures full name, mobile phone number, and optional styling note with zero friction.',
    componentsUsed: ['BookNowButton'],
    dataRequired: ['Customer full name, mobile number (+91), optional email for calendar sync, optional stylist notes'],
    desktopLayout: '2-column form card (max-width 560px): Name + Mobile in row 1; Email + Notes in row 2.',
    mobileLayout: 'Single-column form with large 48px touch inputs; tel keyboard auto-triggers on phone field; no unnecessary address fields.',
    states: [
      { stateName: 'Default', description: 'Clean white inputs with neutral-300 borders and clear floating labels.' },
      { stateName: 'Focused', description: '2px solid primary ring with zero layout shift.' },
      { stateName: 'Error', description: '1.5px solid red-600 with explicit error text: "Please enter a valid 10-digit mobile number".' }
    ],
    errorState: 'Field error alert: "Mobile number is required for SMS and WhatsApp pass delivery."',
    emptyState: 'Fresh clean form; pre-fills client name and phone if customer is already signed in.',
    loadingState: 'Disabled form with subtle spinner on continue button.'
  },

  // Step 7: Booking Summary
  {
    stepNumber: 7,
    id: 'step-summary',
    name: '7. Booking Summary & Breakdown',
    title: 'Review Appointment Details',
    subtitle: 'Verify treatment details, specialist, scheduled time, and transparent advance deposit calculation.',
    purpose: 'Provides complete transparency on the 25% configurable advance deposit and balance due at venue.',
    componentsUsed: ['PriceDisplay', 'BookNowButton'],
    dataRequired: ['Salon title & address, service title, specialist name, date string, time slot, subtotal, configurable advance percentage'],
    desktopLayout: 'Contained summary card with itemized line items, digital receipt breakdown, and prominent [Proceed to Advance Payment] CTA.',
    mobileLayout: 'Compact digital receipt card with tabular numbers and bold green highlight for advance payable now.',
    states: [
      { stateName: 'Default', description: 'Itemized summary showing Subtotal: ₹1,000, Advance Deposit (25%): ₹250, Balance at Salon: ₹750.' },
      { stateName: 'Rescheduling', description: 'Highlights modified date and time slots.' }
    ],
    errorState: 'Alert: "Slot reservation expired after 10 minutes of inactivity. Please reselect your slot."',
    emptyState: 'Warning if service or date is missing, prompting return to Step 1.',
    loadingState: 'Receipt skeleton with shimmer lines.'
  },

  // Step 8: Advance Payment
  {
    stepNumber: 8,
    id: 'step-payment',
    name: '8. Advance Payment UI',
    title: 'Pay Advance Deposit to Confirm',
    subtitle: 'A small advance deposit secures your appointment and prevents no-shows. The remainder is paid at the salon.',
    purpose: 'Payment options UI (UPI, Credit/Debit Card, NetBanking) with clear deposit disclosures (No real gateway).',
    componentsUsed: ['BookNowButton'],
    dataRequired: ['Advance amount payable (e.g. ₹250), available payment methods list, salon cancellation policy note'],
    desktopLayout: '2-column payment layout: Left shows payment method tabs (UPI QR, Card, NetBanking); Right shows sticky deposit summary.',
    mobileLayout: 'Instant 1-tap UPI app icons (GPay, PhonePe, Paytm) at top, followed by Card accordion; sticky bottom [Pay ₹250] button.',
    states: [
      { stateName: 'Method Selected', description: 'Active radio button and highlight border on chosen payment option.' },
      { stateName: 'Processing UI', description: 'Button shows spinner and "Securing your appointment..." label.' }
    ],
    errorState: 'Payment simulation failure: "Transaction declined by bank. Please try alternate UPI app or card."',
    emptyState: 'N/A',
    loadingState: 'Processing spinner overlay with lock icon.'
  },

  // Step 9: Confirmation
  {
    stepNumber: 9,
    id: 'step-confirmation',
    name: '9. Booking Confirmation',
    title: 'Appointment Confirmed!',
    subtitle: 'Your chair is reserved. A digital pass and calendar invite have been delivered to your mobile number.',
    purpose: 'Celebratory confirmation screen rendering digital QR boarding pass, appointment codes, and direction links.',
    componentsUsed: ['BookNowButton'],
    dataRequired: ['Booking confirmation ID, QR code payload, service, specialist, date, time, advance paid, remaining amount, address'],
    desktopLayout: 'Centered boarding pass card (max-width 560px) with green checkmark circle, QR check-in code, and [View My Booking] CTA.',
    mobileLayout: 'Mobile digital boarding pass style with instant [Add to Google / Apple Wallet], [WhatsApp Share], and [View My Booking] button.',
    states: [
      { stateName: 'Confirmed Success', description: 'Emerald checkmark badge, bold booking code, full appointment specs.' }
    ],
    errorState: 'Fallback: "Booking created with ID #NEX-88219. SMS receipt sent. Please contact salon if QR pass does not load."',
    emptyState: 'N/A',
    loadingState: 'Success checkmark entrance animation.'
  }
];

// 2. TIME SLOT MATRIX (Morning, Afternoon, Evening)
export const MOCK_TIME_SLOTS: TimeSlotItem[] = [
  // Morning (9 AM - 12 PM)
  { id: 't-0900', time: '09:00 AM', period: 'Morning', status: 'Past' },
  { id: 't-0945', time: '09:45 AM', period: 'Morning', status: 'Booked' },
  { id: 't-1030', time: '10:30 AM', period: 'Morning', status: 'Available' },
  { id: 't-1115', time: '11:15 AM', period: 'Morning', status: 'Selected' },
  // Afternoon (12 PM - 5 PM)
  { id: 't-1200', time: '12:00 PM', period: 'Afternoon', status: 'Available' },
  { id: 't-0130', time: '01:30 PM', period: 'Afternoon', status: 'Available' },
  { id: 't-0245', time: '02:45 PM', period: 'Afternoon', status: 'Booked' },
  { id: 't-0330', time: '03:30 PM', period: 'Afternoon', status: 'Available' },
  { id: 't-0415', time: '04:15 PM', period: 'Afternoon', status: 'Available' },
  // Evening (5 PM - 9 PM)
  { id: 't-0500', time: '05:00 PM', period: 'Evening', status: 'Available' },
  { id: 't-0600', time: '06:00 PM', period: 'Evening', status: 'Booked' },
  { id: 't-0700', time: '07:00 PM', period: 'Evening', status: 'Available' },
  { id: 't-0800', time: '08:00 PM', period: 'Evening', status: 'Available' }
];

// 3. STAFF ROSTER (Including "Any Available Staff")
export const MOCK_BOOKING_STAFF: MockBookingStaff[] = [
  {
    id: 'staff-any',
    name: 'Any Available Specialist',
    role: 'Fastest Available Slot',
    specialization: 'Automated allocation to first available master stylist',
    rating: 4.9,
    reviewCount: 520,
    avatarUrl: '',
    isAvailableToday: true,
    nextSlotTime: '10:30 AM Today'
  },
  {
    id: 'staff-marco',
    name: 'Marco Silva',
    role: 'Master Barber & Fade Specialist',
    specialization: 'Precision Skin Fades, Beard Sculpting & Razor Finishes',
    rating: 4.95,
    reviewCount: 340,
    avatarUrl: '',
    isAvailableToday: true,
    nextSlotTime: '11:15 AM Today'
  },
  {
    id: 'staff-priya',
    name: 'Priya Sharma',
    role: 'Senior Hair Colorist & Stylist',
    specialization: 'Balayage, Dimensional Highlights & Keratin Repair',
    rating: 4.92,
    reviewCount: 285,
    avatarUrl: '',
    isAvailableToday: true,
    nextSlotTime: '12:00 PM Today'
  },
  {
    id: 'staff-david',
    name: 'David Chen',
    role: 'Traditional Shave Artisan',
    specialization: 'Hot Lather Straight Razor Shaves & Scalp Therapies',
    rating: 4.88,
    reviewCount: 190,
    avatarUrl: '',
    isAvailableToday: false,
    nextSlotTime: 'Tomorrow at 10:00 AM'
  }
];

// 4. CONFIGURABLE FINANCIAL MODEL
export const DEFAULT_BOOKING_FINANCIAL_MODEL: BookingFinancialModel = {
  currency: '₹',
  subtotal: 1000,
  tenantAdvancePercentage: 25, // Configurable tenant property: e.g. 25% (or 0%, 50%, 100%)
  advancePayable: 250,
  balancePayableAtVenue: 750,
  taxIncluded: true
};
