var ResponseHelper = {
  success: function(data, message) {
    return {
      success: true,
      data: data || null,
      message: message || 'Operation completed successfully'
    };
  },
  error: function(code, message) {
    return {
      success: false,
      error: {
        code: code || 'UNKNOWN_ERROR',
        message: message || 'An unexpected error occurred'
      }
    };
  },
  toJsonOutput: function(responseObj) {
    return ContentService
      .createTextOutput(JSON.stringify(responseObj))
      .setMimeType(ContentService.MimeType.JSON);
  }
};