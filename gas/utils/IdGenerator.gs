var IdGenerator = {
  generate: function(prefix) {
    var timestamp = new Date().getTime();
    var random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return prefix + '-' + timestamp + '-' + random;
  },
  generateToken: function() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var token = '';
    for (var i = 0; i < 64; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
};