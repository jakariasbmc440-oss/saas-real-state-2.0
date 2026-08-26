import React, { useState } from 'react';
import { ArrowDownToLine, Save, CheckCircle2, History } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function StockIn() {
  const { stores, products, suppliers, recordStockIn, transactions } = useData();

  const [formData, setFormData] = useState({
    store_id: stores[0]?.store_id || '',
    product_id: products[0]?.product_id || '',
    quantity: '',
    supplier_id: suppliers[0]?.supplier_id || '',
    reference_id: '',
    note: ''
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const txn = recordStockIn(formData);
      setStatusMessage(`Stock In recorded successfully! Added ${txn.quantity} units to inventory.`);
      setFormData(prev => ({
        ...prev,
        quantity: '',
        reference_id: '',
        note: ''
      }));
    } catch (err) {
      setErrorMessage(err.message || 'Failed to record Stock In');
    } finally {
      setIsSubmitting(false);
    }
  };

  const recentStockIns = transactions
    .filter(t => t.type === 'IN' || t.type === 'ADJUSTMENT_IN' || t.type === 'TRANSFER_IN')
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownToLine className="h-6 w-6" />
            </span>
            Stock In — Receive Inventory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Record newly procured or adjusted stock. Inventory balances update immediately in the ledger.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="font-medium">{statusMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock In Form */}
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">
              Receive Goods
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Destination Store / Warehouse *
                </label>
                <select
                  value={formData.store_id}
                  onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                >
                  {stores.map(s => (
                    <option key={s.store_id} value={s.store_id}>
                      {s.store_name} ({s.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Product Item *
                </label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                >
                  {products.map(p => (
                    <option key={p.product_id} value={p.product_id}>
                      {p.product_name} (SKU: {p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Quantity to Receive *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g. 50"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Supplier / Vendor
                </label>
                <select
                  value={formData.supplier_id}
                  onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                >
                  <option value="">None / Internal</option>
                  {suppliers.map(sup => (
                    <option key={sup.supplier_id} value={sup.supplier_id}>
                      {sup.supplier_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Reference / Invoice #
                </label>
                <input
                  type="text"
                  value={formData.reference_id}
                  onChange={(e) => setFormData({ ...formData, reference_id: e.target.value })}
                  placeholder="e.g. INV-2026-001"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Note / Remarks
                </label>
                <textarea
                  rows="2"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Batch number, condition, etc."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Recording...' : 'Record Stock In'}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Stock In Table */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:px-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Recent Receipts</h2>
                <p className="text-xs text-gray-500">History of incoming inventory ledger entries</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                {recentStockIns.length} recorded
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3">Date & Time</th>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Store</th>
                    <th className="px-6 py-3 text-right">Quantity</th>
                    <th className="px-6 py-3">Received By</th>
                    <th className="px-6 py-3">Ref ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentStockIns.map((item) => {
                    const product = products.find(p => p.product_id === item.product_id);
                    const store = stores.find(s => s.store_id === item.store_id);
                    return (
                      <tr key={item.transaction_id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-3.5 text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="px-6 py-3.5 font-medium text-gray-900">
                          {product ? product.product_name : item.product_id}
                        </td>
                        <td className="px-6 py-3.5 text-gray-600">
                          {store ? store.store_name : item.store_id}
                        </td>
                        <td className="px-6 py-3.5 text-right font-bold text-emerald-600">
                          +{item.quantity}
                        </td>
                        <td className="px-6 py-3.5 text-gray-600">
                          {item.user_name || 'Admin'}
                        </td>
                        <td className="px-6 py-3.5 text-xs font-mono text-gray-400">
                          {item.reference_id || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
