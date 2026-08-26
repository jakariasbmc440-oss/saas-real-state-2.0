import React, { useState } from 'react';
import { Archive, Download, Filter, Search, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function InventoryList() {
  const { getAllProductsWithStock, stores, settings } = useData();
  const [selectedStore, setSelectedStore] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const productsWithStock = getAllProductsWithStock(selectedStore || null);

  const filteredProducts = productsWithStock.filter(p => {
    const matchesSearch = p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesTab = true;
    if (activeTab === 'LOW') matchesTab = p.stock_status === 'Low Stock';
    if (activeTab === 'OUT') matchesTab = p.stock_status === 'Out of Stock';

    return matchesSearch && matchesTab;
  });

  const totalUnits = filteredProducts.reduce((sum, p) => sum + Math.max(0, p.current_stock), 0);
  const totalValuation = filteredProducts.reduce((sum, p) => sum + p.valuation, 0);

  const exportCSV = () => {
    const headers = ['Product Name', 'SKU', 'Category', 'Current Stock', 'Unit', 'Min Stock', 'Purchase Cost', 'Valuation', 'Stock Status'];
    const rows = filteredProducts.map(p => [
      `"${p.product_name}"`,
      `"${p.sku}"`,
      `"${p.category_name}"`,
      p.current_stock,
      p.unit,
      p.minimum_stock,
      p.purchase_price,
      p.valuation,
      `"${p.stock_status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventory_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Archive className="h-6 w-6" />
            </span>
            Current Inventory & Balances
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time on-hand quantities dynamically computed from the immutable stock transaction ledger.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Download className="h-4 w-4 text-gray-500" />
          Export CSV
        </button>
      </div>

      {/* Valuation & Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Filtered Items</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{filteredProducts.length}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Units in Stock</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{Number(totalUnits).toLocaleString()} units</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Stock Valuation (Cost)</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {settings.currency_symbol || '৳'}{Number(totalValuation).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'ALL' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Inventory
          </button>
          <button
            onClick={() => setActiveTab('LOW')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'LOW' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Low Stock
          </button>
          <button
            onClick={() => setActiveTab('OUT')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'OUT' ? 'bg-rose-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <XCircle className="h-3.5 w-3.5" />
            Out of Stock
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
          >
            <option value="">All Stores & Warehouses</option>
            {stores.map(s => (
              <option key={s.store_id} value={s.store_id}>{s.store_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Product & SKU</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5 text-right">On-Hand Stock</th>
                <th className="px-6 py-3.5 text-right">Min Threshold</th>
                <th className="px-6 py-3.5 text-right">Unit Cost</th>
                <th className="px-6 py-3.5 text-right">Total Valuation</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                    No inventory records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.product_id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{p.product_name}</p>
                      <p className="font-mono text-xs text-gray-400">{p.sku}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {p.category_name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        p.stock_status === 'In Stock' ? 'bg-emerald-50 text-emerald-700' :
                        p.stock_status === 'Low Stock' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {p.current_stock} {p.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {p.minimum_stock} {p.unit}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {settings.currency_symbol || '৳'}{Number(p.purchase_price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      {settings.currency_symbol || '৳'}{Number(p.valuation).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        p.stock_status === 'In Stock' ? 'bg-emerald-50 text-emerald-700' :
                        p.stock_status === 'Low Stock' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {p.stock_status === 'In Stock' && <CheckCircle2 className="h-3 w-3" />}
                        {p.stock_status === 'Low Stock' && <AlertTriangle className="h-3 w-3" />}
                        {p.stock_status === 'Out of Stock' && <XCircle className="h-3 w-3" />}
                        {p.stock_status}
                      </span>
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
