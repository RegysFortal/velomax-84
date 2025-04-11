
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
  return checkPermissionAccess(user, hasPermission, 'financial') || 
         checkPermissionAccess(user, hasPermission, 'reports') || 
         checkPermissionAccess(user, hasPermission, 'priceTables');
};

export const hasManagementAccess = (
  user: User | null, 
  hasPermission: (permission: string) => boolean
): boolean => {
  return checkPermissionAccess(user, hasPermission, 'dashboard') || 
         checkPermissionAccess(user, hasPermission, 'logbook') || 
         checkPermissionAccess(user, hasPermission, 'clients') || 
         checkPermissionAccess(user, hasPermission, 'employees') || 
         checkPermissionAccess(user, hasPermission, 'vehicles') || 
         checkPermissionAccess(user, hasPermission, 'maintenance') || 
         checkPermissionAccess(user, hasPermission, 'settings');
};
