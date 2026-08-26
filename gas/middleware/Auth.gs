var Auth = {
  authenticate: function(token) {
    if (!token) return ResponseHelper.error('UNAUTHORIZED', 'Authentication required');
    
    var sessions = BaseRepository.findWhere(CONFIG.SHEET_NAMES.SESSIONS, { token: token }, null);
    if (!sessions || sessions.length === 0) {
      return ResponseHelper.error('UNAUTHORIZED', 'Invalid or expired session');
    }
    
    var session = sessions[0];
    
    if (new Date(session.expires_at) < new Date()) {
      return ResponseHelper.error('SESSION_EXPIRED', 'Your session has expired. Please login again.');
    }
    
    var user = UserRepository.getById(session.user_id, session.company_id);
    if (!user || user.status !== CONFIG.RECORD_STATUS.ACTIVE) {
      return ResponseHelper.error('UNAUTHORIZED', 'User account is inactive');
    }
    
    return ResponseHelper.success(user);
  },
  
  createSession: function(user) {
    var token = IdGenerator.generateToken();
    var now = new Date();
    var expiresAt = DateUtils.addHours(now, CONFIG.SESSION_DURATION_HOURS);
    
    var sessionData = {
      session_id: IdGenerator.generate('SES'),
      user_id: user.user_id,
      company_id: user.company_id,
      token: token,
      created_at: DateUtils.now(),
      expires_at: DateUtils.format(expiresAt)
    };
    
    BaseRepository.create(CONFIG.SHEET_NAMES.SESSIONS, sessionData, COLUMNS.SESSIONS);
    return token;
  },
  
  destroySession: function(token) {
    var sessions = BaseRepository.findWhere(CONFIG.SHEET_NAMES.SESSIONS, { token: token }, null);
    if (sessions && sessions.length > 0) {
      BaseRepository.update(CONFIG.SHEET_NAMES.SESSIONS, 'session_id', sessions[0].session_id, { expires_at: DateUtils.now() }, null);
    }
  },
  
  hashPassword: function(password) {
    var hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
    return hash.map(function(b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); }).join('');
  }
};