// Nexora SalonOS — Phase 3.4 Seeded Categories Configuration
import { CategoryDefinition, CategoryId } from '../types/categoryEngine';

export const CATEGORIES_REGISTRY: Record<CategoryId, CategoryDefinition> = {
  // 1. BARBER
  barber: {
    id: 'barber',
    name: 'Barber & Men Grooming',
    slug: 'barber',
    description: 'Precision fades, traditional razor shaves, and beard grooming rituals.',
    terminology: {
      service: 'Grooming Service',
      services: 'Grooming Menu',
      staff: 'Barber',
      staffPlural: 'Barbers & Stylists',
      appointment: 'Chair Reservation',
      chairOrRoom: 'Barber Chair',
      customer: 'Gentleman / Client'
    },
    bookingTerminology: {
      selectService: 'Choose Grooming Ritual',
      selectStaff: 'Select Master Barber',
      selectDate: 'Choose Chair Time',
      advanceDepositNotice: '25% Advance deposit secures chair reservation',
      venueBalanceNotice: '75% settled at checkout post-shave',
      confirmButton: 'Reserve Chair (25% Advance)'
    },
    staffRoles: ['Master Barber', 'Senior Barber', 'Beard Specialist', 'Apprentice Barber'],
    defaultTheme: 'luxury',
    homepageSections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    galleryCategories: ['Skin Fades', 'Beard Sculpting', 'Hot Towel Shaves', 'Lounge Ambiance'],
    defaultServices: [
      { id: 'srv-b-1', name: 'Signature Skin Fade', categoryTag: 'Haircut', description: 'Precision foil fade, scissor work, and hot lather neck shave.', durationMinutes: 45, basePrice: 1000, isPopular: true },
      { id: 'srv-b-2', name: 'Classic Gentlemen Scissor Cut', categoryTag: 'Haircut', description: 'Tailored shear cut styled with matte clay or pomade.', durationMinutes: 40, basePrice: 900 },
      { id: 'srv-b-3', name: 'Artisan Hot Towel Razor Shave', categoryTag: 'Shave', description: 'Multi-step essential oil lather with straight razor finish.', durationMinutes: 35, basePrice: 750, isPopular: true },
      { id: 'srv-b-4', name: 'Beard Sculpt & Contour', categoryTag: 'Beard', description: 'Edge detailing, taper, warm towel, and conditioning balm.', durationMinutes: 30, basePrice: 650 },
      { id: 'srv-b-5', name: 'Restorative Scalp Detox & Wash', categoryTag: 'Scalp Care', description: 'Invigorating menthol scrub with acupressure massage.', durationMinutes: 25, basePrice: 600 }
    ],
    defaultPackages: [
      { id: 'pkg-b-1', name: 'The Sovereign Grooming Ritual', badge: 'Signature Combo', serviceNames: ['Signature Skin Fade', 'Artisan Hot Towel Razor Shave', 'Restorative Scalp Detox'], totalDurationMinutes: 105, bundlePrice: 2000, originalPrice: 2350 },
      { id: 'pkg-b-2', name: 'Cut & Beard Perfection', badge: 'Popular', serviceNames: ['Signature Skin Fade', 'Beard Sculpt & Contour'], totalDurationMinutes: 75, bundlePrice: 1450, originalPrice: 1650 }
    ]
  },

  // 2. HAIR SALON
  'hair-salon': {
    id: 'hair-salon',
    name: 'Hair Salon & Color Atelier',
    slug: 'hair-salon',
    description: 'Dimensional color, balayage, keratin smoothing, and precision cuts.',
    terminology: {
      service: 'Hair Treatment',
      services: 'Color & Hair Menu',
      staff: 'Stylist / Colorist',
      staffPlural: 'Creative Stylists',
      appointment: 'Salon Appointment',
      chairOrRoom: 'Styling Station',
      customer: 'Client'
    },
    bookingTerminology: {
      selectService: 'Select Treatment & Color',
      selectStaff: 'Choose Master Stylist',
      selectDate: 'Pick Appointment Time',
      advanceDepositNotice: '25% Advance deposit reserves color bay & stylist block',
      venueBalanceNotice: 'Remaining balance settled at front desk',
      confirmButton: 'Book Styling Session (25% Advance)'
    },
    staffRoles: ['Creative Director', 'Master Colorist', 'Senior Hair Stylist', 'Blowout Specialist'],
    defaultTheme: 'modern',
    homepageSections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    galleryCategories: ['Balayage & Blonding', 'Precision Bobs', 'Bridal Styling', 'Color Corrections'],
    defaultServices: [
      { id: 'srv-hs-1', name: 'Custom Dimensional Balayage', categoryTag: 'Color', description: 'Hand-painted sun-kissed blonde or brunette highlights with gloss toner.', durationMinutes: 150, basePrice: 5500, isPopular: true },
      { id: 'srv-hs-2', name: 'Couture Cut & Botanical Blowdry', categoryTag: 'Haircut', description: 'Customized hair architecture followed by blowout styling.', durationMinutes: 60, basePrice: 1800, isPopular: true },
      { id: 'srv-hs-3', name: 'Brazilian Keratin Infusion', categoryTag: 'Texture', description: 'Formaldehyde-free smoothing therapy lasting up to 16 weeks.', durationMinutes: 120, basePrice: 6500 },
      { id: 'srv-hs-4', name: 'Olaplex Molecular Bond Repair', categoryTag: 'Treatment', description: 'Intensive restorative protocol for chemically processed hair.', durationMinutes: 45, basePrice: 2200 }
    ],
    defaultPackages: [
      { id: 'pkg-hs-1', name: 'Complete Color Transformation', badge: 'Best Value', serviceNames: ['Custom Dimensional Balayage', 'Couture Cut & Botanical Blowdry', 'Olaplex Molecular Bond Repair'], totalDurationMinutes: 255, bundlePrice: 8200, originalPrice: 9500 },
      { id: 'pkg-hs-2', name: 'Editorial Gloss & Blowout Duo', badge: 'Weekend Glow', serviceNames: ['Couture Cut & Botanical Blowdry', 'Olaplex Molecular Bond Repair'], totalDurationMinutes: 105, bundlePrice: 3400, originalPrice: 4000 }
    ]
  },

  // 3. BEAUTY
  beauty: {
    id: 'beauty',
    name: 'Beauty & Skin Aesthetics',
    slug: 'beauty',
    description: 'Clinical hydrafacials, dermaplaning, aesthetic skin peels, and glow rituals.',
    terminology: {
      service: 'Clinical Skin Treatment',
      services: 'Aesthetics Menu',
      staff: 'Aesthetician',
      staffPlural: 'Skin Specialists',
      appointment: 'Skin Consultation & Session',
      chairOrRoom: 'Treatment Suite',
      customer: 'Patient / Client'
    },
    bookingTerminology: {
      selectService: 'Choose Skin Protocol',
      selectStaff: 'Choose Certified Aesthetician',
      selectDate: 'Select Suite Time',
      advanceDepositNotice: '25% Advance deposit reserves treatment suite and clinical serums',
      venueBalanceNotice: 'Balance payable post-consultation',
      confirmButton: 'Schedule Treatment (25% Advance)'
    },
    staffRoles: ['Lead Aesthetician', 'Clinical Dermal Therapist', 'Laser Specialist', 'Skin Consultant'],
    defaultTheme: 'elegant',
    homepageSections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    galleryCategories: ['Hydra Glow', 'Bridal Skin', 'Clinical Peels', 'Micro-Needling'],
    defaultServices: [
      { id: 'srv-bty-1', name: 'HydraFacial MD Signature', categoryTag: 'Facial', description: 'Vortex deep pore extraction, hydration and antioxidant infusion.', durationMinutes: 60, basePrice: 4500, isPopular: true },
      { id: 'srv-bty-2', name: 'Medical Dermaplaning Glow', categoryTag: 'Exfoliation', description: 'Surgical blade exfoliation removing dead skin and vellus hair.', durationMinutes: 45, basePrice: 2800 },
      { id: 'srv-bty-3', name: 'Bio-RePeelCl3 Rejuvenation', categoryTag: 'Chemical Peel', description: 'TCA biphasic peel without downtime or post-peel shedding.', durationMinutes: 40, basePrice: 3800 }
    ],
    defaultPackages: [
      { id: 'pkg-bty-1', name: 'Red Carpet Radiance Protocol', badge: 'Ultimate Glow', serviceNames: ['HydraFacial MD Signature', 'Medical Dermaplaning Glow'], totalDurationMinutes: 105, bundlePrice: 6200, originalPrice: 7300 }
    ]
  },

  // 4. NAIL STUDIO
  'nail-studio': {
    id: 'nail-studio',
    name: 'Nail & Lash Studio',
    slug: 'nail-studio',
    description: 'Russian dry manicures, sculpted gel extensions, and bespoke nail art.',
    terminology: {
      service: 'Nail Service',
      services: 'Nail & Lash Menu',
      staff: 'Nail Artist',
      staffPlural: 'Nail & Lash Technicians',
      appointment: 'Nail Appointment',
      chairOrRoom: 'Nail Desk',
      customer: 'Client'
    },
    bookingTerminology: {
      selectService: 'Choose Nail Art or Set',
      selectStaff: 'Select Nail Artist',
      selectDate: 'Select Desk Slot',
      advanceDepositNotice: '25% Advance deposit secures nail station',
      venueBalanceNotice: '75% settled at nail desk',
      confirmButton: 'Book Nail Desk (25% Advance)'
    },
    staffRoles: ['Master Nail Artist', 'Gel Sculptor', 'Lash Extension Specialist', 'Nail Tech'],
    defaultTheme: 'elegant',
    homepageSections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    galleryCategories: ['Gel Extensions', 'Russian Manicure', 'Chrome & Ombre', 'Lash Lifts'],
    defaultServices: [
      { id: 'srv-nl-1', name: 'Russian E-File Dry Manicure', categoryTag: 'Manicure', description: 'Micro-cuticle diamond clean with reinforced rubber base overlay.', durationMinutes: 75, basePrice: 1600, isPopular: true },
      { id: 'srv-nl-2', name: 'Full Set Aprés Gel-X Extensions', categoryTag: 'Extensions', description: 'Flawless sculpted full-cover soft gel tips in almond or coffin.', durationMinutes: 90, basePrice: 2800, isPopular: true },
      { id: 'srv-nl-3', name: 'Custom Japanese 3D Nail Art', categoryTag: 'Art', description: 'Encapsulated chrome, aura gradients, or gemstone art (10 nails).', durationMinutes: 45, basePrice: 1200 }
    ],
    defaultPackages: [
      { id: 'pkg-nl-1', name: 'High-Gloss Luxury Mani-Pedi', badge: 'Classic Set', serviceNames: ['Russian E-File Dry Manicure', 'Custom Japanese 3D Nail Art'], totalDurationMinutes: 120, bundlePrice: 2400, originalPrice: 2800 }
    ]
  },

  // 5. SPA
  spa: {
    id: 'spa',
    name: 'Spa & Wellness Sanctuary',
    slug: 'spa',
    description: 'Hydrotherapy baths, volcanic stone rituals, and restorative aromatherapy.',
    terminology: {
      service: 'Spa Ritual',
      services: 'Sanctuary Menu',
      staff: 'Spa Therapist',
      staffPlural: 'Wellness Practitioners',
      appointment: 'Spa Sanctuary Booking',
      chairOrRoom: 'Private Spa Suite',
      customer: 'Guest'
    },
    bookingTerminology: {
      selectService: 'Choose Sanctuary Ritual',
      selectStaff: 'Select Practitioner',
      selectDate: 'Select Suite Timing',
      advanceDepositNotice: '25% Advance deposit reserves private hydrotherapy suite',
      venueBalanceNotice: 'Balance payable at lounge reception',
      confirmButton: 'Reserve Spa Suite (25% Advance)'
    },
    staffRoles: ['Lead Spa Therapist', 'Ayurvedic Practitioner', 'Holistic Healer', 'Hydrotherapist'],
    defaultTheme: 'minimal',
    homepageSections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    galleryCategories: ['Hydro Suites', 'Stone Therapy', 'Herbal Baths', 'Meditation Rooms'],
    defaultServices: [
      { id: 'srv-spa-1', name: 'Warm Basalt Volcanic Stone Ritual', categoryTag: 'Body Ritual', description: 'Heated river basalt stones melting muscle tension with wild mint oil.', durationMinutes: 90, basePrice: 3800, isPopular: true },
      { id: 'srv-spa-2', name: 'Organic Himalayan Salt Body Polish', categoryTag: 'Scrub', description: 'Detoxifying pink crystal scrub followed by shea butter wrap.', durationMinutes: 60, basePrice: 2800 }
    ],
    defaultPackages: [
      { id: 'pkg-spa-1', name: 'Zenith Day of Renewal', badge: 'Ultimate Bliss', serviceNames: ['Warm Basalt Volcanic Stone Ritual', 'Organic Himalayan Salt Body Polish'], totalDurationMinutes: 150, bundlePrice: 5600, originalPrice: 6600 }
    ]
  },

  // 6. MASSAGE
  massage: {
    id: 'massage',
    name: 'Massage & Muscle Recovery',
    slug: 'massage',
    description: 'Deep tissue release, athletic sports massage, and Thai acupressure.',
    terminology: {
      service: 'Bodywork Modality',
      services: 'Therapy Menu',
      staff: 'Massage Therapist',
      staffPlural: 'Licensed Bodyworkers',
      appointment: 'Bodywork Session',
      chairOrRoom: 'Therapy Room',
      customer: 'Client'
    },
    bookingTerminology: {
      selectService: 'Choose Bodywork Modality',
      selectStaff: 'Select Licensed Therapist',
      selectDate: 'Choose Room Slot',
      advanceDepositNotice: '25% Advance deposit reserves private treatment room',
      venueBalanceNotice: '75% settled post-session',
      confirmButton: 'Book Bodywork (25% Advance)'
    },
    staffRoles: ['Certified Neuromuscular Therapist', 'Sports Recovery Specialist', 'Deep Tissue Bodyworker'],
    defaultTheme: 'dark',
    homepageSections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    galleryCategories: ['Deep Tissue', 'Sports Rehab', 'Thai Stretch', 'Couples Suites'],
    defaultServices: [
      { id: 'srv-msg-1', name: 'Clinical Deep Tissue Recovery', categoryTag: 'Deep Tissue', description: 'Trigger point therapy relieving chronic myofascial stiffness.', durationMinutes: 60, basePrice: 2500, isPopular: true },
      { id: 'srv-msg-2', name: 'Traditional Thai Assisted Stretch', categoryTag: 'Thai', description: 'Floor mat acupressure and yoga-assisted joint articulation.', durationMinutes: 75, basePrice: 2800 }
    ],
    defaultPackages: [
      { id: 'pkg-msg-1', name: 'Athletic Muscle Reset Bundle', badge: 'Athlete Choice', serviceNames: ['Clinical Deep Tissue Recovery', 'Traditional Thai Assisted Stretch'], totalDurationMinutes: 135, bundlePrice: 4600, originalPrice: 5300 }
    ]
  },

  // 7. TATTOO
  tattoo: {
    id: 'tattoo',
    name: 'Tattoo & Body Art Studio',
    slug: 'tattoo',
    description: 'Custom fine line, blackwork illustration, and flash tattoo artistry.',
    terminology: {
      service: 'Tattoo Session',
      services: 'Flash & Custom Art',
      staff: 'Tattoo Artist',
      staffPlural: 'Resident Artists',
      appointment: 'Studio Session / Consultation',
      chairOrRoom: 'Sterile Booth',
      customer: 'Collector / Client'
    },
    bookingTerminology: {
      selectService: 'Choose Art Size / Style',
      selectStaff: 'Select Resident Artist',
      selectDate: 'Choose Booth Session',
      advanceDepositNotice: '25% Non-refundable design deposit and needle prep block',
      venueBalanceNotice: 'Balance settled at checkout in studio',
      confirmButton: 'Reserve Tattoo Booth (25% Advance)'
    },
    staffRoles: ['Resident Tattoo Artist', 'Guest Illustrator', 'Fine Line Specialist', 'Piercer'],
    defaultTheme: 'bold',
    homepageSections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    galleryCategories: ['Fine Line', 'Blackwork & Grey', 'Geometric Flash', 'Color Illustrative'],
    defaultServices: [
      { id: 'srv-tat-1', name: 'Custom Fine Line Concept (Up to 4")', categoryTag: 'Fine Line', description: 'Single needle precision line work and micro-shading.', durationMinutes: 120, basePrice: 4000, isPopular: true },
      { id: 'srv-tat-2', name: 'Studio Flash Piece (Pre-drawn)', categoryTag: 'Flash', description: 'Select design from artist binder with full sterile needle prep.', durationMinutes: 90, basePrice: 3000 }
    ],
    defaultPackages: [
      { id: 'pkg-tat-1', name: 'Full Day Concept Tattoo Pass', badge: 'Full Session', serviceNames: ['Custom Fine Line Concept (Up to 4")'], totalDurationMinutes: 300, bundlePrice: 12000, originalPrice: 14000 }
    ]
  },

  // 8. UNISEX SALON
  'unisex-salon': {
    id: 'unisex-salon',
    name: 'Unisex Hair & Lounge',
    slug: 'unisex-salon',
    description: 'Modern hair design and salon care for everyone.',
    terminology: {
      service: 'Salon Service',
      services: 'Service Menu',
      staff: 'Stylist',
      staffPlural: 'Styling Team',
      appointment: 'Salon Slot',
      chairOrRoom: 'Salon Chair',
      customer: 'Guest'
    },
    bookingTerminology: {
      selectService: 'Select Hair Service',
      selectStaff: 'Choose Stylist',
      selectDate: 'Pick Time',
      advanceDepositNotice: '25% Advance online booking hold',
      venueBalanceNotice: '75% settled at checkout',
      confirmButton: 'Book Appointment (25% Advance)'
    },
    staffRoles: ['Senior Stylist', 'Colorist', 'Hair Artist'],
    defaultTheme: 'minimal',
    homepageSections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    galleryCategories: ['Cuts', 'Color', 'Styling'],
    defaultServices: [
      { id: 'srv-uni-1', name: 'Complete Restyle Cut & Wash', categoryTag: 'Haircut', description: 'Consultation, wash, cut, and heat styling.', durationMinutes: 50, basePrice: 1200, isPopular: true }
    ],
    defaultPackages: [
      { id: 'pkg-uni-1', name: 'Wash, Cut & Blowout Pack', badge: 'Standard', serviceNames: ['Complete Restyle Cut & Wash'], totalDurationMinutes: 50, bundlePrice: 1100, originalPrice: 1200 }
    ]
  },

  // 9. MAKEUP STUDIO
  'makeup-studio': {
    id: 'makeup-studio',
    name: 'Bridal & Editorial Makeup',
    slug: 'makeup-studio',
    description: 'Bespoke bridal makeup, airbrush cosmetics, and editorial glam.',
    terminology: {
      service: 'Makeup Look',
      services: 'Glam Menu',
      staff: 'Makeup Artist',
      staffPlural: 'MUA Artists',
      appointment: 'Glam Session',
      chairOrRoom: 'Vanity Suite',
      customer: 'Client'
    },
    bookingTerminology: {
      selectService: 'Choose Glam Package',
      selectStaff: 'Select MUA Specialist',
      selectDate: 'Choose Vanity Slot',
      advanceDepositNotice: '25% Advance booking deposit for vanity hold',
      venueBalanceNotice: 'Balance settled after session',
      confirmButton: 'Book Vanity Session (25% Advance)'
    },
    staffRoles: ['Master MUA', 'Bridal Specialist', 'Airbrush Artist'],
    defaultTheme: 'elegant',
    homepageSections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    galleryCategories: ['Bridal', 'Soft Glam', 'Airbrush'],
    defaultServices: [
      { id: 'srv-mua-1', name: 'Signature Soft Glam Makeup', categoryTag: 'Glam', description: 'Luminous base, natural mink lashes, and airbrush contour.', durationMinutes: 75, basePrice: 3500, isPopular: true }
    ],
    defaultPackages: [
      { id: 'pkg-mua-1', name: 'Bridal Trial & Glam Bundle', badge: 'Bridal', serviceNames: ['Signature Soft Glam Makeup'], totalDurationMinutes: 120, bundlePrice: 5500, originalPrice: 6500 }
    ]
  },

  // 10. WELLNESS
  wellness: {
    id: 'wellness',
    name: 'Holistic Wellness & Naturopathy',
    slug: 'wellness',
    description: 'Sound bath therapy, acupuncture, and holistic nutrition.',
    terminology: {
      service: 'Wellness Modality',
      services: 'Holistic Menu',
      staff: 'Practitioner',
      staffPlural: 'Wellness Guides',
      appointment: 'Wellness Consultation',
      chairOrRoom: 'Sanctuary Chamber',
      customer: 'Seeker / Client'
    },
    bookingTerminology: {
      selectService: 'Choose Wellness Session',
      selectStaff: 'Select Holistic Guide',
      selectDate: 'Pick Chamber Time',
      advanceDepositNotice: '25% Advance deposit for sanctuary preparation',
      venueBalanceNotice: '75% settled in clinic',
      confirmButton: 'Reserve Sanctuary (25% Advance)'
    },
    staffRoles: ['Naturopath', 'Sound Healer', 'Acupuncturist'],
    defaultTheme: 'minimal',
    homepageSections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    galleryCategories: ['Sound Baths', 'Acupuncture', 'Meditation'],
    defaultServices: [
      { id: 'srv-wel-1', name: 'Tibetan Sound Bowl Therapy', categoryTag: 'Sound Healing', description: 'Vibrational frequency alignment and guided breathwork.', durationMinutes: 60, basePrice: 2200, isPopular: true }
    ],
    defaultPackages: [
      { id: 'pkg-wel-1', name: 'Holistic Energy Alignment', badge: 'Renewal', serviceNames: ['Tibetan Sound Bowl Therapy'], totalDurationMinutes: 90, bundlePrice: 3000, originalPrice: 3500 }
    ]
  }
};
