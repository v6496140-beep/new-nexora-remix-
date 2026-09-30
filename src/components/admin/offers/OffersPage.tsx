import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../services/authContext';
import { businessOffersService } from '../../../services/businessOffersService';
import { BusinessOffer, OfferStatus, OfferDiscountType, OfferTargetSegment } from '../../../types/offers';
import { AccessDeniedView } from '../../common/PermissionGuard';
import { ServicePackageConfigService } from '../../../services/servicePackageService';
import { customerCrmService } from '../../../services/customerCrmService';
import { DeliveryChannel } from '../../../types/crmCampaigns';
import {
  Tag,
  Plus,
  Search,
  Filter,
  Percent,
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Trash2,
  Edit2,
  Send,
  Eye,
  X,
  AlertCircle,
  Copy,
  Check,
  Building,
  TrendingUp,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Clock,
  Scissors,
  Package
} from 'lucide-react';

const servicePackageService = new ServicePackageConfigService();

export function OffersPage() {
  const { session } = useAuth();
  const tenantId = session?.businessId || 'biz-barber-01';

  // RBAC check
  const isAuthorized = session?.role === 'BUSINESS_OWNER' || session?.role === 'MANAGER' || session?.role === 'SUPER_ADMIN';

  const [offers, setOffers] = useState<BusinessOffer[]>(() =>
    businessOffersService.listOffers(tenantId, {}, session)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OfferStatus | 'ALL'>('ALL');
  const [segmentFilter, setSegmentFilter] = useState<string>('ALL');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<BusinessOffer | null>(null);
  const [selectedOfferForDetail, setSelectedOfferForDetail] = useState<BusinessOffer | null>(null);
  const [selectedOfferForCampaign, setSelectedOfferForCampaign] = useState<BusinessOffer | null>(null);

  // Campaign Dispatch Modal State
  const [campaignChannel, setCampaignChannel] = useState<DeliveryChannel>('WhatsApp');
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);
  const [campaignSuccessMessage, setCampaignSuccessMessage] = useState<string | null>(null);

  // Copied Promo Code feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Available services and packages for tenant
  const availableServices = useMemo(() => servicePackageService.listServicesByTenant(tenantId), [tenantId]);
  const availablePackages = useMemo(() => servicePackageService.listPackagesByTenant(tenantId), [tenantId]);

  const refreshOffers = () => {
    setOffers(businessOffersService.listOffers(tenantId, {}, session));
  };

  useEffect(() => {
    refreshOffers();
  }, [tenantId]);

  // Filtered list
  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      const matchesSearch =
        o.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      const matchesSegment = segmentFilter === 'ALL' || o.targetSegment === segmentFilter;

      return matchesSearch && matchesStatus && matchesSegment;
    });
  }, [offers, searchQuery, statusFilter, segmentFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const active = offers.filter((o) => o.status === 'ACTIVE').length;
    const totalRedemptions = offers.reduce((sum, o) => sum + o.usageCount, 0);
    return { active, totalRedemptions };
  }, [offers]);

  if (!isAuthorized) {
    return (
      <AccessDeniedView
        resource="Offers & Promotional Discounts"
        action="manage"
        reason="Staff and Customer accounts cannot manage promotional discount codes. Access is restricted to Business Owners and Managers."
      />
    );
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = (offer: BusinessOffer) => {
    const newStatus: OfferStatus = offer.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    businessOffersService.setOfferStatus(tenantId, offer.id, newStatus, session);
    refreshOffers();
  };

  const handleDeleteOffer = (offerId: string) => {
    if (window.confirm('Are you sure you want to delete this promotional offer?')) {
      businessOffersService.deleteOffer(tenantId, offerId, session);
      refreshOffers();
      if (selectedOfferForDetail?.id === offerId) setSelectedOfferForDetail(null);
    }
  };

  const handleLaunchCampaign = () => {
    if (!selectedOfferForCampaign) return;
    setIsSendingCampaign(true);
    setCampaignSuccessMessage(null);

    try {
      const result = businessOffersService.sendOfferCampaign(
        tenantId,
        selectedOfferForCampaign.id,
        campaignChannel,
        session
      );
      setCampaignSuccessMessage(
        `Campaign successfully launched! Reached ${result.recipientsReached} opted-in clients via ${campaignChannel}.`
      );
      setTimeout(() => {
        setIsSendingCampaign(false);
        setSelectedOfferForCampaign(null);
        setCampaignSuccessMessage(null);
      }, 2500);
    } catch (err: any) {
      alert(err?.message || 'Failed to dispatch offer campaign.');
      setIsSendingCampaign(false);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-16 max-w-6xl mx-auto">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              Promotions & Growth Engine
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> Tenant: {tenantId}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Offers & Promo Discounts</h1>
          <p className="text-xs text-slate-500 font-medium">
            Create percentage & fixed-amount promo codes, customer segment targeting, and 1-click broadcasts
          </p>
        </div>

        <button
          onClick={() => {
            setEditingOffer(null);
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-indigo-600/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Offer
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Campaigns</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{metrics.active}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Redemptions</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{metrics.totalRedemptions}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Segments</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">6 Active</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Broadcast Engine</div>
          <div className="text-2xl font-black text-purple-600 mt-1">1-Click Live</div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code, title, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="PAUSED">Paused</option>
            <option value="DRAFT">Draft</option>
            <option value="EXPIRED">Expired</option>
          </select>

          <select
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">All Customer Segments</option>
            <option value="NEW">New Customers</option>
            <option value="RETURNING">Returning Customers</option>
            <option value="VIP">VIP Clients</option>
            <option value="INACTIVE">Inactive Clients</option>
            <option value="BIRTHDAY_MONTH">Birthday Customers</option>
            <option value="DUE_FOR_VISIT">Due For Visit</option>
          </select>
        </div>
      </div>

      {/* Offers Grid */}
      {filteredOffers.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Tag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No promotional offers found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create promo codes to reward loyal clients, re-engage inactive customers, or attract first-time bookings.
          </p>
          <button
            onClick={() => {
              setEditingOffer(null);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create First Offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOffers.map((offer) => {
            const isPercentage = offer.discountType === 'PERCENTAGE';
            const discountLabel = isPercentage
              ? `${offer.discountValue}% OFF`
              : `₹${(offer.discountValue / 100).toFixed(0)} FLAT OFF`;

            return (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Header with Code & Status */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-2.5 py-1 bg-slate-900 text-white rounded-lg tracking-wider">
                        {offer.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(offer.code)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded-md transition-colors"
                        title="Copy promo code"
                      >
                        {copiedCode === offer.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        offer.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : offer.status === 'PAUSED'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : offer.status === 'DRAFT'
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {offer.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">{offer.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{offer.description}</p>
                  </div>

                  {/* Discount Badge */}
                  <div className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-900">{discountLabel}</span>
                    {offer.maxDiscountCents && (
                      <span className="text-[10px] text-indigo-700 font-bold">
                        Cap: ₹{(offer.maxDiscountCents / 100).toFixed(0)}
                      </span>
                    )}
                    {offer.minimumBookingAmountCents > 0 && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        Min: ₹{(offer.minimumBookingAmountCents / 100).toFixed(0)}
                      </span>
                    )}
                  </div>

                  {/* Metadata Row */}
                  <div className="space-y-1.5 text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> Validity:
                      </span>
                      <span className="font-mono font-semibold text-slate-700">
                        {offer.startDate} to {offer.endDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" /> Segment:
                      </span>
                      <span className="font-bold text-slate-800">
                        {offer.targetSegment === 'ALL'
                          ? 'All Customers'
                          : offer.targetSegment === 'VIP'
                          ? 'VIP Clients'
                          : offer.targetSegment === 'NEW'
                          ? 'First-Timers'
                          : offer.targetSegment}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Usage count:</span>
                      <span className="font-bold font-mono text-slate-900">
                        {offer.usageCount} {offer.usageLimit ? `/ ${offer.usageLimit}` : 'redemptions'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1">
                  <button
                    onClick={() => setSelectedOfferForCampaign(offer)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                    title="Send offer to customers via WhatsApp or SMS"
                  >
                    <Send className="w-3 h-3" /> Send
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedOfferForDetail(offer)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingOffer(offer);
                        setIsCreateModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-all"
                      title="Edit Offer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggleStatus(offer)}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                      title={offer.status === 'ACTIVE' ? 'Pause Offer' : 'Activate Offer'}
                    >
                      {offer.status === 'ACTIVE' ? (
                        <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT OFFER MODAL */}
      {isCreateModalOpen && (
        <OfferFormModal
          initialOffer={editingOffer}
          availableServices={availableServices}
          availablePackages={availablePackages}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingOffer(null);
          }}
          onSave={(payload) => {
            if (editingOffer) {
              businessOffersService.updateOffer(tenantId, editingOffer.id, payload, session);
            } else {
              businessOffersService.createOffer(tenantId, payload as any, session);
            }
            setIsCreateModalOpen(false);
            setEditingOffer(null);
            refreshOffers();
          }}
        />
      )}

      {/* OFFER DETAIL MODAL */}
      {selectedOfferForDetail && (
        <OfferDetailModal
          offer={selectedOfferForDetail}
          availableServices={availableServices}
          availablePackages={availablePackages}
          onClose={() => setSelectedOfferForDetail(null)}
          onSendCampaign={() => {
            setSelectedOfferForCampaign(selectedOfferForDetail);
            setSelectedOfferForDetail(null);
          }}
        />
      )}

      {/* ONE-CLICK SEND CAMPAIGN MODAL */}
      {selectedOfferForCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">One-Click Offer Broadcast</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Send promo code directly to customer phones</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOfferForCampaign(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Promo Code:</span>
                <span className="font-mono font-black text-slate-900">{selectedOfferForCampaign.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Target Audience:</span>
                <span className="font-bold text-slate-900">
                  {selectedOfferForCampaign.targetSegment === 'ALL'
                    ? 'All Customers'
                    : selectedOfferForCampaign.targetSegment}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Discount Value:</span>
                <span className="font-bold text-indigo-600">
                  {selectedOfferForCampaign.discountType === 'PERCENTAGE'
                    ? `${selectedOfferForCampaign.discountValue}% OFF`
                    : `₹${(selectedOfferForCampaign.discountValue / 100).toFixed(0)} FLAT OFF`}
                </span>
              </div>
            </div>

            {/* Channel Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Delivery Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['WhatsApp', 'SMS', 'Email'] as DeliveryChannel[]).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setCampaignChannel(ch)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      campaignChannel === ch
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Consent Protection Notice */}
            <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-[11px] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Guaranteed:</strong> Broadcasts are strictly delivered to customers with explicit{' '}
                {campaignChannel} marketing consent. DND numbers will be automatically filtered.
              </span>
            </div>

            {campaignSuccessMessage && (
              <div className="p-3 bg-emerald-100 text-emerald-950 rounded-xl font-bold text-xs animate-in fade-in">
                {campaignSuccessMessage}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedOfferForCampaign(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSendingCampaign}
                onClick={handleLaunchCampaign}
                className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md shadow-indigo-600/20"
              >
                {isSendingCampaign ? 'Broadcasting...' : `Launch ${campaignChannel} Campaign`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// CREATE / EDIT OFFER MODAL COMPONENT
// ----------------------------------------------------------------------------
function OfferFormModal({
  initialOffer,
  availableServices,
  availablePackages,
  onClose,
  onSave
}: {
  initialOffer: BusinessOffer | null;
  availableServices: any[];
  availablePackages: any[];
  onClose: () => void;
  onSave: (payload: any) => void;
}) {
  const [code, setCode] = useState(initialOffer?.code || '');
  const [name, setName] = useState(initialOffer?.name || '');
  const [title, setTitle] = useState(initialOffer?.title || '');
  const [description, setDescription] = useState(initialOffer?.description || '');
  const [discountType, setDiscountType] = useState<OfferDiscountType>(
    initialOffer?.discountType || 'PERCENTAGE'
  );
  const [discountValue, setDiscountValue] = useState<number>(
    initialOffer
      ? initialOffer.discountType === 'PERCENTAGE'
        ? initialOffer.discountValue
        : initialOffer.discountValue / 100
      : 20
  );
  const [minAmount, setMinAmount] = useState<number>(
    initialOffer ? initialOffer.minimumBookingAmountCents / 100 : 500
  );
  const [maxDiscount, setMaxDiscount] = useState<number>(
    initialOffer?.maxDiscountCents ? initialOffer.maxDiscountCents / 100 : 300
  );
  const [startDate, setStartDate] = useState(
    initialOffer?.startDate || new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    initialOffer?.endDate ||
      new Date(Date.now() + 60 * 24 * 3600000).toISOString().split('T')[0]
  );
  const [usageLimit, setUsageLimit] = useState<string>(
    initialOffer?.usageLimit ? String(initialOffer.usageLimit) : ''
  );
  const [perCustomerLimit, setPerCustomerLimit] = useState<number>(
    initialOffer?.perCustomerLimit || 1
  );
  const [targetSegment, setTargetSegment] = useState<OfferTargetSegment>(
    initialOffer?.targetSegment || 'ALL'
  );
  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialOffer?.applicableServices || []
  );
  const [selectedPackages, setSelectedPackages] = useState<string[]>(
    initialOffer?.applicablePackages || []
  );
  const [status, setStatus] = useState<OfferStatus>(initialOffer?.status || 'ACTIVE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !title.trim()) return;

    const payload = {
      code: code.toUpperCase().trim(),
      name: name.trim(),
      title: title.trim(),
      description: description.trim(),
      discountType,
      discountValue: discountType === 'PERCENTAGE' ? Number(discountValue) : Number(discountValue) * 100,
      minimumBookingAmountCents: Number(minAmount) * 100,
      maxDiscountCents: discountType === 'PERCENTAGE' && maxDiscount ? Number(maxDiscount) * 100 : null,
      startDate,
      endDate,
      usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
      perCustomerLimit: Number(perCustomerLimit),
      targetSegment,
      applicableServices: selectedServices,
      applicablePackages: selectedPackages,
      status
    };

    onSave(payload);
  };

  const toggleService = (srvId: string) => {
    setSelectedServices((prev) =>
      prev.includes(srvId) ? prev.filter((id) => id !== srvId) : [...prev, srvId]
    );
  };

  const togglePackage = (pkgId: string) => {
    setSelectedPackages((prev) =>
      prev.includes(pkgId) ? prev.filter((id) => id !== pkgId) : [...prev, pkgId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {initialOffer ? 'Edit Promotional Offer' : 'Create Promotional Offer'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Configure discount rules, eligibility and time limits</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">Promo Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. ROYALFEST20"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">Internal Campaign Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Festive Royal Grooming Discount"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 uppercase tracking-wider">Customer-Facing Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. 20% Off Artisanal Grooming & Classic Shaves"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 uppercase tracking-wider">Description</label>
            <textarea
              rows={2}
              placeholder="Provide offer terms for client checkout..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Discount Configuration */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
              Discount Mechanics
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
                >
                  <option value="PERCENTAGE">Percentage (% Off)</option>
                  <option value="FIXED_AMOUNT">Fixed Amount (₹ Off)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  {discountType === 'PERCENTAGE' ? 'Discount % *' : 'Discount Amount (₹) *'}
                </label>
                <input
                  type="number"
                  min="1"
                  max={discountType === 'PERCENTAGE' ? 100 : 50000}
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              {discountType === 'PERCENTAGE' && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 300 (Optional)"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Minimum Booking Subtotal (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={minAmount}
                  onChange={(e) => setMinAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Per Customer Limit</label>
                <select
                  value={perCustomerLimit}
                  onChange={(e) => setPerCustomerLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
                >
                  <option value={1}>1 time per client (Recommended)</option>
                  <option value={2}>2 times per client</option>
                  <option value={5}>5 times per client</option>
                  <option value={999}>Unlimited per client</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates & Limits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">End Date *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Total Usage Limit</label>
              <input
                type="number"
                min="1"
                placeholder="Unlimited"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none"
              />
            </div>
          </div>

          {/* Target Audience Segment */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 uppercase tracking-wider">
              Target Customer Segment
            </label>
            <select
              value={targetSegment}
              onChange={(e) => setTargetSegment(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
            >
              <option value="ALL">All Customers (Universal Promotion)</option>
              <option value="NEW">New Customers (First-Time Visitors)</option>
              <option value="RETURNING">Returning Customers (Loyal Regulars)</option>
              <option value="VIP">VIP Clients (High Spenders)</option>
              <option value="INACTIVE">Inactive Clients (30+ Days Since Visit)</option>
              <option value="BIRTHDAY_MONTH">Birthday Customers (This Month)</option>
              <option value="DUE_FOR_VISIT">Due For Visit (Revisit Cycle)</option>
            </select>
          </div>

          {/* Applicable Services & Packages Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                Applicable Services (Empty = All Services)
              </label>
              <span className="text-[10px] text-slate-400">
                {selectedServices.length === 0 ? 'Applies to entire catalog' : `${selectedServices.length} selected`}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {availableServices.map((srv) => {
                const isSelected = selectedServices.includes(srv.id);
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => toggleService(srv.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {srv.name} (₹{srv.price})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Applicable Packages Selection */}
          {availablePackages.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center">
                <label className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                  Applicable Packages (Empty = All Packages)
                </label>
                <span className="text-[10px] text-slate-400">
                  {selectedPackages.length === 0 ? 'Applies to all packages' : `${selectedPackages.length} selected`}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {availablePackages.map((pkg) => {
                  const isSelected = selectedPackages.includes(pkg.id);
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => togglePackage(pkg.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pkg.name} (₹{pkg.price})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20"
            >
              {initialOffer ? 'Save Changes' : 'Create Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// OFFER DETAIL MODAL COMPONENT
// ----------------------------------------------------------------------------
function OfferDetailModal({
  offer,
  availableServices,
  availablePackages,
  onClose,
  onSendCampaign
}: {
  offer: BusinessOffer;
  availableServices: any[];
  availablePackages: any[];
  onClose: () => void;
  onSendCampaign: () => void;
}) {
  const isPercentage = offer.discountType === 'PERCENTAGE';
  const discountLabel = isPercentage
    ? `${offer.discountValue}% OFF`
    : `₹${(offer.discountValue / 100).toFixed(0)} FLAT OFF`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black px-3 py-1 bg-slate-900 text-white rounded-xl">
              {offer.code}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                offer.status === 'ACTIVE'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {offer.status}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-900">{offer.name}</h2>
          <p className="text-xs text-slate-600 font-medium">{offer.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Discount</div>
            <div className="text-base font-black text-indigo-600 mt-0.5">{discountLabel}</div>
            {offer.maxDiscountCents && (
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                Capped at ₹{(offer.maxDiscountCents / 100).toFixed(0)}
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Redemptions</div>
            <div className="text-base font-black text-slate-900 mt-0.5">
              {offer.usageCount} {offer.usageLimit ? `/ ${offer.usageLimit}` : 'total'}
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
              Limit: {offer.perCustomerLimit} per client
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Valid Horizon:</span>
            <span className="font-mono font-bold text-slate-900">
              {offer.startDate} to {offer.endDate}
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Target Segment:</span>
            <span className="font-bold text-slate-900">
              {offer.targetSegment === 'ALL' ? 'All Customers' : offer.targetSegment}
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Minimum Booking Value:</span>
            <span className="font-mono font-bold text-slate-900">
              ₹{(offer.minimumBookingAmountCents / 100).toFixed(0)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Close
          </button>
          <button
            onClick={onSendCampaign}
            className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20 inline-flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Broadcast Offer
          </button>
        </div>
      </div>
    </div>
  );
}
