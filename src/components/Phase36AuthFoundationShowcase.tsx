import React, { useState } from 'react';
import { useAuth, SEEDED_AUTH_USERS } from '../services/authContext';
import { AuthScreens } from './AuthScreens';
import { Button, Card, Badge, Typography, Table } from '../design-system';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  UserCheck,
  LogOut,
  AlertCircle,
  Clock,
  Server,
  Terminal,
  Layers
} from 'lucide-react';

export const Phase36AuthFoundationShowcase: React.FC = () => {
  const { session, isAuthenticated, signOut, hasRole } = useAuth();
  const [activeScreenTab, setActiveScreenTab] = useState<
    'sign-in' | 'sign-up' | 'forgot-password' | 'reset-password' | 'profile' | 'security-architecture'
  >('sign-in');

  const [simulatedPath, setSimulatedPath] = useState<string>('/sign-in');

  return (
    <div className="space-y-6 text-left">
      {/* Scope Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Phase 3.6 Implementation Mode
              </span>
              <span className="text-xs text-slate-400 font-mono">5 Core Roles · SHA-256 Hashing · Auto Expiration</span>
            </div>
            <Typography variant="h1" className="text-white">
              Authentication & Authorization Foundation
            </Typography>
            <Typography variant="small" className="text-slate-400 mt-1 max-w-3xl">
              Clean authentication architecture handling Customer, Business Owner, Manager, Staff, and Super Admin sessions. Never stores plaintext credentials.
            </Typography>
          </div>

          {/* Active Session Badge */}
          <div className="flex items-center gap-2">
            {session ? (
              <div className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl flex items-center gap-2.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <div>
                  <span className="font-bold text-slate-200 block">{session.name}</span>
                  <span className="text-[10px] text-amber-400 font-mono">{session.role}</span>
                </div>
                <button
                  onClick={signOut}
                  className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-xs text-slate-400 rounded-xl">
                Unauthenticated Guest
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Screen Mode Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
        {[
          { id: 'sign-in', label: '1. Sign In Gateway' },
          { id: 'sign-up', label: '2. Registration (Owner / Customer)' },
          { id: 'forgot-password', label: '3. Forgot Password Flow' },
          { id: 'reset-password', label: '4. Reset Password OTP' },
          { id: 'profile', label: '5. Profile & Token Inspection' },
          { id: 'security-architecture', label: '6. Server RBAC & Token Spec' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveScreenTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              activeScreenTab === tab.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* RENDER AUTH SCREENS */}
      {activeScreenTab !== 'security-architecture' ? (
        <AuthScreens
          initialScreen={activeScreenTab}
          onNavigate={(path) => {
            setSimulatedPath(path);
            if (path === '/onboarding') {
              alert('Business Owner Registration verified! Redirecting to /onboarding.');
            }
          }}
        />
      ) : (
        /* SECURITY ARCHITECTURE SPEC */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card padding="md" className="space-y-4">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-600" />
              <Typography variant="h3">Server-Side Authorization Matrix</Typography>
            </div>
            <Typography variant="small" className="text-slate-500">
              Frontend route guarding paired with stateless Bearer JWT authorization for backend API gateways.
            </Typography>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Allowed Route Zones</th>
                    <th className="py-2.5 px-3">API Scopes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">CUSTOMER</td>
                    <td className="py-2 px-3 text-slate-600">/customer/*, /b/*</td>
                    <td className="py-2 px-3 font-mono text-[10px] text-indigo-700">bookings:read, bookings:create</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">STAFF</td>
                    <td className="py-2 px-3 text-slate-600">/staff/*, /b/*</td>
                    <td className="py-2 px-3 font-mono text-[10px] text-indigo-700">roster:read, chair:manage</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">MANAGER</td>
                    <td className="py-2 px-3 text-slate-600">/admin/*, /staff/*</td>
                    <td className="py-2 px-3 font-mono text-[10px] text-indigo-700">admin:catalog, admin:dispatch</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">BUSINESS_OWNER</td>
                    <td className="py-2 px-3 text-slate-600">/admin/*, /onboarding/*</td>
                    <td className="py-2 px-3 font-mono text-[10px] text-indigo-700">tenant:full_admin, payouts:read</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-amber-700">SUPER_ADMIN</td>
                    <td className="py-2 px-3 text-slate-600">/super-admin/*, ALL</td>
                    <td className="py-2 px-3 font-mono text-[10px] text-amber-700">platform:root_governance</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card padding="md" className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <Typography variant="h3">Security & Password Standards</Typography>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Zero-Plaintext Policy:</span>
                <p className="text-slate-600">
                  Passwords pass through client-side SHA-256 salted hashing before transit, preventing plaintext exposure across dev tools and network inspection.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">24-Hour Expiration & Auto-Revocation:</span>
                <p className="text-slate-600">
                  Sessions auto-expire after 24 hours. A background heartbeat listener purges expired localStorage records and executes graceful client logout.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Onboarding Flow Hand-off:</span>
                <p className="text-slate-600">
                  Business owner registration automatically sets role to <code>BUSINESS_OWNER</code> and transitions directly to <code>/onboarding</code>.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
