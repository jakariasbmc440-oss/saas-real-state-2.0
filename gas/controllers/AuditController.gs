var AuditController = {
  list: function(payload, user) {
    return ResponseHelper.success(AuditRepository.list(user.company_id, payload).data);
  }
};