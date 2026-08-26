import React, { useState } from 'react';
import { ArrowRightLeft, Send, CheckCircle, XCircle, Check, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function StockTransfer() {
  const { stores, products, transfers, createTransferRequest, approveTransfer, completeTransfer, cancelTransfer, getProductStock } = useData();

  const [formData, setFormData] = useState({
    from_store_id: stores[0]?.store_id || '',
    to_store_id: stores[1]?.store_id || '',
    product_id: products[0]?.product_id || '',
    quantity: '',
    note: ''
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableInSource = formData.product_id && formData.from_store_id
    ? getProductStock(formData.product_id, formData.from_store_id)
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const trf = createTransferRequest(formData);
      setStatusMessage(`Transfer request ${trf.transfer_id} created successfully! Pending approval.`);
      setFormData(prev => ({
        ...prev,
        quantity: '',
        note: ''
      }));
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit transfer request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl flex items-center gap-3">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <ArrowRightLeft className="h-6 w-6" />
          </span>
          Stock Transfers
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Transfer inventory between stores and warehouses with full lifecycle approval and ledger tracking.
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
          {statusMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Form */}
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">
              New Transfer Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Product Item *
                </label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
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
                  Source Store (From) *
                </label>
                <select
                  value={formData.from_store_id}
                  onChange={(e) => setFormData({ ...formData, from_store_id: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                >
                  {stores.map(s => (
                    <option key={s.store_id} value={s.store_id}>
                      {s.store_name} ({s.location})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Available in source: <span className="font-semibold text-gray-800">{availableInSource} units</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Destination Store (To) *
                </label>
                <select
                  value={formData.to_store_id}
                  onChange={(e) => setFormData({ ...formData, to_store_id: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
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
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g. 10"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Transfer Note
                </label>
                <textarea
                  rows="2"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Reason for transfer..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Request Transfer'}
              </button>
            </form>
          </div>
        </div>

        {/* Transfer Requests Table */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:px-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Transfer Records & Workflow</h2>
                <p className="text-xs text-gray-500">Manage pending approvals and dispatch completion</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                {transfers.length} total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3">Transfer ID</th>
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3">Route</th>
                    <th className="px-5 py-3 text-right">Qty</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transfers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                        No transfer requests recorded.
                      </td>
                    </tr>
                  ) : (
                    transfers.map((t) => (
                      <tr key={t.transfer_id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-600">
                          {t.transfer_id}
                          <p className="font-sans text-[11px] text-gray-400 font-normal">
                            {new Date(t.created_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-gray-900">
                          {t.product_name}
                          <p className="text-xs text-gray-400">By: {t.requested_by_name}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-600">
                          <span className="font-semibold text-gray-800">{t.from_store_name}</span>
                          <span className="mx-1 text-gray-400">&rarr;</span>
                          <span className="font-semibold text-indigo-600">{t.to_store_name}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-gray-900">
                          {t.quantity}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            t.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                            t.status === 'APPROVED' ? 'bg-blue-50 text-blue-700' :
                            t.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {t.status === 'PENDING' && (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => approveTransfer(t.transfer_id)}
                                className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                title="Approve Transfer"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => cancelTransfer(t.transfer_id)}
                                className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                title="Cancel Transfer"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                          {t.status === 'APPROVED' && (
                            <button
                              onClick={() => completeTransfer(t.transfer_id)}
                              className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-500 transition-colors shadow-sm"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              Complete
                            </button>
                          )}
                          {t.status === 'COMPLETED' && (
                            <span className="text-xs text-gray-400">Ledger Updated</span>
                          )}
                          {t.status === 'CANCELLED' && (
                            <span className="text-xs text-rose-400">Cancelled</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
