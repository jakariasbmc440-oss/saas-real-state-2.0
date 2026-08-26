import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';

// Layouts
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';
import CategoryList from './pages/categories/CategoryList';
import StockIn from './pages/stock/StockIn';
import StockOut from './pages/stock/StockOut';
import StockTransfer from './pages/stock/StockTransfer';
import InventoryList from './pages/inventory/InventoryList';
import TransactionHistory from './pages/history/TransactionHistory';
import UserList from './pages/users/UserList';
import StoreList from './pages/stores/StoreList';
import SupplierList from './pages/suppliers/SupplierList';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';
import AuditLog from './pages/audit/AuditLog';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 font-medium">Loading StoreIQ...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Protected App Layout Routes */}
      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Products */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id/edit" element={<ProductForm />} />
        
        {/* Categories */}
        <Route path="/categories" element={<CategoryList />} />
        
        {/* Stock In & Out */}
        <Route path="/stock-in" element={<StockIn />} />
        <Route path="/stock/in" element={<StockIn />} />
        <Route path="/stock-out" element={<StockOut />} />
        <Route path="/stock/out" element={<StockOut />} />
        
        {/* Transfers */}
        <Route path="/transfers" element={<StockTransfer />} />
        <Route path="/transfers/new" element={<StockTransfer />} />
        
        {/* Inventory & Ledger History */}
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/history" element={<TransactionHistory />} />
        
        {/* Master Management */}
        <Route path="/stores" element={<StoreList />} />
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="/users" element={<UserList />} />
        
        {/* Reports, Settings & Audit */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/audit-log" element={<AuditLog />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
