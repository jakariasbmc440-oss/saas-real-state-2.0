var ProductController = {
  list: function(payload, user) {
    return ResponseHelper.success(ProductRepository.list(user.company_id, payload).data);
  },
  get: function(payload, user) {
    return ResponseHelper.success(ProductRepository.getById(payload.product_id, user.company_id));
  },
  create: function(payload, user) {
    if (ProductRepository.findBySku(user.company_id, payload.sku)) {
      return ResponseHelper.error('VALIDATION_ERROR', 'SKU must be unique');
    }
    payload.product_id = IdGenerator.generate('PRD');
    payload.company_id = user.company_id;
    payload.created_at = DateUtils.now();
    payload.updated_at = DateUtils.now();
    var res = ProductRepository.create(payload);
    AuditRepository.log(user.company_id, user.user_id, 'CREATE', 'PRODUCT', res.product_id, null, res, '');
    return ResponseHelper.success(res);
  },
  update: function(payload, user) {
    payload.updated_at = DateUtils.now();
    var res = ProductRepository.update(payload.product_id, payload, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'UPDATE', 'PRODUCT', payload.product_id, null, res, '');
    return ResponseHelper.success(res);
  },
  deactivate: function(payload, user) {
    var res = ProductRepository.update(payload.product_id, {status: CONFIG.RECORD_STATUS.INACTIVE}, user.company_id);
    return ResponseHelper.success(res);
  }
};