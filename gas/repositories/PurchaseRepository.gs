var PurchaseRepository = {
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.PURCHASES, companyId, filters);
  },
  getById: function(id, companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.PURCHASES, 'purchase_id', id, companyId);
  },
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.PURCHASES, data, COLUMNS.PURCHASES);
  },
  update: function(id, updates, companyId) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.PURCHASES, 'purchase_id', id, updates, companyId);
  }
};