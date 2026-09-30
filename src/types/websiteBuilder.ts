// Nexora SalonOS — Phase 3.8 Website Builder Data Model & Persistence
import { SectionType, SectionContentConfig } from './categoryEngine';

export interface SectionEditorItem {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  alignment: 'left' | 'center' | 'right';
  backgroundColor?: string;
  heading: string;
  description: string;
  badge?: string;
  buttonText?: string;
  imageUrl?: string;
  story?: string;
}

export interface WebsiteEditorPage {
  pageId: 'home' | 'services' | 'packages' | 'gallery' | 'about' | 'contact';
  name: string;
  sections: SectionEditorItem[];
}

export interface WebsiteBuilderDraft {
  businessSlug: string;
  businessName: string;
  category: string;
  templateId: string;
  theme: string;
  activePage: 'home' | 'services' | 'packages' | 'gallery' | 'about' | 'contact';
  selectedSectionId: string;
  pages: Record<string, WebsiteEditorPage>;
  updatedAt: string;
}

export const INITIAL_BUILDER_SECTIONS: SectionEditorItem[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    title: 'Hero Banner',
    visible: true,
    alignment: 'center',
    heading: 'Master Barbering Redefined for Modern Gentlemen',
    description: 'Bespoke scissor work, hot lather razor shaves & curated scotch lounge.',
    badge: 'Classic Craftsmanship & Shaving Rituals',
    buttonText: 'Book Chair (25% Advance)',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sec-services',
    type: 'services',
    title: 'Featured Services',
    visible: true,
    alignment: 'left',
    heading: 'Master Grooming & Razor Services',
    description: 'Every session includes consultation, precision shear work, and warm towel finish.',
    badge: 'Curated Treatments',
    buttonText: 'View Full Menu'
  },
  {
    id: 'sec-packages',
    type: 'packages',
    title: 'Signature Packages',
    visible: true,
    alignment: 'left',
    heading: 'Complete Grooming Experiences',
    description: 'Multi-service combinations designed for weddings, galas, and weekly refinement.',
    badge: 'Signature Bundles'
  },
  {
    id: 'sec-about',
    type: 'about',
    title: 'About Atelier',
    visible: true,
    alignment: 'left',
    heading: 'The Art of Traditional Barbering',
    description: 'Founded on the principles of immaculate precision and timeless hospitality.',
    story: 'We combine old-world European shaving rituals with modern scissor geometry. Our private suites feature hospital-grade UV sterilization.',
    badge: 'Heritage & Craft'
  },
  {
    id: 'sec-staff',
    type: 'staff',
    title: 'Resident Staff',
    visible: true,
    alignment: 'center',
    heading: 'Meet Our Master Barbers',
    description: 'Direct booking available for all resident specialists.',
    badge: 'Resident Specialists'
  },
  {
    id: 'sec-gallery',
    type: 'gallery',
    title: 'Visual Portfolio',
    visible: true,
    alignment: 'center',
    heading: 'Recent Hair Architecture & Shaves',
    description: 'Browse our portfolio of low fades, beard sculpting, and lounge ambiance.'
  },
  {
    id: 'sec-testimonials',
    type: 'testimonials',
    title: 'Client Testimonials',
    visible: true,
    alignment: 'center',
    heading: 'Gentlemen Experiences',
    description: 'Verified reviews from regular patrons.'
  },
  {
    id: 'sec-booking',
    type: 'booking',
    title: 'Booking Callout Banner',
    visible: true,
    alignment: 'center',
    heading: 'Reserve Your Barber Chair Today',
    description: 'Select your preferred master barber and secure your seat with our automated 25% deposit.',
    buttonText: 'Book Chair Now (25% Adv)'
  },
  {
    id: 'sec-contact',
    type: 'contact',
    title: 'Contact & Location Strip',
    visible: true,
    alignment: 'left',
    heading: 'Salon Hours & Coordinates',
    description: 'Open Tuesday through Sunday. Walk-ins welcomed subject to chair availability.'
  },
  {
    id: 'sec-footer',
    type: 'footer',
    title: 'Page Footer',
    visible: true,
    alignment: 'center',
    heading: 'The Royal Crown Barber & Lounge',
    description: '25% Advance Online Policy · Powered by Nexora SalonOS'
  }
];

// Persistence Service Interface
export interface WebsitePersistenceService {
  saveDraft: (draft: WebsiteBuilderDraft) => Promise<boolean>;
  loadDraft: (businessSlug: string) => WebsiteBuilderDraft | null;
}

const STORAGE_KEY_BUILDER = 'nexora_website_builder_draft_v1';

export const localWebsitePersistence: WebsitePersistenceService = {
  saveDraft: async (draft: WebsiteBuilderDraft): Promise<boolean> => {
    try {
      localStorage.setItem(`${STORAGE_KEY_BUILDER}_${draft.businessSlug}`, JSON.stringify(draft));
      return true;
    } catch (e) {
      console.error('Failed to save website draft', e);
      return false;
    }
  },
  loadDraft: (businessSlug: string): WebsiteBuilderDraft | null => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_BUILDER}_${businessSlug}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load website draft', e);
    }
    return null;
  }
};
