var CompanyRepository = {
  getById: function(companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.COMPANIES, 'company_id', companyId, null);
  },
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.COMPANIES, data, COLUMNS.COMPANIES);
  },
  update: function(companyId, updates) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.COMPANIES, 'company_id', companyId, updates, null);
  },
  getByEmail: function(email) {
    var results = BaseRepository.findWhere(CONFIG.SHEET_NAMES.COMPANIES, {email: email}, null);
    return results.length > 0 ? results[0] : null;
  }
};