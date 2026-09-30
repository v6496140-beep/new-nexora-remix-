// Nexora SalonOS — Phase 5.3 Business Staff Management Engine
// Multi-Tenant Staff Profiles, Role Definitions, Service Assignments, and Real Performance Analytics

export type StandardStaffRole =
  | 'Barber'
  | 'Senior Barber'
  | 'Hair Stylist'
  | 'Makeup Artist'
  | 'Nail Artist'
  | 'Massage Therapist'
  | 'Spa Therapist'
  | 'Tattoo Artist'
  | 'Manager'
  | 'Other';

export const CATEGORY_DEFAULT_ROLES: Record<string, StandardStaffRole[]> = {
  barber: ['Barber', 'Senior Barber', 'Hair Stylist', 'Manager'],
  spa: ['Massage Therapist', 'Spa Therapist', 'Makeup Artist', 'Manager'],
  nail: ['Nail Artist', 'Hair Stylist', 'Makeup Artist', 'Manager'],
  tattoo: ['Tattoo Artist', 'Manager'],
  general: [
    'Barber',
    'Senior Barber',
    'Hair Stylist',
    'Makeup Artist',
    'Nail Artist',
    'Massage Therapist',
    'Spa Therapist',
    'Tattoo Artist',
    'Manager',
    'Other'
  ]
};

export interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export interface StaffProfileEntity {
  id: string;
  businessId: string;
  userId?: string;
  name: string;
  photo?: string;
  role: string; // Standard or custom role
  bio?: string;
  phone?: string;
  email?: string;
  specializations: string[];
  active: boolean;
  joinedAt: string; // YYYY-MM-DD
  socialLinks?: SocialLinks;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffPayload {
  businessId: string;
  userId?: string;
  name: string;
  photo?: string;
  role: string;
  bio?: string;
  phone?: string;
  email?: string;
  specializations?: string[];
  active?: boolean;
  joinedAt?: string;
  socialLinks?: SocialLinks;
  displayOrder?: number;
  serviceIds?: string[]; // Initial assigned services
}

export interface UpdateStaffPayload {
  name?: string;
  photo?: string;
  role?: string;
  bio?: string;
  phone?: string;
  email?: string;
  specializations?: string[];
  active?: boolean;
  socialLinks?: SocialLinks;
  displayOrder?: number;
}

export interface StaffPerformanceStats {
  staffId: string;
  businessId: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
  totalRevenueCents: number;
  formattedRevenue: string; // e.g. "₹45,200"
  completionRatePercent: number; // e.g. 92%
  averageRating: number; // e.g. 4.9
}

export interface StaffListFilter {
  searchQuery?: string;
  role?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ALL';
  serviceId?: string;
}
