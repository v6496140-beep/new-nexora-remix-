// Nexora SalonOS — Phase 3.4 Seeded Website Templates Registry
// Minimum 3 templates for Barber, Hair Salon, Beauty, Nail Studio, Spa, Massage, Tattoo, + 1 for remaining categories.
import { TemplateDefinition } from '../types/categoryEngine';

export const TEMPLATES_REGISTRY: TemplateDefinition[] = [
  // -------------------------------------------------------------
  // BARBER TEMPLATES (3 Seeded)
  // -------------------------------------------------------------
  {
    templateId: 'tmpl-barber-luxury',
    category: 'barber',
    name: 'Gentleman Classic Lounge',
    theme: 'luxury',
    layout: 'editorial-luxury',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Classic Craftsmanship & Shaving Rituals',
        title: 'Master Barbering Redefined for Modern Gentlemen',
        subtitle: 'Bespoke scissor work, hot lather razor shaves & curated scotch lounge.',
        description: 'Experience old-world European grooming combined with modern barbering precision.',
        primaryCTA: 'Book Chair (25% Advance)',
        secondaryCTA: 'Explore Grooming Menu'
      },
      services: {
        badge: 'Curated Treatments',
        heading: 'Master Grooming & Razor Services',
        description: 'Every session includes consultation, precision shear work, and warm towel finish.'
      },
      packages: {
        badge: 'Signature Bundles',
        heading: 'Complete Grooming Experiences',
        description: 'Multi-service combinations designed for weddings, galas, and weekly refinement.'
      },
      about: {
        badge: 'Heritage & Craft',
        heading: 'The Art of Traditional Barbering',
        story: 'Founded on the principles of immaculate precision and timeless hospitality.',
        highlights: ['Master Barbers with 10+ Years Experience', 'Single-use Japanese Feather Razor Blades', 'Hospital-Grade UV Sterilization for all clippers']
      },
      booking: {
        badge: 'Fast Online Reservation',
        heading: 'Reserve Your Barber Chair Today',
        description: 'Select your preferred master barber and secure your seat with our automated 25% deposit.',
        advanceHighlight: '25% Online Advance · Instant Confirmation · Free cancellation up to 4 hrs prior'
      }
    }
  },
  {
    templateId: 'tmpl-barber-modern',
    category: 'barber',
    name: 'Urban Blade & Fade Club',
    theme: 'modern',
    layout: 'modern-grid',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'High-Velocity Fades & Street Style',
        title: 'Next-Generation Barbershop & Styling Lab',
        subtitle: 'Zero skin fades, custom hair tattoos, and premium textured cuts.',
        description: 'The premier destination for sharp tapers, textured crops, and clean beard line-ups.',
        primaryCTA: 'Claim Slot (25% Advance)',
        secondaryCTA: 'View Cut Catalog'
      },
      services: {
        heading: 'Precision Cuts & Fade Lab',
        description: 'Engineered fades tailored to your head shape and hair texture.'
      }
    }
  },
  {
    templateId: 'tmpl-barber-minimal',
    category: 'barber',
    name: 'Aesthetic Shear Atelier',
    theme: 'minimal',
    layout: 'minimal-split',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Minimalist Barber Sanctuary',
        title: 'Quiet Luxury Hair Design for Men',
        subtitle: 'Clean lines, organic scalp therapies, and personalized shear architecture.',
        description: 'A serene space focused on precision scissor haircuts and scalp health.',
        primaryCTA: 'Reserve Appointment (25% Adv)',
        secondaryCTA: 'View Stylists'
      }
    }
  },

  // -------------------------------------------------------------
  // HAIR SALON TEMPLATES (3 Seeded)
  // -------------------------------------------------------------
  {
    templateId: 'tmpl-salon-editorial',
    category: 'hair-salon',
    name: 'Haute Editorial Atelier',
    theme: 'modern',
    layout: 'editorial-luxury',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Runway Colorists & Balayage Masters',
        title: 'Couture Hair Architecture & Color Artistry',
        subtitle: 'Dimensional blonding, bespoke lived-in balayage, and botanical blowouts.',
        description: 'Transforming hair into personal works of art with organic European pigments.',
        primaryCTA: 'Book Color Session (25% Adv)',
        secondaryCTA: 'Explore Color Palette'
      },
      services: {
        badge: 'Hair Artistry',
        heading: 'Couture Color & Botanical Care',
        description: 'Tailored hair chemistry formulated specifically for your hair texture and undertone.'
      }
    }
  },
  {
    templateId: 'tmpl-salon-luxury',
    category: 'hair-salon',
    name: 'Maison De Luxe Hair Parlour',
    theme: 'luxury',
    layout: 'warm-organic',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Private Hair Sanctuary',
        title: 'Exquisite Hair Transformations & Rituals',
        subtitle: 'Private styling bays, champagne consultations & master colorists.',
        description: 'An elevated salon experience prioritizing hair health, integrity, and shine.',
        primaryCTA: 'Reserve Styling Bay (25% Adv)',
        secondaryCTA: 'View Lookbook'
      }
    }
  },
  {
    templateId: 'tmpl-salon-minimal',
    category: 'hair-salon',
    name: 'Nordic Clean Hair Studio',
    theme: 'minimal',
    layout: 'minimal-split',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Sustainable & Organic Haircare',
        title: 'Effortless Cuts, Non-Toxic Color & Glow',
        subtitle: 'Eco-certified botanical pigments, dry cutting techniques & scalp facials.',
        description: 'Conscious haircare designed for sustainable, low-maintenance beauty.',
        primaryCTA: 'Book Organic Session',
        secondaryCTA: 'Our Philosophy'
      }
    }
  },

  // -------------------------------------------------------------
  // BEAUTY TEMPLATES (3 Seeded)
  // -------------------------------------------------------------
  {
    templateId: 'tmpl-beauty-clinical',
    category: 'beauty',
    name: 'Clinical Glow Aesthetics MD',
    theme: 'elegant',
    layout: 'editorial-luxury',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Medical Aesthetician Clinic',
        title: 'Advanced Dermal Rejuvenation & Skin Health',
        subtitle: 'HydraFacials, medical dermaplaning, and clinical chemical peels.',
        description: 'Physician-grade aesthetic therapies delivering visible dermal transformation.',
        primaryCTA: 'Schedule Treatment (25% Adv)',
        secondaryCTA: 'View Protocols'
      }
    }
  },
  {
    templateId: 'tmpl-beauty-modern',
    category: 'beauty',
    name: 'Radiance Skin & Lash Bar',
    theme: 'modern',
    layout: 'modern-grid',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Modern Skin & Lash Studio',
        title: 'Effortless Radiance, Lashes & Brow Architecture',
        subtitle: 'Bespoke brow lamination, Russian lash extensions & LED facials.',
        description: 'Contemporary beauty rituals created for high-achieving women.',
        primaryCTA: 'Book Beauty Suite',
        secondaryCTA: 'Treatment Menu'
      }
    }
  },
  {
    templateId: 'tmpl-beauty-luxury',
    category: 'beauty',
    name: 'Le Palais De Beaute',
    theme: 'luxury',
    layout: 'warm-organic',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Haute Skin Aesthetics',
        title: 'Timeless Beauty & Youth Renewal Rituals',
        subtitle: 'Caviar collagen infusions, 24k gold facials & sculpting lymph drainage.',
        description: 'The pinnacle of luxury dermal care in private treatment suites.',
        primaryCTA: 'Reserve VIP Suite (25% Adv)',
        secondaryCTA: 'Discover Menu'
      }
    }
  },

  // -------------------------------------------------------------
  // NAIL STUDIO TEMPLATES (3 Seeded)
  // -------------------------------------------------------------
  {
    templateId: 'tmpl-nail-chic',
    category: 'nail-studio',
    name: 'Gloss & Chic Nail Bar',
    theme: 'elegant',
    layout: 'modern-grid',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Bespoke Nail Art & Gel Studio',
        title: 'Sculpted Gel Extensions & Japanese Nail Art',
        subtitle: 'Russian dry manicures, chrome ombre, and hypoallergenic gel systems.',
        description: 'Impeccable cuticle prep and artistic nail couture lasting over 4 weeks.',
        primaryCTA: 'Book Nail Desk (25% Adv)',
        secondaryCTA: 'View Nail Portfolio'
      }
    }
  },
  {
    templateId: 'tmpl-nail-minimal',
    category: 'nail-studio',
    name: 'Pure Polish Atelier',
    theme: 'minimal',
    layout: 'minimal-split',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Clean Cuticle Care',
        title: 'Non-Toxic Manicures & Bare-Nail Health',
        subtitle: 'Organic plant-based lacquers, IBX nail repair & dry e-file manicures.',
        description: 'Nurturing natural nail beds with restorative Japanese techniques.',
        primaryCTA: 'Reserve Desk',
        secondaryCTA: 'Our Colors'
      }
    }
  },
  {
    templateId: 'tmpl-nail-bold',
    category: 'nail-studio',
    name: 'Obsidian Velvet Nails',
    theme: 'bold',
    layout: 'bold-monochrome',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Avant-Garde Nail Couture',
        title: 'Extreme 3D Sculpted Stilettos & Chrome Art',
        subtitle: 'High-drama editorial nails, piercing chains, and gemstone encapsulation.',
        description: 'Statement nails for visionaries, artists, and trendsetters.',
        primaryCTA: 'Book Custom Set',
        secondaryCTA: 'View 3D Art'
      }
    }
  },

  // -------------------------------------------------------------
  // SPA TEMPLATES (3 Seeded)
  // -------------------------------------------------------------
  {
    templateId: 'tmpl-spa-sanctuary',
    category: 'spa',
    name: 'Serenity Stone Sanctuary',
    theme: 'minimal',
    layout: 'warm-organic',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Holistic Body Healing',
        title: 'Restorative Volcanic Stone & Water Sanctuary',
        subtitle: 'Hydrotherapy baths, heated river stones & eucalyptus steam chambers.',
        description: 'An oasis of stillness designed to restore nervous system equilibrium.',
        primaryCTA: 'Reserve Sanctuary (25% Adv)',
        secondaryCTA: 'Explore Rituals'
      }
    }
  },
  {
    templateId: 'tmpl-spa-luxury',
    category: 'spa',
    name: 'The Royal Hammam & Wellness',
    theme: 'luxury',
    layout: 'editorial-luxury',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Traditional Moroccan Bathing',
        title: 'Authentic Marble Hammam & Black Soap Body Polish',
        subtitle: 'Kessa glove exfoliation, rhassoul clay wraps & orange blossom water.',
        description: 'Centuries of royal bathing heritage brought to life in heated marble suites.',
        primaryCTA: 'Book Hammam Suite',
        secondaryCTA: 'Ritual Journey'
      }
    }
  },
  {
    templateId: 'tmpl-spa-dark',
    category: 'spa',
    name: 'Nocturne Sensory Wellness',
    theme: 'dark',
    layout: 'bold-monochrome',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Deep Recovery & Float Pods',
        title: 'Sensory Deprivation & Sound Therapy',
        subtitle: 'Magnesium float suites, infrared red light saunas & circadian reset.',
        description: 'Modern recovery technology for mental clarity and physical regeneration.',
        primaryCTA: 'Book Float Session',
        secondaryCTA: 'Float Science'
      }
    }
  },

  // -------------------------------------------------------------
  // MASSAGE TEMPLATES (3 Seeded)
  // -------------------------------------------------------------
  {
    templateId: 'tmpl-massage-recovery',
    category: 'massage',
    name: 'Deep Renewal Bodywork',
    theme: 'dark',
    layout: 'modern-grid',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Sports Rehab & Muscle Care',
        title: 'Clinical Deep Tissue & Athletic Therapy',
        subtitle: 'Trigger point release, sports stretching, and myofascial decompression.',
        description: 'Relieve chronic tightness and accelerate performance recovery.',
        primaryCTA: 'Book Bodywork (25% Adv)',
        secondaryCTA: 'Therapy Modalities'
      }
    }
  },
  {
    templateId: 'tmpl-massage-thai',
    category: 'massage',
    name: 'Siam Harmony Thai Therapy',
    theme: 'minimal',
    layout: 'warm-organic',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Ancient Healing Arts',
        title: 'Traditional Thai Acupressure & Mat Stretching',
        subtitle: 'Herbal compress balls, joint mobilization, and rhythmic body pressure.',
        description: 'Balancing physical energy meridians through ancient bodywork wisdom.',
        primaryCTA: 'Book Thai Session',
        secondaryCTA: 'Learn Benefits'
      }
    }
  },
  {
    templateId: 'tmpl-massage-luxury',
    category: 'massage',
    name: 'The Velvet Touch Massage Parlour',
    theme: 'luxury',
    layout: 'editorial-luxury',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Pure Relaxation',
        title: 'Aromatherapy Candle Massage & Warm Oils',
        subtitle: 'Warm shea butter poured gently over tense muscles with botanical essences.',
        description: 'Indulgent body rituals in soundproof private suites.',
        primaryCTA: 'Reserve Massage Room',
        secondaryCTA: 'Oil Blends'
      }
    }
  },

  // -------------------------------------------------------------
  // TATTOO TEMPLATES (3 Seeded)
  // -------------------------------------------------------------
  {
    templateId: 'tmpl-tattoo-mono',
    category: 'tattoo',
    name: 'Mono Blackwork Sanctuary',
    theme: 'bold',
    layout: 'bold-monochrome',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Precision Needle Art',
        title: 'Fine Line, Micro-Realism & Blackwork Flash',
        subtitle: 'Sterile hospital-grade private booths with resident and guest illustrators.',
        description: 'Creating permanent visual storytelling with single-needle precision.',
        primaryCTA: 'Reserve Tattoo Booth (25% Adv)',
        secondaryCTA: 'Browse Flash Art'
      }
    }
  },
  {
    templateId: 'tmpl-tattoo-dark',
    category: 'tattoo',
    name: 'Iron & Ink Custom Atelier',
    theme: 'dark',
    layout: 'modern-grid',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Custom Tattoo Studio',
        title: 'Large-Scale Realism, Neo-Traditional & Sleeves',
        subtitle: 'Bespoke concept design consultations and sterile needle execution.',
        description: 'A contemporary tattoo gallery where fine art meets sterile craftsmanship.',
        primaryCTA: 'Book Concept Session',
        secondaryCTA: 'View Resident Artists'
      }
    }
  },
  {
    templateId: 'tmpl-tattoo-minimal',
    category: 'tattoo',
    name: 'Studio Minimal Needle',
    theme: 'minimal',
    layout: 'minimal-split',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Delicate Fine Line Tattoos',
        title: 'Micro Botanicals, Fine Script & Subtle Ink',
        subtitle: 'Gentle hand-drawn botanical illustrations and minimalist typography.',
        description: 'Subtle, elegant tattoos crafted for first-timers and collectors.',
        primaryCTA: 'Book Fine Line Slot',
        secondaryCTA: 'Artist Portfolio'
      }
    }
  },

  // -------------------------------------------------------------
  // REMAINING CATEGORIES (1 Seeded Each)
  // -------------------------------------------------------------
  {
    templateId: 'tmpl-unisex-modern',
    category: 'unisex-salon',
    name: 'Collective Hair & Grooming Club',
    theme: 'minimal',
    layout: 'modern-grid',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Inclusive Hair Design',
        title: 'Effortless Haircuts, Balayage & Styling For Everyone',
        subtitle: 'Modern unisex salon experience with gender-neutral transparent pricing.',
        description: 'A relaxed social lounge offering precision haircutting and modern color.',
        primaryCTA: 'Book Chair Slot (25% Adv)',
        secondaryCTA: 'Our Stylists'
      }
    }
  },
  {
    templateId: 'tmpl-makeup-glam',
    category: 'makeup-studio',
    name: 'Haute Glamour Makeup Vanity',
    theme: 'elegant',
    layout: 'editorial-luxury',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Bridal & Red Carpet Artistry',
        title: 'Bespoke Airbrush Cosmetics & Bridal Masterclasses',
        subtitle: 'Luminous skin finishes, Hollywood glam waves & HD bridal styling.',
        description: 'Award-winning makeup artists crafting unforgettable beauty moments.',
        primaryCTA: 'Book Vanity Session (25% Adv)',
        secondaryCTA: 'View Bridal Looks'
      }
    }
  },
  {
    templateId: 'tmpl-wellness-holistic',
    category: 'wellness',
    name: 'Prana Holistic Naturopathy & Sound',
    theme: 'minimal',
    layout: 'warm-organic',
    sections: ['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    defaultContent: {
      hero: {
        badge: 'Mind-Body Integration',
        title: 'Tibetan Sound Baths, Acupuncture & Herbal Healing',
        subtitle: 'Ancient naturopathic diagnostics paired with modern bio-hacking protocols.',
        description: 'Cultivating holistic balance and cellular vitality through natural medicine.',
        primaryCTA: 'Reserve Sanctuary Chamber',
        secondaryCTA: 'Our Practitioners'
      }
    }
  }
];
