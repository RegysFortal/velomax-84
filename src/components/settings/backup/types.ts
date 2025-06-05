
export interface BackupSelectionState {
  includeOperational: boolean;
  includeFinancial: boolean;
  includeFleet: boolean;
  includeInventory: boolean;
  includeSettings: boolean;
}

export interface BackupMetadata {
  createdAt: string;
  version: string;
  type: string;
  includes: string[];
  source?: string;
}

export interface BackupData extends Record<string, any> {
  _metadata: BackupMetadata;
  // localStorage data
  [key: `velomax_${string}`]: any;
  // Supabase data
  supabase_deliveries?: any[];
  supabase_shipments?: any[];
  supabase_shipment_documents?: any[];
  supabase_financial_reports?: any[];
  supabase_receivable_accounts?: any[];
  supabase_payable_accounts?: any[];
  supabase_vehicles?: any[];
  supabase_logbook_entries?: any[];
  supabase_fuel_records?: any[];
  supabase_maintenance_records?: any[];
  supabase_tire_maintenance_records?: any[];
  supabase_products?: any[];
  supabase_inventory_entries?: any[];
  supabase_inventory_exits?: any[];
  supabase_clients?: any[];
  supabase_employees?: any[];
  supabase_cities?: any[];
  supabase_price_tables?: any[];
  supabase_company_settings?: any[];
  supabase_system_settings?: any[];
  supabase_users?: any[];
}
