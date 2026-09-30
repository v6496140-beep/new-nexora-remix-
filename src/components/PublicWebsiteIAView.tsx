import React, { useState } from 'react';
import {
  FileText,
  Layers,
  CheckCircle2,
  ArrowRight,
  Shield,
  Eye,
  ExternalLink,
} from 'lucide-react';

export const PublicWebsiteIAView: React.FC = () => {
  const [selectedPageId, setSelectedPageId] = useState<number>(1);

  const homeSections = [
    { num: 1, name: 'Announcement Bar', purpose: 'Promotional announcement (e.g. seasonal promo, holiday hours, emergency advisory).' },
    { num: 2, name: 'Navbar', purpose: 'Universal 3-Zone contract: Zone 1 Wordmark, Zone 2 Nav Links, Zone 3 Actions & Primary CTA "Book Now".' },
    { num: 3, name: 'Hero', purpose: 'Primary headline, brand value proposition, verified trust markers, and primary/secondary CTAs.' },
    { num: 4, name: 'Featured Services', purpose: 'Curated 3-4 top treatments with duration, price tag, and direct "Book Service" button.' },
    { num: 5, name: 'Packages', purpose: 'Multi-service bundled rituals showcasing savings and total treatment experience.' },
    { num: 6, name: 'About', purpose: 'Salon philosophy, craftsmanship, hygienic standards, and interior atmosphere.' },
    { num: 7, name: 'Staff', purpose: 'Team specialist roster, titles, verified credentials (Area L), and "Book Specialist" action.' },
    { num: 8, name: 'Gallery', purpose: 'Client lookbook visual grid with category filtering (e.g. Fades, Balayage, Nail Art).' },
    { num: 9, name: 'Testimonials', purpose: 'Verified client reviews with 5-star rating, review text, and service verified tag.' },
    { num: 10, name: 'Booking CTA', purpose: 'High-contrast conversion section anchoring visitors directly into the booking engine.' },
    { num: 11, name: 'Contact', purpose: 'Physical location, operating hours, phone, email, parking notes, and Google Maps embed.' },
    { num: 12, name: 'Footer', purpose: 'Quiet copyright, legal terms, 24-hr cancellation policy link, and Nexora attribution.' },
  ];

  const pagesList = [
    {
      id: 1,
      name: 'Home',
      route: '/',
      purpose: 'Central tenant landing page implementing the 12 sequential architectural sections.',
      contentBlocks: 'Announcement · Navbar · Hero · Featured Services · Packages · About · Staff · Gallery · Testimonials · Booking CTA · Contact · Footer',
    },
    {
      id: 2,
      name: 'Services',
      route: '/services',
      purpose: 'Complete categorized treatment menu with sub-category tabs, durations, and pricing tiers.',
      contentBlocks: 'Category Filter Tabs · Service Cards · Duration Counters · Pricing Badges · "Book Service" Direct CTA',
    },
    {
      id: 3,
      name: 'Packages',
      route: '/packages',
      purpose: 'Comprehensive multi-service bundle showcase and seasonal experience packages.',
      contentBlocks: 'Package Cards · Included Treatments Breakdown · Savings Highlight · "Reserve Package" Action',
    },
    {
      id: 4,
      name: 'Gallery',
      route: '/gallery',
      purpose: 'Full studio lookbook portfolio showcasing verified work with category filtering.',
      contentBlocks: 'Filter Pills (Hair / Shaves / Nails / Ink) · 1:1 Aspect Grid · Lightbox Modal Trigger',
    },
    {
      id: 5,
      name: 'About',
      route: '/about',
      purpose: 'Detailed brand heritage, sanitation protocols, autoclave sterilization, and practitioner certifications.',
      contentBlocks: 'Brand Story Narrative · Hygiene Certifications (Barbicide / OSHA) · Master Stylist Bios',
    },
    {
      id: 6,
      name: 'Contact',
      route: '/contact',
      purpose: 'Complete location, driving/transit directions, operating hours, and customer inquiry form.',
      contentBlocks: 'Physical Address · Operating Shift Table · Map Canvas Embed · Contact Inquiry Form',
    },
    {
      id: 7,
      name: 'My Bookings',
      route: '/my-bookings',
      purpose: 'Client reservation lookup portal for checking upcoming visits, downloading receipts, or rescheduling.',
      contentBlocks: 'Phone/Booking Ref Lookup Input · Active Appointments Card · Reschedule/Cancel Trigger · Invoices',
    },
    {
      id: 8,
      name: 'Sign In',
      route: '/sign-in',
      purpose: 'Returning customer authentication portal via email/password or SMS OTP.',
      contentBlocks: 'Credentials Form · "Forgot Password" Recovery · SMS OTP Login Option · "Create Account" Link',
    },
    {
      id: 9,
      name: 'Sign Up',
      route: '/sign-up',
      purpose: 'New customer account registration for saving service history and preferences.',
      contentBlocks: 'Name, Phone, Email Inputs · Password Creation · Terms Agreement · Automatic Profile Seeding',
    },
    {
      id: 10,
      name: 'Booking Flow',
      route: '/book',
      purpose: '5-step conversion funnel modal / slideover with 10-minute slot hold timer.',
      contentBlocks: 'Step 1: Services · Step 2: Staff · Step 3: Date/Time · Step 4: Client Intake · Step 5: Deposit Payment',
    },
    {
      id: 11,
      name: 'Booking Confirmation',
      route: '/book/confirmed',
      purpose: 'Terminal success state confirming slot reservation and issuing calendar export links.',
      contentBlocks: 'Booking Ref ID (#NB-94812) · Date & Time Details · Specialist Card · Add to Google/Apple Calendar',
    },
  ];

  const activePage = pagesList.find((p) => p.id === selectedPageId) || pagesList[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-300 rounded-lg p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>INFORMATION ARCHITECTURE SPECIFICATION</span>
          <span>·</span>
          <span>11 PUBLIC PAGES</span>
          <span>·</span>
          <span>12 HOME SECTIONS</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Public Website Information Architecture
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Complete structural mapping of the public tenant web presence. Establishes the 11 core routes and the 12 mandatory sections comprising the Home page.
        </p>
      </div>

      {/* Two Column Layout: 11 Pages Navigation + Deep Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 11 Pages List */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-mono font-bold text-slate-500 uppercase px-1">
            Public Website Pages (11 Routes)
          </div>
          <div className="space-y-1">
            {pagesList.map((pg) => {
              const isSelected = pg.id === selectedPageId;
              return (
                <button
                  key={pg.id}
                  onClick={() => setSelectedPageId(pg.id)}
                  className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] opacity-60">
                      {pg.id.toString().padStart(2, '0')}.
                    </span>
                    <span className="font-bold text-xs">{pg.name}</span>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                      isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {pg.route}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Page Specification */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-300 rounded-lg p-6 space-y-5">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-slate-400 uppercase font-semibold">
                  Page Route Spec #{activePage.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{activePage.name}</h3>
              </div>
              <span className="font-mono text-xs bg-slate-100 border border-slate-300 px-2.5 py-1 rounded text-slate-800 font-bold">
                Route: {activePage.route}
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-slate-400 font-bold uppercase block">
                Purpose & Scope
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">{activePage.purpose}</p>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-slate-400 font-bold uppercase block">
                Required Content Blocks
              </span>
              <div className="p-3 bg-slate-50 border border-slate-300 rounded font-mono text-xs text-slate-800 leading-relaxed">
                {activePage.contentBlocks}
              </div>
            </div>

            {/* Special Section: If HOME is selected, display the 12 sections breakdown */}
            {activePage.id === 1 && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900 uppercase">
                    Mandatory 12 Sections of the HOME Page
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    Defined in Order
                  </span>
                </div>

                <div className="space-y-1.5">
                  {homeSections.map((sec) => (
                    <div
                      key={sec.num}
                      className="p-2.5 border border-slate-200 rounded bg-slate-50 flex items-start gap-3 text-xs"
                    >
                      <span className="w-5 h-5 rounded bg-slate-200 font-mono text-[10px] font-bold flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                        {sec.num.toString().padStart(2, '0')}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{sec.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {sec.purpose}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
