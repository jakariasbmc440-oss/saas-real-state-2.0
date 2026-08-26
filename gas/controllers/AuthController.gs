var AuthController = {
  login: function(payload) {
    if (!payload.email || !payload.password) {
      return ResponseHelper.error('VALIDATION_ERROR', 'Email and password are required');
    }
    return AuthService.login(payload.email, payload.password);
  },
  logout: function(token) {
    Auth.destroySession(token);
    return ResponseHelper.success(null, 'Logged out successfully');
  },
  me: function(user) {
    var u = JSON.parse(JSON.stringify(user));
    delete u.password_hash;
    return ResponseHelper.success(u);
  }
};