var TransferController = {
  create: function(payload, user) { return TransferService.createTransfer(payload, user); },
  approve: function(payload, user) { return TransferService.approveTransfer(payload, user); },
  complete: function(payload, user) { return TransferService.completeTransfer(payload, user); },
  cancel: function(payload, user) { return TransferService.cancelTransfer(payload, user); },
  list: function(payload, user) { return ResponseHelper.success(TransferRepository.list(user.company_id, payload).data); }
};