var Permissions = {
  MATRIX: {
    'auth/logout': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'auth/me': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'dashboard/stats': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'dashboard/recent-activity': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'dashboard/low-stock': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'products/list': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'products/get': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'products/create': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'products/update': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'products/deactivate': ['SUPER_ADMIN', 'COMPANY_ADMIN'],
    
    'categories/list': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'categories/create': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'categories/update': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    
    'stock/in': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF'],
    'stock/out': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF'],
    'stock/current': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'stock/history': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'stock/low': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    
    'transfers/create': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'transfers/approve': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'transfers/complete': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'transfers/cancel': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'transfers/list': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    
    'stores/list': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'stores/create': ['SUPER_ADMIN', 'COMPANY_ADMIN'],
    'stores/update': ['SUPER_ADMIN', 'COMPANY_ADMIN'],
    
    'users/list': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'users/create': ['SUPER_ADMIN', 'COMPANY_ADMIN'],
    'users/update': ['SUPER_ADMIN', 'COMPANY_ADMIN'],
    'users/deactivate': ['SUPER_ADMIN', 'COMPANY_ADMIN'],
    
    'suppliers/list': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'suppliers/create': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'suppliers/update': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    
    'reports/stock': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'reports/activity': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'reports/low-stock': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'reports/dashboard': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    
    'audit/list': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    
    'settings/get': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'settings/update': ['SUPER_ADMIN', 'COMPANY_ADMIN']
  },
  
  check: function(user, action) {
    var allowedRoles = this.MATRIX[action];
    if (!allowedRoles) {
      return ResponseHelper.error('FORBIDDEN', 'Action not recognized');
    }
    if (allowedRoles.indexOf(user.role) === -1) {
      return ResponseHelper.error('FORBIDDEN', 'You do not have permission for this action');
    }
    return ResponseHelper.success(true);
  }
};