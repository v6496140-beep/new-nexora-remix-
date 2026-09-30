import React, { useState } from 'react';
import {
  ServiceBookingConfig,
  PackageBookingConfig,
  SalonStaffMember,
  StaffAssignmentMode,
  isServiceBookable,
  isPackageBookable,
  getEligibleStaffForService,
  CATEGORY_DEFAULT_SERVICES
} from '../types/servicePackageConfig';
import {
  ServicePackageConfigService,
  SEEDED_SERVICES,
  SEEDED_PACKAGES,
  SEEDED_STAFF_MEMBERS
} from '../services/servicePackageService';
import { BookingItem } from '../types/bookingEngine';
import { Button, Card, Badge, Typography, Table, Alert, Input, Modal } from '../design-system';
import {
  Scissors,
  Sparkles,
  Package,
  Users,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Plus,
  Edit3,
  Building2,
  Layers,
  ArrowRight,
  Camera,
  History,
  AlertTriangle
} from 'lucide-react';

export const Phase42ServicesPackagesShowcase: React.FC = () => {
  const [serviceManager] = useState(() => new ServicePackageConfigService());
  const [activeTenantId, setActiveTenantId] = useState<string>('biz-barber-001');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-barber-1');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-barber-royal-ritual');
  const [actionLog, setActionLog] = useState<{ title: string; msg: string; type: 'success' | 'info' | 'warning' } | null>({
    title: 'Service & Package Booking Configuration Ready',
    msg: 'Manage services, bundled packages, eligible staff assignments, and price snapshot isolation.',
    type: 'info'
  });

  // Price Snapshot Simulation State
  const [simulatedSnapshots, setSimulatedSnapshots] = useState<BookingItem[]>([]);

  // Form Modal State for Edit/Create
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Partial<ServiceBookingConfig>>({});

  // Query tenant data
  const tenantServices = serviceManager.listServicesByTenant(activeTenantId);
  const tenantPackages = serviceManager.listPackagesByTenant(activeTenantId);
  const tenantStaff = serviceManager.listStaffByTenant(activeTenantId);

  const currentService = serviceManager.getService(selectedServiceId, activeTenantId) || tenantServices[0] || null;
  const currentPackage = serviceManager.getPackage(selectedPackageId, activeTenantId) || tenantPackages[0] || null;

  // Handler to toggle Bookable or Active state
  const handleToggleServiceStatus = (service: ServiceBookingConfig, field: 'active' | 'bookable') => {
    const newVal = !service[field];
    const res = serviceManager.updateService(service.id, { [field]: newVal }, activeTenantId);
    if (res.success && res.service) {
      setActionLog({
        title: `Service ${field.toUpperCase()} Updated`,
        msg: `"${service.name}" is now ${field === 'bookable' ? (newVal ? 'BOOKABLE ONLINE' : 'NOT BOOKABLE ONLINE (In-salon only)') : (newVal ? 'ACTIVE' : 'INACTIVE')}.`,
        type: newVal ? 'success' : 'warning'
      });
      // trigger re-render
      setSelectedServiceId(service.id);
    }
  };

  // Handler to toggle staff eligibility
  const handleToggleStaffEligibility = (service: ServiceBookingConfig, staffId: string) => {
    const currentEligible = service.eligibleStaffIds || [];
    const updatedEligible = currentEligible.includes(staffId)
      ? currentEligible.filter((id) => id !== staffId)
      : [...currentEligible, staffId];

    const res = serviceManager.updateService(service.id, { eligibleStaffIds: updatedEligible }, activeTenantId);
    if (res.success) {
      const staffMember = tenantStaff.find((s) => s.id === staffId);
      setActionLog({
        title: 'Staff Eligibility Updated',
        msg: `${staffMember?.name || staffId} is ${updatedEligible.includes(staffId) ? 'now ELIGIBLE' : 'REMOVED from eligible staff'} for "${service.name}".`,
        type: 'info'
      });
      setSelectedServiceId(service.id);
    }
  };

  // Handler to simulate generating historical price snapshot
  const handleGenerateSnapshot = (service: ServiceBookingConfig) => {
    const eligible = serviceManager.getEligibleStaffForService(service.id, activeTenantId);
    const assignedStaff = eligible[0] || undefined;
    const snapshotItem = serviceManager.createBookingItem(
      'SERVICE',
      service.id,
      `bk-sim-${Date.now().toString(36)}`,
      activeTenantId,
      assignedStaff?.id
    );

    setSimulatedSnapshots((prev) => [snapshotItem, ...prev]);
    setActionLog({
      title: 'Historical Snapshot Created',
      msg: `Captured immutable price snapshot of ₹${(snapshotItem.unitPriceCents / 100).toFixed(2)} for "${snapshotItem.nameSnapshot}". Future catalog price edits will NOT affect this record.`,
      type: 'success'
    });
  };

  // Handler to modify service price in catalog
  const handlePriceUpdate = (service: ServiceBookingConfig, newPrice: number) => {
    serviceManager.updateService(service.id, { price: newPrice }, activeTenantId);
    setActionLog({
      title: 'Catalog Price Altered',
      msg: `Updated "${service.name}" live catalog price to ₹${newPrice}. Observe that previously generated historical booking snapshots above remain unchanged.`,
      type: 'warning'
    });
    setSelectedServiceId(service.id);
  };

  // Handler to load category defaults
  const handleLoadCategoryDefaults = (categoryKey: string) => {
    const staffIds = tenantStaff.filter((s) => s.active).map((s) => s.id);
    const created = serviceManager.generateDefaultServicesForCategory(categoryKey, activeTenantId, staffIds);
    setActionLog({
      title: 'Category Default Services Initialized',
      msg: `Loaded ${created.length} default ${categoryKey} services for tenant ${activeTenantId}. All are fully editable.`,
      type: 'success'
    });
    if (created[0]) {
      setSelectedServiceId(created[0].id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-6 rounded-2xl border border-emerald-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success">PHASE 4.2 CONFIGURATION</Badge>
              <Badge variant="neutral">Multi-Tenant Services & Packages</Badge>
              <Badge variant="warning">Eligible Staff Bindings</Badge>
            </div>
            <Typography variant="h1" className="text-white text-2xl font-bold tracking-tight">
              Services & Packages Booking Configuration
            </Typography>
            <Typography variant="body" className="text-slate-400 mt-1">
              Service/package booking entities, category defaults, active vs. bookable rules, eligible staff filtering, and immutable price snapshots.
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const category = activeTenantId.includes('barber')
                  ? 'barber'
                  : activeTenantId.includes('spa')
                  ? 'spa'
                  : activeTenantId.includes('nail')
                  ? 'nail-studio'
                  : 'tattoo';
                handleLoadCategoryDefaults(category);
              }}
            >
              Load Category Defaults
            </Button>
          </div>
        </div>
      </div>

      {/* Tenant Context Selector */}
      <Card className="p-4 bg-slate-900/80 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="text-emerald-400" size={18} />
            <span className="text-sm font-semibold text-slate-200">Active Tenant Salon:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'biz-barber-001', name: 'Royal Crown Barber', cat: 'Barber' },
              { id: 'biz-spa-002', name: 'Zenith Stone Spa', cat: 'Spa' },
              { id: 'biz-nail-003', name: 'Gloss & Chic Nail Bar', cat: 'Nails' },
              { id: 'biz-tattoo-004', name: 'Mono Tattoo Studio', cat: 'Tattoo' }
            ].map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => {
                  setActiveTenantId(tenant.id);
                  const firstSrv = serviceManager.listServicesByTenant(tenant.id)[0];
                  if (firstSrv) setSelectedServiceId(firstSrv.id);
                  const firstPkg = serviceManager.listPackagesByTenant(tenant.id)[0];
                  if (firstPkg) setSelectedPackageId(firstPkg.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTenantId === tenant.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tenant.name} <span className="opacity-60 text-[10px]">({tenant.cat})</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Live Feedback Alert */}
      {actionLog && (
        <Alert
          variant={actionLog.type === 'warning' ? 'warning' : actionLog.type === 'success' ? 'success' : 'info'}
          title={actionLog.title}
        >
          {actionLog.msg}
        </Alert>
      )}

      {/* Main Grid: Services List & Configuration Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Services and Packages Catalog */}
        <div className="lg:col-span-5 space-y-6">
          {/* Services List Card */}
          <Card className="p-4 bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors size={18} className="text-emerald-400" />
                <Typography variant="h3" className="text-white text-base font-semibold">
                  Services Catalog ({tenantServices.length})
                </Typography>
              </div>
              <Badge variant="neutral" size="sm">
                {serviceManager.listBookableServicesByTenant(activeTenantId).length} Online Bookable
              </Badge>
            </div>

            <div className="space-y-2">
              {tenantServices.map((srv) => {
                const isSelected = selectedServiceId === srv.id;
                const bookable = isServiceBookable(srv);
                return (
                  <button
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-sm line-clamp-1">{srv.name}</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm whitespace-nowrap">
                        ₹{srv.price}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {/* Active State Badge */}
                      {srv.active ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                          Active
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-950/80 text-rose-300 border border-rose-800/50">
                          Inactive
                        </span>
                      )}

                      {/* Bookable Online Rule Badge */}
                      {srv.bookable ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                          Bookable Online
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800/50">
                          Catalog Display Only
                        </span>
                      )}

                      {srv.featured && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-950/80 text-purple-300 border border-purple-800/50">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {srv.duration}m (+{srv.bufferTime}m buffer)
                      </span>
                      <span>•</span>
                      <span>{srv.eligibleStaffIds.length} Eligible Staff</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Bundled Packages Card */}
          <Card className="p-4 bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-purple-400" />
                <Typography variant="h3" className="text-white text-base font-semibold">
                  Bundled Packages ({tenantPackages.length})
                </Typography>
              </div>
            </div>

            {tenantPackages.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-xs">
                No packages configured for this tenant.
              </div>
            ) : (
              <div className="space-y-2">
                {tenantPackages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  const bundledSavings = (pkg.originalPrice || pkg.price) - pkg.price;
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500 text-white'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm line-clamp-1">{pkg.name}</span>
                        <div className="text-right">
                          <span className="font-mono font-bold text-purple-400 text-sm block">
                            ₹{pkg.price}
                          </span>
                          {pkg.originalPrice && (
                            <span className="text-[10px] text-slate-500 line-through">
                              ₹{pkg.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                        <Badge variant="neutral" size="sm">
                          {pkg.serviceIds.length} Services Bundled
                        </Badge>
                        {bundledSavings > 0 && (
                          <Badge variant="success" size="sm">
                            Save ₹{bundledSavings}
                          </Badge>
                        )}
                        <span className="text-[11px] text-slate-400 ml-auto">
                          {pkg.duration} mins
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column (7 Cols): Service Config Inspector, Eligible Staff & Price Snapshot Protection */}
        <div className="lg:col-span-7 space-y-6">
          {currentService && (
            <Card className="p-5 bg-slate-900 border border-slate-800 space-y-5">
              {/* Header & Quick Status Toggles */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Typography variant="h3" className="text-white text-lg font-bold">
                      {currentService.name}
                    </Typography>
                    <Badge variant="neutral" size="sm">{currentService.categoryId}</Badge>
                  </div>
                  <Typography variant="body" className="text-slate-400 text-xs mt-1">
                    {currentService.description}
                  </Typography>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={currentService.active ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handleToggleServiceStatus(currentService, 'active')}
                  >
                    {currentService.active ? 'Active in Catalog' : 'Inactive'}
                  </Button>
                  <Button
                    variant={currentService.bookable ? 'outline' : 'secondary'}
                    size="sm"
                    onClick={() => handleToggleServiceStatus(currentService, 'bookable')}
                  >
                    {currentService.bookable ? 'Online Bookable' : 'Display Only'}
                  </Button>
                </div>
              </div>

              {/* Booking Configuration Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block">Catalog Price</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      ₹{currentService.price}
                    </span>
                    <button
                      onClick={() => {
                        const newPrice = currentService.price + 100;
                        handlePriceUpdate(currentService, newPrice);
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]"
                      title="Simulate price change to test historical snapshot isolation"
                    >
                      +₹100
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block">Duration & Buffer</span>
                  <span className="font-semibold text-slate-200 block mt-0.5">
                    {currentService.duration}m (+{currentService.bufferTime}m buffer)
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Advance Deposit</span>
                  <span className="font-semibold text-indigo-300 block mt-0.5">
                    {currentService.advancePercentage || 25}% (₹{((currentService.price * (currentService.advancePercentage || 25)) / 100).toFixed(0)})
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Assignment Mode</span>
                  <span className="font-mono font-semibold text-slate-300 text-[11px] block mt-0.5">
                    {currentService.staffAssignmentMode || 'ANY_AVAILABLE'}
                  </span>
                </div>
              </div>

              {/* Service -> Eligible Staff Relationship Configurator */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Users size={16} className="text-emerald-400" />
                    <Typography variant="h4" className="text-slate-200 text-sm font-semibold">
                      Eligible Staff Assignment ({currentService.eligibleStaffIds.length} Assigned)
                    </Typography>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Only selected active staff appear during customer booking
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tenantStaff.map((member) => {
                    const isEligible = currentService.eligibleStaffIds.includes(member.id);
                    return (
                      <div
                        key={member.id}
                        onClick={() => handleToggleStaffEligibility(currentService, member.id)}
                        className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                          isEligible
                            ? 'bg-emerald-950/30 border-emerald-500/60 text-white'
                            : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                        } ${!member.active ? 'opacity-50' : ''}`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-xs text-slate-200">{member.name}</span>
                            {!member.active && (
                              <Badge variant="danger" size="sm">Inactive</Badge>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block">
                            {member.role} • {member.specializations.slice(0, 2).join(', ')}
                          </span>
                        </div>
                        <div>
                          {isEligible ? (
                            <CheckCircle2 size={16} className="text-emerald-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Snapshot Protection Simulator */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-indigo-400" />
                    <Typography variant="h4" className="text-slate-200 text-sm font-semibold">
                      Historical Price Snapshot Protection Simulator
                    </Typography>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleGenerateSnapshot(currentService)}
                  >
                    Capture Booking Snapshot
                  </Button>
                </div>

                <Typography variant="caption" className="text-slate-400 text-xs block">
                  When a customer books, the booking creates an immutable item snapshot. Test: Capture a snapshot, then increase the catalog price above (+₹100) to verify snapshots never mutate.
                </Typography>

                {simulatedSnapshots.length > 0 ? (
                  <div className="space-y-2">
                    {simulatedSnapshots.slice(0, 3).map((snap, idx) => (
                      <div
                        key={snap.id}
                        className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-medium text-white block">{snap.nameSnapshot}</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Snapshot ID: {snap.id} • Assigned Staff: {snap.staffNameSnapshot || 'None'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-400 block">
                            ₹{(snap.unitPriceCents / 100).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {snap.durationMinutesSnapshot} mins
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950/40 rounded-lg border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                    No booking snapshots created yet. Click "Capture Booking Snapshot" above to test snapshot immutability.
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Package Deep Inspector (when package is selected) */}
          {currentPackage && (
            <Card className="p-5 bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Typography variant="h3" className="text-white text-base font-bold">
                      Package: {currentPackage.name}
                    </Typography>
                    <Badge variant="success" size="sm">Bundled Savings</Badge>
                  </div>
                  <Typography variant="caption" className="text-slate-400 text-xs">
                    {currentPackage.description}
                  </Typography>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Bundled Price</span>
                  <span className="text-lg font-bold font-mono text-purple-400">
                    ₹{currentPackage.price}
                  </span>
                </div>
              </div>

              {/* Bundled Services in Package */}
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  Bundled Service Items:
                </span>
                <div className="space-y-1.5">
                  {currentPackage.serviceIds.map((srvId) => {
                    const srv = serviceManager.getService(srvId, activeTenantId);
                    return (
                      <div
                        key={srvId}
                        className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/50 flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-200">{srv?.name || srvId}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">{srv?.duration} mins</span>
                          <span className="font-mono text-slate-300">₹{srv?.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
