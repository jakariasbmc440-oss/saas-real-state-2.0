var SupplierController = {
  list: function(payload, user) {
    return ResponseHelper.success(SupplierRepository.list(user.company_id, payload).data);
  },
  create: function(payload, user) {
    payload.supplier_id = IdGenerator.generate('SUP');
    payload.company_id = user.company_id;
    payload.created_at = DateUtils.now();
    payload.updated_at = DateUtils.now();
    var res = SupplierRepository.create(payload);
    AuditRepository.log(user.company_id, user.user_id, 'CREATE', 'SUPPLIER', res.supplier_id, null, res, '');
    return ResponseHelper.success(res);
  },
  update: function(payload, user) {
    payload.updated_at = DateUtils.now();
    var res = SupplierRepository.update(payload.supplier_id, payload, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'UPDATE', 'SUPPLIER', payload.supplier_id, null, res, '');
    return ResponseHelper.success(res);
  }
};