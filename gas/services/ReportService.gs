var ReportService = {
  stockReport: function(companyId) {
    return ResponseHelper.success(StockRepository.calculateAllStock(companyId, null));
  },
  activityReport: function(companyId) {
    return ResponseHelper.success(StockRepository.getTransactions(companyId).data);
  },
  lowStockReport: function(companyId) {
    return ResponseHelper.success(StockRepository.getLowStockProducts(companyId));
  }
};