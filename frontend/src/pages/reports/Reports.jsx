import React, { useState } from 'react';
import { 
  FileBarChart, Download, Printer, Calendar, Archive, ArrowDownToLine, 
  ArrowUpFromLine, Users, AlertTriangle, Filter
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function Reports() {
  const { getAllProductsWithStock, transactions, users, stores, settings } = useData();
  const [reportType, setReportType] = useState('CURRENT_STOCK');
  const [selectedStore, setSelectedStore] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const productsWithStock = getAllProductsWithStock(selectedStore || null);

  // 1. Current Stock Data
  const stockReportData = productsWithStock;

  // 2. Stock IN Data
  const stockInData = transactions.filter(t => {
    const isType = t.type === 'IN' || t.type === 'ADJUSTMENT_IN' || t.type === 'TRANSFER_IN';
    const matchesStore = !selectedStore || t.store_id === selectedStore;
    const txnDate = (t.created_at || '').substring(0, 10);
    const matchesStart = !startDate || txnDate >= startDate;
    const matchesEnd = !endDate || txnDate <= endDate;
    return isType && matchesStore && matchesStart && matchesEnd;
  });

  // 3. Stock OUT Data
  const stockOutData = transactions.filter(t => {
    const isType = t.type === 'OUT' || t.type === 'ADJUSTMENT_OUT' || t.type === 'TRANSFER_OUT';
    const matchesStore = !selectedStore || t.store_id === selectedStore;
    const txnDate = (t.created_at || '').substring(0, 10);
    const matchesStart = !startDate || txnDate >= startDate;
    const matchesEnd = !endDate || txnDate <= endDate;
    return isType && matchesStore && matchesStart && matchesEnd;
  });

  // 4. Employee Activity Data
  const employeeActivityData = users.map(u => {
    const userTxns = transactions.filter(t => t.user_id === u.user_id || t.user_name === u.name);
    const totalIn = userTxns
      .filter(t => t.type.includes('IN'))
      .reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);
    const totalOut = userTxns
      .filter(t => t.type.includes('OUT'))
      .reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);
    const lastTxn = [...userTxns].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    return {
      ...u,
      total_in: totalIn,
      total_out: totalOut,
      total_txns: userTxns.length,
      last_activity: lastTxn ? lastTxn.created_at : null
    };
  });

  // 5. Low Stock Data
  const lowStockData = productsWithStock.filter(p => p.stock_status === 'Low Stock' || p.stock_status === 'Out of Stock');

  const handleExportCSV = () => {
    let headers = [];
    let rows = [];
    let filename = `report_${reportType.toLowerCase()}_${new Date().toISOString().slice(0,10)}.csv`;

    if (reportType === 'CURRENT_STOCK') {
      headers = ['Product', 'SKU', 'Category', 'Current Stock', 'Unit', 'Min Stock', 'Unit Cost', 'Valuation', 'Status'];
      rows = stockReportData.map(p => [
        `"${p.product_name}"`, `"${p.sku}"`, `"${p.category_name}"`, p.current_stock, p.unit, p.minimum_stock, p.purchase_price, p.valuation, `"${p.stock_status}"`
      ]);
    } else if (reportType === 'STOCK_IN') {
      headers = ['Date & Time', 'Transaction ID', 'Product', 'Store', 'Quantity', 'Received By', 'Reference', 'Note'];
      rows = stockInData.map(t => {
        const prod = productsWithStock.find(p => p.product_id === t.product_id);
        const st = stores.find(s => s.store_id === t.store_id);
        return [
          `"${t.created_at}"`, `"${t.transaction_id}"`, `"${prod ? prod.product_name : t.product_id}"`, `"${st ? st.store_name : t.store_id}"`, t.quantity, `"${t.user_name || ''}"`, `"${t.reference_id || ''}"`, `"${t.note || ''}"`
        ];
      });
    } else if (reportType === 'STOCK_OUT') {
      headers = ['Date & Time', 'Transaction ID', 'Product', 'Store', 'Quantity', 'Taken By', 'Purpose', 'Note'];
      rows = stockOutData.map(t => {
        const prod = productsWithStock.find(p => p.product_id === t.product_id);
        const st = stores.find(s => s.store_id === t.store_id);
        return [
          `"${t.created_at}"`, `"${t.transaction_id}"`, `"${prod ? prod.product_name : t.product_id}"`, `"${st ? st.store_name : t.store_id}"`, t.quantity, `"${t.user_name || ''}"`, `"${t.purpose || ''}"`, `"${t.note || ''}"`
        ];
      });
    } else if (reportType === 'EMPLOYEE_ACTIVITY') {
      headers = ['Employee Name', 'Role', 'Email', 'Total Received (IN)', 'Total Issued (OUT)', 'Transactions Count', 'Last Activity'];
      rows = employeeActivityData.map(e => [
        `"${e.name}"`, `"${e.role}"`, `"${e.email}"`, e.total_in, e.total_out, e.total_txns, `"${e.last_activity || 'Never'}"`
      ]);
    } else if (reportType === 'LOW_STOCK') {
      headers = ['Product Name', 'SKU', 'Current Stock', 'Minimum Required', 'Shortage', 'Status'];
      rows = lowStockData.map(p => [
        `"${p.product_name}"`, `"${p.sku}"`, p.current_stock, p.minimum_stock, p.shortage, `"${p.stock_status}"`
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FileBarChart className="h-6 w-6" />
            </span>
            Inventory & Management Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate and export ledger insights, audit summaries, stock movements, and employee activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Printer className="h-4 w-4 text-gray-500" />
            Print Report
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Report Type Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { id: 'CURRENT_STOCK', label: 'Current Stock', icon: Archive, desc: 'On-hand balances & valuation' },
          { id: 'STOCK_IN', label: 'Stock IN Report', icon: ArrowDownToLine, desc: 'Goods receipts & vendor shipments' },
          { id: 'STOCK_OUT', label: 'Stock OUT Report', icon: ArrowUpFromLine, desc: 'Dispatches & who took what' },
          { id: 'EMPLOYEE_ACTIVITY', label: 'Staff Activity', icon: Users, desc: 'Operations per staff member' },
          { id: 'LOW_STOCK', label: 'Low Stock Alert', icon: AlertTriangle, desc: 'Deficits below threshold' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
              reportType === tab.id
                ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500'
                : 'bg-white border-gray-100 hover:border-gray-300'
            }`}
          >
            <div className={`p-2 rounded-lg w-fit mb-3 ${
              reportType === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              <tab.icon className="h-5 w-5" />
            </div>
            <div>
              <p className={`text-sm font-bold ${reportType === tab.id ? 'text-blue-900' : 'text-gray-900'}`}>{tab.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{tab.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Report Filter Bar */}
      <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 flex flex-wrap items-center gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Store Filter</label>
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

        {(reportType === 'STOCK_IN' || reportType === 'STOCK_OUT') && (
          <>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>

      {/* Dynamic Report Table Output */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            {reportType === 'CURRENT_STOCK' && 'Current Stock & Valuation Summary'}
            {reportType === 'STOCK_IN' && 'Stock IN / Receipts Log'}
            {reportType === 'STOCK_OUT' && 'Stock OUT / Dispatches Log'}
            {reportType === 'EMPLOYEE_ACTIVITY' && 'Employee Operations Summary'}
            {reportType === 'LOW_STOCK' && 'Low Stock & Shortage Deficits'}
          </h2>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'CURRENT_STOCK' && (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">SKU</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5 text-right">Current Stock</th>
                  <th className="px-6 py-3.5 text-right">Min Stock</th>
                  <th className="px-6 py-3.5 text-right">Unit Cost</th>
                  <th className="px-6 py-3.5 text-right">Total Valuation</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stockReportData.map(p => (
                  <tr key={p.product_id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{p.product_name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.sku}</td>
                    <td className="px-6 py-4 text-gray-600">{p.category_name}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{p.current_stock} {p.unit}</td>
                    <td className="px-6 py-4 text-right text-gray-500">{p.minimum_stock} {p.unit}</td>
                    <td className="px-6 py-4 text-right text-gray-600">{settings.currency_symbol || '৳'}{Number(p.purchase_price).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-indigo-600">{settings.currency_symbol || '৳'}{Number(p.valuation).toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        p.stock_status === 'In Stock' ? 'bg-emerald-50 text-emerald-700' :
                        p.stock_status === 'Low Stock' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {p.stock_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'STOCK_IN' && (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Store</th>
                  <th className="px-6 py-3.5 text-right">Quantity Received</th>
                  <th className="px-6 py-3.5">Received By</th>
                  <th className="px-6 py-3.5">Reference ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stockInData.map(t => {
                  const prod = productsWithStock.find(p => p.product_id === t.product_id);
                  const st = stores.find(s => s.store_id === t.store_id);
                  return (
                    <tr key={t.transaction_id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-xs text-gray-500">{new Date(t.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{prod ? prod.product_name : t.product_id}</td>
                      <td className="px-6 py-4 text-gray-600">{st ? st.store_name : t.store_id}</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">+{t.quantity}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{t.user_name || 'Admin'}</td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">{t.reference_id || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {reportType === 'STOCK_OUT' && (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Store</th>
                  <th className="px-6 py-3.5 text-right">Quantity Issued</th>
                  <th className="px-6 py-3.5">Taken By</th>
                  <th className="px-6 py-3.5">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stockOutData.map(t => {
                  const prod = productsWithStock.find(p => p.product_id === t.product_id);
                  const st = stores.find(s => s.store_id === t.store_id);
                  return (
                    <tr key={t.transaction_id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-xs text-gray-500">{new Date(t.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{prod ? prod.product_name : t.product_id}</td>
                      <td className="px-6 py-4 text-gray-600">{st ? st.store_name : t.store_id}</td>
                      <td className="px-6 py-4 text-right font-bold text-rose-600">-{t.quantity}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{t.user_name || 'Staff'}</td>
                      <td className="px-6 py-4 text-xs text-gray-600">{t.purpose || 'General'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {reportType === 'EMPLOYEE_ACTIVITY' && (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5 text-right">Total Goods IN</th>
                  <th className="px-6 py-3.5 text-right">Total Goods OUT</th>
                  <th className="px-6 py-3.5 text-center">Total Operations</th>
                  <th className="px-6 py-3.5 text-right">Last Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employeeActivityData.map(e => (
                  <tr key={e.user_id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{e.name}</p>
                      <p className="text-xs text-gray-400">{e.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {e.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">+{e.total_in}</td>
                    <td className="px-6 py-4 text-right font-bold text-rose-600">-{e.total_out}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-900">{e.total_txns}</td>
                    <td className="px-6 py-4 text-right text-xs text-gray-500">
                      {e.last_activity ? new Date(e.last_activity).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'LOW_STOCK' && (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Product Name</th>
                  <th className="px-6 py-3.5">SKU</th>
                  <th className="px-6 py-3.5 text-right">Current Balance</th>
                  <th className="px-6 py-3.5 text-right">Min Threshold</th>
                  <th className="px-6 py-3.5 text-right">Units Shortage</th>
                  <th className="px-6 py-3.5 text-center">Urgency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lowStockData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                      No products are currently low in stock.
                    </td>
                  </tr>
                ) : (
                  lowStockData.map(p => (
                    <tr key={p.product_id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-semibold text-gray-900">{p.product_name}</td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.sku}</td>
                      <td className="px-6 py-4 text-right font-bold text-rose-600">{p.current_stock} {p.unit}</td>
                      <td className="px-6 py-4 text-right text-gray-500">{p.minimum_stock} {p.unit}</td>
                      <td className="px-6 py-4 text-right font-bold text-rose-700">-{p.shortage} {p.unit}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          p.current_stock <= 0 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.current_stock <= 0 ? 'CRITICAL OUT' : 'RESTOCK REQUIRED'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
