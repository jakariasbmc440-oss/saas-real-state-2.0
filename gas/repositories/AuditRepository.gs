var AuditRepository = {
  log: function(companyId, userId, action, module, recordId, oldValue, newValue, sessionRef) {
    var data = {
      log_id: IdGenerator.generate('LOG'),
      company_id: companyId,
      user_id: userId,
      action: action,
      module: module,
      record_id: recordId || '',
      old_value: oldValue ? JSON.stringify(oldValue) : '',
      new_value: newValue ? JSON.stringify(newValue) : '',
      ip_or_session_reference: sessionRef || '',
      created_at: DateUtils.now()
    };
    return BaseRepository.create(CONFIG.SHEET_NAMES.AUDIT_LOGS, data, COLUMNS.AUDIT_LOGS);
  },
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.AUDIT_LOGS, companyId, filters);
  }
};