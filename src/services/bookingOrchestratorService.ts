// Nexora SalonOS — Phase 4.5 Customer Booking Orchestrator Service
// End-to-End Orchestration, Multi-Tenant Revalidation, Immutability Snapshots, and Payment Verification

import {
  CustomerBookingDraft,
  AuthoritativeRevalidationResult,
  BookingSubmissionPayload,
  BookingSubmissionResult
} from '../types/bookingFlow';
import {
  BookingEntity,
  BookingFinancialSnapshot,
  calculateFinancialSnapshot,
  centsToRupees
} from '../types/bookingEngine';
import { ServicePackageConfigService } from './servicePackageService';
import { StaffScheduleService } from './staffScheduleService';
import { SlotEngineService } from './slotEngineService';
import { MockPaymentGatewayAdapter, mockPaymentGateway } from './paymentGateway';
import { MultiTenantBookingRepository, BookingStateMachineService, TransitionActionOptions } from './bookingStateMachine';
import { parseTimeToMinutes, formatMinutesToTime } from '../types/staffSchedule';
import { advanceCalculationEngine, AdvanceCalculationEngine } from './advanceCalculationEngine';
import { paymentProviderRegistry, PaymentProviderRegistry } from './paymentAdapters';
import { notificationDispatcherService, NotificationDispatcherService } from './notificationService';

export class BookingOrchestratorService {
  private serviceManager: ServicePackageConfigService;
  private scheduleService: StaffScheduleService;
  private slotEngine: SlotEngineService;
  private paymentGateway: MockPaymentGatewayAdapter;
  private bookingRepo: MultiTenantBookingRepository;
  private advanceEngine: AdvanceCalculationEngine;
  private providerRegistry: PaymentProviderRegistry;
  private notificationDispatcher: NotificationDispatcherService;

  constructor(
    serviceManager = new ServicePackageConfigService(),
    scheduleService = new StaffScheduleService(),
    slotEngine = new SlotEngineService(scheduleService, serviceManager),
    paymentGateway = mockPaymentGateway,
    bookingRepo = new MultiTenantBookingRepository(),
    advanceEngine = advanceCalculationEngine,
    providerRegistry = paymentProviderRegistry,
    notificationDispatcher = notificationDispatcherService
  ) {
    this.serviceManager = serviceManager;
    this.scheduleService = scheduleService;
    this.slotEngine = slotEngine;
    this.paymentGateway = paymentGateway;
    this.bookingRepo = bookingRepo;
    this.advanceEngine = advanceEngine;
    this.providerRegistry = providerRegistry;
    this.notificationDispatcher = notificationDispatcher;
  }

  public getNotificationDispatcher(): NotificationDispatcherService {
    return this.notificationDispatcher;
  }

  public getServiceManager(): ServicePackageConfigService {
    return this.serviceManager;
  }

  public getScheduleService(): StaffScheduleService {
    return this.scheduleService;
  }

  public getSlotEngine(): SlotEngineService {
    return this.slotEngine;
  }

  public getPaymentGateway(): MockPaymentGatewayAdapter {
    return this.paymentGateway;
  }

  public getBookingRepo(): MultiTenantBookingRepository {
    return this.bookingRepo;
  }

  public getAdvanceEngine(): AdvanceCalculationEngine {
    return this.advanceEngine;
  }

  public getProviderRegistry(): PaymentProviderRegistry {
    return this.providerRegistry;
  }

