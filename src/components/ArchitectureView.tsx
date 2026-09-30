import React, { useState } from 'react';
import { PRODUCT_AREAS, ProductArea } from '../data/productArchitectureData';
import { Layers, ArrowRight, Database, GitBranch, CheckCircle2, Search } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>('area-b');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const selectedArea = PRODUCT_AREAS.find((a) => a.id === selectedAreaId) || PRODUCT_AREAS[0];

  const categories = [
    { id: 'all', label: 'All 16 Areas (A–P)' },
    { id: 'Front-of-House', label: 'Front-of-House (C, D, E)' },
    { id: 'Tenant Operations', label: 'Tenant Operations (B, F, G, H, L)' },
    { id: 'Back-of-House Finance', label: 'Back-of-House Finance (I, J, K, M, N, O)' },
    { id: 'Platform Core', label: 'Platform Core (A, P)' },
  ];

  const filteredAreas = PRODUCT_AREAS.filter((area) => {
    if (filterCategory !== 'all' && area.category !== filterCategory) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      area.name.toLowerCase().includes(q) ||
      area.code.toLowerCase().includes(q) ||
      area.summary.toLowerCase().includes(q) ||
      area.keyEntities.some((e) => e.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner and Category Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>System Topology</span>
              <span aria-hidden="true">·</span>
              <span>16 Functional Product Areas</span>
              <span aria-hidden="true">·</span>
              <span>Decoupled Micro-Domain Architecture</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Product Architecture & Module Relationship Map
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Nexora SalonOS is architected into 16 discrete, highly cohesive modules organized across four architectural tiers: Front-of-House client touchpoints, Tenant Operations, Financial Settlement engines, and Platform Governance.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search module or entity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 w-56"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-4 border-t border-slate-100">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                filterCategory === c.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Pane View: Area Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: 16 Product Areas Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            System Modules ({filteredAreas.length})
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredAreas.map((area) => {
              const isSelected = area.id === selectedArea.id;
              return (
                <button
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                  className={`text-left p-4 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold ${
                        isSelected ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {area.code}
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {area.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold truncate">{area.name}</h4>
                  <p
                    className={`text-xs mt-1 line-clamp-2 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {area.summary}
                  </p>
                  <div
                    className={`text-[11px] mt-3 pt-2 border-t flex items-center justify-between ${
                      isSelected ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    <span>{area.connectedModules.length} connections</span>
                    <span>{area.keyEntities.length} entities</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Deep Inspector for Selected Module */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded bg-slate-900 text-white font-mono text-sm font-bold flex items-center justify-center">
                  {selectedArea.code}
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                  {selectedArea.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-3">
                {selectedArea.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {selectedArea.summary}
              </p>
            </div>

            {/* Key Architectural Responsibilities */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
                <span>Core Architectural Responsibilities</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedArea.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-400">▪</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inputs & Outputs */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <h5 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Input Streams
                </h5>
                <ul className="space-y-1 text-xs text-slate-700">
                  {selectedArea.inputs.map((inStr, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-slate-400">→</span>
                      <span>{inStr}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Output Streams
                </h5>
                <ul className="space-y-1 text-xs text-slate-700">
                  {selectedArea.outputs.map((outStr, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span>{outStr}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Connected Modules */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-slate-700" />
                <span>Connected Modules</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedArea.connectedModules.map((mod, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-slate-700"
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Domain Entities */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-slate-700" />
                <span>Core Domain Entities</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedArea.keyEntities.map((ent, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded"
                  >
                    {ent}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Area Architectural Topology Diagram */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Architectural Data Pipeline & Event Flow
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          High-level schematic of how data flows from public marketing through tenant configuration, customer checkout, operational delivery, and financial settlement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          {/* Phase 1: Onboarding & Site */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3">
            <div className="font-bold text-slate-900 border-b border-slate-200 pb-2">
              1. Creation & Public Site
            </div>
            <div className="space-y-1.5 text-slate-600">
              <div className="p-2 bg-white border border-slate-200 rounded">
                A. Marketing Website
              </div>
              <div className="text-center text-slate-400">↓ Sign up</div>
              <div className="p-2 bg-white border border-slate-200 rounded">
                B. Business Onboarding
              </div>
              <div className="text-center text-slate-400">↓ Generation</div>
              <div className="p-2 bg-white border border-slate-200 rounded">
                H. Website Builder
              </div>
              <div className="text-center text-slate-400">↓ Publish</div>
              <div className="p-2 bg-white border border-slate-200 rounded font-semibold text-slate-900">
                C. Public Website
              </div>
            </div>
          </div>

          {/* Phase 2: Booking & Client */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3">
            <div className="font-bold text-slate-900 border-b border-slate-200 pb-2">
              2. Booking & Client Funnel
            </div>
            <div className="space-y-1.5 text-slate-600">
              <div className="p-2 bg-white border border-slate-200 rounded font-semibold text-slate-900">
                C. Public Website
              </div>
              <div className="text-center text-slate-400">↓ "Book Now" CTA</div>
              <div className="p-2 bg-white border border-slate-200 rounded">
                E. Booking Experience
              </div>
              <div className="text-center text-slate-400">↓ Customer record</div>
              <div className="p-2 bg-white border border-slate-200 rounded">
                D. Customer Account
              </div>
              <div className="text-center text-slate-400">↓ Deposit checkout</div>
              <div className="p-2 bg-white border border-slate-200 rounded">
                I. Payments Engine
              </div>
            </div>
          </div>

          {/* Phase 3: Salon Operations */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3">
            <div className="font-bold text-slate-900 border-b border-slate-200 pb-2">
              3. Salon Operations
            </div>
            <div className="space-y-1.5 text-slate-600">
              <div className="p-2 bg-white border border-slate-200 rounded">
                F. Admin Dashboard
              </div>
              <div className="text-center text-slate-400">⇅ Rostering</div>
              <div className="p-2 bg-white border border-slate-200 rounded">
                G. Staff Management
              </div>
              <div className="text-center text-slate-400">⇅ Credentials gate</div>
              <div className="p-2 bg-white border border-slate-200 rounded">
                L. Qualification Tracking
              </div>
              <div className="text-center text-slate-400">↓ In-salon POS</div>
              <div className="p-2 bg-white border border-slate-200 rounded">
                I. Payments & Checkout
              </div>
            </div>
          </div>

          {/* Phase 4: Finance & Compliance */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3">
            <div className="font-bold text-slate-900 border-b border-slate-200 pb-2">
              4. Finance & Governance
            </div>
            <div className="space-y-1.5 text-slate-600">
              <div className="p-2 bg-white border border-slate-200 rounded">
                J. Financial Ledger
              </div>
              <div className="text-center text-slate-400">⇅ Tier rules</div>
              <div className="p-2 bg-white border border-slate-200 rounded">
                K. Commission Engine
              </div>
              <div className="text-center text-slate-400">↓ Statutory withhold</div>
              <div className="p-2 bg-white border border-slate-200 rounded">
                N. Tax / TDS Tracking
              </div>
              <div className="text-center text-slate-400">↓ Bank transfer</div>
              <div className="p-2 bg-white border border-slate-200 rounded font-semibold text-slate-900">
                M. Bank Settlements
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
