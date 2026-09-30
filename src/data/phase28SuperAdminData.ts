// Nexora SalonOS — Phase 2.8 Super Admin Platform UI Specification Data

export interface SuperAdminMetricCard {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  isPositive: boolean;
  accent: 'indigo' | 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' | 'cyan';
}

export interface PlatformBusinessRecord {
  id: string;
  code: string;
  name: string;
  category: 'Barber' | 'Hair Salon' | 'Beauty' | 'Nail' | 'Spa' | 'Massage' | 'Tattoo';
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  status: 'Active' | 'Suspended' | 'Pending Review';
  totalBookings: number;
  totalRevenue: string;
  createdDate: string;
  city: string;
}

export interface PlatformTemplateRecord {
  id: string;
  category: string;
  templateName: string;
  themePreset: string;
  defaultServicesCount: number;
  defaultPackagesCount: number;
  defaultSectionsCount: number;
  activeStoresCount: number;
}

export interface PlatformTransactionRecord {
  id: string;
  txnId: string;
  businessName: string;
  businessCode: string;
  bookingCode: string;
  grossAmount: number;
  commissionRate: string;
  commissionAmount: number;
  taxAmount: number;
  netAmount: number;
  status: 'Settled' | 'Processing' | 'Held' | 'Refunded';
  utrNumber: string;
  timestamp: string;
}

export interface PlatformAuditLogRecord {
  id: string;
  userName: string;
  userRole: string;
  action: 'SUSPEND_BUSINESS' | 'UPDATE_TAX_RULE' | 'MODIFY_TEMPLATE' | 'OVERRIDE_COMMISSION' | 'FORCE_SETTLEMENT' | 'ACTIVATE_BUSINESS';
  entity: string;
  entityId: string;
  timestamp: string;
  changesSummary: string;
  ipAddress: string;
}

// 1. OVERVIEW METRICS (Strict 7 Cards)
export const SUPER_ADMIN_METRICS: SuperAdminMetricCard[] = [
  {
    id: 'total-biz',
    title: 'Total Businesses',
    value: '1,428',
    subtitle: 'Across 24 metropolitan cities',
    trend: '+12.4% MoM',
    isPositive: true,
    accent: 'blue'
  },
  {
    id: 'active-biz',
    title: 'Active Businesses',
    value: '1,314',
    subtitle: '92% platform retention rate',
    trend: '+8.1% vs last month',
    isPositive: true,
    accent: 'emerald'
  },
  {
    id: 'total-bookings',
    title: 'Total Bookings',
    value: '384,920',
    subtitle: 'All-time platform reservations',
    trend: '+24.6% this quarter',
    isPositive: true,
    accent: 'indigo'
  },
  {
    id: 'platform-gmv',
    title: 'Gross Merchandise Value (GMV)',
    value: '₹42.8 Cr',
    subtitle: 'Cumulative transaction volume',
    trend: '+18.2% vs target',
    isPositive: true,
    accent: 'purple'
  },
  {
    id: 'platform-commission',
    title: 'Platform Commission',
    value: '₹2.14 Cr',
    subtitle: '5% average net take-rate',
    trend: '+15.8% MoM growth',
    isPositive: true,
    accent: 'cyan'
  },
  {
    id: 'pending-settlements',
    title: 'Pending Settlements',
    value: '₹34.8 L',
    subtitle: 'T+1 queue (48 businesses)',
    trend: 'Scheduled for 06:00 AM',
    isPositive: true,
    accent: 'amber'
  },
  {
    id: 'completed-settlements',
    title: 'Completed Settlements',
    value: '₹38.2 Cr',
    subtitle: '100% verified bank UTRs',
    trend: '99.98% gateway clearance',
    isPositive: true,
    accent: 'emerald'
  }
];

