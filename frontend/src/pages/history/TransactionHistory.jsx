import React, { useState } from 'react';
import { History, Download, Filter, Search, ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function TransactionHistory() {
  const { transactions, products, stores, users } = useData();

  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(t => {
    const product = products.find(p => p.product_id === t.product_id);
    const store = stores.find(s => s.store_id === t.store_id);

    const matchesProduct = !selectedProduct || t.product_id === selectedProduct;
    const matchesStore = !selectedStore || t.store_id === selectedStore;
    const matchesUser = !selectedUser || t.user_id === selectedUser || t.user_name === selectedUser;
    const matchesType = !selectedType || t.type === selectedType;

    const txnDate = (t.created_at || '').substring(0, 10);
    const matchesStart = !startDate || txnDate >= startDate;
    const matchesEnd = !endDate || txnDate <= endDate;

    const matchesSearch = !searchTerm ||
      (t.reference_id && t.reference_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.purpose && t.purpose.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.user_name && t.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product && product.product_name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesProduct && matchesStore && matchesUser && matchesType && matchesStart && matchesEnd && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['Date & Time', 'Transaction ID', 'Type', 'Product', 'Store', 'Quantity', 'User', 'Purpose', 'Ref ID', 'Note'];
    const rows = filteredTransactions.map(t => {
      const p = products.find(prod => prod.product_id === t.product_id);
      const s = stores.find(st => st.store_id === t.store_id);
      return [
        `"${t.created_at}"`,
        `"${t.transaction_id}"`,
        `"${t.type}"`,
        `"${p ? p.product_name : t.product_id}"`,
        `"${s ? s.store_name : t.store_id}"`,
        t.quantity,
        `"${t.user_name || ''}"`,
        `"${t.purpose || ''}"`,
        `"${t.reference_id || ''}"`,
        `"${(t.note || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `stock_transactions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl flex items-center gap-3">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <History className="h-6 w-6" />
            </span>
            Transaction Ledger History
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete audit of every Stock IN, OUT, Transfer, and Adjustment with exact timestamps, staff names, and purposes.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Download className="h-4 w-4 text-gray-500" />
          Export Ledger (CSV)
        </button>
      </div>

      {/* Rich Multi-Dimensional Filter Bar */}
      <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Filter by Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500 bg-white"
            >
              <option value="">All Products</option>
              {products.map(p => (
                <option key={p.product_id} value={p.product_id}>{p.product_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Filter by Store</label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500 bg-white"
            >
              <option value="">All Stores</option>
              {stores.map(s => (
                <option key={s.store_id} value={s.store_id}>{s.store_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Transaction Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500 bg-white"
            >
              <option value="">All Types</option>
              <option value="IN">Stock IN (Receive)</option>
              <option value="OUT">Stock OUT (Issue)</option>
              <option value="TRANSFER_IN">Transfer IN</option>
              <option value="TRANSFER_OUT">Transfer OUT</option>
              <option value="ADJUSTMENT_IN">Adjustment IN</option>
              <option value="ADJUSTMENT_OUT">Adjustment OUT</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Staff / User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500 bg-white"
            >
              <option value="">All Staff</option>
              {users.map(u => (
                <option key={u.user_id} value={u.user_id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Search Keywords</label>
            <div className="relative">
              <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reference, note, purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-1.5 text-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">
            Showing {filteredTransactions.length} transaction entries
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Date & Exact Time</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">Store</th>
                <th className="px-6 py-3.5 text-right">Quantity</th>
                <th className="px-6 py-3.5">Staff / User</th>
                <th className="px-6 py-3.5">Purpose / Ref</th>
                <th className="px-6 py-3.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => {
                  const product = products.find(p => p.product_id === t.product_id);
                  const store = stores.find(s => s.store_id === t.store_id);
                  const isIn = t.type.includes('IN');

                  return (
                    <tr key={t.transaction_id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-xs font-medium text-gray-600">
                        {new Date(t.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          isIn ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {isIn ? <ArrowDownToLine className="h-3 w-3" /> : <ArrowUpFromLine className="h-3 w-3" />}
                          {t.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {product ? product.product_name : t.product_id}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {store ? store.store_name : t.store_id}
                      </td>
                      <td className={`px-6 py-4 text-right font-black ${
                        isIn ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {isIn ? `+${t.quantity}` : `-${t.quantity}`}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {t.user_name || 'Admin'}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        <p className="font-semibold text-gray-800">{t.purpose || 'General'}</p>
                        {t.reference_id && <p className="font-mono text-gray-400">Ref: {t.reference_id}</p>}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                        {t.note || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
