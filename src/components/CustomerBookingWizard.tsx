import React, { useState, useEffect, useMemo } from 'react';
import {
  BookingStep,
  CustomerBookingDraft,
  BookingSubmissionResult
} from '../types/bookingFlow';
import {
  ServiceBookingConfig,
  PackageBookingConfig,
  SalonStaffMember,
  isServiceBookable,
  isPackageBookable
} from '../types/servicePackageConfig';
import { TimeSlot, SlotEngineResult } from '../types/slotEngine';
import { centsToRupees } from '../types/bookingEngine';
import { BookingOrchestratorService } from '../services/bookingOrchestratorService';
import { PaymentMethodType, PaymentIntent } from '../types/paymentEngine';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Scissors,
  CreditCard,
  ShieldCheck,
  Phone,
  Mail,
  FileText,
  BadgePercent,
  RefreshCw,
  Building2,
  CalendarCheck,
  Lock
} from 'lucide-react';
import { Button } from '../design-system';

interface CustomerBookingWizardProps {
  businessId: string;
  businessName?: string;
  orchestrator: BookingOrchestratorService;
  onBookingCompleted?: (result: BookingSubmissionResult) => void;
  onDraftChange?: (draft: CustomerBookingDraft) => void;
}

export const CustomerBookingWizard: React.FC<CustomerBookingWizardProps> = ({
  businessId,
  businessName = 'Nexora Premium Salon',
  orchestrator,
  onBookingCompleted,
  onDraftChange
}) => {
  // Current Step (1 to 8)
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);

  // Tab for Step 1 (Services vs Packages)
  const [itemType, setItemType] = useState<'SERVICE' | 'PACKAGE'>('SERVICE');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  // Customer Draft State
  const [draft, setDraft] = useState<CustomerBookingDraft>({
    businessId,
    itemType: 'SERVICE',
    serviceId: '',
    packageId: '',
    staffId: 'ANY_AVAILABLE',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerNotes: ''
  });

  // Data Sources
  const [allServices, setAllServices] = useState<ServiceBookingConfig[]>([]);
  const [allPackages, setAllPackages] = useState<PackageBookingConfig[]>([]);
  const [allStaff, setAllStaff] = useState<SalonStaffMember[]>([]);

  // Slot Engine State
  const [slotResult, setSlotResult] = useState<SlotEngineResult | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);

  // Payment Simulation State (Step 7)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('SANDBOX_TEST');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Final Confirmed Booking State (Step 8)
  const [finalBookingResult, setFinalBookingResult] = useState<BookingSubmissionResult | null>(null);

  // Load Services, Packages, Staff on Business Change
  useEffect(() => {
    const srvs = orchestrator.getServiceManager().listServicesByTenant(businessId);
    const pkgs = orchestrator.getServiceManager().listPackagesByTenant(businessId);
    const stf = orchestrator.getServiceManager().listStaffByTenant(businessId);

    setAllServices(srvs);
    setAllPackages(pkgs);
    setAllStaff(stf);

    // Reset draft if business changed
    setDraft((prev) => ({
      ...prev,
      businessId,
      serviceId: srvs.find((s) => isServiceBookable(s))?.id || '',
      packageId: '',
      staffId: 'ANY_AVAILABLE',
      startTime: ''
    }));
  }, [businessId, orchestrator]);

  // Keep parent informed of draft updates
  const updateDraft = (updater: Partial<CustomerBookingDraft>) => {
    setDraft((prev) => ({ ...prev, ...updater }));
  };

  // Notify parent of draft changes safely after render
  const onDraftChangeRef = React.useRef(onDraftChange);
  useEffect(() => {
    onDraftChangeRef.current = onDraftChange;
  }, [onDraftChange]);

  useEffect(() => {
    if (onDraftChangeRef.current) {
      onDraftChangeRef.current(draft);
    }
  }, [draft]);

  // Filter bookable services & packages
  const bookableServices = useMemo(() => {
    return allServices.filter((s) => isServiceBookable(s));
  }, [allServices]);

  const bookablePackages = useMemo(() => {
    return allPackages.filter((p) => isPackageBookable(p));
  }, [allPackages]);

  // Selected Service or Package Object
  const selectedService = useMemo(() => {
    if (draft.itemType === 'SERVICE' && draft.serviceId) {
      return allServices.find((s) => s.id === draft.serviceId);
    }
    return undefined;
  }, [draft.itemType, draft.serviceId, allServices]);

  const selectedPackage = useMemo(() => {
    if (draft.itemType === 'PACKAGE' && draft.packageId) {
      return allPackages.find((p) => p.id === draft.packageId);
    }
    return undefined;
  }, [draft.itemType, draft.packageId, allPackages]);

  // Eligible Staff for current service
  const eligibleStaff = useMemo(() => {
    if (draft.itemType === 'SERVICE' && selectedService) {
      if (selectedService.eligibleStaffIds && selectedService.eligibleStaffIds.length > 0) {
        return allStaff.filter((s) => s.active && selectedService.eligibleStaffIds?.includes(s.id));
      }
    } else if (draft.itemType === 'PACKAGE' && selectedPackage) {
      if (selectedPackage.eligibleStaffIds && selectedPackage.eligibleStaffIds.length > 0) {
        return allStaff.filter((s) => s.active && selectedPackage.eligibleStaffIds?.includes(s.id));
      }
    }
    return allStaff.filter((s) => s.active);
  }, [draft.itemType, selectedService, selectedPackage, allStaff]);

  // Query Real Slot Engine for Date & Staff
  useEffect(() => {
    if (currentStep >= 3 && (draft.serviceId || draft.packageId) && draft.date) {
      setIsLoadingSlots(true);
      const res = orchestrator.getSlotEngine().generateSlots({
        businessId: draft.businessId,
        serviceId: draft.itemType === 'SERVICE' ? draft.serviceId : undefined,
        packageId: draft.itemType === 'PACKAGE' ? draft.packageId : undefined,
        staffId: draft.staffId === 'ANY_AVAILABLE' ? undefined : draft.staffId,
        date: draft.date
      });
      setSlotResult(res);
      setIsLoadingSlots(false);
    }
  }, [currentStep, draft.businessId, draft.itemType, draft.serviceId, draft.packageId, draft.staffId, draft.date, orchestrator]);

  // Authoritative Calculation for Step 6 & 7
  const authoritativeCalculation = useMemo(() => {
    const itemId = draft.itemType === 'SERVICE' ? draft.serviceId : draft.packageId;
    if (!itemId) return null;
    return orchestrator.calculateAuthoritativeFinancials(draft.businessId, draft.itemType, itemId);
  }, [draft.businessId, draft.itemType, draft.serviceId, draft.packageId, orchestrator]);

  // Next Date range generator (Next 14 days)
  const availableDates = useMemo(() => {
    const dates = [];
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = d.getDate();
      dates.push({ isoDate, dayName, monthName, dayNum, fullDate: d });
    }
    return dates;
  }, []);

  // Step 7: Create Payment Intent and Trigger Confirmation
  const handleInitiatePayment = async () => {
    if (!authoritativeCalculation || !authoritativeCalculation.valid) {
      setPaymentError('Authoritative calculation failed. Please re-check service.');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // 1. Create Payment Intent via Gateway Abstraction
      const intent = await orchestrator.getPaymentGateway().createPaymentIntent({
        businessId: draft.businessId,
        amountCents: authoritativeCalculation.financialSnapshot.advanceAmountCents,
        currency: 'INR',
        customerEmail: draft.customerEmail,
        customerPhone: draft.customerPhone,
        customerName: draft.customerName,
        metadata: {
          bookingDraftId: `dft-${Date.now()}`,
          serviceId: draft.serviceId,
          packageId: draft.packageId,
          date: draft.date,
          startTime: draft.startTime,
          description: `Advance deposit for ${authoritativeCalculation.itemTitle}`
        }
      });

      setPaymentIntent(intent);

      // 2. Confirm Payment via Sandbox Abstraction
      const execResult = await orchestrator.getPaymentGateway().confirmPayment(
        intent.id,
        paymentMethod,
        simulateFailure
      );

      if (!execResult.success) {
        setPaymentError(execResult.errorMessage || 'Simulated payment failed');
        setIsProcessingPayment(false);
        return;
      }

      // 3. Complete Authoritative Booking Orchestration
      const finalResult = await orchestrator.createAuthoritativeBooking({
        draft,
        paymentIntentId: intent.id,
        gatewayTransactionRef: execResult.transactionRef
      });

      setFinalBookingResult(finalResult);
      setIsProcessingPayment(false);

      if (finalResult.success) {
        setCurrentStep(8);
        if (onBookingCompleted) onBookingCompleted(finalResult);
      } else {
        setPaymentError(finalResult.error || 'Authoritative booking verification failed');
      }
    } catch (err: any) {
      setIsProcessingPayment(false);
      setPaymentError(err.message || 'An unexpected error occurred during checkout');
    }
  };

  const handleResetFlow = () => {
    setCurrentStep(1);
    setPaymentError(null);
    setFinalBookingResult(null);
    setPaymentIntent(null);
    updateDraft({
      startTime: '',
      customerNotes: ''
    });
  };

  // --------------------------------------------------------------------------
  // STEP HEADER
  // --------------------------------------------------------------------------
  const stepTitles: Record<BookingStep, { title: string; subtitle: string }> = {
    1: { title: 'Select Service or Package', subtitle: 'Choose from our verified treatment menu' },
    2: { title: 'Select Specialist', subtitle: 'Pick your preferred stylist or select any available' },
    3: { title: 'Choose Date', subtitle: 'Real-time schedule check from salon operating calendar' },
    4: { title: 'Select Time Slot', subtitle: 'Verified slot availability with buffer protection' },
    5: { title: 'Your Contact Details', subtitle: 'We only ask for essential appointment details' },
    6: { title: 'Booking Summary', subtitle: 'Review your appointment and transparent price breakdown' },
    7: { title: 'Advance Payment', subtitle: 'Secure deposit reservation via payment gateway sandbox' },
    8: { title: 'Appointment Confirmed', subtitle: 'Your booking has been authoritatively reserved' }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Wizard Navigation Bar */}
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>{businessName}</span>
              <span className="text-slate-600">•</span>
              <span>Step {currentStep} of 8</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{stepTitles[currentStep].title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{stepTitles[currentStep].subtitle}</p>
          </div>

          {/* Step Progress Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                  currentStep === s
                    ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-400/40'
                    : currentStep > s
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {currentStep > s ? '✓' : s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Wizard Content Container */}
      <div className="p-6 md:p-8 min-h-[460px]">
        {/* =================================================================== */}
        {/* STEP 1: SELECT SERVICE OR PACKAGE                                  */}
        {/* =================================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Toggle Service vs Package */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setItemType('SERVICE');
                    updateDraft({
                      itemType: 'SERVICE',
                      packageId: '',
                      serviceId: bookableServices[0]?.id || ''
                    });
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    itemType === 'SERVICE'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Individual Services ({bookableServices.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setItemType('PACKAGE');
                    updateDraft({
                      itemType: 'PACKAGE',
                      serviceId: '',
                      packageId: bookablePackages[0]?.id || ''
                    });
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    itemType === 'PACKAGE'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Curated Packages ({bookablePackages.length})
                </button>
              </div>

              <span className="text-xs text-slate-500 hidden sm:inline">
                *Only online-bookable services appear
              </span>
            </div>

            {/* Service Grid */}
            {itemType === 'SERVICE' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookableServices.map((srv) => {
                  const isSelected = draft.serviceId === srv.id && draft.itemType === 'SERVICE';
                  return (
                    <div
                      key={srv.id}
                      onClick={() => updateDraft({ itemType: 'SERVICE', serviceId: srv.id, packageId: '' })}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-1 ring-amber-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {srv.categoryId}
                            </span>
                            <h3 className="text-base font-bold text-slate-900 mt-1">{srv.name}</h3>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-extrabold text-slate-900">₹{srv.price}</span>
                            <span className="block text-[10px] text-slate-500">
                              {srv.advancePercentage || 25}% advance deposit
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-3">{srv.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {srv.duration} mins
                          </span>
                          <span className="text-slate-300">•</span>
                          <span>+{srv.bufferTime}m buffer</span>
                        </div>

                        <Button
                          variant={isSelected ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateDraft({ itemType: 'SERVICE', serviceId: srv.id, packageId: '' });
                            setCurrentStep(2);
                          }}
                        >
                          {isSelected ? 'Selected' : 'Book'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Packages Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookablePackages.map((pkg) => {
                  const isSelected = draft.packageId === pkg.id && draft.itemType === 'PACKAGE';
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => updateDraft({ itemType: 'PACKAGE', packageId: pkg.id, serviceId: '' })}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-1 ring-amber-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              Multi-Service Package
                            </span>
                            <h3 className="text-base font-bold text-slate-900 mt-1">{pkg.name}</h3>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-extrabold text-slate-900">₹{pkg.price}</span>
                            {pkg.originalPrice && (
                              <span className="block text-xs line-through text-slate-400">
                                ₹{pkg.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-3">{pkg.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{pkg.duration} mins total</span>
                        </div>

                        <Button
                          variant={isSelected ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateDraft({ itemType: 'PACKAGE', packageId: pkg.id, serviceId: '' });
                            setCurrentStep(2);
                          }}
                        >
                          {isSelected ? 'Selected' : 'Book Package'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: SELECT STAFF                                               */}
        {/* =================================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Selected Treatment</span>
                <h4 className="text-sm font-bold text-slate-900">
                  {draft.itemType === 'SERVICE' ? selectedService?.name : selectedPackage?.name}
                </h4>
              </div>
              <span className="text-xs font-bold text-slate-700">
                ₹{draft.itemType === 'SERVICE' ? selectedService?.price : selectedPackage?.price}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Option A: ANY AVAILABLE STAFF */}
              <div
                onClick={() => updateDraft({ staffId: 'ANY_AVAILABLE' })}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  draft.staffId === 'ANY_AVAILABLE'
                    ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-1 ring-amber-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Any Available Professional</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fastest availability. The slot engine assigns the first available qualified team member.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Recommended for maximum slot options
                  </span>
                </div>
              </div>

              {/* Option B: SPECIFIC QUALIFIED STAFF */}
              {eligibleStaff.map((staff) => {
                const isSelected = draft.staffId === staff.id;
                return (
                  <div
                    key={staff.id}
                    onClick={() => updateDraft({ staffId: staff.id })}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={staff.photo || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80`}
                          alt={staff.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{staff.name}</h3>
                          <span className="text-xs text-slate-500">{staff.role}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {staff.specializations?.map((spec) => (
                          <span key={spec} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Rating: ⭐ {staff.rating || 4.9}</span>
                      {isSelected && <span className="font-bold text-amber-600">Selected</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3 & 4: SELECT DATE & TIME SLOT (REAL SLOT ENGINE)             */}
        {/* =================================================================== */}
        {(currentStep === 3 || currentStep === 4) && (
          <div className="space-y-6">
            {/* 14-Day Date Scroller */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  Select Appointment Date
                </h3>
                <span className="text-xs text-slate-500">
                  Business Timezone: {slotResult?.businessTimezone || 'Asia/Kolkata'}
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {availableDates.map((item) => {
                  const isSelected = draft.date === item.isoDate;
                  return (
                    <button
                      key={item.isoDate}
                      type="button"
                      onClick={() => updateDraft({ date: item.isoDate, startTime: '' })}
                      className={`flex-shrink-0 w-20 p-3 rounded-xl border-2 text-center transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 shadow-sm text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-bold text-slate-400">{item.dayName}</span>
                      <span className="block text-lg font-extrabold my-0.5 text-slate-900">{item.dayNum}</span>
                      <span className="block text-[10px] font-medium text-slate-500">{item.monthName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Available Time Slots ({slotResult?.date})
                </h3>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Available
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Selected
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" /> Unavailable
                  </span>
                </div>
              </div>

              {isLoadingSlots ? (
                <div className="p-12 text-center text-slate-500 text-sm">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                  Evaluating real-time slot matrix...
                </div>
              ) : slotResult && slotResult.slots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-72 overflow-y-auto p-1">
                  {slotResult.slots.map((slot) => {
                    const isSelected = draft.startTime === slot.startTime;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => {
                          if (slot.available) {
                            updateDraft({ startTime: slot.startTime });
                            if (currentStep === 3) setCurrentStep(4);
                          }
                        }}
                        title={slot.reason || (slot.available ? 'Available' : 'Unavailable')}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-sm'
                            : slot.available
                            ? 'bg-white hover:bg-emerald-50 text-slate-900 border-slate-200 hover:border-emerald-400 font-semibold'
                            : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <span className="block text-sm">{slot.startTime}</span>
                        <span className="block text-[10px] text-slate-500 truncate mt-0.5">
                          {slot.available ? `${slot.serviceDurationMinutes}m` : slot.conflictCode?.replace(/_/g, ' ')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm bg-slate-50 rounded-xl">
                  No slots available on this date. Salon might be closed or on holiday.
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 5: CUSTOMER DETAILS                                           */}
        {/* =================================================================== */}
        {currentStep === 5 && (
          <div className="max-w-xl mx-auto space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={draft.customerName}
                  onChange={(e) => updateDraft({ customerName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={draft.customerPhone}
                  onChange={(e) => updateDraft({ customerPhone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. priya.sharma@example.com"
                  value={draft.customerEmail}
                  onChange={(e) => updateDraft({ customerEmail: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Special Requests or Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Any skin allergies, scalp sensitivity, or beverage preferences..."
                value={draft.customerNotes}
                onChange={(e) => updateDraft({ customerNotes: e.target.value })}
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 6: BOOKING SUMMARY (FINANCIAL BREAKDOWN)                       */}
        {/* =================================================================== */}
        {currentStep === 6 && authoritativeCalculation && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 text-base">Booking Summary</h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Verified by Engine
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Salon Location</span>
                  <span className="font-bold text-slate-900">{businessName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Service / Package</span>
                  <span className="font-bold text-slate-900">{authoritativeCalculation.itemTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date & Time</span>
                  <span className="font-bold text-slate-900">
                    {draft.date} at {draft.startTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Duration</span>
                  <span className="font-bold text-slate-900">{authoritativeCalculation.durationMinutes} mins</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Client</span>
                  <span className="font-bold text-slate-900">{draft.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Contact</span>
                  <span className="font-bold text-slate-900">{draft.customerPhone}</span>
                </div>
              </div>

              {/* Financial Ledger Calculation */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{centsToRupees(authoritativeCalculation.financialSnapshot.subtotalCents)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Discount</span>
                  <span>₹{centsToRupees(authoritativeCalculation.financialSnapshot.discountCents)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable Amount</span>
                  <span>₹{centsToRupees(authoritativeCalculation.financialSnapshot.totalCents)}</span>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mt-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold text-amber-900">
                    <span className="flex items-center gap-1">
                      <BadgePercent className="w-3.5 h-3.5 text-amber-700" />
                      Required Advance Deposit ({authoritativeCalculation.advancePercentage}%)
                    </span>
                    <span>₹{centsToRupees(authoritativeCalculation.financialSnapshot.advanceAmountCents)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-amber-700">
                    <span>Balance Due at Salon Counter</span>
                    <span>₹{centsToRupees(authoritativeCalculation.financialSnapshot.remainingAmountCents)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 7: ADVANCE PAYMENT PLACEHOLDER (PSP ABSTRACTION BOUNDARY)      */}
        {/* =================================================================== */}
        {currentStep === 7 && authoritativeCalculation && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                  Payment Gateway Abstraction Boundary
                </h4>
                <p className="text-xs text-purple-700 mt-0.5">
                  This checkout is routed through the developer sandbox payment boundary. Real payment gateways (Razorpay / Stripe / PhonePe) hook into this identical interface.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold uppercase text-slate-500">Advance Deposit Due Now</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{centsToRupees(authoritativeCalculation.financialSnapshot.advanceAmountCents)}
                </span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Select Payment Method (Sandbox Simulation)
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('SANDBOX_TEST')}
                    className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2 ${
                      paymentMethod === 'SANDBOX_TEST'
                        ? 'border-amber-500 bg-amber-50 text-slate-900 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Instant Sandbox Simulator
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2 ${
                      paymentMethod === 'UPI'
                        ? 'border-amber-500 bg-amber-50 text-slate-900 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    UPI / QR Simulation
                  </button>
                </div>
              </div>

              {/* Test failure simulation switch */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>Simulate Bank Failure Scenario</span>
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
              </div>

              {paymentError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center"
              disabled={isProcessingPayment}
              onClick={handleInitiatePayment}
            >
              {isProcessingPayment ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Authoritatively Verifying & Processing...
                </span>
              ) : (
                `Pay ₹${centsToRupees(authoritativeCalculation.financialSnapshot.advanceAmountCents)} & Confirm Booking`
              )}
            </Button>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 8: CONFIRMATION SCREEN                                        */}
        {/* =================================================================== */}
        {currentStep === 8 && finalBookingResult?.booking && (
          <div className="max-w-xl mx-auto space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Booking Confirmed & Guaranteed
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Booking Reference: {finalBookingResult.booking.id}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                A confirmation SMS and receipt have been dispatched to {finalBookingResult.booking.customerPhone}.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Service</span>
                <span className="font-bold text-slate-900">
                  {finalBookingResult.booking.items[0]?.nameSnapshot}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Assigned Professional</span>
                <span className="font-bold text-slate-900">
                  {finalBookingResult.booking.staffNameSnapshot || 'Team Stylist'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-bold text-slate-900">
                  {finalBookingResult.booking.bookingDate} at {finalBookingResult.booking.startTime}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Advance Deposit Paid</span>
                <span className="font-bold text-emerald-600">
                  ₹{centsToRupees(finalBookingResult.booking.financials.advanceAmountCents)} (Paid)
                </span>
              </div>
              <div className="flex justify-between font-bold text-amber-900">
                <span>Remaining Balance Due at Counter</span>
                <span>₹{centsToRupees(finalBookingResult.booking.financials.remainingAmountCents)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="md" onClick={handleResetFlow}>
                Book Another Appointment
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Navigation Controls */}
      {currentStep < 8 && (
        <div className="bg-slate-50 p-4 px-6 md:px-8 border-t border-slate-200 flex items-center justify-between">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentStep === 1 || isProcessingPayment}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1) as BookingStep)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          {currentStep < 7 && (
            <Button
              variant="primary"
              size="sm"
              disabled={
                (currentStep === 1 && !draft.serviceId && !draft.packageId) ||
                (currentStep === 3 && !draft.date) ||
                (currentStep === 4 && !draft.startTime) ||
                (currentStep === 5 &&
                  (!draft.customerName || !draft.customerPhone || !draft.customerEmail.includes('@')))
              }
              onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1) as BookingStep)}
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
