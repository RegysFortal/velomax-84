
import { useState, useEffect } from "react";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export interface SettingsPermissions {
  system: boolean;
  company: boolean;
  users: boolean;
  backup: boolean;
}

export function useSettingsPermissions(user: User | null) {
  const [settingsPermissions, setSettingsPermissions] = useState<SettingsPermissions>({
    system: false,
    company: false,
    users: false,
    backup: false
  });
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  
  // Fetch settings permissions from Supabase
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
            backup: true
          });
          setIsLoadingPermissions(false);
          return;
        } else if (user.role === 'manager') {
          setSettingsPermissions({
            system: false,
            company: false,
            users: false,
            backup: true
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
            backupAccess
          ] = await Promise.all([
            supabase.rpc('user_has_system_settings_access'),
            supabase.rpc('user_has_company_settings_access'),
            supabase.rpc('user_has_user_management_access'),
            supabase.rpc('user_has_backup_access')
          ]);
          
          // Check for errors in any of the requests
          const hasErrors = systemAccess.error || companyAccess.error || userAccess.error || backupAccess.error;
          
          if (hasErrors) {
            console.error("Error fetching settings permissions:", { 
              systemError: systemAccess.error, 
              companyError: companyAccess.error, 
              userError: userAccess.error, 
              backupError: backupAccess.error 
            });
            // Already set by role or defaults to false
          } else {
            setSettingsPermissions({
              system: !!systemAccess.data,
              company: !!companyAccess.data,
              users: !!userAccess.data,
              backup: !!backupAccess.data
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

  return { settingsPermissions, isLoadingPermissions };
}