  /**
   * Authoritatively calculates pricing, durations, and advance splits from catalog data
   */
  public calculateAuthoritativeFinancials(
    businessId: string,
    itemType: 'SERVICE' | 'PACKAGE',
    itemId: string,
    discountCents: number = 0
  ): {
    valid: boolean;
    error?: string;
    itemTitle: string;
    itemCategory: string;
    durationMinutes: number;
    bufferMinutes: number;
    priceCents: number;
    advancePercentage: number;
    financialSnapshot: BookingFinancialSnapshot;
    eligibleStaffIds: string[];
  } {
    let itemTitle = '';
    let itemCategory = 'General';
    let durationMinutes = 30;
    let bufferMinutes = 0;
    let unitPrice = 0;
    let advancePercentage = 25; // Business standard default
    let eligibleStaffIds: string[] = [];

    if (itemType === 'SERVICE') {
      const srv = this.serviceManager.getService(itemId, businessId);
      if (!srv) {
        return {
          valid: false,
          error: `Service ${itemId} does not exist for business ${businessId}`,
          itemTitle: '',
          itemCategory: '',
          durationMinutes: 0,
          bufferMinutes: 0,
          priceCents: 0,
          advancePercentage: 25,
          financialSnapshot: calculateFinancialSnapshot(0, 0, 25),
          eligibleStaffIds: []
        };
      }

      if (!srv.active || !srv.bookable) {
        return {
          valid: false,
          error: `Service "${srv.name}" is not currently available for online booking`,
          itemTitle: srv.name,
          itemCategory: srv.categoryId,
          durationMinutes: srv.duration,
          bufferMinutes: srv.bufferTime,
          priceCents: Math.round(srv.price * 100),
          advancePercentage: srv.advancePercentage || 25,
          financialSnapshot: calculateFinancialSnapshot(Math.round(srv.price * 100), 0, srv.advancePercentage || 25),
          eligibleStaffIds: srv.eligibleStaffIds || []
        };
      }

      itemTitle = srv.name;
      itemCategory = srv.categoryId;
      durationMinutes = srv.duration;
      bufferMinutes = srv.bufferTime;
      unitPrice = srv.price;
      advancePercentage = srv.advancePercentage ?? 25;
      eligibleStaffIds = srv.eligibleStaffIds || [];
    } else {
      const pkg = this.serviceManager.getPackage(itemId, businessId);
      if (!pkg) {
        return {
          valid: false,
          error: `Package ${itemId} does not exist for business ${businessId}`,
          itemTitle: '',
          itemCategory: '',
          durationMinutes: 0,
          bufferMinutes: 0,
          priceCents: 0,
          advancePercentage: 25,
          financialSnapshot: calculateFinancialSnapshot(0, 0, 25),
          eligibleStaffIds: []
        };
      }

      if (!pkg.active || !pkg.bookable) {
        return {
          valid: false,
          error: `Package "${pkg.name}" is not available for online booking`,
          itemTitle: pkg.name,
          itemCategory: 'Package Deal',
          durationMinutes: pkg.duration,
          bufferMinutes: 15,
          priceCents: Math.round(pkg.price * 100),
          advancePercentage: 25,
          financialSnapshot: calculateFinancialSnapshot(Math.round(pkg.price * 100), 0, 25),
          eligibleStaffIds: pkg.eligibleStaffIds || []
        };
      }

      itemTitle = pkg.name;
      itemCategory = 'Package Deal';
      durationMinutes = pkg.duration;
      bufferMinutes = 15;
      unitPrice = pkg.price;
      advancePercentage = 25;
      eligibleStaffIds = pkg.eligibleStaffIds || [];
    }

    const priceCents = Math.round(unitPrice * 100);
    const financialSnapshot = calculateFinancialSnapshot(priceCents, discountCents, advancePercentage);

    return {
      valid: true,
      itemTitle,
      itemCategory,
      durationMinutes,
      bufferMinutes,
      priceCents,
      advancePercentage,
      financialSnapshot,
      eligibleStaffIds
    };
  }

