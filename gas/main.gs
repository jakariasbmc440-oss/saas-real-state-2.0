function doGet(e) {
  var output = { success: true, message: 'Store Management API is running', version: '1.0.0' };
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var request = JSON.parse(e.postData.contents);
    var action = request.action;
    var payload = request.payload || {};
    var token = request.token || '';
    
    var response = Router.route(action, payload, token);
    return ResponseHelper.toJsonOutput(response);
  } catch (error) {
    Logger.log('doPost error: ' + error.toString());
    var errorResponse = ResponseHelper.error('SERVER_ERROR', 'An internal server error occurred: ' + error.message);
    return ResponseHelper.toJsonOutput(errorResponse);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}