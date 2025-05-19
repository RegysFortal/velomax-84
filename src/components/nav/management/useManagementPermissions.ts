
import { useEffect, useState } from "react";
import { User } from "@/types";

export interface SettingsPermissions {
  system: boolean;
  company: boolean;
  users: boolean;
  backup: boolean;
  clients: boolean;
  employees: boolean;
  contractors: boolean;
}

export function useManagementPermissions(
  user: User | null,
  hasPermission: (permission: string) => boolean
) {
  const [settingsPermissions, setSettingsPermissions] = useState<SettingsPermissions>({
    system: false,
    company: false,
    users: false,
    backup: false,
    clients: false,
    employees: false,
    contractors: false
  });
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  useEffect(() => {
    const fetchSettingsPermissions = async () => {
      if (!user) {
        setIsLoadingPermissions(false);
        return;
      }

      try {
        setIsLoadingPermissions(true);
        
        // First set permissions based on role for reliability
        if (user.role === 'admin') {
          setSettingsPermissions({
            system: true,
            company: true,
            users: true,
            backup: true,
            clients: true,
            employees: true,
            contractors: true
          });
        } else if (user.role === 'manager') {
          setSettingsPermissions({
            system: false,
            company: false,
            users: false,
            backup: true,
            clients: true,
            employees: true,
            contractors: true
          });
        } else {
          // Regular user permissions based on the new rules
          setSettingsPermissions({
            system: false,
            company: false,
            users: false,
            backup: false,
            clients: true,
            employees: true,
            contractors: true
          });
        }
        
        // Check permissions from the user object directly
        if (user.permissions) {
          setSettingsPermissions(prev => ({
            ...prev,
            system: (user.role === 'admin') ? true : false,
            company: (user.role === 'admin') ? true : false,
            users: (user.role === 'admin') ? true : false,
            backup: (user.role === 'admin' || user.role === 'manager') ? true : false,
            clients: !!user.permissions.clients?.view || prev.clients,
            employees: !!user.permissions.employees?.view || prev.employees,
            contractors: !!user.permissions.contractors?.view || prev.contractors
          }));
        }
        
      } catch (error) {
        console.error("Error checking settings permissions:", error);
        // Already set by role or defaults to false
      } finally {
        setIsLoadingPermissions(false);
      }
    };
    
    fetchSettingsPermissions();
  }, [user]);

  // Check if user has access to any settings or management feature
  const hasSettingsAccess = settingsPermissions.system || 
                           settingsPermissions.company || 
                           settingsPermissions.users || 
                           settingsPermissions.backup || 
                           settingsPermissions.clients ||
                           settingsPermissions.employees ||
                           settingsPermissions.contractors;
  
  const hasManagementAccess = (user?.role === 'admin' || user?.role === 'manager') ||
                             hasPermission('clients') || 
                             hasPermission('employees') ||
                             hasPermission('contractors');

  return {
    settingsPermissions,
    isLoadingPermissions,
    hasSettingsAccess,
    hasManagementAccess
  };
}
