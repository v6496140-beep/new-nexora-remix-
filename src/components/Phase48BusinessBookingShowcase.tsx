import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  RefreshCw,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ListFilter,
  CalendarDays,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  Send,
  MoreVertical,
  CalendarCheck,
  UserPlus,
  Ban,
  Clock3,
  DollarSign,
  FileText,
  BadgeCheck,
  Smartphone
} from 'lucide-react';
import {
  BookingEntity,
  BookingStatus,
  PaymentStatus
} from '../types/bookingEngine';
import { BookingOrchestratorService } from '../services/bookingOrchestratorService';
import { BookingStateMachineService } from '../services/bookingStateMachine';
import { SEEDED_STAFF_MEMBERS } from '../services/servicePackageService';
import { runFoundationTestSuite } from '../test/foundationTests';

// Instantiated shared orchestrator
const orchestrator = new BookingOrchestratorService();
const bookingRepo = orchestrator.getBookingRepo();

// Helper to format ISO date to readable string
const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

// Seed realistic initial bookings for business admin dashboard testing
const seedBusinessBookings = () => {
  const todayIso = new Date().toISOString().split('T')[0];
  
  // Calculate yesterday and tomorrow
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayIso = yesterday.toISOString().split('T')[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowIso = tomorrow.toISOString().split('T')[0];

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 5);
  const nextWeekIso = nextWeek.toISOString().split('T')[0];

  const sampleBookings: BookingEntity[] = [
    {
      id: 'NX-BK-TODAY-01',
      businessId: 'biz-barber-001',
      customerId: 'cust-101',
      customerName: 'Aarav Sharma',
      customerPhone: '+91 98765 43210',
      customerEmail: 'aarav.sharma@example.com',
      staffId: 'stf-rc-01',
      staffNameSnapshot: 'Vikram Rajput',
      serviceId: 'srv-barber-1',
      items: [
        {
          id: 'item-101',
          bookingId: 'NX-BK-TODAY-01',
          itemType: 'SERVICE',
          referenceId: 'srv-barber-1',
          nameSnapshot: 'Signature Royal Beard Sculpt & Razor Fade',
          categorySnapshot: 'barber',
          unitPriceCents: 120000,
          durationMinutesSnapshot: 45,
          staffId: 'stf-rc-01',
          staffNameSnapshot: 'Vikram Rajput'
        }
      ],
      bookingDate: todayIso,
      startTime: '10:00',
      endTime: '10:45',
      duration: 45,
      subtotal: 1200,
      discount: 0,
      totalAmount: 1200,
      advancePercentage: 25,
      advanceAmount: 300,
      remainingAmount: 900,
      currency: 'INR',
      financials: {
        currency: 'INR',
        subtotalCents: 120000,
        discountCents: 0,
        totalCents: 120000,
        advancePercentage: 25,
        advanceAmountCents: 30000,
        remainingAmountCents: 90000,
        taxGstCents: 0
      },
      status: 'CONFIRMED',
      paymentStatus: 'ADVANCE_PAID',
      notes: 'Customer requested extra precision beard styling for wedding event.',
      statusHistory: [
        {
          id: 'aud-seed-1',
          bookingId: 'NX-BK-TODAY-01',
          oldStatus: 'DRAFT',
          newStatus: 'ADVANCE_PAID',
          changedByUserId: 'cust-101',
          changedByRole: 'CUSTOMER',
          reason: 'Advance payment verified online',
          timestamp: new Date().toISOString()
        },
        {
          id: 'aud-seed-2',
          bookingId: 'NX-BK-TODAY-01',
          oldStatus: 'ADVANCE_PAID',
          newStatus: 'CONFIRMED',
          changedByUserId: 'SYSTEM',
          changedByRole: 'SYSTEM',
          reason: 'Automated booking confirmation dispatched',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'NX-BK-TODAY-02',
      businessId: 'biz-barber-001',
      customerId: 'cust-102',
      customerName: 'Priya Malhotra',
      customerPhone: '+91 98111 22334',
      customerEmail: 'priya.m@example.com',
      staffId: 'stf-rc-02',
      staffNameSnapshot: 'Sameer Khan',
      serviceId: 'srv-barber-1',
      items: [
        {
          id: 'item-102',
          bookingId: 'NX-BK-TODAY-02',
          itemType: 'SERVICE',
          referenceId: 'srv-barber-1',
          nameSnapshot: 'Classic Haircut & Hot Towel Finish',
          categorySnapshot: 'barber',
          unitPriceCents: 80000,
          durationMinutesSnapshot: 30,
          staffId: 'stf-rc-02',
          staffNameSnapshot: 'Sameer Khan'
        }
      ],
      bookingDate: todayIso,
      startTime: '11:30',
      endTime: '12:00',
      duration: 30,
      subtotal: 800,
      discount: 0,
      totalAmount: 800,
      advancePercentage: 25,
      advanceAmount: 200,
      remainingAmount: 600,
      currency: 'INR',
      financials: {
        currency: 'INR',
        subtotalCents: 80000,
        discountCents: 0,
        totalCents: 80000,
        advancePercentage: 25,
        advanceAmountCents: 20000,
        remainingAmountCents: 60000,
        taxGstCents: 0
      },
      status: 'CHECKED_IN',
      paymentStatus: 'ADVANCE_PAID',
      notes: 'Arrived 5 minutes early in lobby.',
      statusHistory: [
        {
          id: 'aud-seed-3',
          bookingId: 'NX-BK-TODAY-02',
          oldStatus: 'CONFIRMED',
          newStatus: 'CHECKED_IN',
          changedByUserId: 'ADMIN_DESK',
          changedByRole: 'ADMIN',
          reason: 'Reception desk check-in',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'NX-BK-TODAY-03',
      businessId: 'biz-barber-001',
      customerId: 'cust-103',
      customerName: 'Kabir Mehta',
      customerPhone: '+91 97777 88899',
      customerEmail: 'kabir.mehta@example.com',
      staffId: 'stf-rc-01',
      staffNameSnapshot: 'Vikram Rajput',
      serviceId: 'srv-barber-1',
      items: [
        {
          id: 'item-103',
          bookingId: 'NX-BK-TODAY-03',
          itemType: 'SERVICE',
          referenceId: 'srv-barber-1',
          nameSnapshot: 'Gentleman Grooming Package',
          categorySnapshot: 'barber',
          unitPriceCents: 200000,
          durationMinutesSnapshot: 60,
          staffId: 'stf-rc-01',
          staffNameSnapshot: 'Vikram Rajput'
        }
      ],
      bookingDate: todayIso,
      startTime: '14:00',
      endTime: '15:00',
      duration: 60,
      subtotal: 2000,
      discount: 0,
      totalAmount: 2000,
      advancePercentage: 25,
      advanceAmount: 500,
      remainingAmount: 1500,
      currency: 'INR',
      financials: {
        currency: 'INR',
        subtotalCents: 200000,
        discountCents: 0,
        totalCents: 200000,
        advancePercentage: 25,
        advanceAmountCents: 50000,
        remainingAmountCents: 150000,
        taxGstCents: 0
      },
      status: 'IN_PROGRESS',
      paymentStatus: 'ADVANCE_PAID',
      notes: 'Currently seated in Master Station 1.',
      statusHistory: [
        {
          id: 'aud-seed-4',
          bookingId: 'NX-BK-TODAY-03',
          oldStatus: 'CHECKED_IN',
          newStatus: 'IN_PROGRESS',
          changedByUserId: 'ADMIN_DESK',
          changedByRole: 'ADMIN',
          reason: 'Service started by Vikram Rajput',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'NX-BK-TOMORROW-01',
      businessId: 'biz-barber-001',
      customerId: 'cust-104',
      customerName: 'Siddharth Roy',
      customerPhone: '+91 96666 55544',
      customerEmail: 'sid.roy@example.com',
      staffId: 'stf-rc-02',
      staffNameSnapshot: 'Sameer Khan',
      serviceId: 'srv-barber-1',
      items: [
        {
          id: 'item-104',
          bookingId: 'NX-BK-TOMORROW-01',
          itemType: 'SERVICE',
          referenceId: 'srv-barber-1',
          nameSnapshot: 'Signature Royal Beard Sculpt',
          categorySnapshot: 'barber',
          unitPriceCents: 120000,
          durationMinutesSnapshot: 45,
          staffId: 'stf-rc-02',
          staffNameSnapshot: 'Sameer Khan'
        }
      ],
      bookingDate: tomorrowIso,
      startTime: '11:00',
      endTime: '11:45',
      duration: 45,
      subtotal: 1200,
      discount: 0,
      totalAmount: 1200,
      advancePercentage: 25,
      advanceAmount: 300,
      remainingAmount: 900,
      currency: 'INR',
      financials: {
        currency: 'INR',
        subtotalCents: 120000,
        discountCents: 0,
        totalCents: 120000,
        advancePercentage: 25,
        advanceAmountCents: 30000,
        remainingAmountCents: 90000,
        taxGstCents: 0
      },
      status: 'CONFIRMED',
      paymentStatus: 'ADVANCE_PAID',
      notes: 'Upcoming appointment.',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'NX-BK-PAST-01',
      businessId: 'biz-barber-001',
      customerId: 'cust-105',
      customerName: 'Rishi Kapoor',
      customerPhone: '+91 95555 44433',
      customerEmail: 'rishi.k@example.com',
      staffId: 'stf-rc-01',
      staffNameSnapshot: 'Vikram Rajput',
      serviceId: 'srv-barber-1',
      items: [
        {
          id: 'item-105',
          bookingId: 'NX-BK-PAST-01',
          itemType: 'SERVICE',
          referenceId: 'srv-barber-1',
          nameSnapshot: 'Signature Royal Beard Sculpt & Razor Fade',
          categorySnapshot: 'barber',
          unitPriceCents: 120000,
          durationMinutesSnapshot: 45,
          staffId: 'stf-rc-01',
          staffNameSnapshot: 'Vikram Rajput'
        }
      ],
      bookingDate: yesterdayIso,
      startTime: '16:00',
      endTime: '16:45',
      duration: 45,
      subtotal: 1200,
      discount: 0,
      totalAmount: 1200,
      advancePercentage: 25,
      advanceAmount: 300,
      remainingAmount: 900,
      currency: 'INR',
      financials: {
        currency: 'INR',
        subtotalCents: 120000,
        discountCents: 0,
        totalCents: 120000,
        advancePercentage: 25,
        advanceAmountCents: 30000,
        remainingAmountCents: 90000,
        taxGstCents: 0
      },
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      notes: 'Customer paid remaining balance in cash.',
      statusHistory: [
        {
          id: 'aud-seed-5',
          bookingId: 'NX-BK-PAST-01',
          oldStatus: 'IN_PROGRESS',
          newStatus: 'COMPLETED',
          changedByUserId: 'ADMIN_DESK',
          changedByRole: 'ADMIN',
          reason: 'Service completed successfully',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'NX-BK-PAST-02',
      businessId: 'biz-barber-001',
      customerId: 'cust-106',
      customerName: 'Anand Bose',
      customerPhone: '+91 94444 33322',
      customerEmail: 'anand.bose@example.com',
      staffId: 'stf-rc-02',
      staffNameSnapshot: 'Sameer Khan',
      serviceId: 'srv-barber-1',
      items: [
        {
          id: 'item-106',
          bookingId: 'NX-BK-PAST-02',
          itemType: 'SERVICE',
          referenceId: 'srv-barber-1',
          nameSnapshot: 'Haircut',
          categorySnapshot: 'barber',
          unitPriceCents: 80000,
          durationMinutesSnapshot: 30,
          staffId: 'stf-rc-02',
          staffNameSnapshot: 'Sameer Khan'
        }
      ],
      bookingDate: yesterdayIso,
      startTime: '15:00',
      endTime: '15:30',
      duration: 30,
      subtotal: 800,
      discount: 0,
      totalAmount: 800,
      advancePercentage: 25,
      advanceAmount: 200,
      remainingAmount: 600,
      currency: 'INR',
      financials: {
        currency: 'INR',
        subtotalCents: 80000,
        discountCents: 0,
        totalCents: 80000,
        advancePercentage: 25,
        advanceAmountCents: 20000,
        remainingAmountCents: 60000,
        taxGstCents: 0
      },
      status: 'NO_SHOW',
      paymentStatus: 'ADVANCE_PAID',
      notes: 'Customer did not show up after 30 mins grace period.',
      statusHistory: [
        {
          id: 'aud-seed-6',
          bookingId: 'NX-BK-PAST-02',
          oldStatus: 'CONFIRMED',
          newStatus: 'NO_SHOW',
          changedByUserId: 'ADMIN_DESK',
          changedByRole: 'ADMIN',
          reason: 'Marked No-Show by reception desk',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'NX-BK-CANCELLED-01',
      businessId: 'biz-barber-001',
      customerId: 'cust-107',
      customerName: 'Gaurav Gill',
      customerPhone: '+91 93333 22211',
      customerEmail: 'gaurav.g@example.com',
      staffId: 'stf-rc-01',
      staffNameSnapshot: 'Vikram Rajput',
      serviceId: 'srv-barber-1',
      items: [
        {
          id: 'item-107',
          bookingId: 'NX-BK-CANCELLED-01',
          itemType: 'SERVICE',
          referenceId: 'srv-barber-1',
          nameSnapshot: 'Beard Trim',
          categorySnapshot: 'barber',
          unitPriceCents: 50000,
          durationMinutesSnapshot: 30,
          staffId: 'stf-rc-01',
          staffNameSnapshot: 'Vikram Rajput'
        }
      ],
      bookingDate: nextWeekIso,
      startTime: '12:00',
      endTime: '12:30',
      duration: 30,
      subtotal: 500,
      discount: 0,
      totalAmount: 500,
      advancePercentage: 25,
      advanceAmount: 125,
      remainingAmount: 375,
      currency: 'INR',
      financials: {
        currency: 'INR',
        subtotalCents: 50000,
        discountCents: 0,
        totalCents: 50000,
        advancePercentage: 25,
        advanceAmountCents: 12500,
        remainingAmountCents: 37500,
        taxGstCents: 0
      },
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED',
      cancellationReason: 'Customer travel plan shifted.',
      notes: 'Refund processed to source account.',
      statusHistory: [
        {
          id: 'aud-seed-7',
          bookingId: 'NX-BK-CANCELLED-01',
          oldStatus: 'CONFIRMED',
          newStatus: 'CANCELLED',
          changedByUserId: 'ADMIN_DESK',
          changedByRole: 'ADMIN',
          reason: 'Cancelled upon customer telephone request',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  sampleBookings.forEach((b) => bookingRepo.create(b));
};

// Seed on module load
seedBusinessBookings();

export function Phase48BusinessBookingShowcase() {
  // State variables
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('biz-barber-001');
  const [activeView, setActiveView] = useState<'LIST' | 'CALENDAR' | 'TESTS'>('LIST');
  const [activeCategoryTab, setActiveCategoryTab] = useState<'ALL' | 'TODAY' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'>('TODAY');
  
  // Calendar View mode
  const [calendarMode, setCalendarMode] = useState<'DAY' | 'WEEK' | 'MONTH'>('DAY');
  const [calendarDate, setCalendarDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterStaffId, setFilterStaffId] = useState<string>('');
  const [filterServiceId, setFilterServiceId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('');

  // Selected Booking for Detail Modal
  const [selectedBooking, setSelectedBooking] = useState<BookingEntity | null>(null);
  
  // Modal states
  const [isRescheduleOpen, setIsRescheduleOpen] = useState<boolean>(false);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTime, setRescheduleTime] = useState<string>('14:00');
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  const [isReassignOpen, setIsReassignOpen] = useState<boolean>(false);
  const [targetStaffId, setTargetStaffId] = useState<string>('');
  const [reassignError, setReassignError] = useState<string | null>(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [cancelReasonInput, setCancelReasonInput] = useState<string>('');

  // Feedback banner
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // Test Suite Execution State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: Array<{ name: string; suite: string; passed: boolean; durationMs: number; error?: string }>;
  } | null>(null);

  // Force re-render state increment
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Available staff for current business
  const businessStaffList = useMemo(() => {
    return SEEDED_STAFF_MEMBERS.filter((s) => s.businessId === selectedBusinessId);
  }, [selectedBusinessId]);

  // Today ISO string
  const todayIso = new Date().toISOString().split('T')[0];

  // Fetch all bookings for selected tenant business
  const tenantBookings = useMemo(() => {
    // refreshKey dependency to force refresh when repository changes
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    refreshKey;
    return bookingRepo.listBookingsByTenant(selectedBusinessId);
  }, [selectedBusinessId, refreshKey]);

  // Filter bookings based on Category Tab, Search & Filters
  const filteredBookings = useMemo(() => {
    return tenantBookings.filter((b) => {
      // 1. Category Tab Filter
      if (activeCategoryTab === 'TODAY') {
        if (b.bookingDate !== todayIso) return false;
      } else if (activeCategoryTab === 'UPCOMING') {
        if (b.bookingDate < todayIso) return false;
        if (b.status === 'COMPLETED' || b.status === 'CANCELLED' || b.status === 'NO_SHOW') return false;
      } else if (activeCategoryTab === 'COMPLETED') {
        if (b.status !== 'COMPLETED') return false;
      } else if (activeCategoryTab === 'CANCELLED') {
        if (b.status !== 'CANCELLED') return false;
      } else if (activeCategoryTab === 'NO_SHOW') {
        if (b.status !== 'NO_SHOW') return false;
      }

      // 2. Search Query (Customer Name, Booking ID, Phone)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = b.customerName.toLowerCase().includes(q);
        const matchesId = b.id.toLowerCase().includes(q);
        const matchesPhone = b.customerPhone.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesPhone) return false;
      }

      // 3. Exact Date Filter
      if (filterDate && b.bookingDate !== filterDate) {
        return false;
      }

      // 4. Staff Filter
      if (filterStaffId && b.staffId !== filterStaffId) {
        return false;
      }

      // 5. Booking Status Filter
      if (filterStatus && b.status !== filterStatus) {
        return false;
      }

      // 6. Payment Status Filter
      if (filterPaymentStatus && b.paymentStatus !== filterPaymentStatus) {
        return false;
      }

      return true;
    });
  }, [
    tenantBookings,
    activeCategoryTab,
    todayIso,
    searchQuery,
    filterDate,
    filterStaffId,
    filterStatus,
    filterPaymentStatus
  ]);

  // Quick Metrics calculation
  const metrics = useMemo(() => {
    const todayBookings = tenantBookings.filter((b) => b.bookingDate === todayIso);
    const confirmedCount = todayBookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'ADVANCE_PAID').length;
    const inProgressCount = todayBookings.filter((b) => b.status === 'IN_PROGRESS' || b.status === 'CHECKED_IN').length;
    const completedCount = todayBookings.filter((b) => b.status === 'COMPLETED').length;

    const totalRevenueTodayCents = todayBookings
      .filter((b) => b.status === 'COMPLETED' || b.status === 'IN_PROGRESS' || b.status === 'CHECKED_IN')
      .reduce((sum, b) => sum + (b.financials?.totalCents || Math.round(b.totalAmount * 100)), 0);

    return {
      todayCount: todayBookings.length,
      confirmedCount,
      inProgressCount,
      completedCount,
      totalRevenueToday: totalRevenueTodayCents / 100
    };
  }, [tenantBookings, todayIso]);

  // Trigger state transition via State Machine
  const handleStateTransition = (booking: BookingEntity, targetStatus: BookingStatus, reason?: string) => {
    setActionSuccessMessage(null);
    setActionErrorMessage(null);

    const res = BookingStateMachineService.transitionStatus(booking, targetStatus, {
      changedByUserId: 'ADMIN_DESK',
      changedByRole: 'ADMIN',
      reason: reason || `Admin transitioned booking status to ${targetStatus}`
    });

    if (res.success && res.updatedBooking) {
      bookingRepo.saveBooking(res.updatedBooking, selectedBusinessId);
      setSelectedBooking(res.updatedBooking);
      setRefreshKey((k) => k + 1);
      setActionSuccessMessage(`Booking ${booking.id} transitioned to ${targetStatus} successfully.`);
    } else {
      setActionErrorMessage(res.error || `Failed to transition booking to ${targetStatus}`);
    }
  };

  // Trigger Reschedule
  const handleExecuteReschedule = () => {
    if (!selectedBooking) return;
    setRescheduleError(null);

    if (!rescheduleDate || !rescheduleTime) {
      setRescheduleError('Please select both a date and time slot.');
      return;
    }

    const res = orchestrator.adminRescheduleBooking(
      selectedBusinessId,
      selectedBooking.id,
      rescheduleDate,
      rescheduleTime,
      {
        changedByUserId: 'ADMIN_DESK',
        changedByRole: 'ADMIN',
        reason: `Admin rescheduled appointment to ${rescheduleDate} at ${rescheduleTime}`
      }
    );

    if (res.success && res.updatedBooking) {
      setSelectedBooking(res.updatedBooking);
      setIsRescheduleOpen(false);
      setRefreshKey((k) => k + 1);
      setActionSuccessMessage(`Booking ${selectedBooking.id} successfully rescheduled to ${rescheduleDate} at ${rescheduleTime}.`);
    } else {
      setRescheduleError(res.error || 'Failed to reschedule booking.');
    }
  };

  // Trigger Staff Reassignment
  const handleExecuteStaffReassign = () => {
    if (!selectedBooking) return;
    setReassignError(null);

    if (!targetStaffId) {
      setReassignError('Please select a staff member.');
      return;
    }

    const res = orchestrator.adminReassignStaff(
      selectedBusinessId,
      selectedBooking.id,
      targetStaffId,
      {
        changedByUserId: 'ADMIN_DESK',
        changedByRole: 'ADMIN',
        reason: 'Staff member reassignment'
      }
    );

    if (res.success && res.updatedBooking) {
      setSelectedBooking(res.updatedBooking);
      setIsReassignOpen(false);
      setRefreshKey((k) => k + 1);
      setActionSuccessMessage(`Staff successfully reassigned for booking ${selectedBooking.id}.`);
    } else {
      setReassignError(res.error || 'Failed to reassign staff member.');
    }
  };

  // Trigger Cancel
  const handleExecuteCancel = () => {
    if (!selectedBooking) return;
    handleStateTransition(selectedBooking, 'CANCELLED', cancelReasonInput || 'Cancelled by business admin');
    setIsCancelModalOpen(false);
    setCancelReasonInput('');
  };

  // Run Foundation Test Suite
  const handleRunTests = () => {
    const res = runFoundationTestSuite();
    setTestResults(res);
  };

  // Status Badge Styling Helper
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">CONFIRMED</span>;
      case 'CHECKED_IN':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">CHECKED IN</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">IN PROGRESS</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">COMPLETED</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">CANCELLED</span>;
      case 'NO_SHOW':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">NO SHOW</span>;
      case 'ADVANCE_PAID':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">ADVANCE PAID</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  // Payment Status Badge Helper
  const getPaymentBadge = (pStatus: PaymentStatus) => {
    switch (pStatus) {
      case 'PAID':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">FULL PAID</span>;
      case 'ADVANCE_PAID':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">ADVANCE PAID</span>;
      case 'REFUNDED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-950 text-rose-300 border border-rose-800">REFUNDED</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-950 text-amber-300 border border-amber-800">{pStatus}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 md:p-8">
      {/* Top Header & Tenant Selector */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Phase 4.8 SalonOS Business Side
                </span>
                <span className="text-xs text-slate-400">Multi-Tenant Isolated</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                Business Booking Management & Calendar
              </h1>
            </div>
          </div>

          {/* Business Tenant Dropdown Switcher */}
          <div className="flex items-center space-x-3 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
            <Building2 className="w-4 h-4 text-slate-400 ml-2" />
            <select
              value={selectedBusinessId}
              onChange={(e) => {
                setSelectedBusinessId(e.target.value);
                setSelectedBooking(null);
                setActionSuccessMessage(null);
                setActionErrorMessage(null);
              }}
              className="bg-transparent text-sm font-semibold text-amber-300 focus:outline-none pr-3 cursor-pointer"
            >
              <option value="biz-barber-001" className="bg-slate-900 text-white">
                Royal Crown Barber Studio (biz-barber-001)
              </option>
              <option value="biz-spa-002" className="bg-slate-900 text-white">
                Velvet Glow Luxury Spa (biz-spa-002)
              </option>
              <option value="biz-nail-003" className="bg-slate-900 text-white">
                Luxe Nail Artistry (biz-nail-003)
              </option>
              <option value="biz-tattoo-004" className="bg-slate-900 text-white">
                Ink & Needle Custom Tattoo (biz-tattoo-004)
              </option>
            </select>
          </div>
        </div>

        {/* System Action Banners */}
        {actionSuccessMessage && (
          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-sm font-medium">{actionSuccessMessage}</span>
            </div>
            <button
              onClick={() => setActionSuccessMessage(null)}
              className="text-emerald-400 hover:text-white text-xs underline font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {actionErrorMessage && (
          <div className="flex items-center justify-between bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span className="text-sm font-medium">{actionErrorMessage}</span>
            </div>
            <button
              onClick={() => setActionErrorMessage(null)}
              className="text-rose-400 hover:text-white text-xs underline font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Salon Dashboard Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Today's Bookings</span>
              <CalendarIcon className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1">{metrics.todayCount}</div>
            <div className="text-xs text-slate-500 mt-1">Date: {todayIso}</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>In-Progress / Checked In</span>
              <Clock3 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{metrics.inProgressCount}</div>
            <div className="text-xs text-slate-500 mt-1">Active on salon floor</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Completed Today</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{metrics.completedCount}</div>
            <div className="text-xs text-slate-500 mt-1">Services fulfilled</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Est. Revenue Today</span>
              <DollarSign className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-cyan-300 mt-1">₹{metrics.totalRevenueToday.toLocaleString('en-IN')}</div>
            <div className="text-xs text-slate-500 mt-1">Advances + remaining</div>
          </div>
        </div>

        {/* Navigation Tabs (List View / Calendar View / Foundation Test Suite) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveView('LIST')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'LIST'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>Booking List View</span>
            </button>

            <button
              onClick={() => setActiveView('CALENDAR')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'CALENDAR'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Interactive Calendar View</span>
            </button>

            <button
              onClick={() => {
                setActiveView('TESTS');
                if (!testResults) handleRunTests();
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'TESTS'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BadgeCheck className="w-4 h-4" />
              <span>Suite 16 Validation Runner</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Table</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: BOOKING LIST VIEW */}
        {activeView === 'LIST' && (
          <div className="space-y-6">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'TODAY', label: 'Today', count: tenantBookings.filter((b) => b.bookingDate === todayIso).length },
                { id: 'UPCOMING', label: 'Upcoming', count: tenantBookings.filter((b) => b.bookingDate >= todayIso && b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length },
                { id: 'COMPLETED', label: 'Completed', count: tenantBookings.filter((b) => b.status === 'COMPLETED').length },
                { id: 'CANCELLED', label: 'Cancelled', count: tenantBookings.filter((b) => b.status === 'CANCELLED').length },
                { id: 'NO_SHOW', label: 'No-Show', count: tenantBookings.filter((b) => b.status === 'NO_SHOW').length },
                { id: 'ALL', label: 'All Bookings', count: tenantBookings.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryTab(tab.id as typeof activeCategoryTab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 border transition-all ${
                    activeCategoryTab === tab.id
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeCategoryTab === tab.id ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Filter & Search Toolbar */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
                {/* Search Input */}
                <div className="md:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search Customer, Phone, Booking ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Date Filter */}
                <div>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Staff Filter */}
                <div>
                  <select
                    value={filterStaffId}
                    onChange={(e) => setFilterStaffId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="">All Staff</option>
                    {businessStaffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Booking Status Filter */}
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="">All Statuses</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CHECKED_IN">CHECKED_IN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="NO_SHOW">NO_SHOW</option>
                  </select>
                </div>

                {/* Payment Status Filter */}
                <div>
                  <select
                    value={filterPaymentStatus}
                    onChange={(e) => setFilterPaymentStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="">All Payment</option>
                    <option value="ADVANCE_PAID">ADVANCE_PAID</option>
                    <option value="PAID">FULL PAID</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>
              </div>

              {(searchQuery || filterDate || filterStaffId || filterStatus || filterPaymentStatus) && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 text-xs">
                  <span className="text-slate-400">
                    Showing {filteredBookings.length} matching result(s)
                  </span>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterDate('');
                      setFilterStaffId('');
                      setFilterStatus('');
                      setFilterPaymentStatus('');
                    }}
                    className="text-amber-400 hover:underline font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Main Booking Table */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Booking ID</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Service</th>
                      <th className="p-3.5">Staff</th>
                      <th className="p-3.5">Date & Time</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Advance</th>
                      <th className="p-3.5">Remaining</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Booking Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="p-8 text-center text-slate-500">
                          <div className="max-w-xs mx-auto space-y-2">
                            <ListFilter className="w-8 h-8 text-slate-600 mx-auto" />
                            <p className="font-semibold text-slate-400">No bookings found</p>
                            <p className="text-[11px]">Try adjusting your search filters or selected category tab.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-800/30 transition">
                          <td className="p-3.5 font-mono text-amber-300 font-semibold">{b.id}</td>
                          <td className="p-3.5 font-medium text-white">
                            <div>{b.customerName}</div>
                            <div className="text-[10px] text-slate-500">{b.customerPhone}</div>
                          </td>
                          <td className="p-3.5 text-slate-300 max-w-[180px] truncate">
                            {b.items[0]?.nameSnapshot || 'Salon Service'}
                          </td>
                          <td className="p-3.5 text-slate-300">
                            {b.staffNameSnapshot || 'Any Available'}
                          </td>
                          <td className="p-3.5 text-slate-300 whitespace-nowrap">
                            <div>{b.bookingDate}</div>
                            <div className="text-[10px] text-amber-400/80 font-mono">{b.startTime} - {b.endTime}</div>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-200">
                            ₹{b.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3.5 text-emerald-400 font-medium">
                            ₹{b.advanceAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3.5 text-slate-400 font-medium">
                            ₹{b.remainingAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3.5">{getPaymentBadge(b.paymentStatus)}</td>
                          <td className="p-3.5">{getStatusBadge(b.status)}</td>
                          <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-semibold border border-slate-700 transition"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: INTERACTIVE CALENDAR VIEW */}
        {activeView === 'CALENDAR' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const d = new Date(calendarDate);
                    d.setDate(d.getDate() - 1);
                    setCalendarDate(d.toISOString().split('T')[0]);
                  }}
                  className="p-2 bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-white text-base">
                  {formatDate(calendarDate)}
                </span>
                <button
                  onClick={() => {
                    const d = new Date(calendarDate);
                    d.setDate(d.getDate() + 1);
                    setCalendarDate(d.toISOString().split('T')[0]);
                  }}
                  className="p-2 bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCalendarDate(todayIso)}
                  className="text-xs px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg font-semibold hover:bg-amber-500/20"
                >
                  Today
                </button>
              </div>

              {/* Day / Week / Month Mode Selector */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['DAY', 'WEEK', 'MONTH'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCalendarMode(mode)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      calendarMode === mode
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* DAY CALENDAR VIEW GRID */}
            {calendarMode === 'DAY' && (
              <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden p-4 space-y-4">
                <div className="text-xs text-slate-400 font-semibold border-b border-slate-800 pb-2 flex justify-between">
                  <span>SALON APPOINTMENT TIMELINE — {calendarDate}</span>
                  <span>{businessStaffList.length} Active Staff Columns</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {businessStaffList.map((stf) => {
                    const staffAppts = tenantBookings.filter(
                      (b) => b.bookingDate === calendarDate && b.staffId === stf.id
                    );

                    return (
                      <div key={stf.id} className="bg-slate-950/80 rounded-xl border border-slate-800/80 p-3 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                          <div>
                            <div className="font-bold text-amber-300 text-sm">{stf.name}</div>
                            <div className="text-[10px] text-slate-400">{stf.role}</div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {staffAppts.length} Appt(s)
                          </span>
                        </div>

                        <div className="space-y-2 min-h-[200px]">
                          {staffAppts.length === 0 ? (
                            <div className="text-center py-10 text-slate-600 text-xs italic">
                              No appointments scheduled for {stf.name} on this date.
                            </div>
                          ) : (
                            staffAppts.map((b) => (
                              <div
                                key={b.id}
                                onClick={() => setSelectedBooking(b)}
                                className="bg-slate-900/90 hover:bg-slate-800 p-3 rounded-lg border border-slate-800 cursor-pointer transition space-y-1.5"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-amber-400 font-mono text-xs font-bold">
                                    {b.startTime} - {b.endTime}
                                  </span>
                                  {getStatusBadge(b.status)}
                                </div>
                                <div className="font-semibold text-white text-xs">{b.customerName}</div>
                                <div className="text-[11px] text-slate-400 truncate">
                                  {b.items[0]?.nameSnapshot || 'Service'}
                                </div>
                                <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 text-[10px] text-slate-500">
                                  <span>{b.customerPhone}</span>
                                  <span className="text-emerald-400">₹{b.totalAmount}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WEEK / MONTH CALENDAR OVERVIEW */}
            {(calendarMode === 'WEEK' || calendarMode === 'MONTH') && (
              <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
                <div className="text-xs text-slate-400 font-semibold mb-2">
                  {calendarMode === 'WEEK' ? 'WEEKLY APPOINTMENT MATRIX' : 'MONTHLY OVERVIEW'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {tenantBookings.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-400 font-mono">{b.bookingDate}</span>
                        <span>{getStatusBadge(b.status)}</span>
                      </div>
                      <div className="font-bold text-white text-xs">{b.customerName}</div>
                      <div className="text-[11px] text-slate-400">{b.staffNameSnapshot}</div>
                      <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-800">
                        <span>{b.startTime} ({b.duration}m)</span>
                        <span className="text-emerald-400 font-semibold">₹{b.totalAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: SUITE 16 AUTOMATED TEST RUNNER */}
        {activeView === 'TESTS' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <BadgeCheck className="w-5 h-5 text-emerald-400" />
                    <span>Suite 16 Test Validation Engine</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tests multi-tenant isolation, state transitions, reschedule re-validation, staff eligibility & availability rules.
                  </p>
                </div>
                <button
                  onClick={handleRunTests}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Execute Test Suite</span>
                </button>
              </div>

              {testResults ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-xs text-slate-400">Total Assertions</div>
                      <div className="text-xl font-bold text-white mt-1">{testResults.total}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Passed</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">{testResults.passed}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Failed</div>
                      <div className="text-xl font-bold text-rose-400 mt-1">{testResults.failed}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {testResults.results.map((tr, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                          tr.passed
                            ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                            : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {tr.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                          <div>
                            <span className="font-semibold text-slate-300">[{tr.suite}]</span>{' '}
                            <span className="font-medium text-white">{tr.name}</span>
                          </div>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">{tr.durationMs}ms</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Click "Execute Test Suite" to run automated verification.
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOOKING DETAIL & ADMIN ACTIONS MODAL */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl space-y-0 my-8">
              {/* Modal Header */}
              <div className="bg-slate-950 p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-amber-300 text-sm font-bold">{selectedBooking.id}</span>
                    {getStatusBadge(selectedBooking.status)}
                    {getPaymentBadge(selectedBooking.paymentStatus)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Booked on {formatDate(selectedBooking.bookingDate)} at {selectedBooking.startTime} ({selectedBooking.duration} mins)
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Customer Contact & Mobile Quick Contact */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Customer Details</span>
                    <span className="text-[10px] text-slate-500">Mobile Direct Contact Ready</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-slate-400">Name</div>
                      <div className="font-bold text-white text-sm mt-0.5">{selectedBooking.customerName}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Phone</div>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="font-mono text-slate-200">{selectedBooking.customerPhone}</span>
                        <a
                          href={`tel:${selectedBooking.customerPhone}`}
                          className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded hover:bg-emerald-500/20 text-[10px] font-semibold"
                        >
                          Call Customer
                        </a>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-slate-400">Email</div>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-slate-200">{selectedBooking.customerEmail}</span>
                        <a
                          href={`mailto:${selectedBooking.customerEmail}`}
                          className="px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded hover:bg-blue-500/20 text-[10px] font-semibold"
                        >
                          Email Customer
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service & Staff Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-slate-400 font-medium">Service</div>
                    <div className="font-bold text-white mt-1 text-sm">
                      {selectedBooking.items[0]?.nameSnapshot || 'Salon Service'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Duration: {selectedBooking.duration} mins
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-slate-400 font-medium">Assigned Staff</div>
                    <div className="font-bold text-amber-300 mt-1 text-sm">
                      {selectedBooking.staffNameSnapshot || 'Unassigned'}
                    </div>
                    <button
                      onClick={() => {
                        setTargetStaffId(selectedBooking.staffId || '');
                        setIsReassignOpen(true);
                      }}
                      className="mt-1 text-[10px] text-amber-400 hover:underline font-semibold"
                    >
                      Reassign Staff Member →
                    </button>
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1.5">
                    Financial Summary
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Total Service Amount:</span>
                    <span className="font-semibold text-white">₹{selectedBooking.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Advance Payment Verified ({selectedBooking.advancePercentage}%):</span>
                    <span className="font-semibold">₹{selectedBooking.advanceAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-amber-300 pt-1 border-t border-slate-800">
                    <span>Remaining Balance Due at Salon:</span>
                    <span className="font-bold text-sm">₹{selectedBooking.remainingAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Customer Notes */}
                {selectedBooking.notes && (
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                    <div className="text-slate-400 font-semibold text-[10px] uppercase">Notes</div>
                    <div className="text-slate-300 mt-1 italic">{selectedBooking.notes}</div>
                  </div>
                )}

                {/* Status Audit Timeline */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Audit Log & Lifecycle History
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 max-h-36 overflow-y-auto">
                    {selectedBooking.statusHistory.map((h, idx) => (
                      <div key={idx} className="text-[11px] border-b border-slate-900 pb-1.5 last:border-none">
                        <div className="flex justify-between text-slate-400">
                          <span className="font-semibold text-amber-300">{h.oldStatus} → {h.newStatus}</span>
                          <span className="text-[10px] text-slate-500">{new Date(h.timestamp).toLocaleTimeString('en-IN')}</span>
                        </div>
                        <div className="text-slate-300 mt-0.5">{h.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* State Transition Actions Grid */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Admin Workflow Actions (State Machine Protected)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => handleStateTransition(selectedBooking, 'CONFIRMED')}
                      className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-semibold"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() => handleStateTransition(selectedBooking, 'CHECKED_IN')}
                      className="px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-semibold"
                    >
                      Check In
                    </button>

                    <button
                      onClick={() => handleStateTransition(selectedBooking, 'IN_PROGRESS')}
                      className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold"
                    >
                      Mark In Progress
                    </button>

                    <button
                      onClick={() => handleStateTransition(selectedBooking, 'COMPLETED')}
                      className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold"
                    >
                      Mark Completed
                    </button>

                    <button
                      onClick={() => {
                        setRescheduleDate(selectedBooking.bookingDate);
                        setRescheduleTime(selectedBooking.startTime);
                        setIsRescheduleOpen(true);
                      }}
                      className="px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold"
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => {
                        setTargetStaffId(selectedBooking.staffId || '');
                        setIsReassignOpen(true);
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold"
                    >
                      Assign Staff
                    </button>

                    <button
                      onClick={() => handleStateTransition(selectedBooking, 'NO_SHOW')}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 rounded-lg text-xs font-semibold"
                    >
                      Mark No Show
                    </button>

                    <button
                      onClick={() => setIsCancelModalOpen(true)}
                      className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESCHEDULE SUB-MODAL */}
        {isRescheduleOpen && selectedBooking && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white text-sm">Reschedule Booking #{selectedBooking.id}</h4>
                <button onClick={() => setIsRescheduleOpen(false)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {rescheduleError && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-lg text-xs">
                  {rescheduleError}
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block font-medium mb-1">New Date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block font-medium mb-1">New Start Time Slot</label>
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Server will re-verify operating hours & slot occupancy authoritatively.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsRescheduleOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteReschedule}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAFF REASSIGN SUB-MODAL */}
        {isReassignOpen && selectedBooking && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white text-sm">Reassign Staff Member</h4>
                <button onClick={() => setIsReassignOpen(false)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {reassignError && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-lg text-xs">
                  {reassignError}
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block font-medium mb-1">Select Staff</label>
                  <select
                    value={targetStaffId}
                    onChange={(e) => setTargetStaffId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select Staff...</option>
                    {businessStaffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role}) {s.active ? '' : '— INACTIVE'}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    System verifies active status, service qualifications & availability before reassigning.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsReassignOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteStaffReassign}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Reassign Staff
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CANCEL MODAL */}
        {isCancelModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-rose-400 text-sm">Cancel Booking #{selectedBooking.id}</h4>
                <button onClick={() => setIsCancelModalOpen(false)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block font-medium mb-1">Reason for Cancellation</label>
                  <textarea
                    rows={3}
                    placeholder="Provide reason for cancellation..."
                    value={cancelReasonInput}
                    onChange={(e) => setCancelReasonInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  onClick={handleExecuteCancel}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-lg text-xs"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
