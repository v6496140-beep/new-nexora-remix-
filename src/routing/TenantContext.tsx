// Nexora SalonOS — Multi-Tenant Business Context & Resolution (Phase 3.5)
import React, { createContext, useContext } from 'react';
import { Business, BusinessCategory } from '../types';
import { SEEDED_PUBLIC_BUSINESSES, getPublicBusinessBySlug } from '../data/seededPublicBusinesses';

export interface TenantContextType {
  businessSlug: string;
  business: Business | null;
  category: BusinessCategory;
  isLoading: boolean;
  isValidTenant: boolean;
}

export const TenantContext = createContext<TenantContextType>({
  businessSlug: 'royal-crown',
  business: SEEDED_PUBLIC_BUSINESSES['royal-crown'],
  category: 'barber',
  isLoading: false,
  isValidTenant: true
});

export const useTenant = () => useContext(TenantContext);

export function resolveTenant(slug: string): Business | null {
  return getPublicBusinessBySlug(slug) || null;
}
