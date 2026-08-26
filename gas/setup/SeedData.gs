function seedDemoData() {
  var cId = 'CMP-DEMO-001';
  CompanyRepository.create({
    company_id: cId, company_name: 'Demo Trading Ltd.', owner_name: 'Admin User',
    email: 'admin@demo.com', plan: 'PRO', status: 'ACTIVE', created_at: DateUtils.now(), updated_at: DateUtils.now()
  });

  var pwd = Auth.hashPassword('demo123');
  UserRepository.create({user_id: 'USR-DEMO-001', company_id: cId, name: 'Admin', email: 'admin@demo.com', password_hash: pwd, role: 'COMPANY_ADMIN', status: 'ACTIVE', created_at: DateUtils.now(), updated_at: DateUtils.now()});
  UserRepository.create({user_id: 'USR-DEMO-002', company_id: cId, name: 'Rahim Khan', email: 'manager@demo.com', password_hash: pwd, role: 'MANAGER', status: 'ACTIVE', created_at: DateUtils.now(), updated_at: DateUtils.now()});
  UserRepository.create({user_id: 'USR-DEMO-003', company_id: cId, name: 'Karim Ahmed', email: 'staff@demo.com', password_hash: pwd, role: 'STAFF', store_id: 'STR-DEMO-001', status: 'ACTIVE', created_at: DateUtils.now(), updated_at: DateUtils.now()});
  UserRepository.create({user_id: 'USR-DEMO-004', company_id: cId, name: 'Sara Begum', email: 'viewer@demo.com', password_hash: pwd, role: 'VIEWER', status: 'ACTIVE', created_at: DateUtils.now(), updated_at: DateUtils.now()});

  StoreRepository.create({store_id: 'STR-DEMO-001', company_id: cId, store_name: 'Main Store', location: 'Dhaka, Motijheel', status: 'ACTIVE', created_at: DateUtils.now(), updated_at: DateUtils.now()});
  StoreRepository.create({store_id: 'STR-DEMO-002', company_id: cId, store_name: 'Warehouse', location: 'Dhaka, Uttara', status: 'ACTIVE', created_at: DateUtils.now(), updated_at: DateUtils.now()});

  var cats = [
    {id: 'CAT-DEMO-001', name: 'Electronics'},
    {id: 'CAT-DEMO-002', name: 'Accessories'},
    {id: 'CAT-DEMO-003', name: 'Furniture'},
    {id: 'CAT-DEMO-004', name: 'Cables'},
    {id: 'CAT-DEMO-005', name: 'Peripherals'}
  ];
  cats.forEach(function(c) { CategoryRepository.create({category_id: c.id, company_id: cId, category_name: c.name, status: 'ACTIVE', created_at: DateUtils.now(), updated_at: DateUtils.now()}); });

  var prods = [
    {id: 'PRD-DEMO-001', sku: 'WM-001', name: 'Wireless Mouse', cat: 'CAT-DEMO-001', min: 20, max: 200, buy: 350, sell: 550},
    {id: 'PRD-DEMO-002', sku: 'KB-001', name: 'Keyboard', cat: 'CAT-DEMO-005', min: 15, max: 150, buy: 800, sell: 1200},
    {id: 'PRD-DEMO-003', sku: 'UC-001', name: 'USB Cable', cat: 'CAT-DEMO-004', min: 50, max: 500, buy: 50, sell: 120},
    {id: 'PRD-DEMO-004', sku: 'MN-001', name: 'Monitor', cat: 'CAT-DEMO-001', min: 20, max: 50, buy: 12000, sell: 15000},
    {id: 'PRD-DEMO-005', sku: 'OC-001', name: 'Office Chair', cat: 'CAT-DEMO-003', min: 10, max: 30, buy: 5000, sell: 7500}
  ];
  prods.forEach(function(p) { ProductRepository.create({product_id: p.id, company_id: cId, category_id: p.cat, product_name: p.name, sku: p.sku, unit: 'Piece', minimum_stock: p.min, maximum_stock: p.max, purchase_price: p.buy, selling_price: p.sell, status: 'ACTIVE', created_at: DateUtils.now(), updated_at: DateUtils.now()}); });

  SupplierRepository.create({supplier_id: 'SUP-DEMO-001', company_id: cId, supplier_name: 'Tech Supplies Ltd.', status: 'ACTIVE', created_at: DateUtils.now(), updated_at: DateUtils.now()});
  SupplierRepository.create({supplier_id: 'SUP-DEMO-002', company_id: cId, supplier_name: 'Office World', status: 'ACTIVE', created_at: DateUtils.now(), updated_at: DateUtils.now()});

  var txns = [
    {p: 'PRD-DEMO-001', q: 150, t: 'IN'},
    {p: 'PRD-DEMO-002', q: 80, t: 'IN'},
    {p: 'PRD-DEMO-003', q: 200, t: 'IN'},
    {p: 'PRD-DEMO-004', q: 15, t: 'IN'},
    {p: 'PRD-DEMO-005', q: 5, t: 'IN'}
  ];
  txns.forEach(function(t) {
    StockRepository.createTransaction({
      transaction_id: IdGenerator.generate('TXN'), company_id: cId, store_id: 'STR-DEMO-001',
      product_id: t.p, type: t.t, quantity: t.q, user_id: 'USR-DEMO-001', purpose: 'INITIAL', note: 'Seed data', created_at: DateUtils.now()
    });
  });

  SettingsRepository.set(cId, 'allow_negative_stock', 'false');
  SettingsRepository.set(cId, 'default_timezone', 'Asia/Dhaka');
  SettingsRepository.set(cId, 'currency', 'BDT');

  Logger.log('Demo data seeded successfully.');
}

function clearDemoData() {
  Logger.log('Clear demo data not fully implemented in script.');
}