// Nexora SalonOS — Phase 6.2 Nexora QR Collection Types

export interface NexoraQrConfig {
  qrId: string;
  businessId: string;
  displayName: string;
  provider: string; // e.g. 'UPI_BHIM', 'PAYTM', 'RAZORPAY_QR'
  active: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export type QrPaymentSessionState =
  | 'Waiting'
  | 'Processing'
  | 'Success'
  | 'Failed'
  | 'Expired';

export interface QrPaymentSession {
  sessionId: string;
  paymentId: string;
  businessId: string;
  bookingId: string;
  amount: number; // in cents
  currency: string;
  state: QrPaymentSessionState;
  expiresAt: string;
  createdAt: string;
}
