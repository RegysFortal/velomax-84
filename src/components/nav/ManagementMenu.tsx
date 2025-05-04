
import React from "react";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings } from "lucide-react";
import { User as UserType } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSettingsPermissions } from "./hooks/useSettingsPermissions";
import { SettingsLinks } from "./settings/SettingsLinks";
import { ManagementLinks } from "./management/ManagementLinks";

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
  const { isMobile } = useIsMobile();
  const { settingsPermissions, isLoadingPermissions } = useSettingsPermissions(user);

  // If no user or still loading permissions, don't render the menu
  if (!user || isLoadingPermissions) {
    return null;
  }
  
  // If no permissions for anything, don't render the menu
  if (!hasPermission('admin') && !hasPermission('management')) {
    return null;
  }
  
  // Check if user has access to any management feature
  const hasManagementAccess = hasPermission('employees') || hasPermission('clients');
  const hasNotificationsPermission = hasPermission('notifications');
  
  // If no access to any section, don't render the menu
  const hasAnyAccess = 
    settingsPermissions.system || 
    settingsPermissions.company || 
    settingsPermissions.users || 
    settingsPermissions.backup || 
    hasNotificationsPermission ||
    hasManagementAccess;
    
  if (!hasAnyAccess) {
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
            <SettingsLinks 
              settingsPermissions={settingsPermissions}
              hasNotificationsPermission={hasNotificationsPermission}
            />
            
            <ManagementLinks 
              hasManagementAccess={hasPermission('management')}
              hasEmployeesPermission={hasPermission('employees')}
              hasClientsPermission={hasPermission('clients')}
            />
          </div>
        </ScrollArea>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
