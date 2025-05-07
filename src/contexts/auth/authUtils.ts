
import { User, PermissionLevel } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Default permission level
export const defaultPermissionLevel = (): PermissionLevel => ({
  view: false,
  create: false,
  edit: false,
  delete: false
});

// Full permission level
export const fullPermissionLevel = (): PermissionLevel => ({
  view: true,
  create: true,
  edit: true,
  delete: true
});

export const createDefaultAdminUser = (): User => {
  return {
    id: uuidv4(),
    name: 'Administrador',
    username: 'admin',
    email: 'admin@velomax.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: {
      dashboard: fullPermissionLevel(),
      deliveries: fullPermissionLevel(),
      shipments: fullPermissionLevel(),
      clients: fullPermissionLevel(),
      cities: fullPermissionLevel(),
      reports: fullPermissionLevel(),
      financial: fullPermissionLevel(),
      priceTables: fullPermissionLevel(),
      logbook: fullPermissionLevel(),
      employees: fullPermissionLevel(),
      vehicles: fullPermissionLevel(),
      maintenance: fullPermissionLevel(),
      settings: fullPermissionLevel(),
      budgets: fullPermissionLevel()
    }
  };
};

export const createUserPermissions = (role: 'admin' | 'manager' | 'user') => {
  let permissions: Record<string, PermissionLevel> = {
    dashboard: defaultPermissionLevel(),
    deliveries: defaultPermissionLevel(),
    shipments: defaultPermissionLevel(),
    clients: defaultPermissionLevel(),
    cities: defaultPermissionLevel(),
    reports: defaultPermissionLevel(),
    financial: defaultPermissionLevel(),
    priceTables: defaultPermissionLevel(),
    logbook: defaultPermissionLevel(),
    employees: defaultPermissionLevel(),
    vehicles: defaultPermissionLevel(),
    maintenance: defaultPermissionLevel(),
    settings: defaultPermissionLevel(),
    budgets: defaultPermissionLevel()
  };

  if (role === 'admin') {
    Object.keys(permissions).forEach(key => {
      permissions[key as keyof typeof permissions] = fullPermissionLevel();
    });
  } 
  else if (role === 'manager') {
    const viewCreateEditPermissions = ['dashboard', 'deliveries', 'shipments', 'clients', 
      'cities', 'reports', 'vehicles', 'maintenance', 'priceTables', 'budgets'];
    
    viewCreateEditPermissions.forEach(key => {
      permissions[key] = {
        view: true,
        create: true,
        edit: true,
        delete: true
      };
    });
    
    // For financial operations, managers can view but not delete
    ['financial', 'logbook', 'employees'].forEach(key => {
      permissions[key] = {
        view: true,
        create: true,
        edit: true,
        delete: false
      };
    });
  } 
  else if (role === 'user') {
    // Users can only view certain things
    ['dashboard', 'deliveries', 'shipments', 'reports', 'budgets'].forEach(key => {
      permissions[key] = {
        view: true,
        create: false,
        edit: false,
        delete: false
      };
    });
  }

  return permissions;
};

export const logUserActivity = (
  user: User | null,
  action: string,
  entityType: string,
  entityId: string = '',
  entityName: string = '',
  details: string = ''
) => {
  if (!user) return;
  
  try {
    const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    const newLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      action,
      entityType,
      entityId,
      entityName,
      details
    };
    logs.push(newLog);
    localStorage.setItem('activity_logs', JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

// Utility function to check permissions
export const hasPermission = (user: User | null, feature: string, level: keyof PermissionLevel = 'view'): boolean => {
  // Admins always have all permissions
  if (user?.role === 'admin') return true;
  
  // If user doesn't exist or doesn't have permissions, deny
  if (!user || !user.permissions) return false;
  
  // Check if the feature is in the user's permissions
  const permission = user.permissions[feature];
  
  // If permission doesn't exist, deny
  if (!permission) return false;
  
  // Check if permission is a boolean (old format) or an object (new format)
  if (typeof permission === 'boolean') {
    return permission;
  }
  
  // Return the specific level of permission
  return permission[level] || false;
};