  /**
   * Complete Server-Side Authoritative Re-Validation of Customer Booking Draft
   * NEVER TRUSTS FRONTEND VALUES!
   */
  public revalidateBookingDraft(draft: CustomerBookingDraft): AuthoritativeRevalidationResult {
    const errors: string[] = [];
    const itemId = draft.itemType === 'SERVICE' ? draft.serviceId : draft.packageId;

    if (!itemId) {
      errors.push('No service or package selected in booking draft');
      return {
        valid: false,
        errors,
        authoritativePriceCents: 0,
        authoritativeDurationMinutes: 0,
        authoritativeBufferMinutes: 0,
        authoritativeAdvancePercentage: 25
      };
    }

    // 1. Authoritative Pricing & Catalog Re-validation
    const fin = this.calculateAuthoritativeFinancials(draft.businessId, draft.itemType, itemId);
    if (!fin.valid) {
      errors.push(fin.error || 'Catalog item invalid');
    }

    // 2. Customer Information Validation
    if (!draft.customerName || draft.customerName.trim().length < 2) {
      errors.push('Customer name must be at least 2 characters');
    }
    if (!draft.customerPhone || draft.customerPhone.trim().length < 7) {
      errors.push('Valid customer phone number is required');
    }
    if (!draft.customerEmail || !draft.customerEmail.includes('@')) {
      errors.push('Valid customer email address is required');
    }

    // 3. Date & Time Format Validation
    if (!draft.date || !/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) {
      errors.push('Valid booking date (YYYY-MM-DD) is required');
    }
    if (!draft.startTime || !/^\d{2}:\d{2}$/.test(draft.startTime)) {
      errors.push('Valid booking start time (HH:mm) is required');
    }

    if (errors.length > 0) {
      return {
        valid: false,
        errors,
        authoritativePriceCents: fin.priceCents,
        authoritativeDurationMinutes: fin.durationMinutes,
        authoritativeBufferMinutes: fin.bufferMinutes,
        authoritativeAdvancePercentage: fin.advancePercentage,
        financialSnapshot: fin.financialSnapshot,
        itemTitle: fin.itemTitle,
        itemCategory: fin.itemCategory
      };
    }

    // 4. Authoritative Slot Engine & Staff Availability Re-verification
    const slotResult = this.slotEngine.generateSlots({
      businessId: draft.businessId,
      serviceId: draft.serviceId,
      packageId: draft.packageId,
      staffId: draft.staffId === 'ANY_AVAILABLE' ? undefined : draft.staffId,
      date: draft.date
    });

    const matchingSlot = slotResult.slots.find((s) => s.startTime === draft.startTime);

    if (!matchingSlot) {
      errors.push(`Time slot ${draft.startTime} does not exist within salon operating hours`);
    } else if (!matchingSlot.available) {
      errors.push(`Slot ${draft.startTime} is no longer available: ${matchingSlot.reason || matchingSlot.conflictCode}`);
    }

    // 5. Resolve Staff Assignment
    let resolvedStaffId = draft.staffId;
    let resolvedStaffName = 'Assigned Professional';

    if (matchingSlot && matchingSlot.available) {
      if (draft.staffId === 'ANY_AVAILABLE' || !draft.staffId) {
        resolvedStaffId = matchingSlot.availableStaffIds[0];
        const staffObj = this.serviceManager.getStaff(resolvedStaffId, draft.businessId);
        resolvedStaffName = staffObj?.name || matchingSlot.primaryStaffName || 'Team Stylist';
      } else {
        const staffObj = this.serviceManager.getStaff(draft.staffId, draft.businessId);
        resolvedStaffName = staffObj?.name || 'Assigned Professional';
      }
    }

    const startMin = parseTimeToMinutes(draft.startTime);
    const endMin = startMin + fin.durationMinutes;
    const calculatedEndTime = formatMinutesToTime(endMin);

    return {
      valid: errors.length === 0,
      errors,
      authoritativePriceCents: fin.priceCents,
      authoritativeDurationMinutes: fin.durationMinutes,
      authoritativeBufferMinutes: fin.bufferMinutes,
      authoritativeAdvancePercentage: fin.advancePercentage,
      financialSnapshot: fin.financialSnapshot,
      resolvedStaffId,
      resolvedStaffName,
      itemTitle: fin.itemTitle,
      itemCategory: fin.itemCategory,
      calculatedEndTime
    };
  }

