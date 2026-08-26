var CategoryRepository = {
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.CATEGORIES, companyId, filters);
  },
  getById: function(id, companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.CATEGORIES, 'category_id', id, companyId);
  },
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.CATEGORIES, data, COLUMNS.CATEGORIES);
  },
  update: function(id, updates, companyId) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.CATEGORIES, 'category_id', id, updates, companyId);
  }
};