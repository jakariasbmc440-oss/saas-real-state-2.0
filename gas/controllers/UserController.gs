var UserController = {
  list: function(payload, user) {
    return ResponseHelper.success(UserRepository.list(user.company_id, payload).data);
  },
  create: function(payload, user) {
    payload.user_id = IdGenerator.generate('USR');
    payload.company_id = user.company_id;
    payload.password_hash = Auth.hashPassword(payload.password);
    delete payload.password;
    payload.created_at = DateUtils.now();
    payload.updated_at = DateUtils.now();
    var res = UserRepository.create(payload);
    AuditRepository.log(user.company_id, user.user_id, 'CREATE', 'USER', res.user_id, null, res, '');
    return ResponseHelper.success(res);
  },
  update: function(payload, user) {
    if (payload.password) {
      payload.password_hash = Auth.hashPassword(payload.password);
      delete payload.password;
    }
    payload.updated_at = DateUtils.now();
    var res = UserRepository.update(payload.user_id, payload, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'UPDATE', 'USER', payload.user_id, null, res, '');
    return ResponseHelper.success(res);
  },
  deactivate: function(payload, user) {
    var res = UserRepository.update(payload.user_id, {status: CONFIG.RECORD_STATUS.INACTIVE}, user.company_id);
    return ResponseHelper.success(res);
  }
};