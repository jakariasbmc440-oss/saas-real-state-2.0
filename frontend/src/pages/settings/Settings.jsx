import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RotateCcw, Building2, Sliders, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function Settings() {
  const { company, settings, updateCompany, updateSettings, resetToDemoData } = useData();

  const [companyForm, setCompanyForm] = useState({
    company_name: company.company_name || '',
    owner_name: company.owner_name || '',
    email: company.email || '',
    phone: company.phone || '',
    address: company.address || ''
  });

  const [settingsForm, setSettingsForm] = useState({
    allow_negative_stock: Boolean(settings.allow_negative_stock),
    default_timezone: settings.default_timezone || 'Asia/Dhaka',
    currency: settings.currency || 'BDT',
    currency_symbol: settings.currency_symbol || '৳',
    default_min_stock: settings.default_min_stock || 10,
    default_unit: settings.default_unit || 'Piece'
  });

  const [statusMessage, setStatusMessage] = useState(null);

  const handleSaveCompany = (e) => {
    e.preventDefault();
    updateCompany(companyForm);
    setStatusMessage('Company profile updated successfully!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setStatusMessage('Inventory & system rules saved successfully!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data back to initial seed demo values? This will reset all transactions, products, and stores.')) {
      resetToDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl flex items-center gap-3">
          <span className="p-2 rounded-xl bg-gray-100 text-gray-700">
            <SettingsIcon className="h-6 w-6" />
          </span>
          System Settings & Preferences
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure tenant profile, stock validation policies, default timezones, and seed demo reset.
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          {statusMessage}
        </div>
      )}

      {/* Section 1: Company Profile */}
      <form onSubmit={handleSaveCompany} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 space-y-5">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Building2 className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">Company Information</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              required
              value={companyForm.company_name}
              onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Owner / Contact Person</label>
            <input
              type="text"
              required
              value={companyForm.owner_name}
              onChange={(e) => setCompanyForm({ ...companyForm, owner_name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Billing Email</label>
            <input
              type="email"
              required
              value={companyForm.email}
              onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={companyForm.phone}
              onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Registered Address</label>
            <input
              type="text"
              value={companyForm.address}
              onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Profile
          </button>
        </div>
      </form>

      {/* Section 2: Inventory Rules & Validation */}
      <form onSubmit={handleSaveSettings} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 space-y-5">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Sliders className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-semibold text-gray-900">Inventory & Ledger Policies</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div>
              <p className="text-sm font-semibold text-gray-900">Strict Negative Stock Prevention</p>
              <p className="text-xs text-gray-500 mt-0.5">
                When enabled, the system automatically rejects any Stock OUT or Transfer that exceeds available balance.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!settingsForm.allow_negative_stock}
                onChange={(e) => setSettingsForm({ ...settingsForm, allow_negative_stock: !e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Default Timezone</label>
              <select
                value={settingsForm.default_timezone}
                onChange={(e) => setSettingsForm({ ...settingsForm, default_timezone: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
              >
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                <option value="UTC">UTC (GMT+0)</option>
                <option value="America/New_York">America/New York (EST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settingsForm.currency_symbol}
                onChange={(e) => setSettingsForm({ ...settingsForm, currency_symbol: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Default Minimum Stock</label>
              <input
                type="number"
                min="1"
                value={settingsForm.default_min_stock}
                onChange={(e) => setSettingsForm({ ...settingsForm, default_min_stock: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Policies
          </button>
        </div>
      </form>

      {/* Section 3: Reset Demo Database */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <RotateCcw className="h-5 w-5 text-rose-600" />
          <h2 className="text-base font-semibold text-gray-900">Reset Demo Data</h2>
        </div>
        <p className="text-sm text-gray-500">
          Restore initial seed state with "Demo Trading Ltd.", 5 catalog products, 2 stores, 4 user roles, and ledger transactions.
        </p>
        <button
          onClick={handleResetData}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Default Demo State
        </button>
      </div>
    </div>
  );
}
