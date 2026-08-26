import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Package, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { products, categories, stores, addProduct, updateProduct } = useData();

  const [formData, setFormData] = useState({
    product_name: '',
    sku: '',
    barcode: '',
    category_id: categories[0]?.category_id || '',
    unit: 'Piece',
    minimum_stock: 10,
    maximum_stock: 100,
    purchase_price: '',
    selling_price: '',
    initial_stock: '',
    store_id: stores[0]?.store_id || '',
    status: 'ACTIVE'
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const existing = products.find(p => p.product_id === id);
      if (existing) {
        setFormData({
          product_name: existing.product_name || '',
          sku: existing.sku || '',
          barcode: existing.barcode || '',
          category_id: existing.category_id || categories[0]?.category_id || '',
          unit: existing.unit || 'Piece',
          minimum_stock: existing.minimum_stock || 10,
          maximum_stock: existing.maximum_stock || 100,
          purchase_price: existing.purchase_price || '',
          selling_price: existing.selling_price || '',
          initial_stock: '',
          store_id: stores[0]?.store_id || '',
          status: existing.status || 'ACTIVE'
        });
      }
    }
  }, [id, isEditing, products, categories, stores]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (isEditing) {
        updateProduct(id, formData);
      } else {
        addProduct(formData);
      }
      navigate('/products');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save product');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing ? `Updating ${formData.product_name}` : 'Define SKU, pricing, category and minimum threshold'}
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-sm font-medium">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-base font-semibold text-gray-900">General Information</h2>
          <p className="text-xs text-gray-500">Core details describing the product item</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              placeholder="e.g. Wireless Mouse"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              SKU (Stock Keeping Unit) *
            </label>
            <input
              type="text"
              required
              disabled={isEditing}
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="e.g. WM-001"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
            >
              {categories.map(c => (
                <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Unit of Measurement
            </label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
            >
              <option value="Piece">Piece (pc)</option>
              <option value="Box">Box</option>
              <option value="Kg">Kilogram (kg)</option>
              <option value="Liter">Liter (L)</option>
              <option value="Meter">Meter (m)</option>
              <option value="Set">Set</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Barcode / EAN
            </label>
            <input
              type="text"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              placeholder="e.g. 89012345001"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="border-b border-gray-100 pb-4 pt-4">
          <h2 className="text-base font-semibold text-gray-900">Inventory & Pricing Thresholds</h2>
          <p className="text-xs text-gray-500">Stock thresholds and valuation prices</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Purchase Cost (Buy Price)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.purchase_price}
              onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
              placeholder="e.g. 350"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Selling Price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.selling_price}
              onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
              placeholder="e.g. 550"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Minimum Stock Threshold (Low-Stock Alert)
            </label>
            <input
              type="number"
              min="0"
              value={formData.minimum_stock}
              onChange={(e) => setFormData({ ...formData, minimum_stock: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Maximum Stock Level
            </label>
            <input
              type="number"
              min="0"
              value={formData.maximum_stock}
              onChange={(e) => setFormData({ ...formData, maximum_stock: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {!isEditing && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Initial Stock In (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.initial_stock}
                  onChange={(e) => setFormData({ ...formData, initial_stock: e.target.value })}
                  placeholder="e.g. 100"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Assign Initial Stock to Store
                </label>
                <select
                  value={formData.store_id}
                  onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                >
                  {stores.map(s => (
                    <option key={s.store_id} value={s.store_id}>{s.store_name}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <Link
            to="/products"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
