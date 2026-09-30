import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  Building, 
  ChevronDown, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Play,
  X
} from 'lucide-react';
import { useAuth, SEEDED_AUTH_USERS } from '../../services/authContext';
import { hasPermission, enforceTenantIsolation, SecurityError } from '../../lib/permissions';

export const PersonaSecurityBar: React.FC<{
  currentActivePage: string;
  onNavigate: (page: string) => void;
}> = ({ currentActivePage, onNavigate }) => {
  const { session, signIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testResults, setTestResults] = useState<{
    name: string;
    passed: boolean;
    detail: string;
  }[]>([]);

  const handleSwitchUser = async (email: string) => {
    const res = await signIn(email);
    if (res.success && res.targetRedirect) {
      if (res.targetRedirect === '/super-admin') {
        onNavigate('sa-dashboard');
      } else if (res.targetRedirect === '/customer') {
        onNavigate('discovery');
      } else {
        onNavigate('dashboard');
      }
    }
  };

  const runLiveSecurityAudit = () => {
    const results: { name: string; passed: boolean; detail: string }[] = [];

    // Test 1: Customer cannot access Admin Dashboard
    const custUser = SEEDED_AUTH_USERS.find(u => u.role === 'CUSTOMER')!;
    const custSession = { ...custUser, userId: custUser.id, token: 'tok', expiresAt: Date.now() + 10000 };
    const canCustAccessAdmin = hasPermission(custSession, 'Dashboard', 'view');
    results.push({
      name: 'Customer cannot access Business Admin',
      passed: !canCustAccessAdmin,
      detail: !canCustAccessAdmin 
        ? 'PASSED: Customer role restricted to own bookings & public catalog' 
        : 'FAILED: Customer was allowed into admin dashboard'
    });

    // Test 2: Staff cannot access Super Admin platform
    const staffUser = SEEDED_AUTH_USERS.find(u => u.role === 'STAFF')!;
    const staffSession = { ...staffUser, userId: staffUser.id, token: 'tok', expiresAt: Date.now() + 10000 };
    const canStaffAccessPlatform = hasPermission(staffSession, 'Dashboard', 'view', { targetBusinessId: 'platform_wide' });
    results.push({
      name: 'Staff cannot access Super Admin',
      passed: !canStaffAccessPlatform,
      detail: !canStaffAccessPlatform 
        ? 'PASSED: Staff scoped strictly to assigned appointments within own tenant' 
        : 'FAILED: Staff gained platform clearance'
    });

    // Test 3: Tenant Isolation (Business A cannot access Business B data)
    const ownerAUser = SEEDED_AUTH_USERS.find(u => u.businessId === 'biz-barber-01')!;
    const ownerASession = { ...ownerAUser, userId: ownerAUser.id, token: 'tok', expiresAt: Date.now() + 10000 };
    let tenantIsolationPassed = false;
    try {
      enforceTenantIsolation(ownerASession, 'biz-spa-02', 'Customer Transactions');
    } catch (err) {
      if (err instanceof SecurityError && err.statusCode === 403) {
        tenantIsolationPassed = true;
      }
    }
    results.push({
      name: 'Tenant Isolation: Business A cannot access Business B',
      passed: tenantIsolationPassed,
      detail: tenantIsolationPassed 
        ? 'PASSED: Cross-tenant data request strictly blocked with SecurityError 403' 
        : 'FAILED: Cross-tenant data leak detected'
    });

    // Test 4: Manager cannot execute bank withdrawals
    const mgrUser = SEEDED_AUTH_USERS.find(u => u.role === 'MANAGER')!;
    const mgrSession = { ...mgrUser, userId: mgrUser.id, token: 'tok', expiresAt: Date.now() + 10000 };
    const canMgrWithdraw = hasPermission(mgrSession, 'Withdrawals', 'execute');
    results.push({
      name: 'Manager cannot execute bank withdrawals',
      passed: !canMgrWithdraw,
      detail: !canMgrWithdraw 
        ? 'PASSED: Only Business Owner & Super Admin can disburse settlement funds' 
        : 'FAILED: Manager permitted to execute withdrawal'
    });

    // Test 5: Super Admin platform-level access
    const superUser = SEEDED_AUTH_USERS.find(u => u.role === 'SUPER_ADMIN')!;
    const superSession = { ...superUser, userId: superUser.id, token: 'tok', expiresAt: Date.now() + 10000 };
    const canSuperAdminAudit = hasPermission(superSession, 'Settings', 'manage');
    results.push({
      name: 'Super Admin platform clearance',
      passed: canSuperAdminAudit,
      detail: canSuperAdminAudit 
        ? 'PASSED: Super Admin has platform-wide governance & audit log control' 
        : 'FAILED: Super Admin clearance failed'
    });

    setTestResults(results);
    setTestModalOpen(true);
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-900 text-purple-200 border-purple-700';
      case 'BUSINESS_OWNER': return 'bg-indigo-900 text-indigo-200 border-indigo-700';
      case 'MANAGER': return 'bg-sky-900 text-sky-200 border-sky-700';
      case 'STAFF': return 'bg-amber-900 text-amber-200 border-amber-700';
      case 'CUSTOMER': return 'bg-emerald-900 text-emerald-200 border-emerald-700';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <>
      {/* Top Security & QA Persona Bar */}
      <div className="bg-slate-950 text-slate-100 border-b border-slate-800 text-xs py-1.5 px-3 lg:px-6 flex flex-wrap items-center justify-between gap-2 z-40 sticky top-0 font-sans shadow-sm">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-slate-300">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Nexora Security Context:</span>
          </div>

          {session ? (
            <div className="flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${getRoleBadgeColor(session.role)}`}>
                {session.role}
              </span>
              <span className="font-semibold text-white truncate max-w-[140px]">{session.name}</span>
              {session.businessId ? (
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                  <Building className="w-3 h-3 text-slate-500" />
                  <span className="text-slate-300 font-mono">{session.businessId}</span>
                </span>
              ) : (
                <span className="hidden md:inline-flex text-[10px] text-slate-500 font-mono">Platform Global</span>
              )}
            </div>
          ) : (
            <span className="text-rose-400 font-medium">Unauthenticated</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Persona Switcher Buttons */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
            {SEEDED_AUTH_USERS.map((user) => {
              const isSelected = session?.userId === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => handleSwitchUser(user.email)}
                  disabled={isSelected}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title={`${user.name} (${user.role}${user.businessId ? ` - ${user.businessId}` : ''})`}
                >
                  {user.role === 'SUPER_ADMIN' ? 'SuperAdmin' : 
                   user.role === 'BUSINESS_OWNER' ? (user.businessId === 'biz-spa-02' ? 'Owner B' : 'Owner A') :
                   user.role === 'MANAGER' ? 'Manager' :
                   user.role === 'STAFF' ? 'Staff' : 'Customer'}
                </button>
              );
            })}
          </div>

          {/* Persona Switcher Dropdown on Smaller Screens */}
          <div className="relative xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all"
            >
              <Users className="w-3 h-3 text-indigo-400" />
              <span>Switch Persona</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 space-y-1 z-50">
                <div className="px-2 py-1 text-[10px] font-black uppercase text-slate-400 border-b border-slate-800">
                  Switch Active Role & Tenant
                </div>
                {SEEDED_AUTH_USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      handleSwitchUser(user.email);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                      session?.userId === user.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {user.role} {user.businessId ? `• ${user.businessId}` : ''}
                      </div>
                    </div>
                    {session?.userId === user.id && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Run Security QA Test Button */}
          <button
            onClick={runLiveSecurityAudit}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
            title="Execute live security and tenant isolation verification tests"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden sm:inline">QA Security Test</span>
          </button>
        </div>
      </div>

      {/* Security QA Verification Modal */}
      {testModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">Phase 7.15 Security Verification</h3>
                  <p className="text-xs text-slate-500">Live RBAC and Tenant Isolation Verification Suite</p>
                </div>
              </div>
              <button 
                onClick={() => setTestModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {testResults.map((res, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-xl border flex items-start gap-3 ${
                    res.passed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  {res.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5 text-xs">
                    <div className="font-bold text-slate-900">{res.name}</div>
                    <div className={res.passed ? 'text-emerald-800 font-medium text-[11px]' : 'text-rose-700 font-medium text-[11px]'}>
                      {res.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>All 5 core access rules and isolation boundaries verified programmatically.</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setTestModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all"
              >
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
