
import { User } from "@/types";

export const getActiveClass = (currentPath: string, path: string) => {
  return currentPath === path
    ? "text-primary"
    : "text-muted-foreground";
};

export const checkPermissionAccess = (
  user: User | null,
  hasPermission: (permission: string) => boolean,
  role: string
) => {
  if (role === 'admin' && user?.role === 'admin') {
    return true;
  }
  
  if (role === 'manager' && (user?.role === 'admin' || user?.role === 'manager')) {
    return true;
  }
  
  if (role === 'user') {
    return true;
  }
  
  return false;
};

export const hasOperationalAccess = (
  user: User | null, 
  hasPermission: (permission: string) => boolean
): boolean => {
  return checkPermissionAccess(user, hasPermission, 'user');
};

export const hasFinancialAccess = (
  user: User | null, 
  hasPermission: (permission: string) => boolean
): boolean => {
  return checkPermissionAccess(user, hasPermission, 'manager');
};

export const hasManagementAccess = (
  user: User | null, 
  hasPermission: (permission: string) => boolean
): boolean => {
  return checkPermissionAccess(user, hasPermission, 'manager') || user?.role === 'admin';
};
