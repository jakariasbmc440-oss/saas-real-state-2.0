var Validator = {
  required: function(value, fieldName) {
    if (value === undefined || value === null || value === '') {
      return fieldName + ' is required';
    }
    return null;
  },
  positiveNumber: function(value, fieldName) {
    if (isNaN(value) || Number(value) <= 0) {
      return fieldName + ' must be a positive number';
    }
    return null;
  },
  nonNegativeNumber: function(value, fieldName) {
    if (isNaN(value) || Number(value) < 0) {
      return fieldName + ' must be a non-negative number';
    }
    return null;
  },
  email: function(value) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      return 'Invalid email format';
    }
    return null;
  },
  oneOf: function(value, allowedValues, fieldName) {
    if (allowedValues.indexOf(value) === -1) {
      return fieldName + ' must be one of: ' + allowedValues.join(', ');
    }
    return null;
  },
  maxLength: function(value, max, fieldName) {
    if (value && String(value).length > max) {
      return fieldName + ' must not exceed ' + max + ' characters';
    }
    return null;
  },
  validateAll: function(rules) {
    var errors = [];
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      var err = rule.fn.apply(this, rule.args);
      if (err) errors.push(err);
    }
    return errors;
  }
};