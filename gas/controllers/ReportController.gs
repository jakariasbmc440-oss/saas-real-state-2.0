var ReportController = {
  stockReport: function(payload, user) { return ReportService.stockReport(user.company_id); },
  activityReport: function(payload, user) { return ReportService.activityReport(user.company_id); },
  lowStockReport: function(payload, user) { return ReportService.lowStockReport(user.company_id); },
  dashboardReport: function(payload, user) { return DashboardService.getStats(user.company_id); }
};