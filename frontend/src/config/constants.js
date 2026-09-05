export const APP_NAME = 'StoreIQ';
export const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbzr2D9CMDMLGowjWnLEwjXTIP6oGtHDgr5mBimXW_m5kdKF13kjPTU912bs3t8bicJG/exec';

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
  VIEWER: 'VIEWER'
};

export const TRANSACTION_TYPES = {
  IN: 'IN',
  OUT: 'OUT',
  ADJUSTMENT_IN: 'ADJUSTMENT_IN',
  ADJUSTMENT_OUT: 'ADJUSTMENT_OUT',
  TRANSFER_IN: 'TRANSFER_IN',
  TRANSFER_OUT: 'TRANSFER_OUT'
};

export const TRANSFER_STATUSES = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const DEFAULT_TIMEZONE = 'Asia/Dhaka';

export const getLowStockThreshold = (minimum_stock) => minimum_stock || 10;
