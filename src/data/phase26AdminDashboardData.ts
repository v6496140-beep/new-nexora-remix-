// Nexora SalonOS — Phase 2.6 Business Admin Dashboard UI Specification Data

export interface NavSectionItem {
  id: string;
  label: string;
  iconName: string;
  badge?: string;
  subItems?: { id: string; label: string; badge?: string }[];
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  change: string;
  isPositive: boolean;
  iconName: string;
  accentColor: string;
}

export interface AdminBookingRecord {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerInitials: string;
  serviceName: string;
  staffName: string;
  staffAvatar: string;
  date: string;
  time: string;
  duration: string;
  totalAmount: number;
  advancePaid: number;
  outstandingBalance: number;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  paymentMethod: string;
  notes?: string;
}

export interface StaffRecord {
  id: string;
  name: string;
  role: string;
  specialization: string;
  status: 'Active' | 'On Leave' | 'Break';
  availability: 'Available Today' | 'Booked Until 3 PM' | 'Off Duty';
  todayBookingsCount: number;
  rating: number;
  reviewCount: number;
  avatarInitials: string;
}

export interface FinanceSubScreenSpec {
  id: string;
  title: string;
  description: string;
  metrics: { label: string; value: string; hint: string }[];
  columns: string[];
  mockRows: Record<string, string | number>[];
}

// 1. MAIN NAVIGATION STRUCTURE
export const ADMIN_NAV_STRUCTURE: NavSectionItem[] = [
  { id: 'dashboard', label: 'Dashboard', iconName: 'LayoutDashboard' },
  {
    id: 'bookings-group',
    label: 'Appointments',
    iconName: 'CalendarCheck',
    badge: '14',
    subItems: [
      { id: 'bookings', label: 'All Bookings', badge: '14' },
      { id: 'calendar', label: 'Calendar View' }
    ]
  },
  { id: 'customers', label: 'Customers', iconName: 'Users' },
  {
    id: 'catalog-group',
    label: 'Catalog & Menu',
    iconName: 'Scissors',
    subItems: [
      { id: 'services', label: 'Services Menu' },
      { id: 'packages', label: 'Bundles & Packages' }
    ]
  },
  {
    id: 'staff-group',
    label: 'Team & Staff',
    iconName: 'UserCheck',
    subItems: [
      { id: 'staff', label: 'Staff Roster' },
      { id: 'availability', label: 'Weekly Availability' },
      { id: 'leave', label: 'Leave & Roster' }
    ]
  },
  {
    id: 'marketing-group',
    label: 'Content & Trust',
    iconName: 'Star',
    subItems: [
      { id: 'gallery', label: 'Portfolio Gallery' },
      { id: 'reviews', label: 'Client Reviews' }
    ]
  },
  {
    id: 'website-group',
    label: 'Website CMS',
    iconName: 'Globe',
    subItems: [
      { id: 'web-pages', label: 'Pages' },
      { id: 'web-sections', label: 'Sections' },
      { id: 'web-theme', label: 'Theme & Tokens' },
      { id: 'web-content', label: 'Content Copy' },
      { id: 'web-seo', label: 'SEO & Meta' }
    ]
  },
  {
    id: 'finance-group',
    label: 'Finance & Payouts',
    iconName: 'CreditCard',
    subItems: [
      { id: 'fin-payments', label: 'Payments' },
      { id: 'fin-transactions', label: 'Transactions' },
      { id: 'fin-commission', label: 'Commission' },
      { id: 'fin-qualification', label: 'Qualification' },
      { id: 'fin-settlements', label: 'Settlements' },
      { id: 'fin-tax', label: 'Tax / TDS' }
    ]
  },
  { id: 'reports', label: 'Reports & Analytics', iconName: 'BarChart3' },
  { id: 'settings', label: 'Settings', iconName: 'Settings' }
];

