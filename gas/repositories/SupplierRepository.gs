var SupplierRepository = {
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.SUPPLIERS, companyId, filters);
  },
  getById: function(id, companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.SUPPLIERS, 'supplier_id', id, companyId);
  },
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.SUPPLIERS, data, COLUMNS.SUPPLIERS);
  },
  update: function(id, updates, companyId) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.SUPPLIERS, 'supplier_id', id, updates, companyId);
  }
};