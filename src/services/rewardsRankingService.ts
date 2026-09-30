// Nexora SalonOS — Phase 6-C.1 Member Network & Milestone Rewards Service
// Focuses strictly on verification credentials, certified milestone rewards, and unranked directories.

import { RewardEntity, JaipurBusinessShowcase, RewardType } from '../types/rewardsRanking';

export class RewardsRankingService {
  private businesses: JaipurBusinessShowcase[] = [
    {
      businessId: 'biz-jpr-01',
      name: 'The Royal Heritage Salon & Spa',
      category: 'salon',
      rating: 4.9,
      reviewCount: 120,
      completedBookings: 450,
      retentionRate: 88,
      location: 'C-Scheme, Jaipur',
      isVerified: true,
      badges: ['Top Rated', 'Nexora Featured Business'],
      publicLink: '/booking/royal-heritage'
    },
    {
      businessId: 'biz-jpr-02',
      name: 'Pink City Hair & Barber Studio',
      category: 'barber',
      rating: 4.8,
      reviewCount: 95,
      completedBookings: 310,
      retentionRate: 85,
      location: 'Malviya Nagar, Jaipur',
      isVerified: true,
      badges: ['Customer Favorite', 'Nexora Featured Business'],
      publicLink: '/booking/pink-city-barber'
    },
    {
      businessId: 'biz-jpr-03',
      name: 'Jaipur Shimmer Nails & Beauty Bar',
      category: 'nails',
      rating: 4.7,
      reviewCount: 64,
      completedBookings: 195,
      retentionRate: 80,
      location: 'Vaishali Nagar, Jaipur',
      isVerified: true,
      badges: ['Rising Business'],
      publicLink: '/booking/jaipur-shimmer'
    },
    {
      businessId: 'biz-jpr-04',
      name: 'Ananda Wellness Ayurvedic Spa',
      category: 'spa',
      rating: 4.9,
      reviewCount: 45,
      completedBookings: 160,
      retentionRate: 92,
      location: 'Raja Park, Jaipur',
      isVerified: true,
      badges: ['Top Rated'],
      publicLink: '/booking/ananda-spa'
    },
    {
      businessId: 'biz-jpr-05',
      name: 'Eternal Ink Tattoo Studio',
      category: 'tattoo',
      rating: 4.6,
      reviewCount: 38,
      completedBookings: 90,
      retentionRate: 75,
      location: 'Mansarovar, Jaipur',
      isVerified: false,
      badges: ['Rising Business'],
      publicLink: '/booking/eternal-ink'
    },
    {
      businessId: 'biz-jpr-06',
      name: 'Aura Skin Care & Beauty Lounge',
      category: 'beauty',
      rating: 4.5,
      reviewCount: 52,
      completedBookings: 140,
      retentionRate: 78,
      location: 'Tonk Road, Jaipur',
      isVerified: false,
      badges: [],
      publicLink: '/booking/aura-beauty'
    }
  ];

  private rewards: RewardEntity[] = [];

  constructor() {
    // Seed initial milestones for Jaipur certified members
    this.evaluateAndGrantReward('biz-jpr-01', 'BOOKING_MILESTONE', 300, 'Gold Milestones Status');
    this.evaluateAndGrantReward('biz-jpr-02', 'REVIEW_MILESTONE', 50, 'Highly Recommended Badge');
  }

  /**
   * Fetch Jaipur Network Members with live category filtering & clean alphabetical/rotating ordering.
   * Absolutely NO sorting or public visibility bias based on revenue, collection or ranking scores!
   */
  public getJaipurBusinessNetwork(
    categoryFilter: string = 'All',
    orderType: 'ALPHABETICAL' | 'RECENTLY_JOINED' | 'RANDOMIZED' = 'ALPHABETICAL'
  ): JaipurBusinessShowcase[] {
    let list = [...this.businesses];
    if (categoryFilter !== 'All') {
      list = list.filter((b) => b.category === categoryFilter.toLowerCase());
    }

    if (orderType === 'ALPHABETICAL') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (orderType === 'RECENTLY_JOINED') {
      // Return list intact representing chronological joining sequence
      return list;
    } else {
      // Randomized rotation for unbiased discovery
      return list.sort(() => 0.5 - Math.random());
    }
  }

  /**
   * Create rewards & achievement badges based on configured guidelines
   */
  public evaluateAndGrantReward(
    businessId: string,
    type: RewardType,
    threshold: number,
    criteria: string
  ): RewardEntity | null {
    const duplicate = this.rewards.find(
      (r) => r.businessId === businessId && r.rewardType === type && r.threshold === threshold
    );

    if (duplicate) {
      return duplicate;
    }

    const reward: RewardEntity = {
      rewardId: `rew-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 3)}`,
      businessId,
      rewardType: type,
      criteria,
      threshold,
      status: 'EARNED',
      earnedAt: new Date().toISOString()
    };

    this.rewards.push(reward);

    const b = this.businesses.find((x) => x.businessId === businessId);
    if (b) {
      if (type === 'BOOKING_MILESTONE' && !b.badges.includes('Rising Business')) {
        b.badges.push('Rising Business');
      }
      if (type === 'REVIEW_MILESTONE' && !b.badges.includes('Customer Favorite')) {
        b.badges.push('Customer Favorite');
      }
    }

    return reward;
  }

  public listRewards(businessId?: string): RewardEntity[] {
    if (businessId) {
      return this.rewards.filter((r) => r.businessId === businessId);
    }
    return this.rewards;
  }
}

export const rewardsRankingService = new RewardsRankingService();
export const rewardsService = rewardsRankingService; // Backwards compatible alias
export const rewardsAndRankingsService = rewardsRankingService; // Backwards compatible alias
