// Nexora SalonOS — App Shells & Routing Taxonomy (Phase 3.3)
import { UserRole } from '../types';

export type ShellType =
  | 'MARKETING'
  | 'AUTH'
  | 'ONBOARDING'
  | 'PUBLIC_BUSINESS'
  | 'CUSTOMER'
  | 'BUSINESS_ADMIN'
  | 'STAFF'
  | 'SUPER_ADMIN';

export interface RouteDefinition {
  path: string;
  shell: ShellType;
  title: string;
  description: string;
  allowedRoles?: UserRole[];
  requiresAuth: boolean;
  isTenantScoped?: boolean;
}

export const ALL_ROUTES: RouteDefinition[] = [
  // 1. MARKETING
  { path: '/', shell: 'MARKETING', title: 'Platform Home', description: 'Nexora SalonOS Global Platform Landing', requiresAuth: false },
  { path: '/categories', shell: 'MARKETING', title: 'Industry Categories', description: 'Explore Barber, Hair Salon, Spa, Nail & 10 Themes', requiresAuth: false },
  { path: '/templates', shell: 'MARKETING', title: 'Website Templates', description: 'Pre-built High-Converting Salon Blueprints', requiresAuth: false },

  // 2. AUTHENTICATION
  { path: '/sign-in', shell: 'AUTH', title: 'Sign In', description: 'Client & Staff Authentication Gateway', requiresAuth: false },
  { path: '/sign-up', shell: 'AUTH', title: 'Register Salon / Account', description: 'Create Customer Account or Salon Tenant', requiresAuth: false },

  // 3. BUSINESS ONBOARDING
  { path: '/onboarding', shell: 'ONBOARDING', title: 'Onboarding Start', description: 'Choose Salon Category & Starter Blueprint', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'] },
  { path: '/onboarding/business', shell: 'ONBOARDING', title: 'Business Profile', description: 'Name, Address, Phone, Postal Code & Currency', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'] },
  { path: '/onboarding/services', shell: 'ONBOARDING', title: 'Default Services', description: 'Curate Category Menu & Base Pricing', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'] },
  { path: '/onboarding/staff', shell: 'ONBOARDING', title: 'Team Specialists', description: 'Roster Specialists & Role Titles', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'] },
  { path: '/onboarding/gallery', shell: 'ONBOARDING', title: 'Portfolio Assets', description: 'Upload Salon Ambiance & Work Photography', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'] },
  { path: '/onboarding/hours', shell: 'ONBOARDING', title: 'Operating Hours', description: 'Configure Weekly Shift Availability', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'] },
  { path: '/onboarding/preview', shell: 'ONBOARDING', title: 'Live Website Preview', description: 'Inspect Auto-Generated 10-Section Site', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'] },
  { path: '/onboarding/publish', shell: 'ONBOARDING', title: 'Publish & Domain Launch', description: 'Go Live with 25% Advance Booking Engine', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'] },

  // 4. PUBLIC BUSINESS (TENANT SCOPED)
  { path: '/b/:businessSlug', shell: 'PUBLIC_BUSINESS', title: 'Salon Homepage', description: 'Hero, Services, Packages, Staff, Gallery & Booking CTA', requiresAuth: false, isTenantScoped: true },
  { path: '/b/:businessSlug/services', shell: 'PUBLIC_BUSINESS', title: 'Services Menu', description: 'Detailed Treatments & Online Advance Calculator', requiresAuth: false, isTenantScoped: true },
  { path: '/b/:businessSlug/packages', shell: 'PUBLIC_BUSINESS', title: 'Packages & Bundles', description: 'Multi-Service Experience Packages', requiresAuth: false, isTenantScoped: true },
  { path: '/b/:businessSlug/gallery', shell: 'PUBLIC_BUSINESS', title: 'Visual Portfolio', description: 'Transformations & Interior Ambiance', requiresAuth: false, isTenantScoped: true },
  { path: '/b/:businessSlug/about', shell: 'PUBLIC_BUSINESS', title: 'About & Ethos', description: 'Heritage, Craft Philosophy & Hygiene Standards', requiresAuth: false, isTenantScoped: true },
  { path: '/b/:businessSlug/contact', shell: 'PUBLIC_BUSINESS', title: 'Location & Hours', description: 'Map Coordinates & Valet Instructions', requiresAuth: false, isTenantScoped: true },
  { path: '/b/:businessSlug/book', shell: 'PUBLIC_BUSINESS', title: 'Booking Flow', description: 'Select Specialist, Date, Time & 25% Advance Deposit', requiresAuth: false, isTenantScoped: true },
  { path: '/b/:businessSlug/my-bookings', shell: 'PUBLIC_BUSINESS', title: 'Lookup Appointment', description: 'Quick Phone/Code Verification for Guest Clients', requiresAuth: false, isTenantScoped: true },

  // 5. CUSTOMER PORTAL
  { path: '/customer', shell: 'CUSTOMER', title: 'Customer Dashboard', description: 'Active Appointment Digital Boarding Pass', requiresAuth: true, allowedRoles: ['CUSTOMER', 'BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'] },
  { path: '/customer/bookings', shell: 'CUSTOMER', title: 'Booking History', description: 'Upcoming, Completed, Cancelled & Invoices', requiresAuth: true, allowedRoles: ['CUSTOMER', 'BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'] },
  { path: '/customer/profile', shell: 'CUSTOMER', title: 'Client Profile', description: 'Personal Formulas, Allergies & Preferences', requiresAuth: true, allowedRoles: ['CUSTOMER', 'BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'] },

  // 6. BUSINESS ADMIN DASHBOARD
  { path: '/admin', shell: 'BUSINESS_ADMIN', title: 'Admin Overview', description: '6 Metric KPI Cards & Revenue Breakdown', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/bookings', shell: 'BUSINESS_ADMIN', title: 'Master Bookings', description: 'Filterable Appointments Table & Drawer', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/calendar', shell: 'BUSINESS_ADMIN', title: 'Chair Calendar', description: 'Day, Week & Month Multi-Specialist Dispatch', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/customers', shell: 'BUSINESS_ADMIN', title: 'Customer CRM', description: 'Client Profiles, History & Formula Notes', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/services', shell: 'BUSINESS_ADMIN', title: 'Services Catalog', description: 'Durations, Buffers, Prices & Surcharges', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/packages', shell: 'BUSINESS_ADMIN', title: 'Packages Menu', description: 'Bundled Treatments & Promotional Discounts', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/staff', shell: 'BUSINESS_ADMIN', title: 'Team Directory', description: 'Staff Profiles, Roles & Star Ratings', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/availability', shell: 'BUSINESS_ADMIN', title: 'Shift Availability', description: 'Weekly Working Hours & Chair Capacity', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/gallery', shell: 'BUSINESS_ADMIN', title: 'Gallery Manager', description: 'Portfolio Images & Category Tags', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/reviews', shell: 'BUSINESS_ADMIN', title: 'Client Reviews', description: 'Verified Ratings & Google Review Sync', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/website', shell: 'BUSINESS_ADMIN', title: 'Website Builder', description: 'Visual 3-Panel No-Code Content Studio', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/theme', shell: 'BUSINESS_ADMIN', title: 'Theme Tokens', description: 'Colors, Radii & Typography Customizer', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/content', shell: 'BUSINESS_ADMIN', title: 'Copy & Content', description: 'Hero Headlines, About Story & CTA Labels', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/payments', shell: 'BUSINESS_ADMIN', title: 'Payments Summary', description: '25% Advance vs 75% Venue Collections', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/transactions', shell: 'BUSINESS_ADMIN', title: 'Transaction Ledger', description: 'Every Payment Event, Refund & Fee MDR', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/commission', shell: 'BUSINESS_ADMIN', title: 'Staff Commission', description: 'Specialist Performance Tiers & Retail Payouts', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/qualification', shell: 'BUSINESS_ADMIN', title: 'Qualification Tracker', description: 'Target Volume & Retention Bonus Multipliers', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/settlements', shell: 'BUSINESS_ADMIN', title: 'Bank Settlements', description: 'T+1 Bank Payout Batches & UTR Dispatch', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/tax', shell: 'BUSINESS_ADMIN', title: 'Tax & TDS GST', description: '18% GST (CGST/SGST) & Sec 194J TDS', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/reports', shell: 'BUSINESS_ADMIN', title: 'Reports & Analytics', description: 'Utilization %, Churn & Rebooking Metrics', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/admin/settings', shell: 'BUSINESS_ADMIN', title: 'Salon Settings', description: 'Advance % Config, Hours & SMS Templates', requiresAuth: true, allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },

  // 7. STAFF APP
  { path: '/staff', shell: 'STAFF', title: 'Staff Today', description: 'My Daily Chair Appointments & Live Clock-in', requiresAuth: true, allowedRoles: ['STAFF', 'BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/staff/calendar', shell: 'STAFF', title: 'My Schedule', description: 'Assigned Booking Blocks & Break Intervals', requiresAuth: true, allowedRoles: ['STAFF', 'BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/staff/bookings', shell: 'STAFF', title: 'My Client History', description: 'Past Treatments & Client Review Scores', requiresAuth: true, allowedRoles: ['STAFF', 'BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/staff/availability', shell: 'STAFF', title: 'My Shift Roster', description: 'Weekly Working Hours & Time-Off Submissions', requiresAuth: true, allowedRoles: ['STAFF', 'BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },
  { path: '/staff/profile', shell: 'STAFF', title: 'Specialist Bio', description: 'Certifications, Portfolio Photos & Commission Tier', requiresAuth: true, allowedRoles: ['STAFF', 'BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'], isTenantScoped: true },

  // 8. SUPER ADMIN PLATFORM
  { path: '/super-admin', shell: 'SUPER_ADMIN', title: 'Platform Command', description: 'Global GMV, 1,428 Salons & 5% Net Take-Rate', requiresAuth: true, allowedRoles: ['SUPER_ADMIN'] },
  { path: '/super-admin/businesses', shell: 'SUPER_ADMIN', title: 'All Salons Directory', description: 'Tenant Status (Active/Suspended/Pending)', requiresAuth: true, allowedRoles: ['SUPER_ADMIN'] },
  { path: '/super-admin/categories', shell: 'SUPER_ADMIN', title: 'Industry Categories', description: 'Barber, Salon, Spa, Nail, Tattoo Definitions', requiresAuth: true, allowedRoles: ['SUPER_ADMIN'] },
  { path: '/super-admin/templates', shell: 'SUPER_ADMIN', title: 'Starter Templates', description: 'Default Menus, Packages & 10 Theme Presets', requiresAuth: true, allowedRoles: ['SUPER_ADMIN'] },
  { path: '/super-admin/themes', shell: 'SUPER_ADMIN', title: 'Theme Tokens Registry', description: 'Global CSS Variables, Colors & Typography', requiresAuth: true, allowedRoles: ['SUPER_ADMIN'] },
  { path: '/super-admin/bookings', shell: 'SUPER_ADMIN', title: 'Global Bookings', description: 'Cross-Tenant Reservation Feed & Health', requiresAuth: true, allowedRoles: ['SUPER_ADMIN'] },
  { path: '/super-admin/transactions', shell: 'SUPER_ADMIN', title: 'Platform Transactions', description: 'Gross Volume, 5% Commission & GST Splits', requiresAuth: true, allowedRoles: ['SUPER_ADMIN'] },
  { path: '/super-admin/commission', shell: 'SUPER_ADMIN', title: 'Commission Rules', description: 'Platform Take-Rate Schedules by Category', requiresAuth: true, allowedRoles: ['SUPER_ADMIN'] },
  { path: '/super-admin/settlements', shell: 'SUPER_ADMIN', title: 'Merchant Settlements', description: 'T+1 Payout Queues & Bank UTR Verification', requiresAuth: true, allowedRoles: ['SUPER_ADMIN'] },
  { path: '/super-admin/tax', shell: 'SUPER_ADMIN', title: 'Tax & GST Jurisdictions', description: '18% GST (CGST/SGST) & Withholding Rules', requiresAuth: true, allowedRoles: ['SUPER_ADMIN'] },
  { path: '/super-admin/reports', shell: 'SUPER_ADMIN', title: 'Platform Analytics', description: 'Cohort Growth, City Expansion & Churn', requiresAuth: true, allowedRoles: ['SUPER_ADMIN'] },
  { path: '/super-admin/audit', shell: 'SUPER_ADMIN', title: 'Immutable Audit Log', description: 'Root Administrative Actions & IP Trail', requiresAuth: true, allowedRoles: ['SUPER_ADMIN'] },
  { path: '/super-admin/settings', shell: 'SUPER_ADMIN', title: 'Global Gateway & API', description: 'Payment Keys, Webhooks & Maintenance Mode', requiresAuth: true, allowedRoles: ['SUPER_ADMIN'] }
];
