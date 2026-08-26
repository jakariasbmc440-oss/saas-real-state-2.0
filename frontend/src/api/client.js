import { TRANSACTION_TYPES } from '../config/constants.js';

export const DEMO_MODE = true;

const mockUsers = [
  { user_id: 'USR001', name: 'Admin User', role: 'COMPANY_ADMIN', email: 'admin@demo.com', store_id: 'STR001', company_id: 'CMP001' },
  { user_id: 'USR002', name: 'Rahim Khan', role: 'MANAGER', email: 'manager@demo.com', store_id: 'STR001', company_id: 'CMP001' },
  { user_id: 'USR003', name: 'Karim Ahmed', role: 'STAFF', email: 'staff@demo.com', store_id: 'STR002', company_id: 'CMP001' },
  { user_id: 'USR004', name: 'Sara Begum', role: 'VIEWER', email: 'viewer@demo.com', store_id: 'STR001', company_id: 'CMP001' }
];

export async function apiCall(action, payload = {}) {
  const token = localStorage.getItem('token');
  
  if (DEMO_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        switch (action) {
          case 'login': {
            const email = payload.email || 'admin@demo.com';
            const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || mockUsers[0];
            resolve({ user, token: `demo-token-${user.role.toLowerCase()}` });
            break;
          }
          default:
            resolve({});
        }
      }, 200);
    });
  }

  try {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, payload, token })
    });
    const result = await response.json();
    if (result.success === false) {
      throw new Error(result.error || 'API Error');
    }
    return result.data;
  } catch (err) {
    console.error('API call failed', err);
    throw err;
  }
}

export const api = {
  get: (action, params) => apiCall(action, params),
  post: (action, data) => apiCall(action, data)
};
