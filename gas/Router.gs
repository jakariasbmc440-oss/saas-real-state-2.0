var Router = {
  route: function(action, payload, token) {
    if (action === 'auth/login') return AuthController.login(payload);
    
    var authResult = Auth.authenticate(token);
    if (!authResult.success) return authResult;
    var user = authResult.data;
    
    var permResult = Permissions.check(user, action);
    if (!permResult.success) return permResult;
    
    switch (action) {
      case 'auth/logout': return AuthController.logout(token);
      case 'auth/me': return AuthController.me(user);
      
      case 'dashboard/stats': return DashboardController.getStats(payload, user);
      case 'dashboard/recent-activity': return DashboardController.getRecentActivity(payload, user);
      case 'dashboard/low-stock': return DashboardController.getLowStock(payload, user);
      
      case 'products/list': return ProductController.list(payload, user);
      case 'products/get': return ProductController.get(payload, user);
      case 'products/create': return ProductController.create(payload, user);
      case 'products/update': return ProductController.update(payload, user);
      case 'products/deactivate': return ProductController.deactivate(payload, user);
      
      case 'categories/list': return CategoryController.list(payload, user);
      case 'categories/create': return CategoryController.create(payload, user);
      case 'categories/update': return CategoryController.update(payload, user);
      
      case 'stock/in': return StockController.stockIn(payload, user);
      case 'stock/out': return StockController.stockOut(payload, user);
      case 'stock/current': return StockController.getCurrentStock(payload, user);
      case 'stock/history': return StockController.getHistory(payload, user);
      case 'stock/low': return StockController.getLowStock(payload, user);
      
      case 'transfers/create': return TransferController.create(payload, user);
      case 'transfers/approve': return TransferController.approve(payload, user);
      case 'transfers/complete': return TransferController.complete(payload, user);
      case 'transfers/cancel': return TransferController.cancel(payload, user);
      case 'transfers/list': return TransferController.list(payload, user);
      
      case 'stores/list': return StoreController.list(payload, user);
      case 'stores/create': return StoreController.create(payload, user);
      case 'stores/update': return StoreController.update(payload, user);
      
      case 'users/list': return UserController.list(payload, user);
      case 'users/create': return UserController.create(payload, user);
      case 'users/update': return UserController.update(payload, user);
      case 'users/deactivate': return UserController.deactivate(payload, user);
      
      case 'suppliers/list': return SupplierController.list(payload, user);
      case 'suppliers/create': return SupplierController.create(payload, user);
      case 'suppliers/update': return SupplierController.update(payload, user);
      
      case 'reports/stock': return ReportController.stockReport(payload, user);
      case 'reports/activity': return ReportController.activityReport(payload, user);
      case 'reports/low-stock': return ReportController.lowStockReport(payload, user);
      case 'reports/dashboard': return ReportController.dashboardReport(payload, user);
      
      case 'audit/list': return AuditController.list(payload, user);
      
      case 'settings/get': return SettingsController.get(payload, user);
      case 'settings/update': return SettingsController.update(payload, user);
      
      default:
        return ResponseHelper.error('INVALID_ACTION', 'Unknown action: ' + action);
    }
  }
};