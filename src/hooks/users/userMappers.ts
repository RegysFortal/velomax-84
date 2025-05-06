
import { User } from '@/types';

/**
 * Mapeia um usuário do Supabase para nosso tipo User
 */
export const mapSupabaseUserToAppUser = (supabaseUser: any): User => {
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
    // Mapeie as permissões do objeto permissions do banco para o nosso formato
    permissions: supabaseUser.permissions ? {
      deliveries: supabaseUser.permissions.deliveries || false,
      shipments: supabaseUser.permissions.shipments || false,
      clients: supabaseUser.permissions.clients || false,
      cities: supabaseUser.permissions.cities || false,
      reports: supabaseUser.permissions.reports || false,
      financial: supabaseUser.permissions.financial || false,
      priceTables: supabaseUser.permissions.price_tables || false,
      dashboard: supabaseUser.permissions.dashboard || true,
      logbook: supabaseUser.permissions.logbook || false,
      employees: supabaseUser.permissions.employees || false,
      vehicles: supabaseUser.permissions.vehicles || false,
      maintenance: supabaseUser.permissions.maintenance || false,
      settings: supabaseUser.permissions.settings || false,
    } : {
      deliveries: false,
      shipments: false,
      clients: false,
      cities: false,
      reports: false,
      financial: false,
      priceTables: false,
      dashboard: true,
      logbook: false,
      employees: false,
      vehicles: false,
      maintenance: false,
      settings: false,
    }
  };
};
