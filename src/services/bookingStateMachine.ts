// Nexora SalonOS — Phase 4.1 Booking State Machine & Repository Service
// Pure Domain Logic, Strict Multi-Tenancy Enforcement, Immutable History

import {
  BookingEntity,
  BookingStatus,
  PaymentStatus,
  BookingItem,
  BookingStatusAuditLog,
  BookingFinancialSnapshot,
  validateBookingStatusTransition,
  createFinancialSnapshot,
  verifyTenantOwnership
} from '../types/bookingEngine';

export interface CreateBookingDTO {
  businessId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  bookingDate: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:mm'
  items: Array<{
    itemType: 'SERVICE' | 'PACKAGE';
    referenceId: string;
    nameSnapshot: string;
    categorySnapshot: string;
    unitPrice: number; // in standard currency units (e.g. INR 1500)
    durationMinutesSnapshot: number;
    staffId?: string;
    staffNameSnapshot?: string;
  }>;
  primaryStaffId?: string;
  primaryStaffNameSnapshot?: string;
  discount?: number;
  advancePercentage?: number;
  taxGstRate?: number;
  currency?: string;
  notes?: string;
}

export interface TransitionActionOptions {
  changedByUserId: string;
  changedByRole: string;
  reason?: string;
  cancellationReason?: string;
  refundReason?: string;
}