// 2. BUSINESSES DIRECTORY
export const MOCK_PLATFORM_BUSINESSES: PlatformBusinessRecord[] = [
  {
    id: 'biz-1',
    code: 'NEX-BOM-004',
    name: 'The Royal Crown Barber & Lounge',
    category: 'Barber',
    ownerName: 'Vikram Singhania',
    ownerEmail: 'vikram@royalcrown.in',
    ownerPhone: '+91 98200 12345',
    status: 'Active',
    totalBookings: 1842,
    totalRevenue: '₹24,80,000',
    createdDate: '12 Jan 2025',
    city: 'Mumbai'
  },
  {
    id: 'biz-2',
    code: 'NEX-DEL-012',
    name: 'Maison De Luxe Hair Atelier',
    category: 'Hair Salon',
    ownerName: 'Sunita Mehra',
    ownerEmail: 'sunita@maisondeluxe.com',
    ownerPhone: '+91 98111 88231',
    status: 'Active',
    totalBookings: 2940,
    totalRevenue: '₹68,45,000',
    createdDate: '04 Mar 2025',
    city: 'New Delhi'
  },
  {
    id: 'biz-3',
    code: 'NEX-BLR-088',
    name: 'Zenith Organic Spa & Wellness',
    category: 'Spa',
    ownerName: 'Karthik Rao',
    ownerEmail: 'karthik@zenithspa.in',
    ownerPhone: '+91 99450 77122',
    status: 'Active',
    totalBookings: 1420,
    totalRevenue: '₹31,10,000',
    createdDate: '28 Apr 2025',
    city: 'Bengaluru'
  },
  {
    id: 'biz-4',
    code: 'NEX-HYD-041',
    name: 'Velvet Nails & Lash Studio',
    category: 'Nail',
    ownerName: 'Rhea Chakraborty',
    ownerEmail: 'rhea@velvetnails.co',
    ownerPhone: '+91 98490 22341',
    status: 'Suspended',
    totalBookings: 680,
    totalRevenue: '₹9,80,000',
    createdDate: '19 Jul 2025',
    city: 'Hyderabad'
  },
  {
    id: 'biz-5',
    code: 'NEX-PUN-029',
    name: 'Iron & Ink Tattoo Sanctuary',
    category: 'Tattoo',
    ownerName: 'Dev Malhotra',
    ownerEmail: 'dev@ironandink.in',
    ownerPhone: '+91 97640 11900',
    status: 'Active',
    totalBookings: 810,
    totalRevenue: '₹41,20,000',
    createdDate: '15 Aug 2025',
    city: 'Pune'
  },
  {
    id: 'biz-6',
    code: 'NEX-GOA-007',
    name: 'AyurVeda Coastal Massage Haven',
    category: 'Massage',
    ownerName: 'Anita Fernandes',
    ownerEmail: 'anita@ayurvedacoast.com',
    ownerPhone: '+91 98221 44500',
    status: 'Active',
    totalBookings: 1190,
    totalRevenue: '₹22,90,000',
    createdDate: '02 Oct 2025',
    city: 'Goa'
  }
];

// 3. TEMPLATES REGISTRY
export const MOCK_CATEGORY_TEMPLATES: PlatformTemplateRecord[] = [
  {
    id: 'tmpl-barber',
    category: 'Barber',
    templateName: 'Gentleman Classic Lounge',
    themePreset: 'Luxury (Gold & Obsidian)',
    defaultServicesCount: 8,
    defaultPackagesCount: 3,
    defaultSectionsCount: 10,
    activeStoresCount: 384
  },
  {
    id: 'tmpl-salon',
    category: 'Hair Salon',
    templateName: 'Haute Editorial Atelier',
    themePreset: 'Modern (Indigo & Slate)',
    defaultServicesCount: 14,
    defaultPackagesCount: 4,
    defaultSectionsCount: 10,
    activeStoresCount: 412
  },
  {
    id: 'tmpl-spa',
    category: 'Spa',
    templateName: 'Serenity Stone Sanctuary',
    themePreset: 'Minimal (Sage & Stone)',
    defaultServicesCount: 10,
    defaultPackagesCount: 4,
    defaultSectionsCount: 9,
    activeStoresCount: 198
  },
  {
    id: 'tmpl-nail',
    category: 'Nail',
    templateName: 'Gloss & Chic Boutique',
    themePreset: 'Elegant (Blush Champagne)',
    defaultServicesCount: 12,
    defaultPackagesCount: 3,
    defaultSectionsCount: 9,
    activeStoresCount: 165
  },
  {
    id: 'tmpl-massage',
    category: 'Massage',
    templateName: 'Deep Renewal Suite',
    themePreset: 'Dark (Earth & Walnut)',
    defaultServicesCount: 8,
    defaultPackagesCount: 2,
    defaultSectionsCount: 8,
    activeStoresCount: 112
  },
  {
    id: 'tmpl-tattoo',
    category: 'Tattoo',
    templateName: 'Mono Blackwork Studio',
    themePreset: 'Bold (Monochrome Ink)',
    defaultServicesCount: 6,
    defaultPackagesCount: 2,
    defaultSectionsCount: 8,
    activeStoresCount: 86
  }
];

