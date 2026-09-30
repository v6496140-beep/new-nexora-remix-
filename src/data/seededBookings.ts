// Nexora SalonOS — Phase 4.1 Seeded Multi-Tenant Bookings
import { BookingEntity } from '../types/bookingEngine';
import { BookingStateMachineService } from '../services/bookingStateMachine';

export const SEEDED_BOOKINGS: BookingEntity[] = [
  // 1. Royal Crown Barber (tenant: biz-barber-001) - CONFIRMED with advance paid
  (() => {
    const booking = BookingStateMachineService.createBooking({
      businessId: 'biz-barber-001',
      customerId: 'usr-cust-001',
      customerName: 'Aarav Mehta',
      customerPhone: '+91 98765 43210',
      customerEmail: 'aarav.m@example.com',
      bookingDate: '2026-10-05',
      startTime: '11:00',
      primaryStaffId: 'stf-rc-01',
      primaryStaffNameSnapshot: 'Vikram Rajput (Master Barber)',
      items: [
        {
          itemType: 'SERVICE',
          referenceId: 'srv-barber-1',
          nameSnapshot: 'Signature Royal Beard Sculpt & Razor Fade',
          categorySnapshot: 'barber',
          unitPrice: 1200,
          durationMinutesSnapshot: 45,
          staffId: 'stf-rc-01',
          staffNameSnapshot: 'Vikram Rajput'
        },
        {
          itemType: 'SERVICE',
          referenceId: 'srv-barber-2',
          nameSnapshot: 'Charcoal Detox Scalp Ritual',
          categorySnapshot: 'barber',
          unitPrice: 800,
          durationMinutesSnapshot: 30,
          staffId: 'stf-rc-01',
          staffNameSnapshot: 'Vikram Rajput'
        }
      ],
      advancePercentage: 25,
      taxGstRate: 18,
      notes: 'Customer prefers organic beard oil'
    });

    // Advance payment flow
    let res = BookingStateMachineService.transitionStatus(booking, 'PAYMENT_PENDING', {
      changedByUserId: 'usr-cust-001',
      changedByRole: 'CUSTOMER',
      reason: 'Initiated advance checkout'
    });
    res = BookingStateMachineService.transitionStatus(res.updatedBooking!, 'ADVANCE_PAID', {
      changedByUserId: 'usr-cust-001',
      changedByRole: 'CUSTOMER',
      reason: 'Razorpay / UPI Advance Payment of 25% completed'
    });
    res = BookingStateMachineService.transitionStatus(res.updatedBooking!, 'CONFIRMED', {
      changedByUserId: 'system-auto',
      changedByRole: 'SYSTEM',
      reason: 'Confirmed slot reservation on salon ledger'
    });

    const withPayment = BookingStateMachineService.updatePaymentStatus(
      res.updatedBooking!,
      'ADVANCE_PAID',
      { changedByUserId: 'system-auto', changedByRole: 'SYSTEM' }
    );

    return withPayment;
  })(),

  // 2. Zenith Stone Spa (tenant: biz-spa-002) - CHECKED_IN / IN_PROGRESS
  (() => {
    const booking = BookingStateMachineService.createBooking({
      businessId: 'biz-spa-002',
      customerId: 'usr-cust-002',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98111 22334',
      customerEmail: 'priya.s@example.com',
      bookingDate: '2026-10-05',
      startTime: '14:00',
      primaryStaffId: 'stf-spa-01',
      primaryStaffNameSnapshot: 'Maya Nair (Lead Spa Therapist)',
      items: [
        {
          itemType: 'SERVICE',
          referenceId: 'srv-spa-1',
          nameSnapshot: 'Volcanic Hot Stone Therapy & Chakra Alignment',
          categorySnapshot: 'spa',
          unitPrice: 3800,
          durationMinutesSnapshot: 75,
          staffId: 'stf-spa-01',
          staffNameSnapshot: 'Maya Nair'
        }
      ],
      advancePercentage: 25,
      taxGstRate: 18,
      notes: 'Lavender aromatherapy preference'
    });

    let res = BookingStateMachineService.transitionStatus(booking, 'PAYMENT_PENDING', {
      changedByUserId: 'usr-cust-002',
      changedByRole: 'CUSTOMER'
    });
    res = BookingStateMachineService.transitionStatus(res.updatedBooking!, 'ADVANCE_PAID', {
      changedByUserId: 'usr-cust-002',
      changedByRole: 'CUSTOMER'
    });
    res = BookingStateMachineService.transitionStatus(res.updatedBooking!, 'CONFIRMED', {
      changedByUserId: 'system-auto',
      changedByRole: 'SYSTEM'
    });
    res = BookingStateMachineService.transitionStatus(res.updatedBooking!, 'CHECKED_IN', {
      changedByUserId: 'stf-spa-01',
      changedByRole: 'STAFF',
      reason: 'Client arrived at reception desk'
    });
    res = BookingStateMachineService.transitionStatus(res.updatedBooking!, 'IN_PROGRESS', {
      changedByUserId: 'stf-spa-01',
      changedByRole: 'STAFF',
      reason: 'Entered Sanctuary Treatment Room 3'
    });

    return res.updatedBooking!;
  })(),

  // 3. Gloss & Chic Nail Bar (tenant: biz-nail-003) - DRAFT (New client exploring)
  (() => {
    const booking = BookingStateMachineService.createBooking({
      businessId: 'biz-nail-003',
      customerId: 'usr-cust-003',
      customerName: 'Rhea Sen',
      customerPhone: '+91 97777 88899',
      customerEmail: 'rhea.sen@example.com',
      bookingDate: '2026-10-06',
      startTime: '16:30',
      primaryStaffId: 'stf-nail-01',
      primaryStaffNameSnapshot: 'Elena Rostova (Master Nail Artist)',
      items: [
        {
          itemType: 'SERVICE',
          referenceId: 'srv-nail-1',
          nameSnapshot: 'Russian E-File Dry Manicure with Japanese Gel Overlay',
          categorySnapshot: 'nail-studio',
          unitPrice: 2200,
          durationMinutesSnapshot: 60,
          staffId: 'stf-nail-01',
          staffNameSnapshot: 'Elena Rostova'
        }
      ],
      advancePercentage: 25,
      taxGstRate: 18
    });

    return booking;
  })(),

  // 4. Mono Tattoo Studio (tenant: biz-tattoo-004) - CANCELLED / REFUND_PENDING
  (() => {
    const booking = BookingStateMachineService.createBooking({
      businessId: 'biz-tattoo-004',
      customerId: 'usr-cust-004',
      customerName: 'Kabir Varma',
      customerPhone: '+91 95555 12345',
      customerEmail: 'kabir.v@example.com',
      bookingDate: '2026-10-07',
      startTime: '13:00',
      primaryStaffId: 'stf-tat-01',
      primaryStaffNameSnapshot: 'Kaelen Vance (Blackwork Specialist)',
      items: [
        {
          itemType: 'SERVICE',
          referenceId: 'srv-tat-1',
          nameSnapshot: 'Custom Neo-Tribal / Geometry Forearm Session',
          categorySnapshot: 'tattoo',
          unitPrice: 7500,
          durationMinutesSnapshot: 180,
          staffId: 'stf-tat-01',
          staffNameSnapshot: 'Kaelen Vance'
        }
      ],
      advancePercentage: 25,
      taxGstRate: 18
    });

    let res = BookingStateMachineService.transitionStatus(booking, 'PAYMENT_PENDING', {
      changedByUserId: 'usr-cust-004',
      changedByRole: 'CUSTOMER'
    });
    res = BookingStateMachineService.transitionStatus(res.updatedBooking!, 'ADVANCE_PAID', {
      changedByUserId: 'usr-cust-004',
      changedByRole: 'CUSTOMER'
    });
    res = BookingStateMachineService.transitionStatus(res.updatedBooking!, 'CONFIRMED', {
      changedByUserId: 'system-auto',
      changedByRole: 'SYSTEM'
    });
    res = BookingStateMachineService.transitionStatus(res.updatedBooking!, 'CANCELLED', {
      changedByUserId: 'usr-cust-004',
      changedByRole: 'CUSTOMER',
      cancellationReason: 'Emergency travel clash'
    });

    return res.updatedBooking!;
  })()
];
