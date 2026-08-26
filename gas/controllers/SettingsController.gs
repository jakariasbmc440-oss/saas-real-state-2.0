var SettingsController = {
  get: function(payload, user) {
    return ResponseHelper.success(SettingsRepository.getAll(user.company_id));
  },
  update: function(payload, user) {
    for (var k in payload.settings) {
      SettingsRepository.set(user.company_id, k, payload.settings[k]);
    }
    AuditRepository.log(user.company_id, user.user_id, 'UPDATE', 'SETTINGS', '', null, payload.settings, '');
    return ResponseHelper.success(SettingsRepository.getAll(user.company_id));
  }
};