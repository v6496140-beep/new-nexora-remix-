import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Building, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  AlertTriangle,
  RefreshCw,
  Lock,
  Layers,
  Database
} from 'lucide-react';
import { auditLogService } from '../../../services/auditLogService';
import { AuditLogEntry, AuditAction } from '../../../types/audit';
import { UserRole } from '../../../types';
import { UserSession } from '../../../services/authContext';

export function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<AuditAction | 'all'>('all');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Super Admin session context for accessing the audit log service
  const superAdminSession: UserSession = {
    userId: 'usr-super-1',
    name: 'Rajnish Sharma',
    email: 'rajnish@nexora.io',
    phone: '+91 99999 00000',
    role: 'SUPER_ADMIN',
    token: 'sim_jwt_token',
    expiresAt: Date.now() + 3600000
  };

  const logs: AuditLogEntry[] = useMemo(() => {
    return auditLogService.getAuditLogs(superAdminSession, {
      searchTerm,
      action: selectedAction,
      role: selectedRole,
      dateRange
    });
  }, [searchTerm, selectedAction, selectedRole, dateRange]);

  const toggleExpand = (id: string) => {
    setExpandedLogId(prev => prev === id ? null : id);
  };

  const getActionBadge = (action: AuditAction) => {
    switch (action) {
      case 'BUSINESS_VERIFICATION':
        return <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-[10px] font-black uppercase tracking-wider">VERIFIED</span>;
      case 'BUSINESS_SUSPENSION':
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-black uppercase tracking-wider">SUSPENSION</span>;
      case 'SERVICE_PRICE_CHANGE':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-black uppercase tracking-wider">PRICE CHANGE</span>;
      case 'BOOKING_STATUS_CHANGE':
        return <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-black uppercase tracking-wider">BOOKING STATUS</span>;
      case 'WEBSITE_PUBLISH':
        return <span className="px-2.5 py-1 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-lg text-[10px] font-black uppercase tracking-wider">SITE PUBLISH</span>;
      case 'WITHDRAWAL_ACTION':
        return <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-black uppercase tracking-wider">WITHDRAWAL</span>;
      case 'SETTINGS_CHANGE':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-wider">SETTINGS</span>;
      case 'PERMISSION_CHANGE':
        return <span className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg text-[10px] font-black uppercase tracking-wider">PERMISSION</span>;
      case 'PAYMENT_ADMIN_ACTION':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-black uppercase tracking-wider">PAYMENT ACTION</span>;
      case 'LOGIN':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-black uppercase tracking-wider">LOGIN</span>;
      case 'LOGOUT':
        return <span className="px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-wider">LOGOUT</span>;
      case 'STAFF_CHANGE':
        return <span className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg text-[10px] font-black uppercase tracking-wider">STAFF CHANGE</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-wider">{action}</span>;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 uppercase">SUPER ADMIN</span>;
      case 'BUSINESS_OWNER':
        return <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase">OWNER</span>;
      case 'MANAGER':
        return <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase">MANAGER</span>;
      case 'STAFF':
        return <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 uppercase">STAFF</span>;
      case 'CUSTOMER':
        return <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase">CUSTOMER</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-display">System Audit Logs</h1>
            <span className="flex items-center gap-1 text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              <Lock className="w-3 h-3" /> Immutable Ledger
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Non-repudiation audit trail tracking critical security, authorization, financial, and operational mutations.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Events</span>
            <span className="text-xl font-black text-slate-800">{logs.length}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Security Actions</span>
            <span className="text-xl font-black text-rose-600">
              {logs.filter(l => ['BUSINESS_SUSPENSION', 'PERMISSION_CHANGE', 'PAYMENT_ADMIN_ACTION'].includes(l.action)).length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by user, email, action, entity, or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none text-sm font-medium transition-all"
            />
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value as any)}
              className="border-2 border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:border-indigo-500 outline-none cursor-pointer bg-white"
            >
              <option value="all">All Actions</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="PERMISSION_CHANGE">Permission Change</option>
              <option value="BUSINESS_VERIFICATION">Business Verification</option>
              <option value="BUSINESS_SUSPENSION">Business Suspension</option>
              <option value="STAFF_CHANGE">Staff Change</option>
              <option value="SERVICE_PRICE_CHANGE">Service Price Change</option>
              <option value="BOOKING_STATUS_CHANGE">Booking Status Change</option>
              <option value="WEBSITE_PUBLISH">Website Publish</option>
              <option value="PAYMENT_ADMIN_ACTION">Payment Admin Action</option>
              <option value="WITHDRAWAL_ACTION">Withdrawal Action</option>
              <option value="SETTINGS_CHANGE">Settings Change</option>
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="border-2 border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:border-indigo-500 outline-none cursor-pointer bg-white"
            >
              <option value="all">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="BUSINESS_OWNER">Business Owner</option>
              <option value="MANAGER">Manager</option>
              <option value="STAFF">Staff</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="border-2 border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:border-indigo-500 outline-none cursor-pointer bg-white"
            >
              <option value="all">All Time</option>
              <option value="today">Past 24 Hours</option>
              <option value="7days">Past 7 Days</option>
              <option value="30days">Past 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity</th>
                <th className="p-4">Business</th>
                <th className="p-4">Date / Time</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-slate-50/70 transition-colors">
                      {/* User */}
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-slate-700">
                            {log.user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{log.user.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {getRoleBadge(log.role)}
                              <span className="text-[10px] text-slate-400 font-mono">{log.user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="p-4 whitespace-nowrap">
                        {getActionBadge(log.action)}
                      </td>

                      {/* Entity */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800 text-xs">{log.entity}</div>
                        <div className="text-[10px] font-mono text-slate-400">{log.entityId}</div>
                      </td>

                      {/* Business */}
                      <td className="p-4">
                        {log.businessName ? (
                          <div>
                            <div className="font-semibold text-slate-800 text-xs">{log.businessName}</div>
                            <div className="text-[10px] font-mono text-indigo-500">{log.businessId}</div>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400 italic">Platform Level</span>
                        )}
                      </td>

                      {/* Date / Time */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-slate-700">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </td>

                      {/* Details toggle */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggleExpand(log.id)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 text-xs font-bold transition-all inline-flex items-center gap-1"
                        >
                          {isExpanded ? 'Hide' : 'Inspect'}
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Metadata Inspection Drawer */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70">
                        <td colSpan={6} className="p-4 pl-12 border-b border-slate-100">
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex justify-between items-center border-b pb-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Database className="w-3 h-3 text-indigo-500" />
                                Audit Entry Payload & Client Metadata
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                IP: {log.ipAddress || '127.0.0.1'} • Event ID: {log.id}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">State Context & Parameters</h4>
                                <pre className="text-xs font-mono bg-slate-900 text-emerald-400 p-3 rounded-lg overflow-x-auto max-h-48 leading-relaxed">
                                  {JSON.stringify(log.metadata || {}, null, 2)}
                                </pre>
                              </div>

                              <div className="space-y-2 text-xs">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Security & Non-Repudiation</h4>
                                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                                  <div className="text-[11px] text-slate-600">
                                    <span className="font-bold">Authorized Actor:</span> {log.user.name} ({log.user.email})
                                  </div>
                                  <div className="text-[11px] text-slate-600">
                                    <span className="font-bold">Enforced Role:</span> {log.role}
                                  </div>
                                  <div className="text-[11px] text-slate-600">
                                    <span className="font-bold">Target Entity:</span> {log.entity} #{log.entityId}
                                  </div>
                                  <div className="text-[11px] text-slate-600">
                                    <span className="font-bold">Immutable Timestamp:</span> {log.timestamp}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {logs.length === 0 && (
            <div className="p-12 text-center space-y-2">
              <Clock className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-bold text-sm">No audit records match the current filters.</p>
              <p className="text-slate-400 text-xs">Try adjusting your search criteria or date range.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
