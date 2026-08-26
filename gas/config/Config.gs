var CONFIG = {
  SPREADSHEET_ID: '', // Will be set during deployment
  SHEET_NAMES: {
    COMPANIES: 'Companies',
    USERS: 'Users',
    STORES: 'Stores',
    CATEGORIES: 'Categories',
    PRODUCTS: 'Products',
    STOCK_TRANSACTIONS: 'Stock_Transactions',
    STOCK_TRANSFERS: 'Stock_Transfers',
    SUPPLIERS: 'Suppliers',
    PURCHASES: 'Purchases',
    AUDIT_LOGS: 'Audit_Logs',
    SETTINGS: 'Settings',
    SESSIONS: 'Sessions'
  },
  ROLES: {
    SUPER_ADMIN: 'SUPER_ADMIN',
    COMPANY_ADMIN: 'COMPANY_ADMIN',
    MANAGER: 'MANAGER',
    STAFF: 'STAFF',
    VIEWER: 'VIEWER'
  },
  TRANSACTION_TYPES: {
    IN: 'IN',
    OUT: 'OUT',
    ADJUSTMENT_IN: 'ADJUSTMENT_IN',
    ADJUSTMENT_OUT: 'ADJUSTMENT_OUT',
    TRANSFER_IN: 'TRANSFER_IN',
    TRANSFER_OUT: 'TRANSFER_OUT'
  },
  TRANSFER_STATUSES: {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
  },
  RECORD_STATUS: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
  },
  PLANS: {
    FREE: 'FREE',
    BASIC: 'BASIC',
    PRO: 'PRO'
  },
  SESSION_DURATION_HOURS: 24,
  DEFAULT_TIMEZONE: 'Asia/Dhaka',
  ITEMS_PER_PAGE: 50
};

var COLUMNS = {
  COMPANIES: ['company_id', 'company_name', 'owner_name', 'email', 'phone', 'address', 'plan', 'status', 'created_at', 'updated_at'],
  USERS: ['user_id', 'company_id', 'name', 'email', 'password_hash', 'phone', 'role', 'store_id', 'status', 'created_at', 'updated_at'],
  STORES: ['store_id', 'company_id', 'store_name', 'location', 'manager_id', 'status', 'created_at', 'updated_at'],
  CATEGORIES: ['category_id', 'company_id', 'category_name', 'description', 'status', 'created_at', 'updated_at'],
  PRODUCTS: ['product_id', 'company_id', 'category_id', 'product_name', 'sku', 'barcode', 'unit', 'minimum_stock', 'maximum_stock', 'purchase_price', 'selling_price', 'status', 'created_at', 'updated_at'],
  STOCK_TRANSACTIONS: ['transaction_id', 'company_id', 'store_id', 'product_id', 'type', 'quantity', 'user_id', 'purpose', 'reference_id', 'note', 'created_at'],
  STOCK_TRANSFERS: ['transfer_id', 'company_id', 'product_id', 'from_store_id', 'to_store_id', 'quantity', 'requested_by', 'approved_by', 'status', 'note', 'created_at', 'completed_at'],
  SUPPLIERS: ['supplier_id', 'company_id', 'supplier_name', 'phone', 'email', 'address', 'status', 'created_at', 'updated_at'],
  PURCHASES: ['purchase_id', 'company_id', 'store_id', 'supplier_id', 'product_id', 'quantity', 'unit_cost', 'total_cost', 'received_by', 'created_at'],
  AUDIT_LOGS: ['log_id', 'company_id', 'user_id', 'action', 'module', 'record_id', 'old_value', 'new_value', 'ip_or_session_reference', 'created_at'],
  SETTINGS: ['setting_id', 'company_id', 'setting_key', 'setting_value', 'created_at', 'updated_at'],
  SESSIONS: ['session_id', 'user_id', 'company_id', 'token', 'created_at', 'expires_at']
};