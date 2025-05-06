
import { useState, useCallback } from 'react';
import { PermissionLevel, User } from '@/types';
import { toast } from 'sonner';

export type PermissionsState = {
  permissions: Record<string, PermissionLevel>;
  isLoadingPermissions: boolean;
  permissionsInitialized: boolean;
}

export const usePermissions = (user: User | null, isCreating: boolean, currentRole?: string) => {
  const [permissions, setPermissions] = useState<Record<string, PermissionLevel>>(() => {
    // Initialize default permissions immediately
    console.log("Inicializando permissões durante montagem do hook");
    return getDefaultPermissions(currentRole || 'user', isCreating);
  });
  
  const [permissionsInitialized, setPermissionsInitialized] = useState(true);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  
  // Create all default permissions upfront
  const getDefaultPermissions = useCallback((role: string, isCreating: boolean): Record<string, PermissionLevel> => {
    const defaultPermission: PermissionLevel = {
      view: false,
      create: false,
      edit: false, 
      delete: false
    };
    
    // Base permissions map
    const basePermissions: Record<string, PermissionLevel> = {
      dashboard: { ...defaultPermission, view: true }, // Dashboard é sempre visível por padrão
      deliveries: { ...defaultPermission },
      shipments: { ...defaultPermission },
      shipmentReports: { ...defaultPermission },
      financialDashboard: { ...defaultPermission },
      reportsToClose: { ...defaultPermission },
      closing: { ...defaultPermission },
      cities: { ...defaultPermission },
      priceTables: { ...defaultPermission },
      receivableAccounts: { ...defaultPermission },
      payableAccounts: { ...defaultPermission },
      financialReports: { ...defaultPermission },
      vehicles: { ...defaultPermission },
      logbook: { ...defaultPermission },
      maintenance: { ...defaultPermission },
      products: { ...defaultPermission },
      inventoryEntries: { ...defaultPermission },
      inventoryExits: { ...defaultPermission },
      inventoryDashboard: { ...defaultPermission },
      system: { ...defaultPermission },
      company: { ...defaultPermission },
      users: { ...defaultPermission },
      backup: { ...defaultPermission },
      budgets: { ...defaultPermission },
    };

    // If it's an existing user, just return base permissions
    if (!isCreating && user?.permissions) {
      return user.permissions as Record<string, PermissionLevel>;
    }

    // For new users, apply role-based initial permissions
    if (role === 'admin') {
      // Admin gets all permissions
      const adminPermissions: Record<string, PermissionLevel> = {};
      Object.keys(basePermissions).forEach(key => {
        adminPermissions[key] = {
          view: true,
          create: true,
          edit: true,
          delete: true
        };
      });
      return adminPermissions;
    } else if (role === 'manager') {
      // Manager gets specific permissions
      const managerPermissions = { ...basePermissions };
      ['dashboard', 'deliveries', 'shipments', 'shipmentReports', 'cities',
       'vehicles', 'logbook', 'maintenance', 'financialDashboard',
       'reportsToClose', 'closing', 'receivableAccounts', 'payableAccounts',
       'priceTables', 'financialReports', 'backup'].forEach(key => {
        if (managerPermissions[key]) {
          managerPermissions[key].view = true;
          managerPermissions[key].create = true;
          managerPermissions[key].edit = true;
          managerPermissions[key].delete = key !== 'backup'; // Gerentes não podem excluir backups
        }
      });
      return managerPermissions;
    } else {
      // User gets basic permissions
      const userPermissions = { ...basePermissions };
      ['dashboard', 'deliveries', 'shipments'].forEach(key => {
        if (userPermissions[key]) {
          userPermissions[key].view = true;
        }
      });
      return userPermissions;
    }
  }, []);

  // Handler for individual permission changes
  const handlePermissionChange = useCallback((name: string, level: keyof PermissionLevel, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        [level]: value
      }
    }));
  }, []);

  // Update permissions when role changes
  const updatePermissionsForRole = useCallback((role: string) => {
    console.log("Atualizando permissões baseado no papel:", role);
    if (role === 'admin') {
      const adminPermissions: Record<string, PermissionLevel> = {};
      Object.keys(permissions).forEach(key => {
        adminPermissions[key] = {
          view: true,
          create: true,
          edit: true,
          delete: true
        };
      });
      setPermissions(adminPermissions);
    }
  }, [permissions]);

  // Effect for role changes
  if (currentRole === 'admin' && Object.values(permissions).some(p => !p.view)) {
    // If role is admin but not all permissions are granted, update them
    updatePermissionsForRole('admin');
  }

  return {
    permissions,
    isLoadingPermissions,
    permissionsInitialized,
    handlePermissionChange,
    setPermissions,
  };
};
