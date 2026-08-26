var CategoryController = {
  list: function(payload, user) {
    return ResponseHelper.success(CategoryRepository.list(user.company_id, payload).data);
  },
  create: function(payload, user) {
    payload.category_id = IdGenerator.generate('CAT');
    payload.company_id = user.company_id;
    payload.created_at = DateUtils.now();
    payload.updated_at = DateUtils.now();
    var res = CategoryRepository.create(payload);
    AuditRepository.log(user.company_id, user.user_id, 'CREATE', 'CATEGORY', res.category_id, null, res, '');
    return ResponseHelper.success(res);
  },
  update: function(payload, user) {
    payload.updated_at = DateUtils.now();
    var res = CategoryRepository.update(payload.category_id, payload, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'UPDATE', 'CATEGORY', payload.category_id, null, res, '');
    return ResponseHelper.success(res);
  }
};