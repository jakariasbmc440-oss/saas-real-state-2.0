var DashboardService = {
  getStats: function(companyId) {
    var totalProducts = ProductRepository.list(companyId).data.length;
    var storeCount = StoreRepository.list(companyId).data.length;
    var staffCount = UserRepository.list(companyId).data.length;
    var lowStockCount = StockRepository.getLowStockProducts(companyId).length;
    return ResponseHelper.success({
      totalProducts: totalProducts,
      storeCount: storeCount,
      staffCount: staffCount,
      lowStockCount: lowStockCount
    });
  },
  getRecentActivity: function(companyId, limit) {
    var txns = StockRepository.getTransactions(companyId).data;
    txns.sort(function(a,b) { return new Date(b.created_at) - new Date(a.created_at); });
    return ResponseHelper.success(txns.slice(0, limit || 10));
  },
  getLowStockAlerts: function(companyId) {
    return ResponseHelper.success(StockRepository.getLowStockProducts(companyId));
  }
};