import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, Archive, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, 
  Store, Users, ArrowRightLeft, Plus, Clock, TrendingUp
} from 'lucide-react';
import { useData } from '../context/DataContext';

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
  <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</p>
        <p className="mt-2 text-2xl lg:text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
      <div className={`rounded-xl p-3.5 ${colorClass}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { getDashboardStats, getLowStockAlerts, getRecentActivities, company } = useData();
  const stats = getDashboardStats();
  const lowStockAlerts = getLowStockAlerts();
  const recentActivities = getRecentActivities(6);

  const kpis = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, colorClass: 'bg-blue-50 text-blue-600', subtitle: 'Active catalog items' },
    { title: 'Total Stock Units', value: Number(stats.totalStockUnits).toLocaleString(), icon: Archive, colorClass: 'bg-emerald-50 text-emerald-600', subtitle: 'Across all warehouses' },
    { title: 'Low Stock Alerts', value: stats.lowStockCount, icon: AlertTriangle, colorClass: stats.lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400', subtitle: 'Items below threshold' },
    { title: "Today's Stock IN", value: `+${Number(stats.todayIn).toLocaleString()}`, icon: ArrowDownToLine, colorClass: 'bg-indigo-50 text-indigo-600', subtitle: 'Received today' },
    { title: "Today's Stock OUT", value: `-${Number(stats.todayOut).toLocaleString()}`, icon: ArrowUpFromLine, colorClass: 'bg-rose-50 text-rose-600', subtitle: 'Dispatched today' },
    { title: 'Active Stores', value: stats.storeCount, icon: Store, colorClass: 'bg-purple-50 text-purple-600', subtitle: 'Stores & warehouses' },
    { title: 'Staff Members', value: stats.staffCount, icon: Users, colorClass: 'bg-teal-50 text-teal-600', subtitle: 'Authorized users' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Store Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time ledger status for <span className="font-medium text-gray-800">{company.company_name}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/stock-in"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Stock In
          </Link>
          <Link
            to="/stock-out"
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 transition-colors"
          >
            <ArrowUpFromLine className="h-4 w-4" />
            Stock Out
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
        {kpis.map((kpi) => (
          <StatCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Second Row: Recent Activity & Low Stock Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Ledger Activity */}
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 lg:col-span-2">
          <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-xs text-gray-500">Live transactions recorded in ledger</p>
            </div>
            <Link to="/history" className="text-xs font-semibold text-blue-600 hover:text-blue-500">
              View all history &rarr;
            </Link>
          </div>
          <div className="p-6">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No transaction history recorded yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentActivities.map((activity) => (
                  <div key={activity.transaction_id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${
                        activity.type === 'IN' || activity.type === 'TRANSFER_IN' || activity.type === 'ADJUSTMENT_IN' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-rose-50 text-rose-600'
                      }`}>
                        {activity.type.includes('IN') ? (
                          <ArrowDownToLine className="h-4 w-4" />
                        ) : (
                          <ArrowUpFromLine className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          <span className="font-semibold text-gray-800">{activity.user_name}</span>{' '}
                          {activity.type.includes('IN') ? 'received' : 'took'}{' '}
                          <span className="font-bold text-gray-900">{activity.quantity}</span> {activity.product_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Store: <span className="text-gray-700">{activity.store_name}</span> &bull; Purpose: <span className="text-gray-700">{activity.purpose || 'General'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        activity.type.includes('IN') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {activity.type.includes('IN') ? `+${activity.quantity}` : `-${activity.quantity}`}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h2 className="text-base font-semibold text-gray-900">Low Stock Warning</h2>
            </div>
            <Link to="/inventory" className="text-xs font-semibold text-blue-600 hover:text-blue-500">
              Inventory &rarr;
            </Link>
          </div>
          <div className="p-6">
            {lowStockAlerts.length === 0 ? (
              <div className="text-center py-6">
                <div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-gray-900">All Stock Levels Healthy</p>
                <p className="text-xs text-gray-500">No products are currently below minimum thresholds.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockAlerts.map((item) => (
                  <div key={item.product_id} className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.product_name}</p>
                      <p className="text-xs text-gray-500">SKU: {item.sku} &bull; Min required: {item.minimum_stock} {item.unit}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
                        {item.current_stock} left
                      </span>
                      <p className="text-[11px] text-rose-600 mt-0.5 font-medium">Shortage: -{item.shortage}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Operations</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/stock-in" className="flex items-center gap-3.5 rounded-xl border border-gray-200 p-4 transition-all hover:border-emerald-500 hover:bg-emerald-50/30">
            <div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-600">
              <ArrowDownToLine className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Receive Stock</p>
              <p className="text-xs text-gray-500">Record incoming goods</p>
            </div>
          </Link>

          <Link to="/stock-out" className="flex items-center gap-3.5 rounded-xl border border-gray-200 p-4 transition-all hover:border-rose-500 hover:bg-rose-50/30">
            <div className="rounded-lg bg-rose-100 p-2.5 text-rose-600">
              <ArrowUpFromLine className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Issue Stock</p>
              <p className="text-xs text-gray-500">Dispatch with stock checks</p>
            </div>
          </Link>

          <Link to="/transfers" className="flex items-center gap-3.5 rounded-xl border border-gray-200 p-4 transition-all hover:border-indigo-500 hover:bg-indigo-50/30">
            <div className="rounded-lg bg-indigo-100 p-2.5 text-indigo-600">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Inter-Store Transfer</p>
              <p className="text-xs text-gray-500">Move goods between stores</p>
            </div>
          </Link>

          <Link to="/products/new" className="flex items-center gap-3.5 rounded-xl border border-gray-200 p-4 transition-all hover:border-blue-500 hover:bg-blue-50/30">
            <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">New Product</p>
              <p className="text-xs text-gray-500">Add SKU to catalog</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
