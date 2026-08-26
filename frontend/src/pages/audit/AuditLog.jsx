import React, { useState } from 'react';
import { Shield, Search, Filter, Lock, Terminal, Activity } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function AuditLog() {
  const { auditLogs } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesModule = !selectedModule || log.module === selectedModule;
    const matchesAction = !selectedAction || log.action === selectedAction;
    const matchesSearch = !searchTerm ||
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.record_id && log.record_id.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesModule && matchesAction && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl flex items-center gap-3">
          <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <Shield className="h-6 w-6" />
          </span>
          Security Audit Trail
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Append-only immutable record of all logins, stock operations, transfers, and entity updates.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit details, staff, record ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 pl-9 pr-4 py-2 text-sm focus:border-slate-500 focus:ring-slate-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-500 focus:ring-slate-500 bg-white"
          >
            <option value="">All Modules</option>
            <option value="STOCK">Stock Ledger</option>
            <option value="TRANSFER">Transfers</option>
            <option value="PRODUCT">Products</option>
            <option value="CATEGORY">Categories</option>
            <option value="STORE">Stores</option>
            <option value="USER">User Management</option>
            <option value="SUPPLIER">Suppliers</option>
            <option value="AUTH">Authentication</option>
            <option value="SETTINGS">System Settings</option>
          </select>

          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-500 focus:ring-slate-500 bg-white"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="STOCK_IN">STOCK_IN</option>
            <option value="STOCK_OUT">STOCK_OUT</option>
            <option value="TRANSFER_REQUEST">TRANSFER_REQUEST</option>
            <option value="TRANSFER_APPROVE">TRANSFER_APPROVE</option>
            <option value="TRANSFER_COMPLETE">TRANSFER_COMPLETE</option>
            <option value="CREATE_PRODUCT">CREATE_PRODUCT</option>
            <option value="UPDATE_PRODUCT">UPDATE_PRODUCT</option>
            <option value="CREATE_STORE">CREATE_STORE</option>
            <option value="CREATE_USER">CREATE_USER</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Action</th>
                <th className="px-6 py-3.5">Module</th>
                <th className="px-6 py-3.5">Staff / User</th>
                <th className="px-6 py-3.5">Record ID</th>
                <th className="px-6 py-3.5">Operation Details</th>
                <th className="px-6 py-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                    No audit logs match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.log_id} className="hover:bg-gray-50/50 font-mono text-xs">
                    <td className="px-6 py-3.5 text-gray-500 font-sans">
                      {new Date(log.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600 font-sans font-semibold">
                      {log.module}
                    </td>
                    <td className="px-6 py-3.5 text-gray-900 font-sans font-medium">
                      {log.user_name}
                    </td>
                    <td className="px-6 py-3.5 text-blue-600">
                      {log.record_id || '—'}
                    </td>
                    <td className="px-6 py-3.5 text-gray-700 font-sans max-w-md truncate">
                      {log.details || '—'}
                    </td>
                    <td className="px-6 py-3.5 text-gray-400">
                      {log.ip || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
