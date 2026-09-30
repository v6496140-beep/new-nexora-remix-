// Nexora SalonOS — Phase 3.7 Onboarding Wizard Data Model
import { CategoryId, DefaultServiceSeed } from './categoryEngine';
import { ThemePreset } from './index';

export type OnboardingPublishStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED';

export interface OnboardingStaffDraft {
  id: string;
  name: string;
  role: string;
  specialization: string;
  photoUrl?: string;
  avatarInitials: string;
}

export interface OnboardingGalleryDraft {
  id: string;
  url: string;
  title: string;
  category: string;
}

export interface DaySchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface OnboardingBusinessState {
  // Step 1: Category
  category: CategoryId;
  // Step 2: Template
  templateId: string;
  theme: ThemePreset;
  // Step 3: Business Details
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  logoUrl?: string;
  coverImageUrl?: string;
  whatsapp?: string;
  instagram?: string;
  // Step 4: Services
  services: DefaultServiceSeed[];
  // Step 5: Staff
  staff: OnboardingStaffDraft[];
  // Step 6: Gallery
  gallery: OnboardingGalleryDraft[];
  // Step 7: Hours
  schedule: DaySchedule[];
  // Step 9: Publish State
  publishStatus: OnboardingPublishStatus;
  slug: string;
}

export const INITIAL_DAY_SCHEDULE: DaySchedule[] = [
  { day: 'Monday', isOpen: false, openTime: '09:00', closeTime: '20:00' },
  { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '20:00' },
  { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '20:00' },
  { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '20:00' },
  { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '20:00' },
  { day: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { day: 'Sunday', isOpen: true, openTime: '10:00', closeTime: '19:00' }
];
