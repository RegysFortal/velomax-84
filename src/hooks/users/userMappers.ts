
import { User, PermissionLevel } from '@/types';

// Função auxiliar para criar um objeto PermissionLevel a partir de um valor booleano
const createPermissionLevel = (value: boolean = false): PermissionLevel => ({
  view: value,
  create: value,
  edit: value,
  delete: value
});

/**
 * Mapeia um usuário do Supabase para nosso tipo User
 */
export const mapSupabaseUserToAppUser = (supabaseUser: any): User => {
  // Map de nomes de permissões no banco para os nomes na aplicação
  const permissionMapping: Record<string, string> = {
    price_tables: 'priceTables',
    shipment_reports: 'shipmentReports',
    financial_dashboard: 'financialDashboard',
    reports_to_close: 'reportsToClose',
    receivable_accounts: 'receivableAccounts',
    payable_accounts: 'payableAccounts',
    financial_reports: 'financialReports',
    inventory_entries: 'inventoryEntries',
    inventory_exits: 'inventoryExits',
    inventory_dashboard: 'inventoryDashboard',
    budgets: 'budgets' // Added budgets mapping
  };

  // Função para mapear permissões
  const mapPermissions = (dbPermissions: any) => {
    if (!dbPermissions) return undefined;
    
    const permissions: Record<string, PermissionLevel> = {};
    
    // Processar cada permissão do banco
    if (dbPermissions) {
      Object.entries(dbPermissions).forEach(([key, value]) => {
        // Converter nome da permissão do formato snake_case para camelCase se necessário
        const permKey = permissionMapping[key] || key;
        
        if (typeof value === 'boolean') {
          // Formato antigo: converte para o novo formato
          permissions[permKey] = createPermissionLevel(value as boolean);
        } else if (typeof value === 'object' && value !== null) {
          // Já está no novo formato com níveis
          const permValue = value as any;
          permissions[permKey] = {
            view: Boolean(permValue.view),
            create: Boolean(permValue.create),
            edit: Boolean(permValue.edit),
            delete: Boolean(permValue.delete)
          };
        }
      });
    }
    
    // Garantir que dashboard seja sempre visível por padrão
    if (!permissions.dashboard) {
      permissions.dashboard = { view: true, create: false, edit: false, delete: false };
    }
    
    return permissions;
  };

  return {
    id: supabaseUser.id,
    name: supabaseUser.name || '',
    username: supabaseUser.username || '',
    email: supabaseUser.email || '',
    role: supabaseUser.role || 'user',
    department: supabaseUser.department || '',
    position: supabaseUser.position || '',
    phone: supabaseUser.phone || '',
    createdAt: supabaseUser.created_at,
    updatedAt: supabaseUser.updated_at,
    // Mapeia as permissões do objeto permissions do banco para o nosso formato
    permissions: mapPermissions(supabaseUser.permissions)
  };
};

/**
 * Mapeia um usuário da aplicação para o formato do Supabase
 */
export const mapAppUserToSupabase = (appUser: Partial<User>): any => {
  // Map de nomes de permissões na aplicação para os nomes no banco
  const permissionMapping: Record<string, string> = {
    priceTables: 'price_tables',
    shipmentReports: 'shipment_reports',
    financialDashboard: 'financial_dashboard',
    reportsToClose: 'reports_to_close',
    receivableAccounts: 'receivable_accounts',
    payableAccounts: 'payable_accounts',
    financialReports: 'financial_reports',
    inventoryEntries: 'inventory_entries',
    inventoryExits: 'inventory_exits',
    inventoryDashboard: 'inventory_dashboard',
    budgets: 'budgets' // Added budgets mapping
  };

  // Função para mapear permissões
  const mapPermissions = (appPermissions: Record<string, PermissionLevel> | undefined) => {
    if (!appPermissions) return undefined;
    
    const permissions: Record<string, any> = {};
    
    // Processar cada permissão da aplicação
    Object.entries(appPermissions).forEach(([key, value]) => {
      // Converter nome da permissão do formato camelCase para snake_case se necessário
      const permKey = permissionMapping[key] || key;
      
      // Salvar no formato de níveis detalhados
      permissions[permKey] = value;
    });
    
    return permissions;
  };

  return {
    name: appUser.name,
    username: appUser.username,
    email: appUser.email,
    role: appUser.role,
    department: appUser.department,
    position: appUser.position,
    phone: appUser.phone,
    // Converte camelCase para snake_case onde necessário
    permissions: mapPermissions(appUser.permissions as Record<string, PermissionLevel>),
    updated_at: appUser.updatedAt || new Date().toISOString()
  };
};
