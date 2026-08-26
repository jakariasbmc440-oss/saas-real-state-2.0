var StockRepository = {
  createTransaction: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.STOCK_TRANSACTIONS, data, COLUMNS.STOCK_TRANSACTIONS);
  },
  getTransactions: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.STOCK_TRANSACTIONS, companyId, filters);
  },
  calculateCurrentStock: function(companyId, productId, storeId) {
    var conditions = { product_id: productId };
    if (storeId) conditions.store_id = storeId;
    
    var transactions = BaseRepository.findWhere(
      CONFIG.SHEET_NAMES.STOCK_TRANSACTIONS,
      conditions,
      companyId
    );
    
    var inTypes = ['IN', 'ADJUSTMENT_IN', 'TRANSFER_IN'];
    var outTypes = ['OUT', 'ADJUSTMENT_OUT', 'TRANSFER_OUT'];
    
    var total = 0;
    transactions.forEach(function(txn) {
      var qty = Number(txn.quantity) || 0;
      if (inTypes.indexOf(txn.type) >= 0) total += qty;
      else if (outTypes.indexOf(txn.type) >= 0) total -= qty;
    });
    
    return total;
  },
  calculateAllStock: function(companyId, storeId) {
    var products = BaseRepository.getAll(CONFIG.SHEET_NAMES.PRODUCTS, companyId).data;
    var result = [];
    for (var i=0; i<products.length; i++) {
      var p = products[i];
      p.current_stock = this.calculateCurrentStock(companyId, p.product_id, storeId);
      result.push(p);
    }
    return result;
  },
  getLowStockProducts: function(companyId) {
    var all = this.calculateAllStock(companyId, null);
    return all.filter(function(p) {
      return p.current_stock < (Number(p.minimum_stock) || 0);
    });
  },
  getTodayTransactions: function(companyId, type) {
    var today = DateUtils.today();
    var all = BaseRepository.findWhere(CONFIG.SHEET_NAMES.STOCK_TRANSACTIONS, {type: type}, companyId);
    return all.filter(function(txn) {
      return DateUtils.isToday(txn.created_at);
    });
  }
};