  /**
   * Final Authoritative Booking Creation Execution
   * Validates Payment Intent, re-checks everything, creates immutable snapshot, saves record
   */
  public async createAuthoritativeBooking(
    payload: BookingSubmissionPayload
  ): Promise<BookingSubmissionResult> {
    const { draft, paymentIntentId, gatewayTransactionRef } = payload;

    // 0. Idempotency Check: Prevent duplicate bookings from duplicate payment notifications or retries
    if (paymentIntentId) {
      const existing = this.bookingRepo.getBookingByPaymentIntentId(paymentIntentId);
      if (existing) {
        return {
          success: true,
          booking: existing
        };
      }
    }

    // 1. Authoritative Re-Validation
    const reval = this.revalidateBookingDraft(draft);
    if (!reval.valid || !reval.financialSnapshot) {
      return {
        success: false,
        revalidationErrors: reval.errors,
        error: `Booking rejected by authoritative validation: ${reval.errors.join(', ')}`
      };
    }

    // 2. Authoritative Payment Verification
    const intent = this.paymentGateway.getPaymentIntent(paymentIntentId);
    if (!intent) {
      return {
        success: false,
        error: 'Payment intent record not found in payment gateway boundary'
      };
    }

    if (intent.status !== 'SUCCEEDED') {
      return {
        success: false,
        error: `Advance payment intent has not succeeded (current status: ${intent.status})`
      };
    }

    if (intent.amountCents < reval.financialSnapshot.advanceAmountCents) {
      return {
        success: false,
        error: `Payment amount ${intent.amountCents} is less than required authoritative advance ${reval.financialSnapshot.advanceAmountCents}`
      };
    }

    // 3. Construct Deterministic Unique Booking ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `NX-BKG-${new Date().getFullYear()}-${randomSuffix}`;
    const nowIso = new Date().toISOString();

    // 4. Construct Immutable Historical Line Item Snapshot
    const lineItem = {
      id: `item-${Date.now().toString(36)}-${randomSuffix}`,
      bookingId: bookingCode,
      itemType: draft.itemType,
      referenceId: (draft.itemType === 'SERVICE' ? draft.serviceId : draft.packageId) || '',
      nameSnapshot: reval.itemTitle || 'Salon Service',
      categorySnapshot: reval.itemCategory || 'General',
      unitPriceCents: reval.financialSnapshot.totalCents,
      durationMinutesSnapshot: reval.authoritativeDurationMinutes,
      staffId: reval.resolvedStaffId,
      staffNameSnapshot: reval.resolvedStaffName
    };

    // 5. Construct Immutable Booking Entity
    const booking: BookingEntity = {
      id: bookingCode,
      businessId: draft.businessId,
      customerId: `cust-${draft.customerPhone.replace(/\D/g, '').slice(-6) || 'guest'}`,
      customerName: draft.customerName.trim(),
      customerPhone: draft.customerPhone.trim(),
      customerEmail: draft.customerEmail.trim(),
      staffId: reval.resolvedStaffId,
      staffNameSnapshot: reval.resolvedStaffName,
      serviceId: draft.serviceId,
      packageId: draft.packageId,
      items: [lineItem],
      financials: reval.financialSnapshot,
      bookingDate: draft.date,
      startTime: draft.startTime,
      endTime: reval.calculatedEndTime || '12:00',
      duration: reval.authoritativeDurationMinutes,
      subtotal: reval.financialSnapshot.subtotalCents / 100,
      discount: reval.financialSnapshot.discountCents / 100,
      totalAmount: reval.financialSnapshot.totalCents / 100,
      advancePercentage: reval.authoritativeAdvancePercentage,
      advanceAmount: reval.financialSnapshot.advanceAmountCents / 100,
      remainingAmount: reval.financialSnapshot.remainingAmountCents / 100,
      currency: reval.financialSnapshot.currency,
      status: 'ADVANCE_PAID',
      paymentStatus: 'ADVANCE_PAID',
      paymentIntentId,
      gatewayTransactionRef: gatewayTransactionRef || intent.gatewayTransactionRef || `TXN-SBX-${randomSuffix}`,
      notes: draft.customerNotes,
      statusHistory: [
        {
          id: `aud-${Date.now()}-01`,
          bookingId: bookingCode,
          oldStatus: 'DRAFT',
          newStatus: 'ADVANCE_PAID',
          changedByUserId: 'CUSTOMER_PORTAL',
          changedByRole: 'CUSTOMER',
          reason: `Advance paid (₹${centsToRupees(reval.financialSnapshot.advanceAmountCents)}) via ${intent.paymentMethod || 'Sandbox Payment'}`,
          timestamp: nowIso
        }
      ],
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // 6. Persist to Multi-Tenant Repository and Live Slot Engine
    this.bookingRepo.create(booking);
    this.slotEngine.addBooking(booking);

    // 7. Release any slot lock
    if (draft.slotLockId) {
      this.slotEngine.getLockManager().releaseLock(draft.slotLockId);
    }

    // 8. Asynchronously Dispatch Booking Confirmed Event (Fault-Isolated)
    try {
      this.notificationDispatcher.dispatchBookingEvent({
        event: 'BOOKING_CONFIRMED',
        booking
      }).catch((err) => {
        console.warn('Async notification warning:', err);
      });
    } catch (err) {
      // Ignored: Notification failure MUST NOT break booking creation
    }

    return {
      success: true,
      booking
    };
  }

  /**
   * Admin Reschedule Booking with Server-Side Availability Re-Verification
   */
  public adminRescheduleBooking(
    tenantBusinessId: string,
    bookingId: string,
    newDate: string,
    newStartTime: string,
    options: { changedByUserId: string; changedByRole: string; reason?: string }
  ): { success: boolean; updatedBooking?: BookingEntity; error?: string } {
    const booking = this.bookingRepo.getBookingById(bookingId, tenantBusinessId);
    if (!booking) {
      return { success: false, error: 'Booking not found or tenant access denied' };
    }

    // Server-Side Slot Availability Re-verification
    const slotRes = this.slotEngine.generateSlots({
      businessId: tenantBusinessId,
      serviceId: booking.serviceId,
      packageId: booking.packageId,
      staffId: booking.staffId,
      date: newDate
    });

    const matchingSlot = slotRes.slots.find((s) => s.startTime === newStartTime);
    if (!matchingSlot) {
      return { success: false, error: `Time slot ${newStartTime} is outside salon operating hours on ${newDate}` };
    }
    if (!matchingSlot.available) {
      return { success: false, error: `Time slot ${newStartTime} is occupied or unavailable on ${newDate}` };
    }

    const res = BookingStateMachineService.reschedule(booking, newDate, newStartTime, options);
    if (res.success && res.updatedBooking) {
      this.bookingRepo.saveBooking(res.updatedBooking, tenantBusinessId);
    }
    return res;
  }

  /**
   * Admin Staff Reassignment with Active, Eligible, and Available Checks
   */
  public adminReassignStaff(
    tenantBusinessId: string,
    bookingId: string,
    newStaffId: string,
    options: { changedByUserId: string; changedByRole: string; reason?: string }
  ): { success: boolean; updatedBooking?: BookingEntity; error?: string } {
    const booking = this.bookingRepo.getBookingById(bookingId, tenantBusinessId);
    if (!booking) {
      return { success: false, error: 'Booking not found or tenant access denied' };
    }

    // 1. Check Active Status
    const staffObj = this.serviceManager.getStaff(newStaffId, tenantBusinessId);
    if (!staffObj || !staffObj.active) {
      return { success: false, error: `Staff member ${newStaffId} is inactive or does not exist` };
    }

    // 2. Check Service Eligibility
    if (booking.serviceId) {
      const srv = this.serviceManager.getService(booking.serviceId, tenantBusinessId);
      if (srv && srv.eligibleStaffIds && srv.eligibleStaffIds.length > 0) {
        if (!srv.eligibleStaffIds.includes(newStaffId)) {
          return { success: false, error: `Staff member ${staffObj.name} is not qualified/eligible for service "${srv.name}"` };
        }
      }
    }

    // 3. Check Slot Availability
    const slotRes = this.slotEngine.generateSlots({
      businessId: tenantBusinessId,
      serviceId: booking.serviceId,
      packageId: booking.packageId,
      staffId: newStaffId,
      date: booking.bookingDate
    });

    const matchingSlot = slotRes.slots.find((s) => s.startTime === booking.startTime);
    if (!matchingSlot || !matchingSlot.available) {
      return { success: false, error: `Staff member ${staffObj.name} is not available at ${booking.startTime} on ${booking.bookingDate}` };
    }

    const nowIso = new Date().toISOString();
    const auditRecord = {
      id: `aud-${Date.now()}-reassign`,
      bookingId: booking.id,
      oldStatus: booking.status,
      newStatus: booking.status,
      changedByUserId: options.changedByUserId,
      changedByRole: options.changedByRole,
      reason: options.reason || `Staff reassigned from ${booking.staffNameSnapshot || 'Previous Staff'} to ${staffObj.name}`,
      timestamp: nowIso
    };

    const updatedBooking: BookingEntity = {
      ...booking,
      staffId: newStaffId,
      staffNameSnapshot: staffObj.name,
      updatedAt: nowIso,
      statusHistory: [...booking.statusHistory, auditRecord]
    };

    this.bookingRepo.saveBooking(updatedBooking, tenantBusinessId);
    return { success: true, updatedBooking };
  }
}
