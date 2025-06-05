
export const DATA_CATEGORIES = {
  operational: ['deliveries', 'shipments', 'supabase_deliveries', 'supabase_shipments', 'supabase_shipment_documents'],
  financial: ['financial_reports', 'receivable_accounts', 'payable_accounts', 'supabase_financial_reports', 'supabase_receivable_accounts', 'supabase_payable_accounts'],
  fleet: ['vehicles', 'logbook_entries', 'fuel_records', 'maintenance_records', 'tire_maintenance_records', 'supabase_vehicles', 'supabase_logbook_entries', 'supabase_fuel_records', 'supabase_maintenance_records', 'supabase_tire_maintenance_records'],
  inventory: ['products', 'inventory_entries', 'inventory_exits', 'supabase_products', 'supabase_inventory_entries', 'supabase_inventory_exits'],
  settings: ['clients', 'employees', 'cities', 'price_tables', 'company_settings', 'system_settings', 'users', 'supabase_clients', 'supabase_employees', 'supabase_cities', 'supabase_price_tables', 'supabase_company_settings', 'supabase_system_settings', 'supabase_users']
} as const;

export const MENU_LABELS = {
  operational: 'operacional',
  financial: 'financeiro',
  fleet: 'frota',
  inventory: 'estoque',
  settings: 'configurações'
} as const;

// Mapeamento de chaves do localStorage para categorias
export const LOCALSTORAGE_KEY_MAPPING = {
  'velomax_deliveries': 'operational',
  'velomax_shipments': 'operational',
  'velomax_cities': 'settings',
  'velomax_price_tables': 'settings',
  'velomax_clients': 'settings',
  'velomax_employees': 'settings',
  'velomax_financial_reports': 'financial',
  'velomax_receivable_accounts': 'financial',
  'velomax_payable_accounts': 'financial',
  'velomax_vehicles': 'fleet',
  'velomax_logbook_entries': 'fleet',
  'velomax_fuel_records': 'fleet',
  'velomax_maintenance_records': 'fleet',
  'velomax_tire_maintenance_records': 'fleet',
  'velomax_products': 'inventory',
  'velomax_inventory_entries': 'inventory',
  'velomax_inventory_exits': 'inventory',
  'velomax_company_settings': 'settings',
  'velomax_system_settings': 'settings',
  'velomax_users': 'settings'
} as const;
