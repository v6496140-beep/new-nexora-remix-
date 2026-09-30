import React, { useState } from 'react';
import { ALL_ROUTES, RouteDefinition, ShellType } from './routes';
import { resolveTenant, TenantContext } from './TenantContext';
import { MarketingShell } from '../shells/MarketingShell';
import { PublicBusinessShell } from '../shells/PublicBusinessShell';
import { CustomerShell } from '../shells/CustomerShell';
import { BusinessAdminShell } from '../shells/BusinessAdminShell';
import { StaffShell } from '../shells/StaffShell';
import { SuperAdminShell } from '../shells/SuperAdminShell';
import { Button, Card, Badge, Typography, Alert } from '../design-system';
import { UserRole } from '../types';
import {
  ShieldAlert,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Lock,
  Unlock,
  Building,
  UserCheck
} from 'lucide-react';

export const Phase33RouterShellShowcase: React.FC = () => {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>('/');
  // Simulation Active Role
  const [activeRole, setActiveRole] = useState<UserRole>('BUSINESS_OWNER');
  // Selected Tenant Slug
  const [activeTenantSlug, setActiveTenantSlug] = useState<string>('royal-crown');

  // Filter routes search
  const [routeFilter, setRouteFilter] = useState<string>('');

  // Resolve active route definition
  const normalizedPath = currentPath.startsWith('/b/')
    ? currentPath.replace(/\/b\/[^/]+/, '/b/:businessSlug')
    : currentPath;

  const currentRouteDef = ALL_ROUTES.find((r) => r.path === normalizedPath) || {
    path: currentPath,
    shell: 'MARKETING' as ShellType,
    title: 'Page View',
    description: 'Dynamic Route Target',
    requiresAuth: false
  };

  // Role Access Verification
  const isAuthorized = (() => {
    if (!currentRouteDef.requiresAuth) return true;
    if (!currentRouteDef.allowedRoles) return true;
    return currentRouteDef.allowedRoles.includes(activeRole);
  })();

  // Resolve Tenant
  const activeBusiness = resolveTenant(activeTenantSlug);

  const tenantContextValue = {
    businessSlug: activeTenantSlug,
    business: activeBusiness,
    category: activeBusiness ? activeBusiness.category : 'barber',
    isLoading: false,
    isValidTenant: !!activeBusiness
  };

  const handleNavigate = (path: string) => {
    // If navigating to tenant template route with :businessSlug, replace with active tenant
    const resolvedPath = path.includes(':businessSlug')
      ? path.replace(':businessSlug', activeTenantSlug)
      : path;
    setCurrentPath(resolvedPath);
  };

  // Render Placeholder Content inside Shells
  const renderShellContent = () => {
    if (!isAuthorized) {
      return (
        <Card padding="lg" className="max-w-xl mx-auto space-y-4 text-center my-12">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <Typography variant="h2" className="text-rose-900">403 Access Denied</Typography>
          <Typography variant="body" className="text-slate-600">
            Current role <Badge variant="danger">{activeRole}</Badge> does not have authorization to access protected route <code>{currentPath}</code>.
          </Typography>
          <div className="pt-2 flex justify-center gap-2">
            <Button size="sm" onClick={() => handleNavigate('/')}>Return to Public Home</Button>
            <Button size="sm" variant="outline" onClick={() => setActiveRole('SUPER_ADMIN')}>
              Elevate to SUPER_ADMIN
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <Card padding="md" className="border-l-4 border-l-indigo-600 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="brand">{currentRouteDef.shell}</Badge>
                <span className="font-mono text-xs text-slate-500 font-semibold">{currentPath}</span>
              </div>
              <Typography variant="h2" className="mt-1">{currentRouteDef.title}</Typography>
              <Typography variant="body" className="text-slate-500 text-xs sm:text-sm">{currentRouteDef.description}</Typography>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Auth Requirements</span>
              {currentRouteDef.requiresAuth ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <Lock className="w-3 h-3" />
                  <span>Requires {currentRouteDef.allowedRoles?.join(', ')}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  <Unlock className="w-3 h-3" />
                  <span>Public Route</span>
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Informational placeholder frame */}
        <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 text-center space-y-3">
          <Layers className="w-8 h-8 text-slate-400 mx-auto" />
          <Typography variant="h4" className="text-slate-700">
            {currentRouteDef.shell} Shell Content Canvas
          </Typography>
          <Typography variant="small" className="text-slate-500 max-w-lg mx-auto">
            Routing framework mounted. In accordance with Phase 3.3 Strict Scope, page functional logic will be plugged into this shell in Phase 3.4+.
          </Typography>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Scope Control Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Phase 3.3 Implementation Mode
              </span>
              <span className="text-xs text-slate-400 font-mono">6 App Shells · 53 Standardized Routes</span>
            </div>
            <Typography variant="h1" className="text-white text-xl sm:text-2xl">
              Multi-Tenant Routing & Shell Architecture
            </Typography>
          </div>

          {/* Role & Tenant Simulators */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400 font-medium pl-1">Role:</span>
              {(['CUSTOMER', 'BUSINESS_OWNER', 'MANAGER', 'STAFF', 'SUPER_ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRole(r)}
                  className={`px-2 py-1 rounded font-bold text-[10px] cursor-pointer transition-colors ${
                    activeRole === r ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400 font-medium pl-1">Tenant:</span>
              {[
                { slug: 'royal-crown', label: 'Royal Crown (Barber)' },
                { slug: 'zenith-spa', label: 'Zenith (Spa)' },
                { slug: 'gloss-chic', label: 'Gloss & Chic (Nail)' },
                { slug: 'mono-tattoo', label: 'Mono (Tattoo)' }
              ].map((t) => (
                <button
                  key={t.slug}
                  onClick={() => {
                    setActiveTenantSlug(t.slug);
                    if (currentPath.startsWith('/b/')) {
                      setCurrentPath(currentPath.replace(/\/b\/[^/]+/, `/b/${t.slug}`));
                    }
                  }}
                  className={`px-2 py-1 rounded font-bold text-[10px] cursor-pointer transition-colors ${
                    activeTenantSlug === t.slug ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Route Quick Jump Carousel */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Route Jumps:</span>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => handleNavigate('/')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer text-[11px]"
            >
              / Marketing
            </button>
            <button
              onClick={() => handleNavigate('/onboarding')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer text-[11px]"
            >
              /onboarding
            </button>
            <button
              onClick={() => handleNavigate(`/b/${activeTenantSlug}`)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer text-[11px]"
            >
              /b/:slug (Public)
            </button>
            <button
              onClick={() => handleNavigate(`/b/${activeTenantSlug}/book`)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer text-[11px]"
            >
              /b/:slug/book
            </button>
            <button
              onClick={() => handleNavigate('/customer')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer text-[11px]"
            >
              /customer
            </button>
            <button
              onClick={() => handleNavigate('/admin')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer text-[11px]"
            >
              /admin
            </button>
            <button
              onClick={() => handleNavigate('/staff')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer text-[11px]"
            >
              /staff
            </button>
            <button
              onClick={() => handleNavigate('/super-admin')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded cursor-pointer text-[11px] font-bold"
            >
              /super-admin
            </button>
          </div>
        </div>
      </div>

      {/* RENDER ACTIVE APP SHELL */}
      <TenantContext.Provider value={tenantContextValue}>
        <div className="rounded-2xl border border-slate-300 shadow-xl overflow-hidden">
          {currentRouteDef.shell === 'MARKETING' && (
            <MarketingShell currentPath={currentPath} onNavigate={handleNavigate}>
              {renderShellContent()}
            </MarketingShell>
          )}

          {currentRouteDef.shell === 'AUTH' && (
            <MarketingShell currentPath={currentPath} onNavigate={handleNavigate}>
              {renderShellContent()}
            </MarketingShell>
          )}

          {currentRouteDef.shell === 'ONBOARDING' && (
            <MarketingShell currentPath={currentPath} onNavigate={handleNavigate}>
              {renderShellContent()}
            </MarketingShell>
          )}

          {currentRouteDef.shell === 'PUBLIC_BUSINESS' && (
            <PublicBusinessShell currentPath={currentPath} onNavigate={handleNavigate}>
              {renderShellContent()}
            </PublicBusinessShell>
          )}

          {currentRouteDef.shell === 'CUSTOMER' && (
            <CustomerShell currentPath={currentPath} onNavigate={handleNavigate}>
              {renderShellContent()}
            </CustomerShell>
          )}

          {currentRouteDef.shell === 'BUSINESS_ADMIN' && (
            <BusinessAdminShell currentPath={currentPath} onNavigate={handleNavigate}>
              {renderShellContent()}
            </BusinessAdminShell>
          )}

          {currentRouteDef.shell === 'STAFF' && (
            <StaffShell currentPath={currentPath} onNavigate={handleNavigate}>
              {renderShellContent()}
            </StaffShell>
          )}

          {currentRouteDef.shell === 'SUPER_ADMIN' && (
            <SuperAdminShell currentPath={currentPath} onNavigate={handleNavigate}>
              {renderShellContent()}
            </SuperAdminShell>
          )}
        </div>
      </TenantContext.Provider>
    </div>
  );
};
