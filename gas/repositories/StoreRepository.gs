var StoreRepository = {
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.STORES, companyId, filters);
  },
  getById: function(id, companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.STORES, 'store_id', id, companyId);
  },
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.STORES, data, COLUMNS.STORES);
  },
  update: function(id, updates, companyId) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.STORES, 'store_id', id, updates, companyId);
  }
};