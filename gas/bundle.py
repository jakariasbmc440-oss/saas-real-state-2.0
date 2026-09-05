import os

base_dir = r"d:\Zakariya\zakarias-best\real-state\saas\gas"
spreadsheet_id = '1xUiF2JWqy1kPRDYuzo3P3o8uZAbjS3yDP6MMucCm4w'

order = [
    'config/Config.gs',
    'utils/IdGenerator.gs',
    'utils/DateUtils.gs',
    'utils/ResponseHelper.gs',
    'utils/Validator.gs',
    'repositories/BaseRepository.gs',
    'repositories/CompanyRepository.gs',
    'repositories/UserRepository.gs',
    'repositories/ProductRepository.gs',
    'repositories/StockRepository.gs',
    'repositories/StoreRepository.gs',
    'repositories/CategoryRepository.gs',
    'repositories/SupplierRepository.gs',
    'repositories/PurchaseRepository.gs',
    'repositories/TransferRepository.gs',
    'repositories/AuditRepository.gs',
    'repositories/SettingsRepository.gs',
    'middleware/Auth.gs',
    'middleware/Permissions.gs',
    'services/AuthService.gs',
    'services/StockService.gs',
    'services/TransferService.gs',
    'services/ReportService.gs',
    'services/DashboardService.gs',
    'controllers/AuthController.gs',
    'controllers/ProductController.gs',
    'controllers/CategoryController.gs',
    'controllers/StockController.gs',
    'controllers/TransferController.gs',
    'controllers/StoreController.gs',
    'controllers/UserController.gs',
    'controllers/SupplierController.gs',
    'controllers/ReportController.gs',
    'controllers/AuditController.gs',
    'controllers/SettingsController.gs',
    'controllers/DashboardController.gs',
    'Router.gs',
    'main.gs'
]

combined = []
for rel_path in order:
    full_path = os.path.join(base_dir, rel_path.replace('/', os.sep))
    if os.path.exists(full_path):
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if "SPREADSHEET_ID: ''" in content:
                content = content.replace("SPREADSHEET_ID: ''", f"SPREADSHEET_ID: '{spreadsheet_id}'")
            combined.append(f"// --- {rel_path} ---\n" + content)

bundle_path = os.path.join(base_dir, 'Complete_Backend_Bundle.gs')
with open(bundle_path, 'w', encoding='utf-8') as f:
    f.write('\n\n'.join(combined))

print(f"Successfully generated {bundle_path}. Size: {os.path.getsize(bundle_path)} bytes")
