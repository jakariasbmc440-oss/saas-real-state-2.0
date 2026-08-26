var DateUtils = {
  now: function() {
    return Utilities.formatDate(new Date(), CONFIG.DEFAULT_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
  },
  today: function() {
    return Utilities.formatDate(new Date(), CONFIG.DEFAULT_TIMEZONE, 'yyyy-MM-dd');
  },
  format: function(date, pattern) {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return Utilities.formatDate(date, CONFIG.DEFAULT_TIMEZONE, pattern || "yyyy-MM-dd'T'HH:mm:ss");
  },
  isToday: function(dateStr) {
    if (!dateStr) return false;
    var today = this.today();
    var dateOnly = dateStr.substring(0, 10);
    return today === dateOnly;
  },
  addHours: function(date, hours) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  }
};