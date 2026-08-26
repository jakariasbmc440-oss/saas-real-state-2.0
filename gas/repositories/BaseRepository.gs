var BaseRepository = {
  _getSheet: function(sheetName) {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error('Sheet not found: ' + sheetName);
    return sheet;
  },
  
  _getHeaders: function(sheet) {
    return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  },
  
  _rowToObject: function(headers, row) {
    var obj = {};
    for (var i = 0; i < headers.length; i++) {
      obj[headers[i]] = row[i] !== undefined ? row[i] : '';
    }
    return obj;
  },
  
  _objectToRow: function(headers, obj) {
    return headers.map(function(h) { return obj[h] !== undefined ? obj[h] : ''; });
  },
  
  getAll: function(sheetName, companyId, filters) {
    var sheet = this._getSheet(sheetName);
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    if (values.length <= 1) return { data: [], total: 0, page: 1, limit: 50 };
    
    var headers = values[0];
    var results = [];
    
    for (var i = 1; i < values.length; i++) {
      var row = this._rowToObject(headers, values[i]);
      if (companyId && row.company_id && row.company_id !== companyId) continue;
      
      var match = true;
      if (filters) {
        for (var k in filters) {
          if (k === '_page' || k === '_limit' || k === '_search' || k === '_searchFields') continue;
          if (row[k] !== filters[k]) {
            match = false;
            break;
          }
        }
      }
      
      if (match) results.push(row);
    }
    
    return { data: results, total: results.length, page: 1, limit: results.length };
  },
  
  getById: function(sheetName, idColumn, id, companyId) {
    var sheet = this._getSheet(sheetName);
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    if (values.length <= 1) return null;
    
    var headers = values[0];
    var idIndex = headers.indexOf(idColumn);
    if (idIndex === -1) return null;
    
    for (var i = 1; i < values.length; i++) {
      if (values[i][idIndex] === id) {
        var row = this._rowToObject(headers, values[i]);
        if (companyId && row.company_id && row.company_id !== companyId) return null;
        return row;
      }
    }
    return null;
  },
  
  create: function(sheetName, data, columns) {
    var sheet = this._getSheet(sheetName);
    var rowData = this._objectToRow(columns, data);
    sheet.appendRow(rowData);
    return data;
  },
  
  update: function(sheetName, idColumn, id, updates, companyId) {
    var sheet = this._getSheet(sheetName);
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    if (values.length <= 1) return null;
    
    var headers = values[0];
    var idIndex = headers.indexOf(idColumn);
    
    for (var i = 1; i < values.length; i++) {
      if (values[i][idIndex] === id) {
        var row = this._rowToObject(headers, values[i]);
        if (companyId && row.company_id && row.company_id !== companyId) return null;
        
        for (var k in updates) {
          row[k] = updates[k];
        }
        
        var newRowValues = this._objectToRow(headers, row);
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([newRowValues]);
        return row;
      }
    }
    return null;
  },
  
  findWhere: function(sheetName, conditions, companyId) {
    var sheet = this._getSheet(sheetName);
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    if (values.length <= 1) return [];
    
    var headers = values[0];
    var results = [];
    
    for (var i = 1; i < values.length; i++) {
      var row = this._rowToObject(headers, values[i]);
      if (companyId && row.company_id && row.company_id !== companyId) continue;
      
      var match = true;
      for (var k in conditions) {
        if (conditions[k] === null) continue;
        if (row[k] !== conditions[k]) {
          match = false;
          break;
        }
      }
      
      if (match) results.push(row);
    }
    return results;
  },
  
  count: function(sheetName, companyId, conditions) {
    return this.findWhere(sheetName, conditions, companyId).length;
  }
};