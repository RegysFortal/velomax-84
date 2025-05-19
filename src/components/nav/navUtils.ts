
import { User } from "@/types";

export const getActiveClass = (currentPath: string, path: string) => {
  return currentPath === path
    ? "text-primary"
    : "text-muted-foreground";
};

export const checkPermissionAccess = (
  user: User | null,
  hasPermission: (permission: string) => boolean,
  permission: string
) => {
  if (!user) return false;
  
  // Admin users have access to everything
  if (user.role === 'admin') {
    return true;
  }
  
  // Manager users have access to their permitted areas
  if (user.role === 'manager') {
    return hasPermission(permission);
  }
  
  // Regular users only have access to their specific permissions
  return hasPermission(permission);
};

export const hasOperationalAccess = (
  user: User | null, 
  hasPermission: (permission: string) => boolean
): boolean => {
  return checkPermissionAccess(user, hasPermission, 'deliveries') || 
         checkPermissionAccess(user, hasPermission, 'shipments') || 
         checkPermissionAccess(user, hasPermission, 'reports');
};

export const hasFinancialAccess = (
  user: User | null, 
  hasPermission: (permission: string) => boolean
): boolean => {
  // Limite o acesso financeiro a apenas admin e manager
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return false;
  }
  
  return checkPermissionAccess(user, hasPermission, 'financialDashboard') || 
         checkPermissionAccess(user, hasPermission, 'financialReports') || 
         checkPermissionAccess(user, hasPermission, 'priceTables') ||
         checkPermissionAccess(user, hasPermission, 'cities');
};

export const hasManagementAccess = (
  user: User | null, 
  hasPermission: (permission: string) => boolean
): boolean => {
  return checkPermissionAccess(user, hasPermission, 'clients') || 
         checkPermissionAccess(user, hasPermission, 'employees') || 
         checkPermissionAccess(user, hasPermission, 'settings');
};

export const hasFleetAccess = (
  user: User | null, 
  hasPermission: (permission: string) => boolean
): boolean => {
  return checkPermissionAccess(user, hasPermission, 'logbook') || 
         checkPermissionAccess(user, hasPermission, 'vehicles') || 
         checkPermissionAccess(user, hasPermission, 'maintenance');
};
