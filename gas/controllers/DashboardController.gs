var DashboardController = {
  getStats: function(payload, user) { return DashboardService.getStats(user.company_id); },
  getRecentActivity: function(payload, user) { return DashboardService.getRecentActivity(user.company_id, payload.limit); },
  getLowStock: function(payload, user) { return DashboardService.getLowStockAlerts(user.company_id); }
};