// 2. DASHBOARD SUMMARY CARDS (Strict 6 Cards)
export const DASHBOARD_METRIC_CARDS: MetricCardData[] = [
  {
    id: 'today-bookings',
    title: "Today's Bookings",
    value: '28',
    subtitle: '6 remaining today',
    change: '+16.5% vs yesterday',
    isPositive: true,
    iconName: 'Calendar',
    accentColor: 'blue'
  },
  {
    id: 'today-revenue',
    title: "Today's Revenue",
    value: '₹34,250',
    subtitle: 'Gross treatment value',
    change: '+22.4% vs last week',
    isPositive: true,
    iconName: 'IndianRupee',
    accentColor: 'emerald'
  },
  {
    id: 'pending-bookings',
    title: 'Pending Bookings',
    value: '4',
    subtitle: 'Awaiting advance payment',
    change: 'Auto-release in 15m',
    isPositive: false,
    iconName: 'Clock',
    accentColor: 'amber'
  },
  {
    id: 'completed-bookings',
    title: 'Completed Bookings',
    value: '18',
    subtitle: 'Finalized & settled',
    change: '98% on-time start',
    isPositive: true,
    iconName: 'CheckCircle2',
    accentColor: 'indigo'
  },
  {
    id: 'advance-collected',
    title: 'Advance Collected',
    value: '₹8,562',
    subtitle: '25% online deposits',
    change: '100% gateway verified',
    isPositive: true,
    iconName: 'ShieldCheck',
    accentColor: 'cyan'
  },
  {
    id: 'outstanding-amount',
    title: 'Outstanding Amount',
    value: '₹25,688',
    subtitle: 'To be settled at venue',
    change: 'Cash / Card / POS',
    isPositive: true,
    iconName: 'Wallet',
    accentColor: 'violet'
  }
];

// 3. BOOKINGS DATA (Supporting table, filters, drawer)
export const MOCK_ADMIN_BOOKINGS: AdminBookingRecord[] = [
  {
    id: 'bk-101',
    bookingCode: 'NEX-88219',
    customerName: 'Rahul Kapoor',
    customerPhone: '+91 98200 12345',
    customerInitials: 'RK',
    serviceName: 'Signature Skin Fade & Beard Sculpt',
    staffName: 'Marco Silva',
    staffAvatar: 'MS',
    date: '2026-10-15',
    time: '11:15 AM',
    duration: '45 mins',
    totalAmount: 1000,
    advancePaid: 250,
    outstandingBalance: 750,
    status: 'Confirmed',
    paymentMethod: 'UPI (GPay)',
    notes: 'Low fade on sides, keep length on top.'
  },
  {
    id: 'bk-102',
    bookingCode: 'NEX-88220',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 98199 44321',
    customerInitials: 'AD',
    serviceName: 'Balayage Color & Gloss Treatment',
    staffName: 'Priya Sharma',
    staffAvatar: 'PS',
    date: '2026-10-15',
    time: '12:00 PM',
    duration: '90 mins',
    totalAmount: 3800,
    advancePaid: 950,
    outstandingBalance: 2850,
    status: 'Confirmed',
    paymentMethod: 'Credit Card',
    notes: 'Warm honey blonde tones, patch test cleared.'
  },
  {
    id: 'bk-103',
    bookingCode: 'NEX-88221',
    customerName: 'Vikram Sethi',
    customerPhone: '+91 97690 88712',
    customerInitials: 'VS',
    serviceName: 'Executive Grooming Ritual',
    staffName: 'David Chen',
    staffAvatar: 'DC',
    date: '2026-10-15',
    time: '01:30 PM',
    duration: '75 mins',
    totalAmount: 1150,
    advancePaid: 0,
    outstandingBalance: 1150,
    status: 'Pending',
    paymentMethod: 'Awaiting UPI',
    notes: 'Requested quiet session.'
  },
  {
    id: 'bk-104',
    bookingCode: 'NEX-88214',
    customerName: 'Karan Mehra',
    customerPhone: '+91 99300 77123',
    customerInitials: 'KM',
    serviceName: 'Traditional Hot Lather Shave',
    staffName: 'Marco Silva',
    staffAvatar: 'MS',
    date: '2026-10-15',
    time: '09:30 AM',
    duration: '30 mins',
    totalAmount: 450,
    advancePaid: 112,
    outstandingBalance: 0,
    status: 'Completed',
    paymentMethod: 'UPI + Cash',
    notes: 'Client arrived 5m early, tipped specialist.'
  },
  {
    id: 'bk-105',
    bookingCode: 'NEX-88215',
    customerName: 'Rohan Gupta',
    customerPhone: '+91 98212 99881',
    customerInitials: 'RG',
    serviceName: 'Classic Scissor Taper Cut',
    staffName: 'David Chen',
    staffAvatar: 'DC',
    date: '2026-10-15',
    time: '10:15 AM',
    duration: '35 mins',
    totalAmount: 550,
    advancePaid: 138,
    outstandingBalance: 0,
    status: 'Completed',
    paymentMethod: 'UPI at POS',
    notes: 'Regular fortnightly cut.'
  },
  {
    id: 'bk-106',
    bookingCode: 'NEX-88208',
    customerName: 'Samir Joshi',
    customerPhone: '+91 98450 11992',
    customerInitials: 'SJ',
    serviceName: 'Beard Trim & Facial Cleanse',
    staffName: 'Marco Silva',
    staffAvatar: 'MS',
    date: '2026-10-15',
    time: '04:00 PM',
    duration: '40 mins',
    totalAmount: 600,
    advancePaid: 150,
    outstandingBalance: 0,
    status: 'Cancelled',
    paymentMethod: 'Refunded to UPI',
    notes: 'Client cancelled >4h prior due to travel.'
  }
];

