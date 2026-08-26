var UserRepository = {
  getById: function(userId, companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.USERS, 'user_id', userId, companyId);
  },
  getByEmail: function(email) {
    var results = BaseRepository.findWhere(CONFIG.SHEET_NAMES.USERS, {email: email}, null);
    return results.length > 0 ? results[0] : null;
  },
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.USERS, companyId, filters);
  },
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.USERS, data, COLUMNS.USERS);
  },
  update: function(userId, updates, companyId) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.USERS, 'user_id', userId, updates, companyId);
  }
};