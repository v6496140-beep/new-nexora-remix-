// Nexora SalonOS — Phase 2.5 Customer Experience Data Specification

export interface CustomerScreenSpec {
  screenNumber: number;
  id: string;
  name: string;
  route: string;
  purpose: string;
  primaryUser: string;
  layoutStructure: string[];
  componentsUsed: string[];
  desktopLayout: string;
  mobileLayout: string;
  actions: string[];
  statesHandled: string[];
}

export type BookingStatusType = 'Confirmed' | 'Payment Pending' | 'Completed' | 'Cancelled';

export interface CustomerBookingCard {
  id: string;
  bookingCode: string;
  serviceName: string;
  category: string;
  staffName: string;
  staffRole: string;
  date: string;
  time: string;
  totalAmount: number;
  advancePaid: number;
  remainingAmount: number;
  status: BookingStatusType;
  qrCodeToken: string;
  salonName: string;
  salonAddress: string;
  canReschedule: boolean;
  canCancel: boolean;
  rescheduleDeadline: string;
}

export interface UIStateSpec {
  stateId: string;
  stateName: string;
  badgeColor: string;
  description: string;
  visualSpec: string;
  actionAvailable: string;
}

// 1. ALL 8 CUSTOMER SCREENS SPECIFICATIONS
export const CUSTOMER_SCREENS_8: CustomerScreenSpec[] = [
  // 1. Customer Dashboard
  {
    screenNumber: 1,
    id: 'cust-dashboard',
    name: '1. Customer Dashboard',
    route: '/account',
    purpose: 'Central account landing overview greeting returning client with next immediate upcoming appointment pass, quick rebooking actions, and reward points balance.',
    primaryUser: 'Authenticated salon client',
    layoutStructure: [
      '1. Account Navigation Header',
      '2. Customer Greeting Banner ("Welcome back, Rahul")',
      '3. Active Next Appointment Hero Card (QR Pass + Countdown)',
      '4. Quick Action Shortcuts (Book Appointment, View History, Update Profile)',
      '5. Favorite Stylists / Frequent Services Quick Re-book Strip',
      '6. Recent Notifications & SMS Alerts'
    ],
    componentsUsed: ['Navbar', 'PriceDisplay', 'BookNowButton', 'RatingDisplay'],
    desktopLayout: '2-column dashboard: Left 8-col shows active upcoming pass hero + recent activity; Right 4-col shows profile summary, loyalty points, and favorite stylists.',
    mobileLayout: 'Single-column vertical stack with large digital QR pass at top, followed by 48px action buttons.',
    actions: ['View QR Boarding Pass', 'Reschedule Slot', 'Cancel Appointment', 'Book New Service'],
    statesHandled: ['Loading', 'Empty', 'Confirmed', 'Payment Pending']
  },

  // 2. Upcoming Booking
  {
    screenNumber: 2,
    id: 'cust-upcoming',
    name: '2. Upcoming Booking',
    route: '/account/upcoming',
    purpose: 'Dedicated digital pass screen for the very next scheduled salon visit with real-time countdown, gate-check QR code, and directions.',
    primaryUser: 'Customer arriving at salon or preparing for appointment',
    layoutStructure: [
      '1. Breadcrumb: Account > Upcoming Booking',
      '2. Status Badge ("Confirmed" or "Payment Pending")',
      '3. Large Check-In QR Pass with alphanumeric verification PIN',
      '4. Scheduled Service & Specialist Metadata Block',
      '5. Financial Ledger: Total Amount, Advance Paid, Balance Due at Venue',
      '6. Interactive Map Directions & One-Tap Call Salon Button',
      '7. Action Bar: [Add to Wallet], [Reschedule], [Cancel Booking]'
    ],
    componentsUsed: ['PriceDisplay', 'BookNowButton', 'ContactSection', 'OpeningHours'],
    desktopLayout: 'Card container (max-width 640px) centered on screen with side-by-side QR pass and salon location directions.',
    mobileLayout: 'Full-viewport boarding pass with high contrast for easy scanner readability under salon desk scanners; persistent bottom action bar.',
    actions: ['Scan QR at Reception', 'Add to Apple / Google Wallet', 'Sync to Google Calendar', 'Reschedule Slot'],
    statesHandled: ['Confirmed', 'Payment Pending', 'Loading', 'Error']
  },

  // 3. Booking Details
  {
    screenNumber: 3,
    id: 'cust-details',
    name: '3. Booking Details',
    route: '/account/bookings/:id',
    purpose: 'Exhaustive historical ledger and receipt for any specific past, present, or cancelled appointment.',
    primaryUser: 'Client verifying charges, invoices, or stylist details',
    layoutStructure: [
      '1. Header with Booking Reference (#NEX-88219)',
      '2. Booking Lifecycle Timeline (Booked -> Advance Paid -> Confirmed -> Checked In -> Completed)',
      '3. Full Treatment Breakdown with duration and specialist info',
      '4. Tax Invoice & Payment Ledger (GST Breakdown, Advance Paid via UPI, Balance Paid via POS)',
      '5. Cancellation Policy Terms and Reschedule History',
      '6. Download PDF Invoice / Digital Tax Receipt Button'
    ],
    componentsUsed: ['PriceDisplay', 'BookNowButton', 'BusinessInfo'],
    desktopLayout: '2-column receipt layout: Left shows service and specialist breakdown; Right shows tax invoice ledger and timeline.',
    mobileLayout: 'Single-column scrollable receipt with collapsible tax breakdown.',
    actions: ['Download Tax Receipt', 'Rebook Same Service', 'Leave Review for Stylist'],
    statesHandled: ['Confirmed', 'Completed', 'Cancelled', 'Payment Pending']
  },

  // 4. Booking History
  {
    screenNumber: 4,
    id: 'cust-history',
    name: '4. Booking History',
    route: '/account/bookings',
    purpose: 'Comprehensive master list of all past, upcoming, completed, and cancelled appointments with multi-tab filtering.',
    primaryUser: 'Client tracking past styling sessions or reordering favorite services',
    layoutStructure: [
      '1. Filter Tabs: [Upcoming (2)] · [Completed (8)] · [Cancelled (1)] · [Pending (1)]',
      '2. Search & Date Filter Bar',
      '3. Responsive Booking Cards Grid / Stack',
      '4. Card Fields: ID, Service, Staff, Date, Time, Amount, Advance, Remaining, Status',
      '5. Direct One-Tap Rebook / Rate Stylist Action Triggers',
      '6. Pagination Controls'
    ],
    componentsUsed: ['GalleryFilter', 'PriceDisplay', 'BookNowButton'],
    desktopLayout: 'Table or structured card rows with quick filter tabs at top and direct invoice downloads.',
    mobileLayout: 'Horizontal swipeable tab strip; full-width stacked booking cards with 48px touch actions.',
    actions: ['Filter by Status', 'Inspect Details', 'One-Tap Rebook', 'Download Summary'],
    statesHandled: ['Loading', 'Empty', 'Success', 'Error']
  },

  // 5. Cancel Booking
  {
    screenNumber: 5,
    id: 'cust-cancel',
    name: '5. Cancel Booking',
    route: '/account/bookings/:id/cancel',
    purpose: 'Friction-aware cancellation flow clearly stating advance refund eligibility according to the 4-hour salon policy.',
    primaryUser: 'Client needing to cancel reservation',
    layoutStructure: [
      '1. Warning Banner: "Are you sure you want to cancel?"',
      '2. Booking Summary Card (Service, Specialist, Date, Time)',
      '3. Policy Transparency Ledger: Advance deposit refund rules',
      '4. Reason for Cancellation (Selector: Schedule Conflict, Sickness, Other)',
      '5. Alternative Suggestion: [Reschedule Instead (Keep Advance Safe)]',
      '6. Destructive Confirmation Trigger: [Confirm Cancellation]'
    ],
    componentsUsed: ['BookNowButton'],
    desktopLayout: 'Centered modal or dedicated page (max-width 520px) with red warning accents and clear policy terms.',
    mobileLayout: 'Bottom sheet drawer or full screen with high-contrast warning buttons; minimum 48px touch targets.',
    actions: ['Confirm Cancellation', 'Choose to Reschedule Instead', 'Return to Dashboard'],
    statesHandled: ['Loading', 'Success (Cancelled)', 'Error (Past Deadline)']
  },

  // 6. Reschedule Booking
  {
    screenNumber: 6,
    id: 'cust-reschedule',
    name: '6. Reschedule Booking',
    route: '/account/bookings/:id/reschedule',
    purpose: 'Seamless appointment date and time slot modification without forfeiting the paid advance deposit.',
    primaryUser: 'Client needing to shift their appointment time window',
    layoutStructure: [
      '1. Step Banner: "Select New Date & Time Slot"',
      '2. Current Appointment Badge: "Currently scheduled for Oct 15, 11:15 AM"',
      '3. Advance Protection Badge: "Your ₹250 advance deposit will transfer automatically"',
      '4. Interactive Month Calendar for Date Selection',
      '5. Available Time Slot Chips (Morning, Afternoon, Evening)',
      '6. Action Bar: [Confirm New Slot] and [Keep Original Time]'
    ],
    componentsUsed: ['Calendar', 'BookNowButton', 'PriceDisplay'],
    desktopLayout: 'Side-by-side calendar and slot selector with sticky original vs new appointment comparison card.',
    mobileLayout: 'Step 1: Date scroll strip -> Step 2: Time slot chips -> Sticky bottom [Confirm New Slot] button.',
    actions: ['Pick New Date', 'Pick New Slot', 'Confirm Reschedule', 'Cancel Reschedule'],
    statesHandled: ['Loading', 'Success (Rescheduled)', 'Error']
  },

  // 7. Payment Status
  {
    screenNumber: 7,
    id: 'cust-payment-status',
    name: '7. Payment Status',
    route: '/account/bookings/:id/payment',
    purpose: 'Real-time payment verification ledger displaying UPI/Card transaction IDs, advance deposit status, and remaining balance due at venue.',
    primaryUser: 'Client checking payment state or resolving pending advance',
    layoutStructure: [
      '1. Payment Status Icon & Headline ("Advance Deposit Paid: ₹250")',
      '2. Transaction Reference (#TXN-UPI-99482)',
      '3. Itemized Financial Breakdown (Subtotal, 25% Advance Paid, 75% Due at Salon)',
      '4. Payment Method Recorded (UPI - Google Pay)',
      '5. Pending Retry Action (if status is "Payment Pending"): [Retry UPI Advance]',
      '6. Download Payment Acknowledgment'
    ],
    componentsUsed: ['PriceDisplay', 'BookNowButton'],
    desktopLayout: 'Digital payment slip card (max-width 480px) centered with itemized ledger and print trigger.',
    mobileLayout: 'Full-screen mobile transaction receipt with shareable screenshot layout.',
    actions: ['Retry Advance Payment', 'Download Acknowledgment', 'Return to Booking'],
    statesHandled: ['Payment Pending', 'Confirmed', 'Completed', 'Error']
  },

  // 8. Profile
  {
    screenNumber: 8,
    id: 'cust-profile',
    name: '8. Profile & Preferences',
    route: '/account/profile',
    purpose: 'Customer settings hub managing personal contact info, styling preferences, notification channels, and privacy.',
    primaryUser: 'Returning customer updating contact or styling preferences',
    layoutStructure: [
      '1. Profile Avatar & Name Editor',
      '2. Contact Information (Full Name, Mobile Number, Email Address)',
      '3. Salon Styling Notes (e.g. Skin allergies, preferred haircut type)',
      '4. Notification Channels (SMS alerts, WhatsApp digital passes, Email invoices)',
      '5. Saved Payment Methods (Tokenized for fast advance settlement)',
      '6. Sign Out / Delete Account Options'
    ],
    componentsUsed: ['BookNowButton'],
    desktopLayout: '2-column settings layout: Left sidebar navigation; Right form fields with auto-save indicators.',
    mobileLayout: 'Single-column form with 48px touch inputs and sticky bottom [Save Changes] button.',
    actions: ['Update Mobile', 'Update Notes', 'Toggle WhatsApp Alerts', 'Sign Out'],
    statesHandled: ['Loading', 'Success (Saved)', 'Error (Validation)']
  }
];