// 4. STAFF ROSTER DATA
export const MOCK_ADMIN_STAFF: StaffRecord[] = [
  {
    id: 'st-01',
    name: 'Marco Silva',
    role: 'Master Barber & Director',
    specialization: 'Precision Skin Fades, Beard Sculpting, Razor Work',
    status: 'Active',
    availability: 'Booked Until 3 PM',
    todayBookingsCount: 8,
    rating: 4.95,
    reviewCount: 342,
    avatarInitials: 'MS'
  },
  {
    id: 'st-02',
    name: 'Priya Sharma',
    role: 'Lead Colorist & Senior Stylist',
    specialization: 'Balayage, Dimensional Highlights, Keratin Therapy',
    status: 'Active',
    availability: 'Available Today',
    todayBookingsCount: 6,
    rating: 4.92,
    reviewCount: 289,
    avatarInitials: 'PS'
  },
  {
    id: 'st-03',
    name: 'David Chen',
    role: 'Shave Artisan & Stylist',
    specialization: 'Hot Lather Straight Razor, Beard Contouring, Scalp Rituals',
    status: 'Active',
    availability: 'Available Today',
    todayBookingsCount: 7,
    rating: 4.88,
    reviewCount: 194,
    avatarInitials: 'DC'
  },
  {
    id: 'st-04',
    name: 'Aisha Khan',
    role: 'Senior Aesthetician & Skin Expert',
    specialization: 'Hydrafacial MD, Organic Peels, Bridal Skin Prep',
    status: 'On Leave',
    availability: 'Off Duty',
    todayBookingsCount: 0,
    rating: 4.97,
    reviewCount: 215,
    avatarInitials: 'AK'
  }
];

