
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import { getActiveClass } from "../navUtils";
import { SettingsPermissions } from "../hooks/useSettingsPermissions";

interface SettingsLinksProps {
  settingsPermissions: SettingsPermissions;
  hasNotificationsPermission: boolean;
}

export function SettingsLinks({ settingsPermissions, hasNotificationsPermission }: SettingsLinksProps) {
  const location = useLocation();
  
  // If no access to any settings, don't render anything
  const hasSettingsAccess = settingsPermissions.system || 
                           settingsPermissions.company || 
                           settingsPermissions.users || 
                           settingsPermissions.backup || 
                           hasNotificationsPermission;
  
  if (!hasSettingsAccess) {
    return null;
  }
  
  return (
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
  );
}
