function initializeDatabase() {
  var ss;
  if (CONFIG.SPREADSHEET_ID) {
    ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  } else {
    ss = SpreadsheetApp.create('StoreIQ - Store Management Database');
    Logger.log('Created new spreadsheet: ' + ss.getId());
    Logger.log('URL: ' + ss.getUrl());
  }
  
  var report = { sheetsCreated: [], sheetsExisting: [], spreadsheetId: ss.getId(), spreadsheetUrl: ss.getUrl() };
  
  for (var key in CONFIG.SHEET_NAMES) {
    var sheetName = CONFIG.SHEET_NAMES[key];
    var columns = COLUMNS[key];
    if (!columns) continue;
    
    var sheet = ss.getSheetByName(sheetName);
    if (sheet) {
      report.sheetsExisting.push(sheetName);
    } else {
      sheet = ss.insertSheet(sheetName);
      sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
      sheet.getRange(1, 1, 1, columns.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
      report.sheetsCreated.push(sheetName);
    }
  }
  
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }
  
  Logger.log('Database initialization complete');
  Logger.log(JSON.stringify(report, null, 2));
  return report;
}