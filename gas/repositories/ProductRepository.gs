var ProductRepository = {
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.PRODUCTS, companyId, filters);
  },
  getById: function(productId, companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.PRODUCTS, 'product_id', productId, companyId);
  },
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.PRODUCTS, data, COLUMNS.PRODUCTS);
  },
  update: function(productId, updates, companyId) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.PRODUCTS, 'product_id', productId, updates, companyId);
  },
  findBySku: function(companyId, sku) {
    var results = BaseRepository.findWhere(CONFIG.SHEET_NAMES.PRODUCTS, {sku: sku}, companyId);
    return results.length > 0 ? results[0] : null;
  },
  getByCategory: function(companyId, categoryId) {
    return BaseRepository.findWhere(CONFIG.SHEET_NAMES.PRODUCTS, {category_id: categoryId}, companyId);
  }
};