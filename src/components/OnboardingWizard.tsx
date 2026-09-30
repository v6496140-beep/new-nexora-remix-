import React, { useState } from 'react';
import {
  OnboardingBusinessState,
  OnboardingPublishStatus,
  OnboardingStaffDraft,
  OnboardingGalleryDraft,
  INITIAL_DAY_SCHEDULE
} from '../types/onboarding';
import { CategoryId } from '../types/categoryEngine';
import {
  getAllCategoryIds,
  getCategoryDefinition,
  getTemplatesForCategory,
  resolveTemplateData
} from '../services/templateResolver';
import { Button, Input, Card, Badge, Typography, Avatar, Alert } from '../design-system';
import { PublicWebsiteRenderer } from './public/PublicWebsiteRenderer';
import { BusinessSeedData } from '../data/seededPublicBusinesses';
import {
  Sparkles,
  Layers,
  Building,
  Scissors,
  Users,
  Image,
  Clock,
  Eye,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Globe,
  Upload,
  Check,
  PauseCircle,
  PlayCircle
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete?: (state: OnboardingBusinessState) => void;
  onNavigateToAdmin?: (slug: string) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onNavigateToAdmin
}) => {
  // Wizard Step State (1 to 9)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Business Configuration Draft State
  const [wizardState, setWizardState] = useState<OnboardingBusinessState>(() => {
    const defaultCat = 'barber';
    const catDef = getCategoryDefinition(defaultCat)!;
    const tmpls = getTemplatesForCategory(defaultCat);
    return {
      category: defaultCat,
      templateId: tmpls[0]?.templateId || 'tmpl-barber-luxury',
      theme: tmpls[0]?.theme || 'luxury',
      businessName: 'The Sovereign Barber Lounge',
      ownerName: 'Vikram Singhania',
      phone: '+91 98200 12345',
      email: 'owner@sovereignbarber.in',
      address: '14 Linking Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      logoUrl: '',
      coverImageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      whatsapp: '+91 98200 12345',
      instagram: '@sovereignbarber',
      services: [...catDef.defaultServices],
      staff: [
        { id: 'stf-1', name: 'Marco Silva', role: 'Master Barber', specialization: 'Precision Fades & Hot Towel Shaves', avatarInitials: 'MS' },
        { id: 'stf-2', name: 'Devon Vance', role: 'Senior Barber', specialization: 'Beard Sculpting & Scissor Work', avatarInitials: 'DV' }
      ],
      gallery: [
        { id: 'g-1', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80', title: 'Signature Skin Fade', category: 'Haircuts' },
        { id: 'g-2', url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80', title: 'Artisanal Hot Towel Shave', category: 'Shaves' }
      ],
      schedule: INITIAL_DAY_SCHEDULE,
      publishStatus: 'DRAFT',
      slug: 'sovereign-barber'
    };
  });

  // Category switch handler (updates suggested services and available templates)
  const handleCategorySelect = (categoryId: CategoryId) => {
    const catDef = getCategoryDefinition(categoryId);
    const tmpls = getTemplatesForCategory(categoryId);
    const firstTmpl = tmpls[0];

    // Auto-generate suggested staff roles based on category
    const defaultStaff = (catDef?.staffRoles || ['Specialist']).slice(0, 2).map((role, idx) => ({
      id: `stf-new-${idx + 1}`,
      name: idx === 0 ? 'Alex Rivera' : 'Jordan Smith',
      role,
      specialization: `Bespoke ${catDef?.name} treatments`,
      avatarInitials: idx === 0 ? 'AR' : 'JS'
    }));

    setWizardState((prev) => ({
      ...prev,
      category: categoryId,
      templateId: firstTmpl ? firstTmpl.templateId : prev.templateId,
      theme: firstTmpl ? firstTmpl.theme : prev.theme,
      services: catDef ? [...catDef.defaultServices] : prev.services,
      staff: defaultStaff,
      slug: prev.businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }));
  };

  // Step 4: Add New Service
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(1200);
  const [newServiceDuration, setNewServiceDuration] = useState(45);
  const [newServiceCategory, setNewServiceCategory] = useState('Standard');

  const handleAddService = () => {
    if (!newServiceName.trim()) return;
    const newService = {
      id: `srv-custom-${Date.now()}`,
      name: newServiceName,
      categoryTag: newServiceCategory,
      description: 'Custom tailored treatment.',
      durationMinutes: Number(newServiceDuration),
      basePrice: Number(newServicePrice),
      isPopular: false
    };
    setWizardState((prev) => ({ ...prev, services: [...prev.services, newService] }));
    setNewServiceName('');
  };

  const handleDeleteService = (serviceId: string) => {
    setWizardState((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== serviceId)
    }));
  };

  // Step 5: Add New Staff
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');
  const [newStaffSpec, setNewStaffSpec] = useState('');

  const handleAddStaff = () => {
    if (!newStaffName.trim()) return;
    const newStaffMember: OnboardingStaffDraft = {
      id: `stf-custom-${Date.now()}`,
      name: newStaffName,
      role: newStaffRole || 'Specialist',
      specialization: newStaffSpec || 'General Care',
      avatarInitials: newStaffName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    };
    setWizardState((prev) => ({ ...prev, staff: [...prev.staff, newStaffMember] }));
    setNewStaffName('');
    setNewStaffRole('');
    setNewStaffSpec('');
  };

  const handleDeleteStaff = (staffId: string) => {
    setWizardState((prev) => ({
      ...prev,
      staff: prev.staff.filter((s) => s.id !== staffId)
    }));
  };

  // Step 6: Add Gallery Image
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');

  const handleAddGalleryImage = () => {
    if (!newImageUrl.trim()) return;
    const newImg: OnboardingGalleryDraft = {
      id: `img-${Date.now()}`,
      url: newImageUrl,
      title: newImageTitle || 'Salon Feature',
      category: 'Portfolio'
    };
    setWizardState((prev) => ({ ...prev, gallery: [...prev.gallery, newImg] }));
    setNewImageUrl('');
    setNewImageTitle('');
  };

  // Step 7: Toggle Schedule Day
  const handleToggleDay = (dayIndex: number) => {
    setWizardState((prev) => {
      const updated = [...prev.schedule];
      updated[dayIndex] = { ...updated[dayIndex], isOpen: !updated[dayIndex].isOpen };
      return { ...prev, schedule: updated };
    });
  };

  // Construct Mock Business for Step 8 Live Preview
  const previewBusiness: BusinessSeedData = {
    id: `biz-${wizardState.slug}`,
    code: `NEX-MUM-999`,
    slug: wizardState.slug,
    name: wizardState.businessName,
    tagline: `Premier ${wizardState.category.toUpperCase()} Atelier in ${wizardState.city}`,
    category: wizardState.category as any,
    ownerId: 'usr-owner-active',
    phone: wizardState.phone,
    email: wizardState.email,
    city: wizardState.city,
    address: wizardState.address,
    postalCode: '400050',
    country: wizardState.country,
    verificationStatus: 'pending',
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
    templateId: wizardState.templateId,
    themeId: wizardState.theme,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    staffMembers: wizardState.staff.map((s) => ({
      id: s.id,
      name: s.name,
      roleTitle: s.role,
      rating: 5.0,
      reviewsCount: 12,
      avatarInitials: s.avatarInitials
    })),
    galleryImages: wizardState.gallery.map((g) => ({
      url: g.url,
      category: g.category,
      title: g.title
    })),
    testimonials: [
      { id: 't-init-1', author: 'Ananya Roy', role: 'Verified Client', comment: 'Exceptional craftsmanship and seamless 25% advance booking experience.', rating: 5 }
    ]
  };

  const previewTemplateData = resolveTemplateData(wizardState.category, wizardState.templateId);

  const stepsList = [
    { num: 1, title: 'Category' },
    { num: 2, title: 'Template' },
    { num: 3, title: 'Details' },
    { num: 4, title: 'Services' },
    { num: 5, title: 'Staff' },
    { num: 6, title: 'Gallery' },
    { num: 7, title: 'Hours' },
    { num: 8, title: 'Preview' },
    { num: 9, title: 'Publish' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Scope Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Phase 3.7 Implementation Mode
              </span>
              <span className="text-xs text-slate-400 font-mono">9-Step Business Onboarding Pipeline</span>
            </div>
            <Typography variant="h1" className="text-white">
              Salon Setup & Configuration Wizard
            </Typography>
            <Typography variant="small" className="text-slate-400 mt-1 max-w-3xl">
              Creates structured tenant configuration records dynamically. Category selection automatically tailors templates, staff roles, and treatments.
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="brand">Step {currentStep} of 9</Badge>
          </div>
        </div>
      </div>

      {/* 9-Step Progress Stepper */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px]">
          {stepsList.map((st, idx) => {
            const isDone = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <React.Fragment key={st.num}>
                <button
                  onClick={() => setCurrentStep(st.num)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-sm'
                      : isDone
                      ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent ? 'bg-indigo-600 text-white' : isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isDone ? <Check className="w-3 h-3" /> : st.num}
                  </span>
                  <span>{st.title}</span>
                </button>
                {idx < stepsList.length - 1 && <span className="h-px w-6 bg-slate-200" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* STEP 1: CATEGORY SELECTION */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 1 && (
        <Card padding="lg" className="space-y-6">
          <div>
            <Badge variant="brand">Step 1</Badge>
            <Typography variant="h2" className="mt-1">Select Your Salon Category</Typography>
            <Typography variant="small" className="text-slate-500">
              This determines your terminology, default services, staff roles, and pre-configured templates.
            </Typography>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {getAllCategoryIds().map((catId) => {
              const cat = getCategoryDefinition(catId)!;
              const isSelected = wizardState.category === catId;
              return (
                <div
                  key={catId}
                  onClick={() => handleCategorySelect(catId)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {cat.defaultTheme}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <Typography variant="h4" className="text-slate-900">{cat.name}</Typography>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 2: TEMPLATE SELECTION */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 2 && (
        <Card padding="lg" className="space-y-6">
          <div>
            <Badge variant="brand">Step 2</Badge>
            <Typography variant="h2" className="mt-1">Choose Website Template</Typography>
            <Typography variant="small" className="text-slate-500">
              Showing tailored templates for <strong className="text-slate-900">{getCategoryDefinition(wizardState.category)?.name}</strong>.
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {getTemplatesForCategory(wizardState.category).map((tmpl) => {
              const isSelected = wizardState.templateId === tmpl.templateId;
              return (
                <div
                  key={tmpl.templateId}
                  onClick={() => setWizardState((prev) => ({ ...prev, templateId: tmpl.templateId, theme: tmpl.theme }))}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="brand">{tmpl.theme}</Badge>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{tmpl.layout}</span>
                  </div>
                  <Typography variant="h3">{tmpl.name}</Typography>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {tmpl.defaultContent.hero?.subtitle || 'Bespoke layout configuration.'}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>{tmpl.sections.length} Sections</span>
                    {isSelected && <span className="text-indigo-600 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Selected</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 3: BUSINESS DETAILS */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 3 && (
        <Card padding="lg" className="space-y-6">
          <div>
            <Badge variant="brand">Step 3</Badge>
            <Typography variant="h2" className="mt-1">Business & Owner Information</Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Business / Salon Name"
              value={wizardState.businessName}
              onChange={(e) => setWizardState((p) => ({ ...p, businessName: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))}
              required
            />
            <Input
              label="Owner Full Name"
              value={wizardState.ownerName}
              onChange={(e) => setWizardState((p) => ({ ...p, ownerName: e.target.value }))}
              required
            />
            <Input
              label="Official Contact Phone"
              value={wizardState.phone}
              onChange={(e) => setWizardState((p) => ({ ...p, phone: e.target.value }))}
              required
            />
            <Input
              label="Business Email"
              type="email"
              value={wizardState.email}
              onChange={(e) => setWizardState((p) => ({ ...p, email: e.target.value }))}
              required
            />
            <Input
              label="Street Address"
              value={wizardState.address}
              onChange={(e) => setWizardState((p) => ({ ...p, address: e.target.value }))}
              required
            />
            <Input
              label="City"
              value={wizardState.city}
              onChange={(e) => setWizardState((p) => ({ ...p, city: e.target.value }))}
              required
            />
            <Input
              label="State / Province"
              value={wizardState.state}
              onChange={(e) => setWizardState((p) => ({ ...p, state: e.target.value }))}
              required
            />
            <Input
              label="Country"
              value={wizardState.country}
              onChange={(e) => setWizardState((p) => ({ ...p, country: e.target.value }))}
              required
            />
            <Input
              label="WhatsApp Business"
              value={wizardState.whatsapp}
              onChange={(e) => setWizardState((p) => ({ ...p, whatsapp: e.target.value }))}
            />
            <Input
              label="Instagram Handle"
              value={wizardState.instagram}
              onChange={(e) => setWizardState((p) => ({ ...p, instagram: e.target.value }))}
            />
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 4: SERVICES MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 4 && (
        <Card padding="lg" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <Badge variant="brand">Step 4</Badge>
              <Typography variant="h2" className="mt-1">Configure Services Menu</Typography>
              <Typography variant="small" className="text-slate-500">
                Pre-populated with category defaults. Add, remove, or edit prices.
              </Typography>
            </div>
          </div>

          {/* Quick Add Form */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <Input
              label="Service Name"
              placeholder="e.g. Beard Trim & Wash"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
            />
            <Input
              label="Price (₹)"
              type="number"
              value={newServicePrice}
              onChange={(e) => setNewServicePrice(Number(e.target.value))}
            />
            <Input
              label="Duration (mins)"
              type="number"
              value={newServiceDuration}
              onChange={(e) => setNewServiceDuration(Number(e.target.value))}
            />
            <Button size="md" onClick={handleAddService} className="w-full">
              <Plus className="w-4 h-4 mr-1" /> Add Service
            </Button>
          </div>

          {/* Active Services List */}
          <div className="space-y-2">
            {wizardState.services.map((srv) => (
              <div key={srv.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{srv.name}</span>
                  <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="font-mono">{srv.durationMinutes} mins</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-700">₹{srv.basePrice}</span>
                    <span>·</span>
                    <span className="text-indigo-600 font-bold">25% Adv: ₹{Math.round(srv.basePrice * 0.25)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteService(srv.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 5: STAFF ROSTER */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 5 && (
        <Card padding="lg" className="space-y-6">
          <div>
            <Badge variant="brand">Step 5</Badge>
            <Typography variant="h2" className="mt-1">Add Staff Specialists</Typography>
            <Typography variant="small" className="text-slate-500">
              Add chair specialists and resident artists who take bookings.
            </Typography>
          </div>

          {/* Add Staff Form */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <Input
              label="Specialist Name"
              placeholder="e.g. Marco Silva"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
            />
            <Input
              label="Role Title"
              placeholder="e.g. Master Barber"
              value={newStaffRole}
              onChange={(e) => setNewStaffRole(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                label="Specialization"
                placeholder="e.g. Scissor Geometry"
                value={newStaffSpec}
                onChange={(e) => setNewStaffSpec(e.target.value)}
              />
              <Button size="md" onClick={handleAddStaff} className="shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Staff Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {wizardState.staff.map((st) => (
              <div key={st.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Avatar name={st.name} size="md" />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{st.name}</span>
                    <span className="text-slate-500 font-semibold">{st.role}</span>
                    <span className="text-[11px] text-slate-400 block">{st.specialization}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteStaff(st.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 6: GALLERY */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 6 && (
        <Card padding="lg" className="space-y-6">
          <div>
            <Badge variant="brand">Step 6</Badge>
            <Typography variant="h2" className="mt-1">Gallery & Photos</Typography>
            <Typography variant="small" className="text-slate-500">
              Provide visual proof of craft and interior ambiance.
            </Typography>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <Input
              label="Image URL"
              placeholder="https://images.unsplash.com/..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <Input
              label="Photo Title"
              placeholder="e.g. Skin Fade Closeup"
              value={newImageTitle}
              onChange={(e) => setNewImageTitle(e.target.value)}
            />
            <Button size="md" onClick={handleAddGalleryImage} className="w-full">
              <Upload className="w-4 h-4 mr-1.5" /> Add to Gallery
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {wizardState.gallery.map((img) => (
              <div key={img.id} className="relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-white text-center">
                  <span className="text-xs font-bold">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 7: OPENING HOURS */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 7 && (
        <Card padding="lg" className="space-y-6">
          <div>
            <Badge variant="brand">Step 7</Badge>
            <Typography variant="h2" className="mt-1">Operating Schedule & Hours</Typography>
          </div>

          <div className="space-y-2 text-xs">
            {wizardState.schedule.map((day, idx) => (
              <div key={day.day} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={day.isOpen}
                    onChange={() => handleToggleDay(idx)}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                  <span className={`font-bold ${day.isOpen ? 'text-slate-900' : 'text-slate-400'}`}>
                    {day.day}
                  </span>
                </div>

                {day.isOpen ? (
                  <div className="flex items-center gap-2 font-mono text-slate-700">
                    <span>{day.openTime}</span>
                    <span>–</span>
                    <span>{day.closeTime}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 font-semibold italic">Closed for Sanitization</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 8: LIVE PREVIEW */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 8 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <Badge variant="brand">Step 8: Live Website Preview</Badge>
              <Typography variant="h3" className="mt-1">
                Rendered from New Tenant Blueprint: <code>/b/{wizardState.slug}</code>
              </Typography>
            </div>
            <Button size="md" onClick={() => setCurrentStep(9)}>
              Proceed to Publish <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>

          {previewTemplateData && (
            <div className="rounded-3xl border border-slate-300 overflow-hidden shadow-2xl bg-white p-4 sm:p-6">
              <PublicWebsiteRenderer
                business={previewBusiness}
                templateData={previewTemplateData}
                currentPath={`/b/${previewBusiness.slug}`}
                onNavigate={(p) => {}}
              />
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 9: PUBLISH ARCHITECTURE */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 9 && (
        <Card padding="lg" className="space-y-6 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Globe className="w-8 h-8" />
          </div>

          <div>
            <Badge variant="success">Step 9: State Finalization</Badge>
            <Typography variant="h2" className="mt-2">Salon Lifecycle & Publishing</Typography>
            <Typography variant="body" className="text-slate-500 text-sm mt-1">
              Configuration created successfully. Manage lifecycle state below.
            </Typography>
          </div>

          {/* Publish State Controller */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            {(['DRAFT', 'PUBLISHED', 'PAUSED'] as OnboardingPublishStatus[]).map((status) => {
              const isCurrent = wizardState.publishStatus === status;
              return (
                <div
                  key={status}
                  onClick={() => setWizardState((p) => ({ ...p, publishStatus: status }))}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                    isCurrent
                      ? status === 'PUBLISHED'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20'
                        : status === 'PAUSED'
                        ? 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-600/20'
                        : 'border-slate-800 bg-slate-50 text-slate-900 ring-2 ring-slate-800/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold block">{status}</span>
                  <span className="text-[10px] text-slate-500 block">
                    {status === 'PUBLISHED' ? 'Live on web' : status === 'PAUSED' ? 'Bookings paused' : 'Private draft'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
            <p className="font-bold text-slate-900">Generated Tenant Config Details:</p>
            <p>Slug: <code className="text-indigo-600 font-bold">/b/{wizardState.slug}</code></p>
            <p>Category: <span className="font-semibold">{wizardState.category}</span></p>
            <p>Template: <span className="font-semibold">{wizardState.templateId}</span></p>
            <p>Advance Required: <span className="font-semibold text-emerald-700">25%</span></p>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Button
              size="lg"
              onClick={() => {
                setWizardState((p) => ({ ...p, publishStatus: 'PUBLISHED' }));
                if (onComplete) onComplete(wizardState);
                if (onNavigateToAdmin) onNavigateToAdmin(wizardState.slug);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Publish & Open Salon Admin
            </Button>
          </div>
        </Card>
      )}

      {/* Navigation Controls Footer */}
      {currentStep < 8 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Button
            variant="outline"
            size="md"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((p) => Math.max(1, p - 1))}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Previous Step
          </Button>

          <Button
            size="md"
            onClick={() => setCurrentStep((p) => Math.min(9, p + 1))}
          >
            Next Step <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      )}
    </div>
  );
};
