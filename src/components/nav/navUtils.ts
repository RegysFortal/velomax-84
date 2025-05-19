
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
  // For regular users, check their specific operational permissions
  if (!user) return false;
  
  if (user.role === 'admin' || user.role === 'manager') {
    return true;
  }
  
  return hasPermission('deliveries') || 
         hasPermission('shipments') || 
         hasPermission('shipmentReports') ||
         hasPermission('budgets') ||
         hasPermission('cities');
};

export const hasFinancialAccess = (
  user: User | null, 
  hasPermission: (permission: string) => boolean
): boolean => {
  // Restrict financial access to only admin and manager
  if (!user) return false;
  
  // Only admin and manager roles can access financial areas
  if (user.role !== 'admin' && user.role !== 'manager') {
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
  if (!user) return false;
  
  // Admin and manager have full access
  if (user.role === 'admin' || user.role === 'manager') {
    return true;
  }
  
  // For regular users, they can only access clients, employees, and contractors
  return hasPermission('clients') || 
         hasPermission('employees') || 
         hasPermission('contractors');
};

export const hasFleetAccess = (
  user: User | null, 
  hasPermission: (permission: string) => boolean
): boolean => {
  if (!user) return false;
  
  // Admin and manager have full access
  if (user.role === 'admin' || user.role === 'manager') {
    return true;
  }
  
  // For regular users, check their fleet-related permissions
  return hasPermission('vehicles') || 
         hasPermission('logbook') || 
         hasPermission('maintenance');
};

