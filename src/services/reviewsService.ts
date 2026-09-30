// Nexora SalonOS — Phase 5.7 Reviews & Ratings Service
// Eligibility Validation, Anti-Abuse (One Review per Completed Booking), Moderation, and Ratings Aggregation

import { ReviewEntity, ReviewStatus, CreateReviewDTO } from '../types/reviews';
import { BookingEntity } from '../types/bookingEngine';

export const SEEDED_REVIEWS: ReviewEntity[] = [
  {
    id: 'rev-01',
    businessId: 'biz-barber-001',
    customerId: 'cust-barber-001',
    customerName: 'Aarav Sharma',
    bookingId: 'bk-barber-completed-1',
    rating: 5,
    reviewText: 'Absolute masterclass fade by Vikram! Extremely professional and clean salon setup.',
    status: 'PUBLISHED',
    createdAt: '2026-09-25T10:00:00Z',
    updatedAt: '2026-09-25T10:00:00Z'
  },
  {
    id: 'rev-02',
    businessId: 'biz-barber-001',
    customerId: 'cust-barber-002',
    customerName: 'Rohan Gupta',
    bookingId: 'bk-barber-completed-2',
    rating: 4,
    reviewText: 'Great beard trim. Quick service and nice ambiance.',
    status: 'PUBLISHED',
    createdAt: '2026-09-26T14:30:00Z',
    updatedAt: '2026-09-26T14:30:00Z'
  },
  {
    id: 'rev-03',
    businessId: 'biz-spa-002',
    customerId: 'cust-spa-001',
    customerName: 'Priya Nair',
    bookingId: 'bk-spa-completed-1',
    rating: 5,
    reviewText: 'The aromatherapy session was heavenly. Felt completely rejuvenated.',
    status: 'PUBLISHED',
    createdAt: '2026-09-27T16:00:00Z',
    updatedAt: '2026-09-27T16:00:00Z'
  }
];

export class ReviewsService {
  private reviews: Map<string, ReviewEntity> = new Map();

  constructor(initialReviews: ReviewEntity[] = SEEDED_REVIEWS) {
    initialReviews.forEach((r) => {
      this.reviews.set(r.id, JSON.parse(JSON.stringify(r)));
    });
  }

  /**
   * Check if a customer/booking is eligible to submit a review:
   * 1. Booking must exist and belong to the business and customer.
   * 2. Booking status must be 'COMPLETED'.
   * 3. No prior review should exist for this booking (Anti-Abuse rule).
   */
  public checkEligibility(booking: BookingEntity, customerId: string): { eligible: boolean; reason?: string } {
    if (!booking) {
      return { eligible: false, reason: 'Booking not found.' };
    }
    if (booking.customerId !== customerId) {
      return { eligible: false, reason: 'Unauthorized: Booking does not belong to this customer.' };
    }
    if (booking.status !== 'COMPLETED') {
      return { eligible: false, reason: `Booking status is '${booking.status}'. Only completed bookings are eligible for reviews.` };
    }

    // Check anti-abuse: one review per booking
    const existing = Array.from(this.reviews.values()).find(
      (r) => r.bookingId === booking.id && r.status !== 'REJECTED'
    );
    if (existing) {
      return { eligible: false, reason: 'A review has already been submitted for this completed booking.' };
    }

    return { eligible: true };
  }

  /**
   * Create a new review with PENDING status (moderation queue)
   */
  public createReview(dto: CreateReviewDTO, booking: BookingEntity): { success: boolean; review?: ReviewEntity; error?: string } {
    const eligibility = this.checkEligibility(booking, dto.customerId);
    if (!eligibility.eligible) {
      return { success: false, error: eligibility.reason };
    }

    if (dto.rating < 1 || dto.rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5.' };
    }

    const nowIso = new Date().toISOString();
    const newReview: ReviewEntity = {
      id: `rev-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      businessId: dto.businessId,
      customerId: dto.customerId,
      customerName: dto.customerName,
      bookingId: dto.bookingId,
      rating: dto.rating,
      reviewText: dto.reviewText,
      status: 'PENDING', // Default pending moderation
      createdAt: nowIso,
      updatedAt: nowIso
    };

    this.reviews.set(newReview.id, newReview);
    return { success: true, review: newReview };
  }

  /**
   * List all reviews for a business (Admin view including pending/hidden)
   */
  public listBusinessReviews(businessId: string): ReviewEntity[] {
    return Array.from(this.reviews.values()).filter((r) => r.businessId === businessId);
  }

  /**
   * List public PUBLISHED reviews for a business
   */
  public listPublicReviews(businessId: string): ReviewEntity[] {
    return Array.from(this.reviews.values()).filter(
      (r) => r.businessId === businessId && r.status === 'PUBLISHED'
    );
  }

  /**
   * Compute average rating and review count for a business
   */
  public getBusinessRatingSummary(businessId: string): { averageRating: number; reviewCount: number } {
    const published = this.listPublicReviews(businessId);
    if (published.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }
    const sum = published.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / published.length).toFixed(1));
    return { averageRating: avg, reviewCount: published.length };
  }

  /**
   * Admin moderation: update review status (PUBLISHED, HIDDEN, REJECTED, PENDING)
   */
  public updateReviewStatus(reviewId: string, status: ReviewStatus): boolean {
    const review = this.reviews.get(reviewId);
    if (!review) return false;
    review.status = status;
    review.updatedAt = new Date().toISOString();
    return true;
  }
}

export const reviewsService = new ReviewsService();