// 5. FINANCE SUB-SCREENS (6 Required Screens)
export const FINANCE_SUB_SCREENS: Record<string, FinanceSubScreenSpec> = {
  payments: {
    id: 'fin-payments',
    title: 'Payments Overview',
    description: 'Comprehensive overview of advance collections, at-venue collections, and payment gateway health.',
    metrics: [
      { label: 'Total Volume (MTD)', value: '₹4,82,500', hint: '142 total bookings' },
      { label: 'Online Advance (25%)', value: '₹1,20,625', hint: 'Collected via UPI & Card' },
      { label: 'Venue Collections (75%)', value: '₹3,61,875', hint: 'POS Card & Cash' },
      { label: 'Gateway Success Rate', value: '99.4%', hint: 'Zero stuck settlements' }
    ],
    columns: ['Payment ID', 'Booking Code', 'Customer', 'Type', 'Amount', 'Method', 'Gateway Ref', 'Status'],
    mockRows: [
      { paymentId: 'PAY-1089', bookingCode: 'NEX-88219', customer: 'Rahul Kapoor', type: 'Advance (25%)', amount: '₹250', method: 'UPI (GPay)', ref: 'TXN-UPI-99482', status: 'Captured' },
      { paymentId: 'PAY-1090', bookingCode: 'NEX-88220', customer: 'Ananya Deshmukh', type: 'Advance (25%)', amount: '₹950', method: 'Credit Card', ref: 'TXN-CC-88192', status: 'Captured' },
      { paymentId: 'PAY-1091', bookingCode: 'NEX-88214', customer: 'Karan Mehra', type: 'Venue Balance', amount: '₹338', method: 'POS Card', ref: 'POS-REC-4412', status: 'Settled' }
    ]
  },
  transactions: {
    id: 'fin-transactions',
    title: 'Transaction Audit Trail',
    description: 'Immutable ledger of every financial event, fee deduction, gateway debit, and customer credit.',
    metrics: [
      { label: 'Today Transactions', value: '42 Events', hint: '38 Credits / 4 Refunds' },
      { label: 'Net Inflow Today', value: '₹32,450', hint: 'After gateway fees' },
      { label: 'Gateway Processing Fees', value: '₹649', hint: 'Avg 1.8% MDR' },
      { label: 'Failed / Retried Events', value: '1', hint: 'Resolved automatically' }
    ],
    columns: ['Txn Reference', 'Timestamp', 'Category', 'Party', 'Gross', 'Fee (MDR)', 'Net Amount', 'Status'],
    mockRows: [
      { txnRef: 'TXN-90114', time: '10:15 AM Today', category: 'Advance Deposit', party: 'Rahul Kapoor', gross: '₹250.00', fee: '₹4.50', net: '₹245.50', status: 'Cleared' },
      { txnRef: 'TXN-90115', time: '11:02 AM Today', category: 'Advance Deposit', party: 'Ananya Deshmukh', gross: '₹950.00', fee: '₹17.10', net: '₹932.90', status: 'Cleared' },
      { txnRef: 'TXN-90116', time: '12:30 PM Today', category: 'Customer Refund', party: 'Samir Joshi', gross: '-₹150.00', fee: '₹0.00', net: '-₹150.00', status: 'Refunded' }
    ]
  },
  commission: {
    id: 'fin-commission',
    title: 'Staff Commission Ledger',
    description: 'Automated service tier and retail commission accounting calculated per stylist performance tier.',
    metrics: [
      { label: 'Total Commission (MTD)', value: '₹1,44,750', hint: '30% average payout' },
      { label: 'Top Earner (Marco)', value: '₹54,200', hint: '112 treatments' },
      { label: 'Product Retail Bonus', value: '₹12,400', hint: '10% on grooming kits' },
      { label: 'Payout Cycle', value: 'Monthly (1st)', hint: 'Next: Nov 1, 2026' }
    ],
    columns: ['Specialist', 'Role', 'Treatments', 'Gross Billed', 'Commission Tier', 'Earned Amount', 'Payout Status'],
    mockRows: [
      { staff: 'Marco Silva', role: 'Master Barber', count: 112, billed: '₹1,80,000', tier: '30% Tier 1', earned: '₹54,000', status: 'Approved' },
      { staff: 'Priya Sharma', role: 'Lead Colorist', count: 64, billed: '₹1,65,000', tier: '30% Tier 1', earned: '₹49,500', status: 'Approved' },
      { staff: 'David Chen', role: 'Shave Artisan', count: 88, billed: '₹1,02,500', tier: '25% Tier 2', earned: '₹25,625', status: 'Pending Cycle' }
    ]
  },
  qualification: {
    id: 'fin-qualification',
    title: 'Staff Qualification & Incentive Tiers',
    description: 'Target tracking, minimum qualification thresholds, and bonus multipliers for senior technicians.',
    metrics: [
      { label: 'Tier 1 Qualified', value: '2 Specialists', hint: '> ₹1,50,000 target achieved' },
      { label: 'Tier 2 Active', value: '1 Specialist', hint: '92% to target' },
      { label: 'Client Retention Bonus', value: '₹15,000 Pool', hint: '> 85% rebooking rate' },
      { label: 'Hygiene Score Multiplier', value: '1.05x Applied', hint: '5.0★ Sterilization audit' }
    ],
    columns: ['Specialist', 'Current Tier', 'Monthly Target', 'Actual Achieved', 'Progress %', 'Incentive Multiplier', 'Status'],
    mockRows: [
      { staff: 'Marco Silva', tier: 'Director (Tier 1)', target: '₹1,50,000', actual: '₹1,80,000', progress: '120%', multiplier: '1.10x', status: 'Qualified' },
      { staff: 'Priya Sharma', tier: 'Director (Tier 1)', target: '₹1,50,000', actual: '₹1,65,000', progress: '110%', multiplier: '1.05x', status: 'Qualified' },
      { staff: 'David Chen', tier: 'Senior (Tier 2)', target: '₹1,00,000', actual: '₹92,500', progress: '92.5%', multiplier: '1.00x', status: 'Tracking' }
    ]
  },
  settlements: {
    id: 'fin-settlements',
    title: 'Bank Settlements & Payouts',
    description: 'T+1 bank payout batches, platform fee reconciliation, and UPI merchant account settlement history.',
    metrics: [
      { label: 'Last Settlement Paid', value: '₹28,400', hint: 'Credited Oct 14, 2026' },
      { label: 'Next Settlement Batch', value: '₹34,250', hint: 'Scheduled Oct 16, 06:00 AM' },
      { label: 'Settlement Account', value: 'HDFC Bank ··· 4482', hint: 'Current Business A/C' },
      { label: 'Settlement Frequency', value: 'Daily Auto T+1', hint: 'Zero rolling reserve' }
    ],
    columns: ['Batch ID', 'Settlement Date', 'Gross Volume', 'MDR / Deductions', 'Net Credited', 'Bank Account', 'UTR Reference', 'Status'],
    mockRows: [
      { batchId: 'SET-9941', date: 'Oct 14, 2026', gross: '₹29,100', deductions: '₹582', net: '₹28,518', bank: 'HDFC Bank ··· 4482', utr: 'UTR-HDFC-991283', status: 'Settled' },
      { batchId: 'SET-9940', date: 'Oct 13, 2026', gross: '₹31,400', deductions: '₹628', net: '₹30,772', bank: 'HDFC Bank ··· 4482', utr: 'UTR-HDFC-990441', status: 'Settled' },
      { batchId: 'SET-9939', date: 'Oct 12, 2026', gross: '₹26,800', deductions: '₹536', net: '₹26,264', bank: 'HDFC Bank ··· 4482', utr: 'UTR-HDFC-989122', status: 'Settled' }
    ]
  },
  tax: {
    id: 'fin-tax',
    title: 'Tax / GST / TDS Reporting',
    description: 'Monthly GST computation (9% CGST + 9% SGST) and TDS Section 194J withholdings for professional staff.',
    metrics: [
      { label: 'GST Output Tax (MTD)', value: '₹73,602', hint: '18% on ₹4,08,898 taxable' },
      { label: 'CGST 9%', value: '₹36,801', hint: 'Central Goods & Services Tax' },
      { label: 'SGST 9%', value: '₹36,801', hint: 'State Goods & Services Tax' },
      { label: 'TDS Withheld (Sec 194J)', value: '₹14,475', hint: '10% on contractor commission' }
    ],
    columns: ['Tax Period', 'Taxable Turnover', 'CGST (9%)', 'SGST (9%)', 'Total GST', 'TDS Sec 194J', 'Filing Status'],
    mockRows: [
      { period: 'October 2026 (MTD)', taxable: '₹4,08,898', cgst: '₹36,801', sgst: '₹36,801', totalGst: '₹73,602', tds: '₹14,475', status: 'Accruing' },
      { period: 'September 2026', taxable: '₹8,45,000', cgst: '₹76,050', sgst: '₹76,050', totalGst: '₹1,52,100', tds: '₹28,500', status: 'Filed (GSTR-3B)' },
      { period: 'August 2026', taxable: '₹7,90,000', cgst: '₹71,100', sgst: '₹71,100', totalGst: '₹1,42,200', tds: '₹26,800', status: 'Filed (GSTR-3B)' }
    ]
  }
};
