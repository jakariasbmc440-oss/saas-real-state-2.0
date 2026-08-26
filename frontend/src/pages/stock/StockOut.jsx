import React, { useState } from 'react';
import { ArrowUpFromLine, Save, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function StockOut() {
  const { stores, products, recordStockOut, getProductStock, transactions, settings } = useData();

  const [formData, setFormData] = useState({
    store_id: stores[0]?.store_id || '',
    product_id: products[0]?.product_id || '',
    quantity: '',
    purpose: 'Sales Order',
    taken_by: '',
    note: ''
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live stock balance computation for selected product and store
  const availableStock = formData.product_id && formData.store_id 
    ? getProductStock(formData.product_id, formData.store_id) 
    : 0;

  const isExceedingStock = Number(formData.quantity) > availableStock;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const txn = recordStockOut(formData);
      setStatusMessage(`Stock Out successfully recorded! Dispatched ${txn.quantity} units.`);
      setFormData(prev => ({
        ...prev,
        quantity: '',
        taken_by: '',
        note: ''
      }));
    } catch (err) {
      setErrorMessage(err.message || 'Stock Out rejected.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const recentStockOuts = transactions
    .filter(t => t.type === 'OUT' || t.type === 'ADJUSTMENT_OUT' || t.type === 'TRANSFER_OUT')
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl flex items-center gap-3">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ArrowUpFromLine className="h-6 w-6" />
            </span>
            Stock Out — Issue Inventory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Issue inventory for sales, office usage, or customer deliveries. Enforces strict availability checks.
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
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Container */}
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">
              Dispatch Item
            </h2>

            {/* Live Stock Level Indicator */}
            <div className={`p-4 rounded-xl mb-5 flex items-center justify-between border ${
              availableStock > 10 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                : availableStock > 0 
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
            }`}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Available in Selected Store</p>
                <p className="text-2xl font-black mt-0.5">{availableStock} <span className="text-xs font-normal">units</span></p>
              </div>
              {availableStock <= 0 ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                  Out of Stock
                </span>
              ) : availableStock <= 10 ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Low Stock
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  In Stock
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Source Store / Warehouse *
                </label>
                <select
                  value={formData.store_id}
                  onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-rose-500 bg-white"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-rose-500 bg-white"
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
                  Quantity to Issue *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g. 5"
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-rose-500 ${
                    isExceedingStock && !settings.allow_negative_stock
                      ? 'border-rose-500 bg-rose-50/30 text-rose-900 focus:border-rose-500'
                      : 'border-gray-300 focus:border-rose-500'
                  }`}
                />
                {isExceedingStock && !settings.allow_negative_stock && (
                  <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Requested quantity exceeds available stock ({availableStock} units).
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Purpose / Reason *
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-rose-500 bg-white"
                >
                  <option value="Sales Order">Sales Order / Dispatch</option>
                  <option value="Office Use">Office & Staff Deployment</option>
                  <option value="Client Demo">Client Demo / Exhibition</option>
                  <option value="Damage / Loss">Damage / Defective Write-off</option>
                  <option value="Customer Return">Return / Replacement</option>
                  <option value="Other">Other Purpose</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Taken By / Issued To *
                </label>
                <input
                  type="text"
                  required
                  value={formData.taken_by}
                  onChange={(e) => setFormData({ ...formData, taken_by: e.target.value })}
                  placeholder="e.g. Rahim Khan"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-rose-500"
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
                  placeholder="Department, client name, etc."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-rose-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || (isExceedingStock && !settings.allow_negative_stock)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Recording...' : 'Record Stock Out'}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Stock Out History */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:px-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Recent Dispatches</h2>
                <p className="text-xs text-gray-500">History of items issued and who took them</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                {recentStockOuts.length} recorded
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
                    <th className="px-6 py-3">Taken By</th>
                    <th className="px-6 py-3">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentStockOuts.map((item) => {
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
                        <td className="px-6 py-3.5 text-right font-bold text-rose-600">
                          -{item.quantity}
                        </td>
                        <td className="px-6 py-3.5 font-medium text-gray-900">
                          {item.user_name || 'Staff'}
                        </td>
                        <td className="px-6 py-3.5 text-xs text-gray-500">
                          {item.purpose || 'General'}
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
