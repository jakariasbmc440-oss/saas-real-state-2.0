import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Package, LayoutDashboard, Layers, Archive, ArrowDownToLine, ArrowUpFromLine, 
  ArrowRightLeft, History, Store, Users, Truck,
  FileBarChart, Shield, Settings, X 
} from 'lucide-react';
import { useData } from '../context/DataContext';
import useAuth from '../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { company } = useData();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Categories', href: '/categories', icon: Layers },
    { name: 'Stock In', href: '/stock-in', icon: ArrowDownToLine },
    { name: 'Stock Out', href: '/stock-out', icon: ArrowUpFromLine },
    { name: 'Transfers', href: '/transfers', icon: ArrowRightLeft },
    { name: 'Inventory', href: '/inventory', icon: Archive },
    { name: 'History', href: '/history', icon: History },
    { name: 'Stores', href: '/stores', icon: Store },
    { name: 'Suppliers', href: '/suppliers', icon: Truck },
    { name: 'Staff & Users', href: '/users', icon: Users },
    { name: 'Reports', href: '/reports', icon: FileBarChart },
    { name: 'Audit Log', href: '/audit-log', icon: Shield },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/80 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar component */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:w-64 lg:flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 shrink-0 items-center justify-between px-6 bg-slate-950">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Package className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">StoreIQ</span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white font-semibold shadow-sm' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 p-4 bg-slate-950/50">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
              <Store className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{company.company_name}</p>
              <p className="text-[11px] text-slate-400 truncate">Plan: {company.plan || 'PRO'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
