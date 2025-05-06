
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { User } from "@/types";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { SettingsMenuItems } from "./management/SettingsMenuItems";
import { ManagementMenuItems } from "./management/ManagementMenuItems";
import { useManagementPermissions } from "./management/useManagementPermissions";
import { toast } from "sonner";

interface ManagementMenuProps {
  user: User | null;
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
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();
  const {
    settingsPermissions,
    isLoadingPermissions,
    hasSettingsAccess,
    hasManagementAccess
  } = useManagementPermissions(user, hasPermission);
  
  console.log("ManagementMenu rendered with permissions:", { settingsPermissions, hasSettingsAccess, hasManagementAccess });
  
  // If no user or still loading permissions, don't render the menu
  if (!user || isLoadingPermissions) {
    return null;
  }
  
  // If no permissions for anything, don't render the menu
  if (!hasPermission('admin') && !hasPermission('management') && !hasPermission('settings')) {
    return null;
  }
  
  // If no access to any section, don't render the menu
  if (!hasSettingsAccess && !hasManagementAccess) {
    return null;
  }

  const handleSettingsClick = () => {
    console.log("Settings clicked, navigating to /settings");
    // Navigating directly to settings before showing the menu
    navigate('/settings');
    
    // If there's an onOpenChange handler, call it
    if (onOpenChange) {
      onOpenChange();
    }
    
    // Notify user of successful navigation
    toast.success("Navegado para configurações", {
      description: "Página de configurações do sistema."
    });
  };

  return (
    <NavigationMenuItem className={isMobile ? "w-full" : ""}>
      <NavigationMenuTrigger 
        className={isMobile ? "w-full justify-start" : ""}
        onClick={handleSettingsClick}
      >
        <Settings className="mr-2 h-4 w-4" />
        Configurações
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ScrollArea className={`${isMobile ? "h-[200px] w-full" : "h-[300px] w-[400px]"}`}>
          <div className="grid gap-3 p-4">
            <SettingsMenuItems location={location} hasSettingsAccess={hasSettingsAccess} />
            <ManagementMenuItems location={location} hasPermission={hasPermission} />
          </div>
        </ScrollArea>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
