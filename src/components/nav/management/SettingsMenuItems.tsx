
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Settings, Building2, Users, Database } from "lucide-react";
import { getActiveClass } from "../navUtils";
import { toast } from "sonner";

interface SettingsMenuItemsProps {
  location: { pathname: string };
  hasSettingsAccess: boolean;
}

export function SettingsMenuItems({ location, hasSettingsAccess }: SettingsMenuItemsProps) {
  const navigate = useNavigate();
  
  if (!hasSettingsAccess) return null;
  
  const handleSettingsClick = (tab: string, event: React.MouseEvent) => {
    event.preventDefault();
    console.log(`Navigating to settings with tab: ${tab}`);
    navigate(`/settings?tab=${tab}`);
  };
  
  return (
    <>
      <div className="font-medium text-sm mb-1 text-muted-foreground">Configurações do Sistema</div>
      
      <Link
        to="/settings?tab=system"
        className={cn(
          "flex items-center p-2 rounded-md hover:bg-accent",
          getActiveClass(location.pathname, "/settings")
        )}
        onClick={(e) => handleSettingsClick('system', e)}
      >
        <Settings className="mr-2 h-4 w-4" />
        Sistema
      </Link>
      
      <Link
        to="/settings?tab=company"
        className={cn(
          "flex items-center p-2 rounded-md hover:bg-accent",
          getActiveClass(location.pathname, "/settings")
        )}
        onClick={(e) => handleSettingsClick('company', e)}
      >
        <Building2 className="mr-2 h-4 w-4" />
        Empresa
      </Link>
      
      <Link
        to="/settings?tab=users"
        className={cn(
          "flex items-center p-2 rounded-md hover:bg-accent",
          getActiveClass(location.pathname, "/settings")
        )}
        onClick={(e) => handleSettingsClick('users', e)}
      >
        <Users className="mr-2 h-4 w-4" />
        Usuários
      </Link>
      
      <Link
        to="/settings?tab=backup"
        className={cn(
          "flex items-center p-2 rounded-md hover:bg-accent",
          getActiveClass(location.pathname, "/settings")
        )}
        onClick={(e) => handleSettingsClick('backup', e)}
      >
        <Database className="mr-2 h-4 w-4" />
        Backup
      </Link>
    </>
  );
}