// 4. PLATFORM TRANSACTIONS
export const MOCK_PLATFORM_TRANSACTIONS: PlatformTransactionRecord[] = [
  {
    id: 'ptx-101',
    txnId: 'TXN-NEX-99841',
    businessName: 'The Royal Crown Barber & Lounge',
    businessCode: 'NEX-BOM-004',
    bookingCode: 'NEX-88219',
    grossAmount: 1000,
    commissionRate: '5.0%',
    commissionAmount: 50,
    taxAmount: 9,
    netAmount: 941,
    status: 'Settled',
    utrNumber: 'UTR-HDFC-991283',
    timestamp: 'Today, 11:20 AM'
  },
  {
    id: 'ptx-102',
    txnId: 'TXN-NEX-99842',
    businessName: 'Maison De Luxe Hair Atelier',
    businessCode: 'NEX-DEL-012',
    bookingCode: 'NEX-88220',
    grossAmount: 3800,
    commissionRate: '5.0%',
    commissionAmount: 190,
    taxAmount: 34.2,
    netAmount: 3575.8,
    status: 'Settled',
    utrNumber: 'UTR-ICICI-881920',
    timestamp: 'Today, 12:05 PM'
  },
  {
    id: 'ptx-103',
    txnId: 'TXN-NEX-99843',
    businessName: 'Zenith Organic Spa',
    businessCode: 'NEX-BLR-088',
    bookingCode: 'NEX-88225',
    grossAmount: 2200,
    commissionRate: '4.5%',
    commissionAmount: 99,
    taxAmount: 17.82,
    netAmount: 2083.18,
    status: 'Processing',
    utrNumber: 'PENDING_BATCH',
    timestamp: 'Today, 01:15 PM'
  },
  {
    id: 'ptx-104',
    txnId: 'TXN-NEX-99844',
    businessName: 'Iron & Ink Tattoo Sanctuary',
    businessCode: 'NEX-PUN-029',
    bookingCode: 'NEX-88231',
    grossAmount: 5000,
    commissionRate: '5.0%',
    commissionAmount: 250,
    taxAmount: 45,
    netAmount: 4705,
    status: 'Settled',
    utrNumber: 'UTR-AXIS-771923',
    timestamp: 'Today, 02:45 PM'
  }
];

// 5. AUDIT LOGS
export const MOCK_PLATFORM_AUDIT_LOGS: PlatformAuditLogRecord[] = [
  {
    id: 'aud-01',
    userName: 'Rajnish Oberoi (Super Admin)',
    userRole: 'Root Administrator',
    action: 'SUSPEND_BUSINESS',
    entity: 'Business Profile',
    entityId: 'NEX-HYD-041',
    timestamp: '2026-10-15 11:32 AM',
    changesSummary: 'Status changed from "Active" to "Suspended" due to chargeback dispute threshold.',
    ipAddress: '103.21.244.18'
  },
  {
    id: 'aud-02',
    userName: 'Pooja Iyer (Finance Ops)',
    userRole: 'Settlements Officer',
    action: 'FORCE_SETTLEMENT',
    entity: 'Settlement Batch',
    entityId: 'SET-BATCH-9941',
    timestamp: '2026-10-15 10:14 AM',
    changesSummary: 'Manually cleared T+1 batch for 14 Flagship salons (₹28.4L total gross payout).',
    ipAddress: '103.21.244.22'
  },
  {
    id: 'aud-03',
    userName: 'Aakash Verma (Design Lead)',
    userRole: 'Catalog Admin',
    action: 'MODIFY_TEMPLATE',
    entity: 'Template Schema',
    entityId: 'tmpl-barber',
    timestamp: '2026-10-14 04:55 PM',
    changesSummary: 'Updated default 25% advance booking banner CTA copy across all 384 barber stores.',
    ipAddress: '103.21.244.15'
  },
  {
    id: 'aud-04',
    userName: 'Rajnish Oberoi (Super Admin)',
    userRole: 'Root Administrator',
    action: 'UPDATE_TAX_RULE',
    entity: 'Platform Tax Engine',
    entityId: 'RULE-GST-18',
    timestamp: '2026-10-12 02:20 PM',
    changesSummary: 'Verified CGST 9% and SGST 9% auto-split rules for Maharashtra jurisdiction.',
    ipAddress: '103.21.244.18'
  }
];
