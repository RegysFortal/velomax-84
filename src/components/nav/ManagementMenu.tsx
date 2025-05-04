
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings, Users, Building2, User } from "lucide-react";
import { User as UserType } from "@/types";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getActiveClass } from "./navUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

interface ManagementMenuProps {
  user: UserType | null;
  hasPermission: (permission: string) => boolean;
  open?: boolean;
  onOpenChange?: () => void;
}

export const ManagementMenu: React.FC<ManagementMenuProps> = ({ 
  user, 
  hasPermission,
  open,
  onOpenChange
}) => {
  const location = useLocation();
  const { isMobile } = useIsMobile();
  const [settingsPermissions, setSettingsPermissions] = useState({
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

  // If no user or still loading permissions, don't render the menu
  if (!user || isLoadingPermissions) {
    return null;
  }
  
  // If no permissions for anything, don't render the menu
  if (!hasPermission('admin') && !hasPermission('management')) {
    return null;
  }
  
  // Check if user has access to any settings or management feature
  const hasSettingsAccess = settingsPermissions.system || 
                           settingsPermissions.company || 
                           settingsPermissions.users || 
                           settingsPermissions.backup || 
                           hasPermission('notifications');
  
  const hasManagementAccess = hasPermission('employees') || 
                             hasPermission('clients');

  // If no access to any section, don't render the menu
  if (!hasSettingsAccess && !hasManagementAccess) {
    return null;
  }

  return (
    <NavigationMenuItem className={isMobile ? "w-full" : ""}>
      <NavigationMenuTrigger 
        className={isMobile ? "w-full justify-start" : ""}
        onClick={onOpenChange}
      >
        <Settings className="mr-2 h-4 w-4" />
        Configurações
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ScrollArea className={`${isMobile ? "h-[200px] w-full" : "h-[300px] w-[400px]"}`}>
          <div className="grid gap-3 p-4">
            {hasSettingsAccess && (
              <Link
                to="/settings"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/settings")
                )}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configuração de Sistema
              </Link>
            )}
            {hasPermission('management') && (
              <>
                {hasPermission('employees') && (
                  <Link
                    to="/employees"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass(location.pathname, "/employees")
                    )}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Funcionários
                  </Link>
                )}
                {hasPermission('employees') && (
                  <Link
                    to="/contractors"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass(location.pathname, "/contractors")
                    )}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Terceiros
                  </Link>
                )}
                {hasPermission('clients') && (
                  <Link
                    to="/clients"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass(location.pathname, "/clients")
                    )}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Clientes
                  </Link>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
