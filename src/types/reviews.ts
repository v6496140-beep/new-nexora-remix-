// Nexora SalonOS — Phase 5.7 Reviews & Ratings Types
// Review Entity, Status, and Eligibility Models

export type ReviewStatus = 'PENDING' | 'PUBLISHED' | 'HIDDEN' | 'REJECTED';

export interface ReviewEntity {
  id: string;
  businessId: string;
  customerId: string;
  customerName: string;
  bookingId: string;
  rating: number; // 1 to 5
  reviewText?: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewDTO {
  businessId: string;
  customerId: string;
  customerName: string;
  bookingId: string;
  rating: number;
  reviewText?: string;
}
