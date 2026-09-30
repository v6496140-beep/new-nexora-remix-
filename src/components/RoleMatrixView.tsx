import React, { useState } from 'react';
import { ROLE_DEFINITIONS } from '../data/productArchitectureData';
import { ShieldCheck, Eye, Zap, Monitor, Lock, CheckCircle2 } from 'lucide-react';

export const RoleMatrixView: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoles = ROLE_DEFINITIONS.filter((role) => {
    if (selectedRoleId !== 'all' && role.roleId !== selectedRoleId) return false;
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      role.roleName.toLowerCase().includes(q) ||
      role.whatTheyCanSee.some((s) => s.toLowerCase().includes(q)) ||
      role.whatTheyCanDo.some((d) => d.toLowerCase().includes(q)) ||
      role.mainScreens.some((m) => m.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Governance & Authorization</span>
              <span aria-hidden="true">·</span>
              <span>6 Primary User Classes</span>
              <span aria-hidden="true">·</span>
              <span>Strict Role-Based Access Control (RBAC)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Primary Users & Role-Based Access Matrix
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Defines clear authorization boundaries across unauthenticated public visitors, registered clients, salon operations personnel, business ownership, and platform governance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search permissions or screens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 w-56"
            />
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={() => setSelectedRoleId('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              selectedRoleId === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Roles (6)
          </button>
          {ROLE_DEFINITIONS.map((role) => (
            <button
              key={role.roleId}
              onClick={() => setSelectedRoleId(role.roleId)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                selectedRoleId === role.roleId
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {role.roleName}
            </button>
          ))}
        </div>
      </div>

      {/* Role Cards / Comprehensive Matrix */}
      <div className="space-y-4">
        {filteredRoles.map((role) => (
          <div
            key={role.roleId}
            className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs"
          >
            {/* Role Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded bg-slate-900 text-white font-mono text-xs font-semibold flex items-center justify-center">
                  L{role.hierarchyLevel}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{role.roleName}</h3>
                    <span className="text-xs text-slate-500 font-medium">({role.badge})</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Data Scope: <span className="text-slate-700 font-mono">{role.dataAccessScope}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>{role.complianceNotes}</span>
              </div>
            </div>

            {/* Matrix Body: 3-column breakdown */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Column 1: What they can see */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-semibold text-slate-900 pb-2 border-b border-slate-100">
                  <Eye className="w-4 h-4 text-slate-700" />
                  <span>What They Can See (Visibility)</span>
                </div>
                <ul className="space-y-2">
                  {role.whatTheyCanSee.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600 leading-relaxed">
                      <span className="text-slate-400 mt-0.5">▪</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: What they can do */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-semibold text-slate-900 pb-2 border-b border-slate-100">
                  <Zap className="w-4 h-4 text-slate-700" />
                  <span>What They Can Do (Capabilities)</span>
                </div>
                <ul className="space-y-2">
                  {role.whatTheyCanDo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Main screens they access */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-semibold text-slate-900 pb-2 border-b border-slate-100">
                  <Monitor className="w-4 h-4 text-slate-700" />
                  <span>Main Screens Accessed</span>
                </div>
                <div className="space-y-2">
                  {role.mainScreens.map((screen, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 rounded text-slate-800 font-mono text-xs flex items-center justify-between"
                    >
                      <span>{screen}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role Hierarchy Summary Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Role Hierarchy & Scope Enforcement Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-600">
                <th className="py-2.5 px-3 font-semibold">Hierarchy Level</th>
                <th className="py-2.5 px-3 font-semibold">Role Name</th>
                <th className="py-2.5 px-3 font-semibold">Tenant Isolation</th>
                <th className="py-2.5 px-3 font-semibold">Financial Visibility</th>
                <th className="py-2.5 px-3 font-semibold">Schedule Modification</th>
                <th className="py-2.5 px-3 font-semibold">Compliance / Tax Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2.5 px-3 font-mono font-medium">Level 1</td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Visitor</td>
                <td className="py-2.5 px-3">Public tenant website only</td>
                <td className="py-2.5 px-3 text-slate-400">Public pricing only</td>
                <td className="py-2.5 px-3 text-slate-400">None (Can request new booking)</td>
                <td className="py-2.5 px-3 text-slate-400">None</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-medium">Level 2</td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Customer</td>
                <td className="py-2.5 px-3">Own customer account profile</td>
                <td className="py-2.5 px-3">Personal receipts & invoices only</td>
                <td className="py-2.5 px-3">Reschedule / cancel own bookings</td>
                <td className="py-2.5 px-3 text-slate-400">Personal consent waivers</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-medium">Level 3</td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Staff</td>
                <td className="py-2.5 px-3">Assigned tenant workspace</td>
                <td className="py-2.5 px-3">Personal commissions & tips only</td>
                <td className="py-2.5 px-3">Execute assigned appointments</td>
                <td className="py-2.5 px-3">Personal license records</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-medium">Level 4</td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Manager</td>
                <td className="py-2.5 px-3">Single tenant operational scope</td>
                <td className="py-2.5 px-3">Daily register & salon shift sales</td>
                <td className="py-2.5 px-3">Full master schedule & walk-ins</td>
                <td className="py-2.5 px-3">Staff credential verification</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-medium">Level 5</td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Business Owner</td>
                <td className="py-2.5 px-3">Complete tenant ownership</td>
                <td className="py-2.5 px-3">Full P&L, bank payouts & pricing</td>
                <td className="py-2.5 px-3">Full calendar & operating rules</td>
                <td className="py-2.5 px-3">Tax / TDS, full audit trail</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-medium">Level 6</td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Platform Super Admin</td>
                <td className="py-2.5 px-3">Cross-tenant platform governance</td>
                <td className="py-2.5 px-3">Platform GMV & SaaS revenue</td>
                <td className="py-2.5 px-3 text-slate-400">Emergency override only</td>
                <td className="py-2.5 px-3">Multi-tenant SOC2 & system logs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
