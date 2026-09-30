import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth, SEEDED_AUTH_USERS } from '../../services/authContext';
import { hasPermission, ProtectedResource, PermissionAction, SecurityContext } from '../../lib/permissions';

export interface AccessDeniedProps {
  resource: string;
  action?: string;
  reason?: string;
  onNavigateHome?: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedProps> = ({
  resource,
  action = 'view',
  reason,
  onNavigateHome
}) => {
  const { session, signIn } = useAuth();

  const defaultReason = session
    ? `Your current active role [${session.role}] does not have clearance to perform '${action}' on [${resource}]. Tenant isolation and role-based access control (RBAC) are strictly enforced in Nexora SalonOS.`
    : 'Authentication required. You must be signed in with an authorized account to access this resource.';

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-rose-200 shadow-xl p-8 space-y-6 text-center">
        <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Security 403 Forbidden
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Denied to {resource}</h2>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {reason || defaultReason}
          </p>
        </div>

        {session && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 font-mono">
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Current Security Context</div>
            <div className="flex justify-between text-slate-700">
              <span className="font-semibold">User:</span>
              <span>{session.name} ({session.email})</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span className="font-semibold">Active Role:</span>
              <span className="font-bold text-rose-600">{session.role}</span>
            </div>
            {session.businessId && (
              <div className="flex justify-between text-slate-700">
                <span className="font-semibold">Tenant ID:</span>
                <span className="text-indigo-600">{session.businessId}</span>
              </div>
            )}
          </div>
        )}

        {/* Quick Role Switcher for QA and Evaluation */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Switch Persona for Verification:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SEEDED_AUTH_USERS.map((user) => {
              const isCurrent = session?.userId === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => signIn(user.email)}
                  disabled={isCurrent}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left truncate flex flex-col ${
                    isCurrent
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                      : 'bg-white hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 shadow-xs'
                  }`}
                  title={`${user.name} (${user.role})`}
                >
                  <span className="truncate">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'BUSINESS_OWNER' ? 'Owner' : user.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-slate-900/10"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Safe Portal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export interface PermissionGuardProps {
  resource: ProtectedResource;
  action?: PermissionAction;
  context?: SecurityContext;
  fallback?: React.ReactNode;
  onNavigateHome?: () => void;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  resource,
  action = 'view',
  context,
  fallback,
  onNavigateHome,
  children
}) => {
  const { session } = useAuth();

  const isAllowed = hasPermission(session, resource, action, context);

  if (!isAllowed) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <AccessDeniedView
        resource={resource}
        action={action}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  return <>{children}</>;
};
