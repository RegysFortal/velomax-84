
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Settings, Building2, Database } from "lucide-react";
import { getActiveClass } from "../navUtils";
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth/AuthContext';

interface SettingsMenuItemsProps {
  location: { pathname: string };
  hasSettingsAccess: boolean;
}

export function SettingsMenuItems({ location, hasSettingsAccess }: SettingsMenuItemsProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  if (!hasSettingsAccess) return null;
  
  // Only admin can see system and company settings
  const isAdmin = user?.role === 'admin';
  
  // Only admin and manager can see backup settings
  const canAccessBackup = user?.role === 'admin' || user?.role === 'manager';
  
  const handleSettingsClick = (tab: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    // Check permissions before navigating
    if ((tab === 'system' || tab === 'company') && !isAdmin) {
      toast.error("Acesso restrito", {
        description: "Apenas administradores podem acessar esta seção."
      });
      return;
    }
    
    if (tab === 'backup' && !canAccessBackup) {
      toast.error("Acesso restrito", {
        description: "Apenas administradores e gerentes podem acessar esta seção."
      });
      return;
    }
    
    console.log(`Navigating to settings with tab: ${tab}`);
    navigate(`/settings?tab=${tab}`);
  };
  
  return (
    <>
      <div className="font-medium text-sm mb-1 text-muted-foreground">Configurações do Sistema</div>
      
      {isAdmin && (
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
      )}
      
      {isAdmin && (
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
      )}
      
      {canAccessBackup && (
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
      )}
    </>
  );
}