// 2. MOCK BOOKINGS DATA (Supporting all 4 My Bookings tabs)
export const MOCK_CUSTOMER_BOOKINGS: CustomerBookingCard[] = [
  // 1. Upcoming Booking
  {
    id: 'b-101',
    bookingCode: 'NEX-88219',
    serviceName: 'Signature Skin Fade & Beard Sculpt',
    category: 'Barber Shop',
    staffName: 'Marco Silva',
    staffRole: 'Master Barber',
    date: 'Thu, Oct 15, 2026',
    time: '11:15 AM',
    totalAmount: 1000,
    advancePaid: 250,
    remainingAmount: 750,
    status: 'Confirmed',
    qrCodeToken: 'NEX-PASS-88219-MARCO-1115',
    salonName: 'Apex Grooming Lounge',
    salonAddress: 'Bandra West, Mumbai',
    canReschedule: true,
    canCancel: true,
    rescheduleDeadline: 'Oct 15, 07:15 AM (4 hours prior)'
  },
  // 2. Upcoming Booking 2
  {
    id: 'b-102',
    bookingCode: 'NEX-89042',
    serviceName: 'Traditional Hot Towel Straight Razor Shave',
    category: 'Barber Shop',
    staffName: 'David Chen',
    staffRole: 'Traditional Shave Artisan',
    date: 'Sat, Oct 24, 2026',
    time: '04:00 PM',
    totalAmount: 450,
    advancePaid: 112,
    remainingAmount: 338,
    status: 'Confirmed',
    qrCodeToken: 'NEX-PASS-89042-DAVID-0400',
    salonName: 'Apex Grooming Lounge',
    salonAddress: 'Bandra West, Mumbai',
    canReschedule: true,
    canCancel: true,
    rescheduleDeadline: 'Oct 24, 12:00 PM (4 hours prior)'
  },
  // 3. Payment Pending Booking
  {
    id: 'b-103',
    bookingCode: 'NEX-90114',
    serviceName: 'The Executive Grooming Ritual (Cut + Shave)',
    category: 'Barber Shop',
    staffName: 'Any Available Specialist',
    staffRole: 'First Available',
    date: 'Mon, Oct 19, 2026',
    time: '02:30 PM',
    totalAmount: 1150,
    advancePaid: 0,
    remainingAmount: 1150,
    status: 'Payment Pending',
    qrCodeToken: 'NEX-PENDING-90114',
    salonName: 'Apex Grooming Lounge',
    salonAddress: 'Bandra West, Mumbai',
    canReschedule: false,
    canCancel: true,
    rescheduleDeadline: 'Pending advance payment confirmation'
  },
  // 4. Completed Booking 1
  {
    id: 'b-104',
    bookingCode: 'NEX-77140',
    serviceName: 'Skin Fade & Scissor Texture Cut',
    category: 'Barber Shop',
    staffName: 'Marco Silva',
    staffRole: 'Master Barber',
    date: 'Sat, Sep 19, 2026',
    time: '10:30 AM',
    totalAmount: 650,
    advancePaid: 162,
    remainingAmount: 0,
    status: 'Completed',
    qrCodeToken: 'NEX-COMPLETED-77140',
    salonName: 'Apex Grooming Lounge',
    salonAddress: 'Bandra West, Mumbai',
    canReschedule: false,
    canCancel: false,
    rescheduleDeadline: 'N/A'
  },
  // 5. Completed Booking 2
  {
    id: 'b-105',
    bookingCode: 'NEX-72418',
    serviceName: 'Beard Sculpting & Lather Contour',
    category: 'Barber Shop',
    staffName: 'David Chen',
    staffRole: 'Shave Specialist',
    date: 'Fri, Aug 28, 2026',
    time: '05:15 PM',
    totalAmount: 400,
    advancePaid: 100,
    remainingAmount: 0,
    status: 'Completed',
    qrCodeToken: 'NEX-COMPLETED-72418',
    salonName: 'Apex Grooming Lounge',
    salonAddress: 'Bandra West, Mumbai',
    canReschedule: false,
    canCancel: false,
    rescheduleDeadline: 'N/A'
  },
  // 6. Cancelled Booking
  {
    id: 'b-106',
    bookingCode: 'NEX-69311',
    serviceName: 'Scalp Massage & Refresh Wash',
    category: 'Barber Shop',
    staffName: 'Marco Silva',
    staffRole: 'Master Barber',
    date: 'Wed, Jul 15, 2026',
    time: '12:00 PM',
    totalAmount: 350,
    advancePaid: 87,
    remainingAmount: 0,
    status: 'Cancelled',
    qrCodeToken: 'NEX-CANCELLED-69311',
    salonName: 'Apex Grooming Lounge',
    salonAddress: 'Bandra West, Mumbai',
    canReschedule: false,
    canCancel: false,
    rescheduleDeadline: 'Cancelled by client on Jul 14'
  }
];

