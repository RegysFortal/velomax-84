
import { useEffect, useState } from "react";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export interface SettingsPermissions {
  system: boolean;
  company: boolean;
  users: boolean;
  backup: boolean;
  clients: boolean;
  employees: boolean;
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
    employees: false
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
            employees: true
          });
          setIsLoadingPermissions(false);
          return;
        } else if (user.role === 'manager') {
          setSettingsPermissions({
            system: false,
            company: false,
            users: false,
            backup: true,
            clients: true,
            employees: true
          });
          setIsLoadingPermissions(false);
          return;
        }
        
        // Only try Supabase RPCs if we didn't set permissions by role
        try {
          const [
            systemAccess, 
            companyAccess, 
            userAccess, 
            backupAccess,
            clientsAccess,
            employeesAccess
          ] = await Promise.all([
            supabase.rpc('user_has_system_settings_access'),
            supabase.rpc('user_has_company_settings_access'),
            supabase.rpc('user_has_user_management_access'),
            supabase.rpc('user_has_backup_access'),
            supabase.rpc('user_has_clients_access'),
            supabase.rpc('user_has_employees_access')
          ]);
          
          // Check for errors in any of the requests
          const hasErrors = systemAccess.error || companyAccess.error || 
                            userAccess.error || backupAccess.error || 
                            clientsAccess.error || employeesAccess.error;
          
          if (hasErrors) {
            console.error("Error fetching settings permissions:", { 
              systemError: systemAccess.error, 
              companyError: companyAccess.error, 
              userError: userAccess.error, 
              backupError: backupAccess.error,
              clientsError: clientsAccess.error,
              employeesError: employeesAccess.error
            });
            // Already set by role or defaults to false
          } else {
            setSettingsPermissions({
              system: !!systemAccess.data,
              company: !!companyAccess.data,
              users: !!userAccess.data,
              backup: !!backupAccess.data,
              clients: !!clientsAccess.data,
              employees: !!employeesAccess.data
            });
          }
        } catch (error) {
          console.error("Error checking settings permissions:", error);
          // Already set by role or defaults to false
        }
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
                           hasPermission('notifications');
  
  const hasManagementAccess = hasPermission('employees') || 
                             hasPermission('clients');

  return {
    settingsPermissions,
    isLoadingPermissions,
    hasSettingsAccess,
    hasManagementAccess
  };
}
