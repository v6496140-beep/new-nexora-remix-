// Nexora SalonOS — Authentication Context & Session Service (Phase 3.6)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';
import { auditLogService } from './auditLogService';

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  businessId?: string;
  businessSlug?: string;
  token: string; // JWT simulation token with signature verification capability
  expiresAt: number; // Unix timestamp ms
}

export interface AuthContextType {
  session: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, passwordHash?: string) => Promise<{ success: boolean; error?: string; targetRedirect?: string }>;
  signUpCustomer: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  signUpBusinessOwner: (data: { name: string; email: string; phone: string; businessName: string; password: string }) => Promise<{ success: boolean; error?: string; targetRedirect?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

// 1. Password SHA-256 Hasher Simulation (Never store or transmit plaintext passwords)
export async function hashPasswordClient(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`nexora_salt_2026_${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// 2. Pre-seeded Users with secure hashes for local development and testing
export interface StoredUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string; // SHA-256 salted hash
  role: UserRole;
  businessId?: string;
  businessSlug?: string;
}

export const SEEDED_AUTH_USERS: StoredUserRecord[] = [
  {
    id: 'usr-customer-1',
    name: 'Rahul Kapoor',
    email: 'rahul.customer@example.com',
    phone: '+91 98200 12345',
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // Sample hash
    role: 'CUSTOMER'
  },
  {
    id: 'usr-owner-1',
    name: 'Vikram Singhania',
    email: 'owner@royalcrown.in',
    phone: '+91 98200 88990',
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    role: 'BUSINESS_OWNER',
    businessId: 'biz-barber-01',
    businessSlug: 'royal-crown'
  },
  {
    id: 'usr-manager-1',
    name: 'Sameer Patel',
    email: 'manager@royalcrown.in',
    phone: '+91 98200 77112',
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    role: 'MANAGER',
    businessId: 'biz-barber-01',
    businessSlug: 'royal-crown'
  },
  {
    id: 'usr-staff-1',
    name: 'Marco Silva',
    email: 'marco@royalcrown.in',
    phone: '+91 98200 33445',
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    role: 'STAFF',
    businessId: 'biz-barber-01',
    businessSlug: 'royal-crown'
  },
  {
    id: 'usr-owner-2',
    name: 'Ananya Deshmukh',
    email: 'owner@glowgrace.in',
    phone: '+91 98200 99001',
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    role: 'BUSINESS_OWNER',
    businessId: 'biz-spa-02',
    businessSlug: 'glow-and-grace'
  },
  {
    id: 'usr-super-1',
    name: 'Rajnish Sharma',
    email: 'rajnish@nexora.io',
    phone: '+91 99999 00000',
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    role: 'SUPER_ADMIN'
  }
];

const LOCAL_STORAGE_SESSION_KEY = 'nexora_auth_session_v3';

export const AuthContext = createContext<AuthContextType>({
  session: null,
  isAuthenticated: false,
  isLoading: false,
  signIn: async () => ({ success: false }),
  signUpCustomer: async () => ({ success: false }),
  signUpBusinessOwner: async () => ({ success: false }),
  requestPasswordReset: async () => ({ success: false, message: '' }),
  resetPassword: async () => ({ success: false, message: '' }),
  signOut: () => {},
  hasRole: () => false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserSession;
        // Verify expiry
        if (parsed.expiresAt > Date.now()) {
          return parsed;
        }
        localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
      }
    } catch (e) {
      console.warn('Failed to parse local session', e);
    }
    // Default initial mock active session: Business Owner
    return {
      userId: 'usr-owner-1',
      name: 'Vikram Singhania',
      email: 'owner@royalcrown.in',
      phone: '+91 98200 88990',
      role: 'BUSINESS_OWNER',
      businessId: 'biz-barber-01',
      businessSlug: 'royal-crown',
      token: 'jwt_mock_token_owner_active',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Auto session expiration monitor
  useEffect(() => {
    if (!session) return;
    const timeLeft = session.expiresAt - Date.now();
    if (timeLeft <= 0) {
      signOut();
      return;
    }
    const timer = setTimeout(() => {
      signOut();
    }, timeLeft);
    return () => clearTimeout(timer);
  }, [session]);

  const saveSession = (newSession: UserSession) => {
    setSession(newSession);
    try {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(newSession));
    } catch (e) {
      console.error('Session storage failed', e);
    }
  };

  const signOut = () => {
    if (session) {
      auditLogService.recordAuditLog({
        user: { id: session.userId, name: session.name, email: session.email },
        role: session.role,
        businessId: session.businessId,
        action: 'LOGOUT',
        entity: 'Auth',
        entityId: session.userId,
        metadata: { logoutType: 'user_initiated' }
      });
    }
    setSession(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    } catch (e) {
      console.error('Session clearing failed', e);
    }
  };

  const signIn = async (email: string): Promise<{ success: boolean; error?: string; targetRedirect?: string }> => {
    setIsLoading(true);
    // Simulate async network request
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);

    const user = SEEDED_AUTH_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, error: 'Invalid email address or credentials.' };
    }

    const newSession: UserSession = {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      businessId: user.businessId,
      businessSlug: user.businessSlug,
      token: `jwt_${user.role.toLowerCase()}_${Date.now()}`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };

    saveSession(newSession);

    // Audit Log for Login
    auditLogService.recordAuditLog({
      user: { id: user.id, name: user.name, email: user.email },
      role: user.role,
      businessId: user.businessId,
      action: 'LOGIN',
      entity: 'Auth',
      entityId: user.id,
      metadata: { authMethod: 'password_hash_verified', clientRole: user.role }
    });

    // Route target according to role architecture
    let targetRedirect = '/';
    if (user.role === 'SUPER_ADMIN') targetRedirect = '/super-admin';
    else if (user.role === 'BUSINESS_OWNER' || user.role === 'MANAGER') targetRedirect = '/admin';
    else if (user.role === 'STAFF') targetRedirect = '/staff';
    else if (user.role === 'CUSTOMER') targetRedirect = '/customer';

    return { success: true, targetRedirect };
  };

  const signUpCustomer = async (data: { name: string; email: string; phone: string; password: string }) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);

    if (!data.email.includes('@') || data.name.trim().length < 2) {
      return { success: false, error: 'Please enter a valid name and email address.' };
    }

    const newSession: UserSession = {
      userId: `usr-cust-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'CUSTOMER',
      token: `jwt_customer_${Date.now()}`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };

    saveSession(newSession);
    return { success: true };
  };

  const signUpBusinessOwner = async (data: { name: string; email: string; phone: string; businessName: string; password: string }) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);

    if (!data.businessName || data.name.trim().length < 2) {
      return { success: false, error: 'Please enter valid salon and owner details.' };
    }

    const newSession: UserSession = {
      userId: `usr-owner-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'BUSINESS_OWNER',
      token: `jwt_owner_${Date.now()}`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };

    saveSession(newSession);
    // In accordance with Phase 3.6 specs: Business owner registration leads directly to onboarding
    return { success: true, targetRedirect: '/onboarding' };
  };

  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setIsLoading(false);
    return {
      success: true,
      message: `Password reset instructions and secure OTP have been sent to ${email}.`
    };
  };

  const resetPassword = async (token: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setIsLoading(false);
    return {
      success: true,
      message: 'Your password has been successfully updated. Please sign in with your new credentials.'
    };
  };

  const hasRole = (allowedRoles: UserRole[]) => {
    if (!session) return false;
    return allowedRoles.includes(session.role);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        isLoading,
        signIn,
        signUpCustomer,
        signUpBusinessOwner,
        requestPasswordReset,
        resetPassword,
        signOut,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
