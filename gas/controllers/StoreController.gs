var StoreController = {
  list: function(payload, user) {
    return ResponseHelper.success(StoreRepository.list(user.company_id, payload).data);
  },
  create: function(payload, user) {
    payload.store_id = IdGenerator.generate('STR');
    payload.company_id = user.company_id;
    payload.created_at = DateUtils.now();
    payload.updated_at = DateUtils.now();
    var res = StoreRepository.create(payload);
    AuditRepository.log(user.company_id, user.user_id, 'CREATE', 'STORE', res.store_id, null, res, '');
    return ResponseHelper.success(res);
  },
  update: function(payload, user) {
    payload.updated_at = DateUtils.now();
    var res = StoreRepository.update(payload.store_id, payload, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'UPDATE', 'STORE', payload.store_id, null, res, '');
    return ResponseHelper.success(res);
  }
};