export const isRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') return `${fieldName} is required`;
  return null;
};

export const isEmail = (value) => {
  const re = /^\S+@\S+\.\S+$/;
  if (!re.test(value)) return 'Invalid email address';
  return null;
};

export const isPositiveNumber = (value, fieldName) => {
  if (Number(value) <= 0) return `${fieldName} must be greater than 0`;
  return null;
};

export const isNonNegativeNumber = (value, fieldName) => {
  if (Number(value) < 0) return `${fieldName} cannot be negative`;
  return null;
};

export const minLength = (value, min, fieldName) => {
  if (value && value.length < min) return `${fieldName} must be at least ${min} characters`;
  return null;
};

export const validateProductForm = (data) => {
  const errors = {};
  if (isRequired(data.name, 'Name')) errors.name = isRequired(data.name, 'Name');
  if (isPositiveNumber(data.price, 'Price')) errors.price = isPositiveNumber(data.price, 'Price');
  return errors;
};

export const validateStockForm = (data) => {
  const errors = {};
  if (isRequired(data.productId, 'Product')) errors.productId = isRequired(data.productId, 'Product');
  if (isPositiveNumber(data.quantity, 'Quantity')) errors.quantity = isPositiveNumber(data.quantity, 'Quantity');
  return errors;
};

export const validateTransferForm = (data) => {
  const errors = {};
  if (isRequired(data.fromStore, 'Source Store')) errors.fromStore = isRequired(data.fromStore, 'Source Store');
  if (isRequired(data.toStore, 'Destination Store')) errors.toStore = isRequired(data.toStore, 'Destination Store');
  if (data.fromStore === data.toStore) errors.toStore = 'Cannot transfer to the same store';
  return errors;
};
