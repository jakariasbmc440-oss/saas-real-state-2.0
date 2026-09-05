import React, { useState } from 'react';
import { Users, Plus, Shield, Mail, Phone, Edit2, Trash2, Key, X, Lock } from 'lucide-react';
import { useData } from '../../context/DataContext';
import useAuth from '../../hooks/useAuth';

export default function UserList() {
  const { users, stores, addUser, updateUser, deleteUser } = useData();
  const { user: currentUser } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'STAFF',
    store_id: stores[0]?.store_id || '',
    status: 'ACTIVE'
  });

  const isAdmin = currentUser?.role === 'COMPANY_ADMIN' || currentUser?.role === 'SUPER_ADMIN';

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: 'demo123',
      phone: '',
      role: 'STAFF',
      store_id: stores[0]?.store_id || '',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      password: u.password || 'demo123',
      phone: u.phone || '',
      role: u.role,
      store_id: u.store_id || stores[0]?.store_id || '',
      status: u.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = (u) => {
    if (!isAdmin) {
      alert('শুধুমাত্র অ্যাডমিন ইউজারদের ডিলিট করতে পারবে। (Only Admin can delete users)');
      return;
    }

    if (u.user_id === currentUser?.user_id || u.email === currentUser?.email) {
      alert('আপনি নিজেকে ডিলিট করতে পারবেন না। (You cannot delete your own admin account)');
      return;
    }

    if (window.confirm(`⚠️ আপনি কি নিশ্চিত যে ইউজার "${u.name}" (${u.email}) স্থায়ীভাবে ডিলিট করতে চান?`)) {
      deleteUser(u.user_id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('নাম এবং ইমেইল দুটোই আবশ্যক!');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.user_id, formData);
    } else {
      addUser(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl flex items-center gap-3">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Users className="h-6 w-6" />
            </span>
            Staff & Role Permissions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage employees, set custom passwords, assign store permissions, or remove staff access.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        )}
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Staff Name</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">Assigned Role</th>
                <th className="px-6 py-3.5">Assigned Store</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => {
                const assignedStore = stores.find(s => s.store_id === u.store_id);
                const isSelf = u.user_id === currentUser?.user_id || u.email === currentUser?.email;

                return (
                  <tr key={u.user_id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        {u.name}
                        {isSelf && (
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-100 text-blue-700">
                            You (Current)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">ID: {u.user_id}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 space-y-0.5">
                      <p className="flex items-center gap-1.5 text-xs">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        {u.email}
                      </p>
                      {u.phone && (
                        <p className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          {u.phone}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        u.role === 'COMPANY_ADMIN' ? 'bg-purple-50 text-purple-700' :
                        u.role === 'MANAGER' ? 'bg-blue-50 text-blue-700' :
                        u.role === 'STAFF' ? 'bg-teal-50 text-teal-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Shield className="h-3 w-3" />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs font-medium">
                      {assignedStore ? assignedStore.store_name : 'All Stores'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                          title="Edit User & Set Password"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {isAdmin && !isSelf && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Delete User (Admin Only)"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {editingUser ? 'Edit Employee & Credentials' : 'Add New Employee'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahim Khan"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. rahim@demo.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Explicit Password Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1 flex items-center gap-1">
                  <Key className="h-3.5 w-3.5 text-blue-600" />
                  Account Password *
                </label>
                <input
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Set employee login password..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  The user will use this password to sign in.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +880 1711-000000"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Role Permission *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                >
                  <option value="COMPANY_ADMIN">COMPANY_ADMIN (Full company controls)</option>
                  <option value="MANAGER">MANAGER (Stock, transfers, catalog)</option>
                  <option value="STAFF">STAFF (Assigned store Stock IN/OUT)</option>
                  <option value="VIEWER">VIEWER (Read-only reports)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Assigned Store
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
                  Save Employee & Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
