import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Shield, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (login) await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (roleEmail) => {
    setEmail(roleEmail);
    setPassword('demo123');
    setIsLoading(true);
    try {
      if (login) await login(roleEmail, 'demo123');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-2">
            <Package className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Sign in to StoreIQ
          </h1>
          <p className="text-xs text-gray-500">
            Multi-Tenant Store & Inventory Management Platform
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Role Selector */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 text-center mb-3">
            Quick Demo Login (Click to Switch Role)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('admin@demo.com')}
              className="p-2 rounded-lg border border-gray-200 text-left hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <strong className="block text-gray-900">Admin</strong>
              <span className="text-gray-500 text-[11px]">Full access</span>
            </button>
            <button
              onClick={() => handleQuickLogin('manager@demo.com')}
              className="p-2 rounded-lg border border-gray-200 text-left hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <strong className="block text-gray-900">Manager</strong>
              <span className="text-gray-500 text-[11px]">Stock & Transfers</span>
            </button>
            <button
              onClick={() => handleQuickLogin('staff@demo.com')}
              className="p-2 rounded-lg border border-gray-200 text-left hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <strong className="block text-gray-900">Staff</strong>
              <span className="text-gray-500 text-[11px]">Store In / Out</span>
            </button>
            <button
              onClick={() => handleQuickLogin('viewer@demo.com')}
              className="p-2 rounded-lg border border-gray-200 text-left hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <strong className="block text-gray-900">Viewer</strong>
              <span className="text-gray-500 text-[11px]">Read-only reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
