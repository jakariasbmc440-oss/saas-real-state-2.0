var TransferRepository = {
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.STOCK_TRANSFERS, data, COLUMNS.STOCK_TRANSFERS);
  },
  getById: function(id, companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.STOCK_TRANSFERS, 'transfer_id', id, companyId);
  },
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.STOCK_TRANSFERS, companyId, filters);
  },
  updateStatus: function(id, status, companyId) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.STOCK_TRANSFERS, 'transfer_id', id, {status: status}, companyId);
  }
};