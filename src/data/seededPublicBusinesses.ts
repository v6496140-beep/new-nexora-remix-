// Nexora SalonOS — Phase 3.5 Seeded Businesses for Dynamic Rendering
// Local development mock data isolated from application logic.
import { Business } from '../types';

export interface BusinessSeedData extends Business {
  galleryImages: { url: string; category: string; title: string }[];
  testimonials: { id: string; author: string; role: string; comment: string; rating: number }[];
  staffMembers: { id: string; name: string; roleTitle: string; rating: number; reviewsCount: number; avatarInitials: string }[];
}

export const SEEDED_PUBLIC_BUSINESSES: Record<string, BusinessSeedData> = {
  // 1. BARBER
  'royal-crown': {
    id: 'biz-barber-01',
    code: 'NEX-BOM-004',
    slug: 'royal-crown',
    name: 'The Royal Crown Barber & Lounge',
    tagline: 'Artisanal Grooming & Classic Razor Rituals',
    category: 'barber',
    ownerId: 'usr-1',
    phone: '+91 98200 12345',
    email: 'contact@royalcrown.in',
    city: 'Mumbai',
    address: 'Hill Road, Bandra West',
    postalCode: '400050',
    country: 'India',
    config: {
      advancePaymentPercentage: 25,
      cancellationWindowHours: 4,
      slotIntervalMinutes: 15,
      currency: 'INR',
      currencySymbol: '₹',
      taxGstRate: 18,
      taxTdsRate: 10,
      enableOnlineAdvance: true,
      enableWalkins: true
    },
    templateId: 'tmpl-barber-luxury',
    themeId: 'luxury',
    status: 'active',
    verificationStatus: 'verified',
    verificationSubmittedAt: '2025-01-15T09:00:00Z',
    verifiedAt: '2025-01-18T10:00:00Z',
    verifiedBy: 'user-sa-001',
    rejectionReason: null,
    suspensionReason: null,
    verificationNotes: 'Tier-1 enterprise certification granted.',
    isFeatured: true,
    featuredUntil: '2027-01-01T00:00:00Z',
    createdAt: '2025-01-12T10:00:00Z',
    updatedAt: '2026-09-29T12:00:00Z',
    staffMembers: [
      { id: 'stf-1', name: 'Marco Silva', roleTitle: 'Master Barber & Director', rating: 4.9, reviewsCount: 312, avatarInitials: 'MS' },
      { id: 'stf-2', name: 'Devon Vance', roleTitle: 'Senior Beard Specialist', rating: 4.8, reviewsCount: 198, avatarInitials: 'DV' },
      { id: 'stf-3', name: 'Arjun Nair', roleTitle: 'Precision Shear Artist', rating: 4.9, reviewsCount: 145, avatarInitials: 'AN' }
    ],
    galleryImages: [
      { url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80', category: 'Skin Fades', title: 'Low Skin Taper Fade' },
      { url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80', category: 'Hot Towel Shaves', title: 'Artisanal Lather Shave' },
      { url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80', category: 'Beard Sculpting', title: 'Beard Line Contour' },
      { url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80', category: 'Lounge Ambiance', title: 'Gentleman Lounge & Bar' }
    ],
    testimonials: [
      { id: 't1', author: 'Vikram Sethi', role: 'Architect', comment: 'Marco is a master of razor geometry. The 25% advance booking makes slot reservation completely seamless.', rating: 5 },
      { id: 't2', author: 'Kabir Oberoi', role: 'Creative Director', comment: 'Old-world charm with pristine hospitality. The sovereign grooming combo is unmatched.', rating: 5 }
    ]
  },

  // 2. SPA
  'zenith-spa': {
    id: 'biz-spa-02',
    code: 'NEX-BLR-088',
    slug: 'zenith-spa',
    name: 'Zenith Stone Spa & Sanctuary',
    tagline: 'Holistic Hydrotherapy & Mineral Renewal',
    category: 'spa',
    ownerId: 'usr-3',
    phone: '+91 99450 77122',
    email: 'namaste@zenithspa.in',
    city: 'Bengaluru',
    address: 'Indiranagar 100ft Road',
    postalCode: '560038',
    country: 'India',
    config: {
      advancePaymentPercentage: 25,
      cancellationWindowHours: 8,
      slotIntervalMinutes: 30,
      currency: 'INR',
      currencySymbol: '₹',
      taxGstRate: 18,
      taxTdsRate: 10,
      enableOnlineAdvance: true,
      enableWalkins: true
    },
    templateId: 'tmpl-spa-sanctuary',
    themeId: 'minimal',
    status: 'active',
    verificationStatus: 'under_review',
    verificationSubmittedAt: '2025-05-01T14:30:00Z',
    createdAt: '2025-04-28T10:00:00Z',
    updatedAt: '2026-09-29T12:00:00Z',
    staffMembers: [
      { id: 'stf-4', name: 'Aadhya Sharma', roleTitle: 'Lead Ayurvedic Practitioner', rating: 5.0, reviewsCount: 280, avatarInitials: 'AS' },
      { id: 'stf-5', name: 'Maya Lin', roleTitle: 'Hydrotherapy Specialist', rating: 4.9, reviewsCount: 164, avatarInitials: 'ML' }
    ],
    galleryImages: [
      { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', category: 'Stone Therapy', title: 'Warm Volcanic Stones' },
      { url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80', category: 'Hydro Suites', title: 'Herbal Infusion Bath' },
      { url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80', category: 'Meditation Rooms', title: 'Zen Meditation Suite' }
    ],
    testimonials: [
      { id: 't3', author: 'Dr. Sunita Rao', role: 'Neurologist', comment: 'The volcanic stone therapy restored my muscle tension completely. A true sanctuary in the city.', rating: 5 },
      { id: 't4', author: 'Rohan Mehta', role: 'Founder', comment: 'Pristine hygiene and calming aesthetics. The soundscape alone lowers stress instantly.', rating: 5 }
    ]
  },

  // 3. NAIL STUDIO
  'gloss-chic': {
    id: 'biz-nail-03',
    code: 'NEX-DEL-045',
    slug: 'gloss-chic',
    name: 'Gloss & Chic Nail Bar',
    tagline: 'Russian Dry Manicures & Sculpted Gel Couture',
    category: 'nail-studio' as any,
    ownerId: 'usr-4',
    phone: '+91 98102 33411',
    email: 'hello@glosschicnails.in',
    city: 'New Delhi',
    address: 'Khan Market, Central Delhi',
    postalCode: '110003',
    country: 'India',
    config: {
      advancePaymentPercentage: 25,
      cancellationWindowHours: 4,
      slotIntervalMinutes: 15,
      currency: 'INR',
      currencySymbol: '₹',
      taxGstRate: 18,
      taxTdsRate: 10,
      enableOnlineAdvance: true,
      enableWalkins: true
    },
    templateId: 'tmpl-nail-chic',
    themeId: 'elegant',
    status: 'active',
    verificationStatus: 'verified',
    verificationSubmittedAt: '2025-06-15T11:20:00Z',
    createdAt: '2025-06-10T10:00:00Z',
    updatedAt: '2026-09-29T12:00:00Z',
    staffMembers: [
      { id: 'stf-6', name: 'Elena Rostova', roleTitle: 'Master Russian E-File Artist', rating: 4.9, reviewsCount: 420, avatarInitials: 'ER' },
      { id: 'stf-7', name: 'Pooja Varma', roleTitle: 'Aprés Gel-X Sculptor', rating: 4.8, reviewsCount: 210, avatarInitials: 'PV' }
    ],
    galleryImages: [
      { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80', category: 'Russian Manicure', title: 'Diamond E-File Clean Cuticle' },
      { url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80', category: 'Gel Extensions', title: 'Aprés Gel-X Sculpted Almond' },
      { url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80', category: 'Chrome & Ombre', title: 'Japanese Chrome Aura' }
    ],
    testimonials: [
      { id: 't5', author: 'Tara Khanna', role: 'Stylist', comment: 'The Russian dry manicure stayed flawless for over 4 weeks without a single chip. Best nail bar in Delhi.', rating: 5 },
      { id: 't6', author: 'Meera Sen', role: 'Journalist', comment: 'Incredible detail and sterile autoclaved tools. The gel extensions look completely natural.', rating: 5 }
    ]
  },

  // 4. TATTOO STUDIO
  'mono-tattoo': {
    id: 'biz-tattoo-04',
    code: 'NEX-GOA-019',
    slug: 'mono-tattoo',
    name: 'Mono Blackwork & Fine Line Tattoo',
    tagline: 'Sterile Single-Needle Illustration & Custom Flash',
    category: 'tattoo',
    ownerId: 'usr-5',
    phone: '+91 97650 99881',
    email: 'ink@monotattoo.com',
    city: 'Goa',
    address: 'Anjuna Beach Road, North Goa',
    postalCode: '403509',
    country: 'India',
    config: {
      advancePaymentPercentage: 25,
      cancellationWindowHours: 24,
      slotIntervalMinutes: 30,
      currency: 'INR',
      currencySymbol: '₹',
      taxGstRate: 18,
      taxTdsRate: 10,
      enableOnlineAdvance: true,
      enableWalkins: false
    },
    templateId: 'tmpl-tattoo-mono',
    themeId: 'bold',
    status: 'active',
    verificationStatus: 'pending',
    verificationSubmittedAt: '2025-05-20T16:45:00Z',
    createdAt: '2025-05-18T10:00:00Z',
    updatedAt: '2026-09-29T12:00:00Z',
    staffMembers: [
      { id: 'stf-8', name: 'Kaelen Vance', roleTitle: 'Resident Fine Line Artist', rating: 5.0, reviewsCount: 350, avatarInitials: 'KV' },
      { id: 'stf-9', name: 'Zoya Khan', roleTitle: 'Geometric Flash Specialist', rating: 4.9, reviewsCount: 180, avatarInitials: 'ZK' }
    ],
    galleryImages: [
      { url: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80', category: 'Fine Line', title: 'Micro Botanical Illustration' },
      { url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=800&q=80', category: 'Blackwork & Grey', title: 'Geometric Flash Art' },
      { url: 'https://images.unsplash.com/photo-1590246814883-578336ffb231?auto=format&fit=crop&w=800&q=80', category: 'Sterile Booth', title: 'Hospital-Grade Sterile Booth' }
    ],
    testimonials: [
      { id: 't7', author: 'Sameer Joshi', role: 'Graphic Designer', comment: 'Kaelen’s single-needle precision is astounding. Clean lines, zero blowouts, and a sterile private booth.', rating: 5 },
      { id: 't8', author: 'Nadia D’Souza', role: 'Musician', comment: 'The 25% design deposit made consultation and session scheduling straightforward. Top studio in Goa.', rating: 5 }
    ]
  }
};

export function getPublicBusinessBySlug(slug: string): BusinessSeedData | null {
  return SEEDED_PUBLIC_BUSINESSES[slug] || null;
}
