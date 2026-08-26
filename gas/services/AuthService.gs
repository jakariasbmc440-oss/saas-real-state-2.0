var AuthService = {
  login: function(email, password) {
    var user = UserRepository.getByEmail(email);
    if (!user) return ResponseHelper.error('INVALID_CREDENTIALS', 'Invalid email or password');
    
    var passwordHash = Auth.hashPassword(password);
    if (user.password_hash !== passwordHash) {
      return ResponseHelper.error('INVALID_CREDENTIALS', 'Invalid email or password');
    }
    
    if (user.status !== CONFIG.RECORD_STATUS.ACTIVE) {
      return ResponseHelper.error('ACCOUNT_INACTIVE', 'Your account has been deactivated');
    }
    
    var token = Auth.createSession(user);
    AuditRepository.log(user.company_id, user.user_id, 'LOGIN', 'AUTH', user.user_id, null, null, '');
    delete user.password_hash;
    
    return ResponseHelper.success({ user: user, token: token }, 'Login successful');
  }
};