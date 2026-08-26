import React, { useState } from 'react';
import { Store, Plus, MapPin, User, Package, Archive, Edit2, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function StoreList() {
  const { stores, addStore, updateStore, getAllProductsWithStock } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({ store_name: '', location: '', manager_name: '', status: 'ACTIVE' });

  const handleOpenAdd = () => {
    setEditingStore(null);
    setFormData({ store_name: '', location: '', manager_name: '', status: 'ACTIVE' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (st) => {
    setEditingStore(st);
    setFormData({ store_name: st.store_name, location: st.location || '', manager_name: st.manager_name || '', status: st.status || 'ACTIVE' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStore) {
      updateStore(editingStore.store_id, formData);
    } else {
      addStore(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl flex items-center gap-3">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Store className="h-6 w-6" />
            </span>
            Stores & Warehouses
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your retail branches, physical storefronts, and storage warehouses.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Store
        </button>
      </div>

      {/* Store Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => {
          const storeStock = getAllProductsWithStock(store.store_id);
          const totalUnits = storeStock.reduce((sum, p) => sum + Math.max(0, p.current_stock), 0);
          const activeItemsCount = storeStock.filter(p => p.current_stock > 0).length;

          return (
            <div key={store.store_id} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                      <Store className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{store.store_name}</h2>
                      <p className="text-xs text-gray-400 font-mono">ID: {store.store_id}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    store.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {store.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{store.location || 'Address not specified'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Manager: <strong className="text-gray-900">{store.manager_name || 'Unassigned'}</strong></span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-center">
                <div className="p-2 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500 uppercase font-semibold">SKUs Stocked</p>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">{activeItemsCount}</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Total Units</p>
                  <p className="text-lg font-bold text-purple-600 mt-0.5">{Number(totalUnits).toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleOpenEdit(store)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-500"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit Store Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {editingStore ? 'Edit Store' : 'Add Store / Warehouse'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Store / Warehouse Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.store_name}
                  onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                  placeholder="e.g. Uttara Branch"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Location / Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Sector 4, Uttara, Dhaka"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Assigned Store Manager
                </label>
                <input
                  type="text"
                  value={formData.manager_name}
                  onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                  placeholder="e.g. Rahim Khan"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Save Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
