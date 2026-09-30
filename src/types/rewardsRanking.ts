// Nexora SalonOS — Phase 6-C.1 Member Network & Milestone Rewards Types

export type RewardType =
  | 'BOOKING_MILESTONE'
  | 'REVENUE_MILESTONE'
  | 'CUSTOMER_RETENTION'
  | 'REVIEW_MILESTONE'
  | 'PLATFORM_ACTIVITY'
  | 'REFERRAL';

export interface RewardEntity {
  rewardId: string;
  businessId: string;
  rewardType: RewardType;
  criteria: string;
  threshold: number;
  status: 'PENDING' | 'EARNED' | 'EXPIRED';
  earnedAt?: string;
  expiresAt?: string;
}

export interface JaipurBusinessShowcase {
  businessId: string;
  name: string;
  category: 'barber' | 'salon' | 'beauty' | 'spa' | 'nails' | 'tattoo';
  rating: number; // out of 5.0
  reviewCount: number;
  completedBookings: number;
  retentionRate: number; // percentage
  location: string;
  isVerified: boolean;
  badges: string[];
  publicLink: string;
}
