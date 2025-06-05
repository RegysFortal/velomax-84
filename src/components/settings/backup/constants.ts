
export const DATA_CATEGORIES = {
  operational: ['deliveries', 'shipments'],
  financial: ['financial_reports', 'receivable_accounts', 'payable_accounts'],
  fleet: ['vehicles', 'logbook_entries', 'fuel_records', 'maintenance_records', 'tire_maintenance_records'],
  inventory: ['products', 'inventory_entries', 'inventory_exits'],
  settings: ['clients', 'employees', 'cities', 'price_tables', 'company_settings', 'system_settings', 'users']
} as const;

export const MENU_LABELS = {
  operational: 'operacional',
  financial: 'financeiro',
  fleet: 'frota',
  inventory: 'estoque',
  settings: 'configurações'
} as const;
