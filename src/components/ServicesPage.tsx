import React, { useState } from 'react';
import { ServicePackageConfigService } from '../services/servicePackageService';
import { Plus, Edit2, Trash2, X, Scissors, Check, DollarSign } from 'lucide-react';
import { auditLogService } from '../services/auditLogService';
import { useAuth } from '../services/authContext';

const serviceManager = new ServicePackageConfigService();

export function ServicesPage() {
  const { session } = useAuth();
  const tenantId = session?.businessId || 'biz-barber-01';
  const [services, setServices] = useState(() => serviceManager.listServicesByTenant(tenantId));
  const [editingService, setEditingService] = useState<any | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Haircut');
  const [newDuration, setNewDuration] = useState(30);
  const [newPrice, setNewPrice] = useState(1200);

  const refreshList = () => {
    setServices(serviceManager.listServicesByTenant(tenantId));
  };

  const handleOpenEdit = (s: any) => {
    setEditingService(s);
    setEditPrice(s.price);
  };

  const handleSavePriceChange = () => {
    if (!editingService) return;
    const oldPrice = editingService.price;
    const newPriceVal = Number(editPrice);

    serviceManager.updateService(editingService.id, {
      price: newPriceVal
    }, tenantId);

    // Record SERVICE_PRICE_CHANGE audit log
    auditLogService.recordAuditLog({
      user: { id: 'usr-owner-1', name: 'Vikram Singhania', email: 'owner@royalcrown.in' },
      role: 'BUSINESS_OWNER',
      businessId: tenantId,
      businessName: 'The Royal Crown Barber & Lounge',
      action: 'SERVICE_PRICE_CHANGE',
      entity: 'Service',
      entityId: editingService.id,
      metadata: {
        serviceName: editingService.name,
        oldPrice,
        newPrice: newPriceVal,
        currency: 'INR'
      }
    });

    refreshList();
    setEditingService(null);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created = serviceManager.createService({
      businessId: tenantId,
      name: newName.trim(),
      categoryId: newCategory,
      duration: Number(newDuration),
      bufferTime: 10,
      price: Number(newPrice),
      active: true,
      bookable: true,
      featured: false,
      sortOrder: 10,
      eligibleStaffIds: ['stf-rc-01'],
      description: 'Handcrafted signature salon ritual'
    });

    auditLogService.recordAuditLog({
      user: { id: 'usr-owner-1', name: 'Vikram Singhania', email: 'owner@royalcrown.in' },
      role: 'BUSINESS_OWNER',
      businessId: tenantId,
      businessName: 'The Royal Crown Barber & Lounge',
      action: 'SETTINGS_CHANGE',
      entity: 'Service',
      entityId: created.id,
      metadata: { action: 'SERVICE_CREATED', name: created.name, price: created.price }
    });

    refreshList();
    setIsAddModalOpen(false);
    setNewName('');
  };

  const handleDeleteService = (id: string, name: string) => {
    if (confirm(`Are you sure you want to deactivate "${name}"?`)) {
      serviceManager.updateService(id, { active: false }, tenantId);
      refreshList();
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Service Catalog</h1>
          <p className="text-slate-500 text-sm">Pricing tiers, durations, and ritual configurations</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="p-4">Service Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Pricing</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 text-xs">{s.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{s.id}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {s.categoryId}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-600">{s.duration} min</td>
                  <td className="p-4 font-black text-slate-900 text-sm">₹{s.price}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${s.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                      {s.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button 
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all"
                        aria-label={`Edit ${s.name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteService(s.id, s.name)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                        aria-label={`Delete ${s.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Price Modal */}
      {editingService && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setEditingService(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-indigo-600 uppercase font-bold">Price Adjustment</span>
                <h3 className="text-base font-black text-slate-900">{editingService.name}</h3>
              </div>
              <button onClick={() => setEditingService(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Service Price (INR)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                <input 
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-black text-slate-800 focus:border-indigo-500 outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Modifying this price will generate an immutable audit log entry in the system ledger.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => setEditingService(null)} 
                className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleSavePriceChange}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
              >
                Confirm Price
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
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
              <h3 className="text-lg font-black text-slate-900">Add New Service</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Service Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Royal Beard Grooming"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <input 
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duration (Min)</label>
                  <input 
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Standard Price (₹) *</label>
                <input 
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
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
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
