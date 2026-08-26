var StockController = {
  stockIn: function(payload, user) { return StockService.stockIn(payload, user); },
  stockOut: function(payload, user) { return StockService.stockOut(payload, user); },
  getCurrentStock: function(payload, user) { return StockService.getCurrentStock(user.company_id, payload.product_id, payload.store_id); },
  getHistory: function(payload, user) { return ResponseHelper.success(StockRepository.getTransactions(user.company_id, payload).data); },
  getLowStock: function(payload, user) { return StockService.getLowStockProducts(user.company_id); }
};