import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Search, Filter, Edit2, Trash2, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function ProductList() {
  const { getAllProductsWithStock, categories, deleteProduct, settings } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const productsWithStock = getAllProductsWithStock();

  const filteredProducts = productsWithStock.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.barcode && product.barcode.includes(searchTerm));

    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesStatus = !selectedStatus || product.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Package className="h-6 w-6" />
            </span>
            Products Catalog
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product inventory definitions, SKUs, pricing, and live on-hand quantities.
          </p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name, SKU, barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 pl-9 pr-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Product Name</th>
                <th className="px-6 py-3.5">SKU / Barcode</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5 text-right">Current Stock</th>
                <th className="px-6 py-3.5 text-right">Min Stock</th>
                <th className="px-6 py-3.5 text-right">Selling Price</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.product_id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{p.product_name}</p>
                      <p className="text-xs text-gray-400 font-mono">ID: {p.product_id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {p.sku}
                      </span>
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
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {settings.currency_symbol || '৳'}{Number(p.selling_price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/products/${p.product_id}/edit`}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(`Deactivate product ${p.product_name}?`)) {
                              deleteProduct(p.product_id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-rose-600 transition-colors"
                          title="Deactivate Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