export class BookingStateMachineService {
  /**
   * Factory to initialize a fresh multi-tenant booking entity with financial snapshot
   */
  public static createBooking(dto: CreateBookingDTO): BookingEntity {
    const bookingId = `bk-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const nowIso = new Date().toISOString();

    // 1. Calculate items & duration
    const totalDurationMinutes = dto.items.reduce(
      (sum, item) => sum + item.durationMinutesSnapshot,
      0
    );

    // Calculate end time
    const [startH, startM] = dto.startTime.split(':').map(Number);
    const startMinutes = (startH || 0) * 60 + (startM || 0);
    const endMinutes = startMinutes + totalDurationMinutes;
    const endH = Math.floor(endMinutes / 60) % 24;
    const endM = endMinutes % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    // 2. Generate line items with immutable snapshots
    const items: BookingItem[] = dto.items.map((item, idx) => ({
      id: `bki-${bookingId}-${idx + 1}`,
      bookingId,
      itemType: item.itemType,
      referenceId: item.referenceId,
      nameSnapshot: item.nameSnapshot,
      categorySnapshot: item.categorySnapshot,
      unitPriceCents: Math.round(item.unitPrice * 100),
      durationMinutesSnapshot: item.durationMinutesSnapshot,
      staffId: item.staffId || dto.primaryStaffId,
      staffNameSnapshot: item.staffNameSnapshot || dto.primaryStaffNameSnapshot
    }));

    // 3. Compute safe monetary financial snapshot (cents-based)
    const rawSubtotal = dto.items.reduce((sum, item) => sum + item.unitPrice, 0);
    const discount = dto.discount || 0;
    const advancePercentage = dto.advancePercentage ?? 25;
    const taxGstRate = dto.taxGstRate ?? 18;
    const currency = dto.currency || 'INR';

    const financials: BookingFinancialSnapshot = createFinancialSnapshot(
      rawSubtotal,
      discount,
      advancePercentage,
      taxGstRate,
      currency
    );

    // Initial Audit Entry
    const initialAudit: BookingStatusAuditLog = {
      id: `aud-${Date.now()}-1`,
      bookingId,
      oldStatus: 'DRAFT',
      newStatus: 'DRAFT',
      changedByUserId: dto.customerId,
      changedByRole: 'CUSTOMER',
      reason: 'Initial booking request initialized',
      timestamp: nowIso
    };

    return {
      id: bookingId,
      businessId: dto.businessId,
      customerId: dto.customerId,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      customerEmail: dto.customerEmail,
      staffId: dto.primaryStaffId,
      staffNameSnapshot: dto.primaryStaffNameSnapshot,
      serviceId: dto.items[0]?.referenceId,
      items,
      bookingDate: dto.bookingDate,
      startTime: dto.startTime,
      endTime,
      duration: totalDurationMinutes,
      subtotal: financials.subtotalCents / 100,
      discount: financials.discountCents / 100,
      totalAmount: financials.totalCents / 100,
      advancePercentage: financials.advancePercentage,
      advanceAmount: financials.advanceAmountCents / 100,
      remainingAmount: financials.remainingAmountCents / 100,
      currency,
      financials,
      status: 'DRAFT',
      paymentStatus: 'UNPAID',
      statusHistory: [initialAudit],
      notes: dto.notes,
      createdAt: nowIso,
      updatedAt: nowIso
    };
  }

  /**
   * Execute state transition with strict validation, timestamp updates, and immutable audit record
   */
  public static transitionStatus(
    booking: BookingEntity,
    nextStatus: BookingStatus,
    options: TransitionActionOptions
  ): { success: boolean; updatedBooking?: BookingEntity; error?: string } {
    // 1. Central transition validator check
    const validation = validateBookingStatusTransition(booking.status, nextStatus);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // No-op if same status
    if (booking.status === nextStatus) {
      return { success: true, updatedBooking: booking };
    }

    const nowIso = new Date().toISOString();

    // 2. Create auditable status transition log
    const auditRecord: BookingStatusAuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      bookingId: booking.id,
      oldStatus: booking.status,
      newStatus: nextStatus,
      changedByUserId: options.changedByUserId,
      changedByRole: options.changedByRole,
      reason: options.reason || `Status transitioned from ${booking.status} to ${nextStatus}`,
      timestamp: nowIso
    };

    // 3. Build updated immutable entity
    const updated: BookingEntity = {
      ...booking,
      status: nextStatus,
      updatedAt: nowIso,
      statusHistory: [...booking.statusHistory, auditRecord]
    };

    // 4. Update appropriate lifecycle timestamps
    if (nextStatus === 'CONFIRMED' && !updated.confirmedAt) {
      updated.confirmedAt = nowIso;
    } else if (nextStatus === 'CHECKED_IN' && !updated.checkedInAt) {
      updated.checkedInAt = nowIso;
    } else if (nextStatus === 'COMPLETED' && !updated.completedAt) {
      updated.completedAt = nowIso;
    } else if (nextStatus === 'CANCELLED') {
      updated.cancelledAt = nowIso;
      if (options.cancellationReason) {
        updated.cancellationReason = options.cancellationReason;
      }
    } else if (nextStatus === 'REFUNDED' && !updated.refundedAt) {
      updated.refundedAt = nowIso;
    }

    return { success: true, updatedBooking: updated };
  }

  /**
   * Transition Payment Status (independent from booking state)
   */
  public static updatePaymentStatus(
    booking: BookingEntity,
    nextPaymentStatus: PaymentStatus,
    _options: { changedByUserId: string; changedByRole: string; reason?: string }
  ): BookingEntity {
    const nowIso = new Date().toISOString();
    return {
      ...booking,
      paymentStatus: nextPaymentStatus,
      updatedAt: nowIso
    };
  }

  /**
   * Reschedule an active booking (Date / Time slot update)
   */
  public static reschedule(
    booking: BookingEntity,
    newDate: string,
    newStartTime: string,
    options: TransitionActionOptions
  ): { success: boolean; updatedBooking?: BookingEntity; error?: string } {
    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED' || booking.status === 'REFUNDED') {
      return {
        success: false,
        error: `Cannot reschedule booking in terminal status "${booking.status}"`
      };
    }

    const [startH, startM] = newStartTime.split(':').map(Number);
    const startMinutes = (startH || 0) * 60 + (startM || 0);
    const endMinutes = startMinutes + booking.duration;
    const endH = Math.floor(endMinutes / 60) % 24;
    const endM = endMinutes % 60;
    const newEndTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const nowIso = new Date().toISOString();
    const auditRecord: BookingStatusAuditLog = {
      id: `aud-${Date.now()}-resched`,
      bookingId: booking.id,
      oldStatus: booking.status,
      newStatus: booking.status,
      changedByUserId: options.changedByUserId,
      changedByRole: options.changedByRole,
      reason: options.reason || `Rescheduled to ${newDate} at ${newStartTime}`,
      timestamp: nowIso
    };

    const updated: BookingEntity = {
      ...booking,
      bookingDate: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      updatedAt: nowIso,
      statusHistory: [...booking.statusHistory, auditRecord]
    };

    return { success: true, updatedBooking: updated };
  }
}

// ----------------------------------------------------------------------------
// MULTI-TENANT IN-MEMORY REPOSITORY WITH HARD TENANT BOUNDARIES
// ----------------------------------------------------------------------------

export class MultiTenantBookingRepository {
  private bookings: Map<string, BookingEntity> = new Map();

  constructor(initialBookings?: BookingEntity[]) {
    if (initialBookings) {
      initialBookings.forEach((b) => this.bookings.set(b.id, b));
    }
  }

  /**
   * Find booking by ID with strict Tenant Authorization Boundary
   */
  public getBookingById(bookingId: string, tenantBusinessId: string): BookingEntity | null {
    const booking = this.bookings.get(bookingId);
    if (!booking) return null;

    // Strict Multi-tenant boundary check:
    // A business must NEVER be able to retrieve another business's bookings
    if (!verifyTenantOwnership(booking, tenantBusinessId)) {
      return null; // Return null as if resource does not exist to prevent tenant enumeration
    }

    return booking;
  }

  /**
   * List all bookings strictly scoped to a tenant
   */
  public listBookingsByTenant(tenantBusinessId: string): BookingEntity[] {
    return Array.from(this.bookings.values()).filter(
      (b) => b.businessId === tenantBusinessId
    );
  }

  /**
   * Find booking by payment intent ID for idempotency checks
   */
  public getBookingByPaymentIntentId(paymentIntentId: string): BookingEntity | null {
    if (!paymentIntentId) return null;
    for (const b of this.bookings.values()) {
      if (b.paymentIntentId === paymentIntentId) {
        return b;
      }
    }
    return null;
  }

  /**
   * List all bookings for a staff member strictly scoped to a tenant
   */
  public getStaffBookings(staffId: string, tenantBusinessId: string): BookingEntity[] {
    return Array.from(this.bookings.values()).filter(
      (b) => b.businessId === tenantBusinessId && b.staffId === staffId
    );
  }

  /**
   * Save or insert booking
   */
  public create(booking: BookingEntity): BookingEntity {
    this.bookings.set(booking.id, booking);
    return booking;
  }

  /**
   * Save or update booking with tenant boundary validation
   */
  public saveBooking(booking: BookingEntity, tenantBusinessId: string): boolean {
    if (!verifyTenantOwnership(booking, tenantBusinessId)) {
      throw new Error(`Cross-tenant violation: Booking belongs to ${booking.businessId}, but attempt made by ${tenantBusinessId}`);
    }
    this.bookings.set(booking.id, booking);
    return true;
  }
}