// 3. UI STATE SPECIFICATIONS (All 8 Required States)
export const UI_STATES_8: UIStateSpec[] = [
  {
    stateId: 'loading',
    stateName: 'Loading State',
    badgeColor: 'bg-blue-100 text-blue-800',
    description: 'Displays when appointment data, availability calendars, or booking passes are being synchronized.',
    visualSpec: 'Pulsing skeleton rectangles matching card proportions with subtle shimmer animation; interactive controls disabled.',
    actionAvailable: 'N/A — User awaits synchronization.'
  },
  {
    stateId: 'empty',
    stateName: 'Empty State',
    badgeColor: 'bg-slate-100 text-slate-800',
    description: 'Displays when a client has zero bookings in a selected category (e.g. no pending or cancelled bookings).',
    visualSpec: 'Friendly calendar icon illustration, clear statement ("No upcoming appointments found"), and primary [Book Appointment] CTA button.',
    actionAvailable: 'Primary [Book Appointment Now] button.'
  },
  {
    stateId: 'success',
    stateName: 'Success State',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'Triggered after successful appointment booking, successful slot reschedule, or profile update.',
    visualSpec: 'Emerald checkmark circle, clear confirmation toast ("Appointment successfully rescheduled to Oct 18"), updated ledger.',
    actionAvailable: '[View Updated Booking Pass] or [Return to Dashboard].'
  },
  {
    stateId: 'error',
    stateName: 'Error State',
    badgeColor: 'bg-red-100 text-red-800',
    description: 'Triggered upon network failure, slot lock expiration, or cancellation attempt after policy deadline.',
    visualSpec: 'High-contrast red banner with alert triangle icon, plain-language error reason, and prominent [Retry] trigger.',
    actionAvailable: '[Retry Connection] or [Call Salon Support Directly].'
  },
  {
    stateId: 'cancelled',
    stateName: 'Cancelled State',
    badgeColor: 'bg-rose-100 text-rose-800',
    description: 'Status badge for an appointment that has been cancelled by customer or salon management.',
    visualSpec: 'Soft rose pill badge ("Cancelled"), strikethrough booking time, and explanatory refund notice.',
    actionAvailable: '[Rebook Service] or [View Cancellation Receipt].'
  },
  {
    stateId: 'payment_pending',
    stateName: 'Payment Pending State',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'Displays when chair slot is temporarily reserved but advance deposit payment is awaiting verification.',
    visualSpec: 'Warm amber warning badge ("Payment Pending - 12 mins left"), countdown timer, and [Complete Advance Payment] button.',
    actionAvailable: '[Pay ₹250 Advance Now via UPI] or [Cancel Reservation].'
  },
  {
    stateId: 'confirmed',
    stateName: 'Confirmed State',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'Standard active state for upcoming appointments with advance deposit verified.',
    visualSpec: 'Vibrant emerald badge ("Confirmed"), active QR check-in code pass, and [Reschedule] / [Cancel] action buttons.',
    actionAvailable: '[Add to Wallet], [Reschedule Slot], [Cancel Booking].'
  },
  {
    stateId: 'completed',
    stateName: 'Completed State',
    badgeColor: 'bg-slate-200 text-slate-800',
    description: 'Status badge for finished salon appointments with full balance settled at venue.',
    visualSpec: 'Neutral slate badge ("Completed"), final tax invoice link, and [Rate Stylist / Leave Review] button.',
    actionAvailable: '[Rebook This Cut], [Download Invoice], [Leave 5-Star Review].'
  }
];
