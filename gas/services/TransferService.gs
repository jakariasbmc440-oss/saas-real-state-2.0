var TransferService = {
  createTransfer: function(data, user) {
    var t = {
      transfer_id: IdGenerator.generate('TRF'),
      company_id: user.company_id,
      product_id: data.product_id,
      from_store_id: data.from_store_id,
      to_store_id: data.to_store_id,
      quantity: data.quantity,
      requested_by: user.user_id,
      approved_by: '',
      status: CONFIG.TRANSFER_STATUSES.PENDING,
      note: data.note || '',
      created_at: DateUtils.now(),
      completed_at: ''
    };
    var res = TransferRepository.create(t);
    AuditRepository.log(user.company_id, user.user_id, 'CREATE', 'TRANSFER', res.transfer_id, null, res, '');
    return ResponseHelper.success(res);
  },
  approveTransfer: function(data, user) {
    var res = TransferRepository.updateStatus(data.transfer_id, CONFIG.TRANSFER_STATUSES.APPROVED, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'APPROVE', 'TRANSFER', data.transfer_id, null, res, '');
    return ResponseHelper.success(res);
  },
  completeTransfer: function(data, user) {
    var t = TransferRepository.getById(data.transfer_id, user.company_id);
    StockRepository.createTransaction({
      transaction_id: IdGenerator.generate('TXN'),
      company_id: user.company_id, store_id: t.from_store_id, product_id: t.product_id,
      type: 'TRANSFER_OUT', quantity: t.quantity, user_id: user.user_id,
      purpose: 'TRANSFER', reference_id: t.transfer_id, note: '', created_at: DateUtils.now()
    });
    StockRepository.createTransaction({
      transaction_id: IdGenerator.generate('TXN'),
      company_id: user.company_id, store_id: t.to_store_id, product_id: t.product_id,
      type: 'TRANSFER_IN', quantity: t.quantity, user_id: user.user_id,
      purpose: 'TRANSFER', reference_id: t.transfer_id, note: '', created_at: DateUtils.now()
    });
    var res = TransferRepository.updateStatus(data.transfer_id, CONFIG.TRANSFER_STATUSES.COMPLETED, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'COMPLETE', 'TRANSFER', data.transfer_id, null, res, '');
    return ResponseHelper.success(res);
  },
  cancelTransfer: function(data, user) {
    var res = TransferRepository.updateStatus(data.transfer_id, CONFIG.TRANSFER_STATUSES.CANCELLED, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'CANCEL', 'TRANSFER', data.transfer_id, null, res, '');
    return ResponseHelper.success(res);
  }
};