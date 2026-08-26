var SettingsRepository = {
  get: function(companyId, key) {
    var res = BaseRepository.findWhere(CONFIG.SHEET_NAMES.SETTINGS, {setting_key: key}, companyId);
    return res.length > 0 ? res[0].setting_value : null;
  },
  set: function(companyId, key, value) {
    var res = BaseRepository.findWhere(CONFIG.SHEET_NAMES.SETTINGS, {setting_key: key}, companyId);
    if (res.length > 0) {
      BaseRepository.update(CONFIG.SHEET_NAMES.SETTINGS, 'setting_id', res[0].setting_id, {setting_value: value, updated_at: DateUtils.now()}, companyId);
    } else {
      BaseRepository.create(CONFIG.SHEET_NAMES.SETTINGS, {
        setting_id: IdGenerator.generate('SET'),
        company_id: companyId,
        setting_key: key,
        setting_value: value,
        created_at: DateUtils.now(),
        updated_at: DateUtils.now()
      }, COLUMNS.SETTINGS);
    }
  },
  getAll: function(companyId) {
    return BaseRepository.findWhere(CONFIG.SHEET_NAMES.SETTINGS, {}, companyId);
  }
};