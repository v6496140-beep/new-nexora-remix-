import React, { useState } from 'react';
import { ServicePackageConfigService } from '../services/servicePackageService';
import { Plus, Edit2, Trash2, X, Package } from 'lucide-react';
import { auditLogService } from '../services/auditLogService';
import { useAuth } from '../services/authContext';

const serviceManager = new ServicePackageConfigService();

export function PackagesPage() {
  const { session } = useAuth();
  const tenantId = session?.businessId || 'biz-barber-01';
  const [packages, setPackages] = useState(() => serviceManager.listPackagesByTenant(tenantId));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [packageName, setPackageName] = useState('');
  const [packagePrice, setPackagePrice] = useState(2500);

  const refreshList = () => {
    setPackages(serviceManager.listPackagesByTenant(tenantId));
  };

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageName.trim()) return;

    const created = serviceManager.createPackage({
      businessId: tenantId,
      name: packageName.trim(),
      serviceIds: ['srv-rc-1', 'srv-rc-2'],
      price: Number(packagePrice),
      duration: 60,
      featured: false,
      active: true,
      bookable: true,
      description: 'Signature grooming package bundled with precision care'
    });

    auditLogService.recordAuditLog({
      user: { id: 'usr-owner-1', name: 'Vikram Singhania', email: 'owner@royalcrown.in' },
      role: 'BUSINESS_OWNER',
      businessId: tenantId,
      businessName: 'The Royal Crown Barber & Lounge',
      action: 'SETTINGS_CHANGE',
      entity: 'Package',
      entityId: created.id,
      metadata: { action: 'PACKAGE_CREATED', name: created.name, price: created.price }
    });

    refreshList();
    setIsAddModalOpen(false);
    setPackageName('');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deactivate package "${name}"?`)) {
      serviceManager.updatePackage(id, { active: false }, tenantId);
      refreshList();
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Service Packages & Bundles</h1>
          <p className="text-slate-500 text-sm">Combined multi-service bundles and grooming ritual collections</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="p-4">Package Name</th>
                <th className="p-4">Bundled Services</th>
                <th className="p-4">Package Price</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {packages.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-slate-900 text-xs">{p.name}</td>
                  <td className="p-4 text-slate-600 text-xs">{p.serviceIds?.length || 2} services included</td>
                  <td className="p-4 font-black text-slate-900 text-sm">₹{p.price}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                      {p.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                      aria-label="Delete package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {packages.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-xs">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              No service packages found.
            </div>
          )}
        </div>
      </div>

      {/* Add Package Modal */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-slate-900">Add Service Package</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPackage} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Package Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sovereign Grooming Ritual"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Package Price (₹) *</label>
                <input 
                  type="number" 
                  required
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                >
                  Create Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
