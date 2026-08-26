var StockService = {
  stockIn: function(data, user) {
    var transaction = {
      transaction_id: IdGenerator.generate('TXN'),
      company_id: user.company_id,
      store_id: data.store_id,
      product_id: data.product_id,
      type: 'IN',
      quantity: data.quantity,
      user_id: user.user_id,
      purpose: data.purpose || 'STOCK_IN',
      reference_id: data.reference_id || '',
      note: data.note || '',
      created_at: DateUtils.now()
    };
    var res = StockRepository.createTransaction(transaction);
    AuditRepository.log(user.company_id, user.user_id, 'STOCK_IN', 'STOCK', res.transaction_id, null, res, '');
    return ResponseHelper.success(res, 'Stock added successfully');
  },
  
  stockOut: function(data, user) {
    var current = StockRepository.calculateCurrentStock(user.company_id, data.product_id, data.store_id);
    if (Number(data.quantity) > current) {
      return ResponseHelper.error('INSUFFICIENT_STOCK', 'Not enough stock available');
    }
    var transaction = {
      transaction_id: IdGenerator.generate('TXN'),
      company_id: user.company_id,
      store_id: data.store_id,
      product_id: data.product_id,
      type: 'OUT',
      quantity: data.quantity,
      user_id: user.user_id,
      purpose: data.purpose || 'STOCK_OUT',
      reference_id: data.reference_id || '',
      note: data.note || '',
      created_at: DateUtils.now()
    };
    var res = StockRepository.createTransaction(transaction);
    AuditRepository.log(user.company_id, user.user_id, 'STOCK_OUT', 'STOCK', res.transaction_id, null, res, '');
    return ResponseHelper.success(res, 'Stock removed successfully');
  },
  
  getCurrentStock: function(companyId, productId, storeId) {
    var stock = StockRepository.calculateCurrentStock(companyId, productId, storeId);
    return ResponseHelper.success({ stock: stock });
  },
  
  getAllCurrentStock: function(companyId, storeId) {
    var list = StockRepository.calculateAllStock(companyId, storeId);
    return ResponseHelper.success(list);
  },
  
  getLowStockProducts: function(companyId) {
    var list = StockRepository.getLowStockProducts(companyId);
    return ResponseHelper.success(list);
  }
};